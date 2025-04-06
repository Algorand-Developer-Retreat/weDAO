/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { Proposal } from "../interfaces/proposals";
import AnimButton from "./animButton";
import { VoteContext } from "../context/vote";
import { ellipseAddress } from "../utils";
import { useWallet } from "@txnlab/use-wallet-react";
import { useAsaMetadata } from "../context/asametadata";
import { ProposalBadge } from "./proposalBadge";
import { getUserVotes as getUserVotesSimple } from "../contract-methods/holders-contract/user";
import {
  claimRewards,
  getUserVotes as getUserVotesReward,
} from "../contract-methods/reward-contract/user";
import { useToast } from "./toast";

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard = ({ proposal }: ProposalCardProps) => {
  const { setSelectedProposal, setDisplayVoteModal, displayVoteModal } =
    useContext(VoteContext);
  const [proposalAsset, setProposalAsset] = useState<any>();
  const { activeAccount, transactionSigner } = useWallet();
  const { getAssetById } = useAsaMetadata();
  const [userHasVoted, setUserHasVoted] = useState<boolean>(false);
  const [userClaimedRewards, setUserClaimedRewards] = useState<boolean>(false);
  const [countdown, setCountdown] = useState("");
  const [loadingProposal, setLoadingProposal] = useState<boolean>(true);
  const [votesFor, setVotesFor] = useState<number>(0);
  const [votesAgainst, setVotesAgainst] = useState<number>(0);

  const { showToast } = useToast();

  function onClickVote() {
    setSelectedProposal(proposal);
    setDisplayVoteModal(true);
    console.log("clicked vote");
  }

  const getProposalAssetData = async () => {
    const asset = getAssetById(proposal.proposalAsset);
    if (asset) {
      setProposalAsset(asset);
      console.log("asset", asset);
    } else {
      console.error("Asset not found");
    }
  };

  const getUserVoteData = async () => {
    console.log("proposal", proposal);
    if (proposal.type === "simple") {
      const voteInfo = await getUserVotesSimple(
        activeAccount?.address ?? "",
        proposal.id
      );
      if (voteInfo.voteTimestamp && voteInfo.voteTimestamp > 0n) {
        setUserHasVoted(true);
      } else {
        setUserHasVoted(false);
      }
    } else if (proposal.type === "reward") {
      const voteInfo = await getUserVotesReward(
        activeAccount?.address ?? "",
        proposal.id
      );
      if (voteInfo.voteTimestamp && voteInfo.voteTimestamp > 0n) {
        setUserHasVoted(true);
      } else {
        setUserHasVoted(false);
      }

      if (voteInfo.claimedRewards && voteInfo.claimedRewards > 0n) {
        setUserClaimedRewards(true);
      } else {
        setUserClaimedRewards(false);
      }
    }
  };

  useEffect(() => {
    setLoadingProposal(true);
    getProposalAssetData();
    getUserVoteData();
    setLoadingProposal(false);

    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000); // current time in seconds
      const remaining = proposal.expiresIn - now;

      if (remaining <= 0) {
        setCountdown("Expired");
        return;
      }

      const months = Math.floor(remaining / (30 * 24 * 3600));
      const weeks = Math.floor(
        (remaining % (30 * 24 * 3600)) / (7 * 24 * 3600)
      );
      const days = Math.floor((remaining % (7 * 24 * 3600)) / (24 * 3600));
      const hours = Math.floor((remaining % (24 * 3600)) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      const parts = [];
      if (months > 0) parts.push(`${months}mo`);
      if (weeks > 0) parts.push(`${weeks}w`);
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

      setCountdown(parts.join(" "));
    };

    updateCountdown(); // initial render
    const interval = setInterval(updateCountdown, 1000); // every 1s

    return () => clearInterval(interval); // clean up on unmount
  }, [proposal, displayVoteModal, activeAccount]);

  async function onClickClaim(): Promise<void> {
    await claimRewards({
      proposalId: proposal.id,
      voterAddress: activeAccount?.address ?? "",
      transactionSigner,
    })
      .then(() => {
        setUserClaimedRewards(true);
        showToast("Rewards claimed", "success");
      })
      .catch((error) => {
        console.error(error);
        showToast("Error claiming rewards", "error");
      });
  }

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-md text-text max-w-xl w-full">
      {loadingProposal ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-heading text-xl font-bold text-white font-display">
                {proposal.title}
              </h3>
              <p className="text-sm text-text/80 font-sans">
                {proposal.description}
              </p>
            </div>
            <div className="flex justify-end items-center">
              <ProposalBadge type={proposal.type} />
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
              <div className="flex gap-2">
                <span className="text-yes">Yes</span> -
                <span>{proposal.votesFor} votes</span>
              </div>
              <span className="text-yes">
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
                className="bg-yes h-full transition-all duration-700 ease-out"
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
              <div className="flex gap-2">
                <span className="text-no">No</span> -
                <span>{proposal.votesAgainst} votes</span>
              </div>
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
                className="bg-no h-full bg-red-300 transition-all duration-700 ease-out"
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
            <div className="flex flex-col border-t border-gray-300/30">
              <div className="mt-4 flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  {proposal.type === "reward" && (
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-xs text-text/60">
                        Total prize pool:{" "}
                        {proposal.prizePool
                          ? proposal.prizePool /
                            10 ** (proposalAsset?.decimals || 6)
                          : 0}{" "}
                        {proposalAsset?.name}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-text/60">
                    Created by{" "}
                    <a href={`https://allo.info/account/${proposal.proposer}`}>
                      {ellipseAddress(proposal.proposer)}
                    </a>
                  </p>
                  {proposalAsset &&
                    proposal.type === "simple" &&
                    proposal.minimumHolding && (
                      <div className="flex gap-1 h-5 items-center text-yellow-500">
                        <span>
                          {" "}
                          {proposal.minimumHolding /
                            10 ** (proposalAsset?.decimals || 6)}
                        </span>
                        <img
                          className="h-full"
                          src={proposalAsset.logo.png}
                          alt="logo"
                        />
                        <span>required to vote</span>
                      </div>
                    )}
                  {proposal.type === "reward" && (
                    <div className="flex gap-1 h-5 items-center text-yellow-500">
                      <span className="flex gap-1 items-center">
                        {" "}
                        Pay{" "}
                        {(proposal.votePrice ?? 0) /
                          10 ** (proposalAsset?.decimals || 6)}{" "}
                        <img
                          className="h-5"
                          src={proposalAsset?.logo.png}
                          alt="logo"
                        />
                        to vote
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  {activeAccount && !userHasVoted ? (
                    <AnimButton onClick={() => onClickVote()}>Vote</AnimButton>
                  ) : null}

                  {activeAccount && userHasVoted ? (
                    userClaimedRewards ? (
                      <AnimButton
                        onClick={() => console.log("Its expired lil bro")}
                        disabled={true}
                      >
                        Claimed
                      </AnimButton>
                    ) : (
                      <AnimButton
                        onClick={() => console.log("Its expired lil bro")}
                        disabled={true}
                      >
                        Voted
                      </AnimButton>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg text-yellow-500">Expired</p>
              {activeAccount &&
              proposal.type === "reward" &&
              userHasVoted &&
              !userClaimedRewards ? (
                <AnimButton onClick={() => onClickClaim()}>
                  Claim Rewards
                </AnimButton>
              ) : null}
            </div>
          )}

          <p className="text-lg text-text/60">Expires in {countdown}</p>
        </>
      )}
    </div>
  );
};
