# AUDD PayLink Lite

A lightweight Solana merchant payment-link and settlement dashboard concept for the SolAUDD Grant Program.

## Grant context

- Grant: SolAUDD Grant Program
- Project: AUDD PayLink Lite
- Ask: 1000 AUDD
- Builder: cool0123
- Contact: https://t.me/cool0123

## What it does

AUDD PayLink Lite helps small merchants and creators create AUD-denominated payment links for AUDD on Solana.

The demo includes:

- Merchant payment-link form.
- Shareable checkout preview.
- Deterministic demo QR pattern.
- Payment-link dashboard.
- Pending / paid / expired settlement states.
- CSV settlement export.
- Clear separation between demo data and production token configuration.

## Why AUDD

AUDD is positioned as Australian-dollar stablecoin infrastructure. The practical merchant use case is simple: a seller wants to price in AUD, share a payment link, receive AUDD on Solana, and reconcile settlement references without building a custom checkout.

## MVP scope

1. Product shell and merchant dashboard.
2. AUDD payment-link creation.
3. Checkout preview and QR-ready details.
4. Settlement status tracking.
5. CSV export for accounting.
6. README and walkthrough for sponsor review.

## Production path

A production version would add:

- Official AUDD Solana token mint configuration.
- Wallet adapter integration.
- On-chain transfer verification.
- Merchant authentication.
- Webhook or polling reconciliation.
- Hosted checkout URLs.

## Safety

This demo is static and browser-only.

- No private keys.
- No seed phrases.
- No real wallet signing.
- No hardcoded personal wallet address.
- No live payment execution.

## Run locally

```bash
npm run check
npm run serve
```

Open:

```text
http://localhost:5190
```

## Submission links

Use these once published:

```text
GitHub: https://github.com/cool0123/audd-paylink-lite
Demo: https://cool0123.github.io/audd-paylink-lite/
Walkthrough/X: https://x.com/cool012312600/status/2055002912087228439
```
