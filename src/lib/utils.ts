import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('he-IL', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.toDateString() === end.toDateString()) {
    return formatDate(startDate);
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function migrateTripData(trip: any): any {
  if (!trip || !trip.cities) return trip;
  
  const migratedTrip = { ...trip };
  migratedTrip.cities = trip.cities.map((city: any) => ({
    ...city,
    items: city.items.map((item: any) => ({
      ...item,
      paidAmount: item.paidAmount !== undefined ? item.paidAmount : (item.paid ? item.price : 0)
    }))
  }));
  
  return migratedTrip;
}
