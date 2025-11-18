import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Placeholder for the tenants table to satisfy foreign key constraint
export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  duration: integer('duration').notNull(), // in minutes
  // New column for SPEC-001
  supersaasServiceId: text('supersaas_service_id').unique(),
});

export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id),
  serviceId: text('service_id').references(() => services.id),
  // New column for SPEC-001
  version: integer('version').notNull().default(1),
});

// New table for SPEC-001
export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id),
  name: text('name').notNull(),
  supersaasScheduleId: text('supersaas_schedule_id'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});
