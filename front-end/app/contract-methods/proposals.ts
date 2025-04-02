import { microAlgos } from "@algorandfoundation/algokit-utils";
import { getApplicationClient } from "./get-client";
import { CreateProposalParams } from "./interfaces";
import * as algokit from "@algorandfoundation/algokit-utils";

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
    const algorand = algokit.AlgorandClient.mainNet();

    const boxNames = await algorand.app.getBoxNames(appClient.appId);
    const boxInfo = await algorand.app.getBoxValue(appClient.appId, boxNames[0]);
    console.log("boxInfo", boxInfo);
    return boxInfo;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getProposalById(id: number) {
  try {
    const appClient = await getApplicationClient();
    const proposal = await appClient.send.getProposal({
      args: { proposalId: id },
    });
    return proposal;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
