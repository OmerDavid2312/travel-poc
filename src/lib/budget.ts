// Budget calculation utilities

import { Trip, BudgetSummary } from '@/types/trip';

export function calculateBudget(trip: Trip): BudgetSummary {
  const byCity: BudgetSummary['byCity'] = {};
  let totalPlanned = 0;
  let totalPaid = 0;

  trip.cities.forEach(city => {
    let cityPlanned = 0;
    let cityPaid = 0;

    city.items.forEach(item => {
      cityPlanned += item.price;
      if (item.paid) {
        cityPaid += item.price;
      }
    });

    totalPlanned += cityPlanned;
    totalPaid += cityPaid;

    byCity[city.id] = {
      cityName: city.name,
      planned: cityPlanned,
      paid: cityPaid,
      unpaid: cityPlanned - cityPaid
    };
  });

  return {
    totalPlanned,
    totalPaid,
    totalUnpaid: totalPlanned - totalPaid,
    byCity
  };
}