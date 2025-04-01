"use client";

import { createContext, useState } from "react";

interface WalletContextType {
  algoBalance: number;
  setAlgoBalance: (value: number) => void;
  orangeBalance: number;
  setOrangeBalance: (value: number) => void;
  address: string;
  setAddress: (value: string) => void;
  displayWalletConnectModal: boolean;
  setDisplayWalletConnectModal: (value: boolean) => void;
  walletConnected: boolean;
  setWalletConnected: (value: boolean) => void;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

const WalletContextProvider: React.FC<{ children: React.ReactNode }> = ({
  // eslint-disable-next-line react/prop-types
  children,
}) => {
  const [algoBalance, setAlgoBalance] = useState<number>(0);
  const [orangeBalance, setOrangeBalance] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [displayWalletConnectModal, setDisplayWalletConnectModal] =
    useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  return (
    <WalletContext.Provider
      value={{
        algoBalance,
        setAlgoBalance,
        orangeBalance,
        setOrangeBalance,
        address,
        setAddress,

        displayWalletConnectModal,
        setDisplayWalletConnectModal,
        walletConnected,
        setWalletConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export { WalletContext, WalletContextProvider };
