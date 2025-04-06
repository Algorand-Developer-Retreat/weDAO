/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { Proposal } from "../interfaces/proposals";
import { useWallet } from "@txnlab/use-wallet-react";
import { voteOnProposal } from "../contract-methods/holders-contract/user";
import { voteOnProposal as voteOnRewardProposal } from "../contract-methods/reward-contract/user";
import {
  createProposal as createProposalContract,
  getProposals,
} from "../contract-methods/holders-contract/proposals";

interface VoteContextType {
  allProposals: Proposal[];
  activeProposals: Proposal[];
  setActiveProposals: (proposals: Proposal[]) => void;
  setAllProposals: (proposals: Proposal[]) => void;
  createProposal: (proposal: Proposal) => void;
  vote: (
    proposalId: number,
    vote: boolean,
    rewardParams?: { assetId: number; amount: number }
  ) => Promise<void>;
  displayVoteModal: boolean;
  setDisplayVoteModal: (value: boolean) => void;
  selectedProposal: Proposal | null;
  setSelectedProposal: (proposal: Proposal | null) => void;
}

const VoteContext = createContext<VoteContextType>({} as VoteContextType);

const VoteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [displayVoteModal, setDisplayVoteModal] = useState<boolean>(false);
  const { activeAccount, transactionSigner } = useWallet();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  const createProposal = async (proposal: Proposal) => {
    try {
      await createProposalContract({
        title: proposal.title,
        description: proposal.description,
        proposerAddress: activeAccount?.address || "",
        expiresIn: proposal.expiresIn,
        transactionSigner: transactionSigner,
      }).then(() => {
        getProposals().then((proposals: Proposal[]) => {
          setAllProposals(proposals);
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const vote = async (
    proposalId: number,
    vote: boolean,
    rewardParams?: { assetId: number; amount: number }
  ): Promise<void> => {
    try {
      if (rewardParams) {
        // Use reward contract vote method
        await voteOnRewardProposal({
          proposalId,
          vote,
          voterAddress: activeAccount?.address || "",
          transactionSigner: transactionSigner,
          assetId: rewardParams.assetId,
          amount: rewardParams.amount,
        });
      } else {
        // Use simple contract vote method
        await voteOnProposal({
          proposalId,
          vote,
          voterAddress: activeAccount?.address || "",
          transactionSigner: transactionSigner,
        });
      }
      // Refresh proposals after voting
      const proposals = await getProposals();
      setAllProposals(proposals);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <VoteContext.Provider
      value={{
        allProposals,
        activeProposals,
        setActiveProposals,
        setAllProposals,
        createProposal,
        vote,
        displayVoteModal,
        setDisplayVoteModal,
        selectedProposal,
        setSelectedProposal,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};

export { VoteContext, VoteProvider };
