import React, { Fragment, useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import lodash from "lodash";

import { formatTimeStamp } from "../../../../../modules/helper";
import Header from "./Header";
import Patients from "./Patients";

const CollapsibleRow = ({ data }) => {
  const [detailRowOpen, setDetailRowOpen] = useState(false);

  const {
    id,
    isToday,
    date,
    capacity,
    counters,
    queue = [],
    next = [],
    done = [],
    skipped = [],
    openForRegistration,
    nextQueueNo,
    branchName,
    branchId,
  } = data;
  // const registered = nextQueueNo - 1;
  const registered = done?.length + skipped?.length;
  const doctors = lodash.values(counters).map((i) => i.name);
  const query = {
    branch: branchId,
    startDate: formatTimeStamp(date),
    endDate: formatTimeStamp(date),
  };

  return (
    <>
      <TableRow id={id}>
        <TableCell sx={{ width: 60 }}>
          <IconButton
            size="small"
            onClick={() => setDetailRowOpen(!detailRowOpen)}
          >
            {detailRowOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{formatTimeStamp(date, "MMM-dd-yyyy")}</TableCell>
        <TableCell>{formatTimeStamp(date, "eeee")}</TableCell>
        <TableCell>{branchName}</TableCell>
        <TableCell>
          {registered} / {capacity}
        </TableCell>
      </TableRow>

      {/* Collapsed Row */}
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={detailRowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 9, py: 2 }}>
              <Header
                branch={branchName}
                date={date}
                registered={nextQueueNo - 1}
                capacity={capacity}
                served={done.length}
                skipped={skipped.length}
                doctors={doctors}
              />
              <Patients served={done} noShow={skipped} query={query} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsibleRow;
