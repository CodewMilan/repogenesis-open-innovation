'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { peraWallet } from '@/components/WalletConnectButton'

interface User {
  wallet_address: string
  name: string
  email?: string
  created_at: string
}

interface Ticket {
  event: {
    event_id: string
    name: string
    description: string
    asa_id: number
  }
  assetId: number
  amount: number
  used: boolean
  usedAt: string | null
}

export default function ProfilePage() {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      const accounts = await peraWallet.reconnectSession()
      if (accounts.length > 0) {
        const address = accounts[0]
        setWalletAddress(address)
        fetchUserData(address)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.log('No existing session')
      setLoading(false)
    }
  }

  const fetchUserData = async (address: string) => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch user tickets
      const ticketsResponse = await fetch(`/api/wallet/tickets?address=${address}`)
      const ticketsData = await ticketsResponse.json()
      
      if (ticketsResponse.ok) {
        setTickets(ticketsData.tickets || [])
      }

      // Create a user object (since we don't have a separate user API)
      setUser({
        wallet_address: address,
        name: `User ${address.slice(0, 8)}...`,
        created_at: new Date().toISOString()
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    peraWallet.disconnect()
    setWalletAddress('')
    setUser(null)
    setTickets([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-25 gap-1 h-full">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="text-gray-500 text-xs animate-pulse">👤</div>
            ))}
          </div>
        </div>
        <section className="relative px-6 py-20 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm p-8">
              <div className="flex items-center justify-center gap-4">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-lg">Loading profile...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!walletAddress || !user) {
    return (
      <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-25 gap-1 h-full">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="text-gray-500 text-xs animate-pulse">👤</div>
            ))}
          </div>
        </div>

        <section className="relative px-6 py-20 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                User <span className="text-gray-400 animate-pulse">Profile</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
                Connect your wallet to view your profile and ticket history
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500"></div>
                    <div className="w-3 h-3 bg-yellow-500"></div>
                    <div className="w-3 h-3 bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">wallet-required</span>
                </div>
              </div>
              <div className="p-12 text-center">
                <div className="text-gray-400 text-lg mb-6">Wallet Connection Required</div>
                <div className="text-gray-500 text-sm mb-8">Connect your Pera Wallet to view your profile</div>
                <Link href="/events" className="group relative cursor-pointer inline-block">
                  <div className="absolute inset-0 border border-gray-600 bg-gray-900/20 transition-all duration-300 group-hover:border-white"></div>
                  <div className="relative border border-white bg-white text-black font-bold px-8 py-4 text-lg transition-all duration-300 group-hover:bg-gray-100 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">🎫</span>
                      <span>Browse Events</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const activeTickets = tickets.filter(t => !t.used)
  const usedTickets = tickets.filter(t => t.used)

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-25 gap-1 h-full">
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i} className="text-gray-500 text-xs animate-pulse">👤</div>
          ))}
        </div>
      </div>

      <section className="relative px-6 py-20 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              User <span className="text-gray-400 animate-pulse">Profile</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Manage your wallet connection and view your ticket history
            </p>
          </div>

          {error && (
            <div className="mb-8">
              <div className="bg-red-950 border border-red-700 p-4 text-center">
                <span className="text-red-400">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500"></div>
                      <div className="w-3 h-3 bg-yellow-500"></div>
                      <div className="w-3 h-3 bg-green-500"></div>
                    </div>
                    <span className="text-gray-400 text-sm">profile-info</span>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gray-800 border border-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{user.name}</h3>
                    <div className="text-xs text-gray-400 font-mono break-all">
                      {user.wallet_address}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Tickets:</span>
                      <span className="text-white">{tickets.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Active:</span>
                      <span className="text-green-400">{activeTickets.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Used:</span>
                      <span className="text-red-400">{usedTickets.length}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <button
                      onClick={handleDisconnect}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 transition-colors"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets History */}
            <div className="lg:col-span-2">
              <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500"></div>
                      <div className="w-3 h-3 bg-yellow-500"></div>
                      <div className="w-3 h-3 bg-green-500"></div>
                    </div>
                    <span className="text-gray-400 text-sm">ticket-history</span>
                  </div>
                  <span className="text-xs text-gray-500">{tickets.length} tickets</span>
                </div>

                <div className="p-6">
                  {tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg mb-4">No tickets found</div>
                      <div className="text-gray-500 text-sm mb-8">Purchase tickets to see them here</div>
                      <Link href="/events" className="group relative cursor-pointer inline-block">
                        <div className="absolute inset-0 border border-gray-600 bg-gray-900/20 transition-all duration-300 group-hover:border-white"></div>
                        <div className="relative border border-white bg-white text-black font-bold px-6 py-3 transition-all duration-300 group-hover:bg-gray-100 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">🎫</span>
                            <span>Buy Tickets</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div 
                          key={`${ticket.event.event_id}-${ticket.assetId}`}
                          className={`border p-4 transition-all duration-300 ${
                            ticket.used 
                              ? 'border-red-700 bg-red-950/20' 
                              : 'border-gray-700 bg-gray-900/20 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-bold">{ticket.event.name}</h4>
                            {!ticket.used && (
                              <span className="text-xs font-mono px-2 py-1 bg-green-900 text-green-400 border border-green-700">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-400 text-sm mb-3">{ticket.event.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                            <div className="flex justify-between">
                              <span className="text-gray-500">ASA ID:</span>
                              <span className="text-white">{ticket.assetId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Quantity:</span>
                              <span className="text-white">{ticket.amount}</span>
                            </div>
                          </div>

                          {ticket.used && ticket.usedAt && (
                            <div className="mt-2 pt-2 border-t border-gray-800 text-xs text-gray-500">
                              Used on {new Date(ticket.usedAt).toLocaleString()}
                            </div>
                          )}

                          {!ticket.used && (
                            <div className="mt-3 pt-3 border-t border-gray-800">
                              <Link 
                                href={`/tickets/${ticket.event.event_id}`}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                Generate QR Code →
                              </Link>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
