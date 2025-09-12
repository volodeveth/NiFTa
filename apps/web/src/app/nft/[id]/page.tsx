'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn, formatAddress } from '@/lib/utils'
import { 
  ClockIcon,
  UserIcon,
  FireIcon,
  ShareIcon,
  HeartIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

// Mock NFT data - in production this would come from contracts/subgraph
const mockNFTs: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Cute Kitty #001',
    description: 'An adorable digital cat that brings joy and happiness to the metaverse. This unique NFT represents the perfect blend of art and technology.',
    creator: 'Lisa Carter',
    creatorAddress: '0x1234...5678',
    image: '/api/placeholder/400/400',
    price: '0.0001',
    minted: 1156, // Past 1000 trigger, timer active
    triggerMints: 1000, // Timer triggers after this many mints
    firstPaidMinter: '0x2345...6789',
    endTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now (48h timer active)
    isActive: true,
    likes: 42,
    category: 'Art',
    createdAt: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
  },
  '2': {
    id: 2,
    name: 'Abstract Art #023',
    description: 'A stunning piece of abstract digital art that explores the boundaries between reality and imagination.',
    creator: 'John Doe',
    creatorAddress: '0x3456...7890',
    image: '/api/placeholder/400/400',
    price: '0.0001',
    minted: 734, // Before 1000 trigger
    triggerMints: 1000,
    firstPaidMinter: '0x4567...8901',
    endTime: 0, // No timer yet - unlimited minting until 1000
    isActive: true,
    likes: 38,
    category: 'Art',
    createdAt: Math.floor(Date.now() / 1000) - 14400, // 4 hours ago
  }
}

