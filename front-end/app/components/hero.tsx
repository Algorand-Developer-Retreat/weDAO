import ClientOnly from "./clientOnly";
import { useWallet } from "@txnlab/use-wallet-react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { WalletContext } from "../context/wallet";
import AnimButton from "./animButton";

export function Hero() {
  const { activeAccount } = useWallet();
  const { setDisplayWalletConnectModal } = useContext(WalletContext);
  const projectName = import.meta.env.VITE_PROJECT_NAME || "DAO";

  return (
    <div className="mt-24 md:mt-32 mb-8  flex flex-col items-center justify-center px-4 bg-background">
      {/* Main content */}
      <motion.div
        className="text-center z-10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-heading mb-6">
          Welcome to{" "}
          <span className="font-display text-primary">{projectName}</span>
        </h1>
        <p className="text-xl md:text-2xl text-primary mb-8 max-w-2xl mx-auto">
          {import.meta.env.VITE_PROJECT_DESCRIPTION}
        </p>
       
        <ClientOnly>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!activeAccount && (
              <AnimButton onClick={() => setDisplayWalletConnectModal(true)}>
                Connect Wallet to Start
              </AnimButton>
            )}
          </div>
        </ClientOnly>
      </motion.div>
    </div>
  );
}
