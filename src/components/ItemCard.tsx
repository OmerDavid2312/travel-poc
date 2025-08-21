import React from 'react';
import { TripItem } from '@/types/trip';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plane, Building, MapPin, Edit, Trash2 } from 'lucide-react';

interface ItemCardProps {
  item: TripItem;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePaid: () => void;
}

const ITEM_ICONS = {
  flight: Plane,
  hotel: Building,
  activity: MapPin
};

export function ItemCard({ item, currency, onEdit, onDelete, onTogglePaid }: ItemCardProps) {
  const Icon = ITEM_ICONS[item.type];
  
  // Calculate price per night for hotels
  const calculatePricePerNight = () => {
    if (item.type !== 'hotel' || !item.dateTo) return null;
    
    const startDate = new Date(item.dateFrom);
    const endDate = new Date(item.dateTo);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return null;
    
    return item.price / nights;
  };
  
  const pricePerNight = calculatePricePerNight();
  
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${item.type}/10 text-${item.type}`}>
          <Icon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{item.title}</h4>
            {item.provider && (
              <Badge variant="outline" className="text-xs">
                {item.provider}
              </Badge>
            )}
            {pricePerNight && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                {formatCurrency(pricePerNight, currency)} ללילה
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {formatDate(item.dateFrom)}
            {item.dateTo && item.dateTo !== item.dateFrom && (
              <> - {formatDate(item.dateTo)}</>
            )}
          </div>
          {item.payer && (
          <div className="text-xs text-muted-foreground">
            משלם: {item.payer}
          </div>
          )}
          
          {item.flightNumber && (
            <div className="text-xs text-muted-foreground">
              טיסה: {item.flightNumber}
            </div>
          )}
          
          {item.bookingReference && (
            <div className="text-xs text-muted-foreground">
              אסמכתא: {item.bookingReference}
            </div>
          )}
          
          {item.note && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {item.note}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium text-sm">
              {formatCurrency(item.price, currency)}
            </div>
            {item.paidAmount > 0 && item.paidAmount < item.price && (
              <div className="text-xs text-muted-foreground">
                שולם: {formatCurrency(item.paidAmount, currency)}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={item.paid}
                onCheckedChange={onTogglePaid}
                className="scale-75"
              />
              <span className={`text-xs ${item.paid ? 'text-success' : item.paidAmount > 0 ? 'text-warning' : 'text-warning'}`}>
                {item.paid ? 'שולם' : item.paidAmount > 0 ? 'שולם חלקית' : 'לא שולם'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}