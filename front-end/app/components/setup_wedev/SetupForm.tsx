import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@remix-run/react";
import { MdQuestionAnswer } from "react-icons/md";
import { useWallet } from "@txnlab/use-wallet-react";
import { FaLock } from "react-icons/fa";
import { useToast } from "../toast";
import { Web3ToolsList } from "~/Web3Tools/Web3ToolsList";
import { Web3Tool } from "~/Web3Tools/Web3ToolTypes";

interface SetupFormProps {
  onSubmit: (
    title: string,
    description: string,
    expiryTimestamp: number
  ) => Promise<void>;
  isLoading?: boolean;
}

export function SetupForm({ onSubmit, isLoading = false }: SetupFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [canCreate, setCanCreate] = useState(false);
  const { activeAccount } = useWallet();
  const [selectedTools, setSelectedTools] = useState<Web3Tool[]>([]);
  const [viewableToolForm, setViewableToolForm] = useState<Web3Tool | null>(
    null
  );

  useEffect(() => {
    if (activeAccount) {
      setCanCreate(true);
    }
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
            Connect a wallet to create
          </h2>
          <p className="text-text/70 text-center">
            Connect a wallet to create a weDev project and enable web3
            functionalities to your users
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
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto rounded-xl shadow-lgtext"
      >
        <h2 className="text-3xl text-white font-bold">Wedev Launchpad 🚀</h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto bg-surface p-8 rounded-xl shadow-lg"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-heading mb-2">
            WeDev Launchpad – Build Your Web3 Experience on Algorand
          </h2>
        </div>
        <h3 className="text-text font-medium mb-6 text-sm ">
          Launch your decentralized application (dApp) effortlessly with WeDev.
          Customize your project with powerful Web3 tools, governance modules,
          and token-based access controls – all deployed securely on the
          Algorand blockchain. No complexity, just your vision brought to life.
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-text font-medium mb-2">
              1 - Project name
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-4 py-3 rounded-lg bg-background text-text placeholder-text/50 border border-text/10 focus:outline-none focus:border-primary transition-colors"
              required
              minLength={5}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-text font-medium mb-2">
              2 - Select Web3 Tool options for your dApp
            </label>

            <div className="flex gap-4 text-white flex-wrap">
              {Web3ToolsList.map((tool) => {
                const isChecked = selectedTools.some(
                  (t) => t.toolId === tool.toolId
                );
                return (
                  <label key={tool.toolId} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedTools((prev) =>
                          checked
                            ? [...prev, tool]
                            : prev.filter((t) => t.toolId !== tool.toolId)
                        );
                      }}
                      className="accent-primary"
                    />
                    {tool.description}
                  </label>
                );
              })}
            </div>

            <p className="mt-1 text-sm text-text/70">
              Select one or more Web3 tools to include in your dApp.
            </p>
          </div>

          {selectedTools.length > 0 && (
            <div className="mt-6">
              <h4 className="text-text font-semibold mb-2">
                3 - Setup the contract parameters
              </h4>
              <div className="grid gap-4">
                {selectedTools.map((tool) => (
                  <div
                    key={tool.toolId}
                    className="p-4 rounded-lg text-white border border-primary/20 bg-background shadow"
                  >
                    <h5 className="text-lg font-bold capitalize">
                      {tool.name}
                    </h5>
                    <div>
                      {tool.callParams.map((param) => (
                        <div key={param.paramName} className="mb-2">
                          <label
                            htmlFor={param.paramName}
                            className="block text-text font-medium mb-1"
                          >
                            {param.paramName}
                          </label>
                          <input
                            id={param.paramName}
                            type={param.type}
                            placeholder={`Enter ${param.paramName}`}
                            className="w-full px-4 py-3 rounded-lg bg-background text-text placeholder-text/50 border border-text/10 focus:outline-none focus:border-primary transition-colors"
                            required
                            minLength={5}
                            maxLength={100}
                          />
                        </div>
                      ))}
                    </div>
                    {/* Add custom form fields for each tool if needed */}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              px-6 py-3 roundedstring-lg font-semibold text-background
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
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
