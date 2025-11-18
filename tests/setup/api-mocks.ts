// tests/setup/api-mocks.ts

// In a real project, we would use a library like MSW (Mock Service Worker)
// to intercept network requests and return mock data.

export const mockAvailabilitySuccess = {
  status: 200,
  body: [
    { startTime: '2025-12-01T09:00:00Z', endTime: '2025-12-01T10:00:00Z', isAvailable: true },
    { startTime: '2025-12-01T10:00:00Z', endTime: '2025-12-01T11:00:00Z', isAvailable: false },
    { startTime: '2025-12-01T11:00:00Z', endTime: '2025-12-01T12:00:00Z', isAvailable: true },
  ],
};

export const mockBookingSuccess = {
  status: 200,
  body: {
    appointmentId: 'appt-test-123',
    status: 'CONFIRMED',
    message: 'Booking confirmed.',
  },
};

export const mockBookingDepositRequired = {
  status: 200,
  body: {
    appointmentId: 'appt-test-456',
    paystackReference: 'paystack-test-ref',
    status: 'PENDING_PAYMENT',
    message: 'Booking held, awaiting deposit payment.',
  },
};

export const mockBookingOptimisticLockingFailure = {
  status: 409, // Conflict
  body: {
    error: 'Concurrent booking attempt. Please try again.',
  },
};

// Function to set up the mocks (simulated)
export const setupApiMocks = () => {
  console.log('Simulating API mocks setup for SuperSaaS and Paystack.');
  // e.g., msw.listen()
};

export const teardownApiMocks = () => {
  console.log('Simulating API mocks teardown.');
  // e.g., msw.close()
};
