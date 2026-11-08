# Ghiblify: How It All Works

This document explains every moving part of Ghiblify: what each tool does, why it was chosen, how a request flows through the system, and where the important code lives. It's written so you can explain the project confidently in an interview or walkthrough video.

---

## 1. The big picture

Ghiblify is a single **Next.js** app that serves both the frontend (React pages) and the backend (API routes). It talks to two external services:

```
┌────────────────────┐        ┌──────────────────────────────┐        ┌────────────────────────────┐
│      Browser       │        │   Next.js server (Vercel)    │        │   External services        │
│                    │        │                              │        │                            │
│  /convert page     │──(1)──▶│  middleware.ts (Clerk auth)  │        │  Clerk                     │
│  - resize photo    │        │                              │◀──────▶│  - who is the user?        │
│  - POST /api/...   │        │  /api/usage   (GET)          │  (2,5) │  - privateMetadata         │
│                    │        │  /api/convert (POST)         │        │    {usageDate, usageCount} │
│                    │◀──(6)──│    lib/usage.ts              │        │                            │
│  shows result,     │        │                              │──(3)──▶│  Cloudflare Workers AI     │
│  download button   │        │                              │◀──(4)──│  - FLUX.2 [klein] 4B model │
└────────────────────┘        └──────────────────────────────┘        └────────────────────────────┘
```

1. The browser uploads a resized photo to `/api/convert`.
2. The server asks Clerk who the user is and how many conversions they've used today.
3. If they're under the limit, the server sends the photo and a prompt to Cloudflare.
4. Cloudflare returns the generated image as base64.
5. The server records one more use in Clerk.
6. The server returns the image to the browser.

**There is no database.** The only stored data is a small JSON object on each Clerk user.

---

## 2. Tools and why each one is used

### Next.js 15 (App Router)
- **What:** a React framework that handles pages, routing and server-side API endpoints in one project.
- **Why:** the frontend and backend live together. A file at `src/app/api/convert/route.ts` automatically becomes the endpoint `POST /api/convert`, so there's no separate Express server.
- **Key concepts used:**
  - **Server Components** (default): Navbar, Hero and the other landing sections render on the server and ship no JavaScript.
  - **Client Components** (`'use client'`): `convert/page.tsx` needs state, file input and `fetch`, so it runs in the browser.
  - **Route Handlers:** `export async function POST(req)` inside `route.ts` files.
  - **Middleware:** `src/middleware.ts` runs before every request (used for auth).
  - **`maxDuration = 60`:** tells Vercel the convert function can run for up to 60 seconds.

### Clerk (`@clerk/nextjs`)
- **What:** a hosted authentication service (sign up, sign in, sessions, Google/Apple login, user profiles).
- **Why:** building secure auth yourself (password hashing, sessions, OAuth) is a lot of work and easy to get wrong. Clerk provides it, plus ready-made UI.
- **Where it's used:**
  - `layout.tsx`: `<ClerkProvider>` wraps the app and gives every page access to auth state. The `appearance` prop themes Clerk's UI in the app's green.
  - `Navbar.tsx`: `<SignedIn>`, `<SignedOut>`, `<SignInButton mode="modal">`, `<UserButton />`.
  - `signin/[[...signin]]/page.tsx`: renders `<SignIn />`. The `[[...signin]]` "optional catch-all" route lets Clerk use sub-paths like `/signin/factor-one`.
  - `middleware.ts`: `clerkMiddleware` plus `auth.protect()` block signed-out users from every route except `/`, `/signin` and `/signup`.
  - API routes: `const { userId } = await auth()` identifies the caller on the server.
  - `lib/usage.ts`: `clerkClient().users.getUser()` and `updateUserMetadata()` store the daily usage.

### Cloudflare Workers AI
- **What:** Cloudflare runs AI models on its GPUs, and you call them with a simple REST API.
- **Model:** `@cf/black-forest-labs/flux-2-klein-4b` (FLUX.2 [klein] 4B by Black Forest Labs).
  - It's a **distilled** model: fixed at 4 inference steps, so it's very fast (a few seconds).
  - It supports **image editing**: you give it an input image and an instruction, and it redraws the image.
  - Inputs go in multipart form fields: `prompt`, `input_image_0` (must be smaller than 512×512), `width`, `height` (256–1920, multiples of 16).
  - The response is JSON: `{ "result": { "image": "<base64>" }, "success": true }`.
