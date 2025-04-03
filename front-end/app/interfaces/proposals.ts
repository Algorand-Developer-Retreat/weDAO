export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: "active" | "closed";
  expiresIn: number;
  votesFor: number;
  votesAgainst: number;
  proposalAsset: number;
  minimumHolding?: number;
  prizePool?: number;
  votePrice?: number;
  type: "reward" | "simple";
}
