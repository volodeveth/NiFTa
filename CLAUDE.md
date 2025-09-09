# NiFTa - NFT Marketplace on Base

**Domain**: nifta.fun  
**Version**: MVP 0.1.0  
**Status**: In Development  

## Project Overview

NiFTa is a modern NFT marketplace built on Base network with Farcaster integration. It allows creators to mint ERC-1155 NFTs with a unique economic model and enables trading through a simple marketplace.

## Key Features

### Core Functionality
- **ERC-1155 NFT Collections**: Gas-efficient multi-token standard
- **Factory Pattern**: Clone collections for reduced deployment costs
- **Free Creator Mint**: First mint is free for creators (gas only)
- **Fixed Price Minting**: 0.0001 ETH per mint after creator's free mint
- **48h Timer**: Activates after 1000 paid mints to create urgency
- **Revenue Distribution**: Creator 50%, First Paid Minter 10%, Referral 20%, Platform 20%

### Marketplace
- **Fixed-price Listings**: Simple buy/sell mechanism
- **Royalty System**: 2.5% to creator, 2.5% to platform (95% to seller)
- **ERC-2981 Compliance**: Standard royalty support

### Network & Integrations
- **Base Network**: Layer 2 with low fees and fast transactions
- **Farcaster Mini Apps**: In-app minting and sharing
- **RainbowKit**: Seamless wallet connection
- **The Graph**: Subgraph for fast data indexing

### Pages
- **Trending**: Top NFTs by time windows (5m, 1h, 24h, 7d)
- **Explore**: Latest collections with search functionality
- **For Sale**: Active marketplace listings
- **Create**: Collection creation interface
- **Profile**: User's created and minted NFTs

## Technical Stack

### Smart Contracts
- **Hardhat**: Development framework
- **OpenZeppelin**: Security standards (UUPS, ReentrancyGuard, Pausable)
- **Solidity 0.8.24**: Latest stable version

### Frontend
- **Next.js 14**: React framework with App Router
- **Wagmi/Viem**: Ethereum interaction
- **RainbowKit**: Wallet connection UI
- **TailwindCSS**: Utility-first styling
- **Dark Mode**: Default theme with light mode option

### Infrastructure
- **Vercel**: Deployment platform
- **GitHub**: Version control
- **The Graph**: Data indexing
- **IPFS**: Metadata storage

## Project Structure

```
NiFTa/
├── contracts/                 # Smart contracts
│   ├── factory/              # Factory contract
│   ├── collection/           # ERC-1155 collection
│   ├── marketplace/          # Trading contract
│   └── interfaces/           # Contract interfaces
├── subgraph/                 # The Graph indexing
├── apps/web/                 # Next.js frontend
├── scripts/                  # Deployment scripts
└── CLAUDE.md                 # This file
```

## MVP Development Status

### Phase 1: Setup ✅
- [x] Project structure created
- [x] Initial CLAUDE.md documentation
- [ ] Skeleton files copied to main directory

### Phase 2: Smart Contracts
- [ ] Factory contract implementation
- [ ] Collection contract with minting logic
- [ ] Marketplace contract for trading
- [ ] Revenue distribution system

### Phase 3: Frontend
- [ ] Basic UI components
- [ ] Wallet connection
- [ ] Trending page
- [ ] Explore page
- [ ] Create collection page

### Phase 4: Integration
- [ ] Subgraph deployment
- [ ] Farcaster Mini App setup
- [ ] GitHub repository
- [ ] Vercel deployment

### Phase 5: Testing & Launch
- [ ] Contract testing
- [ ] Frontend testing
- [ ] Mainnet deployment
- [ ] Domain connection (nifta.fun)

## Economic Model

### Minting Revenue Distribution
- **Creator**: 50% of mint revenue
- **First Paid Minter**: 10% of mint revenue  
- **Referrer**: 20% of mint revenue (or 0% if no referrer)
- **Platform**: 20% + unused referral percentage

### Marketplace Revenue Distribution
- **Seller**: 95% of sale price
- **Creator Royalty**: 2.5% of sale price
- **Platform Fee**: 2.5% of sale price

### Minting Mechanics
1. Creator mints first NFT for free (pays only gas)
2. Subsequent mints cost 0.0001 ETH
3. After 1000 paid mints, 48-hour timer activates
4. Minting ends when timer expires

## Security Features

- **ReentrancyGuard**: Protection against reentrancy attacks
- **Pausable**: Emergency stop functionality
- **UUPS Upgradeable**: Safe contract upgrades
- **Pull Payments**: Safe fund withdrawal pattern
- **ERC-2981**: Standard royalty implementation

## Development Notes

### Deployment Configuration
- **Vercel Token**: pUJUqZFTNRb0dVq5XiGANBRM
- **Domain**: nifta.fun
- **Network**: Base Mainnet (Chain ID: 8453)

### Environment Variables
```
RPC_BASE_MAINNET=https://mainnet.base.org
PRIVATE_KEY=0xYourPrivateKeyHere
ETHERSCAN_API_KEY=YourBaseScanAPIKey
PLATFORM_TREASURY=0xYourPlatformAddress
NEXT_PUBLIC_WC_PROJECT_ID=YourWalletConnectProjectId
```

## Roadmap

### MVP (Current)
- Core minting and trading functionality
- Basic UI with essential pages
- Wallet connection and Base integration

### V1.0
- Enhanced UI/UX with design system
- Farcaster Mini Apps integration
- User profiles and social features
- Advanced marketplace features (offers, auctions)

### V2.0
- Mobile app
- Advanced analytics
- Creator tools and monetization
- Multi-chain support

---

**Last Updated**: 2025-01-21  
**Next Update**: After MVP completion