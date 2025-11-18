# Implementation Plan for SPEC-001

## System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │       Booking Widget (React Component)                │  │
│  │  - Service Selector                                  │  │
│  │  - Employee Selector                                 │  │
│  │  - Calendar View                                     │  │
│  │  - Payment Modal                                     │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │ API Calls (fetch)                    │
└──────────────────────┼──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   API Layer (Edge Runtime)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  POST /api/book                                     │  │
│  │  GET  /api/availability?employee=&date=            │  │
│  │  POST /api/payment/confirm                          │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │ Database & External Calls            │
└──────────────────────┼──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Data Layer                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────┐  │
│  │   D1 Database   │  │   SuperSaaS API │  │ Paystack  │  │
│  │  - tenants      │  │  - Schedules    │  │  - Payments│ │
│  │  - services     │  │  - Bookings     │  └───────────┘  │
│  │  - appointments │  └─────────────────┘                 │
│  │  - employees    │  ┌─────────────────┐                 │
│  └─────────────────┘  │   WhatsApp API  │                 │
│                       │  - Notifications │                 │
│                       └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## File-Level Implementation Tasks

### Task 1: Database Schema Updates
**Files**:
- `packages/db/schema.ts` (add version column for optimistic locking)
- `packages/db/seed.ts` (seed 5 services, 4 employees)

**Changes**:
```typescript
// Add to appointments table
version: integer('version').notNull().default(1),

// Add to services table
supersaas_service_id: text('supersaas_service_id').unique(),

// Add employees table
export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id),
  name: text('name').notNull(),
  supersaasScheduleId: text('supersaas_schedule_id'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
})
```

### Task 2: API Routes
**Files**:
- `apps/booking/app/api/availability/route.ts`
- `apps/booking/app/api/book/route.ts`
- `apps/booking/app/api/webhooks/supersaas/route.ts`

**Implementation Notes**:
- Use `runtime = 'edge'` explicitly
- Add Honeycomb tracing
- Implement rate limiting via Cloudflare

### Task 3: React Components
**Files**:
- `apps/booking/components/booking-widget.tsx` (main widget)
- `apps/booking/components/calendar-grid.tsx` (calendar view)
- `apps/booking/components/service-selector.tsx` (service picker)
- `apps/booking/components/employee-selector.tsx` (employee picker)

**Implementation Notes**:
- Use `next/dynamic` for heavy components
- Implement skeleton loading states
- Add error boundaries

### Task 4: Utilities & Hooks
**Files**:
- `apps/booking/lib/supersaas-client.ts` (API client)
- `apps/booking/hooks/use-availability.ts` (React Query hook)
- `apps/booking/lib/validation.ts` (Zod schemas)
