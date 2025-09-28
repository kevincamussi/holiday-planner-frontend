/**
 * Form to create a holiday. Calls onAdd after successful creation.
 */

import React, { useState } from "react";
import { createHoliday } from "../api/holidays";

interface Props {
  onAdd: () => void;
}

const HolidayForm = ({ onAdd }: Props) => {
  const [employee_name, setEmployee_name] = useState("");
  const [department, setDepartment] = useState("")
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createHoliday({ employee_name, department, start_date, end_date });
    setEmployee_name("");
    setDepartment("");
    setStart_date("");
    setEnd_date("");
    onAdd();
  };

  return (
    <div className="flex  bg-gray-200 rounded">
      <form
        className="flex w-full p-4 items-center gap-4"
        onSubmit={handleSubmit}
      >
        <input
          className="flex-1 border rounded text-center capitalize"
          placeholder="Employee Name"
          value={employee_name}
          onChange={(e) =>{
            const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, "");
             setEmployee_name(onlyLetters)
          }}
          required
        />
        <input
          className="flex-1 border rounded text-center capitalize"
          placeholder="Department"
          value={department}
          onChange={(e) =>setDepartment(e.target.value)}
          required
        />
        <input
          className="cursor-pointer flex-1 border rounded text-center"
          type="date"
          value={start_date}
          onChange={(e) => setStart_date(e.target.value)}
          required
          min={"2000-12-31"}
          max={"9999-12-31"}
        />
        <input
          className="cursor-pointer flex-1 border rounded  "
          type="date"
          value={end_date}
          onChange={(e) => setEnd_date(e.target.value)}
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
