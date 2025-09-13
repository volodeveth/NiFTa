'use client'

import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { 
  XMarkIcon,
  LinkIcon,
  CheckCircleIcon,
  AtSymbolIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface ProfileEditProps {
  onClose: () => void
}

export default function ProfileEdit({ onClose }: ProfileEditProps) {
  const { profile, updateProfile, loading } = useProfile()
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    displayName: profile?.displayName || '',
    website: profile?.website || '',
    bio: profile?.bio || ''
  })
  
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      await updateProfile(formData)
      setSaved(true)
      
      // Auto close after successful save
      setTimeout(() => {
        onClose()
      }, 1000)
      
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const isValidUrl = (url: string) => {
    if (!url) return true // Empty is valid
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  const formatUrl = (url: string) => {
    if (!url) return ''
    return url.startsWith('http') ? url : `https://${url}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card rounded-xl border border-dark-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Edit Profile</h2>
              <p className="text-dark-text-secondary text-sm">
                Update your profile information
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-dark-text-secondary" />
            </button>
          </div>

          {/* Username Field */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2 text-sm">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                placeholder="username"
                maxLength={20}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all pl-10"
              />
              <AtSymbolIcon className="absolute left-3 top-3.5 w-4 h-4 text-dark-text-muted" />
            </div>
            <p className="text-dark-text-muted text-xs mt-1">
              Your unique identifier (will appear as @{formData.username || 'username'})
            </p>
          </div>

          {/* Display Name Field */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2 text-sm">
              Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Your display name"
                maxLength={50}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all pl-10"
              />
              <IdentificationIcon className="absolute left-3 top-3.5 w-4 h-4 text-dark-text-muted" />
            </div>
            <p className="text-dark-text-muted text-xs mt-1">
              Your public display name (can contain spaces and special characters)
            </p>
          </div>

          {/* Website Field */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2 text-sm">
              Website
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                className={cn(
                  "w-full px-4 py-3 bg-dark-surface border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 transition-all pl-10",
                  isValidUrl(formData.website)
                    ? "border-dark-border focus:ring-brand-primary/50 focus:border-brand-primary"
                    : "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                )}
              />
              <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-dark-text-muted" />
            </div>
            {!isValidUrl(formData.website) && (
              <p className="text-red-400 text-xs mt-1">Please enter a valid URL</p>
            )}
            <p className="text-dark-text-muted text-xs mt-1">
              Add your personal website or portfolio
            </p>
          </div>

          {/* Bio Field */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2 text-sm">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell people about yourself..."
              rows={4}
              maxLength={200}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-dark-text-muted text-xs">
                Share your story, interests, or what you create
              </p>
              <span className="text-dark-text-muted text-xs">
                {formData.bio.length}/200
              </span>
            </div>
          </div>

          {/* Social Media Preview */}
          {profile?.socialConnections && profile.socialConnections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3 text-sm">Connected Accounts</h3>
              <div className="space-y-2">
                {profile.socialConnections.map((connection) => (
                  <div key={connection.provider} className="flex items-center space-x-3 p-3 bg-dark-surface rounded-lg">
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center",
                      connection.provider === 'twitter' ? "bg-black" : "bg-purple-600"
                    )}>
                      <span className="text-white font-bold text-xs">
                        {connection.provider === 'twitter' ? '𝕏' : 'FC'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">@{connection.username}</p>
                    </div>
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-dark-surface border border-dark-border text-white rounded-lg hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !isValidUrl(formData.website)}
              className={cn(
                "flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2",
                saved
                  ? "bg-green-500 text-white"
                  : "bg-brand-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saved ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}