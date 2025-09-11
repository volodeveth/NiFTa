'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import NotificationPanel from './NotificationPanel'
import { 
  FireIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  UserIcon,
  BellIcon
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
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  
  // Mock: check if there are unread notifications
  const hasUnreadNotifications = true // In real app, this would come from context/state

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center h-14">
            
            {/* Logo - Always visible */}
            <div className="flex-shrink-0 mr-2 md:mr-4 z-20 relative">
              <Link href="/" className="flex items-center">
                <Image
                  src="/favicon.png"
                  alt="NiFTa"
                  width={28}
                  height={28}
                  className="rounded"
                  priority
                />
                <span className="hidden sm:inline ml-2 text-lg font-bold text-gradient">NiFTa</span>
              </Link>
            </div>

            {/* Desktop Navigation - Center (ONLY on desktop) */}
            <nav className="hidden md:flex flex-1 items-center justify-center">
              <div className="flex items-center space-x-3">
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
            </nav>

            {/* Notifications & Connect Wallet */}
            <div className="flex-shrink-0 ml-auto z-20 relative flex items-center space-x-2">
              {/* Notifications Button */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg bg-dark-surface hover:bg-dark-card transition-colors relative"
                  title="Notifications"
                >
                  <BellIcon className="w-5 h-5 text-dark-text-secondary hover:text-white transition-colors" />
                  {/* Notification dot - only show if there are unread notifications */}
                  {hasUnreadNotifications && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-primary rounded-full"></div>
                  )}
                </button>
                
                {/* Notification Panel */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <NotificationPanel onClose={() => setShowNotifications(false)} />
                  </div>
                )}
              </div>
              
              {/* Desktop: Full ConnectButton */}
              <div className="hidden md:block">
                <ConnectButton showBalance={false} />
              </div>
              
              {/* Mobile: Custom wallet button */}
              <div className="md:hidden">
                <ConnectButton.Custom>
                  {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                    const ready = mounted
                    const connected = ready && account && chain

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={openConnectModal}
                                type="button"
                                className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors"
                                title="Connect Wallet"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                              </button>
                            )
                          }

                          if (chain.unsupported) {
                            return (
                              <button
                                onClick={openChainModal}
                                type="button"
                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                title="Wrong Network"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                              </button>
                            )
                          }

                          return (
                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                              title={account.displayName}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </button>
                          )
                        })()}
                      </div>
                    )
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Bottom bar (ONLY on mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-bg/90 backdrop-blur-md border-t border-white/10 pb-4 pt-2">
        <div className="flex items-center justify-around">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center justify-center p-3 rounded-lg transition-all duration-200',
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
      </nav>
    </>
  )
}