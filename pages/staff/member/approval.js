import React, { useEffect, useState } from "react";

import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { MemberApprovalModal } from "../../../components";
import { useBackdropLoader } from "../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../contexts/ResponseDialogContext";
import useRequest from "../../../hooks/useRequest";
import { getMemberForApprovalReq } from "../../../modules/firebase";
import { getFullName, getUniquePersonId } from "../../../modules/helper";
const LOCAL_MODE = false;

const DashboardPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const [getMemberForApproval] = useRequest(
    getMemberForApprovalReq,
    setBackdropLoader
  );
  //   const [addStaff] = useRequest(addStaffReq);

  const [accounts, setAccounts] = useState([]); // used to pull Family members
  const [members, setMembers] = useState([]);
  const [memberApprovalModalOpen, setMemberApprovalModalOpen] = useState(false);
  const [memberApprovalModalState, setMemberApprovalModalState] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    if (LOCAL_MODE) return;

    const fetch = async () => {
      // Get Members
      const { data: accountList, error: getMembersError } =
        await getMemberForApproval({});
      if (getMembersError) return openErrorDialog(getMembersError);

      setAccounts(accountList);

      const memberList = accountList.reduce((acc, m) => {
        let notVerifiedMember = m.familyMembers.filter(
          (i) => !i.verified && i.verificationAttachment
        );

        // No Not Verified member, exit
        if (notVerifiedMember.length === 0) return acc;

        const requester = getFullName(m);
        notVerifiedMember = notVerifiedMember.map((i) => ({ ...i, requester }));

        return [...acc, ...notVerifiedMember];
      }, []);

      setMembers(memberList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMemberModalOpen = (m) => {
    const { verificationAttachment, requester } = m;
    setMemberApprovalModalState({
      open: true,
      data: { src: verificationAttachment, requester, member: getFullName(m) },
    });
  };

  const handleMemberModalClose = () => {
    setMemberApprovalModalState({
      open: false,
      data: null,
    });
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        mx: 4,
      }}
    >
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              href="#"
              underline="hover"
              color="inherit"
              onClick={(e) => {
                e.preventDefault();
                router.push("/doctor/dashboard");
              }}
            >
              <HomeIcon sx={{ mt: "4px" }} />
            </Link>
            <Typography color="text.primary">Member Approval</Typography>
          </Breadcrumbs>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={() => {}}
          sx={{ mr: 2 }}
          disabled
        >
          Approve
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => {}}
          disabled
        >
          Reject
        </Button>
      </Toolbar>

      <Box>
        <Paper
          elevation={2}
          sx={{ height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Requester</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {members.map((m) => {
                  const {
                    id,
                    firstName,
                    suffix,
                    lastName,
                    middleName,
                    requester,
                    branch,
                    address,
                  } = m;

                  return (
                    <TableRow key={id}>
                      <TableCell>
                        {getFullName({
                          firstName,
                          suffix,
                          lastName,
                          middleName,
                        })}
                      </TableCell>
                      <TableCell>{requester}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: "2",
                            overflow: "hidden",
                          }}
                          component="div"
                        >
                          {address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          component="span"
                          onClick={() => handleMemberModalOpen(m)}
                        >
                          <FactCheckIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <MemberApprovalModal
        open={memberApprovalModalState.open}
        data={memberApprovalModalState.data}
        onClose={handleMemberModalClose}
      />
    </Box>
  );
};

export default DashboardPage;
