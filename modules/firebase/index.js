import {
  addFamilyMembersReq,
  checkAccountCredentialReq,
  checkAccountDuplicateReq,
  createAccountReq,
  getMemberForApprovalReq,
  updateFamilyMembersReq,
} from "./account";
import {
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
import { diagnosePatientReq, getBranchDoctorsReq } from "./doctor";
import { getPatientRecordReq } from "./medicalRecords";
import {
  MEMBER_STATUS,
  addPatientReq,
  getFamilyMembersReq,
  getPatientReq,
  getPatientsByBranchReq,
  getPatientsForApprovalReq,
  getVerifiedFamilyMembersReq,
  updatePatientReq,
} from "./patients";
import {
  addQueueCounterReq,
  addQueueReq,
  getQueuesByBranchReq,
  registerToQueueReq,
  resetQueueReq,
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
  // account
  createAccountReq,
  checkAccountDuplicateReq,
  checkAccountCredentialReq,
  addFamilyMembersReq,
  updateFamilyMembersReq,
  getMemberForApprovalReq,
  // doctor
  diagnosePatientReq,
  getBranchDoctorsReq,
  // patient
  MEMBER_STATUS,
  addPatientReq,
  getFamilyMembersReq,
  getPatientReq,
  getPatientsForApprovalReq,
  getPatientsByBranchReq,
  getVerifiedFamilyMembersReq,
  updatePatientReq,
  // staff
  addStaffReq,
  deleteStaffReq,
  getDeletedStaffsReq,
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
  getQueuesByBranchReq,
  registerToQueueReq,
  resetQueueReq,
  transferQueueItemReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
  // medical records
  getPatientRecordReq,
  // storage
  uploadImageReq,
  deleteImageReq,
};
