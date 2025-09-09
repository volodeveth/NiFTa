import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from './chains'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo'

export const wagmiConfig = getDefaultConfig({
  appName: 'NiFTa',
  projectId,
  chains: [base],
  ssr: true,
})

export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`
export const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`