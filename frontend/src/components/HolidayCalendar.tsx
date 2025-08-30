// import { useEffect, useRef } from "react";
// import { gantt } from "dhtmlx-gantt";
// // import "/css/dhtmlxgantt.css";
// import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

// import type { Holiday } from "../api/holidays";

// interface Props {
//   holidays: Holiday[];
// }

// export const GanttChart = ({ holidays }: Props) => {
//   //   const tasks = holidays.map((h) => ({
//   //     id: String(h.id),
//   //     name: h.employee_name,
//   //     start: h.start_date,
//   //     end: h.end_date,
//   //     progress: 100,
//   //   }));

//   const ganttContainer = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!ganttContainer.current) return;

//     gantt.init(ganttContainer.current);

//     gantt.clearAll();

//     gantt.parse({
//       data: holidays.map((h) => ({
//         id: h.id,
//         name: h.employee_name,
//         start_date: h.start_date,
//         end_date: h.end_date,
//         progress: 1,
//       })),
//       links: [],
//     });

//     gantt.render();
//   }, [holidays]);

//   return (
//     <div ref={ganttContainer} style={{ width: "100%", height: "600px" }} />
//   );
// };
import { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Holiday } from "../api/holidays";

interface Props {
  holidays: Holiday[];
}

const HolidayCalendar = ({ holidays }: Props) => {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

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

  const getColorClass = (day: Date) => {
    const key = day.toDateString();
    const off = daysMap.get(key)?.length || 0;
    if (off === 0) return "";
    if (off === 1) return "bg-red-400 text-white";
    if (off <= 3) return "bg-yellow-400 text-black";
    return "bg-green-400 text-white";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <DayPicker
        mode="single"
        onDayClick={setHoveredDay}
        onDayHover={setHoveredDay}
        modifiersClassNames={{
          // aplica cores dinamicamente
          custom: (day) => getColorClass(day),
        }}
        modifiers={{
          custom: (day) => daysMap.has(day.toDateString()),
        }}
      />
      {hoveredDay && daysMap.get(hoveredDay.toDateString()) && (
        <div className="p-4 bg-gray-100 rounded shadow w-80 text-center">
          <strong>{hoveredDay.toDateString()}</strong>
          <p>
            Off:{" "}
            {daysMap
              .get(hoveredDay.toDateString())!
              .map((h) => h.employee_name)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;
