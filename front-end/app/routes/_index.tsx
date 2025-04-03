import type { MetaFunction } from "@remix-run/node";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { WalletConnectionModal } from "../components/walletConnectModal";
import { MainContainer } from "../components/mainContainer";
import { VoteModal } from "../components/voteModal";
import { Footer } from "../components/footer";
export const meta: MetaFunction = () => {
  return [
    { title: "weDAO" },
    { name: "Community DAO tools for everyone!", content: "weDAO" },
  ];
};

export default function Index() {
  return (
    <div className="h-screen space-y-5 mx-6 justify-center ">
      <Header />
      <div className="flex flex-col pt-10">
        <Hero />
        <MainContainer /> 
      </div>
      <Footer />
      <WalletConnectionModal />
      <VoteModal />
    </div>
  );
}
