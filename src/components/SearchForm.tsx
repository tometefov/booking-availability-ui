import { useState, type FormEvent } from "react";
import type { RoomType, SearchCriteria } from "../types";

interface Props {
  initial: SearchCriteria;
  today: string;
  loading: boolean;
  onSearch: (criteria: SearchCriteria) => void;
}

export function SearchForm({ initial, today, loading, onSearch }: Props) {
  const [form, setForm] = useState<SearchCriteria>(initial);

  const update = <K extends keyof SearchCriteria>(key: K, value: SearchCriteria[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <form className="search" onSubmit={submit} aria-label="Search availability">
      <label>
        Check-in
        <input type="date" min={today} value={form.checkIn} onChange={(e) => update("checkIn", e.target.value)} required />
      </label>
      <label>
        Check-out
        <input type="date" min={form.checkIn || today} value={form.checkOut} onChange={(e) => update("checkOut", e.target.value)} required />
      </label>
      <label>
        Guests
        <select value={form.guests} onChange={(e) => update("guests", Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
      <label>
        Room type
        <select value={form.type} onChange={(e) => update("type", e.target.value as RoomType | "any")}>
          <option value="any">Any</option>
          <option value="standard">Standard</option>
          <option value="kitchenette">Kitchenette</option>
          <option value="suite">Suite</option>
        </select>
      </label>
      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? "Searching…" : "Check availability"}
      </button>
    </form>
  );
}
