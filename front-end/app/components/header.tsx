import ClientOnly from "./clientOnly";
import { useWallet } from "@txnlab/use-wallet-react";
import { useContext } from "react";

import AnimButton from "./animButton";
import { WalletContext } from "../context/wallet";
import { DisconnectButton } from "./disconnectButton";
import WalletBadge from "./walletBadge";
import { useNavigate } from "@remix-run/react";
import NavigateToLaunchpadButton from "./launchpad/NavigateToLaunchpadButton";

export function Header() {
  const { activeAccount } = useWallet();
  const { setDisplayWalletConnectModal } = useContext(WalletContext);

  const navigate = useNavigate();

  return (
    <header className="flex fixed top-0 left-0 w-full justify-between items-center py-2 px-4 z-30 bg-heading/50">
      <ClientOnly>
        <img
          onClick={() => navigate("/")}
          src={import.meta.env.VITE_DAO_TOKEN_IMAGE_URL || "/weDAO logo.png"}
          alt="logo"
          className="h-32 cursor-pointer w-32 md:h-56 md:w-56 rounded-full bg-surface -mb-12 md:-mb-36 border-4 ring-4 ring-background border-background"
        />
      </ClientOnly>

      <ClientOnly>
        {activeAccount ? (
          <div className="flex items-center gap-2">
            <NavigateToLaunchpadButton />
            <WalletBadge />
            <DisconnectButton />
          </div>
        ) : (
          <AnimButton onClick={() => setDisplayWalletConnectModal(true)}>
            Connect
          </AnimButton>
        )}
      </ClientOnly>
    </header>
  );
}
