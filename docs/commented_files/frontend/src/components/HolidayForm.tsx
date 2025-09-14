/**
 * HolidayForm
 *
 * Collects user input to create a new holiday:
 * - employee name
 * - start date
 * - end date
 *
 * After a successful submission, it triggers `onAdd` so the parent (Dashboard)
 * reloads the list from the backend.
 */

import React, { useState } from "react";          // React + useState for controlled inputs
import { createHoliday } from "../api/holidays";  // API helper to POST /holidays

interface Props {
  /** Callback invoked after a successful create; parent should reload data. */
  onAdd: () => void;
}

const HolidayForm = ({ onAdd }: Props) => {
  // Controlled input: employee's name
  const [employee_name, setEmployee_name] = useState("");

  // Controlled inputs: start/end date (strings in YYYY-MM-DD)
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  /**
   * Handle form submission:
   * - Prevent default browser submit
   * - Call backend to create a holiday
   * - Clear inputs
   * - Notify parent to reload
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Don't reload the page
    await createHoliday({ employee_name, start_date: start, end_date: end }); // POST payload
    setEmployee_name(""); // Reset inputs after success
    setStart("");
    setEnd("");
    onAdd(); // Ask parent to refresh holidays
  };

  return (
    <div className="flex  bg-gray-200 rounded">
      {/* Form container with spacing */}
      <form
        className="flex w-full p-4 items-center gap-4"
        onSubmit={handleSubmit}
      >
        {/* Employee name input (controlled) */}
        <input
          className="flex-1 border rounded text-center"
          placeholder="Employee Name"
          value={employee_name}
          onChange={(e) => setEmployee_name(e.target.value)}
          required
        />

        {/* Start date (controlled) */}
        <input
          className="cursor-pointer flex-1 border rounded text-center"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          min={"2000-12-31"}
          max={"9999-12-31"}
        />

        {/* End date (controlled) */}
        <input
          className="cursor-pointer flex-1 border rounded  text-center"
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          min={"2000-12-31"}
          max={"9999-12-31"}
        />

        {/* Submit button to create a new holiday */}
        <button
          className="flex-1 border rounded bg-gray-300 cursor-pointer hover:bg-blue-500"
          type="submit"
        >
          Add holiday
        </button>
      </form>
    </div>
  );
};

export default HolidayForm;
