import { Proposal } from "../interfaces/proposals";
import { ProposalCard } from "./proposalCard";

interface ProposalListProps {
  proposals: Proposal[];
}

export function ProposalList({ proposals }: ProposalListProps) {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {proposals.length > 0 ? (
        proposals.map((proposal) => (
          <ProposalCard proposal={proposal} key={proposal.id} />
        ))
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg text-gray-500">No proposals available</p>
        </div>
      )}
    </div>
  );
}
