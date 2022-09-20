import React, { useEffect, useState } from "react";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { subDays } from "date-fns";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getQueuesByBranchDateRangeReq } from "../../../../modules/firebase";
import { today } from "../../../../modules/helper";
import QueueGraph from "./QueueGraph";
import ServiceGraph from "./ServiceGraph";

const DashboardPage = () => {
  const { user } = useAuth();

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getQueues] = useRequest(
    getQueuesByBranchDateRangeReq,
    setBackdropLoader
  );

  // Local States
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      // Get Queues
      const payload = {
        id: user.branch,
        start: subDays(new Date(), 7),
        end: new Date(),
      };
      const { data, error: getError } = await getQueues(payload);
      if (getError) return openErrorDialog(getError);

      console.log(payload, data);
      setQueues(data);
    };

    fetchQueues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        // display: "flex",
        // flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center",
        p: 3,
        // border: "1px solid red",
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight={500}>
        Mamatid Branch
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Card sx={{ width: 371, height: 150 }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "inherit",
              height: "inherit",
            }}
          >
            <Typography variant="h3" fontWeight={500}>
              22
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Patients with record
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: 371, height: 150 }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "inherit",
              height: "inherit",
            }}
          >
            <Typography variant="h3" fontWeight={500}>
              10
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Patients for Approval
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <QueueGraph />
        <ServiceGraph />
      </Box>
    </Box>
  );
};

export default DashboardPage;
