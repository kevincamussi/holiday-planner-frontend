/**
 * Dashboard page
 *
 * Responsibilities:
 * - Acts as the single source of truth for the `holidays` list on the client.
 * - Loads holidays on mount and passes them down to children.
 * - Provides callbacks so children can request a reload after mutations.
 *
 * Why centralize here?
 * - Avoid duplicate state across child components.
 * - Keep data flow predictable: parent owns data, children render and notify.
 */

import { useEffect, useState } from "react";            // React hooks for state and lifecycle
import { getHolidays, type Holiday } from "../api/holidays"; // API helper + shared Holiday type
import HolidayForm from "../components/HolidayForm";     // Child component to add holidays
import HolidayCalendar from "../components/HolidayCalendar"; // Calendar visualization

const Dashboard = () => {
  // Local state: the single source of truth for holidays in the UI.
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  /**
   * Fetch holidays from the backend and populate local state.
   * In a real app, add error handling and possibly loading states.
   */
  const loadHolidays = async () => {
    const data = await getHolidays(); // GET /holidays
    setHolidays(data);                // Store in state so children can consume
  };

  // On component mount, fetch the initial list of holidays.
  useEffect(() => {
    loadHolidays();
  }, []); // Empty deps → run once

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-200 p-4">
      {/* NOTE: Tailwind doesn't ship `max-w-3/4` by default; if it's a custom class, keep it.
          Otherwise prefer a standard container width or `max-w-[75%]`. */}
      <div className="w-full max-w-3/4 ">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">Holidays Calendar</h1>

        {/* Child form sends a POST and then calls `onAdd` to refresh list. */}
        <HolidayForm onAdd={loadHolidays} />

        {/* Calendar receives `holidays` and a callback to refresh after deletions. */}
        <HolidayCalendar holidays={holidays} onDelete={loadHolidays} />
      </div>
    </div>
  );
};

export default Dashboard;
