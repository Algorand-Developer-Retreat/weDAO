import { useContext } from "react";
import { Proposal } from "../interfaces/proposals";
import AnimButton from "./animButton";
import { VoteContext } from "../context/vote";
import { ellipseAddress } from "../utils";
import { useWallet } from "@txnlab/use-wallet-react";

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard = ({ proposal }: ProposalCardProps) => {
  const { setSelectedProposal, setDisplayVoteModal } = useContext(VoteContext);
  const { activeAccount } = useWallet();


  function onClickVote() {
    setSelectedProposal(proposal);
    setDisplayVoteModal(true);
    console.log("clicked vote");
  }

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-md text-text max-w-xl w-full">
      {/* Title + Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-heading text-xl font-display">
            {proposal.title}
          </h3>
          <p className="text-sm text-text/80 font-sans">
            {proposal.description}
          </p>
        </div>
        <div className="flex justify-end items-center">
          <span
            className={`${
              proposal.status === "active" ? "text-background" : "text-text"
            } text-xs font-bold px-2 py-1 rounded-full ${
              proposal.status === "active" ? "bg-primary" : "bg-secondary"
            }`}
          >
            {proposal.status}
          </span>
        </div>
      </div>

      {/* Vote Bars */}
      <div className="space-y-2 mt-3">
        {/* YES */}
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-yes">Yes</span>
          <span className="text-no">
            {Math.round(
              (proposal.votesFor /
                (proposal.votesFor + proposal.votesAgainst)) *
                100
            ) || 0}
            %
          </span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="bg-yes h-full"
            style={{
              width: `${
                Math.round(
                  (proposal.votesFor /
                    (proposal.votesFor + proposal.votesAgainst)) *
                    100
                ) || 0
              }%`,
            }}
          ></div>
        </div>

        {/* NO */}
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-no">No</span>
          <span className="text-no">
            {Math.round(
              (proposal.votesAgainst /
                (proposal.votesFor + proposal.votesAgainst)) *
                100
            ) || 0}
            %
          </span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="bg-no h-full"
            style={{
              width: `${
                Math.round(
                  (proposal.votesAgainst /
                    (proposal.votesFor + proposal.votesAgainst)) *
                    100
                ) || 0
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      {proposal.status === "active" ? (
        <div className="mt-4 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-text/60">
              Ends in{" "}
              {new Date(proposal.expiresIn + Date.now()).toLocaleDateString()}
            </p>
            <p className="text-xs text-text/60">
              Created by {ellipseAddress(proposal.proposer)}
            </p>
          </div>

          {activeAccount ? (
            <AnimButton onClick={() => onClickVote()}>Vote</AnimButton>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-text/60">Ended.</p>
        </div>
      )}
    </div>
  );
};
