import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import type { ProfileData, SocialConnection } from '@/app/api/profile/social/route'

export function useProfile() {
  const { address } = useAccount()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (address) {
      fetchProfile()
    } else {
      setProfile(null)
    }
  }, [address])

  const fetchProfile = async () => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/profile/social?wallet=${encodeURIComponent(address)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const profileData = await response.json()
      setProfile(profileData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const connectSocial = async (provider: 'twitter' | 'farcaster') => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    // Redirect to OAuth flow
    const authUrl = `/api/auth/${provider}?wallet=${encodeURIComponent(address)}&returnTo=/profile`
    window.location.href = authUrl
  }

  const updateProfile = async (updates: {
    username?: string
    displayName?: string
    website?: string
    bio?: string
    profileImage?: string
    socialConnection?: SocialConnection
  }) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    // Optimistic update - immediately update local state
    const previousProfile = profile
    const optimisticProfile = profile ? {
      ...profile,
      ...updates
    } : {
      walletAddress: address,
      socialConnections: [],
      isVerified: false,
      ...updates
    } as ProfileData

    setProfile(optimisticProfile)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          ...updates
        })
      })

      if (!response.ok) {
        // Rollback on error
        setProfile(previousProfile)
        throw new Error('Failed to update profile')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err) {
      // Ensure rollback happened
      setProfile(previousProfile)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const disconnectSocial = async (provider: 'twitter' | 'farcaster') => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/social', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          provider
        })
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect social account')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    error,
    connectSocial,
    updateProfile,
    disconnectSocial,
    refetch: fetchProfile
  }
}