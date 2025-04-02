'use client'

import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'

const walletManager = new WalletManager({
  wallets: [
    WalletId.DEFLY,
    WalletId.PERA,
    {
      id: WalletId.LUTE,
      options: { siteName: import.meta.env.VITE_PROJECT_NAME }
    },
  ],
  defaultNetwork: NetworkId.MAINNET
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider manager={walletManager}>{children}</WalletProvider>
}
