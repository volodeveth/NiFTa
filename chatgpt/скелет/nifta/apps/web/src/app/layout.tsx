import type { Metadata } from 'next';
import WalletProvider from '@/components/wallet/WalletProvider';
import '../styles/globals.css';

export const metadata: Metadata = { title: 'NiFTa', description: 'Mint & trade ERC1155 on Base' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body><WalletProvider>{children}</WalletProvider></body></html>
  );
}
