import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface AddCityDialogProps {
  onAddCity: (name: string, startDate: string, endDate: string) => void;
}

export function AddCityDialog({ onAddCity }: AddCityDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !startDate || !endDate) {
      return;
    }
    
    if (new Date(endDate) < new Date(startDate)) {
      return;
    }
    
    onAddCity(name.trim(), startDate, endDate);
    
    // Reset form
    setName('');
    setStartDate('');
    setEndDate('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <MapPin className="h-4 w-4" />
          הוסף עיר
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>הוסף עיר חדשה</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cityName">שם העיר</Label>
            <Input
              id="cityName"
              placeholder="לדוגמה: פריז, טוקיו, ניו יורק"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cityStartDate">תאריך הגעה</Label>
              <Input
                id="cityStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cityEndDate">תאריך יציאה</Label>
              <Input
                id="cityEndDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button type="submit">
              הוסף עיר
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}