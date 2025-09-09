'use client'

import { useState, useRef } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'
import { 
  PhotoIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

export default function CreatePage() {
  const { address, isConnected } = useAccount()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection: '',
    file: null as File | null,
    filePreview: '',
    fileType: '',
    customPrice: '',
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'File size must be less than 100MB' }))
      return
    }

    const fileType = file.type.split('/')[0]
    if (!['image', 'video', 'audio'].includes(fileType)) {
      setErrors(prev => ({ ...prev, file: 'Only image, video, and audio files are supported' }))
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        file,
        filePreview: e.target?.result as string,
        fileType
      }))
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }))
      }
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
      filePreview: '',
      fileType: ''
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'NFT name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.file) {
      newErrors.file = 'Media file is required'
    }

    if (formData.customPrice && parseFloat(formData.customPrice) <= 0) {
      newErrors.customPrice = 'Price must be greater than 0'
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
    // In production, this would upload to IPFS and mint the NFT
    console.log('Creating NFT with data:', formData)
    
    // Simulate success for MVP
    setTimeout(() => {
      setCurrentStep(3)
    }, 2000)
  }

  const steps = [
    { number: 1, title: 'NFT Details', description: 'Basic information and media for your NFT' },
    { number: 2, title: 'Review & Create', description: 'Confirm details and mint your NFT' },
    { number: 3, title: 'Success', description: 'Your NFT has been minted successfully!' },
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
          Create NFT
        </h1>
        <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Mint your unique NFT with revenue sharing on Base network
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
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2) }} className="space-y-6">
            {/* NFT Name */}
            <div>
              <label className="block text-white font-medium mb-2">
                NFT Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., My Awesome NFT #001"
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

            {/* Collection (Optional) */}
            <div>
              <label className="block text-white font-medium mb-2">
                Collection (Optional)
              </label>
              <input
                type="text"
                value={formData.collection}
                onChange={(e) => handleInputChange('collection', e.target.value)}
                placeholder="Leave empty to create collection from NFT name"
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <p className="mt-1 text-dark-text-muted text-xs">
                If left empty, collection will be created with the same name as your NFT
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your NFT..."
                rows={3}
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

            {/* File Upload */}
            <div>
              <label className="block text-white font-medium mb-2">
                Media File *
              </label>
              
              {!formData.file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:border-brand-primary/50 hover:bg-brand-primary/5',
                    errors.file ? 'border-red-500' : 'border-dark-border'
                  )}
                >
                  <CloudArrowUpIcon className="w-12 h-12 mx-auto text-dark-text-muted mb-4" />
                  <p className="text-dark-text-secondary mb-2">
                    Click to upload your media file
                  </p>
                  <p className="text-dark-text-muted text-sm">
                    Images, Videos, Audio (Max 100MB)
                  </p>
                </div>
              ) : (
                <div className="border border-dark-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {formData.fileType === 'image' && (
                        <img 
                          src={formData.filePreview} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      {formData.fileType === 'video' && (
                        <div className="relative w-16 h-16 bg-dark-surface rounded-lg flex items-center justify-center">
                          <PlayIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                      {formData.fileType === 'audio' && (
                        <div className="w-16 h-16 bg-dark-surface rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🎵</span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{formData.file.name}</p>
                        <p className="text-dark-text-muted text-sm">
                          {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-4 border border-dark-border rounded-lg text-dark-text-secondary hover:text-white hover:border-brand-primary/50 transition-all text-sm"
                  >
                    Choose Different File
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {errors.file && (
                <p className="mt-1 text-red-400 text-sm flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.file}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="border-t border-dark-border pt-6">
              <h3 className="text-white font-medium mb-4 flex items-center">
                Pricing
                <InformationCircleIcon className="w-4 h-4 ml-2 text-dark-text-muted" />
              </h3>
              
              <div>
                <label className="block text-dark-text-secondary font-medium mb-2">
                  Mint Price (ETH)
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
                <p className="mt-1 text-dark-text-muted text-xs">
                  Revenue: 50% Creator, 10% First Minter, 20% Referral, 20% Platform
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-brand text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Review NFT
            </button>
          </form>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h2 className="text-2xl font-bold text-white mb-6">Review Your NFT</h2>
          
          {/* Preview */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* NFT Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">NFT Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-dark-text-secondary">NFT Name:</span>
                    <span className="text-white ml-2">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-dark-text-secondary">Collection:</span>
                    <span className="text-white ml-2">
                      {formData.collection || formData.name}
                    </span>
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
                    <span className="text-dark-text-secondary">File Type:</span>
                    <span className="text-white ml-2 capitalize">
                      {formData.fileType} ({formData.file ? (formData.file.size / (1024 * 1024)).toFixed(2) + ' MB' : ''})
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Preview */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Media Preview</h3>
                <div className="aspect-square bg-dark-surface rounded-lg flex items-center justify-center border border-dark-border">
                  {formData.filePreview ? (
                    <>
                      {formData.fileType === 'image' && (
                        <img 
                          src={formData.filePreview} 
                          alt="NFT preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                      {formData.fileType === 'video' && (
                        <video 
                          src={formData.filePreview} 
                          className="w-full h-full object-cover rounded-lg"
                          controls
                        />
                      )}
                      {formData.fileType === 'audio' && (
                        <div className="flex flex-col items-center space-y-4">
                          <div className="text-6xl">🎵</div>
                          <audio src={formData.filePreview} controls className="w-full" />
                        </div>
                      )}
                    </>
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
                Mint NFT
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gradient mb-4">NFT Minted!</h2>
          <p className="text-dark-text-secondary mb-8 max-w-md mx-auto">
            Your NFT has been successfully minted on Base network
          </p>
          
          <div className="space-y-4">
            <button className="w-full bg-gradient-brand text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity">
              View NFT
            </button>
            <button 
              onClick={() => {
                setCurrentStep(1)
                setFormData({ name: '', description: '', collection: '', file: null, filePreview: '', fileType: '', customPrice: '' })
                setErrors({})
              }}
              className="w-full bg-dark-surface text-white py-3 px-6 rounded-lg font-medium border border-dark-border hover:bg-dark-border transition-colors"
            >
              Create Another NFT
            </button>
          </div>
        </div>
      )}
    </div>
  )
}