import { YesNoRewardFactory } from "./YesNoRewardClient";
import * as algokit from "@algorandfoundation/algokit-utils";
import { TransactionSigner } from "algosdk";
import { a } from "framer-motion/client";

export default async function deployHoldersContract(
  anyoneCanCreate: boolean,
  minHolding: number,
  assetId: number,
  senderAddress: string,
  signer: TransactionSigner
) {
  const algorand = algokit.AlgorandClient.testNet();

  // Register the signer with the account manager
  algorand.account.setSigner(senderAddress, signer);

  const factory = algorand.client.getTypedAppFactory(YesNoRewardFactory, {
    defaultSender: senderAddress,
  });

  // Deploy the application
  const { appClient } = await factory.send.create.createApplication({
    args: [anyoneCanCreate],
    // No need to specify signer here as it's already registered with the account
  });

  const appId = appClient.appId;
  const appAddress = appClient.appAddress;

  await algorand.send.payment({
    receiver: appAddress,
    amount: algokit.microAlgo(100000),
    sender: senderAddress,
  });

  console.log(`Deployed app with id: ${appId}`);

  return { appClient, appId };
}
