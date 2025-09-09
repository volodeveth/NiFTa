import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { base } from './chains';

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'NiFTa',
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo',
    chains: [base],
    ssr: true
  })
);
