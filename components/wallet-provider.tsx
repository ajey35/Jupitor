"use client"

import type React from "react"

import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { MockLazorkitProvider, useMockLazorkit, MockConnectionStatus } from "@/lib/mock-wallet"
import type { PublicKey } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"

// Create a context for the wallet state
export interface WalletContextState {
  publicKey: PublicKey | null
  connected: boolean
  connectionStatus: "disconnected" | "connecting" | "connected"
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
  signTransaction: (transaction: any) => Promise<any>
}

export const WalletContext = createContext<WalletContextState>({
  publicKey: null,
  connected: false,
  connectionStatus: "disconnected",
  connect: async () => {},
  disconnect: async () => {},
  signMessage: async () => new Uint8Array(),
  signTransaction: async () => ({}),
})

// Wrap the Mock Lazorkit provider with our custom provider
export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <MockLazorkitProvider
      config={{
        appName: "SolSwap",
        network: "mainnet",
      }}
    >
      <WalletProviderInner>{children}</WalletProviderInner>
    </MockLazorkitProvider>
  )
}

// Inner provider that uses the Mock Lazorkit hooks
function WalletProviderInner({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const {
    publicKey,
    status,
    connect: lazorkitConnect,
    disconnect: lazorkitDisconnect,
    signMessage: lazorkitSignMessage,
    signTransaction: lazorkitSignTransaction,
  } = useMockLazorkit()

  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")

  // Map Lazorkit status to our connection status
  useEffect(() => {
    if (status === MockConnectionStatus.Connected) {
      setConnectionStatus("connected")
    } else if (status === MockConnectionStatus.Connecting) {
      setConnectionStatus("connecting")
    } else {
      setConnectionStatus("disconnected")
    }
  }, [status])

  // Connect to wallet
  const connect = useCallback(async () => {
    try {
      setConnectionStatus("connecting")
      await lazorkitConnect()
      toast({
        title: "Connected",
        description: "Successfully connected to your wallet",
      })
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect to your wallet",
      })
      setConnectionStatus("disconnected")
    }
  }, [lazorkitConnect, toast])

  // Disconnect from wallet
  const disconnect = useCallback(async () => {
    try {
      await lazorkitDisconnect()
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from your wallet",
      })
    } catch (error) {
      console.error("Disconnection error:", error)
      toast({
        variant: "destructive",
        title: "Disconnection failed",
        description: "Failed to disconnect from your wallet",
      })
    }
  }, [lazorkitDisconnect, toast])

  // Sign message
  const signMessage = useCallback(
    async (message: Uint8Array) => {
      try {
        return await lazorkitSignMessage(message)
      } catch (error) {
        console.error("Signing error:", error)
        toast({
          variant: "destructive",
          title: "Signing failed",
          description: "Failed to sign message",
        })
        throw error
      }
    },
    [lazorkitSignMessage, toast],
  )

  // Sign transaction
  const signTransaction = useCallback(
    async (transaction: any) => {
      try {
        return await lazorkitSignTransaction(transaction)
      } catch (error) {
        console.error("Transaction signing error:", error)
        toast({
          variant: "destructive",
          title: "Signing failed",
          description: "Failed to sign transaction",
        })
        throw error
      }
    },
    [lazorkitSignTransaction, toast],
  )

  // Create context value
  const value = useMemo(
    () => ({
      publicKey: publicKey || null,
      connected: status === MockConnectionStatus.Connected,
      connectionStatus,
      connect,
      disconnect,
      signMessage,
      signTransaction,
    }),
    [publicKey, status, connectionStatus, connect, disconnect, signMessage, signTransaction],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
