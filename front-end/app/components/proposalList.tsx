import { Proposal } from "../interfaces/proposals";
import { ProposalCard } from "./proposalCard";

interface ProposalListProps {
  proposals: Proposal[];
  loadingProposals: boolean;
}

export function ProposalList({
  proposals,
  loadingProposals,
}: ProposalListProps) {
  console.log('proposals', proposals);
  return (
    <div>
      {proposals.length > 0 ? (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {proposals.map((proposal) => (

            <ProposalCard proposal={proposal} key={proposal.id + proposal.type} />
          ))}
        </div>
      ) : null}

      {proposals.length === 0 && !loadingProposals ? (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <h2 className="text-2xl font-bold text-center">No proposals found</h2>
          <p className="text-lg text-center">
            There are no proposals available at the moment. Please check back
            later.
          </p>
        </div>
      ) : null}

      {loadingProposals ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yes"></div>
        </div>
      ) : null}
    </div>
  );
}
