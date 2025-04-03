import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@remix-run/react";
import { useToast } from "./toast";
import { FaTrophy } from "react-icons/fa";
interface ProposalFormProps {
  onSubmit: (
    title: string, 
    description: string, 
    expiryTimestamp: number,
    assetId: number,
    amount: number,
    votePrice: number
  ) => Promise<void>;
  isLoading?: boolean;
}

interface AssetOption {
  id: number;
  name: string;
  unit_name?: string;
  decimals: number;
  logo?: string;
}

interface AssetData {
  name: string;
  unit_name?: string;
  decimals: number;
  logo?: string;
}

export function ProposalFormRewards({ onSubmit, isLoading = false }: ProposalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<AssetOption | null>(null);
  const [amount, setAmount] = useState("");
  const [votePrice, setVotePrice] = useState("");
  const [availableAssets, setAvailableAssets] = useState<AssetOption[]>([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('https://asa-list.tinyman.org/assets.json');
        const data: Record<string, AssetData> = await response.json();
        const assets: AssetOption[] = Object.entries(data).map(([id, asset]) => ({
          id: parseInt(id),
          name: asset.name,
          unit_name: asset.unit_name,
          decimals: asset.decimals,
          logo: asset.logo,
        }));
        setAvailableAssets(assets);
      } catch (error) {
        showToast("Failed to load assets", "error");
      }
    };

    fetchAssets();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset) {
      showToast("Please select an asset", "error");
      return;
    }

    try {
      // Convert the expiry date to a timestamp (seconds since epoch)
      const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);
      
      // Convert amount to microunits based on asset decimals
      const microAmount = Math.floor(parseFloat(amount) * Math.pow(10, selectedAsset.decimals));
      
      // Convert vote price to microunits
      const microVotePrice = Math.floor(parseFloat(votePrice) * Math.pow(10, selectedAsset.decimals));

      await onSubmit(
        title, 
        description, 
        expiryTimestamp,
        selectedAsset.id,
        microAmount,
        microVotePrice
      ).then(() => {
        showToast("Proposal created successfully!", "success");
        navigate("/");
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to create proposal", "error");
    }
  };

  // Calculate minimum date (current date/time)
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm

  // Calculate maximum date (1 year from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateTime = maxDate.toISOString().slice(0, 16);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-surface p-8 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-heading mb-2">Create a proposal with rewards</h2>
        <div className="flex items-center gap-2">
          <FaTrophy className="w-10 h-10 text-text" />
        </div>
      </div>
      <h3 className="text-text font-medium mb-6 text-sm ">
        Reward proposals have an initial prize pool which is added to with each voters vote. The prize pool is then distributed to everyone that voted!
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

        <div>
          <label htmlFor="asset" className="block text-text font-medium mb-2">
            Select Asset
          </label>
          <select
            id="asset"
            value={selectedAsset?.id || ""}
            onChange={(e) => {
              const asset = availableAssets.find(a => a.id === parseInt(e.target.value));
              setSelectedAsset(asset || null);
            }}
            className="w-full px-4 py-3 rounded-lg bg-background text-text border border-text/10 focus:outline-none focus:border-primary transition-colors"
            required
          >
            <option value="">Select an asset</option>
            {availableAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.unit_name || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-text font-medium mb-2">
            Amount ({selectedAsset?.unit_name || 'Select an asset'})
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 rounded-lg bg-background text-text placeholder-text/50 border border-text/10 focus:outline-none focus:border-primary transition-colors"
            required
            min="0"
            step="any"
          />
          {selectedAsset && (
            <p className="mt-1 text-sm text-text/70">
              Amount in microunits: {amount ? Math.floor(parseFloat(amount) * Math.pow(10, selectedAsset.decimals)) : 0}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="votePrice" className="block text-text font-medium mb-2">
            Vote Price ({selectedAsset?.unit_name || 'Select an asset'})
          </label>
          <input
            id="votePrice"
            type="number"
            value={votePrice}
            onChange={(e) => setVotePrice(e.target.value)}
            placeholder="Enter vote price"
            className="w-full px-4 py-3 rounded-lg bg-background text-text placeholder-text/50 border border-text/10 focus:outline-none focus:border-primary transition-colors"
            required
            min="0"
            step="any"
          />
          {selectedAsset && (
            <p className="mt-1 text-sm text-text/70">
              Vote price in microunits: {votePrice ? Math.floor(parseFloat(votePrice) * Math.pow(10, selectedAsset.decimals)) : 0}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-text font-medium mb-2">
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