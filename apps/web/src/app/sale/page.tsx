'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, timeAgo } from '@/lib/utils'
import ShareButton from '@/components/ui/ShareButton'

// Mock data for MVP
const mockListings = [
  {
    id: 1,
    collection: 'Quantum Patterns',
    name: 'Quantum Pattern #042',
    seller: 'QuantumArt',
    sellerAddress: '0x1234...5678',
    price: '0.0015',
    image: '/api/placeholder/200/200',
    listedAt: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    category: 'Art'
  },
  {
    id: 2,
    collection: 'Cyber Pets',
    name: 'Digital Cat #156',
    seller: 'PetLover',
    sellerAddress: '0x2345...6789',
    price: '0.0008',
    image: '/api/placeholder/200/200',
    listedAt: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    category: 'Gaming'
  },
]

const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low']

export default function SalePage() {
  const [sortBy, setSortBy] = useState('Newest')
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">
          For Sale
        </h1>
        <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Discover NFTs available for immediate purchase on the marketplace
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-dark-text-secondary text-sm">
          {mockListings.length} items available
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Listings Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {mockListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-dark-card rounded-lg p-3 border border-dark-border hover:border-brand-primary/50 transition-all duration-300 active:scale-95"
          >
            {/* NFT Image */}
            <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg mb-2 flex items-center justify-center relative">
              <div className="text-2xl opacity-50">🖼️</div>
              
              {/* Share Button */}
              <div className="absolute top-2 right-2">
                <ShareButton 
                  nftId={listing.id} 
                  nftName={listing.name} 
                  compact 
                  className="z-10"
                />
              </div>
            </div>

            {/* NFT Info - Compact */}
            <div className="space-y-1">
              <div>
                <h3 className="text-sm font-semibold text-white line-clamp-1">
                  {listing.name}
                </h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-brand-primary font-semibold text-sm">
                  {listing.price} ETH
                </div>
                <div className="text-dark-text-muted text-xs">
                  {timeAgo(listing.listedAt)}
                </div>
              </div>

              <Link
                href={`/profile`}
                className="text-dark-text-muted text-xs line-clamp-1 hover:text-brand-primary transition-colors inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                by {listing.seller}
              </Link>

              {/* Buy Button - Compact */}
              <button className="w-full bg-gradient-brand text-white py-1.5 px-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-xs mt-2">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for low listings */}
      {mockListings.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-50">🛒</div>
          <h3 className="text-xl font-semibold text-white mb-2">No items for sale</h3>
          <p className="text-dark-text-secondary mb-6">
            Check back later or explore collections to find NFTs to mint
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center space-x-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <span>Explore Collections</span>
          </Link>
        </div>
      )}

      {/* Load More */}
      {mockListings.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-dark-card border border-dark-border rounded-lg text-dark-text-secondary hover:text-white hover:border-brand-primary/50 transition-all">
            Load More Items
          </button>
        </div>
      )}
    </div>
  )
}