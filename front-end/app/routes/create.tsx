'use client'
import { useState } from "react";
import { ProposalForm } from "../components/proposalForm";
import { Header } from "../components/header";
import { useWallet } from "@txnlab/use-wallet-react";
import { createProposal } from "../contract-methods/proposals";
import * as algokit from "@algorandfoundation/algokit-utils";
import { Footer } from "../components/footer";
export default function CreateProposal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {activeAccount, transactionSigner} = useWallet();

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
        <ProposalForm 
          onSubmit={handleCreateProposal}
          isLoading={isSubmitting}
        />
      </main>
      <Footer />
    </div>
  );
} 