import { useCallback, useEffect, useState } from "react";
import { getAutocomplete } from "../api/autocomplete";

type Field = "employee_name" | "department";

export const useSuggestions = (field: Field) => {
  const [options, setOptions] = useState<string[]>([]);

  const reload = useCallback((): void => {
    getAutocomplete(field).then((data: string[]) => {
      const formatted = data.map(
        (v: string) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
      );
      setOptions(Array.from(new Set(formatted)));
    });
  }, [field]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { options, reload };
};
