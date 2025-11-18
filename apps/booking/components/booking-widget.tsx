// apps/booking/components/booking-widget.tsx
// Main component implementing the state machine

import React, { useState } from 'react';
import { Service, ServiceSelector } from './service-selector';
import { CalendarGrid, Employee } from './calendar-grid';
import { Slot } from '@/apps/booking/lib/supersaas-client';
import { BookingRequestSchema, BookingResponseSchema } from '@/apps/booking/lib/validation';
import { z } from 'zod';

// Define the state machine steps
type BookingStep = 'SERVICE_SELECTION' | 'TIME_SELECTION' | 'CUSTOMER_DETAILS' | 'CONFIRMATION';

// Simulated shadcn/ui components
const H2 = ({ children }: { children: React.ReactNode }) => <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{children}</h2>;
const Button = ({ children, onClick, disabled = false }: { children: React.ReactNode, onClick: () => void, disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ padding: '10px 20px', margin: '10px 0', cursor: disabled ? 'not-allowed' : 'pointer', backgroundColor: disabled ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
  >
    {children}
  </button>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    style={{ padding: '10px', margin: '5px 0', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
  />
);

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export const BookingWidget: React.FC = () => {
  const [step, setStep] = useState<BookingStep>('SERVICE_SELECTION');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: '', email: '', phone: '' });
  const [bookingStatus, setBookingStatus] = useState<z.infer<typeof BookingResponseSchema> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('TIME_SELECTION');
  };

  const handleSlotSelect = (slot: Slot, employee: Employee) => {
    setSelectedSlot(slot);
    setSelectedEmployee(employee);
    setStep('CUSTOMER_DETAILS');
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedEmployee || !selectedSlot) {
      setError('Please complete all selections.');
      return;
    }

    const requestBody = {
      serviceId: selectedService.id,
      employeeId: selectedEmployee.id,
      slot: selectedSlot,
      customer: customerDetails,
    };

    // Validate client-side before sending
    const validationResult = BookingRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      setError('Please fill in all required customer details correctly.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed.');
      }

      const statusData = BookingResponseSchema.parse(data);
      setBookingStatus(statusData);
      setStep('CONFIRMATION');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'SERVICE_SELECTION':
        return <ServiceSelector onSelectService={handleServiceSelect} selectedServiceId={selectedService?.id || null} />;

      case 'TIME_SELECTION':
        return (
          <>
            <CalendarGrid onSelectSlot={handleSlotSelect} />
            <Button onClick={() => setStep('SERVICE_SELECTION')}>Back to Service</Button>
          </>
        );

      case 'CUSTOMER_DETAILS':
        return (
          <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <H2>Your Details</H2>
            <P>Service: {selectedService?.name}</P>
            <P>Employee: {selectedEmployee?.name}</P>
            <P>Time: {new Date(selectedSlot?.startTime || '').toLocaleString()}</P>
            <Input name="name" placeholder="Full Name" value={customerDetails.name} onChange={handleCustomerChange} required />
            <Input name="email" type="email" placeholder="Email" value={customerDetails.email} onChange={handleCustomerChange} required />
            <Input name="phone" placeholder="Phone (for SMS/WhatsApp)" value={customerDetails.phone} onChange={handleCustomerChange} required />
            {error && <P style={{ color: 'red' }}>Error: {error}</P>}
            <Button onClick={handleSubmitBooking} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
            </Button>
            <Button onClick={() => setStep('TIME_SELECTION')}>Back to Time</Button>
          </div>
        );

      case 'CONFIRMATION':
        return (
          <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid green', borderRadius: '8px' }}>
            <H2>Booking {bookingStatus?.status === 'CONFIRMED' ? 'Confirmed' : 'Pending Payment'}</H2>
            <P>{bookingStatus?.message}</P>
            <P>Appointment ID: {bookingStatus?.appointmentId}</P>
            {bookingStatus?.paystackReference && (
              <P>Paystack Reference: {bookingStatus.paystackReference}</P>
            )}
            <Button onClick={() => window.location.reload()}>Start New Booking</Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <H2>Instyle Hair Boutique Booking Widget</H2>
      {renderStep()}
    </div>
  );
};
