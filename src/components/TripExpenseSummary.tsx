import { Card } from '@/components/ui/card';
import { Hotel, Plane, MapPin } from 'lucide-react';
import { Trip } from '@/types/trip';
import { formatCurrency } from '@/lib/utils';

interface TripExpenseSummaryProps {
  trip: Trip;
}

export function TripExpenseSummary({ trip }: TripExpenseSummaryProps) {
  // Get all items from all cities
  const allItems = trip.cities.flatMap(city => city.items);
  
  const hotels = allItems.filter(item => item.type === 'hotel');
  const flights = allItems.filter(item => item.type === 'flight');
  const activities = allItems.filter(item => item.type === 'activity');

  const hotelTotal = hotels.reduce((sum, item) => sum + item.price, 0);
  const flightTotal = flights.reduce((sum, item) => sum + item.price, 0);
  const activityTotal = activities.reduce((sum, item) => sum + item.price, 0);

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">סיכום הוצאות הטיול</h3>
      <div className="space-y-4">
        {/* Hotels */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Hotel className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-800">מלונות</div>
              <div className="text-xs text-blue-600">{hotels.length} פריטים</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-blue-800">
              {formatCurrency(hotelTotal, trip.currency)}
            </div>
          </div>
        </div>

        {/* Flights */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <Plane className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-800">טיסות</div>
              <div className="text-xs text-purple-600">{flights.length} פריטים</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-purple-800">
              {formatCurrency(flightTotal, trip.currency)}
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-green-800">פעילויות</div>
              <div className="text-xs text-green-600">{activities.length} פריטים</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-green-800">
              {formatCurrency(activityTotal, trip.currency)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
