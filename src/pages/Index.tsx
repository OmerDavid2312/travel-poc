import React from 'react';
import { TripProvider } from '@/context/TripContext';
import { TripManager } from '@/components/TripManager';

const Index = () => {
  return (
    <TripProvider>
      <TripManager />
    </TripProvider>
  );
};

export default Index;
