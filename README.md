# 🎟️ Tiqora - Events & Sports Match Ticketing Platform

Tiqora is an event booking website for football matches, sports showdowns, and live events. Built with **Next.js 16 (App Router & React Server Components)**, **TypeScript**, **Tailwind CSS**, and modern cloud services.

---

## ⚡ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, React Server Components, Node.js runtime) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`) |
| **Storage** | [Supabase Storage](https://supabase.com/storage) |
| **Validation** | [Zod](https://zod.dev/) |
| **UI Alerts** | [Sonner](https://sonner.emilkowal.ski/) |
| **Emails** | [Resend](https://resend.com/) |
| **Payments** | [Stripe](https://stripe.com/) (`stripe`, `@stripe/stripe-js`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Hosting** | [Vercel](https://vercel.com/) |

---

## 📁 Directory Structure

```
├── public/
│   ├── Tiqora logo.png               # Official Tiqora brand logo
│   └── logo.png                      # Alias brand logo
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with fonts, Tiqora header, footer, & Sonner Toaster
│   │   ├── page.tsx                  # Tiqora homepage (React Server Component)
│   │   └── globals.css               # Tailwind CSS v4 styling & dark theme tokens
│   ├── components/
│   │   ├── layout/                   # Tiqora Navbar & Footer
│   │   └── ui/                       # Button, Badge, Toaster (Sonner wrapper)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client (using Publishable key)
│   │   │   ├── server.ts             # Server Supabase client (using cookies & RSC)
│   │   │   └── middleware.ts         # Supabase Auth session refresh helper
│   │   ├── stripe.ts                 # Stripe Node SDK instance
│   │   ├── resend.ts                 # Resend email client instance
│   │   └── utils.ts                  # Utility functions (cn class merger)
│   └── proxy.ts                      # Next.js 16 Proxy handler (session refreshing)
├── .env.example                      # Environment variables template
├── .env.local                        # Local development variables
├── AGENTS.md                         # Guidelines and rules for AI agents
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Environment Variables
Fill in your credentials in `.env.local` (copied from `.env.example`):

```env
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Publishable & Secret keys)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SECRET_KEY=your-supabase-secret-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Build for Production
```bash
npm run build
npm run start
```
