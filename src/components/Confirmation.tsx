import type { BookingConfirmation } from "../types";
import { formatMoney } from "../lib/pricing";
import { formatDate } from "../lib/dates";

export function Confirmation({ booking, onDone }: { booking: BookingConfirmation; onDone: () => void }) {
  const { request, price, reference } = booking;
  return (
    <section className="panel confirm" role="status">
      <h2>Booking requested ✓</h2>
      <p>
        Thanks, {request.fullName}! Your reference is <strong>{reference}</strong>.
      </p>
      <p className="muted">
        {formatDate(request.checkIn)} → {formatDate(request.checkOut)} · {price.nights} night
        {price.nights === 1 ? "" : "s"} · {formatMoney(price.total)}
      </p>
      <p className="muted small">This is a demo – no real booking or email is sent.</p>
      <button className="btn primary" onClick={onDone}>Make another search</button>
    </section>
  );
}
