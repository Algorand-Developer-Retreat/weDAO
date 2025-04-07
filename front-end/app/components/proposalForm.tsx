import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@remix-run/react";
import { useToast } from "../components/toast";
import { MdQuestionAnswer } from "react-icons/md";
import { getGlobalState } from "../contract-methods/holders-contract/globalState";
import { useWallet } from "@txnlab/use-wallet-react";
import { FaLock } from "react-icons/fa";
import algosdk from "algosdk";

interface ProposalFormProps {
  onSubmit: (
    title: string,
    description: string,
    expiryTimestamp: number
  ) => Promise<void>;
  isLoading?: boolean;
}

export function ProposalForm({
  onSubmit,
  isLoading = false,
}: ProposalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [canCreate, setCanCreate] = useState(false);
  const { activeAccount } = useWallet();

  useEffect(() => {
    async function getGlobals() {
      const globals = await getGlobalState();
      if (globals.anyoneCanCreate) {
        setCanCreate(true);
      } else {
        const manager = globals.managerAddress?.asByteArray();
        const managerAddress = algosdk.encodeAddress(manager!);
        console.log("Manager address:", managerAddress, activeAccount);
        if (managerAddress === activeAccount?.address) {
          setCanCreate(true);
        }
      }
    }
    getGlobals();
  }, [activeAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert the expiry date to a timestamp (seconds since epoch)
      const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);

      await onSubmit(title, description, expiryTimestamp).then(() => {
        showToast("Proposal created successfully!", "success");
        navigate("/");
      });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create proposal",
        "error"
      );
    }
  };

  // Calculate minimum date (current date/time)
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm

  // Calculate maximum date (1 year from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateTime = maxDate.toISOString().slice(0, 16);

  if (!canCreate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto bg-surface p-8 rounded-xl shadow-lg"
      >
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <FaLock className="w-16 h-16 text-text/50" />
          <h2 className="text-2xl font-bold text-heading text-center">
            Only the DAO manager can create proposals
          </h2>
          <p className="text-text/70 text-center">
            This DAO is configured to only allow the manager to create
            proposals. Please contact the DAO manager if you would like to
            create a proposal.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg font-semibold text-background bg-primary hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-surface p-8 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-heading mb-2">
          Create a simple proposal
        </h2>
        <div className="flex items-center gap-2">
          <MdQuestionAnswer className="w-10 h-10 text-text" />
        </div>
      </div>
      <h3 className="text-text font-medium mb-6 text-sm ">
        Simple proposals are used to create a proposal with a title and
        description and are gated by users balance of your platform token.
      </h3>
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
          <label
            htmlFor="description"
            className="block text-text font-medium mb-2"
          >
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

        <div>
          <label
            htmlFor="expiryDate"
            className="block text-text font-medium mb-2"
          >
            Expiry Date and Time
          </label>
          <input
            id="expiryDate"
            type="datetime-local"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            min={minDateTime}
            max={maxDateTime}
            className="w-full px-4 py-3 rounded-lg bg-background text-text border border-text/10 focus:outline-none focus:border-primary transition-colors"
            required
          />
          <p className="mt-1 text-sm text-text/70">
            Set when this proposal will expire (maximum 1 year from now)
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
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
              ${
                isLoading
                  ? "bg-primary/50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 transition-colors"
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-background"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </div>
            ) : (
              "Create Proposal"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
