import { getRewardApplicationClient } from "./get-client";

export async function getRewardProposalGlobalState() {
  const appClient = await getRewardApplicationClient();
  const globalState = await appClient.state.global.getAll();
  return globalState;
}
