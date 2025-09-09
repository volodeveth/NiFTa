# NiFTa

NiFTa is a Base-network dapp for minting and trading ERC‑1155 NFTs with a referral split and a simple fixed‑price marketplace.
This repository is a starter skeleton: contracts (Hardhat), subgraph (The Graph), and a Next.js app using wagmi/viem + RainbowKit.

## Features
- ERC‑1155 collection with: free creator mint; fixed mint price; 1000 paid-mints trigger → 48h timer; pull‑payments revenue split.
- Mint revenue split: Creator 50%, FirstPaidMinter 10%, Referral 20% (or 0% → Platform), Platform 20% (or 40% without referral).
- Marketplace (stage 1): fixed‑price escrow with 95% seller, 2.5% creator royalty (ERC‑2981), 2.5% platform fee.
- Subgraph for Trending/Explore/For Sale feeds.
- Next.js app with wallet connection and placeholders for pages.

## Quick start
```bash
pnpm i
pnpm -C apps/web i
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
pnpm chain          # hardhat local node
pnpm test           # tests (placeholder)
pnpm dev:web        # start Next.js
```
