'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'
import { 
  PhotoIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function CreatePage() {
  const { address, isConnected } = useAccount()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    customPrice: '',
    customTrigger: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Collection name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required'
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please provide a valid URL'
    }

    if (formData.customPrice && parseFloat(formData.customPrice) <= 0) {
      newErrors.customPrice = 'Price must be greater than 0'
    }

    if (formData.customTrigger && parseInt(formData.customTrigger) <= 0) {
      newErrors.customTrigger = 'Trigger must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // In MVP, we'll just simulate the transaction
    // In production, this would call the factory contract
    console.log('Creating collection with data:', formData)
    
    // Simulate success for MVP
    setTimeout(() => {
      setCurrentStep(3)
    }, 2000)
  }

  const steps = [
    { number: 1, title: 'Collection Details', description: 'Basic information about your NFT collection' },
    { number: 2, title: 'Review & Create', description: 'Confirm details and deploy your collection' },
    { number: 3, title: 'Success', description: 'Your collection has been created successfully!' },
  ]

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6 opacity-50">🔗</div>
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-dark-text-secondary mb-8 max-w-md mx-auto">
            Connect your wallet to start creating NFT collections on Base network
          </p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">
          Create Collection
        </h1>
        <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Launch your ERC-1155 NFT collection with unique revenue sharing on Base
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  currentStep >= step.number
                    ? 'bg-gradient-brand text-white'
                    : 'bg-dark-surface text-dark-text-muted border border-dark-border'
                )}>
                  {currentStep > step.number ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={cn(
                    'text-sm font-medium',
                    currentStep >= step.number ? 'text-white' : 'text-dark-text-muted'
                  )}>
                    {step.title}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'w-16 h-0.5 mx-4',
                  currentStep > step.number ? 'bg-gradient-brand' : 'bg-dark-border'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="bg-dark-card rounded-xl p-8 border border-dark-border">
          <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2) }} className="space-y-6">
            {/* Collection Name */}
            <div>
              <label className="block text-white font-medium mb-2">
                Collection Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Awesome NFT Collection"
                className={cn(
                  'w-full px-4 py-3 bg-dark-surface border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary',
                  errors.name ? 'border-red-500' : 'border-dark-border'
                )}
              />
              {errors.name && (
                <p className="mt-1 text-red-400 text-sm flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your NFT collection..."
                rows={4}
                className={cn(
                  'w-full px-4 py-3 bg-dark-surface border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none',
                  errors.description ? 'border-red-500' : 'border-dark-border'
                )}
              />
              {errors.description && (
                <p className="mt-1 text-red-400 text-sm flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-white font-medium mb-2">
                Collection Image URL *
              </label>
              <div className="relative">
                <PhotoIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.png or ipfs://..."
                  className={cn(
                    'w-full pl-10 pr-4 py-3 bg-dark-surface border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary',
                    errors.image ? 'border-red-500' : 'border-dark-border'
                  )}
                />
              </div>
              {errors.image && (
                <p className="mt-1 text-red-400 text-sm flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Advanced Settings */}
            <div className="border-t border-dark-border pt-6">
              <h3 className="text-white font-medium mb-4 flex items-center">
                Advanced Settings
                <InformationCircleIcon className="w-4 h-4 ml-2 text-dark-text-muted" />
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Price */}
                <div>
                  <label className="block text-dark-text-secondary font-medium mb-2">
                    Custom Mint Price (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={formData.customPrice}
                    onChange={(e) => handleInputChange('customPrice', e.target.value)}
                    placeholder="0.0001 (default)"
                    className={cn(
                      'w-full px-4 py-3 bg-dark-surface border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary',
                      errors.customPrice ? 'border-red-500' : 'border-dark-border'
                    )}
                  />
                  {errors.customPrice && (
                    <p className="mt-1 text-red-400 text-sm">{errors.customPrice}</p>
                  )}
                </div>

                {/* Custom Trigger */}
                <div>
                  <label className="block text-dark-text-secondary font-medium mb-2">
                    Timer Trigger (mints)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.customTrigger}
                    onChange={(e) => handleInputChange('customTrigger', e.target.value)}
                    placeholder="1000 (default)"
                    className={cn(
                      'w-full px-4 py-3 bg-dark-surface border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary',
                      errors.customTrigger ? 'border-red-500' : 'border-dark-border'
                    )}
                  />
                  {errors.customTrigger && (
                    <p className="mt-1 text-red-400 text-sm">{errors.customTrigger}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-brand text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Continue to Review
            </button>
          </form>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-dark-card rounded-xl p-8 border border-dark-border">
          <h2 className="text-2xl font-bold text-white mb-6">Review Your Collection</h2>
          
          {/* Preview */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Collection Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Collection Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-dark-text-secondary">Name:</span>
                    <span className="text-white ml-2">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-dark-text-secondary">Description:</span>
                    <p className="text-white mt-1">{formData.description}</p>
                  </div>
                  <div>
                    <span className="text-dark-text-secondary">Mint Price:</span>
                    <span className="text-white ml-2">
                      {formData.customPrice || '0.0001'} ETH
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-text-secondary">Timer Trigger:</span>
                    <span className="text-white ml-2">
                      {formData.customTrigger || '1000'} mints
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Collection Image</h3>
                <div className="aspect-square bg-dark-surface rounded-lg flex items-center justify-center border border-dark-border">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Collection preview"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <PhotoIcon className="w-16 h-16 text-dark-text-muted" />
                  )}
                </div>
              </div>
            </div>

            {/* Revenue Distribution Info */}
            <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-brand-primary">50%</div>
                  <div className="text-dark-text-secondary text-sm">Creator</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-primary">10%</div>
                  <div className="text-dark-text-secondary text-sm">First Minter</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-primary">20%</div>
                  <div className="text-dark-text-secondary text-sm">Referral</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-primary">20%</div>
                  <div className="text-dark-text-secondary text-sm">Platform</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-dark-surface text-white py-3 px-6 rounded-lg font-medium border border-dark-border hover:bg-dark-border transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-brand text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-dark-card rounded-xl p-8 border border-dark-border text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gradient mb-4">Collection Created!</h2>
          <p className="text-dark-text-secondary mb-8 max-w-md mx-auto">
            Your NFT collection has been successfully deployed to Base network
          </p>
          
          <div className="space-y-4">
            <button className="w-full bg-gradient-brand text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity">
              View Collection
            </button>
            <button 
              onClick={() => {
                setCurrentStep(1)
                setFormData({ name: '', description: '', image: '', customPrice: '', customTrigger: '' })
                setErrors({})
              }}
              className="w-full bg-dark-surface text-white py-3 px-6 rounded-lg font-medium border border-dark-border hover:bg-dark-border transition-colors"
            >
              Create Another Collection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}