import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface CreateTripDialogProps {
  onCreateTrip: (title: string, startDate: string, endDate: string, currency: string) => void;
}

const CURRENCIES = [
  { code: 'ILS', name: 'שקל ישראלי' },
  { code: 'USD', name: 'דולר אמריקני' },
  { code: 'EUR', name: 'יורו' },
  { code: 'GBP', name: 'לירה שטרלינג' },
  { code: 'JPY', name: 'ין יפני' },
  { code: 'CAD', name: 'דולר קנדי' },
  { code: 'AUD', name: 'דולר אוסטרלי' },
];

export function CreateTripDialog({ onCreateTrip }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currency, setCurrency] = useState('ILS');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !startDate || !endDate) {
      return;
    }
    
    if (new Date(endDate) < new Date(startDate)) {
      return;
    }
    
    onCreateTrip(title.trim(), startDate, endDate, currency);
    
    // Reset form
    setTitle('');
    setStartDate('');
    setEndDate('');
    setCurrency('ILS');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="xl">
          <Plus className="h-5 w-5" />
          צור טיול חדש
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>צור טיול חדש</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">כותרת הטיול</Label>
            <Input
              id="title"
              placeholder="לדוגמה: הרפתקה אירופאית 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">תאריך התחלה</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">תאריך סיום</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">מטבע</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button type="submit">
              צור טיול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}