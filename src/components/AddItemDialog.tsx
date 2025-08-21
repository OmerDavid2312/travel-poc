import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { TripItem, TripItemType } from '@/types/trip';
import { formatCurrency } from '@/lib/utils';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: Omit<TripItem, 'id'>) => void;
  editItem?: TripItem;
  existingPayers?: string[]; // List of existing payer names from the trip
}

export function AddItemDialog({ open, onOpenChange, onAddItem, editItem, existingPayers = [] }: AddItemDialogProps) {
  const [type, setType] = useState<TripItemType>(editItem?.type || 'activity');
  const [title, setTitle] = useState(editItem?.title || '');
  const [provider, setProvider] = useState(editItem?.provider || '');
  const [dateFrom, setDateFrom] = useState(editItem?.dateFrom?.split('T')[0] || '');
  const [dateTo, setDateTo] = useState(editItem?.dateTo?.split('T')[0] || '');
  const [price, setPrice] = useState(editItem?.price?.toString() || '');
  const [paid, setPaid] = useState(editItem?.paid || false);
  const [paidAmount, setPaidAmount] = useState(editItem?.paidAmount?.toString() || '0');
  const [bookingReference, setBookingReference] = useState(editItem?.bookingReference || '');
  const [bookingSource, setBookingSource] = useState(editItem?.bookingSource || '');
  const [note, setNote] = useState(editItem?.note || '');
  const [payer, setPayer] = useState(editItem?.payer || 'Me');
  const [customPayer, setCustomPayer] = useState('');
  const [showCustomPayer, setShowCustomPayer] = useState(false);

  // Update form fields when editItem changes
  useEffect(() => {
    if (editItem) {
      setType(editItem.type);
      setTitle(editItem.title);
      setProvider(editItem.provider || '');
      setDateFrom(editItem.dateFrom?.split('T')[0] || '');
      setDateTo(editItem.dateTo?.split('T')[0] || '');
      setPrice(editItem.price?.toString() || '');
      setPaid(editItem.paid || false);
      setPaidAmount(editItem.paidAmount?.toString() || '0');
      setBookingReference(editItem.bookingReference || '');
      setBookingSource(editItem.bookingSource || '');
      setNote(editItem.note || '');
      setPayer(editItem.payer || 'Me');
      setShowCustomPayer(false);
      setCustomPayer('');
    } else {
      // Reset form when not editing
      setType('activity');
      setTitle('');
      setProvider('');
      setDateFrom('');
      setDateTo('');
      setPrice('');
      setPaid(false);
      setPaidAmount('0');
      setBookingReference('');
      setBookingSource('');
      setNote('');
      setPayer('Me');
      setShowCustomPayer(false);
      setCustomPayer('');
    }
  }, [editItem]);

  // Handle paid checkbox change
  const handlePaidChange = (checked: boolean) => {
    setPaid(checked);
    if (checked) {
      // If marking as paid, set paidAmount to full price
      setPaidAmount(price || '0');
    } else {
      // If unmarking as paid, reset paidAmount to 0
      setPaidAmount('0');
    }
  };

  // Handle paidAmount change
  const handlePaidAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const priceNum = parseFloat(price) || 0;
    
    // Ensure paidAmount doesn't exceed price
    if (numValue > priceNum) {
      setPaidAmount(priceNum.toString());
    } else {
      setPaidAmount(value);
    }
    
    // Update paid status based on whether full amount is paid
    setPaid(numValue >= priceNum && priceNum > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dateFrom || !price) {
      return;
    }
    
    const priceNum = parseFloat(price);
    const paidAmountNum = parseFloat(paidAmount) || 0;
    
    if (isNaN(priceNum) || priceNum < 0) {
      return;
    }
    
    if (paidAmountNum > priceNum) {
      return;
    }
    
    const item: Omit<TripItem, 'id'> = {
      type,
      title: title.trim(),
      provider: provider.trim() || undefined,
      dateFrom: new Date(dateFrom).toISOString(),
      dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
      price: priceNum,
      paid: paidAmountNum >= priceNum && priceNum > 0,
      paidAmount: paidAmountNum,
      payer: showCustomPayer ? customPayer.trim() : payer.trim(),
      bookingReference: bookingReference.trim() || undefined,
      bookingSource: bookingSource.trim() || undefined,
      note: note.trim() || undefined
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
    setPaidAmount('0');
    setBookingReference('');
    setBookingSource('');
    setNote('');
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
          
          <div className="space-y-2">
            <Label htmlFor="paidAmount">סכום שולם (אופציונלי)</Label>
            <Input
              id="paidAmount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={paidAmount}
              onChange={(e) => handlePaidAmountChange(e.target.value)}
            />
            {parseFloat(price) > 0 && (
              <div className="text-xs text-muted-foreground">
                מקסימום: {formatCurrency(parseFloat(price) || 0, 'ILS')}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              לדוגמה: אם המחיר 4500 ₪ ושילמת 1000 ₪, הכנס 1000
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payer">מי משלם</Label>
            <div className="space-y-2">
              <Select 
                value={showCustomPayer ? 'custom' : payer} 
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setShowCustomPayer(true);
                    setPayer('custom');
                  } else {
                    setShowCustomPayer(false);
                    setPayer(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר משלם" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Me">Me</SelectItem>
                  {existingPayers
                    .filter(p => p !== 'Me')
                    .map(payerName => (
                      <SelectItem key={payerName} value={payerName}>
                        {payerName}
                      </SelectItem>
                    ))}
                  <SelectItem value="custom">+ הוסף משלם חדש</SelectItem>
                </SelectContent>
              </Select>
              
              {showCustomPayer && (
                <Input
                  placeholder="הקלד שם המשלם"
                  value={customPayer}
                  onChange={(e) => setCustomPayer(e.target.value)}
                  required
                />
              )}
            </div>
          </div>
          
          {(type === 'flight' || type === 'hotel') && (
            <div className="space-y-2">
              <Label htmlFor="bookingReference">אסמכתא הזמנה (אופציונלי)</Label>
              <Input
                id="bookingReference"
                placeholder={
                  type === 'flight' ? 'לדוגמה: ABC123, PNR: XYZ789' :
                  'לדוגמה: CNF123456, אסמכתא: AB789CD'
                }
                value={bookingReference}
                onChange={(e) => setBookingReference(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="bookingSource">מקור ההזמנה (אופציונלי)</Label>
            <Input
              id="bookingSource"
              placeholder={
                type === 'flight' ? 'לדוגמה: אתר אל על, Expedia' :
                type === 'hotel' ? 'לדוגמה: Booking.com, Agoda' :
                'לדוגמה: Viator, סוכן מקומי'
              }
              value={bookingSource}
              onChange={(e) => setBookingSource(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">הערות (אופציונלי)</Label>
            <Textarea
              id="note"
              placeholder="הוסף הערות נוספות על הפריט..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="paid"
              checked={paid}
              onCheckedChange={handlePaidChange}
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