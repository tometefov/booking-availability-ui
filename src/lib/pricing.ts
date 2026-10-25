import type { PriceBreakdown, Room } from "../types";
import { isWeekendNight, nightsBetween } from "./dates";

export const TAX_RATE = 0.12;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculatePrice(room: Room, checkIn: string, checkOut: string): PriceBreakdown {
  const nights = nightsBetween(checkIn, checkOut);
  const weekendNights = nights.filter(isWeekendNight).length;
  const weekdayNights = nights.length - weekendNights;
  const subtotal = weekdayNights * room.nightlyRate + weekendNights * room.weekendRate;
  const tax = round2(subtotal * TAX_RATE);
  return {
    nights: nights.length,
    weekdayNights,
    weekendNights,
    subtotal,
    tax,
    total: round2(subtotal + tax),
  };
}

export function formatMoney(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
