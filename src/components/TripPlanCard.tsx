import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Bot } from 'lucide-react';

interface TripPlanCardProps {
  tripPlan: {
    icon: string;
    title: string;
    description: string;
    activities: string;
    summary?: string;
  };
}

export function TripPlanCard({ tripPlan }: TripPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card style={{direction:'ltr'}} className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-4 relative overflow-hidden">
      {/* Collapsed State - Fixed 100px height */}
      <div className={`transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-[100px]'}`}>
        {/* AI Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            <Bot className="h-3 w-3 mr-1" />
            AI Trip Planner
          </Badge>
        </div>

        {/* Main Trip Plan Info */}
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{tripPlan.icon}</div>
          <div className="flex-1">
            <div className="text-lg font-semibold">{tripPlan.title}</div>
            <div className="text-sm text-muted-foreground">{tripPlan.description}</div>
          </div>
        </div>

        {/* AI Activities Text - Truncated in collapsed state */}
        <div style={{'padding': '0 0 0 15px'}} className={`text-sm text-gray-700 leading-relaxed pr-15 ${!isExpanded ? 'line-clamp-2' : ''}`}>
          {tripPlan.activities}
        </div>

        {/* Expandable AI Summary */}
        {tripPlan.summary && (
          <div className={`mt-3 ${!isExpanded ? 'hidden' : ''}`}>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {tripPlan.summary}
              </div>
            </div>
          </div>
        )}

        {/* AI Powered Footer */}
        <div className="text-xs text-center text-green-600 pt-2 border-t border-green-100 mt-3">
          🤖 נוצר עבורך ע״י AI
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <Button
        style={{direction:'rtl'}}
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute bottom-2 right-2 text-green-700 hover:text-green-800 hover:bg-green-50 p-1 h-6 w-6 ${!tripPlan.summary ? 'hidden' : ''}`}
      >
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </Card>
  );
}
