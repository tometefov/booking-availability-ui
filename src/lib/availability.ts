import type { Room, SearchCriteria } from "../types";
import { nightsBetween, parseISODate } from "./dates";

export function validateSearch(c: SearchCriteria, today: string): string | null {
  const inDate = parseISODate(c.checkIn);
  const outDate = parseISODate(c.checkOut);
  if (!inDate || !outDate) return "Please choose both a check-in and a check-out date.";
  if (c.checkIn < today) return "Check-in can't be in the past.";
  if (outDate <= inDate) return "Check-out must be after check-in.";
  if (nightsBetween(c.checkIn, c.checkOut).length > 28) return "Stays are limited to 28 nights.";
  if (c.guests < 1) return "At least one guest is required.";
  return null;
}

/** Returns the booked nights that overlap the requested stay. */
export function conflictingNights(
  roomId: string,
  checkIn: string,
  checkOut: string,
  booked: Record<string, string[]>,
): string[] {
  const taken = new Set(booked[roomId] ?? []);
  return nightsBetween(checkIn, checkOut).filter((n) => taken.has(n));
}

export interface RoomResult {
  room: Room;
  available: boolean;
  conflicts: string[];
}

export function searchRooms(
  rooms: Room[],
  criteria: SearchCriteria,
  booked: Record<string, string[]>,
): RoomResult[] {
  return rooms
    .filter((r) => r.maxGuests >= criteria.guests)
    .filter((r) => criteria.type === "any" || r.type === criteria.type)
    .map((room) => {
      const conflicts = conflictingNights(room.id, criteria.checkIn, criteria.checkOut, booked);
      return { room, available: conflicts.length === 0, conflicts };
    })
    // Available rooms first, then cheapest first.
    .sort((a, b) => Number(b.available) - Number(a.available) || a.room.nightlyRate - b.room.nightlyRate);
}
