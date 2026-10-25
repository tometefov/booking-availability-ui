import type { RoomResult } from "../lib/availability";
import { calculatePrice, formatMoney } from "../lib/pricing";
import { formatDate } from "../lib/dates";

interface Props {
  result: RoomResult;
  checkIn: string;
  checkOut: string;
  selected: boolean;
  onSelect: (roomId: string) => void;
}

export function RoomCard({ result, checkIn, checkOut, selected, onSelect }: Props) {
  const { room, available, conflicts } = result;
  const price = calculatePrice(room, checkIn, checkOut);

  return (
    <article className={`card${selected ? " selected" : ""}${available ? "" : " unavailable"}`}>
      <header className="card-head">
        <h3>{room.name}</h3>
        <span className={`badge ${available ? "ok" : "no"}`}>{available ? "Available" : "Booked"}</span>
      </header>
      <p className="muted">{room.description}</p>
      <ul className="tags" aria-label="Amenities">
        <li>Up to {room.maxGuests} guests</li>
        {room.amenities.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <div className="card-foot">
        <div>
          <strong>{formatMoney(price.total)}</strong>
          <span className="muted"> total · {price.nights} night{price.nights === 1 ? "" : "s"}</span>
          <div className="muted small">
            from {formatMoney(room.nightlyRate)}/night · weekends {formatMoney(room.weekendRate)}
          </div>
        </div>
        {available ? (
          <button className="btn" onClick={() => onSelect(room.id)} aria-pressed={selected}>
            {selected ? "Selected" : "Select"}
          </button>
        ) : (
          <span className="muted small">Booked: {conflicts.map(formatDate).join(", ")}</span>
        )}
      </div>
    </article>
  );
}
