"use client";
import { useState } from "react";
import { ProposalForm } from "../components/proposalForm";
import { Header } from "../components/header";
import { useWallet } from "@txnlab/use-wallet-react";
import { createProposal } from "../contract-methods/holders-contract/proposals";
import { createProposal as createRewardProposal } from "../contract-methods/reward-contract/proposals";
import * as algokit from "@algorandfoundation/algokit-utils";
import { Footer } from "../components/footer";
import { ProposalFormRewards } from "../components/proposalFormRewards";
import { motion, AnimatePresence } from "framer-motion";
import { SetupForm } from "~/components/setup_wedev/SetupForm";
import { Web3Tool } from "~/Web3Tools/Web3ToolTypes";

export default function SetupWeDev() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeAccount, transactionSigner } = useWallet();
  const [activeTab, setActiveTab] = useState("proposal");

  const handleCreateProject = async (
    projectName: string,
    web3Tools: Web3Tool[]
  ) => {
    setIsSubmitting(true);
    try {
      if (!activeAccount) return;

      const metadata = {
        projectName,
        web3Tools,
      };

      console.log("Creating project with metadata:", metadata);

      const algorand = algokit.AlgorandClient.testNet();
      algorand.setDefaultSigner(transactionSigner);
    } catch (error) {
      console.error("Failed to create proposal:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-24 md:mt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "proposal" && (
              <SetupForm onSubmit={handleCreateProject} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
