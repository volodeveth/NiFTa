'use client'

import { Suspense } from 'react'
import NFTPageContent from '@/components/ui/NFTPageContent'

function LoadingSpinner() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-6 bg-dark-surface rounded w-20 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-dark-surface rounded-xl"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-dark-surface rounded-lg p-4 h-20"></div>
              <div className="bg-dark-surface rounded-lg p-4 h-20"></div>
              <div className="bg-dark-surface rounded-lg p-4 h-20"></div>
            </div>
          </div>
          
          {/* Right column - Info skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-dark-surface rounded w-3/4"></div>
              <div className="h-4 bg-dark-surface rounded w-1/2"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-dark-surface rounded w-full"></div>
              <div className="h-4 bg-dark-surface rounded w-full"></div>
              <div className="h-4 bg-dark-surface rounded w-3/4"></div>
            </div>
            <div className="bg-dark-card rounded-xl p-6 space-y-4">
              <div className="h-20 bg-dark-surface rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NFTDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NFTPageContent />
    </Suspense>
  )
}