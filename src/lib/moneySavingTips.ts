export interface MoneySavingTip {
  tip: string;
}

export async function fetchMoneySavingTip(cities: string, tripName: string, startDate: string, endDate: string): Promise<MoneySavingTip> {
  try {
    const params = new URLSearchParams({
      cities: encodeURIComponent(cities),
      tripName: encodeURIComponent(tripName),
      startDate,
      endDate
    });

    const response = await fetch(`http://localhost:3000/api/v1/plan/money-saving-tips?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching money saving tip:', error);
    // Fallback data in case of error
    return {
      tip: 'לבדוק עמלות אשראי לפני הנסיעה'
    };
  }
}
