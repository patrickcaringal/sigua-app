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
  MEMBER_STATUS,
  addPatientReq,
  getFamilyMembersReq,
  getPatientsForApprovalReq,
  updatePatientReq,
} from "./patients";
import {
  addQueueReq,
  getQueuesReq,
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
  // patient
  addPatientReq,
  getFamilyMembersReq,
  getPatientsForApprovalReq,
  updatePatientReq,
  MEMBER_STATUS,
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
  addQueueReq,
  getQueuesReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
  // storage
  uploadImageReq,
  deleteImageReq,
};
