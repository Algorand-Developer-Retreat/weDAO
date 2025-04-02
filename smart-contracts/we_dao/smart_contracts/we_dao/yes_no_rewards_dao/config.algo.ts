import { arc4 } from '@algorandfoundation/algorand-typescript'

export class ProposalDataType extends arc4.Struct<{
  proposal_title: arc4.Str
  proposal_description: arc4.Str
  proposal_expiry_timestamp: arc4.UintN64
  proposal_start_timestamp: arc4.UintN64
  proposal_total_votes: arc4.UintN64
  proposal_yes_votes: arc4.UintN64
  proposal_prize_pool: arc4.UintN64
  proposal_asset: arc4.UintN64
  vote_price: arc4.UintN64
}> {}

// Define your ProposalIdType as a UintN64 for numeric IDs
export type ProposalIdType = arc4.UintN64
