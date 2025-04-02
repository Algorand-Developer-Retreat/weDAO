import { createContext, useState } from "react";

interface WalletContextType {
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
  const [displayWalletConnectModal, setDisplayWalletConnectModal] =
    useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  return (
    <WalletContext.Provider
      value={{
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
