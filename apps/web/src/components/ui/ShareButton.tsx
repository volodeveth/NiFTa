'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { cn } from '@/lib/utils'
import { 
  ShareIcon,
  ClipboardIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface ShareButtonProps {
  nftId: string | number
  nftName: string
  className?: string
  compact?: boolean // For use in NFT cards
}

// Social platform configurations
const SOCIAL_PLATFORMS = {
  x: {
    name: 'X (Twitter)',
    icon: '𝕏',
    shareUrl: (url: string, text: string) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + url)}`,
    generateText: (nftName: string) => 
      `Check out "${nftName}" on @NiFTa_fun! 🔥\n\nMint on Base network with unique revenue sharing model.\n\n`
  },
  farcaster: {
    name: 'Farcaster',
    icon: '🟣',
    shareUrl: (url: string, text: string) => 
      `https://warpcast.com/~/compose?text=${encodeURIComponent(text + url)}`,
    generateText: (nftName: string) => 
      `Discovered "${nftName}" on NiFTa! \n\nUnique NFT marketplace on Base with creator-first economics.\n\n`
  }
}

export default function ShareButton({ nftId, nftName, className, compact = false }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { address } = useAccount()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Generate referral URL - ЗАВЖДИ з реферальним посиланням якщо користувач підключений
  const generateShareUrl = () => {
    const baseUrl = `${window.location.origin}/nft/${nftId}`
    
    // Додаємо реферальний параметр якщо користувач підключений
    if (address) {
      return `${baseUrl}?ref=${address}`
    }
    
    return baseUrl
  }

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      const shareUrl = generateShareUrl()
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      // Close dropdown after short delay
      setTimeout(() => setIsOpen(false), 500)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = generateShareUrl()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setTimeout(() => setIsOpen(false), 500)
    }
  }

  // Share to social platform - URL вже містить реферальне посилання
  const handleSocialShare = (platform: keyof typeof SOCIAL_PLATFORMS) => {
    const config = SOCIAL_PLATFORMS[platform]
    const shareUrl = generateShareUrl() // Вже з реферальним посиланням!
    const shareText = config.generateText(nftName)
    const socialUrl = config.shareUrl(shareUrl, shareText)
    
    // Open in new window
    window.open(socialUrl, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (compact) {
    // Compact version for NFT cards
    return (
      <div className={cn('relative', className)} ref={dropdownRef}>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="p-2 bg-dark-card/80 backdrop-blur-sm rounded-lg hover:bg-dark-surface transition-colors"
          title="Share NFT"
        >
          <ShareIcon className="w-4 h-4 text-white" />
        </button>

        {/* Compact Dropdown */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 min-w-[180px]">
            <div className="p-2 space-y-1">
              {/* Social platforms */}
              {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
                <button
                  key={key}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSocialShare(key as keyof typeof SOCIAL_PLATFORMS)
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-dark-text-secondary hover:text-white hover:bg-dark-surface rounded-lg transition-colors"
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span>{platform.name}</span>
                </button>
              ))}
              
              {/* Copy link */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleCopyLink()
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-dark-text-secondary hover:text-white hover:bg-dark-surface rounded-lg transition-colors"
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ClipboardIcon className="w-4 h-4" />
                )}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full version for NFT detail page
  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text-secondary hover:text-white hover:border-brand-primary/50 transition-all"
      >
        <ShareIcon className="w-5 h-5" />
        <span>Share</span>
      </button>

      {/* Full Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-dark-card border border-dark-border rounded-xl shadow-xl z-50 min-w-[280px]">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Share NFT</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-dark-text-muted hover:text-white transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Referral Info */}
            {address && (
              <div className="mb-4 p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
                <div className="text-sm text-brand-primary font-medium mb-1">
                  🎯 Referral Active
                </div>
                <div className="text-xs text-brand-primary/80">
                  Your referral link will be included in all shares - earn 20% from mints!
                </div>
              </div>
            )}

            {/* No wallet connected info */}
            {!address && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-sm text-yellow-400 font-medium mb-1">
                  💡 Connect Wallet
                </div>
                <div className="text-xs text-yellow-400/80">
                  Connect your wallet to earn 20% referral rewards from shared links
                </div>
              </div>
            )}

            {/* Social Platforms */}
            <div className="space-y-2 mb-4">
              <div className="text-sm text-dark-text-secondary mb-2">Share on Social</div>
              {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
                <button
                  key={key}
                  onClick={() => handleSocialShare(key as keyof typeof SOCIAL_PLATFORMS)}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-dark-text-secondary hover:text-white hover:bg-dark-surface rounded-lg transition-colors"
                >
                  <span className="text-xl">{platform.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{platform.name}</div>
                    {address && (
                      <div className="text-xs text-brand-primary/60">with referral link</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Copy Link Section */}
            <div className="border-t border-dark-border pt-4">
              <div className="text-sm text-dark-text-secondary mb-2">Direct Link</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-sm text-dark-text-muted truncate">
                  {generateShareUrl()}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                      : 'bg-brand-primary text-white hover:opacity-90'
                  )}
                >
                  {copied ? (
                    <div className="flex items-center space-x-1">
                      <CheckIcon className="w-4 h-4" />
                      <span>Copied</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <ClipboardIcon className="w-4 h-4" />
                      <span>Copy</span>
                    </div>
                  )}
                </button>
              </div>
              {address && (
                <div className="text-xs text-brand-primary/60 mt-1">
                  ✓ Includes your referral code
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}