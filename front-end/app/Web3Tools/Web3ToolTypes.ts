export interface Web3Tool {
  toolId: string;
  name: string;
  description: string;
  icon: string;
  callParams: { paramName: string; value: string | number }[];
}
