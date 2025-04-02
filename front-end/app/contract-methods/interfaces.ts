import { TransactionSigner } from "algosdk";

export interface CreateProposalParams {
    title: string;
    description: string;
    proposerAddress: string;
    expiresIn: number;
    transactionSigner: TransactionSigner;
}

export interface VoteOnProposalParams {
    proposalId: number;
    voterAddress: string;
    vote: boolean;
    transactionSigner: TransactionSigner;
}