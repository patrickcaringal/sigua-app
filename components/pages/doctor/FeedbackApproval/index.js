import React, { useCallback, useEffect, useState } from "react";

import FactCheckIcon from "@mui/icons-material/FactCheck";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  LOG_ACTIONS,
  MEMBER_STATUS,
  RESOURCE_TYPE,
  approveFeedbackReq,
  deleteImageReq,
  getForApprovalFeedbacksReq,
  getPatientsForApprovalReq,
  rejectFeedbackReq,
  saveLogReq,
  updatePatientReq,
} from "../../../../modules/firebase";
import {
  calculateAge,
  formatTimeStamp,
  localUpdateDocs,
} from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  ACTION_ICONS,
  Input,
  LongTypography,
  PATHS,
  Pagination,
  TableContainer,
  getActionButtons,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
// import MemberApprovalModal from "./MemberApprovalModal";

const FeedbackApprovalPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getForApprovalFeedbacks] = useRequest(
    getForApprovalFeedbacksReq,
    setBackdropLoader
  );
  const [rejectFeedback] = useRequest(rejectFeedbackReq, setBackdropLoader);
  const [approveFeedback] = useRequest(approveFeedbackReq, setBackdropLoader);

  // Local States
  const [feedbacks, setFeedbacks] = useState([]);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  const fetchFeedback = async () => {
    const { data, error } = await getForApprovalFeedbacks();
    if (error) return openErrorDialog(error);
    setFeedbacks(data);
  };

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(feedbacks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbacks]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleApprove = async (f) => {
    const proceedApprove = async () => {
      const payload = { id: f.id, approvedBy: user.id };

      const { error } = await approveFeedback(payload);
      if (error) return openErrorDialog(error);

      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Feedback",
          verb: "approved",
        }),
        type: "SUCCESS",
      });

      fetchFeedback();
    };

    openResponseDialog({
      content: (
        <>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to approve feedback
          </Typography>
        </>
      ),
      type: "CONFIRM",
      actions: (
        <Button variant="contained" onClick={proceedApprove} size="small">
          approve feedback
        </Button>
      ),
    });
  };

  const handleReject = async (f) => {
    const proceedReject = async () => {
      const payload = { id: f.id };
      const { error } = await rejectFeedback(payload);
      if (error) return openErrorDialog(error);

      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Feedback",
          verb: "rejected",
        }),
        type: "SUCCESS",
      });

      fetchFeedback();
    };

    openResponseDialog({
      content: (
        <>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to reject feedback
          </Typography>
        </>
      ),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={proceedReject}
          size="small"
        >
          reject feedback
        </Button>
      ),
    });
  };

  const handleSearchChange = useCallback(
    (e) => {
      pagination.goToPage(0);
      filtering.onNameChange(e?.target?.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.goToPage, filtering.onNameChange]
  );

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.STAFF.DASHBOARD),
        paths: [{ text: "Feedback Approval" }],
      }}
      toolbarContent={
        <Box sx={{ width: 200 }}>
          <Input
            debounce
            label="Search"
            value={filtering.filters.name}
            onChange={handleSearchChange}
          />
        </Box>
      }
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "User name", sx: { width: 300 } },
                { text: "Date submitted", sx: { width: 140 } },
                { text: "Feedback" },
                // { text: "Age", sx: { width: 40 }, align: "center" },
                // { text: "Gender", sx: { width: 100 } },
                // { text: "Contact No.", sx: { width: 140 } },
                // { text: "Address", sx: { width: 360 } },
                { text: "Actions", sx: { width: 120 }, align: "center" },
              ].map(({ text, align, sx = {} }) => (
                <TableCell
                  key={text}
                  {...(align && { align })}
                  sx={{ ...sx, fontWeight: "bold", p: 2 }}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtering.filtered
              .slice(pagination.info.start, pagination.info.end)
              .map((i) => {
                const { id, accountName, dateCreated, feedback } = i;

                return (
                  <TableRow key={id}>
                    <TableCell>{accountName}</TableCell>
                    <TableCell>
                      {formatTimeStamp(dateCreated, "MMM-dd-yyyy")}
                    </TableCell>
                    <TableCell>
                      <LongTypography text={feedback} displayedLines={3} />
                    </TableCell>
                    <TableCell align="center">
                      {/* <IconButton
                        component="span"
                        onClick={() => handleMemberModalOpen(m)}
                      >
                        <FactCheckIcon />
                      </IconButton> */}
                      {getActionButtons([
                        {
                          action: ACTION_BUTTONS.APPROVE,
                          tooltipText: "Approve",
                          onClick: () => handleApprove(i),
                        },
                        {
                          action: ACTION_BUTTONS.REJECT,
                          tooltipText: "Reject",
                          onClick: () => handleReject(i),
                        },
                      ])}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination pagination={pagination} onChange={handlePageChange} />
    </AdminMainContainer>
  );
};

export default FeedbackApprovalPage;
