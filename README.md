# Ghiblify 🌿

Turn your photos into Studio Ghibli–style anime artwork in seconds.
Free to use: every signed-in user gets **10 conversions per day**.

![Original photo and its Ghibli-style result](public/img/hero-after.jpg)

## Features

- **Photo → Ghibli art** using the FLUX.2 [klein] image-editing model on Cloudflare Workers AI
- **Sign in with Google, Apple or email** through Clerk
- **10 free conversions per user per day**, reset at 00:00 UTC
- **Private by design:** images are processed in memory and never stored
- **Drag-and-drop upload**, before/after preview and one-click download
- **No database:** usage limits are stored on the Clerk user record
- **Responsive design** in a custom Ghibli-inspired theme (cream, forest green, sky blue)

## Tech stack

| Layer | Tool |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui Button, lucide-react icons, Fraunces + Geist fonts |
| Auth | Clerk (`@clerk/nextjs`) |
| AI model | Cloudflare Workers AI: `@cf/black-forest-labs/flux-2-klein-4b` |
| Usage storage | Clerk `privateMetadata` |
| Hosting | Vercel (recommended) |

## Getting started

### 1. Install

```bash
git clone https://github.com/it-is-Aman/Ghiblify.git
cd Ghiblify
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | [Clerk dashboard](https://dashboard.clerk.com) → your app → **API Keys** |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Keep as `/signin` and `/signup` |
| `CLOUDFLARE_ACCOUNT_ID` | [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** (right sidebar) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → **My Profile → API Tokens → Create Token →** "Workers AI" template |
| `DAILY_LIMIT` *(optional)* | Conversions per user per day. Default is `10`. |

Both Clerk and Cloudflare have free plans, and neither needs a credit card.

### 3. Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── convert/route.ts   # POST: check quota → call Cloudflare AI → return image
│   │   └── usage/route.ts     # GET: conversions left today
│   ├── convert/page.tsx       # Upload / convert / download UI (client component)
│   ├── signin/ & signup/      # Clerk hosted auth components
│   ├── layout.tsx             # Fonts, ClerkProvider, Navbar + Footer
│   ├── page.tsx               # Landing page
│   └── globals.css            # Tailwind v4 theme tokens (Ghibli palette)
├── components/                # Navbar, Hero, HowItWorks, Features, CTA, Footer, Container, ui/button
├── lib/
│   ├── usage.ts               # Daily limit, read/write Clerk privateMetadata
│   └── utils.ts               # cn() class-name helper
└── middleware.ts              # Clerk auth: protects everything except /, /signin, /signup
```

For a full explanation of how the backend, authentication, AI call and rate limiting work, see **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

## Deploying to Vercel

1. Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
2. Add the same environment variables in **Project → Settings → Environment Variables**.
3. Deploy. When you're ready to go live, add your production domain in Clerk.

## Limits

- Cloudflare's free tier allows **10,000 neurons per day**, shared by all users. That's roughly **80–100 conversions per day** in total. After that, users see a "try again tomorrow" message until it resets.
- This is a fan-made learning project and is not affiliated with Studio Ghibli.

## License

See [LICENSE](LICENSE).
