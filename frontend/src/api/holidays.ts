import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface Holiday {
  id: number;
  employee_name: string;
  start_date: string;
  end_date: string;
}

export const getHolidays = async (): Promise<Holiday[]> => {
  const res = await axios.get(`${API_URL}/holidays`);
  return res.data;
};

export const createHoliday = async (holiday: Omit<Holiday, "id">) => {
  const res = await axios.post(`${API_URL}/holidays`, holiday);
  return res.data;
};

export const deleteHoliday = async (id: number) => {
  await axios.delete(`${API_URL}/holidays/${id}`);
};
