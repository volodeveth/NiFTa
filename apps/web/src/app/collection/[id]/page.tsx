'use client'

import { useParams, useRouter } from 'next/navigation'

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()

  // Redirect to NFT page since each collection has only one NFT
  // In our model: 1 NFT = 1 Collection
  if (typeof window !== 'undefined') {
    router.replace(`/nft/${params.id}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="text-2xl mb-4">Redirecting...</div>
      </div>
    </div>
  )
}