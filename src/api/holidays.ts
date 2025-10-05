import API from "./axios";

export interface Holiday {
  readonly id: string;
  readonly employeeName: string;
  readonly department: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly days: readonly string[];
}

export const getHolidays = async (): Promise<Holiday[]> => {
  const res = await API.get("/holidays");
  return res.data;
};

export const createHoliday = async (
  holiday: Omit<Holiday, "id" | "days">
): Promise<Holiday> => {
  const res = await API.post("/holidays", holiday);
  return res.data;
};

export const deleteHoliday = async (id: string) => {
  await API.delete(`/holidays/${id}`);
};