export default function NFTDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [liked, setLiked] = useState(false)
  const [mintAmount, setMintAmount] = useState(1)

  const nft = mockNFTs[params.id as string]

  if (!nft) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6 opacity-50">❓</div>
          <h1 className="text-3xl font-bold text-white mb-4">NFT Not Found</h1>
          <p className="text-dark-text-secondary mb-8">
            This NFT doesn't exist or has been removed
          </p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-brand text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const progressToTrigger = Math.min((nft.minted / nft.triggerMints) * 100, 100)
  const timeLeft = nft.endTime > 0 ? Math.max(0, nft.endTime - Math.floor(Date.now() / 1000)) : 0
  const hoursLeft = Math.floor(timeLeft / 3600)
  const minutesLeft = Math.floor((timeLeft % 3600) / 60)

  const handleMint = () => {
    if (!isConnected) return
    // In production: call mint contract function
    console.log(`Minting ${mintAmount} of NFT ${nft.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-dark-text-secondary hover:text-white transition-colors mb-6"
      >
        <ChevronLeftIcon className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NFT Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="text-6xl opacity-50">🖼️</div>
            
            {/* Status Indicator */}
            <div className={cn(
              'absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium',
              nft.isActive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            )}>
              {nft.isActive ? 'Active' : 'Ended'}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setLiked(!liked)}
                className="p-2 bg-dark-card/80 backdrop-blur-sm rounded-lg hover:bg-dark-surface transition-colors"
              >
                {liked ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-white" />
                )}
              </button>
              <button className="p-2 bg-dark-card/80 backdrop-blur-sm rounded-lg hover:bg-dark-surface transition-colors">
                <ShareIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-dark-card rounded-lg p-4">
              <div className="text-2xl font-bold text-gradient">{nft.minted.toLocaleString()}</div>
              <div className="text-dark-text-secondary text-sm">Minted</div>
            </div>
            <div className="text-center bg-dark-card rounded-lg p-4">
              <div className="text-2xl font-bold text-gradient">{nft.likes + (liked ? 1 : 0)}</div>
              <div className="text-dark-text-secondary text-sm">Likes</div>
            </div>
            <div className="text-center bg-dark-card rounded-lg p-4">
              <div className="text-2xl font-bold text-gradient">∞</div>
              <div className="text-dark-text-secondary text-sm">Supply</div>
            </div>
          </div>
        </div>

        {/* NFT Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{nft.name}</h1>
            <div className="flex items-center space-x-4 text-dark-text-secondary">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>by {nft.creator}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>2h ago</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {nft.description && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-dark-text-secondary">{nft.description}</p>
            </div>
          )}

          {/* Progress to Timer Trigger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {nft.minted >= nft.triggerMints ? 'Timer Triggered' : 'Progress to Timer'}
              </span>
              <span className="text-brand-primary font-medium">
                {nft.minted >= nft.triggerMints 
                  ? `${nft.minted.toLocaleString()} minted` 
                  : `${nft.minted}/${nft.triggerMints} (${progressToTrigger.toFixed(1)}%)`
                }
              </span>
            </div>
            <div className="w-full bg-dark-surface rounded-full h-3">
              <div 
                className={cn(
                  "h-3 rounded-full transition-all duration-500",
                  nft.minted >= nft.triggerMints 
                    ? "bg-gradient-to-r from-yellow-500 to-red-500" 
                    : "bg-gradient-brand"
                )}
                style={{ width: `${Math.min(progressToTrigger, 100)}%` }}
              />
            </div>
            {nft.minted < nft.triggerMints && (
              <p className="text-dark-text-muted text-sm">
                After {nft.triggerMints.toLocaleString()} mints, 48h timer will start
              </p>
            )}
          </div>

          {/* Timer */}
          {nft.endTime > 0 && nft.isActive && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                <FireIcon className="w-5 h-5" />
                <span className="font-medium">48h Timer Active - Unlimited Minting!</span>
              </div>
              <div className="text-white text-2xl font-bold">
                {hoursLeft}h {minutesLeft}m left
              </div>
              <p className="text-yellow-200 text-sm mt-2">
                Mint as many as you want before time runs out!
              </p>
            </div>
          )}

          {/* Pre-Timer State */}
          {nft.endTime === 0 && nft.minted < nft.triggerMints && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-400 mb-2">
                <ClockIcon className="w-5 h-5" />
                <span className="font-medium">Unlimited Minting Phase</span>
              </div>
              <p className="text-blue-200 text-sm">
                Mint freely until {nft.triggerMints.toLocaleString()} total mints, then 48h timer starts
              </p>
            </div>
          )}

          {/* Mint Section */}
          <div className="bg-dark-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Mint Price</span>
              <span className="text-brand-primary font-bold text-xl">{nft.price} ETH</span>
            </div>

            {/* Amount Selector */}
            <div className="flex items-center justify-between">
              <span className="text-dark-text-secondary">Amount</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                  className="w-8 h-8 rounded-lg bg-dark-surface flex items-center justify-center text-white hover:bg-dark-border transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium min-w-[2rem] text-center">{mintAmount}</span>
                <button
                  onClick={() => setMintAmount(Math.min(10, mintAmount + 1))}
                  className="w-8 h-8 rounded-lg bg-dark-surface flex items-center justify-center text-white hover:bg-dark-border transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-dark-border pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-text-secondary">Total</span>
                <span className="text-white font-bold text-xl">
                  {(parseFloat(nft.price) * mintAmount).toFixed(4)} ETH
                </span>
              </div>

              {!isConnected ? (
                <ConnectButton />
              ) : (
                <button
                  onClick={handleMint}
                  disabled={!nft.isActive}
                  className={cn(
                    'w-full py-3 px-6 rounded-lg font-medium transition-opacity',
                    nft.isActive
                      ? 'bg-gradient-brand text-white hover:opacity-90'
                      : 'bg-dark-surface text-dark-text-muted cursor-not-allowed'
                  )}
                >
                  {nft.isActive ? 'Mint NFT' : 'Minting Ended'}
                </button>
              )}
            </div>
          </div>

          {/* Revenue Info */}
          <div className="bg-dark-surface rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Revenue Distribution</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-text-secondary">Creator:</span>
                <span className="text-brand-primary font-medium">50%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-text-secondary">First Minter:</span>
                <span className="text-brand-primary font-medium">10%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-text-secondary">Referral:</span>
                <span className="text-brand-primary font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-text-secondary">Platform:</span>
                <span className="text-brand-primary font-medium">20%</span>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="bg-dark-card rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Creator</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {nft.creatorAddress.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-white font-medium">{nft.creator}</div>
                <div className="text-dark-text-secondary text-sm">{nft.creatorAddress}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}