import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import {
  TokenSwap,
  CurveType,
  TOKEN_SWAP_PROGRAM_ID,
} from "@solana/spl-token-swap";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
} from "@solana/spl-token";

// Load an existing token swap pool
export const loadTokenSwap = async (
  connection: Connection,
  tokenSwapAddress: PublicKey,
  payer: Keypair
): Promise<TokenSwap> => {
  try {
    return await TokenSwap.loadTokenSwap(
      connection,
      tokenSwapAddress,
      TOKEN_SWAP_PROGRAM_ID,
      payer
    );
  } catch (error) {
    console.error("Failed to load token swap:", error);
    throw error;
  }
};

// Create a new token swap pool
export const createTokenSwap = async (
  connection: Connection,
  payer: Keypair,
  tokenAMint: PublicKey,
  tokenBMint: PublicKey,
  tokenAAmount: bigint,
  tokenBAmount: bigint
) => {
  try {
    const tokenSwapAccount = Keypair.generate();

    const [authority] = await PublicKey.findProgramAddressSync(
      [tokenSwapAccount.publicKey.toBuffer()],
      TOKEN_SWAP_PROGRAM_ID
    );

    const poolTokenMint = await createMint(
      connection,
      payer,
      authority,
      null,
      2
    );

    const tokenAccountA = await createAccount(
      connection,
      payer,
      tokenAMint,
      authority
    );

    const tokenAccountB = await createAccount(
      connection,
      payer,
      tokenBMint,
      authority
    );

    const feeAccount = await createAccount(
      connection,
      payer,
      poolTokenMint,
      payer.publicKey
    );

    const destinationAccount = await createAccount(
      connection,
      payer,
      poolTokenMint,
      payer.publicKey
    );

    await mintTo(connection, payer, tokenAMint, tokenAccountA, payer, tokenAAmount);
    await mintTo(connection, payer, tokenBMint, tokenAccountB, payer, tokenBAmount);

    const tokenSwap = await TokenSwap.createTokenSwap(
      connection,
      payer,
      tokenSwapAccount,
      authority,
      tokenAccountA,
      tokenAccountB,
      poolTokenMint,
      tokenAMint,
      tokenBMint,
      feeAccount,
      destinationAccount,
      TOKEN_SWAP_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      BigInt(25),     // trade fee numerator
      BigInt(10000),  // trade fee denominator
      BigInt(5),
      BigInt(10000),
      BigInt(0),
      BigInt(0),
      BigInt(20),
      BigInt(100),
      CurveType.ConstantProduct
    );

    return {
      tokenSwap,
      tokenSwapAccount,
      poolTokenMint,
      tokenAccountA,
      tokenAccountB,
      feeAccount,
      destinationAccount,
    };
  } catch (error) {
    console.error("Failed to create token swap:", error);
    throw error;
  }
};

// Execute a token swap
export const executeSwap = async (
  connection: Connection,
  tokenSwap: TokenSwap,
  userSourceTokenAccount: PublicKey,
  userDestinationTokenAccount: PublicKey,
  userTransferAuthority: Keypair,
  amountIn: bigint,
  minimumAmountOut: bigint
): Promise<string> => {
  try {
    const txId = await tokenSwap.swap(
      userSourceTokenAccount,
      tokenSwap.tokenAccountA,
      tokenSwap.tokenAccountB,
      userDestinationTokenAccount,
      tokenSwap.mintA,
      tokenSwap.mintB,
      TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      null, // host fee account
      userTransferAuthority,
      amountIn,
      minimumAmountOut
    );

    return txId;
  } catch (error) {
    console.error("Swap failed:", error);
    throw error;
  }
};
