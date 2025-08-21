// Budget calculation utilities

import { Trip, BudgetSummary } from '@/types/trip';

export function calculateBudget(trip: Trip): BudgetSummary {
  const byCity: BudgetSummary['byCity'] = {};
  const byPayer: BudgetSummary['byPayer'] = {};
  let totalPlanned = 0;
  let totalPaid = 0;

  trip.cities.forEach(city => {
    let cityPlanned = 0;
    let cityPaid = 0;

    city.items.forEach(item => {
      cityPlanned += item.price;
      // Use paidAmount for partial payments
      const itemPaidAmount = item.paidAmount || 0;
      cityPaid += itemPaidAmount;

      // Calculate by payer
      const payer = item.payer || 'Me';
      if (!byPayer[payer]) {
        byPayer[payer] = {
          payerName: payer,
          planned: 0,
          paid: 0,
          unpaid: 0
        };
      }
      
      byPayer[payer].planned += item.price;
      byPayer[payer].paid += itemPaidAmount;
      byPayer[payer].unpaid = byPayer[payer].planned - byPayer[payer].paid;
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
    byCity,
    byPayer
  };
}