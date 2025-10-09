/**
 * Form to create a holiday. Calls onAdd after successful creation.
 */

import React, { useState } from "react";
import { createHoliday } from "../api/holidays";
// import { useSuggestions } from "../hooks/useSuggestions";
import { useDropdownSuggestions } from "../hooks/useDropdownSuggestions";
import { onlyLetters } from "../utils/onlyLetters";

interface Props {
  readonly onAdd: () => void;
  readonly employeeSuggestions: string[];
  readonly departmentSuggestions: string[];
}

const HolidayForm = ({
  onAdd,
  employeeSuggestions,
  departmentSuggestions,
}: Props) => {
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    isOpen: isEmployeeListOpen,
    setIsOpen: setIsEmployeeListOpen,
    filtered: filteredEmployees,
  } = useDropdownSuggestions(employeeSuggestions, employeeName);

  const {
    isOpen: isDepartmentListOpen,
    setIsOpen: setIsDepartmentListOpen,
    filtered: filteredDepartments,
  } = useDropdownSuggestions(departmentSuggestions, department);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createHoliday({
        employeeName,
        department,
        startDate,
        endDate,
      });
      setEmployeeName("");
      setDepartment("");
      setStartDate("");
      setEndDate("");
      onAdd();
    } catch (error: any) {
      if (error.response) {
        alert("erro ao criar holiday");
      } else if (error.request) {
        alert("erro no servidor");
      } else {
        alert("erro ");
      }
    }
  };

  return (
    <form
      className="flex flex-col md:flex-row flex-wrap w-full p-4 gap-3 bg-gray-200 rounded shadow"
      onSubmit={handleSubmit}
    >
      <div className="relative flex-1 min-w-[200px]">
        <input
          autoComplete="off"
          id="employeeName"
          name="employeeName"
          className="w-full text-center capitalize py-2 border rounded"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => {
            setEmployeeName(onlyLetters(e.target.value));
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
                className="py-2 cursor-pointer bg- hover:bg-blue-100 text-center"
                onMouseDown={() => {
                  setEmployeeName(name);
                  setIsEmployeeListOpen(false);
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="relative flex-1 min-w-[200px]">
        <input
          autoComplete="off"
          id="department"
          name="department"
          className="w-full py-2 border rounded text-center capitalize"
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
                className="py-2 cursor-pointer bg- hover:bg-blue-100 text-center"
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
      <div className="flex-1 min-w-[150px]">
        <input
          id="startDate"
          name="startDate"
          className="cursor-pointer w-full  border rounded py-2 flex justify-center "
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          min={"2000-12-31"}
          max={"9999-12-31"}
        />
      </div>
      <div className="flex-1 min-w-[150px]">
        <input
          id="endDate"
          name="endDate"
          className="cursor-pointer w-full flex justify-center border rounded py-2"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          min={"2000-12-31"}
          max={"9999-12-31"}
        />
      </div>
      <div className="flex-1 min-w-[150px]">
        <button
          className=" w-full border rounded bg-gray-300 cursor-pointer hover:bg-blue-500 text-center py-2"
          type="submit"
        >
          Add holiday
        </button>
      </div>
    </form>
  );
};

export default HolidayForm;
