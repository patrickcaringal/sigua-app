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
import {
  getMemberForApprovalReq,
  updateFamilyMembersReq,
} from "../../../modules/firebase";
import { getFullName, getUniquePersonId } from "../../../modules/helper";
const LOCAL_MODE = false;

const MemberApprovalPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const [getMemberForApproval] = useRequest(
    getMemberForApprovalReq,
    setBackdropLoader
  );
  const [updateFamilyMembers, updateFamilyMembersLoading] = useRequest(
    updateFamilyMembersReq,
    setBackdropLoader
  );
  //   const [addStaff] = useRequest(addStaffReq);

  const [accounts, setAccounts] = useState([]); // used to pull Family members
  const [members, setMembers] = useState([]);
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
      const memberList = getMemberList(accountList);
      setMembers(memberList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMemberList = (accountList) => {
    const memberList = accountList.reduce((acc, m) => {
      let notVerifiedMember = m.familyMembers.filter(
        (i) =>
          !i.verified && i.verificationAttachment && !i.verificationRejectReason
      );

      // No Not Verified member, exit
      if (notVerifiedMember.length === 0) return acc;

      const requester = getFullName(m);
      notVerifiedMember = notVerifiedMember.map((i) => ({ ...i, requester }));

      return [...acc, ...notVerifiedMember];
    }, []);

    return memberList;
  };

  const updateMember = (
    accountId,
    memberName,
    approved,
    verificationRejectReason = ""
  ) => {
    const accountIndex = accounts.findIndex((i) => i.id === accountId);
    const updatedAccount = { ...accounts[accountIndex] };

    const memberIndex = updatedAccount.familyMembers.findIndex(
      (i) => getFullName(i) === memberName
    );
    updatedAccount.familyMembers[memberIndex].verified = approved;
    if (!approved) {
      updatedAccount.familyMembers[memberIndex].verificationRejectReason =
        verificationRejectReason;
    } else {
      delete updatedAccount.familyMembers[memberIndex].verificationRejectReason;
    }

    return { updatedAccount, accountIndex };
  };

  const handleMemberModalOpen = (m) => {
    const { verificationAttachment, requester, accountId } = m;
    setMemberApprovalModalState({
      open: true,
      data: {
        src: verificationAttachment,
        accountId,
        requester,
        member: getFullName(m),
      },
    });
  };

  const handleMemberModalClose = () => {
    setMemberApprovalModalState({
      open: false,
      data: null,
    });
  };

  const handleApprove = async ({ memberName, accountId }) => {
    const { updatedAccount, accountIndex } = updateMember(
      accountId,
      memberName,
      true
    );

    // Update Family Member to verified
    const { error: updateFamMemberError } = await updateFamilyMembers({
      id: accountId,
      familyMembers: updatedAccount.familyMembers,
    });
    if (updateFamMemberError) {
      return openErrorDialog(updateFamMemberError);
    }

    // Update Local State
    const accountsCopy = [...accounts];
    accountsCopy[accountIndex] = updatedAccount;
    setAccounts(accountsCopy);

    const memberList = getMemberList(accountsCopy);
    setMembers(memberList);

    openResponseDialog({
      autoClose: true,
      content: "Member Verification approved.",
      type: "SUCCESS",
      closeCb() {
        handleMemberModalClose();
      },
    });
  };

  const handleReject = async ({
    memberName,
    accountId,
    verificationRejectReason,
  }) => {
    const { updatedAccount, accountIndex } = updateMember(
      accountId,
      memberName,
      false,
      verificationRejectReason
    );

    // Update Family Member to verified
    const { error: updateFamMemberError } = await updateFamilyMembers({
      id: accountId,
      familyMembers: updatedAccount.familyMembers,
    });
    if (updateFamMemberError) {
      return openErrorDialog(updateFamMemberError);
    }

    // Update Local State
    const accountsCopy = [...accounts];
    accountsCopy[accountIndex] = updatedAccount;
    setAccounts(accountsCopy);

    const memberList = getMemberList(accountsCopy);
    setMembers(memberList);

    openResponseDialog({
      autoClose: true,
      content: "Member Verification rejected.",
      type: "SUCCESS",
      closeCb() {
        handleMemberModalClose();
      },
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
                {members.map((m, index) => {
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
                    <TableRow key={index}>
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
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Box>
  );
};

export default MemberApprovalPage;
