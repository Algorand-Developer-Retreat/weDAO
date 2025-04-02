import { microAlgos } from "@algorandfoundation/algokit-utils";
import { getApplicationClient } from "./get-client";
import { CreateProposalParams } from "./interfaces";
import * as algokit from "@algorandfoundation/algokit-utils";

export async function createProposal({
  title,
  description,
  proposerAddress,
  expiresIn,
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

    const result = await appClient.send.createProposal({
      args: {
        proposalTitle: title,
        proposalDescription: description,
        expiresIn: expiresIn,
        mbrTxn: mbrTxn,
      },
      sender: proposerAddress,
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

    const appAddressInfo = await algorand.account.getInformation(
      appClient.appAddress
    );
    return appAddressInfo.createdApps;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
