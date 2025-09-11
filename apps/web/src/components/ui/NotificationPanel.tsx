'use client'

import { 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export type NotificationType = 'mint' | 'purchase' | 'sale' | 'offer' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
}

interface NotificationPanelProps {
  onClose: () => void
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'mint',
    title: 'New NFT Minted!',
    message: 'Your "Cyber Cat #067" has been successfully minted.',
    time: '2 minutes ago',
    read: false,
    actionUrl: '/nft/67'
  },
  {
    id: '2',
    type: 'purchase',
    title: 'NFT Purchased',
    message: 'You bought "Quantum Leap #323" for 0.0001 ETH.',
    time: '1 hour ago',
    read: false,
    actionUrl: '/nft/323'
  },
  {
    id: '3',
    type: 'sale',
    title: 'NFT Sold!',
    message: 'Your "Digital Dreams #089" sold for 0.0002 ETH.',
    time: '3 hours ago',
    read: true,
    actionUrl: '/nft/89'
  },
  {
    id: '4',
    type: 'offer',
    title: 'New Offer Received',
    message: 'Someone offered 0.00015 ETH for "Pixel World #045".',
    time: '5 hours ago',
    read: true,
    actionUrl: '/nft/45'
  },
  {
    id: '5',
    type: 'info',
    title: 'Timer Started',
    message: '"Neon Punk #012" reached 1000 mints. 48h timer started!',
    time: '1 day ago',
    read: true,
    actionUrl: '/nft/12'
  }
]

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'mint':
      return <PlusCircleIcon className="w-5 h-5" />
    case 'purchase':
      return <ShoppingBagIcon className="w-5 h-5" />
    case 'sale':
      return <CurrencyDollarIcon className="w-5 h-5" />
    case 'offer':
      return <ShoppingBagIcon className="w-5 h-5" />
    case 'info':
      return <InformationCircleIcon className="w-5 h-5" />
    case 'warning':
      return <ExclamationTriangleIcon className="w-5 h-5" />
    default:
      return <InformationCircleIcon className="w-5 h-5" />
  }
}

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'mint':
      return 'text-green-500'
    case 'purchase':
      return 'text-blue-500'
    case 'sale':
      return 'text-emerald-500'
    case 'offer':
      return 'text-purple-500'
    case 'info':
      return 'text-cyan-500'
    case 'warning':
      return 'text-yellow-500'
    default:
      return 'text-gray-500'
  }
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const unreadCount = mockNotifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      // In a real app, this would navigate to the NFT page
      console.log('Navigate to:', notification.actionUrl)
    }
    onClose()
  }

  const markAllAsRead = () => {
    // In a real app, this would update the notifications state
    console.log('Mark all as read')
  }

  return (
    <div className="w-80 bg-dark-card border border-dark-border rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-border">
        <div className="flex items-center space-x-2">
          <h3 className="text-white font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <div className="bg-brand-primary text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-brand-primary hover:text-white transition-colors"
              title="Mark all as read"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-dark-text-secondary hover:text-white transition-colors"
            title="Close"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.length === 0 ? (
          <div className="p-6 text-center text-dark-text-secondary">
            <InformationCircleIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="py-2">
            {mockNotifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  'w-full text-left p-4 hover:bg-dark-surface transition-colors border-b border-dark-border last:border-b-0',
                  !notification.read && 'bg-dark-surface/30'
                )}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={cn(
                    'flex-shrink-0 mt-1',
                    getNotificationColor(notification.type)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={cn(
                        'text-sm font-medium truncate',
                        notification.read ? 'text-dark-text-secondary' : 'text-white'
                      )}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-dark-text-muted mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-dark-text-muted">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {mockNotifications.length > 0 && (
        <div className="p-3 border-t border-dark-border">
          <button className="w-full text-center text-sm text-brand-primary hover:text-white transition-colors">
            View All Notifications
          </button>
        </div>
      )}
    </div>
  )
}