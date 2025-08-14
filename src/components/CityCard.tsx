import React from 'react';
import { CityStay, TripItem } from '@/types/trip';
import { formatDateRange, formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ItemCard } from './ItemCard';
import { MapPin, Plus, Thermometer } from 'lucide-react';

interface CityCardProps {
  city: CityStay;
  currency: string;
  onAddItem: (cityId: string) => void;
  onEditItem: (cityId: string, item: TripItem) => void;
  onDeleteItem: (cityId: string, itemId: string) => void;
  onTogglePaid: (cityId: string, itemId: string) => void;
}

export function CityCard({ 
  city, 
  currency, 
  onAddItem, 
  onEditItem, 
  onDeleteItem, 
  onTogglePaid 
}: CityCardProps) {
  const totalPlanned = city.items.reduce((sum, item) => sum + item.price, 0);
  const totalPaid = city.items.reduce((sum, item) => sum + (item.paid ? item.price : 0), 0);
  
  const groupedItems = {
    flight: city.items.filter(item => item.type === 'flight'),
    hotel: city.items.filter(item => item.type === 'hotel'),
    activity: city.items.filter(item => item.type === 'activity')
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">{city.name}</h3>
            {city.weather && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{city.weather.icon}</span>
                <span>{city.weather.temperature}°C</span>
                <span>{city.weather.condition}</span>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground mb-3">
            {formatDateRange(city.startDate, city.endDate)}
          </div>
          <div className="flex gap-4 text-sm">
            <span>תקציב: {formatCurrency(totalPlanned, currency)}</span>
            <span className="text-success">שולם: {formatCurrency(totalPaid, currency)}</span>
            <span className="text-warning">נותר: {formatCurrency(totalPlanned - totalPaid, currency)}</span>
          </div>
        </div>
        
        <Button 
          size="sm" 
          onClick={() => onAddItem(city.id)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          הוסף פריט
        </Button>
      </div>

      {/* Items by category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([type, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={type as any} className="capitalize">
                  {type === 'flight' ? 'טיסות' : type === 'hotel' ? 'מלונות' : 'פעילויות'} ({items.length})
                </Badge>
              </div>
              <div className="grid gap-2">
                {items.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    currency={currency}
                    onEdit={() => onEditItem(city.id, item)}
                    onDelete={() => onDeleteItem(city.id, item.id)}
                    onTogglePaid={() => onTogglePaid(city.id, item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
        
        {city.items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>עדיין לא נוספו פריטים.</p>
            <p className="text-sm">לחץ "הוסף פריט" כדי להתחיל לתכנן!</p>
          </div>
        )}
      </div>
    </Card>
  );
}