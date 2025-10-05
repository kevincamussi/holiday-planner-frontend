import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface Holiday {
  id: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  days: string[];
}

export const getHolidays = async (): Promise<Holiday[]> => {
  const res = await axios.get(`${API_URL}/holidays`);
  return res.data;
};

export const createHoliday = async (holiday: Omit<Holiday, "id" | "days">) => {
  const res = await axios.post(`${API_URL}/holidays`, holiday);
  return res.data;
};

export const deleteHoliday = async (id: string) => {
  await axios.delete(`${API_URL}/holidays/${id}`);
};
