import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    console.log('OAuth route called for provider:', params.provider)
    
    const { provider } = params
    const searchParams = request.nextUrl.searchParams
    const walletAddress = searchParams.get('wallet')

    console.log('Parameters:', { provider, walletAddress })

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    if (provider !== 'twitter' && provider !== 'farcaster') {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 })
    }

    // Simple state generation without crypto
    const state = Math.random().toString(36).substring(2, 15)
    
    console.log('Generated state:', state)

    const cookieStore = cookies()
    
    // Store state for verification
    cookieStore.set(`oauth_state_${provider}`, JSON.stringify({
      state,
      walletAddress,
      timestamp: Date.now()
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600, // 10 minutes
      sameSite: 'lax'
    })

    console.log('Cookie set successfully')

    // For now, always redirect to callback with mock data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
    const callbackUrl = new URL(`/api/auth/${provider}/callback`, baseUrl)
    callbackUrl.searchParams.set('code', 'mock_code_' + Date.now())
    callbackUrl.searchParams.set('state', state)

    console.log('Redirecting to:', callbackUrl.toString())
    
    return NextResponse.redirect(callbackUrl.toString())

  } catch (error) {
    console.error('OAuth route error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}