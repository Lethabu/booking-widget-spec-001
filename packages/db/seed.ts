import { db } from './db'; // Assuming a db connection is available
import { tenants, services, employees } from './schema';

const TENANT_ID = 'instyle-hair-boutique';

async function seed() {
  console.log('Starting database seed...');

  // 1. Seed Tenant (required for foreign key)
  await db.insert(tenants).values({
    id: TENANT_ID,
    name: 'Instyle Hair Boutique',
  }).onConflictDoNothing();

  // 2. Seed Services (5)
  const serviceData = [
    { name: 'Middle & Side Installation', price: 300, duration: 60 },
    { name: 'Maphondo & Lines Installation', price: 350, duration: 60 },
    { name: 'Soft Glam Makeup', price: 450, duration: 120 },
    { name: 'Gel Maphondo Styling', price: 350, duration: 120 },
    { name: 'Frontal Ponytail Installation', price: 950, duration: 120 },
  ];

  for (const service of serviceData) {
    await db.insert(services).values({
      id: `svc-${service.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      tenantId: TENANT_ID,
      ...service,
      // Placeholder for supersaasServiceId
      supersaasServiceId: `supersaas-svc-${Math.floor(Math.random() * 1000)}`,
    }).onConflictDoNothing();
  }

  // 3. Seed Employees (4)
  const employeeData = [
    { name: 'Thandi Mthembu' },
    { name: 'Nomsa Dlamini' },
    { name: 'Zanele Khumalo' },
    { name: 'Precious Ndaba' },
  ];

  for (const employee of employeeData) {
    await db.insert(employees).values({
      id: `emp-${employee.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      tenantId: TENANT_ID,
      ...employee,
      // Placeholder for supersaasScheduleId as per TASK-001-1
      supersaasScheduleId: `supersaas-sch-${Math.floor(Math.random() * 1000)}`,
      isActive: true,
    }).onConflictDoNothing();
  }

  console.log('Database seed complete.');
}

// In a real project, this would be executed by a migration script.
// For simulation, we just define the function.
// seed().catch(console.error);
