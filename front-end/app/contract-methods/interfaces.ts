

export interface CreateProposalParams {
    title: string;
    description: string;
    proposerAddress: string;
    expiresIn: number;
}

export interface VoteOnProposalParams {
    proposalId: number;
    voterAddress: string;
    vote: boolean;
}