- **Why this instead of Replicate:**
  - Replicate's Ghibli model became paid.
  - Cloudflare's free plan includes **10,000 neurons per day**. Neurons are Cloudflare's unit of GPU compute.
  - At our sizes, one conversion costs about 80–130 neurons, so the free plan covers roughly 80–100 conversions per day.
  - No credit card is needed.
  - **Zero data retention:** Cloudflare doesn't store the images.
- **Alternatives that were evaluated and rejected (November 2026):**
  - Gemini API: no free quota for image output.
  - Pollinations: its free tier was removed in July 2026.
  - Hugging Face Space `EasyControl_Ghibli`: crashes with a ZeroGPU error.

### Tailwind CSS v4 + shadcn/ui + lucide-react
- **Tailwind:** utility classes like `rounded-2xl`, `md:grid-cols-2` written directly in JSX. Version 4 is configured in CSS, not a JS config file: see `@theme inline { ... }` in `globals.css`.
- **Design tokens:** colors are CSS variables in `:root` (`--primary: #2e6b4e`, `--sky`, `--sun` and so on). Tailwind maps them to classes like `bg-primary` and `text-muted-foreground`, so changing a color in one place restyles the whole site.
- **shadcn/ui:** copy-paste components owned by the project. Only `ui/button.tsx` is used. It's built with `class-variance-authority`, which gives variants like `variant="outline"` and `size="lg"`.
- **`cn()` (`lib/utils.ts`):** combines `clsx` (conditional classes) with `tailwind-merge` (resolves conflicts like `px-2` vs `px-4`).
- **lucide-react:** SVG icons (`Upload`, `Wand2`, `Download` and so on).
- **Fonts:** `next/font/google` self-hosts **Fraunces** (headings, via the `font-display` class) and **Geist** (body text).

---

## 3. Folder and file map

| File | Runs on | Responsibility |
| --- | --- | --- |
| `src/middleware.ts` | Server (Edge) | Auth gate. Public: `/`, `/signin(.*)`, `/signup(.*)`. Everything else, including `/convert` and `/api/*`, requires sign-in. |
| `src/app/layout.tsx` | Server | Root HTML, fonts, `ClerkProvider`, Navbar, `<main>`, Footer |
| `src/app/page.tsx` | Server | Landing page: Hero → HowItWorks → Features → CallToAction |
| `src/app/convert/page.tsx` | **Browser** | Upload, resize, call API, show result, download, usage bar |
| `src/app/api/usage/route.ts` | Server | `GET`: returns `{ used, limit, remaining }` |
| `src/app/api/convert/route.ts` | Server | `POST`: validate, check quota, call Cloudflare, record usage, return image |
| `src/lib/usage.ts` | Server | `DAILY_LIMIT`, `getUsage()`, `recordUsage()` using Clerk metadata |
| `src/components/Container.tsx` | Server | Shared `max-w-6xl` width and side padding that keeps every section aligned |
| `src/components/*.tsx` | Server | Landing page sections and layout pieces |
| `src/app/globals.css` | — | Theme colors, radius, fonts, base styles |
| `next.config.ts` | — | Next.js config (`reactStrictMode`) |
| `.env` / `.env.example` | — | Secrets and config (`.env` is git-ignored) |

---

## 4. Request flows, step by step

### 4.1 Opening `/convert`
1. `middleware.ts` runs. If the user isn't signed in, `auth.protect()` redirects them to sign in.
2. The page renders in the browser. `useAuth()` from Clerk provides `isLoaded` and `isSignedIn`.
3. A `useEffect` calls `GET /api/usage`.
4. `api/usage/route.ts` → `auth()` gets the `userId` → `getUsage(userId)` reads the Clerk user → returns `{ used: 3, limit: 10, remaining: 7 }`.
5. The page shows "Left today: 7 / 10" with a progress bar.

### 4.2 Converting a photo
**In the browser (`convert/page.tsx`):**
1. The user drops or chooses a file. `selectFile()` checks it's an image and creates a preview with `URL.createObjectURL(file)`.
2. On **Convert**, `prepareImage(file)` runs:
   - `createImageBitmap(file)` decodes the photo.
   - It draws onto a `<canvas>` scaled so the longest side is **510 px**, because the model requires inputs under 512×512.
   - `canvas.toBlob(..., "image/png")` creates a small PNG, which also keeps uploads tiny and well under Vercel's 4.5 MB body limit.
   - It calculates the output size: longest side **1024 px**, same aspect ratio, rounded to multiples of 16.
