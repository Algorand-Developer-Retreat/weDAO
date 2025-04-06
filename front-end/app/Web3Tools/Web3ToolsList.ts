import { Web3Tool } from "./Web3ToolTypes";

export const Web3ToolsList: Web3Tool[] = [
  {
    name: "holders_dao",
    description: "Holders DAO",
    icon: "icon1.png",
    toolId: "tool1",
    callParams: [
      { paramName: "title", type: "string" },
      { paramName: "description", type: "string" },
      { paramName: "expiryTimestamp", type: "number" },
      { paramName: "assetId", type: "number" },
      { paramName: "amount", type: "number" },
      { paramName: "votePrice", type: "number" },
    ],
  },
  {
    name: "rewards_dao",
    description: "Rewards DAO",
    icon: "icon2.png",
    toolId: "tool2",
    callParams: [
      { paramName: "title", type: "string" },
      { paramName: "description", type: "string" },
      { paramName: "expiryTimestamp", type: "number" },
      { paramName: "assetId", type: "number" },
      { paramName: "amount", type: "number" },
      { paramName: "votePrice", type: "number" },
    ],
  },
];
