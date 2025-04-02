import { arc4 } from '@algorandfoundation/algorand-typescript'

// Define your ProposalIdType as a UintN64 for numeric IDs
export type ProposalIdType = arc4.UintN64

export class ProposalDataType extends arc4.Struct<{
  proposal_title: arc4.Str
  proposal_description: arc4.Str
  proposal_expiry_timestamp: arc4.UintN64
  proposal_start_timestamp: arc4.UintN64
  proposal_total_votes: arc4.UintN64
  proposal_yes_votes: arc4.UintN64
}> {}

// Define your ProposalIdType as a UintN64 for numeric IDs
export class VoteIdType extends arc4.Struct<{ proposal_id: arc4.UintN64; voter_address: arc4.Address }> {}

export class VoteDataType extends arc4.Struct<{
  vote_timestamp: arc4.UintN64
}> {}
