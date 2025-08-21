import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trip } from '@/types/trip';
import { fetchMoneySavingTip, MoneySavingTip } from '@/lib/moneySavingTips';
import { SHOW_AI_FEATURES } from '@/lib/config';

// Fallback tips in case API fails
const fallbackTips = [
  "לבדוק עמלות אשראי לפני הנסיעה",
  "לבדוק מסגרת אשראי זמינה",
  "לבדוק מקום להמיר כסף במחירים טובים",
  "להזמין טיסות מראש לקבלת מחירים טובים יותר",
  "לשקול לינה באכסניות או דירות להשכרה",
  "להשתמש בתחבורה ציבורית במקום מוניות",
  "לקנות כרטיסים לאטרקציות מראש באינטרנט",
  "לבדוק אם יש הנחות לסטודנטים או אזרחים ותיקים",
  "להביא אוכל מהבית במקום לאכול בחוץ",
  "לשקול ביטוח נסיעות מקיף",
  "לבדוק אם יש כרטיסי תייר שמקנים הנחות",
  "להשתמש באפליקציות להשוואת מחירים",
  "לשקול נסיעה בעונה הנמוכה",
  "לבדוק אם יש הנחות על כרטיסי רכבת",
  "להביא בקבוק מים ריק ולמלא במקום לקנות"
];

interface MoneySavingTooltipProps {
  isVisible: boolean;
  onClose: () => void;
  trip?: Trip; // Add trip prop to get cities and dates
}

export function MoneySavingTooltip({ isVisible, onClose, trip }: MoneySavingTooltipProps) {
  const [currentTip, setCurrentTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiTip, setApiTip] = useState<string>('');

  useEffect(() => {
    if (isVisible && trip) {
      fetchMoneySavingTipData();
    } else if (isVisible && !trip) {
      // Fallback to random tip if no trip data
      const randomIndex = Math.floor(Math.random() * fallbackTips.length);
      setCurrentTip(fallbackTips[randomIndex]);
    }
  }, [isVisible, trip]);

  const fetchMoneySavingTipData = async () => {
    if (!trip) return;
    
    if (!SHOW_AI_FEATURES) {
      // Use fallback tips when AI features are disabled
      const randomIndex = Math.floor(Math.random() * fallbackTips.length);
      setCurrentTip(fallbackTips[randomIndex]);
      return;
    }
    
    setIsLoading(true);
    try {
      // Build query parameters
      const cities = trip.cities.map(city => city.name).join(',');
      
      const data = await fetchMoneySavingTip(cities, trip.title, trip.startDate, trip.endDate);
      setApiTip(data.tip);
      setCurrentTip(data.tip);
    } catch (error) {
      console.error('Failed to fetch money saving tip:', error);
      // Fallback to random tip if API fails
      const randomIndex = Math.floor(Math.random() * fallbackTips.length);
      setCurrentTip(fallbackTips[randomIndex]);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show tooltip if not visible or if we're loading and don't have a tip yet
  if (!isVisible || (isLoading && !currentTip)) return null;

  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg p-4 max-w-md">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4 text-yellow-600" />
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
              טיפ לחיסכון
            </Badge>
            {apiTip && (
              <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                AI
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {isLoading ? 'מחפש טיפים לחיסכון...' : currentTip}
          </p>
          <div className="text-xs text-yellow-600 text-center">
            {apiTip ? '🤖 טיפ חכם מבינה מלאכותית' : '💡 טיפ יומי לחיסכון בנסיעה'}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex-shrink-0 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
