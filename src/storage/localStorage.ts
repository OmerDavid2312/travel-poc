// LocalStorage Adapter Implementation

import { Trip } from '@/types/trip';
import { StorageAdapter } from './adapter';

const STORAGE_PREFIX = 'tripmanager:userless:';
const TRIPS_LIST_KEY = 'tripmanager:userless:trips';

export class LocalStorageAdapter implements StorageAdapter {
  private getStorageKey(tripId: string): string {
    return `${STORAGE_PREFIX}${tripId}`;
  }

  async getTrip(tripId: string): Promise<Trip | null> {
    try {
      const data = localStorage.getItem(this.getStorageKey(tripId));
      if (!data) return null;
      
      const trip = JSON.parse(data) as Trip;
      console.log(`[Storage] Retrieved trip: ${trip.title} (${tripId})`);
      return trip;
    } catch (error) {
      console.error(`[Storage] Failed to retrieve trip ${tripId}:`, error);
      return null;
    }
  }

  async saveTrip(trip: Trip): Promise<void> {
    try {
      const updatedTrip = {
        ...trip,
        updatedAt: new Date().toISOString()
      };
      
      // Save the trip data
      localStorage.setItem(this.getStorageKey(trip.id), JSON.stringify(updatedTrip));
      
      // Update trips list
      const tripsList = await this.listTrips();
      const existingIndex = tripsList.findIndex(t => t.id === trip.id);
      
      if (existingIndex >= 0) {
        tripsList[existingIndex] = updatedTrip;
      } else {
        tripsList.push(updatedTrip);
      }
      
      localStorage.setItem(TRIPS_LIST_KEY, JSON.stringify(tripsList.map(t => ({
        id: t.id,
        title: t.title,
        startDate: t.startDate,
        endDate: t.endDate,
        updatedAt: t.updatedAt
      }))));
      
      console.log(`[Storage] Saved trip: ${trip.title} (${trip.id})`);
    } catch (error) {
      console.error(`[Storage] Failed to save trip ${trip.id}:`, error);
      throw error;
    }
  }

  async listTrips(): Promise<Trip[]> {
    try {
      const data = localStorage.getItem(TRIPS_LIST_KEY);
      if (!data) return [];
      
      const tripSummaries = JSON.parse(data);
      const trips: Trip[] = [];
      
      // Load full trip data for each summary
      for (const summary of tripSummaries) {
        const fullTrip = await this.getTrip(summary.id);
        if (fullTrip) {
          trips.push(fullTrip);
        }
      }
      
      console.log(`[Storage] Listed ${trips.length} trips`);
      return trips.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
      console.error('[Storage] Failed to list trips:', error);
      return [];
    }
  }

  async deleteTrip(tripId: string): Promise<void> {
    try {
      localStorage.removeItem(this.getStorageKey(tripId));
      
      // Update trips list
      const tripsList = await this.listTrips();
      const filteredTrips = tripsList.filter(t => t.id !== tripId);
      
      localStorage.setItem(TRIPS_LIST_KEY, JSON.stringify(filteredTrips.map(t => ({
        id: t.id,
        title: t.title,
        startDate: t.startDate,
        endDate: t.endDate,
        updatedAt: t.updatedAt
      }))));
      
      console.log(`[Storage] Deleted trip: ${tripId}`);
    } catch (error) {
      console.error(`[Storage] Failed to delete trip ${tripId}:`, error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const testKey = 'tripmanager:test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const storageAdapter = new LocalStorageAdapter();