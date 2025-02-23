"use client";

import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

interface WalletData {
  publicKey: string;
  secretKey: string;
}

const CreateWallet = () => {
  const { connected } = useWallet();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const newWallet = () => {
    if (!connected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const newKeyPair = Keypair.generate();
      console.log("New key Pair:", newKeyPair);
      const publicKey = newKeyPair.publicKey.toString();
      console.log("public Key:", publicKey);
      const secretKey = bs58.encode(newKeyPair.secretKey);
      console.log("secreKey", secretKey);
      setWallet({ publicKey, secretKey });

      sessionStorage.setItem("solanaWalletPublicKey", publicKey);
      console.log("New wallet Created:", publicKey);
    } catch (error) {
      console.error("Error creating wallet", error);
    }
  };

  const copyToClipBoard = async (text: string) => {
    if (navigator && navigator.clipboard) {
      try {
         await navigator.clipboard.writeText(text);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
        console.log("Address copied to clipboard!");
      } catch (err) {
        console.error("Error copying address: ", err);
      }
    } else {
      console.error("Clipboard API not supported in this browser.");
    }
  };

  return (
    <div className="text-center p-4 bg-gray-800 text-white rounded-lg">
      <button
        onClick={newWallet}
        disabled={!connected}
        className={`px-4 py-2 rounded-md ${
          connected
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-600 cursor-not-allowed"
        } text-white`}
      >
        {connected ? "Create New Wallet" : "Connect Wallet to Create"}
      </button>

      {!connected && (
        <p className="mt-2 text-yellow-400 text-sm">
          Please connect your wallet first to create a new wallet
        </p>
      )}

      {wallet && (
        <div className="mt-4 bg-gray-700 p-4 rounded-md">
          <p className="mb-2">
            <strong>Public Key:</strong>{" "}
            <span className="break-all">{wallet.publicKey}</span>
            <button
              onClick={() => copyToClipBoard(wallet.publicKey)}
              className="ml-2 px-2 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </p>

          <div>
            <strong>Secret Key:</strong>
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="ml-2 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-md text-sm"
            >
              {showSecret ? "Hide" : "Show"}
            </button>

            {showSecret && (
              <div className="mt-2">
                <div className="p-2 bg-yellow-400 text-black rounded-md mb-2">
                  <p className="text-sm font-bold">
                    ⚠️ Warning: Never share your secret key!
                  </p>
                </div>
                <textarea
                  value={wallet.secretKey}
                  readOnly
                  className="w-full p-2 bg-gray-200 text-black rounded-md"
                  rows={3}
                />
                <button
                  onClick={() => copyToClipBoard(wallet.secretKey)}
                  className="mt-2 px-2 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm"
                >
                  {copied ? "Copied!" : "Copy Secret Key"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWallet;
