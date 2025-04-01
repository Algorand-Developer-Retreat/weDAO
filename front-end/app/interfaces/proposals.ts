export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'pending' | 'completed';
  startDate: string;
  endDate: string;
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  category: string;
}