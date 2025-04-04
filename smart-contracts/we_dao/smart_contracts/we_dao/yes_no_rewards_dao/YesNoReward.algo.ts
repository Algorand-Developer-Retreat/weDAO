/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  Account,
  arc4,
  assert,
  BoxMap,
  Contract,
  GlobalState,
  gtxn,
  itxn,
  op,
  Txn,
  uint64,
  Uint64,
} from '@algorandfoundation/algorand-typescript'
import { abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { ProposalDataType, ProposalIdType, VoteIdType, VoteDataType } from './config.algo'

export class YesNoReward extends Contract {
  //Define the manager of the contract
  manager_address = GlobalState<Account>()

  //Keeps track of the number of created proposals within this contract
  proposal_count = GlobalState<uint64>()

  //Keeps track if this contract will enable anyone to create proposals
  anyone_can_create = GlobalState<boolean>()

  //Define the proposal boxes - use a string for keyPrefix instead of empty Bytes()
  proposal = BoxMap<ProposalIdType, ProposalDataType>({ keyPrefix: '_p' })

  // Define the vote boxes - use a string for keyPrefix
  vote = BoxMap<VoteIdType, VoteDataType>({ keyPrefix: '_v' })

  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(anyone_can_create: boolean): void {
    // When creating the application we set the manager address
    this.manager_address.value = Txn.sender

    // Set the total proposals within this contract to 0
    this.proposal_count.value = 0

    // Set the anyone_can_create value
    this.anyone_can_create.value = anyone_can_create
  }

  @abimethod({ allowActions: 'NoOp' })
  public configureContract(anyone_can_create: boolean): void {
    // Only the manager can configure the contract
    assert(this.manager_address.value === Txn.sender, 'Only the manager can configure the contract')
    // Set the anyone_can_create value
    this.anyone_can_create.value = anyone_can_create
    
  }

  @abimethod({ allowActions: 'NoOp' })
  public optInToAsset(assetId: uint64): void {
    itxn
      .assetTransfer({
        assetReceiver: op.Global.currentApplicationAddress,
        sender: op.Global.currentApplicationAddress,
        xferAsset: assetId,
        assetAmount: 0,
        fee: 0,
      })
      .submit()
  }

  @abimethod({ allowActions: 'NoOp' })
  public createProposal(
    proposal_title: string,
    proposal_description: string,
    expires_in: uint64,
    fund_pool_txn: gtxn.AssetTransferTxn,
    vote_price: uint64,
    mbr_txn: gtxn.PaymentTxn,
  ): void {
    if (this.anyone_can_create.value === false) {
      assert(this.manager_address.value === Txn.sender, 'Only the manager can create proposals')
    }
    assert(mbr_txn.receiver === op.Global.currentApplicationAddress, 'Payment must be to the contract')

    // assert(fundPoolTxn.assetAmount > 0, 'The fund pool transaction must have a positive asset amount')

    const assetId: uint64 = fund_pool_txn.xferAsset.id
    const initialPrizePool: uint64 = fund_pool_txn.assetAmount

    // Gets the timestamp of the current transaction to be used as the proposal start timestamp
    const currentTimestamp: uint64 = op.Global.latestTimestamp

    const proposal_start_timestamp: uint64 = currentTimestamp

    //Uses the current transaction timestamp and adds the expires_in value to it to get the proposal expiry timestamp
    const proposal_expiry_timestamp: uint64 = currentTimestamp + expires_in

    const proposal: ProposalDataType = new ProposalDataType({
      proposal_expiry_timestamp: new arc4.UintN64(proposal_expiry_timestamp),
      proposal_start_timestamp: new arc4.UintN64(proposal_start_timestamp),
      proposal_total_votes: new arc4.UintN64(0),
      proposal_yes_votes: new arc4.UintN64(0),
      proposal_asset: new arc4.UintN64(assetId),
      proposal_prize_pool: new arc4.UintN64(initialPrizePool),
      vote_price: new arc4.UintN64(vote_price),
      proposal_creator: new arc4.Address(Txn.sender),
      proposal_title_and_description: new arc4.Str(proposal_title + ':' + proposal_description),
    })

    //Define the nonce for the proposal by adding one to the total proposals global state
    const newProposalNonce = Uint64(this.proposal_count.value + 1)

    // Check if the proposal already exists
    assert(!this.proposal(new arc4.UintN64(newProposalNonce)).exists, 'Proposal already exists')

    // Increment the proposal count
    this.proposal_count.value = newProposalNonce

    //Store the proposal in the box storage using the nonce as key
    this.proposal(new arc4.UintN64(newProposalNonce)).value = proposal.copy()
  }

  @abimethod({ allowActions: 'NoOp' })
  public voteProposal(
    proposal_id: uint64,
    vote: boolean,
    mbr_txn: gtxn.PaymentTxn,
    fundVoteTxn: gtxn.AssetTransferTxn,
  ): void {
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

    //  Check if the fundVoteTxn is equal the vote price
    assert(
      fundVoteTxn.assetAmount === currentProposal.vote_price.native,
      'The fund vote transaction must be equal to the vote price',
    )

    //Check if the receiver of the fund vote transaction is the contract address
    assert(
      fundVoteTxn.assetReceiver === op.Global.currentApplicationAddress,
      'The fund vote transaction must be to the contract',
    )

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
      claimed: new arc4.Bool(false),
    })

    // !!! Kinda liked it now because it enforces best practices
    // Update the proposal's vote count
    const updatedVotes = Uint64(currentProposal.proposal_total_votes.native + 1)
    const updatedYesVotes = Uint64(currentProposal.proposal_yes_votes.native + (vote ? 1 : 0))
    const updatedPrizePool = Uint64(currentProposal.proposal_prize_pool.native + fundVoteTxn.assetAmount)

    // Create an updated proposal with the new vote count, yes votes, and prize pool
    const updatedProposal = currentProposal.copy()
    updatedProposal.proposal_total_votes = new arc4.UintN64(updatedVotes)
    updatedProposal.proposal_yes_votes = new arc4.UintN64(updatedYesVotes)
    updatedProposal.proposal_prize_pool = new arc4.UintN64(updatedPrizePool)
    // Store the vote in box storage
    this.vote(voteId).value = voteData.copy()
    // Store the updated proposal back in the box
    this.proposal(new arc4.UintN64(proposal_id)).value = updatedProposal.copy()
  }

  // Add a helper method to check if a user has voted
  private hasVoted(proposal_id: uint64, voter: Account): boolean {
    const voteId = new VoteIdType({
      proposal_id: new arc4.UintN64(proposal_id),
      voter_address: new arc4.Address(voter),
    })

    return this.vote(voteId).exists
  }

  // Method for voters to claim participation rewards
  public claimParticipationReward(proposal_id: uint64): void {
    // !!! I think having to use copy made it more confusing than tealscript
    // !!! I think having to instantiate arc4.Class makes it more complex than tealscript

    const currentProposal = this.proposal(new arc4.UintN64(proposal_id)).value.copy()

    // !!! I like the op.Global object better than tealscript Globals
    // Check if the proposal is expired
    assert(
      currentProposal.proposal_expiry_timestamp.native <= op.Global.latestTimestamp,
      'The proposal has not expired yet',
    )

    //Check if the user actually voted on the proposal
    assert(
      this.hasVoted(proposal_id, Txn.sender),
      'The user has not voted on this proposal, therefore cannot claim rewards',
    )

    //Define the reward amount based on the proposal's prize pool and total votes
    const rewardAmount = Uint64(
      currentProposal.proposal_prize_pool.native / currentProposal.proposal_total_votes.native,
    )

    // !!! I don't like the .submit() too much
    //Transfer the reward to the voter address
    itxn
      .assetTransfer({
        assetReceiver: Txn.sender,
        sender: op.Global.currentApplicationAddress,
        xferAsset: currentProposal.proposal_asset.native,
        assetAmount: rewardAmount,
        fee: 0,
      })
      .submit()

    // Create an updated proposal with the new vote count, yes votes, and prize pool
    const updatedProposal = currentProposal.copy()
    updatedProposal.proposal_prize_pool = new arc4.UintN64(updatedProposal.proposal_prize_pool.native - rewardAmount)

    this.proposal(new arc4.UintN64(proposal_id)).value = updatedProposal.copy()
  }

  @abimethod({ allowActions: 'NoOp', readonly: true })
  public getProposal(proposal_id: uint64): ProposalDataType {
    const proposal: ProposalDataType = this.proposal(new arc4.UintN64(proposal_id)).value.copy()
    return proposal
  }
}
