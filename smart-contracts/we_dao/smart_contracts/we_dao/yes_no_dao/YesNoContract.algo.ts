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
import { ProposalDataType, ProposalIdType } from './config.algo'

export class WeDao extends Contract {
  //Define the manager of the contract
  manager_address = GlobalState<Account>()

  //Keeps track of the number of created proposals within this contract
  proposal_count = GlobalState<uint64>()

  //Keeps track if this contract will enable anyone to create proposals
  anyone_can_create = GlobalState<boolean>()

  //Define the proposal boxes - use a string for keyPrefix instead of empty Bytes()
  proposal = BoxMap<ProposalIdType, ProposalDataType>({ keyPrefix: '_p' })

  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(anyone_can_create: boolean): void {
    // When creating the application we set the manager address
    this.manager_address.value = Txn.sender

    //Set the total proposals within this contract to 0
    this.proposal_count.value = 0

    //Set if anyone r only the manager will e able to create a proposal
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

    //Uses the current transaction timestamp and adds the expires_in value to it to get the proposal expiry timestamp
    const proposal_expiry_timestamp: uint64 = currentTimestamp + expires_in

    const proposal: ProposalDataType = new ProposalDataType({
      proposal_title: new arc4.Str(proposal_title),
      proposal_description: new arc4.Str(proposal_description),
      proposal_expiry_timestamp: new arc4.UintN64(proposal_expiry_timestamp),
      proposal_start_timestamp: new arc4.UintN64(proposal_start_timestamp),
      proposal_total_votes: new arc4.UintN64(0),
      proposal_yes_votes: new arc4.UintN64(0),
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
  public voteProposal(proposal_id: uint64, vote: boolean, mbr_txn: gtxn.PaymentTxn): void {
    // Check if proposal exists - the current assertion is incorrect
    assert(
      this.proposal(new arc4.UintN64(proposal_id)).exists,
      'The proposal the user is trying to vote on does not exist',
    )

    // Get a copy of the current proposal
    const currentProposal: ProposalDataType = this.proposal(new arc4.UintN64(proposal_id)).value.copy()

    // Update the proposal's vote count
    // First, we need to ensure proposal_total_votes is part of your ProposalDataType struct
    // Then, we need to properly handle the uint64 arithmetic
    const updatedVotes = Uint64(currentProposal.proposal_total_votes.native + 1)

    assert(Txn.sender !== this.manager_address.value, 'The manager cannot vote on proposals')

    // Create an updated proposal with the new vote count
    const updatedProposal = currentProposal.copy()
    updatedProposal.proposal_total_votes = new arc4.UintN64(updatedVotes)
    updatedProposal.proposal_yes_votes = new arc4.UintN64(currentProposal.proposal_yes_votes.native + (vote ? 1 : 0))

    // Store the updated proposal back in the box
    this.proposal(new arc4.UintN64(proposal_id)).value = updatedProposal.copy()
  }
}
