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
import { getBranchDoctorsReq } from "./doctor";
import {
  MEMBER_STATUS,
  addPatientReq,
  getFamilyMembersReq,
  getPatientReq,
  getPatientsForApprovalReq,
  getPatientsReq,
  getVerifiedFamilyMembersReq,
  updatePatientReq,
} from "./patients";
import {
  addQueueCounterReq,
  addQueueReq,
  getQueuesReq,
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
  getBranchDoctorsReq,
  // patient
  MEMBER_STATUS,
  addPatientReq,
  getFamilyMembersReq,
  getPatientReq,
  getPatientsForApprovalReq,
  getPatientsReq,
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
  getQueuesReq,
  registerToQueueReq,
  resetQueueReq,
  transferQueueItemReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
  // storage
  uploadImageReq,
  deleteImageReq,
};
