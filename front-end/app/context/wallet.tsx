import { createContext, useState } from "react";
import axios from "axios";
import { ellipseAddress } from "../utils";

interface WalletContextType {
  nfd: string;
  displayAddress: string;
  setDisplayAddress: (value: string) => void;
  setNfd: (value: string) => void;
  addNFDIfAvailable: (address: string) => void;
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
  const [displayAddress, setDisplayAddress] = useState<string>("");

  const [nfd, setNfd] = useState<string>("");
  const addNFDIfAvailable = async (address: string) => {
    //check for NFD
    try {
      const nfdResponse = await axios.get(
        `https://api.nf.domains/nfd/address?address=${address}&limit=1&view=full`
      );

      const nfdProperties = nfdResponse.data[0];
      const nfDomain = nfdProperties?.name;
      setNfd(nfDomain);
      setDisplayAddress(nfDomain);
      setWalletConnected(true);
    } catch (error) {
      console.error("Error checking for NFD", address);
      setNfd("");
      setDisplayAddress(ellipseAddress(address));
    }
    
  }

  return (
    <WalletContext.Provider
      value={{
        displayWalletConnectModal,
        setDisplayWalletConnectModal,
        walletConnected,
        setWalletConnected,
        nfd,
        setNfd,
        addNFDIfAvailable,
        displayAddress,
        setDisplayAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export { WalletContext, WalletContextProvider };
