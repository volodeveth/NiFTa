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
    minted: 234,
    totalSupply: 1000,
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
    minted: 567,
    totalSupply: 1000,
    endTime: 0, // No end time yet
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
    minted: 1000,
    totalSupply: 1000,
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
    minted: 156,
    totalSupply: 500,
    endTime: Math.floor(Date.now() / 1000) + 86400, // 1 day from now
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
          Explore Collections
        </h1>
        <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Discover all NFT collections on NiFTa - from trending drops to hidden gems
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
          <input
            type="text"
            placeholder="Search collections, creators, or addresses..."
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
        Showing {sortedCollections.length} collections
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collection/${collection.id}`}
            className="group bg-dark-card rounded-xl p-6 border border-dark-border hover-lift hover:border-brand-primary/50 transition-all duration-300"
          >
            {/* Collection Image */}
            <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="text-6xl opacity-50">🖼️</div>
              
              {/* Status Badge */}
              <div className={cn(
                'absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium',
                collection.isActive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              )}>
                {collection.isActive ? 'Active' : 'Ended'}
              </div>
            </div>

            {/* Collection Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-gradient transition-colors line-clamp-1">
                  {collection.name}
                </h3>
                <p className="text-dark-text-secondary text-sm">
                  by {collection.creator}
                </p>
              </div>

              <p className="text-dark-text-muted text-sm line-clamp-2">
                {collection.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="text-dark-text-secondary">
                  {collection.minted}/{collection.totalSupply} minted
                </div>
                <div className="text-brand-primary font-medium">
                  {collection.price} ETH
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-dark-surface rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-brand rounded-full transition-all duration-500"
                  style={{ width: `${(collection.minted / collection.totalSupply) * 100}%` }}
                />
              </div>

              {/* Time Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="text-dark-text-muted">
                  Created {timeAgo(collection.createdAt)}
                </div>
                {collection.endTime > 0 && (
                  <div className={cn(
                    'font-medium',
                    collection.isActive ? 'text-yellow-400' : 'text-red-400'
                  )}>
                    {collection.isActive 
                      ? `Ends in ${Math.max(0, Math.floor((collection.endTime - Date.now() / 1000) / 3600))}h`
                      : 'Ended'
                    }
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
          <h3 className="text-xl font-semibold text-white mb-2">No collections found</h3>
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
            Load More Collections
          </button>
        </div>
      )}
    </div>
  )
}