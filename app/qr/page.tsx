'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { peraWallet } from '@/components/WalletConnectButton'
import QRDisplay from '@/components/QRDisplay'

function QRPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const eventId = searchParams.get('eventId')
  
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!eventId) {
      setError('Event ID is required')
      setLoading(false)
      return
    }
    
    checkWalletConnection()
  }, [eventId])

  const checkWalletConnection = async () => {
    try {
      const accounts = await peraWallet.reconnectSession()
      if (accounts.length > 0) {
        const address = accounts[0]
        setWalletAddress(address)
        fetchEvent()
      } else {
        setError('Please connect your wallet to generate QR codes')
        setLoading(false)
      }
    } catch (error) {
      setError('Please connect your wallet to generate QR codes')
      setLoading(false)
    }
  }

  const fetchEvent = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch event')
      }
      
      setEvent(data.event)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/tickets')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-25 gap-1 h-full">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="text-gray-500 text-xs animate-pulse">🎫</div>
            ))}
          </div>
        </div>
        <section className="relative px-6 py-20 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm p-8">
              <div className="flex items-center justify-center gap-4">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-lg">Loading QR generator...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-25 gap-1 h-full">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="text-gray-500 text-xs animate-pulse">🎫</div>
            ))}
          </div>
        </div>
        <section className="relative px-6 py-20 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={handleBack}
              className="group relative cursor-pointer mb-8"
            >
              <div className="absolute inset-0 border border-gray-600 bg-gray-900/20 transition-all duration-300 group-hover:border-white"></div>
              <div className="relative border border-gray-400 bg-transparent text-white font-medium px-4 py-2 text-sm transition-all duration-300 group-hover:border-white group-hover:bg-gray-900/30 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">←</span>
                  <span>Back to Tickets</span>
                </div>
              </div>
            </button>

            <div className="bg-red-950 border border-red-700 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-4 bg-red-900 border-b border-red-700">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500"></div>
                    <div className="w-3 h-3 bg-red-500"></div>
                    <div className="w-3 h-3 bg-red-500"></div>
                  </div>
                  <span className="text-red-400 text-sm">qr-error</span>
                </div>
              </div>
              <div className="p-12 text-center">
                <div className="text-red-400 text-lg mb-4">❌ {error}</div>
                <div className="text-red-500 text-sm">Please check your connection and try again</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-25 gap-1 h-full">
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i} className="text-gray-500 text-xs animate-pulse">🎫</div>
          ))}
        </div>
      </div>

      <section className="relative px-6 py-20 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleBack}
            className="group relative cursor-pointer mb-8"
          >
            <div className="absolute inset-0 border border-gray-600 bg-gray-900/20 transition-all duration-300 group-hover:border-white"></div>
            <div className="relative border border-gray-400 bg-transparent text-white font-medium px-4 py-2 text-sm transition-all duration-300 group-hover:border-white group-hover:bg-gray-900/30 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">←</span>
                <span>Back to Tickets</span>
              </div>
            </div>
          </button>

          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{event.name}</h1>
            <p className="text-lg text-gray-300 mb-6">{event.description}</p>
          </div>
          
          <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500"></div>
                  <div className="w-3 h-3 bg-yellow-500"></div>
                  <div className="w-3 h-3 bg-green-500"></div>
                </div>
                <span className="text-gray-400 text-sm">qr-generator</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-500 text-xs">ACTIVE</span>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-gray-400 text-sm mb-2">Dynamic QR Code</div>
                <div className="text-white text-lg font-bold">Entry Verification</div>
                <div className="text-gray-500 text-xs mt-2">Refreshes every 20 seconds</div>
              </div>
              
              <QRDisplay
                walletAddress={walletAddress}
                eventId={eventId!}
                onError={(error) => setError(error)}
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">●</span>
              <span>Geofenced • Time-limited • Blockchain verified</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function QRPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-25 gap-1 h-full">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="text-gray-500 text-xs animate-pulse">🎫</div>
            ))}
          </div>
        </div>
        <section className="relative px-6 py-20 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm p-8">
              <div className="flex items-center justify-center gap-4">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-lg">Loading...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    }>
      <QRPageContent />
    </Suspense>
  )
}
