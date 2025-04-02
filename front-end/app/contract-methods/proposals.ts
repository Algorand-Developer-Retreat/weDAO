/* eslint-disable @typescript-eslint/no-unused-vars */
import { microAlgos } from "@algorandfoundation/algokit-utils";
import { getApplicationClient } from "./get-client";
import { CreateProposalParams } from "./interfaces";
import * as algokit from "@algorandfoundation/algokit-utils";
import { Proposal } from "../interfaces/proposals";

export async function createProposal({
  title,
  description,
  proposerAddress,
  expiresIn,
  transactionSigner,
}: CreateProposalParams) {
  try {
    const appClient = await getApplicationClient();
    const createProposalMbrValue = 144900;
    const algorand = algokit.AlgorandClient.mainNet();

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
    const proposalsCount = await appClient.state.global.proposalCount();
    const proposals: Proposal[] = [];
    const boxCount = await appClient.appClient.getBoxNames();
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

async function decodeBoxValues(boxValues: Uint8Array, proposalId: number){
  const BYTE_LENGTH = 8;

    const appClient = await getApplicationClient();

    let index = 0;
    const proposal_expiry_timestamp = byteArrayToUint128(boxValues.slice(index, index + BYTE_LENGTH));
    index += BYTE_LENGTH;
    const proposal_start_timestamp = byteArrayToUint128(boxValues.slice(index, index + BYTE_LENGTH));
    index += BYTE_LENGTH;
    const proposal_total_votes = byteArrayToUint128(boxValues.slice(index, index + BYTE_LENGTH));
    index += BYTE_LENGTH;
    const proposal_yes_votes = byteArrayToUint128(boxValues.slice(index, index + BYTE_LENGTH));
    index += BYTE_LENGTH;
    const proposal_title = new TextDecoder().decode(boxValues.slice(index));
  const newProposal: Proposal =  {
    description: '',
    expiresIn: Number(proposal_expiry_timestamp),
    id: proposalId,
    proposer: '',
    status: 'active',
    title: proposal_title,
    votesFor: Number(proposal_yes_votes),
    votesAgainst: Number(proposal_total_votes) - Number(proposal_yes_votes),
  }
  return newProposal;
}
