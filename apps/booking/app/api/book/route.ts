// apps/booking/app/api/book/route.ts
// Must use Edge runtime and Honeycomb tracing (simulated)

import { NextResponse } from 'next/server';
import { BookingRequestSchema, BookingResponseSchema } from '@/apps/booking/lib/validation';
import { createBooking } from '@/apps/booking/lib/supersaas-client';
import { initiateDeposit } from '@/apps/booking/lib/paystack-client';
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

// Simulate DB access to get employee schedule ID and service price
const getBookingDetails = (employeeId: string, serviceId: string) => {
  // Mock data based on seed file
  const scheduleMap: { [key: string]: string } = {
    'emp-thandi-mthembu': 'sch-123',
    'emp-nomsa-dlamini': 'sch-456',
    'emp-zanele-khumalo': 'sch-789',
    'emp-precious-ndaba': 'sch-012',
  };

  const priceMap: { [key: string]: number } = {
    'svc-middle-side-installation': 300,
    'svc-maphondo-lines-installation': 350,
    'svc-soft-glam-makeup': 450,
    'svc-gel-maphondo-styling': 350,
    'svc-frontal-ponytail-installation': 950,
  };

  return {
    scheduleId: scheduleMap[employeeId],
    servicePrice: priceMap[serviceId],
  };
};

// Simulate Drizzle DB transaction for optimistic locking
const createAppointmentInDB = async (data: any, isConfirmed: boolean, paystackRef?: string) => {
  // In a real scenario, this would be a Drizzle transaction with a WHERE clause
  // to check the version column for optimistic locking.
  console.log(`[DB] Creating appointment for ${data.customer.name}. Confirmed: ${isConfirmed}`);
  // Simulate successful DB write
  await new Promise(resolve => setTimeout(resolve, 50));
  return `appt-${Date.now()}`;
};

const POST_handler = async (req: Request) => {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  // Rate limiting check would go here

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 1. Validate request body
  const validationResult = BookingRequestSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json({ error: 'Invalid request body', details: validationResult.error.issues }, { status: 400 });
  }

  const { serviceId, employeeId, slot, customer } = validationResult.data;
  const { scheduleId, servicePrice } = getBookingDetails(employeeId, serviceId);

  if (!scheduleId || !servicePrice) {
    return NextResponse.json({ error: 'Invalid service or employee ID' }, { status: 400 });
  }

  const depositRequired = servicePrice > 500;
  let paystackReference: string | undefined;
  let status: 'PENDING_PAYMENT' | 'CONFIRMED' = 'CONFIRMED';
  let message = 'Booking confirmed.';

  try {
    // 2. Attempt SuperSaaS booking
    const supersaasApptId = await createBooking(scheduleId, slot, customer);

    // 3. Handle Payment
    if (depositRequired) {
      const depositAmount = servicePrice * 0.5 * 100; // Convert to cents
      const paystackRes = await initiateDeposit(depositAmount, customer.email);
      paystackReference = paystackRes.reference;
      status = 'PENDING_PAYMENT';
      message = 'Booking held, awaiting deposit payment.';
    }

    // 4. Create DB entry with optimistic locking
    const appointmentId = await createAppointmentInDB(validationResult.data, status === 'CONFIRMED', paystackReference);

    // 5. Simulate Event Emission (Cloudflare Queues)
    console.log(`[Event] Emitting booking event for appointment ${appointmentId}`);

    // 6. Return response
    const responseData = BookingResponseSchema.parse({
      appointmentId,
      paystackReference,
      status,
      message,
    });

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Booking failed:', error);
    // Rollback logic would go here (e.g., cancel SuperSaaS appointment)
    return NextResponse.json({ error: 'Booking failed due to a server error' }, { status: 500 });
  }
};

export const POST = withTracing(POST_handler);
