# NiFTa - NFT Marketplace on Base

**Live App**: [nifta.fun](https://nifta.fun)  
**Network**: Base Mainnet  
**Status**: MVP Live 🚀  

## Overview

NiFTa is a next-generation NFT marketplace built on Base network with Farcaster integration. Create ERC-1155 collections with unique revenue sharing, fixed-price minting, and time-based mechanics.

## Key Features

- **🎨 ERC-1155 Collections**: Gas-efficient multi-token standard
- **🏭 Factory Pattern**: Clone collections for reduced deployment costs  
- **💰 Revenue Sharing**: Creator 50%, First Minter 10%, Referral 20%, Platform 20%
- **⏰ Time Mechanics**: 48-hour countdown after 1000 paid mints
- **🛒 Simple Marketplace**: Fixed-price trading with 2.5% creator royalties
- **🌐 Farcaster Ready**: Mini Apps integration for social minting
- **🌙 Dark Theme**: Beautiful UI optimized for app display

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- Base wallet with ETH

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nifta.git
cd nifta

# Install dependencies
pnpm install
pnpm -C apps/web install

# Set up environment
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local

# Start development
pnpm dev:web
```

### Environment Variables

**Root `.env`:**
```
RPC_BASE_MAINNET=https://mainnet.base.org
PRIVATE_KEY=0xYourPrivateKeyHere
ETHERSCAN_API_KEY=YourBaseScanAPIKey
PLATFORM_TREASURY=0xYourPlatformAddress
```

**Frontend `apps/web/.env.local`:**
```
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddress
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xYourMarketplaceAddress
```

## Smart Contracts

### Architecture
- **NiftaFactory**: UUPS upgradeable factory for creating collections
- **NiftaCollection1155**: ERC-1155 with minting logic and revenue distribution
- **NiftaMarketplace**: Fixed-price marketplace with escrow

### Deployment
```bash
# Deploy to Base mainnet
pnpm deploy:factory
pnpm deploy:marketplace
```

### Economic Model

**Minting Revenue Distribution:**
- Creator: 50%
- First Paid Minter: 10%
- Referrer: 20% (or 0% → Platform)
- Platform: 20% (+ unused referral)

**Marketplace Revenue Distribution:**
- Seller: 95%
- Creator Royalty: 2.5%
- Platform Fee: 2.5%

## Frontend

Built with:
- **Next.js 14**: React framework with App Router
- **Wagmi/Viem**: Ethereum interaction
- **RainbowKit**: Wallet connection
- **TailwindCSS**: Styling with dark theme
- **TypeScript**: Type safety

### Pages
- **Trending** (`/`): Hot collections by time windows
- **Explore** (`/explore`): All collections with search/filters
- **For Sale** (`/sale`): Active marketplace listings
- **Create** (`/create`): Collection creation wizard
- **Profile** (`/profile`): User collections and activity

## Tech Stack

- **Blockchain**: Base (Ethereum L2)
- **Smart Contracts**: Solidity 0.8.24, OpenZeppelin, Hardhat
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, dark theme
- **Web3**: Wagmi, Viem, RainbowKit
- **Indexing**: The Graph Protocol
- **Deployment**: Vercel
- **Storage**: IPFS for metadata

## Project Structure

```
nifta/
├── contracts/                 # Smart contracts
│   ├── factory/              # Factory contract
│   ├── collection/           # ERC-1155 collection
│   ├── marketplace/          # Trading contract
│   └── interfaces/           # Contract interfaces
├── apps/web/                 # Next.js frontend
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities
│   └── public/               # Static assets
├── scripts/                  # Deployment scripts
└── subgraph/                 # The Graph indexing
```

## Development

### Running Locally
```bash
# Terminal 1: Start local hardhat node
pnpm chain

# Terminal 2: Deploy contracts locally
pnpm deploy:factory --network localhost
pnpm deploy:marketplace --network localhost

# Terminal 3: Start frontend
pnpm dev:web
```

### Testing
```bash
# Run contract tests
pnpm test

# Run frontend linting
pnpm lint
```

## Deployment

### Smart Contracts
Contracts are deployed on Base mainnet. Update contract addresses in environment variables after deployment.

### Frontend
Deployed automatically to Vercel on push to main branch.

```bash
# Manual deployment
vercel --prod
```

## Security

- ✅ **ReentrancyGuard**: Protection against reentrancy attacks
- ✅ **Pausable**: Emergency stop functionality  
- ✅ **UUPS Upgradeable**: Safe contract upgrades
- ✅ **Pull Payments**: Safe fund withdrawal pattern
- ✅ **ERC-2981**: Standard royalty implementation
- ✅ **Input Validation**: Comprehensive parameter checking

## Roadmap

### ✅ MVP (Current)
- Core minting and trading
- Basic UI with essential pages
- Wallet connection and Base integration

### 🔜 V1.0
- Farcaster Mini Apps integration
- User profiles and social features
- Advanced marketplace (offers, auctions)
- Enhanced analytics

### 🚀 V2.0
- Mobile app
- Creator monetization tools
- Multi-chain support
- Advanced trading features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.nifta.fun](https://docs.nifta.fun)
- **Discord**: [discord.gg/nifta](https://discord.gg/nifta)
- **Twitter**: [@nifta_fun](https://twitter.com/nifta_fun)
- **Email**: team@nifta.fun

---

Built with ❤️ for the Base ecosystem