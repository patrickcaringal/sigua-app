import lodash from "lodash";

export const PATHS = {
  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    SERVICES_MANAGEMENT: "/doctor/services",
    SERVICES_RESTORE: "/doctor/services/restore",
    BRANCH_MANAGEMENT: "/doctor/branches",
    BRANCH_RESTORE: "/doctor/branches/restore",
    STAFF_MANAGEMENT: "/doctor/staffs",
    STAFF_RESTORE: "/doctor/staffs/restore",
  },
  STAFF: {
    DASHBOARD: "/staff/dashboard",
    MEMBER_APPROVAL: "/staff/member/approval",
  },
  PATIENT: {
    DASHBOARD: "/dashboard",
    FAMILY: "/family-members",
  },
  PUBLIC: {
    ROOT: "/",
    PATIENT_SIGN_IN: "/signin",
    PATIENT_SIGN_UP: "/signup",
    DOCTOR_SIGN_IN: "/doctor/signin",
    STAFF_SIGN_IN: "/staff/signin",
  },
};

export const getRoleRoutes = (role) => {
  return lodash.values(PATHS[role]);
};

export const PROTECTED_ROUTES = [
  ...getRoleRoutes("DOCTOR"),
  ...getRoleRoutes("STAFF"),
  ...getRoleRoutes("PATIENT"),
];

export const LOGGED_IN_INACCESSIBLE_ROUTES = [...getRoleRoutes("PUBLIC")];
