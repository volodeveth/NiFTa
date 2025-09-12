'use client'

import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { 
  CheckCircleIcon,
  XMarkIcon,
  LinkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

interface SocialVerificationProps {
  onClose?: () => void
}

export default function SocialVerification({ onClose }: SocialVerificationProps) {
  const { profile, loading, connectSocial, disconnectSocial } = useProfile()
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (provider: 'twitter' | 'farcaster') => {
    try {
      setConnecting(provider)
      await connectSocial(provider)
    } catch (error) {
      console.error(`Failed to connect ${provider}:`, error)
      setConnecting(null)
    }
  }

  const handleDisconnect = async (provider: 'twitter' | 'farcaster') => {
    try {
      await disconnectSocial(provider)
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error)
    }
  }

  const getConnection = (provider: 'twitter' | 'farcaster') => {
    return profile?.socialConnections.find(conn => conn.provider === provider)
  }

  const isConnected = (provider: 'twitter' | 'farcaster') => {
    return !!getConnection(provider)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card rounded-xl border border-dark-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Verify Your Profile</h2>
              <p className="text-dark-text-secondary text-sm">
                Connect your social accounts to verify your identity
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-dark-text-secondary" />
              </button>
            )}
          </div>

          {/* Verification Status */}
          {profile?.isVerified && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <CheckBadgeIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="text-green-400 font-semibold text-sm">Profile Verified!</h3>
                  <p className="text-green-300/80 text-xs mt-1">
                    Your profile is now verified with a checkmark
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning for unverified */}
          {!profile?.isVerified && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-400 font-semibold text-sm">Verification Required</h3>
                  <p className="text-yellow-300/80 text-xs mt-1">
                    Connect at least one social account to verify your profile
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Social Connections */}
          <div className="space-y-4">
            {/* Twitter/X */}
            <div className="border border-dark-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">𝕏</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">X (Twitter)</h3>
                    <p className="text-dark-text-secondary text-xs">
                      Connect your X account for verification
                    </p>
                  </div>
                </div>
                {isConnected('twitter') && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>

              {isConnected('twitter') ? (
                <div>
                  <div className="bg-dark-surface rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-3">
                      {getConnection('twitter')?.profileImage && (
                        <img
                          src={getConnection('twitter')?.profileImage}
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">
                          @{getConnection('twitter')?.username}
                        </p>
                        <p className="text-dark-text-secondary text-xs">
                          {getConnection('twitter')?.displayName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect('twitter')}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect('twitter')}
                  disabled={loading || connecting === 'twitter'}
                  className={cn(
                    "w-full px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg hover:bg-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center space-x-2",
                    connecting === 'twitter' && "animate-pulse"
                  )}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{connecting === 'twitter' ? 'Connecting...' : 'Connect X'}</span>
                </button>
              )}
            </div>

            {/* Farcaster */}
            <div className="border border-dark-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FC</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Farcaster</h3>
                    <p className="text-dark-text-secondary text-xs">
                      Connect your Farcaster account for verification
                    </p>
                  </div>
                </div>
                {isConnected('farcaster') && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>

              {isConnected('farcaster') ? (
                <div>
                  <div className="bg-dark-surface rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-3">
                      {getConnection('farcaster')?.profileImage && (
                        <img
                          src={getConnection('farcaster')?.profileImage}
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">
                          @{getConnection('farcaster')?.username}
                        </p>
                        <p className="text-dark-text-secondary text-xs">
                          {getConnection('farcaster')?.displayName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect('farcaster')}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect('farcaster')}
                  disabled={loading || connecting === 'farcaster'}
                  className={cn(
                    "w-full px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg hover:bg-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center space-x-2",
                    connecting === 'farcaster' && "animate-pulse"
                  )}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{connecting === 'farcaster' ? 'Connecting...' : 'Connect Farcaster'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-dark-surface rounded-lg">
            <p className="text-dark-text-secondary text-xs">
              <strong className="text-white">Note:</strong> You only need to connect one social account 
              to verify your profile. Once verified, you'll get a checkmark badge that appears 
              throughout the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}