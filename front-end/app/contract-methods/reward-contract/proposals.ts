/* eslint-disable @typescript-eslint/no-unused-vars */
import { microAlgo, microAlgos } from "@algorandfoundation/algokit-utils";
import { getRewardApplicationClient } from "./get-client";
import { CreateProposalParams } from "./interfaces";
import algosdk from "algosdk";
import * as algokit from "@algorandfoundation/algokit-utils";
import { Proposal } from "../../interfaces/proposals";

export async function createProposal({
  title,
  description,
  proposerAddress,
  expiresIn,
  transactionSigner,
  assetId,
  amount,
  votePrice,
}: CreateProposalParams) {
  try {
    const appClient = await getRewardApplicationClient();
    const createProposalMbrValue = 168900;
    const algorand = algokit.AlgorandClient.testNet();

    await algorand.send.payment({
      sender: proposerAddress,
      receiver: appClient.appAddress,
      amount: microAlgo(200000),
      extraFee: microAlgos(1001n),
      signer: transactionSigner,
    });

    await appClient.send.optInToAsset({
      args: { assetId: assetId || 0 },
      sender: proposerAddress,
      extraFee: microAlgos(1001n),
      signer: transactionSigner,
    });

    const fundPoolTxn = algorand.createTransaction.assetTransfer({
      sender: proposerAddress,
      receiver: appClient.appAddress,
      assetId: BigInt(assetId || 0),
      amount: BigInt(amount || 0),
      extraFee: microAlgos(1001n),
      signer: transactionSigner,
    });

    const mbrTxn = algorand.createTransaction.payment({
      sender: proposerAddress,
      amount: microAlgos(createProposalMbrValue),
      receiver: appClient.appAddress,
      extraFee: microAlgos(1001n),
      signer: transactionSigner,
    });

    const result = await appClient.send.createProposal({
      args: {
        proposalTitle: title,
        proposalDescription: description,
        expiresIn: expiresIn,
        mbrTxn: mbrTxn,
        fundPoolTxn: fundPoolTxn,
        votePrice: BigInt(votePrice || 0),
      },
      sender: proposerAddress,
      signer: transactionSigner,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getProposals() {
  try {
    const appClient = await getRewardApplicationClient();

    const proposals: Proposal[] = [];
    let boxCount = await appClient.appClient.getBoxNames();
    boxCount = boxCount.filter((name) => {
      return name.name.startsWith("_p");
    });
    console.log("boxCount", boxCount);
    let index = 1;
    for (const name of boxCount) {
      const boxValues = await appClient.appClient.getBoxValue(name.name);
      const proposal = await decodeBoxValues(boxValues, index);
      proposals.push(proposal);
      index++;
    }
    console.log("proposals", proposals);

    return proposals;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function byteArrayToUint128(byteArray: Uint8Array): bigint {
  let result = BigInt(0);

  // Iterate over the byte array, treating it as big-endian
  for (let i = 0; i < byteArray.length; i++) {
    result = (result << BigInt(8)) + BigInt(byteArray[i]);
  }

  return result;
}

async function decodeBoxValues(boxValues: Uint8Array, proposalId: number) {
  const BYTE_LENGTH = 8;

  const appClient = await getRewardApplicationClient();

  /* proposal_expiry_timestamp: arc4.UintN64
  proposal_start_timestamp: arc4.UintN64
  proposal_total_votes: arc4.UintN64
  proposal_yes_votes: arc4.UintN64
  proposal_prize_pool: arc4.UintN64
  proposal_asset: arc4.UintN64
  vote_price: arc4.UintN64
  proposal_creator: arc4.Address
  proposal_title_and_description: arc4.Str */

  let index = 0;
  const proposal_expiry_timestamp = byteArrayToUint128(
    boxValues.slice(index, index + BYTE_LENGTH)
  );
  index += BYTE_LENGTH;
  const proposal_start_timestamp = byteArrayToUint128(
    boxValues.slice(index, index + BYTE_LENGTH)
  );
  index += BYTE_LENGTH;
  const proposal_total_votes = byteArrayToUint128(
    boxValues.slice(index, index + BYTE_LENGTH)
  );
  index += BYTE_LENGTH;
  const proposal_yes_votes = byteArrayToUint128(
    boxValues.slice(index, index + BYTE_LENGTH)
  );
  index += BYTE_LENGTH;
  const proposal_prize_pool = byteArrayToUint128(
    boxValues.slice(index, index + BYTE_LENGTH)
  );
  index += BYTE_LENGTH;
  const proposal_asset = byteArrayToUint128(
    boxValues.slice(index, index + BYTE_LENGTH)
  );
  index += BYTE_LENGTH;
  const vote_price = byteArrayToUint128(
    boxValues.slice(index, index + BYTE_LENGTH)
  );
  index += BYTE_LENGTH;
  const proposal_creator = algosdk.encodeAddress(
    boxValues.slice(index, index + 32)
  );
  index += 32 + 4;
  const proposal_title_and_description = new TextDecoder().decode(
    boxValues.slice(index)
  );
  const proposal_title = proposal_title_and_description.split(":")[0];
  const proposal_description = proposal_title_and_description.split(":")[1];
  console.log("proposal_expiry_timestamp", proposal_expiry_timestamp);
  console.log("Date.now()", Date.now());
  const newProposal: Proposal = {
    description: proposal_description,
    expiresIn: Number(proposal_expiry_timestamp),
    id: proposalId,
    proposer: proposal_creator,
    status:
      Number(proposal_expiry_timestamp) < Date.now() / 1000
        ? "closed"
        : "active",
    title: proposal_title,
    votesFor: Number(proposal_yes_votes),
    votesAgainst: Number(proposal_total_votes) - Number(proposal_yes_votes),
    proposalAsset: Number(proposal_asset),
    minimumHolding: Number(vote_price),
    prizePool: Number(proposal_prize_pool),
    votePrice: Number(vote_price),
    type: "reward",
  };
  return newProposal;
}
