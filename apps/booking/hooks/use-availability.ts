// apps/booking/hooks/use-availability.ts

import { useState, useEffect } from 'react';
import { Slot } from '@/apps/booking/lib/supersaas-client';

// Mock implementation of a React Query-like hook
export const useAvailability = (employeeId: string, date: string) => {
  const [data, setData] = useState<Slot[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!employeeId || !date) return;

    const fetchAvailability = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, this would be a fetch call to /api/availability
        const response = await fetch(`/api/availability?employeeId=${employeeId}&date=${date}`);
        if (!response.ok) {
          throw new Error('Failed to fetch availability');
        }
        const json: Slot[] = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [employeeId, date]);

  return { data, isLoading, error };
};
