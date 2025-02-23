// src/app/wallet/fundSolana.tsx
"use client";

import { useCallback, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { toast } from "sonner";

const WalletInfo = () => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [copied, setCopied] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

//   const walletAddress = publicKey?.toString();

  const copyAddress = useCallback(async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toBase58());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy address", err);
      }
    }
  }, [publicKey]);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [connection, publicKey]);

  const requestAirdrop = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);
      await fetchBalance();
      toast.success("Airdrop successful!");
    } catch (error) {
      console.error("Error requesting airdrop:", error);
        toast.error("Airdrop failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendSol = async () => {
    if (!publicKey || !recipientAddress || !amount) return;
    setLoading(true);
    try {
      const recipientPubKey = new PublicKey(recipientAddress);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      await fetchBalance();
      toast.success("Transaction successful!");
      setRecipientAddress("");
      setAmount("");
    } catch (error) {
      console.error("Error sending SOL:", error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance when wallet connects
  useCallback(() => {
    if (connected) {
      fetchBalance();
    }
  }, [connected, fetchBalance]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-6 w-full">
      <h2 className="text-2xl mb-4 text-center">Connect your Solana Wallet</h2>
      <div className="flex justify-center gap-3 mb-4">
        <WalletMultiButton />
      </div>

      <div className="mt-4 p-4 bg-gray-700 rounded-md text-white w-full">
        <h4 className="text-lg text-center">Connected wallet:</h4>
        {connected ? (
          <div className="p-2 bg-green-600 rounded-md flex justify-between items-center">
            <p className="break-all text-center">{publicKey?.toBase58()}</p>
            <button
              onClick={copyAddress}
              className="ml-2 px-2 py-1 bg-green-800 rounded-md text-sm"
            >
              {copied ? "Copied" : "Copy address"}
            </button>
          </div>
        ) : (
          <p className="p-2 bg-yellow-600 rounded-md text-center">
            No wallet connected
          </p>
        )}
      </div>

      {connected && (
        <>
          <div className="space-y-4 mt-8 w-full">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Your SOL Balance</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={fetchBalance}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  onClick={requestAirdrop}
                  disabled={loading}
                >
                  Request Airdrop
                </Button>
              </div>
            </div>
            <p className="text-xl font-bold">{solBalance.toFixed(4)} SOL</p>
          </div>

          <div className="space-y-4 mt-8 w-full">
            <h3 className="text-lg font-medium">Send SOL</h3>
            <div className="space-y-2">
              <Input
                placeholder="Recipient Address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-gray-700 text-white"
              />
              <Input
                placeholder="Amount in SOL"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-700 text-white"
              />
              <Button
                className="w-full"
                onClick={sendSol}
                disabled={loading || !recipientAddress || !amount}
              >
                Send SOL
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletInfo;
