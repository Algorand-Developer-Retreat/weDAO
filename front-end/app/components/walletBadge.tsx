import React, { useContext, useEffect } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import ClientOnly from "./clientOnly";
import { WalletContext } from "../context/wallet";

const WalletBadge: React.FC = () => {
  const { activeAccount } = useWallet();
  const { displayAddress, addNFDIfAvailable } = useContext(WalletContext);

  useEffect(() => {
    async function checkNFD() {
      if (activeAccount) {
        await addNFDIfAvailable(activeAccount.address);
      }
    }
    checkNFD();
  }, [activeAccount]);

  return (
    <ClientOnly>
      <div className="flex items-center justify-center bg-surface text-primary text-xl font-bold py-2 px-3 rounded-full">
        {displayAddress}
      </div>
    </ClientOnly>
  );
};

export default WalletBadge;
