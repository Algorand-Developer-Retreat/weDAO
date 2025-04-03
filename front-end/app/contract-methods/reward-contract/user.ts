import { microAlgos } from "@algorandfoundation/algokit-utils";
import { ClaimRewardsParams, VoteOnProposalParams } from "./interfaces";
import * as algokit from "@algorandfoundation/algokit-utils";
import { getApplicationClient } from "./get-client";

export async function voteOnProposal({
  proposalId,
  voterAddress,
  vote,
  transactionSigner,
  assetId,
  amount,
}: VoteOnProposalParams) {
  try {
    const appClient = await getApplicationClient();

    const algorand = algokit.AlgorandClient.mainNet();
    const mbrTxn = algorand.createTransaction.payment({
      sender: voterAddress,
      amount: microAlgos(144900),
      receiver: appClient.appAddress,
      extraFee: microAlgos(1000n),
      signer: transactionSigner,
    });

    const fundVoteTxn = algorand.createTransaction.assetTransfer({
      sender: voterAddress,
      receiver: appClient.appAddress,
      assetId: BigInt(assetId || 0),
      amount: BigInt(amount || 0),
      extraFee: microAlgos(1000n),
      signer: transactionSigner,
    });

    await appClient.send.voteProposal({
      args: { proposalId, vote, mbrTxn, fundVoteTxn },
      sender: voterAddress,
      signer: transactionSigner,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function claimRewards({
  proposalId,
  voterAddress,
  transactionSigner,
}: ClaimRewardsParams) {
  try {
    const appClient = await getApplicationClient();
    await appClient.send.claimParticipationReward({
      args: { proposalId },
      sender: voterAddress,
      signer: transactionSigner,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
