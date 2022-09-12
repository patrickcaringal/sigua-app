import { useCallback, useEffect, useMemo, useState } from "react";

const useFilter = ({ data = [], defaultName = "" }) => {
  const [initialData, setInitialData] = useState(data);
  const [name, setName] = useState(defaultName);

  const filters = {
    name,
  };

  const filteredData = () => {
    let filtered = initialData;

    if (name) {
      filtered = filtered.filter((i) =>
        i.name.toUpperCase().includes(name.toUpperCase())
      );
    }

    return filtered;
  };

  const filtered = filteredData();

  const setData = (data) => {
    setInitialData(data);
  };

  const onNameChange = (value) => {
    setName(value);
  };

  return { filtered, setData, filters, onNameChange };
};

export default useFilter;
