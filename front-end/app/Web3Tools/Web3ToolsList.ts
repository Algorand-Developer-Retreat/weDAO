import { Web3Tool } from "./Web3ToolTypes";

export const Web3ToolsList: Web3Tool[] = [
  {
    name: "Holders DAO",
    description: "Holders DAO",
    icon: "icon1.png",
    toolId: "holders_dao",
    callParams: [
      { paramName: "proposalTitle", value: "string" },
      { paramName: "proposalDescription", value: "string" },
      { paramName: "expiresIn", value: 1 },
      { paramName: "assetId", value: 1 },
      { paramName: "amount", value: 1 },
      { paramName: "votePrice", value: 1 },
    ],
    appDeploymentParams: {
      assetId: 1,
      min_holding: 1,
      anyone_can_create: true,
    },
  },
  // {
  //   name: "Rewards DAO",
  //   description: "Rewards DAO",
  //   icon: "icon2.png",
  //   toolId: "rewards_dao",
  //   callParams: [
  //     { paramName: "title", value: "string" },
  //     { paramName: "description", value: "string" },
  //     { paramName: "expiryTimestamp", value: 1 },
  //     { paramName: "assetId", value: 1 },
  //     { paramName: "amount", value: 1 },
  //     { paramName: "votePrice", value: 1 },
  //   ],
  //   appDeploymentParams: {
  //     assetId: 1,
  //     vote_price: 1,
  //     anyone_can_create: true,
  //   },
  // },
];
