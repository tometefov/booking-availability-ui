# Booking Availability UI

A small React + TypeScript app for a fictional seaside inn ("Harbor Light Inn"). Guests pick dates and party size, see which rooms are free, compare prices, and request a booking.

> Built by **Tome Tefov** with **Claude Code** (AI pair programming) as a portfolio project. The inn and all data are fictional.

## Why I built this

I've worked on real hospitality websites built with WordPress and Elementor, where the most important element is the "Rates and availability" button. This project rebuilds that experience as a proper typed frontend app, the way it would work in a modern stack.

## Features

- **Availability search** by check-in and check-out date, number of guests and room type
- **Conflict detection** shows exactly which nights a room is already booked
- **Pricing** with weekday and weekend rates, tax, and a live breakdown
- **Booking form** with client-side validation and accessible error messages
- **Mock API layer** (`src/lib/api.ts`) with async calls and simulated latency, so a real backend (e.g. NestJS + PostgreSQL) could replace it without changing the UI
- Handles "room was just booked" race conditions with a clear error
- Responsive layout, keyboard-friendly, light and dark mode
- Unit tests for date, pricing and availability logic (Vitest)

## Tech stack

React 18 · TypeScript (strict) · Vite · Vitest · plain CSS (custom properties, no UI library)

## Project structure

```
src/
  App.tsx                 # page state: search → select → book → confirm
  types.ts                # shared domain types (Room, SearchCriteria, Booking…)
  components/
    SearchForm.tsx
    RoomCard.tsx
    BookingPanel.tsx
    Confirmation.tsx
  lib/
    dates.ts              # time-zone-safe date helpers
    pricing.ts            # weekday/weekend pricing + tax
    availability.ts       # validation, filtering, conflict detection
    api.ts                # mock backend (swap for real HTTP calls)
    pricing.test.ts       # unit tests
  data/rooms.ts           # fictional sample rooms and bookings
  styles.css
```

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev      # start the dev server
npm test         # run unit tests
npm run build    # type-check and build for production
```

## Design decisions

- **Business logic lives outside components.** Pricing and availability are pure functions, so they're easy to test and reuse on a server.
- **Dates are handled as `YYYY-MM-DD` strings in UTC** to avoid off-by-one bugs from time zones.
- **A night is identified by its check-in date.** A stay from the 5th to the 8th uses the nights of the 5th, 6th and 7th.

## What I'd add next

- A real backend: NestJS REST API with a PostgreSQL `bookings` table and a unique constraint per room-night
- A calendar view showing booked nights
- Component tests with React Testing Library

## Screenshots

_Add screenshots to a `/screenshots` folder and link them here._
