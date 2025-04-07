/* eslint-disable @typescript-eslint/no-unused-vars */
import { microAlgos } from "@algorandfoundation/algokit-utils";
import { CreateProposalParams } from "./interfaces";
import algosdk from "algosdk";
import * as algokit from "@algorandfoundation/algokit-utils";
import { Proposal } from "../../interfaces/proposals";
import { getGlobalState } from "./globalState";
import { getApplicationClient } from "./get-client";

export async function createProposal({
  title,
  description,
  proposerAddress,
  expiresIn,
  transactionSigner,
}: CreateProposalParams) {
  try {
    const appClient = await getApplicationClient();
    const createProposalMbrValue = 168900;
    const algorand = algokit.AlgorandClient.testNet();

    const mbrTxn = algorand.createTransaction.payment({
      sender: proposerAddress,
      amount: microAlgos(createProposalMbrValue),
      receiver: appClient.appAddress,
      extraFee: microAlgos(1000n),
    });
    console.log("transaction signer", transactionSigner);
    const result = await appClient.send.createProposal({
      args: {
        proposalTitle: title,
        proposalDescription: description,
        expiresIn: expiresIn,
        mbrTxn: mbrTxn,
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
    const appClient = await getApplicationClient();

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

  const { assetId, minimumHolding } = await getGlobalState();

  const appClient = await getApplicationClient();

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
  const account = algosdk.encodeAddress(boxValues.slice(index, index + 32));
  index += 32 + 4;
  const proposal_title_and_description = new TextDecoder().decode(
    boxValues.slice(index)
  );
  const proposal_title = proposal_title_and_description.split(":")[0];
  const proposal_description = proposal_title_and_description.split(":")[1];
  const newProposal: Proposal = {
    description: proposal_description,
    expiresIn: Number(proposal_expiry_timestamp),
    id: proposalId,
    proposer: account,
    status: "active",
    title: proposal_title,
    votesFor: Number(proposal_yes_votes),
    votesAgainst: Number(proposal_total_votes) - Number(proposal_yes_votes),
    proposalAsset: Number(assetId),
    minimumHolding: Number(minimumHolding),
    type: "simple",
  };
  return newProposal;
}
