import React, { useState } from "react";
import { createHoliday } from "../api/holidays";

interface Props {
  onAdd: () => void;
}

const HolidayForm = ({ onAdd }: Props) => {
  const [employee_name, setEmployee_name] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createHoliday({ employee_name, start_date: start, end_date: end });
    setEmployee_name("");
    setStart("");
    setEnd("");
    onAdd();
  };

  return (
    <div className="flex  bg-gray-200 rounded">
      <form
        className="flex w-full p-4 items-center gap-4"
        onSubmit={handleSubmit}
      >
        <input
          className="flex-1 border rounded text-center"
          placeholder="Employee Name"
          value={employee_name}
          onChange={(e) => setEmployee_name(e.target.value)}
          required
        />
        <input
          className="cursor-pointer flex-1 border rounded text-center"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          min={"2000-12-31"}
          max={"9999-12-31"}
        />

        <input
          className="cursor-pointer flex-1 border rounded  text-center"
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          min={"2000-12-31"}
          max={"9999-12-31"}
        />
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
