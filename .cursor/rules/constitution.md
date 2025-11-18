# Project Constitution - Appointment Booking Platform

## Architectural Principles
- **Edge-First**: All API routes must use `runtime = 'edge'`
- **Tenant Isolation**: Row Level Security (RLS) at database level
- **Event-Driven**: All state changes emit events to Cloudflare Queues
- **API-First**: OpenAPI specifications before implementation
- **Zero Trust**: Authentication at every boundary
- **Observability**: Honeycomb tracing on all workers

## Technology Constraints
- **Frontend**: Next.js 15+, React 19, TypeScript strict mode
- **Backend**: Cloudflare Workers, D1 Database, Drizzle ORM
- **Auth**: Auth.js v5 (not NextAuth)
- **UI**: shadcn/ui components only
- **State**: Zustand (client), no Redux
- **Caching**: Cloudflare Cache API, no external Redis

## Forbidden Libraries
- Firebase (causes "self is not defined" errors)
- axios (use native fetch)
- moment.js (use date-fns)
- lodash (use vanilla JS)

## Naming Conventions
- Files: kebab-case (e.g., `booking-widget.tsx`)
- Components: PascalCase (e.g., `BookingCalendar`)
- API routes: kebab-case (e.g., `api/tenant/route.ts`)
- Database: snake_case (e.g., `tenant_id`)
