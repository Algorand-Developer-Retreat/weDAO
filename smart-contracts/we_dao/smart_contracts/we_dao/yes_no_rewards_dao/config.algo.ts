import { arc4 } from '@algorandfoundation/algorand-typescript'

export class ProposalDataType extends arc4.Struct<{
  proposal_expiry_timestamp: arc4.UintN64
  proposal_start_timestamp: arc4.UintN64
  proposal_total_votes: arc4.UintN64
  proposal_yes_votes: arc4.UintN64
  proposal_prize_pool: arc4.UintN64
  proposal_asset: arc4.UintN64
  vote_price: arc4.UintN64
  proposal_creator: arc4.Address
  proposal_title_and_description: arc4.Str
}> {}

// Define your ProposalIdType as a UintN64 for numeric IDs
export type ProposalIdType = arc4.UintN64

// Define ProposalIdType as a UintN64 for numeric IDs
export class VoteIdType extends arc4.Struct<{ proposal_id: arc4.UintN64; voter_address: arc4.Address }> {}

export class VoteDataType extends arc4.Struct<{
  vote_timestamp: arc4.UintN64
  claimed: arc4.Bool
}> {}
