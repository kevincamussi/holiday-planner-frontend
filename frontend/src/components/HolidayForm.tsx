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
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        placeholder="Employee Name"
        value={employee_name}
        onChange={(e) => setEmployee_name(e.target.value)}
        required
      />
      <input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
      />
      <input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        required
      />
      <button type="submit">Adicionar</button>
    </form>
  );
};

export default HolidayForm;
