import { useEffect, useRef } from "react";
import { gantt } from "dhtmlx-gantt";
// import "/css/dhtmlxgantt.css";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

import type { Holiday } from "../api/holidays";

interface Props {
  holidays: Holiday[];
}

export const GanttChart = ({ holidays }: Props) => {
  //   const tasks = holidays.map((h) => ({
  //     id: String(h.id),
  //     name: h.employee_name,
  //     start: h.start_date,
  //     end: h.end_date,
  //     progress: 100,
  //   }));

  const ganttContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ganttContainer.current) return;

    gantt.init(ganttContainer.current);

    gantt.clearAll();

    gantt.parse({
      data: holidays.map((h) => ({
        id: h.id,
        name: h.employee_name,
        start_date: h.start_date,
        end_date: h.end_date,
        progress: 1,
      })),
      links: [],
    });

    gantt.render();
  }, [holidays]);

  return (
    <div ref={ganttContainer} style={{ width: "100%", height: "500px" }} />
  );
};
