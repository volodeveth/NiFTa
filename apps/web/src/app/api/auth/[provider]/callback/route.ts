import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    console.log('OAuth callback called for provider:', params.provider)
    
    const { provider } = params
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    console.log('Callback parameters:', { provider, code, state })

    if (!code || !state) {
      console.error('Missing code or state')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      return NextResponse.redirect(
        `${baseUrl}/profile?error=invalid_callback`
      )
    }

    const cookieStore = cookies()
    const stateData = cookieStore.get(`oauth_state_${provider}`)

    if (!stateData) {
      console.error('No state cookie found')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      return NextResponse.redirect(
        `${baseUrl}/profile?error=expired_state`
      )
    }

    let parsedStateData
    try {
      parsedStateData = JSON.parse(stateData.value)
    } catch {
      console.error('Failed to parse state data')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      return NextResponse.redirect(
        `${baseUrl}/profile?error=invalid_state`
      )
    }

    if (parsedStateData.state !== state) {
      console.error('State mismatch')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      return NextResponse.redirect(
        `${baseUrl}/profile?error=state_mismatch`
      )
    }

    // Create mock social connection
    const socialConnection = {
      provider,
      providerId: 'mock_user_' + Date.now(),
      username: 'mockuser',
      displayName: 'Mock User',
      profileImage: null,
      verified: true,
      connectedAt: new Date().toISOString(),
      walletAddress: parsedStateData.walletAddress
    }

    console.log('Created mock social connection:', socialConnection)

    // Clean up state cookie
    cookieStore.delete(`oauth_state_${provider}`)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
    const successUrl = new URL('/profile', baseUrl)
    successUrl.searchParams.set('social_connected', 'true')
    successUrl.searchParams.set('provider', provider)
    successUrl.searchParams.set('social_data', encodeURIComponent(JSON.stringify(socialConnection)))

    console.log('Redirecting to success URL:', successUrl.toString())
    
    return NextResponse.redirect(successUrl.toString())

  } catch (error) {
    console.error('OAuth callback error:', error)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
    return NextResponse.redirect(
      `${baseUrl}/profile?error=callback_failed&details=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`
    )
  }
}