// components/ConnectWallet.tsx

"use client";

import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

const ConnectWalletInfo = () => {
  const { publicKey, connected } = useWallet();
  const [copied, setCopied] = useState(false);
  const walletAddress = publicKey;

  useCallback(() => {
    console.log("walletAddress", walletAddress);
    console.log(walletAddress?.toBase58());

  }, [walletAddress]);

  const copyAddress = useCallback(async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress?.toBase58());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy Address", err);
      }
    }
  }, [walletAddress]);


  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl mb-4">Connect Your Solana Wallet</h2>
      <div className="flex gap-3">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>

      <div className="mt-4 p-4 bg-gray-700 rounded-md text-white">
        <h4 className="text-lg">Wallet Status</h4>
        {connected ? (
          <div className="p-2 bg-green-600 rounded-md flex justify-between items-center">
            <p className="break-all">{walletAddress?.toBase58()}</p>
            <button
              onClick={copyAddress}
              className="ml-2 px-2 py-1 bg-green-800 rounded-md text-sm"
            >
              {copied ? "Copied" : "Copy Address"}
            </button>
          </div>
        ) : (
          <p className="p-2 bg-yellow-600 rounded-md">
            No wallet connected. Please connect one.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConnectWalletInfo;
