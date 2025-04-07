/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from "@txnlab/use-wallet-react";
import { useContext, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { WalletContext } from "../context/wallet";
import * as algokit from "@algorandfoundation/algokit-utils";
import AnimButton from "./animButton";
import { useToast } from "./toast";

export const WalletConnectionModal: React.FC = () => {
  const { wallets } = useWallet();
  const [loading, setLoading] = useState(false);
  const {
    displayWalletConnectModal,
    setDisplayWalletConnectModal,
    addNFDIfAvailable,
  } = useContext(WalletContext);
  const { showToast } = useToast();
  async function handleOnConnect(wallet: any) {
    setLoading(true);
    wallet.connect().then(async () => {
      setDisplayWalletConnectModal(false);
      const algorand = algokit.AlgorandClient.testNet();
      algorand.setDefaultSigner(wallet.signer);
      setLoading(false);
      showToast("Wallet connected successfully!", "success");
    });
  }

  return displayWalletConnectModal ? (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-transparent "></div>
        <div className="relative z-50 w-full max-w-lg p-4">
          <div className="flex justify-center items-center transform overflow-hidden rounded-3xl text-left shadow-2xl transition-all bg-background dark:text-white">
            <div className="w-full p-4">
              <div className="flex justify-end">
                <RxCross1
                  className="cursor-pointer dark:text-white font-bold"
                  size={16}
                  onClick={async () => {
                    setDisplayWalletConnectModal(false);
                  }}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-4xl text-white font-bold">
                  Connect Wallet
                </h3>
              </div>
              <br />
              <div className=" grid grid-cols-2 cursor-pointer ">
                {wallets?.map((wallet) => (
                  <div
                    key={`wallet-${wallet.metadata.name}`}
                    className="flex gap-4 p-4  rounded-full text-fred hover:font-bold hover:scale-105 transition-all justify-center items-center"
                    onClick={() => handleOnConnect(wallet)}
                  >
                    <div className=" items-center justify-center">
                      <div className="rounded-full h-16 w-16 overflow-hidden bg-transparent">
                        <img
                          src={wallet.metadata.icon}
                          alt="wallet-logo"
                          className="h-16 w-16"
                          width={16}
                          height={16}
                        />
                      </div>

                      <div className="w-full flex justify-center">
                        <p className="font-bold">{wallet.metadata.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <AnimButton onClick={() => setDisplayWalletConnectModal(false)}>
                  Close
                </AnimButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
