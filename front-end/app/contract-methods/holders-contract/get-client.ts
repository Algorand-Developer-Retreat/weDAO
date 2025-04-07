import * as algokit from "@algorandfoundation/algokit-utils";
import { YesNoDaoClient } from "./YesNoDaoClient";

export async function getApplicationClient() {
  const appId = BigInt(Number(import.meta.env.VITE_DAO_CONTRACT_APP_ID));
  const algorand = algokit.AlgorandClient.testNet();
  const appClient = algorand.client.getTypedAppClientById(YesNoDaoClient, {
    appId: appId,
  });

  return appClient;
}
