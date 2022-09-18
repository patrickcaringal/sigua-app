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
import {
  addDoctorReq,
  deleteDoctorReq,
  diagnosePatientReq,
  getBranchDoctorsReq,
  getDoctorsReq,
  updateDoctorReq,
} from "./doctor";
import { getPatientRecordReq } from "./medicalRecords";
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
  getQueueReq,
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
  addDoctorReq,
  deleteDoctorReq,
  diagnosePatientReq,
  getBranchDoctorsReq,
  getDoctorsReq,
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
  getQueueReq,
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
