export interface Web3Tool {
  toolId: string;
  name: string;
  description: string;
  icon: string;
  callParams: { paramName: string; value: string | number }[];
  appDeploymentParams: HoldersDaoDeploymentParams | RewardsDaoDeploymentParams;
}

export type HoldersDaoDeploymentParams = {
  assetId: number;
  min_holding: number;
  anyone_can_create: boolean;
};

export type RewardsDaoDeploymentParams = {
  assetId: number;
  vote_price: number;
  anyone_can_create: boolean;
};
