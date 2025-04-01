import type { MetaFunction } from "@remix-run/node";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { WalletConnectionModal } from "../components/walletConnectModal";
import { ProposalList } from "../components/proposalList";
import { testProposals } from "../data/test-proposals";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen justify-center space-y-5  ">
      <Header />
      <div className="flex flex-col ">
        <Hero />
        <ProposalList proposals={testProposals} />
      </div>
      <WalletConnectionModal />
    </div>
  );
}
