import type { Room } from "../types";

// Fictional sample data – not taken from any real business.
export const ROOMS: Room[] = [
  {
    id: "r101",
    name: "Garden Standard",
    type: "standard",
    maxGuests: 2,
    nightlyRate: 95,
    weekendRate: 125,
    amenities: ["Queen bed", "Wi-Fi", "Mini fridge"],
    description: "A quiet, cozy room facing the garden – ideal for couples.",
  },
  {
    id: "r102",
    name: "Pool View Standard",
    type: "standard",
    maxGuests: 4,
    nightlyRate: 120,
    weekendRate: 155,
    amenities: ["Two double beds", "Wi-Fi", "Pool view"],
    description: "Bright room with two double beds overlooking the pool.",
  },
  {
    id: "r201",
    name: "Family Kitchenette",
    type: "kitchenette",
    maxGuests: 5,
    nightlyRate: 150,
    weekendRate: 190,
    amenities: ["Full kitchen", "Dining table", "Wi-Fi", "Parking"],
    description: "Self-catering room with a full kitchen for longer family stays.",
  },
  {
    id: "r301",
    name: "Harbor Suite",
    type: "suite",
    maxGuests: 4,
    nightlyRate: 210,
    weekendRate: 260,
    amenities: ["Separate living room", "Balcony", "Kitchenette", "Wi-Fi"],
    description: "Our largest suite with a balcony and a separate living area.",
  },
];

// Already-booked nights per room (a night is identified by its check-in date).
export const BOOKED_NIGHTS: Record<string, string[]> = {
  r101: ["2026-11-06", "2026-11-07"],
  r102: ["2026-11-13"],
  r201: ["2026-11-01", "2026-11-02", "2026-11-03"],
  r301: ["2026-11-20", "2026-11-21", "2026-11-22"],
};
