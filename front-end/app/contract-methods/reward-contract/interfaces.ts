import { TransactionSigner } from "algosdk";

export interface CreateProposalParams {
    title: string;
    description: string;
    proposerAddress: string;
    expiresIn: number;
    transactionSigner: TransactionSigner;
    assetId: number;
    amount: number;
    votePrice: number;
}

export interface VoteOnProposalParams {
    proposalId: number;
    voterAddress: string;
    vote: boolean;
    transactionSigner: TransactionSigner;
    assetId: number;
    amount: number;
}

export interface ClaimRewardsParams {
    proposalId: number;
    voterAddress: string;
    transactionSigner: TransactionSigner;
}
