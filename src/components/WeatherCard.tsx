import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Bot } from 'lucide-react';

interface WeatherCardProps {
  weather: {
    icon: string;
    temperature: number;
    condition: string;
    forecast: string;
    summary?: string;
  };
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card style={{direction:'ltr'}} className="w-full bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 p-4 relative overflow-hidden">
      {/* Collapsed State - Fixed 100px height */}
      <div className={`transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-[100px]'}`}>
        {/* AI Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            <Bot className="h-3 w-3 mr-1" />
            AI Forecast
          </Badge>
        </div>

        {/* Main Weather Info */}
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{weather.icon}</div>
          <div className="flex-1">
            <div className="text-lg font-semibold">{weather.temperature}°C</div>
            <div className="text-sm text-muted-foreground">{weather.condition}</div>
          </div>
        </div>

        {/* AI Forecast Text - Truncated in collapsed state */}
        <div style={{'padding': '0 0 0 15px'}} className={`text-sm text-gray-700 leading-relaxed pr-15 ${!isExpanded ? 'line-clamp-2' : ''}`}>
          {weather.forecast}
        </div>

        {/* Expandable AI Summary */}
        {weather.summary && (
          <div className={`mt-3 ${!isExpanded ? 'hidden' : ''}`}>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {weather.summary}
              </div>
            </div>
          </div>
        )}

        {/* AI Powered Footer */}
        <div className="text-xs text-center text-purple-600 pt-2 border-t border-purple-100 mt-3">
          🤖 נוצר עבורך ע״י AI
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <Button
        style={{direction:'rtl'}}
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute bottom-2 right-2 text-purple-700 hover:text-purple-800 hover:bg-purple-50 p-1 h-6 w-6 ${!weather.summary ? 'hidden' : ''}`}
      >
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </Card>
  );
}
