import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// OAuth configuration
const OAUTH_CONFIGS = {
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    clientId: process.env.TWITTER_CLIENT_ID,
    scope: 'users.read tweet.read',
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
  },
  farcaster: {
    authUrl: 'https://warpcast.com/~/siwf',
    // Farcaster uses Sign In with Farcaster (SIWF) protocol
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/farcaster/callback`,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const { provider } = params
  const searchParams = request.nextUrl.searchParams
  const walletAddress = searchParams.get('wallet')
  const returnTo = searchParams.get('returnTo') || '/profile'

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  if (!OAUTH_CONFIGS[provider as keyof typeof OAUTH_CONFIGS]) {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 })
  }

  // Store state for verification
  const state = generateState()
  const cookieStore = cookies()
  
  cookieStore.set(`oauth_state_${provider}`, JSON.stringify({
    state,
    walletAddress,
    returnTo,
    timestamp: Date.now()
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600, // 10 minutes
    sameSite: 'lax'
  })

  const config = OAUTH_CONFIGS[provider as keyof typeof OAUTH_CONFIGS]

  if (provider === 'twitter') {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId!,
      redirect_uri: config.redirectUri,
      scope: config.scope!,
      state,
      code_challenge: generatePKCE(),
      code_challenge_method: 'S256'
    })

    const authUrl = `${config.authUrl}?${params.toString()}`
    return NextResponse.redirect(authUrl)
  }

  if (provider === 'farcaster') {
    // Farcaster SIWF flow
    const params = new URLSearchParams({
      client_id: process.env.FARCASTER_CLIENT_ID || 'nifta',
      redirect_uri: config.redirectUri,
      state,
      scope: 'read'
    })

    const authUrl = `${config.authUrl}?${params.toString()}`
    return NextResponse.redirect(authUrl)
  }

  return NextResponse.json({ error: 'Provider not implemented' }, { status: 400 })
}

function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

function generatePKCE(): string {
  // In production, use proper PKCE with crypto.subtle
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}