"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { PublicKey } from "@solana/web3.js"

// Mock connection status enum
export enum MockConnectionStatus {
  Disconnected = "disconnected",
  Connecting = "connecting",
  Connected = "connected",
}

// Mock context for Lazorkit
interface MockLazorkitContextState {
  publicKey: PublicKey | null
  status: MockConnectionStatus
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
  signTransaction: (transaction: any) => Promise<any>
}

const MockLazorkitContext = createContext<MockLazorkitContextState>({
  publicKey: null,
  status: MockConnectionStatus.Disconnected,
  connect: async () => {},
  disconnect: async () => {},
  signMessage: async () => new Uint8Array(),
  signTransaction: async () => ({}),
})

// Mock provider config
interface MockProviderConfig {
  appName: string
  network: string
}

// Mock Lazorkit provider
export function MockLazorkitProvider({
  children,
  config,
}: {
  children: React.ReactNode
  config: MockProviderConfig
}) {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [status, setStatus] = useState<MockConnectionStatus>(MockConnectionStatus.Disconnected)

  const connect = useCallback(async () => {
    try {
      setStatus(MockConnectionStatus.Connecting)

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a random public key
      const randomKey = new Uint8Array(32)
      window.crypto.getRandomValues(randomKey)
      setPublicKey(new PublicKey(randomKey))

      setStatus(MockConnectionStatus.Connected)

      // Store in localStorage to persist connection
      localStorage.setItem("mockWalletConnected", "true")
    } catch (error) {
      console.error("Mock connection error:", error)
      setStatus(MockConnectionStatus.Disconnected)
      throw error
    }
  }, [])

  const disconnect = useCallback(async () => {
    setPublicKey(null)
    setStatus(MockConnectionStatus.Disconnected)
    localStorage.removeItem("mockWalletConnected")
  }, [])

  const signMessage = useCallback(
    async (message: Uint8Array) => {
      if (status !== MockConnectionStatus.Connected) {
        throw new Error("Wallet not connected")
      }

      // Simulate signing delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Return the original message as the "signature" for mock purposes
      return message
    },
    [status],
  )

  const signTransaction = useCallback(
    async (transaction: any) => {
      if (status !== MockConnectionStatus.Connected) {
        throw new Error("Wallet not connected")
      }

      // Simulate signing delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Return the transaction with a mock signature
      return {
        ...transaction,
        signature: "mock-signature",
      }
    },
    [status],
  )

  // Check for existing connection on mount
  useEffect(() => {
    const isConnected = localStorage.getItem("mockWalletConnected") === "true"
    if (isConnected) {
      connect().catch(console.error)
    }
  }, [connect])

  const value = {
    publicKey,
    status,
    connect,
    disconnect,
    signMessage,
    signTransaction,
  }

  return <MockLazorkitContext.Provider value={value}>{children}</MockLazorkitContext.Provider>
}

// Hook to use the mock Lazorkit context
export function useMockLazorkit() {
  const context = useContext(MockLazorkitContext)
  if (!context) {
    throw new Error("useMockLazorkit must be used within a MockLazorkitProvider")
  }
  return context
}
