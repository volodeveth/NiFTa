'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, timeAgo } from '@/lib/utils'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

// Mock data for MVP
const mockCollections = [
  {
    id: 1,
    name: 'Quantum Patterns',
    creator: 'QuantumArt',
    creatorAddress: '0x1234...5678',
    description: 'Abstract digital art exploring quantum mechanics through visual patterns',
    image: '/api/placeholder/300/300',
    price: '0.0001',
    minted: 1234, // Past 1000 trigger, timer active
    triggerMints: 1000,
    endTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    createdAt: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    isActive: true,
    category: 'Art'
  },
  {
    id: 2,
    name: 'Cyber Pets Collection',
    creator: 'DigitalPets',
    creatorAddress: '0x2345...6789',
    description: 'Cute digital pets living in the metaverse',
    image: '/api/placeholder/300/300',
    price: '0.0001',
    minted: 567, // Before trigger
    triggerMints: 1000,
    endTime: 0, // No timer yet
    createdAt: Math.floor(Date.now() / 1000) - 14400, // 4 hours ago
    isActive: true,
    category: 'Gaming'
  },
  {
    id: 3,
    name: 'Base Builders',
    creator: 'BaseDAO',
    creatorAddress: '0x3456...7890',
    description: 'Celebrating builders on Base network',
    image: '/api/placeholder/300/300',
    price: '0.0001',
    minted: 2567, // Timer ended, high mint count
    triggerMints: 1000,
    endTime: Math.floor(Date.now() / 1000) - 3600, // Ended 1 hour ago
    createdAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
    isActive: false,
    category: 'Community'
  },
  {
    id: 4,
    name: 'Farcaster Frames',
    creator: 'FrameArt',
    creatorAddress: '0x4567...8901',
    description: 'Interactive frames for Farcaster ecosystem',
    image: '/api/placeholder/300/300',
    price: '0.0001',
    minted: 156, // Early stage
    triggerMints: 1000,
    endTime: 0, // No timer yet
    createdAt: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago
    isActive: true,
    category: 'Social'
  },
]

const categories = ['All', 'Art', 'Gaming', 'Community', 'Social', 'Music', 'Photography']
const sortOptions = ['Newest', 'Oldest', 'Most Minted', 'Ending Soon']

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const [showFilters, setShowFilters] = useState(false)

  const filteredCollections = mockCollections.filter((collection) => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.creatorAddress.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || collection.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'Oldest':
        return a.createdAt - b.createdAt
      case 'Most Minted':
        return b.minted - a.minted
      case 'Ending Soon':
        if (!a.endTime && !b.endTime) return 0
        if (!a.endTime) return 1
        if (!b.endTime) return -1
        return a.endTime - b.endTime
      default: // Newest
        return b.createdAt - a.createdAt
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">
          Explore NFTs
        </h1>
        <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Discover all NFTs on NiFTa - from trending drops to hidden gems
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
          <input
            type="text"
            placeholder="Search NFTs, creators, or addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text-secondary hover:text-white transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-white font-medium mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      selectedCategory === category
                        ? 'bg-brand-primary text-white'
                        : 'bg-dark-surface text-dark-text-secondary hover:text-white hover:bg-dark-border'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-white font-medium mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full max-w-xs px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-dark-text-secondary text-sm mb-6">
        Showing {sortedCollections.length} NFTs
      </div>

      {/* NFTs Grid - Mobile Optimized (matching sale page) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {sortedCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collection/${collection.id}`}
            className="group bg-dark-card rounded-lg p-3 border border-dark-border hover:border-brand-primary/50 transition-all duration-300 active:scale-95"
          >
            {/* NFT Image */}
            <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
              <div className="text-2xl opacity-50">🖼️</div>
              
              {/* Status Badge */}
              <div className={cn(
                'absolute top-2 right-2 w-2 h-2 rounded-full',
                collection.isActive
                  ? 'bg-green-400'
                  : 'bg-red-400'
              )}>
              </div>
            </div>

            {/* NFT Info - Compact */}
            <div className="space-y-1">
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-gradient transition-colors line-clamp-1">
                  {collection.name}
                </h3>
                <p className="text-dark-text-secondary text-xs line-clamp-1">
                  by {collection.creator}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-brand-primary font-semibold text-sm">
                  {collection.price} ETH
                </div>
                <div className="text-dark-text-muted text-xs">
                  {collection.minted.toLocaleString()} minted
                </div>
              </div>

              {/* Progress Bar - to trigger only */}
              {collection.minted < collection.triggerMints && (
                <div className="w-full bg-dark-surface rounded-full h-1">
                  <div 
                    className="h-1 bg-gradient-brand rounded-full transition-all duration-500"
                    style={{ width: `${(collection.minted / collection.triggerMints) * 100}%` }}
                  />
                </div>
              )}
              {collection.minted >= collection.triggerMints && (
                <div className="w-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full h-1" />
              )}

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <div className={cn(
                  'font-medium',
                  collection.isActive ? 'text-green-400' : 'text-red-400'
                )}>
                  {collection.isActive 
                    ? (collection.endTime > 0 ? 'Timer Active' : 'Unlimited') 
                    : 'Ended'
                  }
                </div>
                {collection.endTime > 0 && collection.isActive && (
                  <div className="text-yellow-400 font-medium">
                    {Math.max(0, Math.floor((collection.endTime - Date.now() / 1000) / 3600))}h left
                  </div>
                )}
                {collection.minted >= collection.triggerMints && collection.endTime === 0 && (
                  <div className="text-orange-400 font-medium">
                    Trigger reached
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sortedCollections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No NFTs found</h3>
          <p className="text-dark-text-secondary mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
              setSortBy('Newest')
            }}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Load More */}
      {sortedCollections.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-dark-card border border-dark-border rounded-lg text-dark-text-secondary hover:text-white hover:border-brand-primary/50 transition-all">
            Load More NFTs
          </button>
        </div>
      )}
    </div>
  )
}