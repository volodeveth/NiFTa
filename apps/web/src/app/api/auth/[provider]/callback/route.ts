import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const { provider } = params
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=oauth_denied`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=invalid_callback`
    )
  }

  const cookieStore = cookies()
  const stateData = cookieStore.get(`oauth_state_${provider}`)

  if (!stateData) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=expired_state`
    )
  }

  let parsedStateData
  try {
    parsedStateData = JSON.parse(stateData.value)
  } catch {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=invalid_state`
    )
  }

  // Verify state matches
  if (parsedStateData.state !== state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=state_mismatch`
    )
  }

  // Check if state is expired (10 minutes)
  if (Date.now() - parsedStateData.timestamp > 600000) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=expired_state`
    )
  }

  try {
    // Exchange code for token and get user info
    const userInfo = await exchangeCodeForUserInfo(provider, code)
    
    if (!userInfo) {
      throw new Error('Failed to get user info')
    }

    // Store social media connection
    const socialConnection = {
      provider,
      providerId: userInfo.id,
      username: userInfo.username,
      displayName: userInfo.displayName || userInfo.username,
      profileImage: userInfo.profileImage,
      verified: true,
      connectedAt: new Date().toISOString(),
      walletAddress: parsedStateData.walletAddress
    }

    // In production, store this in a database
    // For now, we'll use localStorage on the client
    const successUrl = new URL('/profile', process.env.NEXT_PUBLIC_BASE_URL!)
    successUrl.searchParams.set('social_connected', 'true')
    successUrl.searchParams.set('provider', provider)
    successUrl.searchParams.set('social_data', encodeURIComponent(JSON.stringify(socialConnection)))

    // Clean up state cookie
    cookieStore.delete(`oauth_state_${provider}`)

    return NextResponse.redirect(successUrl.toString())

  } catch (error) {
    console.error(`OAuth ${provider} callback error:`, error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=auth_failed`
    )
  }
}

async function exchangeCodeForUserInfo(provider: string, code: string) {
  if (provider === 'twitter') {
    return await getTwitterUserInfo(code)
  }
  
  if (provider === 'farcaster') {
    return await getFarcasterUserInfo(code)
  }
  
  throw new Error(`Unsupported provider: ${provider}`)
}

async function getTwitterUserInfo(code: string) {
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
        code_verifier: 'dummy_verifier' // In production, use proper PKCE
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokens = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,verified', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const userData = await userResponse.json()
    const user = userData.data

    return {
      id: user.id,
      username: user.username,
      displayName: user.name,
      profileImage: user.profile_image_url,
      verified: user.verified || false
    }

  } catch (error) {
    console.error('Twitter OAuth error:', error)
    return null
  }
}

async function getFarcasterUserInfo(code: string) {
  try {
    // Farcaster SIWF verification
    // This is a simplified implementation
    // In production, you'd verify the SIWF signature
    
    const response = await fetch('https://api.warpcast.com/v2/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: process.env.FARCASTER_CLIENT_ID || 'nifta'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to verify Farcaster auth')
    }

    const authData = await response.json()

    return {
      id: authData.fid?.toString(),
      username: authData.username,
      displayName: authData.display_name || authData.username,
      profileImage: authData.pfp_url,
      verified: authData.verified_addresses?.eth_addresses?.length > 0
    }

  } catch (error) {
    console.error('Farcaster OAuth error:', error)
    return null
  }
}