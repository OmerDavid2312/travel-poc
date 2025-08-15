import React, { useState, useEffect } from 'react';
import { CityStay, TripItem } from '@/types/trip';
import { formatDateRange, formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ItemCard } from './ItemCard';
import { WeatherCard } from './WeatherCard';
import { TripPlanCard } from './TripPlanCard';
import { fetchWeatherData } from '@/lib/weather';
import { fetchTripPlanData } from '@/lib/tripPlan';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { MapPin, Plus, Trash2 } from 'lucide-react';

interface CityCardProps {
  city: CityStay;
  currency: string;
  tripName: string;
  onAddItem: (cityId: string) => void;
  onEditItem: (cityId: string, item: TripItem) => void;
  onDeleteItem: (cityId: string, itemId: string) => void;
  onTogglePaid: (cityId: string, itemId: string) => void;
  onDeleteCity: (cityId: string) => void;
}

export function CityCard({ 
  city, 
  currency, 
  tripName,
  onAddItem, 
  onEditItem, 
  onDeleteItem, 
  onTogglePaid,
  onDeleteCity 
}: CityCardProps) {
  const [weatherData, setWeatherData] = useState(city.weather);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [tripPlanData, setTripPlanData] = useState<any>(undefined);
  const [isLoadingTripPlan, setIsLoadingTripPlan] = useState(false);

  const totalPlanned = city.items.reduce((sum, item) => sum + item.price, 0);
  const totalPaid = city.items.reduce((sum, item) => sum + (item.paid ? item.price : 0), 0);

  // Load weather data when component mounts
  useEffect(() => {
    const loadWeather = async () => {
      if (!city.weather) {
        setIsLoadingWeather(true);
        try {
          const weather = await fetchWeatherData(city.name, tripName, city.startDate, city.endDate);
          setWeatherData(weather);
        } catch (error) {
          console.error('Failed to load weather:', error);
        } finally {
          setIsLoadingWeather(false);
        }
      }
    };

    loadWeather();
  }, [city.name, tripName, city.startDate, city.endDate, city.weather]);

  // Load trip plan data when component mounts
  useEffect(() => {
    const loadTripPlan = async () => {
      if (!tripPlanData) {
        setIsLoadingTripPlan(true);
        try {
          const tripPlan = await fetchTripPlanData(city.name, tripName, city.startDate, city.endDate);
          setTripPlanData(tripPlan);
        } catch (error) {
          console.error('Failed to load trip plan:', error);
        } finally {
          setIsLoadingTripPlan(false);
        }
      }
    };

    loadTripPlan();
  }, [city.name, tripName, city.startDate, city.endDate, tripPlanData]);
  
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
          </div>
          
          {/* Weather Card */}
          {(weatherData || isLoadingWeather) && (
            <div className="mb-4">
              {isLoadingWeather ? (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-sm text-purple-600">טוען תחזית מזג אוויר...</span>
                  </div>
                </div>
              ) : weatherData ? (
                <WeatherCard weather={weatherData} />
              ) : null}
            </div>
          )}

          {/* Trip Plan Card */}
          {(tripPlanData || isLoadingTripPlan) && (
            <div className="mb-4">
              {isLoadingTripPlan ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span className="text-sm text-green-600">טוען תכנון טיול...</span>
                  </div>
                </div>
              ) : tripPlanData ? (
                <TripPlanCard tripPlan={tripPlanData} />
              ) : null}
            </div>
          )}
          <div className="text-sm text-muted-foreground mb-3">
            {formatDateRange(city.startDate, city.endDate)}
          </div>
          <div className="flex gap-4 text-sm">
            <span>תקציב: {formatCurrency(totalPlanned, currency)}</span>
            <span className="text-success">שולם: {formatCurrency(totalPaid, currency)}</span>
            <span className="text-warning">נותר: {formatCurrency(totalPlanned - totalPaid, currency)}</span>
          </div>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <Button 
            size="sm" 
            onClick={() => onAddItem(city.id)}
          >
            <Plus className="h-4 w-4" />
            הוסף פריט
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>מחק עיר</AlertDialogTitle>
                <AlertDialogDescription>
                  האם אתה בטוח שברצונך למחוק את העיר "{city.name}"? 
                  פעולה זו תמחק גם את כל הפריטים ({city.items.length}) הקשורים לעיר זו ולא ניתן לבטלה.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>ביטול</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDeleteCity(city.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  מחק עיר
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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