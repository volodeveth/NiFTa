'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export function useReferral() {
  const searchParams = useSearchParams()
  const [referrerAddress, setReferrerAddress] = useState<string | null>(null)

  useEffect(() => {
    const ref = searchParams?.get('ref')
    if (ref && ref.startsWith('0x') && ref.length === 42) {
      // Valid Ethereum address format
      setReferrerAddress(ref)
      
      // Store in localStorage for persistent tracking during user session
      localStorage.setItem('nifta_referrer', ref)
      
      // Optional: Track referral analytics (mock for now)
      console.log('Referral tracked:', ref)
    } else {
      // Check if we have a stored referrer from previous visit
      const storedReferrer = localStorage.getItem('nifta_referrer')
      if (storedReferrer) {
        setReferrerAddress(storedReferrer)
      }
    }
  }, [searchParams])

  // Function to get current referrer for mint transactions
  const getReferrerForMint = (): string | null => {
    return referrerAddress
  }

  // Function to clear referrer (e.g., after successful mint)
  const clearReferrer = () => {
    setReferrerAddress(null)
    localStorage.removeItem('nifta_referrer')
  }

  return {
    referrerAddress,
    getReferrerForMint,
    clearReferrer,
    hasReferrer: !!referrerAddress
  }
}