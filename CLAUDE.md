# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SlotMe is a SaaS online scheduling web app for service businesses (barbershops, salons, clinics). Business owners register their business, professionals, and services. Clients access a public page at `slotme.vercel.app/[slug]`, choose a service, professional, date, and time — no account required.

## Stack

- Next.js 14 with App Router (never Pages Router)
- TypeScript strict mode (zero `any`)
- Tailwind CSS
- Supabase (Auth + PostgreSQL + RLS)
- Google OAuth via Supabase Auth
- Resend (email)
- Vercel (deploy)
- Vitest + React Testing Library

## Commands

```bash
npm run dev          # development server on localhost:3000
npm run build        # production build
npm run lint         # ESLint
npm run test         # all tests via Vitest
npm run test availability  # single test file
```

## Git Rules (non-negotiable)

- **NEVER** include `Co-Authored-By` in any commit
- **NEVER** mention Claude, Anthropic, or AI in commit messages
- All commits are authored exclusively by RafaLimaaa
- Commit messages in **Portuguese** following conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `test:`
- Commit at the end of each implementation step — never accumulate changes
- Push to remote immediately after each commit

## Architecture

```
src/
├── app/                      # Next.js App Router pages
│   ├── [slug]/               # Public business page + booking flow
│   ├── cancelar/[token]/     # Client cancellation
│   ├── reagendar/[token]/    # Client rescheduling redirect
│   ├── dashboard/            # Owner panel (protected by middleware)
│   └── middleware.ts         # Auth protection — never protect routes via component redirect
├── components/
│   ├── ui/                   # Primitive components (Button, Card, Input, Modal, etc.)
│   ├── public/               # Business page components
│   ├── booking/              # Multi-step booking flow components
│   ├── dashboard/            # Owner panel components
│   ├── onboarding/           # Owner onboarding flow
│   └── layout/
├── hooks/                    # All data-fetching and business logic
├── lib/
│   ├── supabase.ts           # Typed browser client
│   ├── supabase-server.ts    # Server Component client
│   ├── availability.ts       # Pure functions — the critical business logic
│   └── resend.ts             # Email sending
├── types/index.ts            # All TypeScript types and interfaces
└── tests/
    └── availability.test.ts  # Must have 100% coverage
```

**Data flow:** Server Components fetch via `supabase-server.ts` → pass data as props or use hooks for client interactivity. All business logic lives in `hooks/` and `lib/` — zero logic in components. Components max 150 lines.

## Availability Logic (`lib/availability.ts`)

This is the most critical part of the system. Must be pure functions with no side effects.

`getAvailableSlots` takes: `workingHours`, `appointments`, `blockedPeriods`, `serviceDuration`, `slotInterval` (fixed 30min), `currentDateTime`.

Rules in order:
1. If `workingHours` is null for the day → return empty array
2. Generate slots from `start_time` to `end_time` in 30-min intervals
3. Last valid slot = `end_time - serviceDuration` (slot must finish before end of shift)
4. Remove slots overlapping `lunch_start`/`lunch_end`
5. Remove slots less than 60 minutes from now
6. An existing appointment at time T blocks T and all slots where `slot + serviceDuration` would overlap the appointment
7. Manually blocked periods follow the same rule as appointments

## Database Schema (Supabase PostgreSQL)

Tables: `businesses`, `professionals`, `services`, `professional_services` (join), `working_hours`, `blocked_periods`, `appointments`.

Key `appointments` fields: `cancel_token uuid UNIQUE`, `reschedule_token uuid UNIQUE`, `status CHECK ('scheduled','completed','cancelled')`.

**RLS is always enabled on all tables.** Public access: `businesses` (by slug read), `appointments` (INSERT only), `professional_services` (SELECT). Owner access: everything in their business. Never disable RLS. Never use service role key in the frontend.

## Design System

**Two visual worlds:**

| Context | Background | Surface | Border |
|---|---|---|---|
| Public (client) | `#FFFFFF` / `#F8FAFC` | — | — |
| Dashboard (owner) | `#09090B` | `#18181B` | `#27272a` |

- Accent: `#2563EB` (primary), `#DC2626` (CTAs and alerts only)
- Font: Inter
- Border radius: `12px` default, `20px` large cards
- Card hover: `box-shadow: 0 0 0 1px #2563EB, 0 0 16px rgba(37,99,235,0.2)`, `transition: 200ms ease-out`
- Entry animations: `opacity 0→1`, `translateY 8px→0`, `300ms ease-out`, stagger 50ms between elements
- Primary buttons: gradient `linear-gradient(135deg, #1d4ed8, #2563EB, #3b82f6)` with shimmer on hover
- Icons: Lucide React exclusively
- Zero emojis anywhere in the UI

## Implementation Order

Do not skip steps. Do not start components without types and hooks ready. Do not start the booking flow without availability logic tested.

1. Next.js 14 setup (App Router, TypeScript strict, Tailwind)
2. `types/index.ts` — all types
3. SQL migrations (tables + RLS + indexes)
4. `lib/supabase.ts` and `lib/supabase-server.ts`
5. `lib/availability.ts` + full tests (`tests/availability.test.ts`)
6. `lib/resend.ts` + email templates
7. `middleware.ts`
8. Hooks
9. Base UI components
10. Owner onboarding
11. Dashboard + weekly calendar
12. Public business page
13. Booking flow
14. Success page + cancellation
15. SlotMe landing page
16. Integration tests
17. README (no AI tone, no emojis, with production link, author: "Desenvolvido por [Rafael Lima](https://github.com/RafaLimaaa)")

## Never Do

- Use Pages Router instead of App Router
- Use `any` in TypeScript
- Disable RLS on any table
- Use emojis in the UI
- Create components over 150 lines
- Put availability logic inside components
- Use service role key in the frontend
- Include `Co-Authored-By` or any AI reference in commits
- Accumulate uncommitted changes across implementation steps
