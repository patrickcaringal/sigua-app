import { useCallback, useEffect, useMemo, useState } from "react";

import { isAfter, isBefore, isSameDay } from "date-fns";

const ALL = "-";
const useFilter = ({
  data = [],
  rangeDisplay: defaultRangeDisplay = ALL,
  startDate: defaultStartDate = "",
  endDate: defaultEndDate = "",
  branch: defaultBranch = ALL,
}) => {
  const [initialData, setInitialData] = useState(data);
  const [rangeDisplay, setRangeDisplay] = useState(defaultRangeDisplay);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [branch, setBranch] = useState(defaultBranch);

  const filters = {
    rangeDisplay,
    startDate,
    endDate,
    branch,
    // service,
  };

  const filteredData = useCallback(() => {
    let filtered = initialData;

    if (startDate || endDate) {
      filtered = filtered.filter((i) => {
        const d1 = new Date(i.queueDate);
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

    return filtered;
  }, [initialData, startDate, endDate, branch]);

  const filtered = filteredData();

  const setData = (data) => {
    setInitialData(data);
  };

  const setFilters = (f) => {
    setRangeDisplay(f?.rangeDisplay);
    setStartDate(f?.startDate);
    setEndDate(f?.endDate);
    setBranch(f?.branch);
  };

  const clear = () => {
    setRangeDisplay("permonth");
    setStartDate("");
    setEndDate("");
    setBranch(ALL);
  };

  const hasFilter = !!startDate || !!endDate || branch !== ALL;

  return {
    filtered,
    filters,
    hasFilter,
    setData,
    setFilters,
    setRangeDisplay,
    setStartDate,
    setEndDate,
    setBranch,
    // setService,
    clear,
  };
};

export default useFilter;
