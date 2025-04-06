import { TransactionSigner } from "algosdk";
import React, { createContext, useContext, useEffect, useState } from "react";
import deployHoldersContract from "~/contract-methods/holders-contract/deployHoldersContract";
import { Web3Tool } from "~/Web3Tools/Web3ToolTypes";

interface ProjectToLaunchMetadata {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectTitle: string;
  web3Tools: Web3Tool[];
}

interface LaunchpadContextType {
  launchNewProject: (
    anyoneCanCreate: boolean,
    minHolding: number,
    assetId: number,
    walletAddress: string,
    signer: TransactionSigner
  ) => Promise<number>;
}

const LaunchpadContext = createContext<LaunchpadContextType | undefined>(
  undefined
);

export const LaunchpadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [launchNewPojectMetadata, setLaunchNewPojectMetadata] = useState<
    ProjectToLaunchMetadata[]
  >([]);

  const launchNewProject = async (
    anyoneCanCreate: boolean,
    minHolding: number,
    assetId: number,
    walletAddress: string,
    signer: TransactionSigner
  ): Promise<number> => {
    const { appClient, appId } = await deployHoldersContract(
      anyoneCanCreate,
      minHolding,
      assetId,
      walletAddress,
      signer
    );

    return Number(appId);
  };

  return (
    <LaunchpadContext.Provider value={{ launchNewProject }}>
      {children}
    </LaunchpadContext.Provider>
  );
};

export const useLaunchpad = (): LaunchpadContextType => {
  const context = useContext(LaunchpadContext);
  if (!context) {
    throw new Error(
      "useAsaMetadata must be used within an AsaMetadataProvider"
    );
  }
  return context;
};