3. It sends `FormData { file, width, height }` to `POST /api/convert`.

**On the server (`api/convert/route.ts`):**
1. `auth()` returns 401 if the user isn't signed in.
2. It checks that `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` exist. If not, it returns 500.
3. `getUsage(userId)` returns **429** if `remaining <= 0`. Cloudflare isn't called, so no compute is wasted.
4. It validates the upload: must be an image Blob, at most 4 MB.
5. It builds a new multipart form for Cloudflare: `prompt`, `input_image_0`, and clamped `width`/`height` (`toDimension()` keeps them within 256–1920 and on multiples of 16).
6. `fetch("https://api.cloudflare.com/client/v4/accounts/{id}/ai/run/@cf/black-forest-labs/flux-2-klein-4b")` with `Authorization: Bearer <token>`.
7. **On failure:** it returns 502 with a friendly message (a special message if Cloudflare returns 429 because the shared daily quota is used up). **No usage is recorded.**
8. **On success:** `recordUsage(userId, used)` saves `{ usageDate: today, usageCount: used + 1 }` to Clerk.
9. It detects the image type from the base64 header (`/9j/` = JPEG, `iVBOR` = PNG, `UklGR` = WebP) and returns `{ image: "data:image/...;base64,...", remaining, limit }`.

**Back in the browser:** it shows the data URL in an `<Image>`, updates the counter, and **Download** creates a temporary `<a download>` link.

### 4.3 The prompt
```
Redraw image 0 in the style of a Studio Ghibli anime film: hand-painted watercolor backgrounds,
soft warm natural lighting, clean cel-shaded characters with gentle expressive faces, lush pastel colors.
Keep the same people, pose, composition and background layout.
```
"image 0" refers to `input_image_0`. The last sentence keeps the result faithful to the original photo. Edit `PROMPT` in `api/convert/route.ts` to change the style.

---

## 5. Rate limiting (10 per day) in detail

**Storage:** each Clerk user has three metadata fields: `publicMetadata`, `privateMetadata` and `unsafeMetadata`. We use **`privateMetadata`** because only the server, using `CLERK_SECRET_KEY`, can read or write it. The browser can't see or tamper with it.

```json
// Clerk dashboard → Users → (user) → Metadata → Private
{ "usageDate": "2026-11-09", "usageCount": 3 }
```

**Logic (`lib/usage.ts`):**
```ts
const used = meta.usageDate === today() ? meta.usageCount ?? 0 : 0;
```
- `today()` is `new Date().toISOString().slice(0, 10)`, a UTC date like `"2026-11-09"`.
- If the saved date is not today, the count is treated as **0**. This is a "lazy reset": no cron job is needed. The next write overwrites the old date.
- Usage is recorded **only after a successful conversion**, so failed attempts are free.
- `DAILY_LIMIT` comes from the `DAILY_LIMIT` env var, default 10.

**Known trade-offs:**
- Two requests sent at the same instant could both pass the check (read-then-write, not atomic). The worst case is one extra conversion, which is acceptable for a free demo.
- Each conversion makes two Clerk API calls (one read, one write). That's fine at portfolio scale.
- If you later need history, galleries, analytics or strictly atomic limits, move this to a database such as Postgres with Prisma, using a table like `usage(userId, date, count)` and an atomic `UPDATE ... SET count = count + 1 WHERE count < limit`.

**Two layers of limits:**
1. **Per user:** 10 per day (our code).
2. **Global:** Cloudflare's 10,000 free neurons per day, shared by everyone. When that runs out, Cloudflare returns 429 and the user sees "free AI capacity for today is used up".

---

## 6. Security and privacy

| Concern | How it's handled |
| --- | --- |
| Secrets | `CLERK_SECRET_KEY` and `CLOUDFLARE_API_TOKEN` are only read in server code. Only `NEXT_PUBLIC_*` variables reach the browser. `.env*` is git-ignored except `.env.example`. |
| Unauthenticated use | Middleware blocks `/convert` and `/api/*`. Each API route also checks `userId` (defense in depth). |
| Quota tampering | The count lives in Clerk `privateMetadata`, which only the server can write. |
| Abuse via large uploads | The browser resizes to under 512 px. The server rejects non-images and anything over 4 MB. |
| Image privacy | Images exist only in memory during the request. The app doesn't save them, Cloudflare's model has zero data retention, and the result goes back to the browser as a data URL, never as a hosted file. |
| Error leakage | Cloudflare error details are logged only in development. Users see friendly messages. |

