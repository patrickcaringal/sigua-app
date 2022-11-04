import {
  REG_TYPE,
  addFamilyMembersReq,
  changeAccountPasswordReq,
  checkAccountCredentialReq,
  checkAccountDuplicateReq,
  checkContactNoReq,
  createAccountReq,
  getAccountReq,
  getAccountsReq,
  getMemberForApprovalReq,
  resetPasswordReq,
  updateAccountReq,
  updateFamilyMembersReq,
} from "./account";
import {
  addAnnouncementReq,
  deleteAnnouncementReq,
  getAnnouncementsReq,
  getDeletedAnnouncementsReq,
  restoreAnnouncementReq,
  updateAnnouncementReq,
} from "./announcements";
import {
  changePasswordReq,
  monitorAuthState,
  signInAnonymouslyReq,
  signInReq,
  signOutAnonymouslyReq,
  signOutReq,
  signUpReq,
} from "./auth";
import {
  addBranchReq,
  deleteBranchReq,
  getBranchesReq,
  getDeletedBranchesReq,
  restoreBranchReq,
  updateBranchReq,
} from "./branches";
import { auth, db } from "./config";
import {
  addDoctorReq,
  deleteDoctorReq,
  diagnosePatientReq,
  getBranchDoctorsReq,
  getDeletedDoctorsReq,
  getDoctorReq,
  getDoctorsReq,
  restoreDoctorReq,
  updateDoctorReq,
} from "./doctor";
import {
  LOG_ACTIONS,
  RESOURCE_TYPE,
  getLogsByMonthReq,
  omitKeys,
  saveLogReq,
} from "./logs";
import {
  getPatientRecordReq,
  getRecordsByBranchDateRangeReq,
  getRecordsByDateRangeReq,
} from "./medicalRecords";
import {
  MEMBER_STATUS,
  addPatientReq,
  deletePatientReq,
  getDeletedPatientsReq,
  getFamilyMembersReq,
  getPatientReq,
  getPatientsByBranchReq,
  getPatientsForApprovalReq,
  getPatientsReq,
  getVerifiedFamilyMembersReq,
  restorePatientReq,
  updatePatientReq,
} from "./patients";
import {
  addQueueCounterReq,
  addQueueReq,
  checkVerificationCodeSmsReq,
  getAllQueuesReq,
  getQueueReq,
  getQueuesByBranchDateRangeReq,
  getQueuesByBranchReq,
  getQueuesByDateRangeReq,
  getQueuesTodayReq,
  registerToQueueReq,
  resetQueueReq,
  sendQueueSmsReq,
  sendVerificationSmsReq,
  transferQueueItemReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
} from "./queues";
import {
  addServiceReq,
  deleteServiceReq,
  getDeletedServicesReq,
  getServicesReq,
  restoreServiceReq,
  updateServiceReq,
} from "./services";
import {
  addStaffReq,
  deleteStaffReq,
  getDeletedStaffsReq,
  getStaffReq,
  getStaffsReq,
  restoreStaffReq,
  signInStaffReq,
  updateStaffReq,
} from "./staff";
import { deleteImageReq, uploadImageReq } from "./storage";

export {
  // auth
  db,
  auth,
  signUpReq,
  signOutReq,
  signInReq,
  signInAnonymouslyReq,
  signOutAnonymouslyReq,
  monitorAuthState,
  changePasswordReq,
  // account
  REG_TYPE,
  addFamilyMembersReq,
  changeAccountPasswordReq,
  checkAccountCredentialReq,
  checkAccountDuplicateReq,
  checkContactNoReq,
  createAccountReq,
  getAccountReq,
  getAccountsReq,
  getMemberForApprovalReq,
  resetPasswordReq,
  updateAccountReq,
  updateFamilyMembersReq,
  // Announcement
  addAnnouncementReq,
  deleteAnnouncementReq,
  getAnnouncementsReq,
  getDeletedAnnouncementsReq,
  restoreAnnouncementReq,
  updateAnnouncementReq,
  // doctor
  addDoctorReq,
  deleteDoctorReq,
  diagnosePatientReq,
  getBranchDoctorsReq,
  getDeletedDoctorsReq,
  getDoctorReq,
  getDoctorsReq,
  restoreDoctorReq,
  updateDoctorReq,
  // patient
  MEMBER_STATUS,
  addPatientReq,
  deletePatientReq,
  getDeletedPatientsReq,
  getFamilyMembersReq,
  getPatientReq,
  getPatientsByBranchReq,
  getPatientsForApprovalReq,
  getPatientsReq,
  getVerifiedFamilyMembersReq,
  restorePatientReq,
  updatePatientReq,
  // staff
  addStaffReq,
  deleteStaffReq,
  getDeletedStaffsReq,
  getStaffReq,
  getStaffsReq,
  restoreStaffReq,
  signInStaffReq,
  updateStaffReq,
  // service
  addServiceReq,
  deleteServiceReq,
  getServicesReq,
  getDeletedServicesReq,
  updateServiceReq,
  restoreServiceReq,
  // branch
  addBranchReq,
  deleteBranchReq,
  getBranchesReq,
  getDeletedBranchesReq,
  restoreBranchReq,
  updateBranchReq,
  // queue
  addQueueCounterReq,
  addQueueReq,
  checkVerificationCodeSmsReq,
  getAllQueuesReq,
  getQueueReq,
  getQueuesByBranchDateRangeReq,
  getQueuesByBranchReq,
  getQueuesByDateRangeReq,
  getQueuesTodayReq,
  registerToQueueReq,
  resetQueueReq,
  sendQueueSmsReq,
  sendVerificationSmsReq,
  transferQueueItemReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
  // medical records
  getPatientRecordReq,
  getRecordsByBranchDateRangeReq,
  getRecordsByDateRangeReq,
  // storage
  uploadImageReq,
  deleteImageReq,
  // log
  LOG_ACTIONS,
  RESOURCE_TYPE,
  omitKeys,
  saveLogReq,
  getLogsByMonthReq,
};
