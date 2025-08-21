// Trip Manager Core Types

export interface Trip {
  id: string;
  title: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  currency: string;  // e.g., "USD", "EUR"
  cities: CityStay[];
  notes: TripNote[];
  createdAt: string;
  updatedAt: string;
}

export interface CityStay {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  items: TripItem[];
      // Weather data from AI API
    weather?: {
      icon: string;
      temperature: number;
      condition: string;
      forecast: string;
      summary?: string;
    };
}

export type TripItemType = 'flight' | 'hotel' | 'activity';

export interface TripNote {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export interface TripItem {
  id: string;
  type: TripItemType;
  title: string;
  provider?: string;
  dateFrom: string; // ISO date string
  dateTo?: string;  // ISO date string (optional for activities)
  price: number;
  paid: boolean;
  paidAmount: number; // Amount already paid (0 to price)
  payer: string; // Who paid or needs to pay for this item (default: "Me")
  // Type-specific properties
  flightNumber?: string; // for flights
  name?: string;         // for hotels
  // Additional optional properties
  bookingReference?: string; // Found on airline tickets, hotel confirmations, or travel agency documents, often labeled as a booking reference, record locator, or PNR code (for hotel/expense/flight)
  bookingSource?: string;    // The platform or service used to book the item (e.g., Booking.com, Expedia, airline website)
  note?: string;             // User notes about the trip item
}

export interface BudgetSummary {
  totalPlanned: number;
  totalPaid: number;
  totalUnpaid: number;
  byCity: Record<string, {
    cityName: string;
    planned: number;
    paid: number;
    unpaid: number;
  }>;
  byPayer: Record<string, {
    payerName: string;
    planned: number;
    paid: number;
    unpaid: number;
  }>;
}

// CSV Import Types
export interface CSVRow {
  city: string;
  type: string;
  title: string;
  provider?: string;
  dateFrom: string;
  dateTo?: string;
  price: string;
  paid: string;
}

export interface ImportResult {
  success: boolean;
  itemsImported: number;
  errors: string[];
}