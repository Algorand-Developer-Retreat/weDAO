import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@remix-run/react";

interface ProposalFormProps {
  onSubmit: (title: string, description: string) => void;
  isLoading?: boolean;
}

export function ProposalForm({ onSubmit, isLoading = false }: ProposalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, description);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-surface p-8 rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-bold text-heading mb-6">Create Proposal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-text font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter proposal title"
            className="w-full px-4 py-3 rounded-lg bg-background text-text placeholder-text/50 border border-text/10 focus:outline-none focus:border-primary transition-colors"
            required
            minLength={5}
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-text font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter proposal description"
            className="w-full px-4 py-3 rounded-lg bg-background text-text placeholder-text/50 border border-text/10 focus:outline-none focus:border-primary transition-colors min-h-[200px]"
            required
            minLength={20}
            maxLength={1000}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-lg font-semibold text-background bg-secondary hover:bg-secondary/90 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`
              px-6 py-3 rounded-lg font-semibold text-background
              ${isLoading 
                ? 'bg-primary/50 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 transition-colors'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </div>
            ) : (
              'Create Proposal'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 