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
      {/* Profile Header */}
      <div className="bg-dark-card rounded-xl p-8 border border-dark-border mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {address?.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {formatAddress(address!)}
              </h1>
              <p className="text-dark-text-secondary">
                NFT Creator & Collector
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-dark-text-secondary hover:text-white hover:border-brand-primary/50 transition-all">
            <PencilIcon className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Wallet Address */}
        <div className="bg-dark-surface rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-muted text-sm mb-1">Wallet Address</p>
              <p className="text-white font-mono text-sm">{address}</p>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(address!)}
              className="p-2 hover:bg-dark-border rounded-lg transition-colors"
            >
              <ClipboardIcon className="w-4 h-4 text-dark-text-secondary" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">{mockCreated.length}</div>
            <div className="text-dark-text-secondary text-sm">Collections Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">{mockCollected.length}</div>
            <div className="text-dark-text-secondary text-sm">NFTs Collected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">
              {mockCreated.reduce((sum, item) => sum + parseFloat(item.earnings), 0).toFixed(3)} ETH
            </div>
            <div className="text-dark-text-secondary text-sm">Total Earnings</div>
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
        <div className="space-y-6">
          {mockCreated.map((collection) => (
            <div
              key={collection.id}
              className="bg-dark-card rounded-xl p-6 border border-dark-border hover:border-brand-primary/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                    <p className="text-dark-text-secondary text-sm">
                      {collection.minted}/{collection.total} minted
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-brand-primary font-semibold">
                    {collection.earnings} ETH
                  </div>
                  <div className="text-dark-text-secondary text-sm">Earned</div>
                </div>
              </div>
              
              <div className="mt-4 w-full bg-dark-surface rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-brand rounded-full transition-all duration-500"
                  style={{ width: `${(collection.minted / collection.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'collected' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCollected.map((nft) => (
            <div
              key={nft.id}
              className="bg-dark-card rounded-xl p-6 border border-dark-border hover-lift hover:border-brand-primary/50 transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl opacity-50">🖼️</div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{nft.name}</h3>
                <p className="text-dark-text-secondary text-sm mb-2">
                  from {nft.collection}
                </p>
                <div className="flex items-center justify-between text-sm">
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