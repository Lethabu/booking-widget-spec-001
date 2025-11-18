// apps/booking/lib/paystack-client.ts

// In a real implementation, this would handle API calls to Paystack.
// For now, we use a mock to allow the API routes to be built.

export interface PaystackResponse {
  authorization_url: string;
  reference: string;
}

/**
 * Simulates initiating a deposit payment with Paystack.
 * @param amount The amount in cents.
 * @param email The customer's email.
 * @returns A promise that resolves to a mock Paystack response.
 */
export async function initiateDeposit(amount: number, email: string): Promise<PaystackResponse> {
  console.log(`Simulating Paystack deposit initiation for ${email} with amount ${amount}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    authorization_url: `https://paystack.co/mock-auth?ref=${Date.now()}`,
    reference: `paystack-ref-${Date.now()}`,
  };
}
