import { Connection, PublicKey, Transaction, Keypair } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

// Constants
export const SOLANA_RPC_URL = "https://api.devnet.solana.com";
export const WSOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");

// Create a Solana connection
export const getConnection = (): Connection => {
  return new Connection(SOLANA_RPC_URL, "confirmed");
};

// Get or create an associated token account
export const getOrCreateAssociatedTokenAccount = async (
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> => {
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    owner,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
  if (accountInfo !== null) {
    return associatedTokenAddress; // account already exists
  }

  const transaction = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      associatedTokenAddress,
      owner,
      mint,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );

  await connection.sendTransaction(transaction, [payer]);
  return associatedTokenAddress;
};

// Format lamports to SOL
export const lamportsToSol = (lamports: number): number => {
  return lamports / 10 ** 9;
};

// Format SOL to lamports
export const solToLamports = (sol: number): number => {
  return sol * 10 ** 9;
};

// Shorten a public key for display
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
