'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  ClockIcon,
  FireIcon,
  EyeIcon,
  HeartIcon 
} from '@heroicons/react/24/outline'
import ShareButton from '@/components/ui/ShareButton'

// Mock data for MVP - 10 items per category
const mockTrendingData = {
  '5m': [
    { id: 1, name: 'Cute Kitty #001', creator: 'Lisa Carter', price: '0.0001', mints: 156, likes: 42 },
    { id: 2, name: 'Abstract Art #023', creator: 'John Doe', price: '0.0001', mints: 134, likes: 38 },
    { id: 3, name: 'Pixel World #045', creator: 'Alice Smith', price: '0.0001', mints: 98, likes: 29 },
    { id: 4, name: 'Cyber Cat #067', creator: 'Tech Artist', price: '0.0001', mints: 87, likes: 22 },
    { id: 5, name: 'Digital Dreams #089', creator: 'DreamMaker', price: '0.0001', mints: 76, likes: 18 },
    { id: 6, name: 'Neon Punk #012', creator: 'NeonArt', price: '0.0001', mints: 65, likes: 15 },
    { id: 7, name: 'Space Explorer #034', creator: 'SpaceDAO', price: '0.0001', mints: 54, likes: 12 },
    { id: 8, name: 'Robot Friend #056', creator: 'RoboCreate', price: '0.0001', mints: 43, likes: 9 },
    { id: 9, name: 'Magic Crystal #078', creator: 'Crystal Labs', price: '0.0001', mints: 32, likes: 7 },
    { id: 10, name: 'Fire Dragon #090', creator: 'Dragon Studio', price: '0.0001', mints: 21, likes: 5 },
  ],
  '1h': [
    { id: 11, name: 'Ocean Wave #123', creator: 'Wave Rider', price: '0.0001', mints: 342, likes: 87 },
    { id: 12, name: 'Mountain Top #145', creator: 'Peak Climber', price: '0.0001', mints: 298, likes: 76 },
    { id: 13, name: 'Forest Spirit #167', creator: 'Nature Soul', price: '0.0001', mints: 267, likes: 65 },
    { id: 14, name: 'City Lights #189', creator: 'Urban Artist', price: '0.0001', mints: 234, likes: 54 },
    { id: 15, name: 'Desert Storm #201', creator: 'Sand Walker', price: '0.0001', mints: 212, likes: 43 },
    { id: 16, name: 'Ice Kingdom #223', creator: 'Frost King', price: '0.0001', mints: 198, likes: 32 },
    { id: 17, name: 'Thunder Strike #245', creator: 'Storm Lord', price: '0.0001', mints: 176, likes: 28 },
    { id: 18, name: 'Rainbow Bridge #267', creator: 'Color Master', price: '0.0001', mints: 154, likes: 24 },
    { id: 19, name: 'Golden Sun #289', creator: 'Solar Punk', price: '0.0001', mints: 132, likes: 20 },
    { id: 20, name: 'Silver Moon #301', creator: 'Lunar Artist', price: '0.0001', mints: 110, likes: 16 },
  ],
  '24h': [
    { id: 21, name: 'Quantum Leap #323', creator: 'Quantum Labs', price: '0.0001', mints: 987, likes: 234 },
    { id: 22, name: 'Time Machine #345', creator: 'Time Traveler', price: '0.0001', mints: 876, likes: 198 },
    { id: 23, name: 'Portal Gate #367', creator: 'Portal Master', price: '0.0001', mints: 754, likes: 167 },
    { id: 24, name: 'Energy Core #389', creator: 'Power Source', price: '0.0001', mints: 698, likes: 145 },
    { id: 25, name: 'Mind Link #401', creator: 'Brain Wave', price: '0.0001', mints: 632, likes: 123 },
    { id: 26, name: 'Soul Gem #423', creator: 'Spirit Guide', price: '0.0001', mints: 587, likes: 109 },
    { id: 27, name: 'Data Stream #445', creator: 'Code Ninja', price: '0.0001', mints: 534, likes: 98 },
    { id: 28, name: 'Pixel Matrix #467', creator: 'Matrix Hacker', price: '0.0001', mints: 487, likes: 87 },
    { id: 29, name: 'Neon Grid #489', creator: 'Grid Runner', price: '0.0001', mints: 445, likes: 76 },
    { id: 30, name: 'Cyber Pulse #501', creator: 'Pulse Maker', price: '0.0001', mints: 398, likes: 65 },
  ],
  '7d': [
    { id: 31, name: 'Genesis Block #523', creator: 'Block Builder', price: '0.0001', mints: 2341, likes: 567 },
    { id: 32, name: 'Smart Contract #545', creator: 'Code Wizard', price: '0.0001', mints: 2156, likes: 489 },
    { id: 33, name: 'DeFi Protocol #567', creator: 'DeFi Master', price: '0.0001', mints: 1998, likes: 432 },
    { id: 34, name: 'NFT Standard #589', creator: 'Standard Maker', price: '0.0001', mints: 1876, likes: 398 },
    { id: 35, name: 'Token Bridge #601', creator: 'Bridge Builder', price: '0.0001', mints: 1754, likes: 367 },
    { id: 36, name: 'Chain Link #623', creator: 'Link Master', price: '0.0001', mints: 1632, likes: 334 },
    { id: 37, name: 'Gas Station #645', creator: 'Gas Optimizer', price: '0.0001', mints: 1510, likes: 298 },
    { id: 38, name: 'Validator Node #667', creator: 'Node Runner', price: '0.0001', mints: 1398, likes: 267 },
    { id: 39, name: 'Merkle Tree #689', creator: 'Tree Planter', price: '0.0001', mints: 1276, likes: 234 },
    { id: 40, name: 'Hash Function #701', creator: 'Hash Creator', price: '0.0001', mints: 1154, likes: 201 },
  ],
}

