import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEther(wei: bigint | string | number): string {
  const value = typeof wei === 'bigint' ? wei : BigInt(wei)
  return (Number(value) / 1e18).toFixed(4)
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function timeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp * 1000
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `${seconds}s ago`
}

export function timeLeft(endTime: number): string {
  const now = Math.floor(Date.now() / 1000)
  if (endTime <= now) return 'Ended'
  
  const diff = endTime - now
  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h left`
  }
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

export function ipfsToHttp(ipfsUrl: string): string {
  if (!ipfsUrl) return ''
  if (ipfsUrl.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${ipfsUrl.slice(7)}`
  }
  return ipfsUrl
}

export function generateGradient(seed: string): string {
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  const hue1 = Math.abs(hash) % 360
  const hue2 = (hue1 + 120) % 360
  
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%) 0%, hsl(${hue2}, 70%, 60%) 100%)`
}

export function getUserDisplayName(profile?: { username?: string; displayName?: string } | null, address?: string): string {
  if (profile?.displayName) return profile.displayName
  if (profile?.username) return `@${profile.username}`
  if (address) return formatAddress(address)
  return 'Unknown User'
}

export function getUserUsername(profile?: { username?: string } | null): string | null {
  return profile?.username ? `@${profile.username}` : null
}

export function getUserInitials(profile?: { username?: string; displayName?: string } | null, address?: string): string {
  if (profile?.displayName) {
    return profile.displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }
  if (profile?.username) {
    return profile.username.slice(0, 2).toUpperCase()
  }
  if (address) {
    return address.slice(2, 4).toUpperCase()
  }
  return 'U'
}

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  } else if (num < 1000000) {
    const thousands = num / 1000
    if (thousands % 1 === 0) {
      return `${thousands}K`
    } else {
      return `${thousands.toFixed(1)}K`
    }
  } else {
    const millions = num / 1000000
    if (millions % 1 === 0) {
      return `${millions}M`
    } else {
      return `${millions.toFixed(1)}M`
    }
  }
}