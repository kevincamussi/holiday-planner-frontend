import { useEffect, useState } from "react";
import { getHolidays } from "../api/holidays";
import type { Holiday } from "../api/holidays";
import HolidayForm from "../components/HolidayForm";
import { GanttChart } from "../components/GanttChart";

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
    <div>
      <h1>Holidays Calendar</h1>
      <HolidayForm onAdd={loadHolidays} />
      <GanttChart holidays={holidays} />
    </div>
  );
};

export default Dashboard;
