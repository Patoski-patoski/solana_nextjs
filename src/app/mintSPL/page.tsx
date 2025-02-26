// src/app/wallets/page.tsx

"use client";

import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import Card, {CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import CreateMint from "./mint"

export default function WalletPage() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new SolflareWalletAdapter(), new PhantomWalletAdapter()],
    []
  );

  return (
    <div className="flex justify-center items-center min-h-screen py-10">
      <div className="container max-w-2xl">
        <Card className="flex bg-512da8 flex-col items-center justify-center">
          <CardHeader className="w-full">
            <CardTitle className="text-3xl font-bold text-center mb-8">
              Solana Wallet Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <div className="px-4 py-8 w-full">
                    <CreateMint />
                  </div>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