const timeFilters = [
  { key: '5m', label: '5m', icon: ClockIcon },
  { key: '1h', label: '1h', icon: FireIcon },
  { key: '24h', label: '24h', icon: EyeIcon },
  { key: '7d', label: '7d', icon: HeartIcon },
] as const

type TimeFilter = typeof timeFilters[number]['key']

export default function TrendingPage() {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('24h')
  const currentData = mockTrendingData[activeFilter]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">
          Trending on NiFTa
        </h1>
        <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Discover the hottest NFTs minting right now on Base network
        </p>
      </div>

      {/* Time Filters */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2 bg-dark-card rounded-xl p-2">
          {timeFilters.map((filter) => {
            const Icon = filter.icon
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeFilter === filter.key
                    ? 'bg-gradient-brand text-white shadow-lg'
                    : 'text-dark-text-secondary hover:text-white hover:bg-dark-surface'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Trending List - Compact */}
      <div className="space-y-2 mb-8">
        {currentData.map((nft, index) => (
          <Link
            key={nft.id}
            href={`/nft/${nft.id}`}
            className="group bg-dark-card rounded-lg p-4 border border-dark-border hover:border-brand-primary/50 transition-all duration-300 active:scale-95 flex items-center space-x-4 min-h-[72px]"
          >
            {/* Rank Badge */}
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0',
              index === 0 ? 'bg-yellow-500 text-black' :
              index === 1 ? 'bg-gray-300 text-black' :
              index === 2 ? 'bg-yellow-600 text-white' :
              'bg-dark-surface text-dark-text-secondary'
            )}>
              {index + 1}
            </div>

            {/* NFT Image - Small */}
            <div className="w-14 h-14 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-xl opacity-50">🖼️</div>
            </div>

            {/* NFT Info - Expanded */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-white group-hover:text-gradient transition-colors truncate">
                    {nft.name}
                  </h3>
                  <p className="text-dark-text-secondary text-sm truncate">
                    {nft.creator}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-brand-primary font-medium text-base whitespace-nowrap">
                    {nft.price} ETH
                  </div>
                  <div className="text-dark-text-muted text-sm whitespace-nowrap">
                    {nft.mints} mints • {nft.likes}♥
                  </div>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex-shrink-0">
              <ShareButton 
                nftId={nft.id} 
                nftName={nft.name} 
                compact 
                className="z-10"
              />
            </div>
          </Link>
        ))}
      </div>


      {/* CTA Section - Mobile Optimized */}
      <div className="text-center bg-gradient-card rounded-xl p-6 border border-dark-border">
        <h2 className="text-xl font-bold text-white mb-3">
          Create Your First NFT
        </h2>
        <p className="text-dark-text-secondary mb-4 text-sm">
          Mint on Base with 0.0001 ETH and unique revenue sharing
        </p>
        <Link
          href="/create"
          className="inline-flex items-center justify-center w-full sm:w-auto bg-gradient-brand text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity active:scale-95"
        >
          <span>Create NFT</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>
    </div>
  )
}