import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfWeek,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../../contexts/ResponseDialogContext";
import { usePagination, useRequest } from "../../../../../../hooks";
import { getAllQueuesReq } from "../../../../../../modules/firebase";
import { formatTimeStamp } from "../../../../../../modules/helper";
import { exportQueueList } from "../../../../../../modules/pdf";
import {
  ACTION_ICONS,
  Input,
  PATHS,
  Pagination,
  TableContainer,
  getActionButtons,
} from "../../../../../common";
import { AdminMainContainer } from "../../../../../shared";
import CollapsibleRow from "../CollapsibleRow";
import FilterModal from "../FilterModal";
import useFilter from "../FilterModal/useFilter";

const generateKey = (d) => formatTimeStamp(d, "MMM dd");

export const compute = ({ branches, data, start, end }) => {
  const weeks = eachDayOfInterval({
    start: new Date(start),
    end: new Date(end),
  });

  // filter date range
  data = data.filter((i) => {
    const d1 = new Date(i.queueDate);
    const d2 = new Date(start);
    const d3 = new Date(end);

    let isA = isSameDay(d2, d1) || isAfter(d1, d2);
    let isB = isSameDay(d3, d1) || isBefore(d1, d3);

    return isA && isB;
  });

  // init month total json
  const tData = weeks.reduce((a, i) => {
    const key = generateKey(i);
    a[key] = {};

    branches.forEach((j) => {
      a[key][j.id] = 0;
    });

    return a;
  }, {});

  // init branch total
  let bData = branches.reduce((a, i) => {
    a[i.id] = 0;
    return a;
  }, {});
  bData.total = 0;

  // compute
  data.forEach((i) => {
    const k1 = generateKey(i.queueDate);
    const k2 = i.branchId;
    const count = i?.done?.length + i?.skipped?.length;
    tData[k1][k2] += count;
    bData[k2] += count;
    bData.total += count;
  });

  return { tData, bData, weeks };
};

const PerCustomTable = ({ data, start, end, branches }) => {
  const { weeks, tData, bData } = compute({
    branches,
    data,
    start,
    end,
  });

  return (
    <TableContainer maxHeight="calc(100vh - 64px - 64px - 15px)">
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {[
              {
                text: `${formatTimeStamp(
                  start,
                  "MMM dd, yyyy"
                )} - ${formatTimeStamp(end, "MMM dd, yyyy")}`,
              },
              ...branches.map((j) => ({
                text: j.name,
                // sx: { width: 200 },
                align: "right",
              })),
              { text: "TOTAL", align: "right", sx: { width: 100 } },
            ].map(({ text, align, sx }) => (
              <TableCell
                key={text}
                {...(align && { align })}
                {...(sx && { sx: { ...sx, fontWeight: "bold", p: 2 } })}
              >
                {text}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {weeks.map((i, idx) => {
            const week = generateKey(i);
            const v = lodash.values(tData[week]);
            const sum = lodash.sum(v);

            return (
              <TableRow key={idx}>
                <TableCell>{formatTimeStamp(i, "MMM dd yyyy (eee)")}</TableCell>
                {branches.map((j) => {
                  return (
                    <TableCell key={j.branchId} align="right">
                      {tData[week][j.id] || "-"}
                    </TableCell>
                  );
                })}
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {sum}
                </TableCell>
              </TableRow>
            );
          })}

          <TableRow>
            <TableCell sx={{ fontWeight: "bold", p: 2 }}>TOTAL</TableCell>
            {lodash.values(bData).map((i, idx) => (
              <TableCell
                key={idx}
                align="right"
                sx={{ fontWeight: "bold", p: 2 }}
              >
                {i}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PerCustomTable;
