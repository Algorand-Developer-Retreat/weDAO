'use-client'
import { useWallet } from "@txnlab/use-wallet-react";
import AnimButton from "./animButton";
import { WalletContext } from "../context/wallet";
import { useContext } from "react";
import { DisconnectButton } from "./disconnectButton";
import { useNavigate } from "@remix-run/react";

export function Header() {
  const { activeAccount } = useWallet();
  const { setDisplayWalletConnectModal } = useContext(WalletContext);
  const navigate = useNavigate();

  const createProposal = () => {
    navigate("/create");
  };

  return (
    <header className="flex fixed top-0 left-0 w-full justify-between items-center py-2 px-4 z-30 bg-background">
      <img src="/project-icon.png" alt="logo" className="h-20 w-20 rounded-full"/>
      {activeAccount ? (
        <div className="flex gap-2">
          <AnimButton data-test-id="connect-wallet" onClick={createProposal}>
            Create Proposal
          </AnimButton>
          <DisconnectButton />
        </div>
      ) : (
        <AnimButton
          data-test-id="connect-wallet"
          onClick={() => setDisplayWalletConnectModal(true)}
        >
          Connect
        </AnimButton>
      )}
    </header>
  );
}
