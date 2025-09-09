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

// Mock data for MVP
const mockTrendingData = {
  '5m': [
    { id: 1, name: 'Cute Kitty #001', creator: 'Lisa Carter', price: '0.0001', image: '/api/placeholder/200/200', mints: 156, likes: 42 },
    { id: 2, name: 'Abstract Art #023', creator: 'John Doe', price: '0.0001', image: '/api/placeholder/200/200', mints: 134, likes: 38 },
    { id: 3, name: 'Pixel World #045', creator: 'Alice Smith', price: '0.0001', image: '/api/placeholder/200/200', mints: 98, likes: 29 },
  ],
  '1h': [
    { id: 4, name: 'Digital Dreams #067', creator: 'Bob Wilson', price: '0.0001', image: '/api/placeholder/200/200', mints: 342, likes: 87 },
    { id: 5, name: 'Neon Lights #089', creator: 'Eva Brown', price: '0.0001', image: '/api/placeholder/200/200', mints: 298, likes: 76 },
    { id: 6, name: 'Cosmic Journey #012', creator: 'Mike Davis', price: '0.0001', image: '/api/placeholder/200/200', mints: 267, likes: 65 },
  ],
  '24h': [
    { id: 7, name: 'Ocean Waves #034', creator: 'Sarah Johnson', price: '0.0001', image: '/api/placeholder/200/200', mints: 987, likes: 234 },
    { id: 8, name: 'Mountain Peak #056', creator: 'Tom Anderson', price: '0.0001', image: '/api/placeholder/200/200', mints: 876, likes: 198 },
    { id: 9, name: 'City Lights #078', creator: 'Grace Lee', price: '0.0001', image: '/api/placeholder/200/200', mints: 754, likes: 167 },
  ],
  '7d': [
    { id: 10, name: 'Ancient Ruins #090', creator: 'David Chen', price: '0.0001', image: '/api/placeholder/200/200', mints: 2341, likes: 567 },
    { id: 11, name: 'Future Tech #123', creator: 'Emma Wilson', price: '0.0001', image: '/api/placeholder/200/200', mints: 2156, likes: 489 },
    { id: 12, name: 'Nature Spirit #145', creator: 'Ryan Taylor', price: '0.0001', image: '/api/placeholder/200/200', mints: 1998, likes: 432 },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">
          Trending on NiFTa
        </h1>
        <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Discover the hottest NFT collections minting right now on Base network
        </p>
      </div>

      {/* Time Filters */}
      <div className="flex justify-center mb-8">
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

      {/* Trending Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {currentData.map((nft, index) => (
          <div
            key={nft.id}
            className="group bg-dark-card rounded-xl p-6 border border-dark-border hover-lift hover:border-brand-primary/50 transition-all duration-300"
          >
            {/* Rank Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                index === 0 ? 'bg-yellow-500 text-black' :
                index === 1 ? 'bg-gray-300 text-black' :
                index === 2 ? 'bg-yellow-600 text-white' :
                'bg-dark-surface text-dark-text-secondary'
              )}>
                #{index + 1}
              </div>
              <div className="flex items-center space-x-2 text-dark-text-muted text-sm">
                <span>{nft.mints} mints</span>
                <span>•</span>
                <span>{nft.likes} likes</span>
              </div>
            </div>

            {/* NFT Image */}
            <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-6xl opacity-50">🖼️</div>
            </div>

            {/* NFT Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-gradient transition-colors">
                {nft.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-dark-text-secondary text-sm">
                  by {nft.creator}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-brand-primary font-semibold">
                    {nft.price} ETH
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={`/collection/${nft.id}`}
              className="mt-4 w-full bg-gradient-brand text-white py-2 px-4 rounded-lg text-center block font-medium hover:opacity-90 transition-opacity"
            >
              View Collection
            </Link>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="text-center bg-dark-card rounded-xl p-6 border border-dark-border">
          <div className="text-2xl font-bold text-gradient">1,234</div>
          <div className="text-dark-text-secondary text-sm mt-1">Collections</div>
        </div>
        <div className="text-center bg-dark-card rounded-xl p-6 border border-dark-border">
          <div className="text-2xl font-bold text-gradient">45.6K</div>
          <div className="text-dark-text-secondary text-sm mt-1">NFTs Minted</div>
        </div>
        <div className="text-center bg-dark-card rounded-xl p-6 border border-dark-border">
          <div className="text-2xl font-bold text-gradient">567</div>
          <div className="text-dark-text-secondary text-sm mt-1">Active Now</div>
        </div>
        <div className="text-center bg-dark-card rounded-xl p-6 border border-dark-border">
          <div className="text-2xl font-bold text-gradient">12.3 ETH</div>
          <div className="text-dark-text-secondary text-sm mt-1">Volume 24h</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-card rounded-2xl p-8 border border-dark-border">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to Launch Your Collection?
        </h2>
        <p className="text-dark-text-secondary mb-6 max-w-xl mx-auto">
          Create your ERC-1155 collection with unique revenue sharing on Base network
        </p>
        <Link
          href="/create"
          className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <span>Create Collection</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}