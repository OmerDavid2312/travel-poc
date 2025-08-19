export interface TripPlanData {
  icon: string;
  title: string;
  description: string;
  activities: string;
  summary?: string;
}

export async function fetchTripPlanData(city: string, tripName: string, startDate: string, endDate: string): Promise<TripPlanData> {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/plan/trip-plan?city=${encodeURIComponent(city)}&trip=${encodeURIComponent(tripName)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trip plan data:', error);
    // Fallback data in case of error
    return {
      icon: '🗺️',
      title: 'Trip Planning',
      description: 'Unable to load trip planning suggestions at this time',
      activities: 'Unable to load trip planning suggestions at this time',
      summary: 'Unable to load trip planning suggestions at this time'
    };
  }
}
