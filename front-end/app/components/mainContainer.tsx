import { useEffect, useState } from "react";
import { Proposal } from "../interfaces/proposals";
import { ProposalList } from "./proposalList";
import { TabOptionInterface, Tabs } from "./tabs";
import { getProposals } from "../contract-methods/proposals";
import AnimButton from "./animButton";
import { useNavigate } from "@remix-run/react";
import { useWallet } from "@txnlab/use-wallet-react";


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
  const {activeAccount} = useWallet();

  async function loadProposals(): Promise<Proposal[]> {
    const proposals = await getProposals();
    return proposals;
  }
  const navigate = useNavigate();

  useEffect(() => {
    loadProposals().then((retreivedProposals: Proposal[]) => {
      const activeProposals = retreivedProposals.filter((proposal) => {
        if (currentTab.label === "All") {
          return proposal;
        } else {
          return proposal.status === currentTab.label.toLowerCase();
        }
      });
      console.log("active proposals", activeProposals);
      setProposalList(activeProposals);
    });
  }, [currentTab]);

  function onSwitchTab(tab: string) {
    const newTab = tabOptions.find((option) => option.label === tab);
    if (newTab) {
      setCurrentTab(newTab);
    }
  }

  return (
    <div className=" h-screen w-full space-y-5 pb-24 mx-auto">
      <div className=" justify-center flex flex-col gap-2">
        <Tabs options={tabOptions} onClickHandler={onSwitchTab} />
        {activeAccount ? <AnimButton onClick={() => {navigate('/create')}} >Create Proposal</AnimButton> : null}
      </div>
      <div className="flex flex-col  w-full">
        <ProposalList proposals={proposalList} />
      </div>
    </div>
  );
}
