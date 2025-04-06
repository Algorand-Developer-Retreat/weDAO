import { useEffect, useState, useContext } from "react";
import { Proposal } from "../interfaces/proposals";
import { ProposalList } from "./proposalList";
import { TabOptionInterface, Tabs } from "./tabs";
import { getProposals } from "../contract-methods/holders-contract/proposals";
import { getProposals as getRewardProposals } from "../contract-methods/reward-contract/proposals";
import AnimButton from "./animButton";
import { useNavigate } from "@remix-run/react";
import { useWallet } from "@txnlab/use-wallet-react";
import { VoteContext } from "../context/vote";
export function MainContainer() {
  const tabOptions: TabOptionInterface[] = [
    {
      label: "All",
      enabled: true,
    },
    {
      label: "Active",
      enabled: true,
    },
    {
      label: "Closed",
      enabled: true,
    },
  ];
  const [currentTab, setCurrentTab] = useState<TabOptionInterface>(
    tabOptions[0]
  );

  const [proposalList, setProposalList] = useState<Proposal[]>([]);

  const [loadingProposals, setLoadingProposals] = useState(true);
  const { displayVoteModal } = useContext(VoteContext);
  const { activeAccount } = useWallet();

  async function loadProposals(): Promise<Proposal[]> {
    const proposals = await getProposals();
    const rewardProposals = await getRewardProposals();
    return [...proposals, ...rewardProposals];
  }
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingProposals(true);
    loadProposals().then((retreivedProposals: Proposal[]) => {
      const activeProposals = retreivedProposals.filter((proposal) => {
        if (currentTab.label === "All") {
          return proposal;
        } else {
          return proposal.status === currentTab.label.toLowerCase();
        }
      });
      setProposalList(activeProposals);
      setLoadingProposals(false);
    });
  }, [currentTab, displayVoteModal]);

  function onSwitchTab(tab: string) {
    const newTab = tabOptions.find((option) => option.label === tab);
    if (newTab) {
      setCurrentTab(newTab);
    }
  }

  return (
    <div className=" h-screen w-full space-y-5 pb-24 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between gap-2">
        <Tabs options={tabOptions} onClickHandler={onSwitchTab} />
        {activeAccount ? (
          <AnimButton
            onClick={() => {
              navigate("/create");
            }}
          >
            Create
          </AnimButton>
        ) : null}
      </div>
      <div className="flex flex-col  w-full pb-14">
        <ProposalList
          proposals={proposalList.sort((a, b) => b.expiresIn - a.expiresIn)}
          loadingProposals={loadingProposals}
        />
      </div>
    </div>
  );
}
