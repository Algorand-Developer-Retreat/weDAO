import { Proposal } from "../interfaces/proposals";

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard = ({
  proposal
}: ProposalCardProps) => {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-md text-text max-w-xl w-full">
      {/* Title + Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-heading text-xl font-bold">{proposal.title}</h3>
          <p className="text-sm text-text/80">{proposal.description}</p>
        </div>
        <span className={`text-background text-xs font-bold px-2 py-1 rounded-full ${proposal.status === "active" ? "bg-primary" : "bg-secondary"}`}>
          {proposal.status}
        </span>
      </div>

      {/* Vote Bars */}
      <div className="space-y-2 mt-3">
        {/* YES */}
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-yes">Yes</span>
          <span className="text-yes">{proposal.votesFor}%</span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="bg-yes h-full"
            style={{ width: `${proposal.votesFor}%` }}
          ></div>
        </div>

        {/* NO */}
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-no">No</span>
          <span className="text-no">{proposal.votesAgainst}%</span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="bg-no h-full"
            style={{ width: `${proposal.votesAgainst}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      {proposal.status === "active" ? (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-text/60">Ends at {new Date(proposal.endDate).toLocaleDateString()}</p>
        
        
        <button className="bg-vote text-white text-sm font-medium px-4 py-1.5 rounded-full hover:opacity-90 transition">
          Vote
        </button>
      </div>
      ) : (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-text/60">Ended at {new Date(proposal.endDate).toLocaleDateString()}</p>
          
        </div>
      )}
    </div>
  );
};
