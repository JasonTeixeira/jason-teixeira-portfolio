---
title: 'Building a 590,000-Line Next.js App (And Not Going Insane)'
description: 'Six months, 590K lines of code, and countless "why is my bundle 2MB?" moments. Here's what actually worked.'
date: '2024-11-08'
draft: false
slug: /pensieve/nexquantsite-590k-loc
featuredImage: './cover.jpg'
category: 'Full-Stack Development'
tags:
  - Next.js 15
  - React 19
  - TypeScript
  - PostgreSQL
  - WebSocket
  - Performance
---

Most portfolio projects are 1-5K lines of code. NexQuantSite is **590,000 lines**. That's 100x larger. And honestly? It's been both the most ambitious and most frustrating thing I've ever built.

Let me tell you about the six months I spent building a full-stack trading platform that almost broke my computer (and my sanity).

[View Project on GitHub](https://github.com/JasonTeixeira/NexQuantSite) | [Full Project Details](/projects/nexquantsite)

## How It Started

"I'll build a trading platform. Should take maybe 2-3 months."

Famous last words.

The plan was simple: Next.js 15 frontend, some API routes, maybe a database. Nothing crazy. A few thousand lines of code, tops.

Six months later: 590,000+ lines of TypeScript, a complete admin dashboard with 60+ features, real-time WebSocket streaming, JWT authentication with refresh tokens, role-based permissions, and a bundle size that made Lighthouse cry.

At some point this stopped being a portfolio project and turned into "let me see how far I can push Next.js before it breaks."

## What I Actually Built

NexQuantSite ended up being way more than I planned:

**Trading Interface:** Real-time price updates via WebSocket, order book streaming, trade execution, portfolio tracking. The whole nine yards.

**Admin Dashboard:** 60+ features. User management with CRUD operations, trading controls, system monitoring, analytics dashboards, audit logs, feature flags. Basically an entire admin panel that any SaaS company would need.

**Authentication:** JWT + refresh tokens, RBAC permissions, route protection, API authorization. Because I apparently enjoy making my life harder.

**Real-time Everything:** Managing 1000+ concurrent WebSocket connections. This part was... interesting. More on that later.

The codebase? 590K lines. No inflated metrics here—this is legit production code with proper TypeScript types, error handling, tests (well, 60% coverage), and documentation.

## The Bundle Size Disaster

Week 3. I run Lighthouse. Score: 68. Time to Interactive: 4.5 seconds. Bundle size: **2MB**.

For context, most Next.js apps are under 500KB. I had somehow created a bundle that was 4x larger than what's considered "acceptable."

The problem? I was importing EVERYTHING upfront. The entire admin panel loaded on the homepage. Every chart library. Every utility function. All of it.

### How I Fixed It (After Many Failures)

**Attempt 1:** "I'll just lazy load everything!"  
Result: Broke half the app because I didn't understand React Suspense boundaries.

**Attempt 2:** "Code splitting by route should work!"  
Result: Better, but still loading way too much on initial page load.

**Attempt 3:** Dynamic imports for heavy components.  
Result: This actually worked.

```typescript
// Instead of this (which loads everything):
import AdminPanel from './AdminPanel';

// Do this (loads only when needed):
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <Skeleton />,
  ssr: false  // Don't even try to server-render this beast
});
```

After properly implementing code splitting:
- Bundle: 2MB → 495KB (75% reduction)
- Time to Interactive: 4.5s → 1.8s
- Lighthouse score: 68 → 94

Took me three weeks to figure this out. Three weeks I could have saved if I had just read the Next.js docs more carefully.

## WebSocket Hell

Building real-time features sounds cool until you're actually doing it.

The requirement: Stream live price updates to potentially 1000+ concurrent users without the server catching fire.

### What Went Wrong

**Problem 1:** Memory leaks everywhere. Connections weren't closing properly. After an hour of testing, my dev server would consume 8GB of RAM.

**Problem 2:** Broadcasting updates to 1000 connections is slow. Really slow. Every price update would take 500-800ms to reach all clients.

**Problem 3:** Some clients would randomly disconnect and reconnect in a loop, creating a thundering herd problem.

### What Actually Worked

I ended up implementing:

1. **Connection pooling** - Reuse WebSocket connections instead of creating new ones
2. **Batch updates** - Send updates every 100ms instead of immediately (users can't tell the difference)
3. **Exponential backoff** on reconnections - Stop the thundering herd
4. **Heartbeat pings** every 30s to keep connections alive

The result? Connections stay stable, broadcasts happen in <100ms, and the server doesn't explode. But it took me two solid weeks of debugging to get there.

## The Authentication Rabbit Hole

I thought implementing JWT auth would be straightforward. "Just use NextAuth.js!"

Nope. Not for what I needed.

I needed:
- Short-lived access tokens (15 min)
- Long-lived refresh tokens (7 days)  
- Automatic token refresh (transparent to users)
- RBAC with granular permissions
- Route protection in middleware
- API endpoint authorization

NextAuth.js didn't do all of this out of the box. So I built my own auth system. Which took a month. A MONTH.

The hardest part? Handling token refresh **without interrupting the user experience**. If a request fails due to an expired token, you need to:

1. Detect the 401 error
2. Attempt token refresh
3. Retry the original request
4. Handle refresh failures gracefully

Sounds simple. Implementing it without race conditions and edge cases? Not simple.

## Code Organization at Scale

At 10K lines: "I'll just wing it."  
At 50K lines: "Okay I should organize this better."  
At 200K lines: "I have no idea where anything is."  
At 590K lines: "I'm restructuring the entire codebase."

I learned the hard way that code organization matters. A lot.

What saved me:

**Feature-based folders:** Each feature gets its own folder with components, hooks, utils, types. No more hunting through a giant `components/` directory.

**Shared component library:** Common UI components in one place. Button, Input, Modal, etc. DRY principle saves lives.

**Custom hooks everywhere:** useAuth, useWebSocket, useThrottle, useDebounce. Abstract reusable logic immediately.

**Strict TypeScript:** Every file. Every function. Every prop. No `any` types allowed. This caught SO many bugs before they hit production.

## Performance Lessons

### API Response Times

Initial implementation: 850ms average response time. Unacceptable.

The problem? N+1 queries. My ORM (Prisma) was making separate database calls for related data instead of joining them.

Fixed with proper includes and selects: 850ms → 180ms. 79% faster just by optimizing database queries.

### React Re-renders

I had components re-rendering hundreds of times per second. The culprit? Putting WebSocket state in the root component and triggering re-renders for EVERY price update.

Solution: Zustand for state management + React.memo for expensive components. Re-render only what changed.

### Image Optimization

I was serving raw PNG images. Some were 5MB+. Users on slow connections waited forever.

Switched to Next.js Image component with WebP format: 5MB → 200KB. Page load times improved dramatically.

## What I'd Do Differently

If I were starting over (which honestly, I might):

**Monorepo from day one.** Split the admin dashboard and trading interface into separate apps. They share nothing. Keeping them in one codebase was a mistake.

**GraphQL instead of REST.** I'm making 10+ API calls to load a single page because REST doesn't let me fetch exactly what I need. GraphQL would solve this.

**Better testing from the start.** I'm at 60% coverage now. Should have been writing tests alongside features, not after.

**Use tRPC.** Type-safe APIs with full TypeScript support? Yes please. Would have saved countless hours debugging type mismatches between frontend and backend.

## The Honest Assessment

Is this the cleanest codebase ever written? No.  
Is it over-engineered in some places? Probably.  
Are there parts I'm embarrassed by? Absolutely.

But does it work? Yes.  
Did I learn more building this than reading 100 tutorials? Also yes.

Building a 590K LOC application teaches you things you can't learn from small projects:
- How to structure code at scale
- Why performance budgets matter
- When abstractions help vs hurt
- How to debug truly complex systems
- The importance of proper error handling

## Technical Stats (For the Nerds)

- **Lines of Code:** 590,000+ (actual LOC, not inflated)
- **Components:** 200+ React components
- **API Endpoints:** 60+ routes
- **Database Tables:** 40+ (PostgreSQL via Prisma)
- **WebSocket Connections:** Handles 1000+ concurrent
- **Bundle Size:** 495KB (down from 2MB)
- **Lighthouse Score:** 94 (up from 68)
- **Test Coverage:** 60% (working on it)

## The Bottom Line

Six months. 590,000 lines of code. Countless bugs. Many 2am debugging sessions. Several "maybe I should just start over" moments.

Was it worth it? Yes. Building something this large forced me to level up in ways a small project never would.

Would I recommend it? Only if you hate yourself a little bit. (I'm kidding. Mostly.)

Next project: Something smaller. Please.

## Related

Want to see more war stories?
- [AlphaStream: ML Trading That Actually Works](/pensieve/alphastream-ml-trading)
- [RiskRadar: Portfolio Risk Analytics](/projects/riskradar)

Questions? Think I'm crazy? [Open an issue on GitHub](https://github.com/JasonTeixeira/NexQuantSite) or check out the [full documentation](/projects/nexquantsite).
