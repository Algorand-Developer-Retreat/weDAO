/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { VoteContext } from "../context/vote";
import { motion } from "framer-motion";
import { useWallet } from "@txnlab/use-wallet-react";
import { getApplicationClient } from "../contract-methods/get-client";
import * as algokit from "@algorandfoundation/algokit-utils";
import { useAsaMetadata } from "../context/asametadata";

export function VoteModal() {
  const { displayVoteModal, setDisplayVoteModal, selectedProposal, vote } =
    useContext(VoteContext);
  const { getAssetById } = useAsaMetadata();
  const { activeAccount } = useWallet();
  const [yesPercentage, setYesPercentage] = useState(0);
  const [noPercentage, setNoPercentage] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [minimumhHolding, setMinimumHolding] = useState(0);
  const [assetId, setAssetId] = useState(0);
  const [userAbleToVote, setUserAbleToVote] = useState(false);
  const [assetInfo, setAssetInfo] = useState<any>(null);

  useEffect(() => {
    console.log("selectedProposal", selectedProposal);
    async function getGlobals() {
      const appClient = await getApplicationClient();
      const globals = await appClient.appClient.state.global.getAll();
      const minAmount = globals["minimum_holding"];
      const tokenId = globals["asset_id"];
      console.log(globals);
      setMinimumHolding(globals["minimum_holding"]);
      setAssetId(globals["asset_id"]);
      const info = getAssetById(tokenId);
      setAssetInfo(info);
      console.log("info:", info);
      const algorand = algokit.AlgorandClient.mainNet();
      const accountInfo = await algorand.account.getInformation(
        activeAccount?.address || ""
      );
      if (accountInfo.assets) {
        try {
          const asset = accountInfo.assets.find(
            (asset) => asset.assetId === BigInt(tokenId)
          );
          console.log("asset:", asset);
          if (asset && asset.amount >= BigInt(minAmount)) {
            setUserAbleToVote(true);
          } else {
            setUserAbleToVote(false);
          }
        } catch (error) {
          console.error("Error fetching asset information:", error);
          setUserAbleToVote(false);
        }
      }
    }
    if (selectedProposal) {
      const total = selectedProposal?.votesFor + selectedProposal?.votesAgainst;
      const yes = total > 0 ? (selectedProposal?.votesFor / total) * 100 : 0;
      const no = total > 0 ? (selectedProposal?.votesAgainst / total) * 100 : 0;
      setYesPercentage(yes);
      setNoPercentage(no);
      setTotalVotes(total);
      getGlobals();
    }
  }, [displayVoteModal, selectedProposal]);

  function onClickVote(answer: boolean) {
    setTransactionLoading(true);
    vote(selectedProposal?.id || 0, answer).then(() => {
      setTransactionLoading(false);
      setDisplayVoteModal(false);
    });
  }

  return displayVoteModal ? (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 z-50 flex items-center justify-center mx-2"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-background opacity-50 "></div>
        <div className="relative z-50 w-full max-w-lg p-4 bg-surface rounded-3xl">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-heading mb-2">
              Cast Your Vote
            </h2>
            <p className="text-text">{selectedProposal?.title}</p>
          </div>

          {/* Current Voting Status */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-text">Current Results</span>
              <span className="text-text">
                {totalVotes.toLocaleString()} votes
              </span>
            </div>
            <div className="h-4 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-yes"
                style={{ width: `${yesPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-yes">{yesPercentage.toFixed(1)}% Yes</span>
              <span className="text-no">{noPercentage.toFixed(1)}% No</span>
            </div>
          </div>

          {/* Voting Options */}
          {transactionLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yes"></div>
            </div>
          ) : selectedProposal?.proposer !== activeAccount?.address &&
            userAbleToVote ? (
            <div className="flex gap-4">
              <motion.button
                onClick={() => onClickVote(true)}
                className="flex-1 py-3 px-6 bg-yes text-background rounded-full font-display text-2xl hover:opacity-90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Yes
              </motion.button>
              <motion.button
                onClick={() => onClickVote(false)}
                className="flex-1 py-3 px-6 bg-no text-background rounded-full font-display text-2xl hover:opacity-90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                No
              </motion.button>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              {!userAbleToVote && assetInfo ? (
                <p className="text-text">
                  You need to hold at least{" "}
                  {Number(minimumhHolding) / 10 ** Number(assetInfo?.decimals || 6)}
                  <img
                    src={assetInfo.logo.png}
                    alt="Asset Logo"
                    className="inline-block w-4 h-4 mx-1"
                  />
                  {assetInfo?.name} to vote.
                </p>
              ) : (
                <p className="text-text">
                  You cannot vote on your own proposal.
                </p>
              )}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={() => setDisplayVoteModal(false)}
            className="absolute top-4 right-4 text-text hover:text-heading"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
