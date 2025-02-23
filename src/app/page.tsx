// src/app/page.tsx

"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl }  from "@solana/web3.js";
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

import CreateWallet from "./components/CreateWallet";
import ConnectWalletInfo from "./components/ConnectWallet";


const App = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(()=> clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new SolflareWalletAdapter(), new PhantomWalletAdapter()],
    []
  );

   return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Solana Wallet Manager</h1>
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
              <ConnectWalletInfo />
              <CreateWallet />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
