'use client'

import { useState, useRef, useEffect } from 'react'
import jsQR from 'jsqr'

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

interface ScannerViewProps {
  onScanResult?: (result: ScanResult) => void
}

export default function ScannerView({ onScanResult }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string>('')
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError('')
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsScanning(true)
      }
    } catch (err) {
      setError('Failed to access camera. Please allow camera permissions.')
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const scanQRCode = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas || !isScanning) return

    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    
    if (code) {
      handleQRCodeDetected(code.data)
    }
  }

  const handleQRCodeDetected = async (qrData: string) => {
    try {
      setIsScanning(false) // Stop scanning while processing
      
      // Parse QR code data
      const qrPayload = JSON.parse(qrData)
      
      // Get scanner location (optional)
      let scannerLat, scannerLng
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 60000
          })
        })
        scannerLat = position.coords.latitude
        scannerLng = position.coords.longitude
      } catch (err) {
        console.log('Could not get scanner location:', err)
      }

      // Verify ticket with backend
      const response = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qrPayload,
          scannerLat,
          scannerLng
        })
      })

      const result = await response.json()
      setScanResult(result)
      onScanResult?.(result)

      // Auto-restart scanning after 3 seconds if invalid
      if (!result.valid) {
        setTimeout(() => {
          setScanResult(null)
          setIsScanning(true)
        }, 3000)
      }

    } catch (err) {
      const errorResult: ScanResult = {
        valid: false,
        error: 'Invalid QR code format'
      }
      setScanResult(errorResult)
      onScanResult?.(errorResult)
      
      // Auto-restart scanning after 2 seconds
      setTimeout(() => {
        setScanResult(null)
        setIsScanning(true)
      }, 2000)
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    setIsScanning(true)
  }

  useEffect(() => {
    let animationFrame: number

    if (isScanning) {
      const scan = () => {
        scanQRCode()
        animationFrame = requestAnimationFrame(scan)
      }
      animationFrame = requestAnimationFrame(scan)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isScanning])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  if (scanResult) {
    return (
      <div className="text-center">
        <div className={`border-4 p-8 mb-6 ${scanResult.valid ? 'border-green-500 bg-green-950/20' : 'border-red-500 bg-red-950/20'}`}>
          {scanResult.valid ? (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">Valid Ticket</h2>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{scanResult.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Event:</span>
                  <span className="text-white">{scanResult.event?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wallet:</span>
                  <span className="text-white font-mono text-sm">
                    {scanResult.user?.wallet_address.slice(0, 8)}...{scanResult.user?.wallet_address.slice(-8)}
                  </span>
                </div>
              </div>
              <p className="text-green-300 text-sm mt-4">{scanResult.message}</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-400 mb-4">Invalid Ticket</h2>
              <p className="text-red-300">{scanResult.error}</p>
            </>
          )}
        </div>
        
        <button 
          onClick={resetScanner} 
          className="bg-white text-black font-bold py-3 px-6 transition-all duration-300 hover:bg-gray-100"
        >
          Scan Another Ticket
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Ticket Scanner</h2>
        <p className="text-gray-400">Point camera at QR code to verify ticket</p>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-700 p-6 mb-6">
          <div className="text-red-400 text-lg mb-4">Camera Error</div>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={startCamera} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="relative mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-md mx-auto bg-gray-900 border border-gray-700"
          style={{ aspectRatio: '4/3' }}
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
        
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-4 border-white border-dashed w-48 h-48 flex items-center justify-center">
              <div className="text-white text-sm bg-black bg-opacity-50 px-2 py-1">
                Align QR code here
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {!isScanning && !error ? (
          <button 
            onClick={startCamera} 
            className="bg-white text-black font-bold py-3 px-6 transition-all duration-300 hover:bg-gray-100"
          >
            Start Scanning
          </button>
        ) : isScanning ? (
          <button 
            onClick={stopCamera} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 transition-colors"
          >
            Stop Scanning
          </button>
        ) : null}
      </div>
    </div>
  )
}
