/**
 * HolidayCalendar
 *
 * Renders a month-view calendar and a right-side details panel.
 * - The calendar grid is derived from the `currentDate` month.
 * - Each day's background color reflects hover/selection and how many employees are off.
 * - The side panel lists employees off for the selected day and lets you delete entries.
 *
 * Data flow:
 * - `holidays` (prop) is the single source of truth (owned by Dashboard).
 * - After deleting, we call `onDelete()` so the parent reloads from the backend.
 */

import { useState, useMemo } from "react";                  // React hooks
import { deleteHoliday, type Holiday } from "../api/holidays"; // API helper + shared type
import Modal from "./Modal";                                 // Placeholder modal

interface Props {
  /** Holidays list coming from the parent (Dashboard). */
  holidays: Holiday[];
  /** Callback to trigger a reload in the parent after a deletion. */
  onDelete: () => void;
}

const HolidayCalendar = ({ holidays, onDelete }: Props) => {
  // Tracks which day cell is hovered (for light highlight)
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  // Tracks which date is selected (drives the right-side details panel)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Which month/year is currently being displayed by the calendar
  const [currentDate, setCurrentDate] = useState(new Date());

  /**
   * Convert an ISO-like string "YYYY-MM-DD" to a local Date object.
   * The backend stores dates as strings for simplicity.
   */
  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number); // Split into parts
    return new Date(year, month - 1, day);                      // Construct Date (month is 0-based)
  };

  /**
   * Build a map from `toDateString()` → `Holiday[]`.
   * This expands each holiday interval so we can quickly lookup who is off on any day.
   */
  const daysMap = useMemo(() => {
    const map = new Map<string, Holiday[]>(); // Empty map accumulator

    // Expand each holiday range day-by-day
    holidays.forEach((h) => {
      const start = parseLocalDate(h.start_date); // Start date as Date
      const end = parseLocalDate(h.end_date);     // End date as Date

      // Loop across the inclusive range, adding one day (24h in ms) per iteration
      for (
        let d = new Date(start);
        d <= end;
        d = new Date(d.getTime() + 86400000)      // 1 day = 86_400_000 ms
      ) {
        const key = d.toDateString();             // Stable string for map keys
        if (!map.has(key)) map.set(key, []);      // Initialize if missing
        map.get(key)!.push(h);                    // Append holiday to that day
      }
    });

    return map; // Memoized result used by the calendar grid and panel
  }, [holidays]); // Rebuild only when `holidays` changes

  /**
   * Generate an array of `Date` objects representing all days in the current month.
   * Used to render the 7-column grid.
   */
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();   // e.g., 2025
    const month = currentDate.getMonth();     // 0-based month index
    const firstDay = new Date(year, month, 1);// First day of the month
    const lastDay = new Date(year, month + 1, 0); // Day 0 of next month = last day of current

    const days: Date[] = [];                  // Accumulator for the grid

    // Push a copy of each day into the array (avoid mutating the same Date object)
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [currentDate]); // Regenerate when currentDate changes (user navigates months)

  /**
   * Decide Tailwind classes for each day cell based on:
   * - Selection (dark blue)
   * - Hover (light blue)
   * - Occupancy (yellow for 1, red for 2..3, white for 0)
   */
  const getDayColor = (day: Date) => {
    const key = day.toDateString();               // Normalize key
    const off = daysMap.get(key)?.length || 0;    // How many people are off?

    // Selected day takes precedence
    if (selectedDay && day.toDateString() === selectedDay.toDateString()) {
      return "bg-blue-500 text-white";
    }

    // Hovered day (lighter highlight)
    if (hoveredDay && day.toDateString() === hoveredDay.toDateString()) {
      return "bg-blue-200";
    }

    // Occupancy-based coloring rules
    if (off === 0) return "bg-white";                   // Nobody off
    if (off === 1) return " bg-yellow-400 text-black";  // One person off
    if (off <= 3) return "bg-red-400 text-white";       // Few people off

    // For >= 4, you could add another rule if needed (e.g., darker red/purple).
  };

  /** Go to the previous month (day fixed at 1 to avoid date overflow). */
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  /** Go to the next month. */
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  /**
   * Build localized weekday labels (Mon..Sun). We anchor on a known Monday (1970-01-05).
   */
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(1970, 0, 5 + i); // 1970-01-05 (Monday) + i days
    return day.toLocaleString("default", { weekday: "short" });
  });

  /**
   * Delete a holiday and delegate the data refresh to the parent.
   * Keeping the parent (Dashboard) as the single source of truth avoids data drift.
   */
  const handleDelete = async (id: string) => {
    await deleteHoliday(id); // DELETE /holidays/:id
    onDelete();              // Ask the parent to reload from the backend
  };

  return (
    <div className="flex justify-between  w-full py-6 px-10 ">
      {/* LEFT: Calendar (month header + grid) */}
      <div>
        {/* Header with month navigation */}
        <div className="flex justify-between w-full mb-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer active:bg-blue-500"
            onClick={prevMonth}
          >
            {"<"}
          </button>
          <h2 className="text-lg font-bold capitalize">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer active:bg-blue-500"
            onClick={nextMonth}
          >
            {">"}
          </button>
        </div>

        {/* Week header + month days grid */}
        <div className="grid grid-cols-7  gap-1 ">
          {/* Weekday headings */}
          {weekDays.map((d) => (
            <div key={d} className="text-center font-bold capitalize">
              {d}
            </div>
          ))}

          {/* Day cells of the month */}
          {monthDays.map((day) => (
            <div
              key={day.toDateString()}
              className={`w-26 h-26 flex items-center justify-center rounded cursor-pointer ${getDayColor(
                day
              )}`}
              onMouseEnter={() => setHoveredDay(day)}   // Track hover start
              onMouseLeave={() => setHoveredDay(null)}  // Track hover end
              onClick={() => setSelectedDay(day)}       // Select date to show details on right
            >
              {day.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Details panel for the selected date */}
      <div>
        {selectedDay && daysMap.get(selectedDay.toDateString()) && (
          <div className="p-4 mt-3 rounded shadow w-80 text-center bg-gray-100">
            {/* Selected date heading */}
            <strong>{selectedDay.toDateString()}</strong>

            {/* List employees who are off on that day */}
            <ul>
              {daysMap.get(selectedDay.toDateString())!.map((h) => (
                <li key={h.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm mt-2">
                  <span>{h.employee_name}</span>
                  {/* Delete control for this holiday */}
                  <button onClick={() => handleDelete(h.id)} className="px-2 py-1 text-sm bg-red-500 text-white rounded">
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {/* Placeholder modal component */}
            <p className="mt-3">Off: </p>
            <Modal isModalOpen={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayCalendar;
