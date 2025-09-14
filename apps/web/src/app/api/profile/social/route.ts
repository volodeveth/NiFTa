import { NextRequest, NextResponse } from 'next/server'

export interface SocialConnection {
  provider: 'twitter' | 'farcaster'
  providerId: string
  username: string
  displayName: string
  profileImage?: string
  verified: boolean
  connectedAt: string
  walletAddress: string
}

export interface ProfileData {
  walletAddress: string
  username?: string
  displayName?: string
  website?: string
  bio?: string
  profileImage?: string
  socialConnections: SocialConnection[]
  isVerified: boolean
  verifiedAt?: string
}

// In production, this would be stored in a database
// For MVP, we'll use a simple in-memory store
const profileStore = new Map<string, ProfileData>()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const walletAddress = searchParams.get('wallet')

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  const profile: ProfileData = profileStore.get(walletAddress.toLowerCase()) || {
    walletAddress: walletAddress.toLowerCase(),
    socialConnections: [] as SocialConnection[],
    isVerified: false
  }

  return NextResponse.json(profile)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, socialConnection, website, bio, username, displayName } = body

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    const normalizedAddress = walletAddress.toLowerCase()
    const existingProfile: ProfileData = profileStore.get(normalizedAddress) || {
      walletAddress: normalizedAddress,
      socialConnections: [] as SocialConnection[],
      isVerified: false
    }

    // Update social connection
    if (socialConnection) {
      const existingIndex = existingProfile.socialConnections.findIndex(
        conn => conn.provider === socialConnection.provider
      )

      if (existingIndex >= 0) {
        existingProfile.socialConnections[existingIndex] = socialConnection
      } else {
        existingProfile.socialConnections.push(socialConnection)
      }

      // Mark as verified if has any social connection
      if (!existingProfile.isVerified && socialConnection.verified) {
        existingProfile.isVerified = true
        existingProfile.verifiedAt = new Date().toISOString()
      }
    }

    // Update other profile data
    if (username !== undefined) {
      existingProfile.username = username
    }
    
    if (displayName !== undefined) {
      existingProfile.displayName = displayName
    }
    
    if (website !== undefined) {
      existingProfile.website = website
    }
    
    if (bio !== undefined) {
      existingProfile.bio = bio
    }

    profileStore.set(normalizedAddress, existingProfile)

    return NextResponse.json(existingProfile)

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, provider } = body

    if (!walletAddress || !provider) {
      return NextResponse.json({ error: 'Wallet address and provider required' }, { status: 400 })
    }

    const normalizedAddress = walletAddress.toLowerCase()
    const existingProfile = profileStore.get(normalizedAddress)

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Remove social connection
    existingProfile.socialConnections = existingProfile.socialConnections.filter(
      conn => conn.provider !== provider
    )

    // Update verification status
    existingProfile.isVerified = existingProfile.socialConnections.some(conn => conn.verified)
    if (!existingProfile.isVerified) {
      delete existingProfile.verifiedAt
    }

    profileStore.set(normalizedAddress, existingProfile)

    return NextResponse.json(existingProfile)

  } catch (error) {
    console.error('Social connection removal error:', error)
    return NextResponse.json({ error: 'Failed to remove social connection' }, { status: 500 })
  }
}