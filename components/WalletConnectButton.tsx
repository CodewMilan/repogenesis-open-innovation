'use client'

import { useState, useEffect } from 'react'
import { PeraWalletConnect } from '@perawallet/connect'

// Algorand chain IDs: MainNet=416001, TestNet=416002, BetaNet=416003
const chainIdValue = parseInt(process.env.NEXT_PUBLIC_ALGORAND_CHAIN_ID || '416002') as 416001 | 416002 | 416003

const peraWallet = new PeraWalletConnect({
  chainId: chainIdValue
})

interface WalletConnectButtonProps {
  onConnect?: (accounts: string[]) => void
  onDisconnect?: () => void
  className?: string
}

export default function WalletConnectButton({ onConnect, onDisconnect, className }: WalletConnectButtonProps) {
  const [accountAddress, setAccountAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showDisconnect, setShowDisconnect] = useState(false)

  useEffect(() => {
    // Reconnect to session if it exists
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        if (accounts.length > 0) {
          setAccountAddress(accounts[0])
          onConnect?.(accounts)
        }
      })
      .catch((error) => {
        console.log('No existing session:', error)
      })
  }, [onConnect])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const accounts = await peraWallet.connect()
      
      if (accounts.length > 0) {
        setAccountAddress(accounts[0])
        onConnect?.(accounts)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    peraWallet.disconnect()
    setAccountAddress(null)
    setShowDisconnect(false)
    onDisconnect?.()
  }

  const toggleDisconnect = () => {
    setShowDisconnect(!showDisconnect)
  }

  if (accountAddress) {
    return (
      <div className={`relative ${className}`}>
        <div
          className="group relative cursor-pointer"
          onClick={toggleDisconnect}
        >
          <div className="absolute inset-0 border border-gray-600 bg-gray-900/20 transition-all duration-300 group-hover:border-white group-hover:shadow-lg group-hover:shadow-white/20"></div>
          <div className="relative border border-gray-400 bg-transparent text-white font-medium px-4 py-2 text-sm transition-all duration-300 group-hover:border-white group-hover:bg-gray-900/30 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 text-xs">
                {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
              </span>
            </div>
          </div>
        </div>
        
        {showDisconnect && (
          <div className="absolute top-full right-0 mt-2 bg-gray-950 border border-gray-700 shadow-xl backdrop-blur-sm z-50">
            <div className="p-3 min-w-[200px]">
              <div className="text-xs text-gray-400 mb-2">Connected Wallet</div>
              <div className="text-sm text-white font-mono mb-3 break-all">
                {accountAddress}
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`group relative cursor-pointer ${className}`}
      onClick={handleConnect}
    >
      <div className="absolute inset-0 border border-gray-600 bg-gray-900/20 transition-all duration-300 group-hover:border-white group-hover:shadow-lg group-hover:shadow-white/20"></div>
      <div className="relative border border-gray-400 bg-transparent text-white font-medium px-6 py-2 text-sm transition-all duration-300 group-hover:border-white group-hover:bg-gray-900/30 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🔗</span>
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </div>
      </div>
    </div>
  )
}

// Export peraWallet instance for use in other components
export { peraWallet }
