import * as algokit from "@algorandfoundation/algokit-utils";
import { YesNoDaoClient } from "../../../smart-contracts/we_dao/smart_contracts/artifacts/we_dao/yes_no_dao/YesNoDaoClient";

export async function getApplicationClient() {
  const appId = BigInt(Number(import.meta.env.VITE_DAO_CONTRACT_APP_ID));
  const algorand = algokit.AlgorandClient.mainNet();
  const appClient = algorand.client.getTypedAppClientById(YesNoDaoClient, {
    appId: appId,
  });  return appClient;
}
