import { getApplicationClient } from "./get-client";

export async function getGlobalState() {
  const appClient = await getApplicationClient();
  const globalState = await appClient.state.global.getAll();
  console.log("Global State:", globalState);
  return globalState;
}
