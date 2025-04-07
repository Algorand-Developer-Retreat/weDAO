import { microAlgos } from "@algorandfoundation/algokit-utils";
import { VoteOnProposalParams } from "./interfaces";
import * as algokit from "@algorandfoundation/algokit-utils";
import { getApplicationClient } from "./get-client";
import algosdk from "algosdk";

export async function voteOnProposal({
  proposalId,
  voterAddress,
  vote,
  transactionSigner,
}: VoteOnProposalParams) {
  try {
    const appClient = await getApplicationClient();

    const algorand = algokit.AlgorandClient.testNet();
    const mbrTxn = algorand.createTransaction.payment({
      sender: voterAddress,
      amount: microAlgos(144900),
      receiver: appClient.appAddress,
      extraFee: microAlgos(1000n),
    });

    await appClient.send.voteProposal({
      args: { proposalId, vote, mbrTxn },
      sender: voterAddress,
      signer: transactionSigner,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserVotes(userAddress: string, proposalId: number) {
  const appClient = await getApplicationClient();
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
  const box = boxCount.find((name) => {
    return (
      name.nameRaw.length === expectedName.length &&
      name.nameRaw.every((value, index) => value === expectedName[index])
    );
  });
  if (!box) {
    return {
      voteTimestamp: 0n,
      claimedRewards: 0n,
    };
  }
  const boxValues = await appClient.appClient.getBoxValue(box.nameRaw);
  const view2 = new DataView(boxValues.buffer);
  const voteTimestamp = view2.getBigUint64(0, false);

  return {
    voteTimestamp,
    claimedRewards: 0n,
  };
}
