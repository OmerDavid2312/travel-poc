// CSV Import Parser

import { Trip, CityStay, TripItem, CSVRow, ImportResult, TripItemType } from '@/types/trip';
import { generateId } from '@/lib/utils';

export function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const expectedHeaders = ['city', 'type', 'title', 'provider', 'datefrom', 'dateto', 'price', 'paid'];
  
  // Validate headers
  const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required CSV headers: ${missingHeaders.join(', ')}`);
  }

  const rows: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) {
      console.warn(`Row ${i + 1}: Column count mismatch, skipping`);
      continue;
    }

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    rows.push(row as CSVRow);
  }

  return rows;
}

export function importCSVToTrip(trip: Trip, csvRows: CSVRow[]): ImportResult {
  const errors: string[] = [];
  let itemsImported = 0;
  
  // Create a map of existing cities for quick lookup
  const cityMap = new Map<string, CityStay>();
  trip.cities.forEach(city => {
    cityMap.set(city.name.toLowerCase(), city);
  });

  csvRows.forEach((row, index) => {
    try {
      const rowNum = index + 2; // +2 because we skipped header and arrays are 0-indexed
      
      // Validate required fields
      if (!row.city?.trim()) {
        errors.push(`Row ${rowNum}: City name is required`);
        return;
      }
      
      if (!row.type?.trim()) {
        errors.push(`Row ${rowNum}: Item type is required`);
        return;
      }
      
      if (!row.title?.trim()) {
        errors.push(`Row ${rowNum}: Title is required`);
        return;
      }

      // Validate item type
      const itemType = row.type.toLowerCase() as TripItemType;
      if (!['flight', 'hotel', 'activity'].includes(itemType)) {
        errors.push(`Row ${rowNum}: Invalid item type "${row.type}". Must be: flight, hotel, or activity`);
        return;
      }

      // Validate and parse price
      const price = parseFloat(row.price);
      if (isNaN(price) || price < 0) {
        errors.push(`Row ${rowNum}: Invalid price "${row.price}". Must be a positive number`);
        return;
      }

      // Validate and parse paid status
      const paidStr = row.paid?.toLowerCase();
      const paid = paidStr === 'true' || paidStr === 'yes' || paidStr === '1';

      // Validate dates
      const dateFrom = new Date(row.dateFrom);
      if (isNaN(dateFrom.getTime())) {
        errors.push(`Row ${rowNum}: Invalid dateFrom "${row.dateFrom}". Use YYYY-MM-DD format`);
        return;
      }

      let dateTo: Date | undefined;
      if (row.dateTo?.trim()) {
        dateTo = new Date(row.dateTo);
        if (isNaN(dateTo.getTime())) {
          errors.push(`Row ${rowNum}: Invalid dateTo "${row.dateTo}". Use YYYY-MM-DD format`);
          return;
        }
        
        if (dateTo < dateFrom) {
          errors.push(`Row ${rowNum}: dateTo must be after dateFrom`);
          return;
        }
      }

      // Find or create city
      const cityName = row.city.trim();
      let city = cityMap.get(cityName.toLowerCase());
      
      if (!city) {
        // Create new city
        city = {
          id: generateId(),
          name: cityName,
          startDate: dateFrom.toISOString(),
          endDate: dateTo?.toISOString() || dateFrom.toISOString(),
          items: [],
          weather: generateMockWeather()
        };
        
        trip.cities.push(city);
        cityMap.set(cityName.toLowerCase(), city);
      } else {
        // Update city date range if necessary
        const cityStart = new Date(city.startDate);
        const cityEnd = new Date(city.endDate);
        
        if (dateFrom < cityStart) {
          city.startDate = dateFrom.toISOString();
        }
        
        if (dateTo && dateTo > cityEnd) {
          city.endDate = dateTo.toISOString();
        } else if (!dateTo && dateFrom > cityEnd) {
          city.endDate = dateFrom.toISOString();
        }
      }

      // Create trip item
      const item: TripItem = {
        id: generateId(),
        type: itemType,
        title: row.title.trim(),
        provider: row.provider?.trim(),
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo?.toISOString(),
        price,
        paid
      };

      // Add type-specific properties
      if (itemType === 'flight' && row.provider) {
        item.flightNumber = `${row.provider}-${Math.floor(Math.random() * 9999)}`;
      }
      
      if (itemType === 'hotel' && row.title) {
        item.name = row.title;
      }

      city.items.push(item);
      itemsImported++;
      
    } catch (error) {
      errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Sort cities by start date
  trip.cities.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  console.log(`[CSV Import] Imported ${itemsImported} items with ${errors.length} errors`);
  
  return {
    success: errors.length === 0,
    itemsImported,
    errors
  };
}

function generateMockWeather() {
  const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Overcast'];
  const icons = ['☀️', '☁️', '⛅', '🌧️', '☁️'];
  const randomIndex = Math.floor(Math.random() * conditions.length);
  
  return {
    temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
    condition: conditions[randomIndex],
    icon: icons[randomIndex]
  };
}