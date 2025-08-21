import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  Copy, 
  FileText, 
  Calendar, 
  MapPin, 
  CreditCard,
  MoreVertical
} from 'lucide-react';
import { Trip } from '@/types/trip';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TripHeaderProps {
  trip: Trip;
  budget: {
    totalPlanned: number;
    totalPaid: number;
    totalUnpaid: number;
  };
}

export function TripHeader({ trip, budget }: TripHeaderProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const formatTripForExport = (format: 'text' | 'json' | 'csv') => {
    const tripData = {
      title: trip.title,
      dates: `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`,
      currency: trip.currency,
      budget: {
        totalPlanned: formatCurrency(budget.totalPlanned, trip.currency),
        totalPaid: formatCurrency(budget.totalPaid, trip.currency),
        totalUnpaid: formatCurrency(budget.totalUnpaid, trip.currency)
      },
      cities: trip.cities.map(city => ({
        name: city.name,
        dates: `${formatDate(city.startDate)} - ${formatDate(city.endDate)}`,
        items: city.items.map(item => ({
          type: item.type === 'flight' ? 'טיסה' : item.type === 'hotel' ? 'מלון' : 'פעילות',
          title: item.title,
          provider: item.provider || '',
          dates: `${formatDate(item.dateFrom)}${item.dateTo ? ` - ${formatDate(item.dateTo)}` : ''}`,
          price: formatCurrency(item.price, trip.currency),
          paid: item.paid ? 'שולם' : item.paidAmount > 0 ? 'שולם חלקית' : 'לא שולם',
          paidAmount: formatCurrency(item.paidAmount, trip.currency),
          payer: item.payer,
          bookingReference: item.bookingReference || '',
          note: item.note || ''
        }))
      }))
    };

    switch (format) {
      case 'text':
        return formatAsText(tripData);
      case 'json':
        return JSON.stringify(tripData, null, 2);
      case 'csv':
        return formatAsCSV(tripData);
      default:
        return formatAsText(tripData);
    }
  };

  const formatAsText = (tripData: any) => {
    let text = `🗺️ ${tripData.title}\n`;
    text += `📅 ${tripData.dates}\n`;
    text += `💰 תקציב: ${tripData.budget.totalPlanned} (שולם: ${tripData.budget.totalPaid}, נותר: ${tripData.budget.totalUnpaid})\n\n`;
    
    tripData.cities.forEach((city: any) => {
      text += `🏙️ ${city.name} (${city.dates})\n`;
      city.items.forEach((item: any) => {
        text += `  • ${item.type}: ${item.title}`;
        if (item.provider) text += ` (${item.provider})`;
        text += ` - ${item.price} (${item.paid})`;
        if (item.payer) text += ` - משלם: ${item.payer}`;
        text += '\n';
      });
      text += '\n';
    });
    
    return text;
  };

  const formatAsCSV = (tripData: any) => {
    let csv = 'Type,Title,Provider,Dates,Price,Status,Paid Amount,Payer,Booking Reference,Note\n';
    
    tripData.cities.forEach((city: any) => {
      city.items.forEach((item: any) => {
        csv += `"${item.type}","${item.title}","${item.provider}","${item.dates}","${item.price}","${item.paid}","${item.paidAmount}","${item.payer}","${item.bookingReference}","${item.note}"\n`;
      });
    });
    
    return csv;
  };

  const copyToClipboard = async (format: 'text' | 'json' | 'csv') => {
    try {
      setIsExporting(true);
      let data: string;
      
      if (format === 'json') {
        // Get raw trip data from localStorage for JSON export
        const rawTripData = localStorage.getItem(`tripmanager:userless:${trip.id}`);
        if (rawTripData) {
          data = rawTripData;
        } else {
          throw new Error('Trip data not found');
        }
      } else {
        data = formatTripForExport(format);
      }
      
      await navigator.clipboard.writeText(data);
      
      toast({
        title: "הועתק בהצלחה",
        description: `פרטי הטיול הועתקו ללוח ${format === 'text' ? 'כטקסט' : format === 'json' ? 'כ-JSON' : 'כ-CSV'}.`
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן להעתיק את פרטי הטיול. נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (format: 'text' | 'json' | 'csv') => {
    try {
      setIsExporting(true);
      const data = formatTripForExport(format);
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : format === 'csv' ? 'text/csv' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${trip.title.replace(/[^a-zA-Z0-9]/g, '_')}_trip_details.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "הורדה הושלמה",
        description: `קובץ הטיול הורד בהצלחה.`
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן להוריד את הקובץ. נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isExporting}>
              <MoreVertical className="h-4 w-4 mr-2" />
              ייצא טיול
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => copyToClipboard('text')} disabled={isExporting}>
              <Copy className="h-4 w-4 mr-2" />
              העתק כטקסט
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyToClipboard('json')} disabled={isExporting}>
              <Copy className="h-4 w-4 mr-2" />
              העתק כ-JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyToClipboard('csv')} disabled={isExporting}>
              <Copy className="h-4 w-4 mr-2" />
              העתק כ-CSV
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => downloadFile('text')} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              הורד כטקסט
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadFile('json')} disabled={isExporting}>
              <FileText className="h-4 w-4 mr-2" />
              הורד כ-JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadFile('csv')} disabled={isExporting}>
              <FileText className="h-4 w-4 mr-2" />
              הורד כ-CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="grid grid-cols-3 gap-4 min-w-0 lg:min-w-96">
          <Card className="p-4 bg-card-elevated border-0 text-center">
            <div className="text-sm text-muted-foreground mb-1">סך מתוכנן</div>
            <div className="text-lg font-semibold text-foreground">
              {formatCurrency(budget.totalPlanned, trip.currency)}
            </div>
          </Card>
          
          <Card className="p-4 bg-card-elevated border-0 text-center">
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

        <div className="text-right">
          <div className="flex items-center gap-3 mb-2 justify-end">
            <h1 className="text-2xl font-bold">{trip.title}</h1>
            <Badge variant="outline" className="text-sm">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground justify-end">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
                             <span>{trip.cities.length} יעדים</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{trip.cities.reduce((total, city) => total + city.items.length, 0)} פריטים</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}