import { z } from 'zod';

// Assuming Zod is available in the environment

// --- Availability API Schemas ---

// Request query parameters for /api/availability
export const AvailabilityRequestSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

// Response slot structure for /api/availability
export const SlotSchema = z.object({
  startTime: z.string().datetime(), // ISO 8601 format
  endTime: z.string().datetime(),   // ISO 8601 format
  isAvailable: z.boolean(),
});

export const AvailabilityResponseSchema = z.array(SlotSchema);

// --- Booking API Schemas ---

// Request body for /api/book
export const BookingRequestSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  slot: SlotSchema,
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10), // Used for SMS/WhatsApp
  }),
});

// Response body for /api/book
export const BookingResponseSchema = z.object({
  appointmentId: z.string(),
  paystackReference: z.string().optional(), // Present if deposit was required
  status: z.enum(['PENDING_PAYMENT', 'CONFIRMED']),
  message: z.string(),
});
