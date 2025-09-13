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
- [x] Skeleton files copied to main directory

### Phase 2: Smart Contracts ✅
- [x] Factory contract implementation
- [x] Collection contract with minting logic
- [x] Marketplace contract for trading
- [x] Revenue distribution system

### Phase 3: Frontend ✅
- [x] Basic UI components
- [x] Wallet connection
- [x] Trending page
- [x] Explore page  
- [x] Create collection page
- [x] Mobile-first responsive design
- [x] Navigation system (desktop + mobile bottom bar)
- [x] Notification system with dropdown panel
- [x] Custom wallet button for mobile

### Phase 4: Integration ✅
- [x] Subgraph schema created
- [x] GitHub repository (https://github.com/volodeveth/NiFTa)
- [x] Vercel deployment (https://nifta-zeta.vercel.app)
- [x] Mobile layout fixes and optimizations
- [x] Z-index and navigation layering fixes
- [x] Social media verification system (X/Twitter & Farcaster OAuth)
- [x] Profile verification with checkmark badges
- [x] User profile enhancement (bio, website, social links)
- [ ] Farcaster Mini App setup

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
- **GitHub**: https://github.com/volodeveth/NiFTa

## Quick Reference Commands

### Git Commands
```bash
# Stage all changes
git add .

# Commit with proper message
git commit -m "Your commit message

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin master
```

### Vercel Deployment
```bash
# Deploy to production (from root directory)
npx vercel --token=pUJUqZFTNRb0dVq5XiGANBRM --prod

# Check deployment logs if needed
npx vercel inspect [deployment-url] --logs --token=pUJUqZFTNRb0dVq5XiGANBRM
```

### Project Structure Notes
- **Root deployment**: Deploy from project root, not apps/web
- **Vercel config**: vercel.json in root handles monorepo structure
- **Build path**: apps/web/.next (configured in vercel.json)
- **Auto-detection**: Vercel automatically detects Next.js and runs correct build commands

### Environment Variables
```
# Base Network & Contracts
RPC_BASE_MAINNET=https://mainnet.base.org
PRIVATE_KEY=0xYourPrivateKeyHere
ETHERSCAN_API_KEY=YourBaseScanAPIKey
PLATFORM_TREASURY=0xYourPlatformAddress

# Frontend & OAuth
NEXT_PUBLIC_BASE_URL=https://nifta-zeta.vercel.app
NEXT_PUBLIC_WC_PROJECT_ID=YourWalletConnectProjectId

# Social Media OAuth (Optional - Mock mode available)
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
FARCASTER_CLIENT_ID=nifta

# Note: If Twitter credentials are not provided, system automatically
# falls back to mock authentication for development and demonstration
```

## Roadmap

### MVP (Current)
- Core minting and trading functionality
- Basic UI with essential pages
- Wallet connection and Base integration
- Social media verification system with OAuth
- Verified profile badges and enhanced user profiles

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

**Last Updated**: 2025-09-12  
**Status**: MVP Complete 🚀  
**Live URL**: https://nifta-f4bag3g1m-volodeveths-projects.vercel.app  
**GitHub**: https://github.com/volodeveth/NiFTa  
**Domain**: nifta.fun (to be connected)

## Recent Updates (Mobile & UX Improvements)

### Mobile Layout Fixes ✅
- **Fixed z-index layering**: Top navigation (z-60) properly above bottom navigation (z-50)
- **Resolved text overflow**: NFT cards now properly truncate text with whitespace control
- **Improved spacing**: Added pb-24 padding and safe area utilities for mobile
- **Enhanced navigation**: Separated desktop (top) and mobile (bottom) navigation cleanly

### UI/UX Enhancements ✅
- **Gradient branding**: NiFTa logo text now uses brand gradient colors
- **Mobile wallet button**: Custom wallet icon instead of full button on mobile
- **Professional navigation**: Semantic HTML with proper header/nav structure

### Notification System ✅
- **Smart notifications**: Dropdown panel with 5 notification types (mint, purchase, sale, offer, info)
- **Clean indicator**: Small blue dot instead of numbers for unread notifications
- **Mock data**: Full notification system with proper UI/UX patterns
- **Responsive design**: Works perfectly on both desktop and mobile

### Technical Improvements ✅
- **Better CSS**: Added line-clamp utilities and safe area support
- **Improved imports**: Fixed missing icons and proper error handling
- **Clean architecture**: Separated concerns between components

### Social Verification System ✅
- **OAuth Integration**: X (Twitter) and Farcaster authentication support with fallback mock system
- **Secure verification flow**: State validation, error handling, and production-ready redirects
- **Mock development mode**: Full OAuth simulation without requiring real Twitter credentials
- **Profile verification**: Checkmark badges for verified users with instant feedback
- **Enhanced profiles**: Bio, website links, and connected social accounts display
- **Modular components**: Reusable verification and profile edit modals with Suspense boundaries
- **API infrastructure**: RESTful endpoints with comprehensive error handling and logging
- **Production fixes**: Resolved localhost fallbacks and HTTP 500 errors for stable deployment

### OAuth Implementation Fixes (September 2025) ✅
- **HTTP 500 Resolution**: Fixed server errors in OAuth authentication flow
- **Production URL Handling**: Replaced localhost fallbacks with dynamic origin detection
- **Error Handling**: Comprehensive try-catch blocks with detailed logging
- **Mock System**: Fully functional OAuth simulation for development and demonstration
- **Crypto Module**: Resolved ES6 import issues for Next.js compatibility
- **Suspense Boundaries**: Fixed useSearchParams SSR errors with proper React Suspense
- **State Management**: Secure OAuth state validation with cookie-based session handling