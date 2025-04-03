import { microAlgos } from "@algorandfoundation/algokit-utils";
import { VoteOnProposalParams } from "./interfaces";
import * as algokit from "@algorandfoundation/algokit-utils";
import { getApplicationClient } from "./get-client";

export async function voteOnProposal({
  proposalId,
  voterAddress,
  vote,
  transactionSigner,
}: VoteOnProposalParams) {
  try {
    const appClient = await getApplicationClient();

    const algorand = algokit.AlgorandClient.mainNet();
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
