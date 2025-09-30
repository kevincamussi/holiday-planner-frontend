import { useState, useEffect } from "react";

export const useDropdownSuggestions = (
  allOptions: string[],
  inputValue: string
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFiltered([]);
      setIsOpen(false);
      return;
    }

    const matches = allOptions.filter((opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase())
    );

    setFiltered(matches);
    setIsOpen(matches.length > 0);
  }, [inputValue, allOptions]);

  return { isOpen, filtered, setIsOpen };
};
