/**
 * Calendar showing holidays for the current month.
 * Right-side panel shows details for selected day.
 */

import { useState, useMemo } from "react";
import { deleteHoliday, type Holiday } from "../api/holidays";
import { formatLongDate } from "../utils/date";
import Modal from "./Card";

interface Props {
  holidays: Holiday[];
  onDelete: () => void;
}

const HolidayCalendar = ({ holidays, onDelete }: Props) => {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);

  // const parseLocalDate = (dateStr: string) => {
  //   const [year, month, day] = dateStr.split("-").map(Number);
  //   return new Date(year, month - 1, day);
  // };

  // const daysMap = useMemo(() => {
  //   const map = new Map<string, Holiday[]>();
  //   holidays.forEach((h) => {
  //     const start = parseLocalDate(h.start_date);
  //     const end = parseLocalDate(h.end_date);

      
  //     for (
  //       let d = new Date(start);
  //       d <= end;
  //       d = new Date(d.getTime() + 86400000)
  //     ) {
  //       const key = d.toDateString();
  //       if (!map.has(key)) map.set(key, []);
  //       // map.get(key)!.push(h);

  //       const exists = map.get(key)!.some((x)=> x.id === h.id)

  //       if(!exists) {
  //         map.get(key)!.push(h)
  //       }

  //     }
  //   });
  //   return map;
  // }, [holidays]);
const daysMap = useMemo(() => {
  const map = new Map<string, Holiday[]>();
  holidays.forEach((h) => {
    h.days.forEach((dayStr) => {
      const key = new Date(dayStr).toDateString();
      if (!map.has(key)) map.set(key, []);
      const exists = map.get(key)!.some((x) => x.id === h.id);
      if (!exists) map.get(key)!.push(h);
    });
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

    if (selectedDay && day.toDateString() === selectedDay.toDateString()) {
      return "bg-blue-500 text-white";
    }
    if (hoveredDay && day.toDateString() === hoveredDay.toDateString()) {
      return "bg-blue-200";
    }
    if (off === 0) return "bg-white";
    if (off === 1) return " bg-yellow-400 text-black";
    if (off === 2) return "bg-orange-400 text-white"
    if (off >= 3) return "bg-red-400 text-white";
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(1970, 0, 5 + i);
    return day.toLocaleString("default", { weekday: "short" });
  });

  const toggleDay = (day: Date) => {
    setSelectedDay(day);
    const holidaysForDay = daysMap.get(day.toDateString()) ?? [];
    setIsCardOpen(holidaysForDay.length > 0);
  };

  const handleDelete = async (id: string) => {
    await deleteHoliday(id);
    onDelete();

    if (selectedDay) {
      const remaining = holidaysForDay.filter((h) => h.id !== id);

      if (remaining.length === 0) {
        setIsCardOpen(false);
        setSelectedDay(null);
      }
    }
  };

  const holidaysForDay = selectedDay ? daysMap.get(selectedDay.toDateString()) ?? [] : [];


  console.log(isCardOpen);

  return (
    <div className="flex justify-between  w-full py-6 px-10 ">
      <div>
        <div className="flex justify-between w-full mb-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer active:bg-blue-500"
            onClick={prevMonth}
          >
            {"<"}
          </button>
          <h2 className="text-lg font-bold capitalize">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer active:bg-blue-500"
            onClick={nextMonth}
          >
            {">"}
          </button>
        </div>

        <div className="grid grid-cols-7  gap-1 ">
          {weekDays.map((d) => (
            <div key={d} className="text-center font-bold capitalize">
              {d}
            </div>
          ))}

          {monthDays.map((day) => (
            <div
              key={day.toDateString()}
              className={`w-26 h-26 flex items-center justify-center rounded cursor-pointer ${getDayColor(
                day
              )}`}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => toggleDay(day)}
            >
              {day.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel with selected day */}
      <div>
        {isCardOpen && selectedDay && holidaysForDay.length > 0 && (
          <div className="p-4 mt-3 rounded shadow w-80 text-center bg-gray-100">
            <strong>{selectedDay.toDateString()}</strong>
            {/* List of employees off on this day */}
            <div>
              {holidaysForDay.map((h) => (
                <Modal 
                  key={h.id}
                  isCardOpen={isCardOpen}
                  employeeName={h.employee_name}
                  department={h.department}
                  startDate={formatLongDate(h.start_date)}
                  endDate={formatLongDate(h.end_date)}
                  onDelete={()=> handleDelete(h.id)}
                />
                
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayCalendar;
