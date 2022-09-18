import lodash from "lodash";

export const PATHS = {
  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    PATIENTS_LIST: "/doctor/patients",
    PATIENTS_APPROVAL: "/doctor/patients/approval",
    PATIENTS_RESTORE: "/doctor/patients/restore",
    PATIENTS_MEDICAL_RECORD: "/doctor/patients/[id]/medical-record",
    DIAGNOSE: "/doctor/diagnose",
    SERVICES_MANAGEMENT: "/doctor/services",
    SERVICES_RESTORE: "/doctor/services/restore",
    BRANCH_MANAGEMENT: "/doctor/branches",
    BRANCH_RESTORE: "/doctor/branches/restore",
    STAFF_MANAGEMENT: "/doctor/staffs",
    STAFF_RESTORE: "/doctor/staffs/restore",
    DOCTOR_MANAGEMENT: "/doctor/doctors",
    DOCTOR_RESTORE: "/doctor/doctors/restore",
  },
  STAFF: {
    DASHBOARD: "/staff/dashboard",
    QUEUE_MANAGEMENT: "/staff/queue",
    QUEUE_DETAIL: "/staff/queue/[id]/details",
    QUEUE_TODAY: "/staff/queue/today",
    // QUEUE_LIST: "/staff/queue/list",
    PATIENTS_LIST: "/staff/patients",
    MEMBER_APPROVAL: "/staff/member/approval",
    PATIENTS_MEDICAL_RECORD: "/staff/patients/[id]/medical-record",
  },
  PATIENT: {
    DASHBOARD: "/dashboard",
    FAMILY: "/family-members",
    MEDICAL_RECORD: "/medical-records",
    QUEUE: "/queue/today",
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
