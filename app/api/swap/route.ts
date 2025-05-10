import { NextResponse } from "next/server";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58"; // Optional, if you need base58 encoding
import axios from "axios";

// Constants
const SOLANA_RPC_URL = "https://api.devnet.solana.com";
const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap";

export async function POST(request: Request) {
  try {
    const { fromToken, toToken, amount, slippage, walletAddress } = await request.json();

    if (!fromToken || !toToken || !amount || !walletAddress) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const inputMint = new PublicKey(fromToken);
    const outputMint = new PublicKey(toToken);
    const userPublicKey = new PublicKey(walletAddress);
    const parsedAmount = parseFloat(amount);
    const slippageBps = slippage ? parseFloat(slippage) * 100 : 50; // 0.5%

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const connection = new Connection(SOLANA_RPC_URL, "confirmed");

    // Step 1: Fetch quote from Jupiter
    const quoteResponse = await axios.get(JUPITER_QUOTE_API, {
      params: {
        inputMint: inputMint.toBase58(),
        outputMint: outputMint.toBase58(),
        amount: Math.round(parsedAmount * 1e9), // Lamports
        slippageBps,
      },
    });

    const quote = quoteResponse.data;
    if (!quote?.routes?.length) {
      return NextResponse.json({ error: "No available routes for this swap" }, { status: 400 });
    }

    const route = quote.routes[0];

    // Step 2: Get swap transaction
    const swapResponse = await axios.post(JUPITER_SWAP_API, {
      route,
      userPublicKey: userPublicKey.toBase58(),
      wrapUnwrapSOL: true,
      feeAccount: null,
    });

    const { swapTransaction } = swapResponse.data;

    if (!swapTransaction) {
      return NextResponse.json({ error: "Failed to build swap transaction" }, { status: 500 });
    }

    const transactionBuffer = Buffer.from(swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    // 🔐 In a real app: sign this tx with the user's wallet via frontend
    const txid = await connection.sendRawTransaction(transaction.serialize());

    return NextResponse.json({
      success: true,
      txId: txid,
      amountIn: amount,
      amountOut: (parsedAmount * 0.0349).toFixed(4), // Simulated output
      fee: (parsedAmount * 0.0025).toFixed(4),
    });
  } catch (error: any) {
    console.error("Swap error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute swap" }, { status: 500 });
  }
}
