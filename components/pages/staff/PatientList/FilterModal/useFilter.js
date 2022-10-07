import { useCallback, useEffect, useMemo, useState } from "react";

import { isAfter, isBefore, isSameDay } from "date-fns";

const ALL = "-";
const useFilter = ({
  data = [],
  startDate: defaultStartDate = "",
  endDate: defaultEndDate = "",
  branch: defaultBranch = ALL,
  service: defaultService = ALL,
}) => {
  const [initialData, setInitialData] = useState(data);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [branch, setBranch] = useState(defaultBranch);
  const [service, setService] = useState(defaultService);

  const filters = {
    startDate,
    endDate,
    branch,
    service,
  };

  const filteredData = useCallback(() => {
    let filtered = initialData;

    if (startDate || endDate) {
      filtered = filtered.filter((i) => {
        const d1 = new Date(i.date);
        const d2 = new Date(startDate);
        const d3 = new Date(endDate);

        let isA = true;
        let isB = true;

        if (startDate) isA = isSameDay(d2, d1) || isAfter(d1, d2);
        if (endDate) isB = isSameDay(d3, d1) || isBefore(d1, d3);

        return isA && isB;
      });
    }

    if (branch != ALL) {
      filtered = filtered.filter((i) => i.branchId === branch);
    }

    if (service != ALL) {
      filtered = filtered.filter((i) => i.serviceId === service);
    }

    return filtered;
  }, [initialData, startDate, endDate, branch, service]);

  const filtered = filteredData();

  const setData = (data) => {
    setInitialData(data);
  };

  const setFilters = (f) => {
    setStartDate(f?.startDate);
    setEndDate(f?.endDate);
    setBranch(f?.branch);
    setService(f?.service);
  };

  const clear = () => {
    setStartDate("");
    setEndDate("");
    setBranch(ALL);
    setService(ALL);
  };

  const hasFilter =
    !!startDate || !!endDate || branch !== ALL || service !== ALL;

  return {
    filtered,
    filters,
    hasFilter,
    setData,
    setFilters,
    setStartDate,
    setEndDate,
    setBranch,
    setService,
    clear,
  };
};

export default useFilter;
