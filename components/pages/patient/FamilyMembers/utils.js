import FlakyIcon from "@mui/icons-material/Flaky";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { IconButton } from "@mui/material";

import { MEMBER_STATUS } from "../../../../modules/firebase";

export const icons = {
  [MEMBER_STATUS.VERFIED]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none", pl: 0 }}>
        <VerifiedUserIcon color="success" />
      </IconButton>
      Verified
    </>
  ),
  [MEMBER_STATUS.FOR_VERIFICATION]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none", pl: 0 }}>
        <NoAccountsIcon color="error" />
      </IconButton>
      To Verifiy
    </>
  ),
  [MEMBER_STATUS.FOR_PHONE_VERIFICATION]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none", pl: 0 }}>
        <SendToMobileIcon color="success" />
      </IconButton>
      Verifiy Contact no
    </>
  ),
  [MEMBER_STATUS.FOR_APPROVAL]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none", pl: 0 }}>
        <FlakyIcon color="warning" />
      </IconButton>
      For Staff Approval
    </>
  ),
  [MEMBER_STATUS.REJECTED]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none", pl: 0 }}>
        <HighlightOffIcon color="error" />
      </IconButton>
      Rejected
    </>
  ),
};

export const statusUploadAllowed = [
  MEMBER_STATUS.FOR_VERIFICATION,
  MEMBER_STATUS.REJECTED,
];
