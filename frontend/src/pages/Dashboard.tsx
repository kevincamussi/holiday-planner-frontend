import { useEffect, useState } from "react";
import { getHolidays, type Holiday } from "../api/holidays";
import HolidayForm from "../components/HolidayForm";
import HolidayCalendar from "../components/HolidayCalendar";

const Dashboard = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const loadHolidays = async () => {
    const data = await getHolidays();
    setHolidays(data);
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-6">Holidays Calendar</h1>
        <HolidayForm onAdd={loadHolidays} />
        <HolidayCalendar holidays={holidays} />
      </div>
    </div>
  );
};

export default Dashboard;
