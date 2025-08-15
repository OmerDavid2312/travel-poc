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
    <Card className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-4 space-y-3">
      {/* AI Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          <Bot className="h-3 w-3 mr-1" />
          AI Trip Planner
        </Badge>
      </div>

      {/* Main Trip Plan Info */}
      <div className="flex items-center gap-3">
        <div className="text-3xl">{tripPlan.icon}</div>
        <div className="flex-1">
          <div className="text-lg font-semibold">{tripPlan.title}</div>
          <div className="text-sm text-muted-foreground">{tripPlan.description}</div>
        </div>
      </div>

      {/* AI Activities Text */}
      <div className="text-sm text-gray-700 leading-relaxed">
        {tripPlan.activities}
      </div>

      {/* Expandable AI Summary */}
      {tripPlan.summary && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between text-green-700 hover:text-green-800 hover:bg-green-50"
          >
            <span className="text-sm">תכנון מפורט מ-AI</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {isExpanded && (
            <div className="mt-3 p-3 bg-white/50 rounded-lg">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {tripPlan.summary}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Powered Footer */}
      <div className="text-xs text-center text-green-600 pt-2 border-t border-green-100">
        🤖 נוצר עבורך ע״י AI
      </div>
    </Card>
  );
}
