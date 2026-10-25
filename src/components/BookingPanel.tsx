import { useState, type FormEvent } from "react";
import type { BookingRequest, Room } from "../types";
import { calculatePrice, formatMoney, TAX_RATE } from "../lib/pricing";
import { formatDate } from "../lib/dates";

interface Props {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  submitting: boolean;
  error: string | null;
  onSubmit: (req: BookingRequest) => void;
  onCancel: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BookingPanel({ room, checkIn, checkOut, guests, submitting, error, onSubmit, onCancel }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const price = calculatePrice(room, checkIn, checkOut);

  const nameError = fullName.trim().length < 2 ? "Please enter your full name." : null;
  const emailError = !EMAIL_RE.test(email) ? "Please enter a valid email address." : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (nameError || emailError) return;
    onSubmit({ roomId: room.id, checkIn, checkOut, guests, fullName: fullName.trim(), email: email.trim() });
  };

  return (
    <aside className="panel" aria-label="Booking summary">
      <h2>Your stay</h2>
      <p>
        <strong>{room.name}</strong>
        <br />
        <span className="muted">
          {formatDate(checkIn)} → {formatDate(checkOut)} · {guests} guest{guests === 1 ? "" : "s"}
        </span>
      </p>
      <dl className="breakdown">
        {price.weekdayNights > 0 && (
          <>
            <dt>{price.weekdayNights} × weekday</dt>
            <dd>{formatMoney(price.weekdayNights * room.nightlyRate)}</dd>
          </>
        )}
        {price.weekendNights > 0 && (
          <>
            <dt>{price.weekendNights} × weekend</dt>
            <dd>{formatMoney(price.weekendNights * room.weekendRate)}</dd>
          </>
        )}
        <dt>Tax ({Math.round(TAX_RATE * 100)}%)</dt>
        <dd>{formatMoney(price.tax)}</dd>
        <dt className="total">Total</dt>
        <dd className="total">{formatMoney(price.total)}</dd>
      </dl>

      <form onSubmit={submit} noValidate>
        <label>
          Full name
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} aria-invalid={touched && !!nameError} />
          {touched && nameError && <span className="field-error">{nameError}</span>}
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={touched && !!emailError} />
          {touched && emailError && <span className="field-error">{emailError}</span>}
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="row">
          <button type="button" className="btn" onClick={onCancel}>Back</button>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? "Booking…" : "Request booking"}
          </button>
        </div>
      </form>
    </aside>
  );
}
