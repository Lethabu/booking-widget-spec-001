// apps/booking/components/service-selector.tsx
// Using simulated shadcn/ui components

import React from 'react';

// Simulated Service type based on seed data
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

const mockServices: Service[] = [
  { id: 'svc-1', name: 'Middle & Side Installation', price: 300, duration: 60 },
  { id: 'svc-2', name: 'Maphondo & Lines Installation', price: 350, duration: 60 },
  { id: 'svc-3', name: 'Soft Glam Makeup', price: 450, duration: 120 },
  { id: 'svc-4', name: 'Gel Maphondo Styling', price: 350, duration: 120 },
  { id: 'svc-5', name: 'Frontal Ponytail Installation', price: 950, duration: 120 },
];

interface ServiceSelectorProps {
  onSelectService: (service: Service) => void;
  selectedServiceId: string | null;
}

// Simulated shadcn/ui components
const Card = ({ children, onClick, className = '' }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
  <div
    onClick={onClick}
    style={{ border: '1px solid #ccc', padding: '16px', margin: '8px', cursor: onClick ? 'pointer' : 'default' }}
    className={className}
  >
    {children}
  </div>
);
const H4 = ({ children }: { children: React.ReactNode }) => <h4 style={{ margin: '0 0 8px 0' }}>{children}</h4>;
const P = ({ children }: { children: React.ReactNode }) => <p style={{ margin: '4px 0', fontSize: '0.9em' }}>{children}</p>;

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onSelectService, selectedServiceId }) => {
  return (
    <div>
      <H4>Select a Service</H4>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {mockServices.map((service) => (
          <Card
            key={service.id}
            onClick={() => onSelectService(service)}
            className={selectedServiceId === service.id ? 'selected' : ''}
            style={{ backgroundColor: selectedServiceId === service.id ? '#e0f7fa' : 'white' }}
          >
            <H4>{service.name}</H4>
            <P>R{service.price} - {service.duration} min</P>
          </Card>
        ))}
      </div>
    </div>
  );
};
