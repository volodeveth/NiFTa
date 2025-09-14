'use client'

import { cn, getNiftaLogoColors, hasCustomProfile, getUserInitials } from '@/lib/utils'

interface Profile {
  username?: string
  displayName?: string
  profileImage?: string
}

interface UserAvatarProps {
  address: string
  profile?: Profile | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl'
}

export default function UserAvatar({ address, profile, size = 'md', className }: UserAvatarProps) {
  // If user has custom profile image, use it
  if (profile?.profileImage) {
    return (
      <img
        src={profile.profileImage}
        alt="Profile"
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  // If user has custom profile data (username/displayName), show initials with brand gradient
  if (hasCustomProfile(profile)) {
    return (
      <div className={cn(
        'bg-gradient-brand rounded-full flex items-center justify-center text-white font-bold',
        sizeClasses[size],
        className
      )}>
        {getUserInitials(profile, address)}
      </div>
    )
  }

  // Default: Show NiFTa logo with consistent random colors
  const colors = getNiftaLogoColors(address)

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white',
        sizeClasses[size],
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-3/5 h-3/5 fill-current"
        aria-label="NiFTa"
      >
        {/* NiFTa Logo - Simplified N shape */}
        <path d="M20 20 L20 80 L35 80 L35 45 L65 80 L80 80 L80 20 L65 20 L65 55 L35 20 L20 20 Z" />
      </svg>
    </div>
  )
}