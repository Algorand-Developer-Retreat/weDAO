import React, { createContext, useContext, useEffect, useState } from "react";
import { Web3Tool } from "~/Web3Tools/Web3ToolTypes";

interface ProjectToLaunchMetadata {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectTitle: string;
  web3Tools: Web3Tool[];
}

interface LaunchpadContextType {
  launchNewProject: (project: ProjectToLaunchMetadata) => Promise<void>;
}

const LaunchpadContext = createContext<LaunchpadContextType | undefined>(
  undefined
);

export const AsaMetadataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [asaMetadata, setAsaMetadata] = useState<ProjectToLaunchMetadata[]>([]);

  const launchNewProject = async (
    project: ProjectToLaunchMetadata
  ): Promise<void> => {};

  return (
    <LaunchpadContext.Provider value={{ launchNewProject }}>
      {children}
    </LaunchpadContext.Provider>
  );
};

export const useAsaMetadata = (): LaunchpadContextType => {
  const context = useContext(LaunchpadContext);
  if (!context) {
    throw new Error(
      "useAsaMetadata must be used within an AsaMetadataProvider"
    );
  }
  return context;
};
