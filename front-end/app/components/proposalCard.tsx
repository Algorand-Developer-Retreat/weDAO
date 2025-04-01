
interface ProposalCardProps {
  title: string;
  description: string;
  yesPercent: number;
  noPercent: number;
  timeLeft: string;
}

export const ProposalCard = ({
  title,
  description,
  yesPercent,
  noPercent,
  timeLeft,
}: ProposalCardProps) => {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-md text-text max-w-xl w-full">
      {/* Title + Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-heading text-xl font-bold">{title}</h3>
          <p className="text-sm text-text/80">{description}</p>
        </div>
        <span className="bg-primary text-background text-xs font-bold px-3 py-1 rounded-full">
          Open
        </span>
      </div>

      {/* Vote Bars */}
      <div className="space-y-2 mt-3">
        {/* YES */}
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-yes">Yes</span>
          <span className="text-yes">{yesPercent}%</span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="bg-yes h-full"
            style={{ width: `${yesPercent}%` }}
          ></div>
        </div>

        {/* NO */}
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-no">No</span>
          <span className="text-no">{noPercent}%</span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="bg-no h-full"
            style={{ width: `${noPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs text-text/60">{timeLeft} remaining</p>
        <button className="bg-vote text-white text-sm font-medium px-4 py-1.5 rounded-full hover:opacity-90 transition">
          Vote
        </button>
      </div>
    </div>
  );
};
