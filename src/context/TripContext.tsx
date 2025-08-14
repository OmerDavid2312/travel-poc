// Trip state management context

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Trip, CityStay, TripItem, BudgetSummary } from '@/types/trip';
import { storageAdapter } from '@/storage/localStorage';
import { calculateBudget } from '@/lib/budget';
import { generateId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TripContextType {
  // Current trip state
  currentTrip: Trip | null;
  budget: BudgetSummary | null;
  allTrips: Trip[];
  loading: boolean;

  // Trip operations
  createTrip: (title: string, startDate: string, endDate: string, currency: string) => Promise<void>;
  loadTrip: (tripId: string) => Promise<void>;
  updateTrip: (updates: Partial<Trip>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  loadAllTrips: () => Promise<void>;

  // City operations
  addCity: (name: string, startDate: string, endDate: string) => Promise<void>;
  updateCity: (cityId: string, updates: Partial<CityStay>) => Promise<void>;
  deleteCity: (cityId: string) => Promise<void>;

  // Item operations
  addItem: (cityId: string, item: Omit<TripItem, 'id'>) => Promise<void>;
  updateItem: (cityId: string, itemId: string, updates: Partial<TripItem>) => Promise<void>;
  deleteItem: (cityId: string, itemId: string) => Promise<void>;
  toggleItemPaid: (cityId: string, itemId: string) => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function useTripContext() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
}

interface TripProviderProps {
  children: ReactNode;
}

export function TripProvider({ children }: TripProviderProps) {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Recalculate budget when trip changes
  useEffect(() => {
    if (currentTrip) {
      setBudget(calculateBudget(currentTrip));
    } else {
      setBudget(null);
    }
  }, [currentTrip]);

  // Load all trips on mount
  useEffect(() => {
    loadAllTrips();
  }, []);

  const createTrip = async (title: string, startDate: string, endDate: string, currency: string) => {
    try {
      setLoading(true);
      const trip: Trip = {
        id: generateId(),
        title,
        startDate,
        endDate,
        currency,
        cities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await storageAdapter.saveTrip(trip);
      setCurrentTrip(trip);
      await loadAllTrips();
      
      toast({
        title: "Trip created",
        description: `${title} has been created successfully.`
      });
    } catch (error) {
      console.error('Failed to create trip:', error);
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTrip = async (tripId: string) => {
    try {
      setLoading(true);
      const trip = await storageAdapter.getTrip(tripId);
      if (trip) {
        setCurrentTrip(trip);
      } else {
        toast({
          title: "Trip not found",
          description: "The requested trip could not be found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to load trip:', error);
      toast({
        title: "Error",
        description: "Failed to load trip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (updates: Partial<Trip>) => {
    if (!currentTrip) return;

    try {
      const updatedTrip = { ...currentTrip, ...updates };
      await storageAdapter.saveTrip(updatedTrip);
      setCurrentTrip(updatedTrip);
      await loadAllTrips();
    } catch (error) {
      console.error('Failed to update trip:', error);
      toast({
        title: "Error",
        description: "Failed to update trip. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      await storageAdapter.deleteTrip(tripId);
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null);
      }
      await loadAllTrips();
      
      toast({
        title: "Trip deleted",
        description: "Trip has been deleted successfully."
      });
    } catch (error) {
      console.error('Failed to delete trip:', error);
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadAllTrips = async () => {
    try {
      const trips = await storageAdapter.listTrips();
      setAllTrips(trips);
    } catch (error) {
      console.error('Failed to load trips:', error);
    }
  };

  const addCity = async (name: string, startDate: string, endDate: string) => {
    if (!currentTrip) return;

    try {
      const city: CityStay = {
        id: generateId(),
        name,
        startDate,
        endDate,
        items: [],
        weather: {
          temperature: Math.floor(Math.random() * 25) + 10,
          condition: ['Sunny', 'Cloudy', 'Partly Cloudy'][Math.floor(Math.random() * 3)],
          icon: ['☀️', '☁️', '⛅'][Math.floor(Math.random() * 3)]
        }
      };

      const updatedTrip = {
        ...currentTrip,
        cities: [...currentTrip.cities, city].sort((a, b) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
      };

      await storageAdapter.saveTrip(updatedTrip);
      setCurrentTrip(updatedTrip);
      
      toast({
        title: "City added",
        description: `${name} has been added to your trip.`
      });
    } catch (error) {
      console.error('Failed to add city:', error);
      toast({
        title: "Error",
        description: "Failed to add city. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateCity = async (cityId: string, updates: Partial<CityStay>) => {
    if (!currentTrip) return;

    try {
      const updatedTrip = {
        ...currentTrip,
        cities: currentTrip.cities.map(city =>
          city.id === cityId ? { ...city, ...updates } : city
        )
      };

      await storageAdapter.saveTrip(updatedTrip);
      setCurrentTrip(updatedTrip);
    } catch (error) {
      console.error('Failed to update city:', error);
      toast({
        title: "Error",
        description: "Failed to update city. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteCity = async (cityId: string) => {
    if (!currentTrip) return;

    try {
      const updatedTrip = {
        ...currentTrip,
        cities: currentTrip.cities.filter(city => city.id !== cityId)
      };

      await storageAdapter.saveTrip(updatedTrip);
      setCurrentTrip(updatedTrip);
      
      toast({
        title: "City deleted",
        description: "City has been removed from your trip."
      });
    } catch (error) {
      console.error('Failed to delete city:', error);
      toast({
        title: "Error",
        description: "Failed to delete city. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addItem = async (cityId: string, item: Omit<TripItem, 'id'>) => {
    if (!currentTrip) return;

    try {
      const newItem: TripItem = { ...item, id: generateId() };
      
      const updatedTrip = {
        ...currentTrip,
        cities: currentTrip.cities.map(city =>
          city.id === cityId
            ? { ...city, items: [...city.items, newItem] }
            : city
        )
      };

      await storageAdapter.saveTrip(updatedTrip);
      setCurrentTrip(updatedTrip);
      
      toast({
        title: "Item added",
        description: `${item.title} has been added to your trip.`
      });
    } catch (error) {
      console.error('Failed to add item:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateItem = async (cityId: string, itemId: string, updates: Partial<TripItem>) => {
    if (!currentTrip) return;

    try {
      const updatedTrip = {
        ...currentTrip,
        cities: currentTrip.cities.map(city =>
          city.id === cityId
            ? {
                ...city,
                items: city.items.map(item =>
                  item.id === itemId ? { ...item, ...updates } : item
                )
              }
            : city
        )
      };

      await storageAdapter.saveTrip(updatedTrip);
      setCurrentTrip(updatedTrip);
    } catch (error) {
      console.error('Failed to update item:', error);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteItem = async (cityId: string, itemId: string) => {
    if (!currentTrip) return;

    try {
      const updatedTrip = {
        ...currentTrip,
        cities: currentTrip.cities.map(city =>
          city.id === cityId
            ? { ...city, items: city.items.filter(item => item.id !== itemId) }
            : city
        )
      };

      await storageAdapter.saveTrip(updatedTrip);
      setCurrentTrip(updatedTrip);
      
      toast({
        title: "Item deleted",
        description: "Item has been removed from your trip."
      });
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleItemPaid = async (cityId: string, itemId: string) => {
    if (!currentTrip) return;

    const city = currentTrip.cities.find(c => c.id === cityId);
    const item = city?.items.find(i => i.id === itemId);
    
    if (item) {
      await updateItem(cityId, itemId, { paid: !item.paid });
    }
  };

  const value: TripContextType = {
    currentTrip,
    budget,
    allTrips,
    loading,
    createTrip,
    loadTrip,
    updateTrip,
    deleteTrip,
    loadAllTrips,
    addCity,
    updateCity,
    deleteCity,
    addItem,
    updateItem,
    deleteItem,
    toggleItemPaid
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}