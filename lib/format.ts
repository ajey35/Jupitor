export function formatTokenAmount(amount: number, decimals = 6, maxDecimals = 6): string {
  if (amount === 0) return "0"

  const fixed = amount.toFixed(maxDecimals > decimals ? decimals : maxDecimals)
  return Number.parseFloat(fixed).toString()
}

export function calculateUsdValue(amount: string, price?: number): string {
  if (!amount || !price) return "0.00"

  const value = Number.parseFloat(amount) * price
  if (isNaN(value)) return "0.00"

  // Format with 2 decimal places for small values, more for very small values
  if (value < 0.01 && value > 0) {
    return value.toFixed(6)
  }
  return value.toFixed(2)
}
