import type { MetaFunction } from "@remix-run/node";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { WalletConnectionModal } from "../components/walletConnectModal";
import { MainContainer } from "../components/mainContainer";
import { VoteModal } from "../components/voteModal";
export const meta: MetaFunction = () => {
  return [
    { title: "weDAO" },
    { name: "description", content: "weDAO" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen justify-center space-y-5  ">
      <Header />
      <div className="flex flex-col pt-10">
        <Hero />
        <MainContainer />
      </div>
      <WalletConnectionModal />
      <VoteModal />
    </div>
  );
}
