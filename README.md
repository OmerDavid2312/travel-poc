# Trip Manager POC

A modern, single-page travel management application built with React, TypeScript, and Tailwind CSS. This POC demonstrates a complete trip planning and budget tracking solution with localStorage persistence.

## 🌟 Features

- **Trip Management**: Create and manage multiple trips with dates and currency
- **City Planning**: Add cities to trips with arrival/departure dates
- **Item Tracking**: Track flights, hotels, and activities with pricing and payment status
- **Budget Overview**: Real-time budget calculations (planned vs paid vs remaining)
- **CSV Import**: Bulk import trip data from CSV files
- **Weather Preview**: Mock weather data for each city (placeholder for future API integration)
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Local Storage**: All data persists in browser localStorage with clear adapter pattern

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with localStorage support

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd trip-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:8080`

### First Steps

1. Click "Create New Trip" to start
2. Add cities to your trip with dates
3. Add flights, hotels, and activities to each city
4. Track your budget and payment status
5. Import additional data using the CSV template

## 📊 CSV Import

Use the provided `trip-import-template.csv` as a guide for importing trip data. The CSV format supports:

- **city**: City name (creates city if it doesn't exist)
- **type**: Item type (flight, hotel, activity)
- **title**: Item title/description
- **provider**: Airline, hotel chain, tour operator, etc. (optional)
- **dateFrom**: Start date (YYYY-MM-DD format)
- **dateTo**: End date (YYYY-MM-DD format, optional for activities)
- **price**: Item cost (numeric)
- **paid**: Payment status (true/false, yes/no, 1/0)

## 🏗️ Architecture

### Storage Adapter Pattern

The application uses a storage adapter pattern to abstract data persistence:

```typescript
// Current localStorage implementation
import { storageAdapter } from '@/storage/localStorage';

// Easy to swap for server-backed storage
// import { storageAdapter } from '@/storage/server';
```

### Key Components

- **TripContext**: Centralized state management with React Context
- **StorageAdapter**: Abstraction layer for data persistence
- **TripManager**: Main application component
- **CSV Parser**: Robust import functionality with error handling

### File Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context for state management
├── lib/               # Utilities and business logic
├── storage/           # Storage adapters
├── types/             # TypeScript type definitions
└── pages/             # Route components
```

## 🔧 Switching to Server Backend

To migrate from localStorage to a server-backed solution:

1. Implement the `StorageAdapter` interface in a new server adapter:

```typescript
// src/storage/server.ts
export class ServerStorageAdapter implements StorageAdapter {
  constructor(private apiUrl: string, private authToken?: string) {}
  
  async getTrip(tripId: string): Promise<Trip | null> {
    const response = await fetch(`${this.apiUrl}/trips/${tripId}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.ok ? await response.json() : null;
  }
  
  // ... implement other methods
}
```

2. Update the import in your context:

```typescript
// Replace localStorage adapter
import { storageAdapter } from '@/storage/server';
```

3. Configure your API endpoint and authentication

## ✅ Acceptance Criteria

This POC meets the following acceptance criteria:

- ✅ **Trip Creation**: Users can create trips with title, dates, and currency
- ✅ **City Management**: Add cities with date ranges to trips
- ✅ **Item Tracking**: Add flights, hotels, and activities with pricing
- ✅ **Budget Calculations**: Real-time totals for planned/paid/remaining amounts
- ✅ **Data Persistence**: All data persists after browser reload via localStorage
- ✅ **CSV Import**: Bulk import with error handling and validation
- ✅ **Payment Tracking**: Mark items as paid/unpaid with visual indicators
- ✅ **Storage Abstraction**: Clear adapter pattern for future backend integration
- ✅ **Responsive UI**: Clean, accessible interface that works on all screen sizes

## 🔮 Future Integrations (TODOs)

The codebase includes TODO markers for future enhancements:

- **Weather API**: Replace mock weather data with real API integration
- **Flight/Hotel APIs**: Sync booking data from travel APIs
- **Cost of Living**: Add destination cost estimates
- **Currency Exchange**: Real-time currency conversion
- **User Authentication**: Multi-user support with secure data access
- **Cloud Sync**: Backup and sync across devices
- **Offline Support**: Progressive Web App capabilities

## 🧪 Sample Data

Load the included sample trip data:

1. Copy the content of `trip-sample.json`
2. Use browser developer tools: `localStorage.setItem('tripmanager:userless:trip-example-2024', JSON.stringify(sampleData))`
3. Refresh the application

Or import via CSV using `trip-import-template.csv`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

This is a POC demonstrating architecture patterns and modern frontend development practices. The codebase prioritizes:

- **Clean Architecture**: Clear separation of concerns
- **Type Safety**: Comprehensive TypeScript coverage
- **Developer Experience**: Clear patterns and helpful error messages
- **Extensibility**: Easy to add new features and integrations

## 📄 License

This project is a POC demonstration and is provided as-is for educational and evaluation purposes.# travel-poc
