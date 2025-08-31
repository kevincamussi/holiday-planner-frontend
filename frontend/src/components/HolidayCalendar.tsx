import { useState, useMemo } from "react";
import type { Holiday } from "../api/holidays";

interface Props {
  holidays: Holiday[];
}

const HolidayCalendar = ({ holidays }: Props) => {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysMap = useMemo(() => {
    const map = new Map<string, Holiday[]>();
    holidays.forEach((h) => {
      const start = new Date(h.start_date);
      const end = new Date(h.end_date);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toDateString();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(h);
      }
    });
    return map;
  }, [holidays]);

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [currentDate]);

  const getDayColor = (day: Date) => {
    const key = day.toDateString();
    const off = daysMap.get(key)?.length || 0;

    // prioridade: selecionado > hover > feriado
    if (selectedDay && day.toDateString() === selectedDay.toDateString()) {
      return "bg-blue-500 text-white";
    }
    if (hoveredDay && day.toDateString() === hoveredDay.toDateString()) {
      return "bg-gray-300";
    }

    if (off === 0) return "bg-white";
    if (off === 1) return "bg-red-400 text-white";
    if (off <= 3) return "bg-yellow-400 text-black";
    return "bg-green-400 text-white";
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-md mb-2">
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={prevMonth}>
          {"<"}
        </button>
        <h2 className="text-lg font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={nextMonth}>
          {">"}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 max-w-md">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-bold">
            {d}
          </div>
        ))}

        {monthDays.map((day) => (
          <div
            key={day.toDateString()}
            className={`w-16 h-16 flex items-center justify-center rounded cursor-pointer ${getDayColor(
              day
            )}`}
            onMouseEnter={() => setHoveredDay(day)}
            onMouseLeave={() => setHoveredDay(null)}
            onClick={() => setSelectedDay(day)}
          >
            {day.getDate()}
          </div>
        ))}
      </div>

      {selectedDay && daysMap.get(selectedDay.toDateString()) && (
        <div className="p-4 rounded shadow w-80 text-center bg-gray-100">
          <strong>{selectedDay.toDateString()}</strong>
          <p>
            Off:{" "}
            {daysMap
              .get(selectedDay.toDateString())!
              .map((h) => h.employee_name)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;
