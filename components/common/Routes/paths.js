import lodash from "lodash";

export const PATHS = {
  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    PROFILE: "/doctor/profile",
    FEEDBACK_APPROVAL: "/doctor/feedback-approval",
    PATIENTS_LIST: "/doctor/patients",
    PATIENT_ACCOUNTS: "/doctor/patients/accounts",
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
    QUEUE_MANAGEMENT: "/doctor/queue",
    ANNOUNCEMENT_MANAGEMENT: "/doctor/announcements",
    ANNOUNCEMENT_RESTORE: "/doctor/announcements/restore",
    QUEUE_DETAIL: "/doctor/queue/[id]/details",
    QUEUE_TODAY: "/doctor/queue/today",
    QUEUE_SUNDAY: "/doctor/queue/sunday",
    REPORT_QUEUE: "/doctor/report/queue",
    REPORT_TRANSACTION: "/doctor/report/transaction",
    REPORT_ACTIVITY_LOGS: "/doctor/report/activity-logs",
    // REPORT_PATIENT_MEDICAL_RECORD: "/doctor/patient/medical-record",
  },
  STAFF: {
    DASHBOARD: "/staff/dashboard",
    PROFILE: "/staff/profile",
    QUEUE_MANAGEMENT: "/staff/queue",
    QUEUE_DETAIL: "/staff/queue/[id]/details",
    QUEUE_TODAY: "/staff/queue/today",
    QUEUE_SUNDAY: "/staff/queue/sunday",
    // QUEUE_LIST: "/staff/queue/list",
    PATIENTS_LIST: "/staff/patients",
    MEMBER_APPROVAL: "/staff/member/approval",
    PATIENTS_MEDICAL_RECORD: "/staff/patients/[id]/medical-record",
    PATIENT_ACCOUNTS: "/staff/patients/accounts",
  },
  PATIENT: {
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    FEEDBACK: "/feedback",
    FAMILY: "/family-members",
    MEDICAL_RECORD: "/medical-records",
    QUEUE_TODAY: "/queue/[id]",
    QUEUE_SUNDAY: "/queue/sunday/[id]",
  },
  PUBLIC: {
    ROOT: "/",
    PATIENT_SIGN_IN: "/signin",
    PATIENT_SIGN_UP: "/signup",
    PATIENT_FORGOT_PASSWORD: "/forgot-password",
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
