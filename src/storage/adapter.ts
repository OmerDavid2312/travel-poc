// Storage Adapter Interface - Abstraction for different storage backends

import { Trip } from '@/types/trip';

export interface StorageAdapter {
  // Trip CRUD operations
  getTrip(tripId: string): Promise<Trip | null>;
  saveTrip(trip: Trip): Promise<void>;
  listTrips(): Promise<Trip[]>;
  deleteTrip(tripId: string): Promise<void>;
  
  // Health check
  isAvailable(): Promise<boolean>;
}

// TODO: Future server-backed adapter implementation
// export class ServerStorageAdapter implements StorageAdapter {
//   constructor(private apiUrl: string, private authToken?: string) {}
//   
//   async getTrip(tripId: string): Promise<Trip | null> {
//     try {
//       const response = await fetch(`${this.apiUrl}/trips/${tripId}`, {
//         headers: {
//           'Authorization': `Bearer ${this.authToken}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       return response.ok ? await response.json() : null;
//     } catch (error) {
//       console.error('Failed to fetch trip:', error);
//       return null;
//     }
//   }
//
//   async saveTrip(trip: Trip): Promise<void> {
//     await fetch(`${this.apiUrl}/trips/${trip.id}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${this.authToken}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(trip)
//     });
//   }
//
//   async listTrips(): Promise<Trip[]> {
//     const response = await fetch(`${this.apiUrl}/trips`, {
//       headers: { 'Authorization': `Bearer ${this.authToken}` }
//     });
//     return response.ok ? await response.json() : [];
//   }
//
//   async deleteTrip(tripId: string): Promise<void> {
//     await fetch(`${this.apiUrl}/trips/${tripId}`, {
//       method: 'DELETE',
//       headers: { 'Authorization': `Bearer ${this.authToken}` }
//     });
//   }
//
//   async isAvailable(): Promise<boolean> {
//     try {
//       const response = await fetch(`${this.apiUrl}/health`);
//       return response.ok;
//     } catch {
//       return false;
//     }
//   }
// }