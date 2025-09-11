import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import WalletProvider from '@/components/wallet/WalletProvider'
import Navigation from '@/components/ui/Navigation'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NiFTa - NFT Marketplace on Base',
  description: 'Mint and trade ERC-1155 NFTs on Base network with unique revenue sharing',
  keywords: ['NFT', 'Base', 'Blockchain', 'Marketplace', 'ERC-1155', 'Farcaster'],
  authors: [{ name: 'NiFTa Team' }],
  creator: 'NiFTa',
  publisher: 'NiFTa',
  metadataBase: new URL('https://nifta.fun'),
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'NiFTa - NFT Marketplace on Base',
    description: 'Mint and trade ERC-1155 NFTs on Base network with unique revenue sharing',
    url: 'https://nifta.fun',
    siteName: 'NiFTa',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NiFTa - NFT Marketplace on Base',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NiFTa - NFT Marketplace on Base',
    description: 'Mint and trade ERC-1155 NFTs on Base network with unique revenue sharing',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-bg min-h-screen`}>
        <WalletProvider>
          <Navigation />
          <main className="pt-16 pb-24 md:pb-8">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  )
}