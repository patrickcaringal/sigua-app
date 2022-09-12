import React from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Button } from "@mui/material";

const ToolbarButtons = ({
  hasQueueToday,
  hasDoctor,
  isQueueFull,
  isRegOpen,
  isQueueOpen,
  onRegStatus,
  onQueueStatus,
  onResetQueue,
  onDoctorModalOpen,
  onQueueModalOpen,
}) => {
  if (!hasQueueToday)
    return (
      <Button
        variant="contained"
        size="small"
        onClick={onQueueModalOpen}
        startIcon={<AddCircleIcon />}
        disabled={hasQueueToday}
      >
        add queue
      </Button>
    );

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={onRegStatus}
        startIcon={isRegOpen ? <VisibilityOffIcon /> : <VisibilityIcon />}
        disabled={!isRegOpen && isQueueFull}
      >
        {`${isRegOpen ? "close" : "open"}`} registration
      </Button>
      <Button
        disabled={!hasDoctor}
        variant="outlined"
        size="small"
        onClick={onQueueStatus}
        startIcon={isQueueOpen ? <StopIcon /> : <PlayArrowIcon />}
      >
        {`${isQueueOpen ? "stop" : "start"}`} queue
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={onDoctorModalOpen}
        startIcon={<AddCircleIcon />}
      >
        add doctor
      </Button>
      <Button
        variant="contained"
        color="warning"
        size="small"
        onClick={onResetQueue}
      >
        Reset
      </Button>
    </>
  );
};

export default ToolbarButtons;
