import * as algokit from "@algorandfoundation/algokit-utils";
import { YesNoRewardClient } from "./YesNoRewardClient"

export async function getApplicationClient() {
  const appId = BigInt(Number(import.meta.env.VITE_DAO_CONTRACT_APP_ID));
  const algorand = algokit.AlgorandClient.mainNet();
  const appClient = algorand.client.getTypedAppClientById(YesNoRewardClient, {
    appId: appId,
  });  return appClient;
}
