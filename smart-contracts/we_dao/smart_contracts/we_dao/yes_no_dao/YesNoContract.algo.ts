import {
  Account,
  arc4,
  assert,
  BoxMap,
  Contract,
  GlobalState,
  gtxn,
  op,
  Txn,
  uint64,
  Uint64,
} from '@algorandfoundation/algorand-typescript'
import { abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { ProposalDataType, ProposalIdType, VoteDataType, VoteIdType } from './config.algo'

export class YesNoDao extends Contract {
  // Define the manager of the contract
  manager_address = GlobalState<Account>()

  // Keeps track of the number of created proposals within this contract
  proposal_count = GlobalState<uint64>()

  // Keeps track if this contract will enable anyone to create proposals
  anyone_can_create = GlobalState<boolean>()

  // Define the proposal boxes - use a string for keyPrefix
  proposal = BoxMap<ProposalIdType, ProposalDataType>({ keyPrefix: '_p' })

  // Define the vote boxes - use a string for keyPrefix
  vote = BoxMap<VoteIdType, VoteDataType>({ keyPrefix: '_v' })

  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(anyone_can_create: boolean): void {
    // When creating the application we set the manager address
    this.manager_address.value = Txn.sender

    // Set the total proposals within this contract to 0
    this.proposal_count.value = 0

    // Set if anyone or only the manager will be able to create a proposal
    this.anyone_can_create.value = anyone_can_create
  }

  @abimethod({ allowActions: 'NoOp' })
  public createProposal(
    proposal_title: string,
    proposal_description: string,
    expires_in: uint64,
    mbr_txn: gtxn.PaymentTxn,
  ): void {
    if (this.anyone_can_create.value === false) {
      assert(this.manager_address.value === Txn.sender, 'Only the manager can create proposals')
    }

    // Gets the timestamp of the current transaction to be used as the proposal start timestamp
    const currentTimestamp: uint64 = op.Global.latestTimestamp
    const proposal_start_timestamp: uint64 = currentTimestamp

    // Check if the MBR transaction is enough to cover the proposal box creation fee
    assert(mbr_txn.amount >= 14490, 'Payment must cover the box MBR')

    // Check if the receiver of the MBR txn is the contract address
    assert(mbr_txn.receiver === op.Global.currentApplicationAddress, 'Payment must be to the contract')

    // Uses the current transaction timestamp and adds the expires_in value to get the proposal expiry timestamp
    const proposal_expiry_timestamp: uint64 = currentTimestamp + expires_in

    const proposal: ProposalDataType = new ProposalDataType({
      proposal_expiry_timestamp: new arc4.UintN64(proposal_expiry_timestamp),
      proposal_start_timestamp: new arc4.UintN64(proposal_start_timestamp),
      proposal_total_votes: new arc4.UintN64(0),
      proposal_yes_votes: new arc4.UintN64(0),
      proposal_title: new arc4.Str(proposal_title),
    })

    // Define the nonce for the proposal by adding one to the total proposals global state
    const newProposalNonce = Uint64(this.proposal_count.value + 1)

    // Check if the proposal already exists
    assert(!this.proposal(new arc4.UintN64(newProposalNonce)).exists, 'Proposal already exists')

    // Increment the proposal count
    this.proposal_count.value = newProposalNonce

    // Store the proposal in the box storage using the nonce as key
    this.proposal(new arc4.UintN64(newProposalNonce)).value = proposal.copy()
  }

  @abimethod({ allowActions: 'NoOp' })
  public voteProposal(proposal_id: uint64, vote: boolean, mbr_txn: gtxn.PaymentTxn): void {
    // Check if proposal exists
    assert(
      this.proposal(new arc4.UintN64(proposal_id)).exists,
      'The proposal the user is trying to vote on does not exist',
    )

    // Create the vote ID
    const voteId = new VoteIdType({
      proposal_id: new arc4.UintN64(proposal_id),
      voter_address: new arc4.Address(Txn.sender),
    })

    // Users can only vote once on a proposal
    assert(!this.vote(voteId).exists, 'The user has already voted on this proposal')

    // Get a copy of the current proposal
    const currentProposal: ProposalDataType = this.proposal(new arc4.UintN64(proposal_id)).value.copy()

    // Convert timestamp to uint64 for checking the proposal expiry
    const currentTime = op.Global.latestTimestamp
    const expiryTime = currentProposal.proposal_expiry_timestamp.native
    assert(currentTime < expiryTime, 'The proposal has expired')

    // Check if voter is not the manager address - manager cannot vote
    assert(Txn.sender !== this.manager_address.value, 'The manager cannot vote on proposals')

    // Check if the MBR transaction is enough to cover the vote box creation fee
    assert(mbr_txn.amount >= 14490, 'Payment must cover the vote box MBR')

    // Check if the receiver of the MBR txn is the contract address
    assert(mbr_txn.receiver === op.Global.currentApplicationAddress, 'Payment must be to the contract')

    // Create the vote record
    const voteData = new VoteDataType({
      vote_timestamp: new arc4.UintN64(currentTime),
    })

    // Update the proposal's vote count
    const updatedVotes = Uint64(currentProposal.proposal_total_votes.native + 1)
    const updatedYesVotes = Uint64(currentProposal.proposal_yes_votes.native + (vote ? 1 : 0))

    // Create an updated proposal with the new vote count
    const updatedProposal = currentProposal.copy()
    updatedProposal.proposal_total_votes = new arc4.UintN64(updatedVotes)
    updatedProposal.proposal_yes_votes = new arc4.UintN64(updatedYesVotes)

    // Store the vote in box storage
    this.vote(voteId).value = voteData.copy()
    // Store the updated proposal back in the box
    this.proposal(new arc4.UintN64(proposal_id)).value = updatedProposal.copy()
  }

  // Add a helper method to check if a user has voted
  @abimethod({ allowActions: 'NoOp', readonly: true })
  public hasVoted(proposal_id: uint64, voter: Account): boolean {
    const voteId = new VoteIdType({
      proposal_id: new arc4.UintN64(proposal_id),
      voter_address: new arc4.Address(voter),
    })

    return this.vote(voteId).exists
  }

  @abimethod({ allowActions: 'NoOp', readonly: true })
  public getProposal(proposal_id: uint64): ProposalDataType {
    const proposal: ProposalDataType = this.proposal(new arc4.UintN64(proposal_id)).value.copy()
    return proposal
  }



}
