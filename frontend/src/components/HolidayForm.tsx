/**
 * Form to create a holiday. Calls onAdd after successful creation.
 */

import React, { useState } from "react";
import { createHoliday } from "../api/holidays";
import { useSuggestions } from "../hooks/useSuggestions";
import { useDropdownSuggestions } from "../hooks/useDropdownSuggestions";
import { onlyLetters } from "../utils/onlyLetters";

interface Props {
  onAdd: () => void;
}

const HolidayForm = ({ onAdd }: Props) => {
  const [employee_name, setEmployee_name] = useState("");
  const [department, setDepartment] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");

  const { options: employeeSuggestions, reload: reloadEmployees } =
    useSuggestions("employee_name");
  const { options: departmentSuggestions, reload: reloadDepartments } =
    useSuggestions("department");

  const {
    isOpen: isEmployeeListOpen,
    setIsOpen: setIsEmployeeListOpen,
    filtered: filteredEmployees,
  } = useDropdownSuggestions(employeeSuggestions, employee_name);

  const {
    isOpen: isDepartmentListOpen,
    setIsOpen: setIsDepartmentListOpen,
    filtered: filteredDepartments,
  } = useDropdownSuggestions(departmentSuggestions, department);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createHoliday({ employee_name, department, start_date, end_date });
    setEmployee_name("");
    setDepartment("");
    setStart_date("");
    setEnd_date("");

    reloadEmployees();
    reloadDepartments();

    onAdd();
  };

  return (
    <div className="flex  bg-gray-200 rounded">
      <form
        className="flex w-full p-4 items-center gap-4"
        onSubmit={handleSubmit}
      >
        <div className="w-full relative">
          <input
            autoComplete="off"
            id="employeeName"
            name="employeeName"
            className="w-full px-2 border rounded text-center capitalize"
            placeholder="Employee Name"
            value={employee_name}
            onChange={(e) => {
              setEmployee_name(onlyLetters(e.target.value));
            }}
            onFocus={() => setIsEmployeeListOpen(true)}
            onBlur={() => setTimeout(() => setIsEmployeeListOpen(false), 100)}
            required
          />
          {isEmployeeListOpen && filteredEmployees.length > 0 && (
            <ul className="absolute w-full bg-white border rounded mt-1 shadow-lg max-h-40 overflow-y-auto z-10">
              {filteredEmployees.map((name) => (
                <li
                  key={name}
                  className="px-3 py-2 cursor-pointer bg- hover:bg-blue-100 text-center"
                  onMouseDown={() => {
                    setEmployee_name(name);
                    setIsEmployeeListOpen(false);
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative w-full">
          <input
            autoComplete="off"
            id="department"
            name="department"
            className="w-full px-2 border rounded text-center capitalize"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(onlyLetters(e.target.value))}
            onFocus={() => setIsDepartmentListOpen(true)}
            onBlur={() => setTimeout(() => setIsDepartmentListOpen(false), 100)}
            required
          />
          {isDepartmentListOpen && filteredDepartments.length > 0 && (
            <ul className="absolute w-full bg-white border rounded mt-1 shadow-lg max-h-40 overflow-y-auto z-10">
              {filteredDepartments.map((department) => (
                <li
                  key={department}
                  className="px-3 py-2 cursor-pointer bg- hover:bg-blue-100 text-center"
                  onMouseDown={() => {
                    setDepartment(department);
                    setIsDepartmentListOpen(false);
                  }}
                >
                  {department}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          id="startDate"
          name="startDate"
          className="cursor-pointer flex-1 border rounded text-center"
          type="date"
          value={start_date}
          onChange={(e) => setStart_date(e.target.value)}
          required
          min={"2000-12-31"}
          max={"9999-12-31"}
        />
        <input
          id="endDate"
          name="endDate"
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
