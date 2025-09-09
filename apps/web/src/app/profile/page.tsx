'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn, formatAddress } from '@/lib/utils'
import { 
  PencilIcon,
  LinkIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'created' | 'collected'>('created')
  
  const mockCreated = [
    { id: 1, name: 'My Art Collection', minted: 45, total: 100, earnings: '0.045' },
    { id: 2, name: 'Digital Memories', minted: 78, total: 500, earnings: '0.078' },
  ]
  
  const mockCollected = [
    { id: 1, name: 'Quantum Pattern #042', collection: 'Quantum Art', owned: 1 },
    { id: 2, name: 'Cyber Pet #156', collection: 'Digital Pets', owned: 2 },
  ]

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6 opacity-50">👤</div>
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-dark-text-secondary mb-8 max-w-md mx-auto">
            Connect your wallet to view your profile and manage your NFTs
          </p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header - Mobile Optimized */}
      <div className="bg-dark-card rounded-xl p-4 border border-dark-border mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-brand rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {address?.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white mb-1">
                {formatAddress(address!)}
              </h1>
              <p className="text-dark-text-secondary text-sm">
                NFT Creator & Collector
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-dark-text-secondary hover:text-white hover:border-brand-primary/50 transition-all text-sm">
            <PencilIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* Wallet Address - Mobile Compact */}
        <div className="bg-dark-surface rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-dark-text-muted text-xs mb-1">Wallet Address</p>
              <p className="text-white font-mono text-xs truncate">{address}</p>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(address!)}
              className="p-2 hover:bg-dark-border rounded-lg transition-colors flex-shrink-0 ml-2"
            >
              <ClipboardIcon className="w-4 h-4 text-dark-text-secondary" />
            </button>
          </div>
        </div>

        {/* Stats - Mobile Compact */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-gradient">{mockCreated.length}</div>
            <div className="text-dark-text-secondary text-xs">Created</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gradient">{mockCollected.length}</div>
            <div className="text-dark-text-secondary text-xs">Collected</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gradient">
              {mockCreated.reduce((sum, item) => sum + parseFloat(item.earnings), 0).toFixed(3)}
            </div>
            <div className="text-dark-text-secondary text-xs">ETH Earned</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 mb-8 border-b border-dark-border">
        <button
          onClick={() => setActiveTab('created')}
          className={cn(
            'pb-4 text-lg font-medium border-b-2 transition-colors',
            activeTab === 'created'
              ? 'text-brand-primary border-brand-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          )}
        >
          Created ({mockCreated.length})
        </button>
        <button
          onClick={() => setActiveTab('collected')}
          className={cn(
            'pb-4 text-lg font-medium border-b-2 transition-colors',
            activeTab === 'collected'
              ? 'text-brand-primary border-brand-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          )}
        >
          Collected ({mockCollected.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'created' && (
        <div className="space-y-4">
          {mockCreated.map((collection) => (
            <div
              key={collection.id}
              className="bg-dark-card rounded-lg p-4 border border-dark-border hover:border-brand-primary/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎨</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white line-clamp-1">{collection.name}</h3>
                    <p className="text-dark-text-secondary text-sm">
                      {collection.minted}/{collection.total} minted
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-brand-primary font-semibold text-sm">
                    {collection.earnings} ETH
                  </div>
                  <div className="text-dark-text-secondary text-xs">Earned</div>
                </div>
              </div>
              
              <div className="mt-3 w-full bg-dark-surface rounded-full h-1.5">
                <div 
                  className="h-1.5 bg-gradient-brand rounded-full transition-all duration-500"
                  style={{ width: `${(collection.minted / collection.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'collected' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {mockCollected.map((nft) => (
            <div
              key={nft.id}
              className="bg-dark-card rounded-lg p-3 border border-dark-border hover:border-brand-primary/50 transition-all duration-300 active:scale-95"
            >
              <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg mb-2 flex items-center justify-center">
                <div className="text-2xl opacity-50">🖼️</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{nft.name}</h3>
                <p className="text-dark-text-secondary text-xs mb-2 line-clamp-1">
                  {nft.collection}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-text-muted">Owned</span>
                  <span className="text-brand-primary font-medium">{nft.owned}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty States */}
      {activeTab === 'created' && mockCreated.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-50">🎨</div>
          <h3 className="text-xl font-semibold text-white mb-2">No collections created yet</h3>
          <p className="text-dark-text-secondary mb-6">
            Start your NFT journey by creating your first collection
          </p>
          <button className="bg-gradient-brand text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Create Collection
          </button>
        </div>
      )}

      {activeTab === 'collected' && mockCollected.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-50">🛒</div>
          <h3 className="text-xl font-semibold text-white mb-2">No NFTs collected yet</h3>
          <p className="text-dark-text-secondary mb-6">
            Explore the marketplace to find and collect amazing NFTs
          </p>
          <button className="bg-gradient-brand text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Explore Marketplace
          </button>
        </div>
      )}
    </div>
  )
}