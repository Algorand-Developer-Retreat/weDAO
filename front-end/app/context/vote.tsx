/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { Proposal } from "../interfaces/proposals";

interface VoteContextType {
  allProposals: Proposal[];
  activeProposals: Proposal[];
  setActiveProposals: (proposals: Proposal[]) => void;
  setAllProposals: (proposals: Proposal[]) => void;
  createProposal: (proposal: Proposal) => void;
  vote: (proposalId: number, vote: boolean) => void;
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
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  const createProposal = (proposal: Proposal) => {
    console.log("Creating proposal:", proposal);
  };

  const vote = (proposalId: number, vote: boolean) => {
    console.log("Voting for proposal:", proposalId, "with vote:", vote);
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
