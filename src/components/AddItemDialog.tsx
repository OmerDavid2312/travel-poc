import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TripItem, TripItemType } from '@/types/trip';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: Omit<TripItem, 'id'>) => void;
  editItem?: TripItem;
}

export function AddItemDialog({ open, onOpenChange, onAddItem, editItem }: AddItemDialogProps) {
  const [type, setType] = useState<TripItemType>(editItem?.type || 'activity');
  const [title, setTitle] = useState(editItem?.title || '');
  const [provider, setProvider] = useState(editItem?.provider || '');
  const [dateFrom, setDateFrom] = useState(editItem?.dateFrom?.split('T')[0] || '');
  const [dateTo, setDateTo] = useState(editItem?.dateTo?.split('T')[0] || '');
  const [price, setPrice] = useState(editItem?.price?.toString() || '');
  const [paid, setPaid] = useState(editItem?.paid || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dateFrom || !price) {
      return;
    }
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return;
    }
    
    const item: Omit<TripItem, 'id'> = {
      type,
      title: title.trim(),
      provider: provider.trim() || undefined,
      dateFrom: new Date(dateFrom).toISOString(),
      dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
      price: priceNum,
      paid
    };

    // Add type-specific properties
    if (type === 'flight' && provider) {
      item.flightNumber = `${provider}-${Math.floor(Math.random() * 9999)}`;
    }
    
    if (type === 'hotel') {
      item.name = title;
    }

    onAddItem(item);
    
    // Reset form
    setType('activity');
    setTitle('');
    setProvider('');
    setDateFrom('');
    setDateTo('');
    setPrice('');
    setPaid(false);
    onOpenChange(false);
  };

  const isEditing = !!editItem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'עריכת פריט' : 'הוספת פריט חדש'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">סוג פריט</Label>
            <Select value={type} onValueChange={(value: TripItemType) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">טיסה</SelectItem>
                <SelectItem value="hotel">בית מלון</SelectItem>
                <SelectItem value="activity">פעילות / הוצאה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">כותרת</Label>
            <Input
              id="title"
              placeholder={
                type === 'flight' ? 'לדוגמה: טיסה לפריז' :
                type === 'hotel' ? 'לדוגמה: מלון גרנד פלאזה' :
                'לדוגמה: ביקור במוזיאון'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provider">
              {type === 'flight' ? 'חברת תעופה' : type === 'hotel' ? 'רשת מלונות' : 'ספק'} (אופציונלי)
            </Label>
            <Input
              id="provider"
              placeholder={
                type === 'flight' ? 'לדוגמה: אל על' :
                type === 'hotel' ? 'לדוגמה: מריוט' :
                'לדוגמה: מדריך טיולים מקומי'
              }
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">
                {type === 'activity' ? 'תאריך' : 'מתאריך'}
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                required
              />
            </div>
            
            {type !== 'activity' && (
              <div className="space-y-2">
                <Label htmlFor="dateTo">עד תאריך</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  min={dateFrom}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">מחיר</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="paid"
              checked={paid}
              onCheckedChange={(checked) => setPaid(checked as boolean)}
            />
            <Label htmlFor="paid">כבר שולם</Label>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit">
              {isEditing ? 'עדכן פריט' : 'הוסף פריט'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}