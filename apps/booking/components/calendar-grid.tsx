// apps/booking/components/calendar-grid.tsx
// Using simulated shadcn/ui components

import React, { useState } from 'react';
import { useAvailability } from '@/apps/booking/hooks/use-availability';
import { Slot } from '@/apps/booking/lib/supersaas-client';

// Simulated Employee type based on seed data
export interface Employee {
  id: string;
  name: string;
}

// Simulated shadcn/ui components
const Button = ({ children, onClick, disabled = false, className = '' }: { children: React.ReactNode, onClick: () => void, disabled?: boolean, className?: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ padding: '8px 16px', margin: '4px', cursor: disabled ? 'not-allowed' : 'pointer', backgroundColor: disabled ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
    className={className}
  >
    {children}
  </button>
);
const Select = ({ children, onChange }: { children: React.ReactNode, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <select onChange={onChange} style={{ padding: '8px', margin: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
    {children}
  </select>
);
const H4 = ({ children }: { children: React.ReactNode }) => <h4 style={{ margin: '0 0 8px 0' }}>{children}</h4>;
const P = ({ children }: { children: React.ReactNode }) => <p style={{ margin: '4px 0', fontSize: '0.9em' }}>{children}</p>;

const mockEmployees: Employee[] = [
  { id: 'emp-thandi-mthembu', name: 'Thandi Mthembu' },
  { id: 'emp-nomsa-dlamini', name: 'Nomsa Dlamini' },
  { id: 'emp-zanele-khumalo', name: 'Zanele Khumalo' },
  { id: 'emp-precious-ndaba', name: 'Precious Ndaba' },
];

interface CalendarGridProps {
  onSelectSlot: (slot: Slot, employee: Employee) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ onSelectSlot }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(mockEmployees[0]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { data: slots, isLoading, error } = useAvailability(selectedEmployee?.id || '', selectedDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employee = mockEmployees.find(emp => emp.id === e.target.value);
    setSelectedEmployee(employee || null);
  };

  // Utility to check if a date is in the past (to block past dates)
  const isPastDate = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
  };

  return (
    <div>
      <H4>Select Employee and Date</H4>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <Select onChange={handleEmployeeChange}>
          {mockEmployees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </Select>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]} // Block past dates
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <H4>Available Slots on {selectedDate}</H4>
      {isLoading && <P>Loading availability...</P>}
      {error && <P style={{ color: 'red' }}>Error loading slots: {error.message}</P>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {slots && slots.length > 0 ? (
          slots.map((slot, index) => (
            <Button
              key={index}
              onClick={() => onSelectSlot(slot, selectedEmployee!)}
              disabled={!slot.isAvailable}
              className={slot.isAvailable ? 'bg-green-500' : 'bg-red-500'}
              style={{ backgroundColor: slot.isAvailable ? '#4CAF50' : '#F44336' }}
            >
              {new Date(slot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg' })}
            </Button>
          ))
        ) : (
          !isLoading && <P>No slots available for this date and employee.</P>
        )}
      </div>
    </div>
  );
};
