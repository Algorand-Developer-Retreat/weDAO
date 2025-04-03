"use client";


import { motion } from "framer-motion";
import { MdOutlineLogout } from "react-icons/md";
import { useWallet } from '@txnlab/use-wallet-react'
import { WalletContext } from "../context/wallet";
import { useContext } from "react";
export const DisconnectButton = () => {

  const { activeWallet } = useWallet()
  const { setWalletConnected } = useContext(WalletContext)

  async function handleDisconnect() {
    console.log('disconnecting wallet', activeWallet)
    if(activeWallet) {
      await activeWallet.disconnect().then(() => {
        setWalletConnected(false)
      })
    }
  }

  return (
    <motion.button
      onClick={() => handleDisconnect()}
      className="text-red-300 cursor-pointer"
      aria-label="Disconnect wallet"
      whileHover={{ 
        color: "#EF4444",
        scale: 1.1,
        rotate: [0, -10, 10, -10, 10, 0],
        transition: {
          rotate: {
            repeat: Infinity,
            duration: 0.5
          }
        }
      }}
      animate={{
        rotate: 0
      }}
    >
      <MdOutlineLogout className="w-8 h-8" />
    </motion.button>
  );
};
