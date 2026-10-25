export type RoomType = "standard" | "kitchenette" | "suite";

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  maxGuests: number;
  nightlyRate: number;
  weekendRate: number;
  amenities: string[];
  description: string;
}

export interface DateRange {
  checkIn: string; // ISO date, e.g. "2026-11-05"
  checkOut: string;
}

export interface SearchCriteria extends DateRange {
  guests: number;
  type: RoomType | "any";
}

export interface PriceBreakdown {
  nights: number;
  weekdayNights: number;
  weekendNights: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface BookingRequest extends DateRange {
  roomId: string;
  guests: number;
  fullName: string;
  email: string;
}

export interface BookingConfirmation {
  reference: string;
  request: BookingRequest;
  price: PriceBreakdown;
}
