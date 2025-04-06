// AppProviders.tsx

import { ReactNode } from "react";
import { ToastProvider } from "./components/toast";
import { AsaMetadataProvider } from "./context/asametadata";
import { VoteProvider } from "./context/vote";
import { WalletContextProvider } from "./context/wallet";
import { Providers } from "./services/providers";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <WalletContextProvider>
        <VoteProvider>
          <ToastProvider>
            <AsaMetadataProvider>{children}</AsaMetadataProvider>
          </ToastProvider>
        </VoteProvider>
      </WalletContextProvider>
    </Providers>
  );
}
