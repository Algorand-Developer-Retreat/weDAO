import type { MetaFunction } from "@remix-run/node";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { WalletConnectionModal } from "../components/walletConnectModal";
import { MainContainer } from "../components/mainContainer";
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
        <MainContainer />
      </div>
      <WalletConnectionModal />
    </div>
  );
}
