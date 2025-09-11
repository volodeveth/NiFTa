'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'
import Image from 'next/image'
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
    <nav className="fixed top-0 left-0 right-0 z-[60] glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center h-14">
          
          {/* Logo - Compact on mobile, full on desktop */}
          <div className="flex-shrink-0 mr-2 md:mr-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/favicon.png"
                alt="NiFTa"
                width={28}
                height={28}
                className="rounded"
                priority
              />
              <span className="hidden sm:inline ml-2 text-lg font-bold text-white">NiFTa</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-3">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
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

          {/* Connect Wallet - Right side, compact on mobile */}
          <div className="flex-shrink-0 ml-auto">
            <div className="scale-90 md:scale-100">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Icons only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-white/10 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center justify-center p-2 rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-brand-primary bg-brand-primary/10'
                    : 'text-dark-text-secondary active:text-white'
                )}
                title={item.name}
              >
                <Icon className="w-6 h-6" />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}