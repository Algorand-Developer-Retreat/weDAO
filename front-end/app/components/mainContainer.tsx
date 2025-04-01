import { useEffect, useState } from "react";
import { Proposal } from "../interfaces/proposals";
import { ProposalList } from "./proposalList";
import { getProposals } from "../data/test-proposals";
import { TabOptionInterface, Tabs } from "./tabs";

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

  async function loadProposals(): Promise<Proposal[]> {
    const proposals = await getProposals();
    return proposals;
  }

  useEffect(() => {
    loadProposals().then((retreivedProposals: Proposal[]) => {
      const activeProposals = retreivedProposals.filter(
        (proposal) => {
            if (currentTab.label === "All") {
                return proposal;
            } else {
                return proposal.status === currentTab.label.toLowerCase();
            }
        }
      );
      console.log('active proposals', activeProposals);
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
    <div className=" h-screen justify-center space-y-5  ">
      <div className="flex ">
        <Tabs options={tabOptions} onClickHandler={onSwitchTab} />
      </div>
      <div className="flex flex-col">
        <ProposalList proposals={proposalList} />
      </div>
    </div>
  );
}
