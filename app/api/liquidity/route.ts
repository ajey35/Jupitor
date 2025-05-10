import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { getConnection } from "@/lib/solana"; // You'll need this helper

type AddLiquidityRequest = {
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  walletAddress: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AddLiquidityRequest;
    const { tokenA, tokenB, amountA, amountB, walletAddress } = body;

    if (
      !tokenA || !tokenB || !amountA || !amountB || !walletAddress ||
      typeof tokenA !== "string" ||
      typeof tokenB !== "string" ||
      typeof walletAddress !== "string"
    ) {
      return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
    }

    const parsedAmountA = parseFloat(amountA);
    const parsedAmountB = parseFloat(amountB);

    if (isNaN(parsedAmountA) || isNaN(parsedAmountB)) {
      return NextResponse.json({ error: "Invalid amount format" }, { status: 400 });
    }

    try {
      new PublicKey(walletAddress);
    } catch {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const connection = getConnection(); // Optional usage

    // Simulated response
    const simulatedTxId = "SimTx_" + Math.random().toString(36).slice(2, 10);
    const simulatedLpTokens = ((parsedAmountA * parsedAmountB) / 100).toFixed(6);
    const poolShare = ((parsedAmountA * parsedAmountB) / 1000).toFixed(2);

    await new Promise((res) => setTimeout(res, 1000)); // Simulate latency

    return NextResponse.json({
      success: true,
      txId: simulatedTxId,
      lpTokens: simulatedLpTokens,
      poolShare,
    });
  } catch (error: any) {
    console.error("Add liquidity error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
