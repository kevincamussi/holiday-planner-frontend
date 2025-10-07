/**
 * Calendar showing holidays for the current month.
 * Right-side panel shows details for selected day.
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { deleteHoliday, type Holiday } from "../api/holidays";
import { formatLongDate } from "../utils/date";

import Card from "./Card";

interface Props {
  readonly holidays: Holiday[];
  readonly onDelete: () => void;
  readonly reloadEmployees: () => void;
  readonly reloadDepartments: () => void;
}

const HolidayCalendar = ({
  holidays,
  onDelete,
  reloadEmployees,
  reloadDepartments,
}: Props) => {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [format, setFormat] = useState<"narrow" | "short" | "long">("short");

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
    if (off === 2) return "bg-orange-400 text-white";
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

  useEffect(() => {
    const updateFormat = () => {
      const width = window.innerWidth;
      if (width < 640) setFormat("narrow");
      else if (width < 1440) setFormat("short");
      else setFormat("long");
    };
    updateFormat();
    window.addEventListener("resize", updateFormat);
    return () => window.removeEventListener("resize", updateFormat);
  }, []);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(1970, 0, 5 + i);
    return {
      key: i,
      label: day.toLocaleDateString("default", { weekday: format }),
    };
  });

  const toggleDay = (day: Date) => {
    setSelectedDay(day);
    const holidaysForDay = daysMap.get(day.toDateString()) ?? [];
    setIsCardOpen(holidaysForDay.length > 0);
  };

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteHoliday(id);
      await onDelete();

      reloadEmployees();
      reloadDepartments();

      if (selectedDay) {
        const remaining = holidaysForDay.filter((h) => h.id !== id);

        if (remaining.length === 0) {
          setIsCardOpen(false);
          setSelectedDay(null);
        }
      }
    },
    [onDelete, reloadEmployees, reloadDepartments, selectedDay]
  );

  const holidaysForDay = selectedDay
    ? daysMap.get(selectedDay.toDateString()) ?? []
    : [];

  return (
    <div className="relative flex justify-center lg:justify-between  w-full py-6 text-center lg:px-10 ">
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

        <div className="grid grid-cols-7 gap-1 ">
          {weekDays.map((d) => (
            <div key={d.key} className="text-center font-bold capitalize">
              {d.label}
            </div>
          ))}

          {monthDays.map((day) => (
            <div
              key={day.toDateString()}
              className={`
                w-10
                md:w-24
                lg:w-20
                xl:w-28  
                h-10
                md:h-24
                lg:h-20
                xl:h-28 
                flex 
                items-center
                justify-center
                rounded 
                cursor-pointer 
                  ${getDayColor(day)}`}
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
      <div className="">
        {isCardOpen && selectedDay && holidaysForDay.length > 0 && (
          <div className="p-4 mt-3 absolute right-0 rounded shadow w-full h-full md:w-70 text-center bg-gray-100">
            <strong>{selectedDay.toDateString()}</strong>
            {/* List of employees off on this day */}
            <div className="mt-4">
              {holidaysForDay.map((h) => (
                <Card
                  key={h.id}
                  isCardOpen={isCardOpen}
                  employeeName={h.employeeName}
                  department={h.department}
                  startDate={formatLongDate(h.startDate)}
                  endDate={formatLongDate(h.endDate)}
                  onDelete={() => handleDelete(h.id)}
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
