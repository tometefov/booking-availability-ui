import { describe, expect, it } from "vitest";
import { calculatePrice } from "./pricing";
import { nightsBetween, isWeekendNight } from "./dates";
import { conflictingNights, validateSearch } from "./availability";
import { ROOMS } from "../data/rooms";

const room = ROOMS[0]; // 95 weekday / 125 weekend

describe("dates", () => {
  it("counts nights with check-out exclusive", () => {
    expect(nightsBetween("2026-11-02", "2026-11-05")).toEqual(["2026-11-02", "2026-11-03", "2026-11-04"]);
  });
  it("returns no nights for invalid ranges", () => {
    expect(nightsBetween("2026-11-05", "2026-11-02")).toEqual([]);
  });
  it("treats Friday and Saturday as weekend nights", () => {
    expect(isWeekendNight("2026-11-06")).toBe(true); // Friday
    expect(isWeekendNight("2026-11-08")).toBe(false); // Sunday
  });
});

describe("pricing", () => {
  it("mixes weekday and weekend rates", () => {
    // Thu, Fri, Sat nights
    const p = calculatePrice(room, "2026-11-05", "2026-11-08");
    expect(p.weekdayNights).toBe(1);
    expect(p.weekendNights).toBe(2);
    expect(p.subtotal).toBe(95 + 125 * 2);
    expect(p.total).toBe(p.subtotal + p.tax);
  });
});

describe("availability", () => {
  it("finds overlapping booked nights", () => {
    const booked = { r101: ["2026-11-06"] };
    expect(conflictingNights("r101", "2026-11-05", "2026-11-08", booked)).toEqual(["2026-11-06"]);
    expect(conflictingNights("r101", "2026-11-07", "2026-11-09", booked)).toEqual([]);
  });
  it("rejects check-out before check-in", () => {
    const err = validateSearch(
      { checkIn: "2026-11-10", checkOut: "2026-11-09", guests: 2, type: "any" },
      "2026-11-01",
    );
    expect(err).toMatch(/after check-in/);
  });
});
