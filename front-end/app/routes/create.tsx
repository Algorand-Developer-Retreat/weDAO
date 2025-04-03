'use client'
import { useState } from "react";
import { ProposalForm } from "../components/proposalForm";
import { Header } from "../components/header";
import { useWallet } from "@txnlab/use-wallet-react";
import { createProposal } from "../contract-methods/proposals";
import * as algokit from "@algorandfoundation/algokit-utils";
import { Footer } from "../components/footer";
import { ProposalFormRewards } from "../components/proposalFormRewards";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateProposal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {activeAccount, transactionSigner} = useWallet();
  const [activeTab, setActiveTab] = useState("proposal");

  const handleCreateProposal = async (title: string, description: string, expiryTimestamp: number) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement the actual proposal creation logic here
      console.log("Creating proposal:", { title, description, expiryTimestamp });
      
      const algorand = algokit.AlgorandClient.mainNet();
      algorand.setDefaultSigner(transactionSigner);
      await createProposal({ title, description, proposerAddress: activeAccount?.address || "", expiresIn: expiryTimestamp, transactionSigner: transactionSigner });
      
      // TODO: Handle success (e.g., redirect to proposal list)
      
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
        <div className="flex z-10 w-full justify-center  mb-8 gap-5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-2 px-6 text-background text-xl md:text-2xl font-display rounded-full ${
              activeTab === "proposal"
                ? "bg-secondary font-bold"
                : "bg-primary hover:text-background"
            }`}
            onClick={() => setActiveTab("proposal")}
          >
            Simple Proposal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-2 px-6 text-background text-xl md:text-2xl font-display rounded-full ${
              activeTab === "rewards"
                ? "bg-secondary font-bold"
                : "bg-primary hover:text-background"
            }`}
            onClick={() => setActiveTab("rewards")}
          >
            Proposal with Rewards
          </motion.button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "proposal" && (
              <ProposalForm 
                onSubmit={handleCreateProposal}
                isLoading={isSubmitting}
              />
            )}
            {activeTab === "rewards" && (
              <ProposalFormRewards
                onSubmit={handleCreateProposal}
                isLoading={isSubmitting}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
} 