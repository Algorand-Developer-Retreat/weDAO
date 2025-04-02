import { useState } from "react";
import { ProposalForm } from "../components/proposalForm";
import { Header } from "../components/header";

export default function CreateProposal() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProposal = async (title: string, description: string) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement the actual proposal creation logic here
      console.log("Creating proposal:", { title, description });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Handle success (e.g., redirect to proposal list)
      
    } catch (error) {
      console.error("Failed to create proposal:", error);
      // TODO: Handle error (e.g., show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProposalForm 
          onSubmit={handleCreateProposal}
          isLoading={isSubmitting}
        />
      </main>
    </div>
  );
} 