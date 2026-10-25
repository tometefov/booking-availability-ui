import type { BookingConfirmation, BookingRequest, SearchCriteria } from "../types";
import { BOOKED_NIGHTS, ROOMS } from "../data/rooms";
import { conflictingNights, searchRooms, type RoomResult } from "./availability";
import { calculatePrice } from "./pricing";
import { nightsBetween } from "./dates";

/**
 * Mock API layer. In a real app these functions would call a backend
 * (e.g. GET /rooms/availability, POST /bookings). Keeping them async and
 * isolated means the UI wouldn't change when a real API is plugged in.
 */
const bookedNights: Record<string, string[]> = structuredClone(BOOKED_NIGHTS);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAvailability(criteria: SearchCriteria): Promise<RoomResult[]> {
  await delay(400);
  return searchRooms(ROOMS, criteria, bookedNights);
}

export class BookingError extends Error {}

export async function createBooking(req: BookingRequest): Promise<BookingConfirmation> {
  await delay(500);
  const room = ROOMS.find((r) => r.id === req.roomId);
  if (!room) throw new BookingError("Room not found.");
  if (req.guests > room.maxGuests) throw new BookingError("Too many guests for this room.");
  if (conflictingNights(room.id, req.checkIn, req.checkOut, bookedNights).length > 0) {
    throw new BookingError("Sorry, this room was just booked for some of your dates.");
  }
  bookedNights[room.id] = [...(bookedNights[room.id] ?? []), ...nightsBetween(req.checkIn, req.checkOut)];
  return {
    reference: `HL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    request: req,
    price: calculatePrice(room, req.checkIn, req.checkOut),
  };
}
