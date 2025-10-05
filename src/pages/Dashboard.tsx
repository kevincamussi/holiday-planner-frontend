/**
 * Dashboard: main page controlling holidays state.
 */

import { useCallback, useEffect, useState } from "react";
import { getHolidays, type Holiday } from "../api/holidays";
import { HolidayForm, HolidayCalendar } from "../components";
import { useSuggestions } from "../hooks/useSuggestions";

const Dashboard = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const { options: employeeSuggestions, reload: reloadEmployees } =
    useSuggestions("employee_name");
  const { options: departmentSuggestions, reload: reloadDepartments } =
    useSuggestions("department");

  const loadHolidays = useCallback(async (): Promise<void> => {
    const data = await getHolidays();
    setHolidays(data);
  }, []);

  const loadAll = useCallback(async (): Promise<void> => {
    await loadHolidays();
    await Promise.all([reloadEmployees(), reloadDepartments()]);
  }, [loadHolidays, reloadEmployees, reloadDepartments]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-3/4 ">
        <h1 className="text-3xl font-bold mb-6">Holidays Management</h1>
        <HolidayForm
          onAdd={loadAll}
          employeeSuggestions={employeeSuggestions}
          departmentSuggestions={departmentSuggestions}
        />
        <HolidayCalendar
          holidays={holidays}
          onDelete={loadAll}
          reloadEmployees={reloadEmployees}
          reloadDepartments={reloadDepartments}
        />
      </div>
    </div>
  );
};

export default Dashboard;
