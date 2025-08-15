export interface WeatherData {
  icon: string;
  temperature: number;
  condition: string;
  forecast: string;
  summary?: string;
}

export async function fetchWeatherData(city: string, tripName: string, startDate: string, endDate: string): Promise<WeatherData> {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/weather?city=${encodeURIComponent(city)}&trip=${encodeURIComponent(tripName)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
    debugger;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fallback data in case of error
    return {
      icon: '🌤️',
      temperature: 25,
      condition: 'מזג אוויר נעים',
      forecast: 'לא ניתן לטעון תחזית מזג אוויר כרגע',
      summary: 'לא ניתן לטעון תחזית מזג אוויר כרגע'
    };
  }
}
