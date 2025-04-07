import * as algokit from "@algorandfoundation/algokit-utils";
import { YesNoRewardClient } from "./YesNoRewardClient";

export async function getRewardApplicationClient() {
  const appId = BigInt(Number(import.meta.env.VITE_REWARD_CONTRACT_APP_ID));
  const algorand = algokit.AlgorandClient.testNet();
  const appClient = algorand.client.getTypedAppClientById(YesNoRewardClient, {
    appId: appId,
  });

  return appClient;
}
