import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getAutocomplete = async (
  field: "employee_name" | "department"
): Promise<string[]> => {
  const res = await axios.get(
    `${API_URL}/holidays/autocomplete?field=${field}`
  );
  return res.data;
};
