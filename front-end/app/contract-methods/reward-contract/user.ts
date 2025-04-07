/* eslint-disable @typescript-eslint/no-explicit-any */
import { microAlgos } from "@algorandfoundation/algokit-utils";
import { ClaimRewardsParams, VoteOnProposalParams } from "./interfaces";
import * as algokit from "@algorandfoundation/algokit-utils";
import { getRewardApplicationClient } from "./get-client";
import algosdk from "algosdk";

export async function voteOnProposal({
  proposalId,
  voterAddress,
  vote,
  transactionSigner,
  assetId,
  amount,
}: VoteOnProposalParams) {
  try {
    const appClient = await getRewardApplicationClient();

    const algorand = algokit.AlgorandClient.testNet();
    const mbrTxn = algorand.createTransaction.payment({
      sender: voterAddress,
      amount: microAlgos(144900),
      receiver: appClient.appAddress,
      extraFee: microAlgos(1000n),
      signer: transactionSigner,
    });

    console.log(" vote on proposal amount", amount);
    console.log(" vote on proposal assetId", assetId);
    console.log(" vote on proposal proposalId", proposalId);
    console.log(" vote on proposal vote", vote);
    console.log(" vote on proposal voterAddress", voterAddress);
    console.log(" vote on proposal transactionSigner", transactionSigner);

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
    const appClient = await getRewardApplicationClient();
    await appClient.send.claimParticipationReward({
      args: { proposalId },
      sender: voterAddress,
      signer: transactionSigner,
      extraFee: microAlgos(1000n),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserVotes(userAddress: string, proposalId: number) {
  const appClient = await getRewardApplicationClient();
  const publickey = algosdk.decodeAddress(userAddress).publicKey;
  const proposalIdBytes = new Uint8Array(8);
  const view = new DataView(proposalIdBytes.buffer);
  view.setBigUint64(0, BigInt(proposalId), false);
  const expectedName = new Uint8Array([
    ...Buffer.from("_v"),
    ...proposalIdBytes,
    ...publickey,
  ]);

  const boxCount = await appClient.appClient.getBoxNames();
  const box = boxCount.find((name: any) => {
    return (
      name.nameRaw.length === expectedName.length &&
      name.nameRaw.every(
        (value: any, index: number) => value === expectedName[index]
      )
    );
  });
  if (!box) {
    return {
      voteTimestamp: 0n,
      claimedRewards: 0n,
    };
  }

  const boxValues = await appClient.appClient.getBoxValue(box.nameRaw);
  console.log("boxValues", boxValues);
  const view2 = new DataView(boxValues.buffer);
  const voteTimestamp = view2.getBigUint64(0, false);
  const claimedRewards = view2.getInt8(8);

  const voteInfo = {
    voteTimestamp,
    claimedRewards,
  };
  console.log("voteInfo", voteInfo);
  return voteInfo;
}
