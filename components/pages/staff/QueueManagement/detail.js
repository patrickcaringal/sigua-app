import React, { useEffect, useLayoutEffect, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getQueueReq } from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  localUpdateDocs,
  pluralize,
  today,
} from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  PATHS,
  confirmMessage,
  getActionButtons,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import QueueComponent from "../QueueToday/QueueComponent";
import Header from "./Header";

const QueueDetailPage = () => {
  const router = useRouter();
  const queueId = router.query.id;

  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getQueue, getQueueLoading] = useRequest(
    getQueueReq,
    setBackdropLoader
  );

  // Local States
  const [queue, setQueue] = useState({});
  const isLoading = getQueueLoading;
  const showConent = !isLoading && !!lodash.keys(queue).length;

  const doctors = lodash.values(queue?.counters).map((i) => i.name);
  const stuckedItems = showConent
    ? [
        ...queue?.queue,
        ...queue?.next,
        ...lodash.values(queue?.counters).reduce((acc, i) => {
          return [...acc, ...i.queue];
        }, []),
      ]
    : [];

  useLayoutEffect(() => {
    const fetchQueue = async () => {
      // Get Queues
      const payload = { id: queueId };
      const { data, error: getError } = await getQueue(payload);
      if (getError) return openErrorDialog(getError);

      setQueue(data);
    };

    fetchQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.STAFF.DASHBOARD),
        paths: [{ text: "Queue" }, { text: "Detail" }],
      }}
    >
      {showConent && (
        <>
          <Header
            branch={queue.branchName}
            date={queue.queueDate || ""}
            registered={queue.nextQueueNo - 1}
            capacity={queue.capacity}
            served={queue.done.length}
            skipped={queue.skipped.length}
            doctors={doctors}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "auto auto auto",
              gap: 3,
              mx: 2,
              mt: 3,
            }}
          >
            {!!queue?.done?.length && (
              <QueueComponent
                title="Served Patiens"
                queue={queue.done}
                displayMoveButton={false}
                maxHeight="calc(100vh - 64px - 64px - 80px - 128px)"
              />
            )}
            {!!queue?.skipped?.length && (
              <QueueComponent
                title="No Show Patients"
                queue={queue.skipped}
                displayMoveButton={false}
                maxHeight="calc(100vh - 64px - 64px - 80px - 128px)"
              />
            )}
            {/* TODO: apply move to done */}
            {/* {!!stuckedItems.length && (
              <QueueComponent
                title="Stucked Patients"
                queue={stuckedItems}
                displayMoveButton={false}
                maxHeight="calc(100vh - 64px - 64px - 80px - 128px)"
              />
            )} */}
          </Box>
        </>
      )}
    </AdminMainContainer>
  );
};

export default QueueDetailPage;
