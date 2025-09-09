'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'
import { 
  FireIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Trending', href: '/', icon: FireIcon },
  { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon },
  { name: 'For Sale', href: '/sale', icon: ShoppingBagIcon },
  { name: 'Create', href: '/create', icon: PlusCircleIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo - Compact */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">N</span>
            </div>
            <span className="text-lg font-bold text-gradient">NiFTa</span>
          </Link>

          {/* Navigation Links - Simplified */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-brand-primary bg-brand-primary/10'
                      : 'text-dark-text-secondary hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Connect Wallet */}
          <ConnectButton showBalance={false} />
        </div>
      </div>

      {/* Mobile Navigation - Optimized */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-white/10 safe-area-pb">
        <div className="flex items-center justify-around py-1.5">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center space-y-0.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 min-w-0 flex-1',
                  isActive
                    ? 'text-brand-primary'
                    : 'text-dark-text-secondary active:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate text-xs">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}