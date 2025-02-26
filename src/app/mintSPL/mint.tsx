"use client";

import { useState } from "react";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const CreateMint = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [mintTx, setMintTx] = useState("");
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  const connectionErr = () => {
    if (!publicKey || !connection) {
      toast.error("Please connect wallet");
      return true;
    }
    return false;
  };

  const createMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionErr()) return;

    try {
      // Generate a new keypair for the mint account
      const tokenMint = web3.Keypair.generate();

      // Get minimum lamports needed for rent exemption
      const lamports = await token.getMinimumBalanceForRentExemptAccount(
        connection
      );

      // Create transaction for token mint
      const transaction = new web3.Transaction().add(
        // Create account instruction
        web3.SystemProgram.createAccount({
          fromPubkey: publicKey as web3.PublicKey,
          newAccountPubkey: tokenMint.publicKey,
          space: token.MINT_SIZE,
          lamports,
          programId: token.TOKEN_PROGRAM_ID,
        }),
        // Initialize mint instruction
        token.createInitializeMintInstruction(
          tokenMint.publicKey,
          6, // Number of decimals
          publicKey as web3.PublicKey, // Mint authority
          publicKey, // Freeze authority (optional)
          token.TOKEN_PROGRAM_ID
        )
      );

      // Send and confirm transaction
      const signature = await sendTransaction(transaction, connection, {
        signers: [tokenMint],
      });

      await connection.confirmTransaction(signature, "confirmed");

      setMintTx(signature);
      setMintAddress(tokenMint.publicKey.toString());
      toast.success(`Token mint created: ${tokenMint.publicKey.toString()}`);
    } catch (err) {
      console.error("Error creating mint:", err);
      toast.error("Failed to create token mint");
    }
  };

  const mintOutput = [
    {
      title: "Token Mint address: ",
      dependency: mintAddress,
      href: mintAddress
        ? `https://explorer.solana.com/address/${mintAddress.toString()}?cluster=devnet`
        : "",
    },
    {
      title: "Mint transaction signature",
      dependency: mintTx,
      href: mintTx
        ? `https://explorer.solana.com/address/${mintTx.toString()}?cluster=devnet`
        : "",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create SPL Token</h2>
      <button
        onClick={createMint}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!publicKey}
      >
        Create Token
      </button>

      {mintAddress && (
        <div className="mt-4">
          <p>Mint Address: {mintAddress}</p>
          <p>Transaction: {mintTx}</p>
        </div>
      )}
    </div>
  );
}

export default CreateMint;