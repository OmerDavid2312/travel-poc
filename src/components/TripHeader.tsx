import React from 'react';
import { Trip, BudgetSummary } from '@/types/trip';
import { formatCurrency, formatDateRange } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { CalendarDays, MapPin, Coins } from 'lucide-react';

interface TripHeaderProps {
  trip: Trip;
  budget: BudgetSummary;
}

export function TripHeader({ trip, budget }: TripHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 rounded-lg shadow-lg mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
          <div className="flex items-center gap-4 text-primary-foreground/90">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{trip.cities.length} ערים</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 min-w-0 lg:min-w-96">
          <Card className="p-4 bg-card-elevated border-0 text-center">
            <div className="text-sm text-muted-foreground mb-1">סך מתוכנן</div>
            <div className="text-lg font-semibold text-foreground">
              {formatCurrency(budget.totalPlanned, trip.currency)}
            </div>
          </Card>
          
          <Card  className="p-4 bg-card-elevated border-0 text-center">
            <div className="text-sm text-muted-foreground mb-1">שולם</div>
            <div className="text-lg font-semibold text-success">
              {formatCurrency(budget.totalPaid, trip.currency)}
            </div>
          </Card>
          
          <Card className="p-4 bg-card-elevated border-0 text-center">
            <div className="text-sm text-muted-foreground mb-1">נותר</div>
            <div className="text-lg font-semibold text-warning">
              {formatCurrency(budget.totalUnpaid, trip.currency)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}