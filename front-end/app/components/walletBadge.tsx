import React from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import ClientOnly from "./clientOnly";
import { ellipseAddress } from "../utils";

const WalletBadge: React.FC = () => {
  const { activeAccount } = useWallet();

  return (
    <ClientOnly>
      <div className="flex items-center justify-center bg-surface text-primary text-xl font-bold py-2 px-3 rounded-full">
        {ellipseAddress(activeAccount?.address) || "No Wallet Connected"}
      </div>
    </ClientOnly>
  );
};

export default WalletBadge;
