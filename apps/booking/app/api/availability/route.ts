// apps/booking/app/api/availability/route.ts
// Must use Edge runtime and Honeycomb tracing (simulated)

import { NextResponse } from 'next/server';
import { AvailabilityRequestSchema, AvailabilityResponseSchema } from '@/apps/booking/lib/validation';
import { getAvailability } from '@/apps/booking/lib/supersaas-client';
// In a real project, we would import the DB client and Honeycomb tracing

// Force Edge runtime as per Constitution
export const runtime = 'edge';

// Simulate Honeycomb tracing setup
const withTracing = (handler: Function) => {
  return async (req: Request) => {
    console.log(`[Honeycomb Trace] Starting trace for ${req.url}`);
    try {
      const response = await handler(req);
      console.log(`[Honeycomb Trace] Trace finished successfully`);
      return response;
    } catch (error) {
      console.error(`[Honeycomb Trace] Trace finished with error:`, error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
};

// Simulate DB access to get employee schedule ID
const getEmployeeScheduleId = (employeeId: string): string | null => {
  // This would be a Drizzle query in a real app
  // For now, we'll use a placeholder based on the employee names from the seed file
  const scheduleMap: { [key: string]: string } = {
    'emp-thandi-mthembu': 'sch-123',
    'emp-nomsa-dlamini': 'sch-456',
    'emp-zanele-khumalo': 'sch-789',
    'emp-precious-ndaba': 'sch-012',
  };
  return scheduleMap[employeeId] || null;
};

// Simulate Rate Limiting
const isRateLimited = (ip: string | null): boolean => {
  // In a real Cloudflare Worker, this would use the Rate Limiting feature.
  // For simulation, we'll always allow.
  console.log(`[Rate Limit] Checking IP: ${ip}. Allowed.`);
  return false;
};

const GET_handler = async (req: Request) => {
  const url = new URL(req.url);
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const queryParams = {
    employeeId: url.searchParams.get('employeeId'),
    date: url.searchParams.get('date'),
  };

  // 1. Validate query parameters
  const validationResult = AvailabilityRequestSchema.safeParse(queryParams);
  if (!validationResult.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: validationResult.error.issues }, { status: 400 });
  }

  const { employeeId, date } = validationResult.data;

  // 2. Get SuperSaaS Schedule ID
  const scheduleId = getEmployeeScheduleId(employeeId);
  if (!scheduleId) {
    return NextResponse.json({ error: 'Employee not found or schedule not configured' }, { status: 404 });
  }

  try {
    // 3. Fetch availability from SuperSaaS (mocked)
    const slots = await getAvailability(scheduleId, date);

    // 4. Validate and return response
    const responseData = AvailabilityResponseSchema.parse(slots);
    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Error fetching availability:', error);
    // Graceful degradation would happen here (e.g., serving cached data)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
};

export const GET = withTracing(GET_handler);
