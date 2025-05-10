// components/popup-notice.tsx
"use client"

import { useState } from "react"
import { FiX, FiCopy, FiGift } from "react-icons/fi"
import { motion } from "framer-motion"
import { useWallet } from "@lazorkit/wallet"

export default function PopupNotice() {
  const [showPopup, setShowPopup] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const {smartWalletAuthorityPubkey} = useWallet()
  const handleCopy = async () => {
    await navigator.clipboard.writeText(smartWalletAuthorityPubkey)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  if (!showPopup) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
    className="fixed bottom-6 left-[70%] transform -translate-x-1/2 bg-gradient-to-br from-[#1e1e2f]/80  to-[#2b4a77]/80 text-white p-5 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)] z-50 max-w-sm w-[85%] border border-white/20 backdrop-blur-lg"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <FiGift className="w-6 h-6 text-yellow-300 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Test Drive the App 🚀</h3>
              <p className="text-sm opacity-90 mt-1">
                Get free SOL airdrop to start swapping
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPopup(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-ro">
          <a
            href="https://lazor-drop.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-semibold"
          >
            <FiGift className="w-4 h-4" />
            Claim Airdrop
          </a>
        </div>
      </div>
    </motion.div>
  )
}