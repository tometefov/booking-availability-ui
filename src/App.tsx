import { useMemo, useState } from "react";
import type { BookingConfirmation, BookingRequest, SearchCriteria } from "./types";
import { SearchForm } from "./components/SearchForm";
import { RoomCard } from "./components/RoomCard";
import { BookingPanel } from "./components/BookingPanel";
import { Confirmation } from "./components/Confirmation";
import { validateSearch, type RoomResult } from "./lib/availability";
import { BookingError, createBooking, fetchAvailability } from "./lib/api";
import { toISODate } from "./lib/dates";

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export default function App() {
  const today = useMemo(() => toISODate(new Date()), []);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    checkIn: addDays(today, 7),
    checkOut: addDays(today, 10),
    guests: 2,
    type: "any",
  });
  const [results, setResults] = useState<RoomResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const selected = results?.find((r) => r.room.id === selectedId)?.room ?? null;

  async function handleSearch(next: SearchCriteria) {
    const error = validateSearch(next, today);
    setSearchError(error);
    setSelectedId(null);
    if (error) return;
    setCriteria(next);
    setLoading(true);
    try {
      setResults(await fetchAvailability(next));
    } catch {
      setSearchError("Couldn't load availability. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(req: BookingRequest) {
    setSubmitting(true);
    setBookingError(null);
    try {
      setConfirmation(await createBooking(req));
      setSelectedId(null);
      setResults(null);
    } catch (e) {
      setBookingError(e instanceof BookingError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const availableCount = results?.filter((r) => r.available).length ?? 0;

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Harbor Light Inn · demo</p>
        <h1>Find your room</h1>
        <p className="muted">Check live availability, compare prices and request a booking in under a minute.</p>
      </header>

      {confirmation ? (
        <Confirmation booking={confirmation} onDone={() => setConfirmation(null)} />
      ) : (
        <>
          <SearchForm initial={criteria} today={today} loading={loading} onSearch={handleSearch} />
          {searchError && <p className="alert" role="alert">{searchError}</p>}

          <main className={selected ? "layout with-panel" : "layout"}>
            <section aria-live="polite">
              {results === null && !loading && <p className="muted empty">Choose your dates to see available rooms.</p>}
              {results !== null && (
                <p className="muted">
                  {availableCount} of {results.length} matching room{results.length === 1 ? "" : "s"} available
                </p>
              )}
              {results?.length === 0 && <p className="empty">No rooms fit that many guests or that room type. Try adjusting your search.</p>}
              <div className="grid">
                {results?.map((r) => (
                  <RoomCard
                    key={r.room.id}
                    result={r}
                    checkIn={criteria.checkIn}
                    checkOut={criteria.checkOut}
                    selected={r.room.id === selectedId}
                    onSelect={(id) => {
                      setSelectedId(id);
                      setBookingError(null);
                    }}
                  />
                ))}
              </div>
            </section>
            {selected && (
              <BookingPanel
                key={selected.id}
                room={selected}
                checkIn={criteria.checkIn}
                checkOut={criteria.checkOut}
                guests={criteria.guests}
                submitting={submitting}
                error={bookingError}
                onSubmit={handleBook}
                onCancel={() => setSelectedId(null)}
              />
            )}
          </main>
        </>
      )}
      <footer className="muted small">Portfolio demo · fictional inn and data</footer>
    </div>
  );
}