---

## 7. Environment variables

| Name | Public? | Used in | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk SDK | Identifies your Clerk app in the browser |
| `CLERK_SECRET_KEY` | **No** | Middleware, API, `usage.ts` | Server access to Clerk (users, metadata) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `_SIGN_UP_URL` | Yes | Clerk SDK | Points Clerk at `/signin` and `/signup` |
| `CLOUDFLARE_ACCOUNT_ID` | **No** | `api/convert` | Part of the Workers AI URL |
| `CLOUDFLARE_API_TOKEN` | **No** | `api/convert` | Bearer token with Workers AI permission |
| `DAILY_LIMIT` | No | `lib/usage.ts` | Conversions per user per day (default 10) |

---

## 8. API reference

### `GET /api/usage`
Requires sign-in.
```json
200 { "used": 3, "limit": 10, "remaining": 7 }
401 { "message": "Unauthorized" }
```

### `POST /api/convert`
Requires sign-in. Body: `multipart/form-data`.

| Field | Type | Notes |
| --- | --- | --- |
| `file` | image | Should be under 512×512 (the page resizes it automatically). Max 4 MB. |
| `width`, `height` | number | Output size. Clamped to 256–1920 and rounded to a multiple of 16. |

```json
200 { "image": "data:image/png;base64,...", "remaining": 6, "limit": 10 }
400 { "message": "Please upload an image file." }
401 { "message": "Please sign in to convert images." }
413 { "message": "Image is too large." }
429 { "message": "You've used all 10 conversions for today. Come back tomorrow!" }
500 { "message": "Server is missing Cloudflare credentials." }
502 { "message": "Conversion failed..." | "The free AI capacity for today is used up..." }
```

---

## 9. Frontend design system

- **Palette:** cream background `#fbf8f1`, forest green primary `#2e6b4e`, sky `#6fa8dc`, sun `#f2c14e`, ink text `#1e2b24`. Defined once in `globals.css`.
- **Layout:** every section uses `<Container>` (`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`), so the edges line up from navbar to footer.
- **Typography:** Fraunces serif for headings (`font-display`), Geist sans for body text.
- **Reusable pieces:** `SectionHeading` (eyebrow, title, description), `Container`, `Button`, and `Logo` (exported from Navbar and reused in Footer).
- **Responsive:** single column on mobile. Hero and convert panels become two columns at `md`/`lg`, and feature cards go 1 → 2 → 4 columns.

---

## 10. History: what changed from v1

| v1 (Replicate) | v2 (current) |
| --- | --- |
| Replicate paid model, polled `/api/predictions/[id]` every 2 s | Cloudflare Workers AI, single synchronous request (a few seconds) |
| Postgres + Prisma `User { credits }` table | No database: Clerk `privateMetadata` |
| 2 one-time credits, "Buy more" and pricing links | 10 free conversions per day, no pricing |
| Original 8 MB hero images | Optimized ~300–400 KB JPGs |
| Public route bug (`/sign-in` vs `/signin`) | Fixed |

---

## 11. Ideas for future improvements

- **Style picker:** add other prompts (watercolor, Pixar-like, pixel art) and send the chosen style to the API.
- **Gallery:** save results to Cloudflare R2 plus a database so users can see past conversions.
- **Atomic limits:** move usage to Postgres or Upstash Redis (`INCR` with expiry).
- **Global safety cap:** track total daily conversions to stop before Cloudflare's free tier runs out.
- **Tests:** unit-test `toDimension()` and `getUsage()`, and add an end-to-end test of the convert flow with Playwright.

---

## 12. Glossary

- **App Router:** Next.js routing based on the `src/app` folder structure.
- **Route Handler:** a `route.ts` file that exports HTTP methods (`GET`, `POST`).
- **Middleware:** code that runs before a request reaches a page or API route.
- **Server vs Client Component:** server components render on the server with no browser JS. Client components (`'use client'`) run in the browser and can use state and events.
- **Neuron:** Cloudflare's unit for measuring AI compute usage.
- **Distilled model:** a smaller or faster model trained to imitate a bigger one, often with fewer inference steps.
- **Data URL:** an image encoded directly into a string (`data:image/png;base64,...`), so no file hosting is needed.
- **privateMetadata:** a server-only JSON field on a Clerk user.
- **Multipart form data:** the HTTP body format used to upload files together with text fields.
