'use client'

import ScannerView from '@/components/ScannerView'

interface ScanResult {
  valid: boolean
  user?: {
    wallet_address: string
    name: string
  }
  event?: {
    name: string
    description: string
  }
  error?: string
  message?: string
}

export default function ScannerPage() {
  const handleScanResult = (result: ScanResult) => {
    console.log('Scan result:', result)
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-25 gap-1 h-full">
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i} className="text-gray-500 text-xs animate-pulse">📱</div>
          ))}
        </div>
      </div>

      <section className="relative px-6 py-20 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Ticket <span className="text-gray-400 animate-pulse">Scanner</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Scan QR codes to verify event tickets and grant entry
            </p>
          </div>

          <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                  <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                  <div className="w-3 h-3 bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
                </div>
                <span className="text-gray-400 text-sm">qr-scanner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-500 text-xs">READY</span>
              </div>
            </div>

            <div className="p-8">
              <ScannerView onScanResult={handleScanResult} />
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">●</span>
              <span>Real-time verification • Blockchain validation • Secure entry</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
