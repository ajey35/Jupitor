// app/page.tsx
import Navbar from "@/components/navbar"
import SwapContainer from "@/components/swap-container"
import PopupNotice from "@/components/popup-notice"

export const metadata = {
  title: "SolSwap - Swap tokens on Solana",
  description: "Swap tokens on Solana with the best rates",
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <SwapContainer />
      </div>
      <PopupNotice />
    </main>
  )
}