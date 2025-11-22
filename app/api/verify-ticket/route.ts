import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateQRToken, QRPayload } from '@/lib/crypto'
import { checkAssetOwnership } from '@/lib/algorand'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrPayload, scannerLat, scannerLng, verifiedBy } = body

    // Validate QR payload structure
    if (!qrPayload || !qrPayload.walletAddress || !qrPayload.eventId || !qrPayload.token) {
      console.log('Invalid QR payload structure:', { qrPayload })
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid QR code format' 
        },
        { status: 400 }
      )
    }

    const payload: QRPayload = qrPayload

    // Log payload for debugging
    const now = Date.now()
    const timeUntilExpiry = payload.expires - now
    console.log('Verifying QR token:', {
      walletAddress: payload.walletAddress,
      eventId: payload.eventId,
      expires: payload.expires,
      now,
      timeUntilExpiry: `${(timeUntilExpiry / 1000).toFixed(2)}s`,
      isExpired: now > payload.expires
    })

    // Validate QR token (time window and HMAC)
    const isValidToken = validateQRToken(payload, 20000)
    if (!isValidToken) {
      console.log('Token validation failed:', {
        walletAddress: payload.walletAddress,
        eventId: payload.eventId,
        expires: payload.expires,
        now,
        expired: now > payload.expires
      })
      return NextResponse.json({
        valid: false,
        error: `QR code has expired or is invalid. ${now > payload.expires ? `Expired ${((now - payload.expires) / 1000).toFixed(1)}s ago` : 'Token mismatch'}`
      })
    }

    // Get event details
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('event_id', payload.eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({
        valid: false,
        error: 'Event not found'
      })
    }

    // Check if ticket has already been used
    const { data: existingCheckIn, error: checkInQueryError } = await supabaseAdmin
      .from('checkins')
      .select('checkin_id')
      .eq('event_id', payload.eventId)
      .eq('wallet_address', payload.walletAddress)
      .maybeSingle()

    if (checkInQueryError && checkInQueryError.code !== 'PGRST116') {
      console.error('Error checking existing check-in:', checkInQueryError)
    }

    if (existingCheckIn) {
      console.log('Ticket already used:', {
        walletAddress: payload.walletAddress,
        eventId: payload.eventId,
        checkInId: existingCheckIn.checkin_id
      })
      return NextResponse.json({
        valid: false,
        error: 'Ticket has already been used'
      })
    }

    // Get ASA ID - use EVENT_ASA_ID from environment if event ASA ID is not set
    let asaId = event.asa_id
    if (!asaId || asaId === 0) {
      const envAsaId = process.env.EVENT_ASA_ID
      if (!envAsaId || envAsaId === 'REPLACE_WITH_ASA_ID') {
        return NextResponse.json({
          valid: false,
          error: 'Event ASA ID not configured'
        })
      }
      asaId = parseInt(envAsaId)
      if (isNaN(asaId)) {
        return NextResponse.json({
          valid: false,
          error: 'Invalid EVENT_ASA_ID format'
        })
      }
    }

    console.log('Checking ticket ownership:', {
      walletAddress: payload.walletAddress,
      asaId,
      asaIdSource: event.asa_id && event.asa_id !== 0 ? 'DB' : 'ENV'
    })

    // Verify current ASA ownership (anti-resell protection)
    let ownsTicket = false
    let ownershipError: string | null = null
    try {
      ownsTicket = await checkAssetOwnership(payload.walletAddress, asaId)
      console.log('Ownership check result:', {
        walletAddress: payload.walletAddress,
        asaId,
        ownsTicket
      })
    } catch (error) {
      ownershipError = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error checking asset ownership:', error)
    }

    if (!ownsTicket) {
      return NextResponse.json({
        valid: false,
        error: ownershipError 
          ? `Ownership check failed: ${ownershipError}`
          : 'Ticket is no longer owned by this wallet'
      })
    }

    // Mark ticket as used (create check-in record)
    const { error: checkInError } = await supabaseAdmin
      .from('checkins')
      .insert({
        wallet_address: payload.walletAddress,
        event_id: payload.eventId,
        scanner_location_lat: scannerLat,
        scanner_location_lng: scannerLng,
        timestamp: new Date().toISOString()
      })

    if (checkInError) {
      console.error('Error creating check-in record:', checkInError)
      return NextResponse.json({
        valid: false,
        error: 'Failed to process check-in'
      })
    }

    // Clean up expired QR tokens (optional)
    await supabaseAdmin
      .from('qr_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString())

    return NextResponse.json({
      valid: true,
      name: `User ${payload.walletAddress.slice(0, 8)}...`,
      address: payload.walletAddress,
      timestamp: new Date().toISOString(),
      user: { 
        wallet_address: payload.walletAddress,
        name: `User ${payload.walletAddress.slice(0, 8)}...`
      },
      event: {
        name: event.name,
        description: event.description
      },
      message: 'Ticket verified successfully'
    })

  } catch (error) {
    console.error('Error verifying ticket:', error)
    return NextResponse.json({
      valid: false,
      error: 'Internal server error'
    })
  }
}
