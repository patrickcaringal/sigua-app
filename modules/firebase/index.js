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
import { getFamilyMembersReq } from "./patients";
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
  getStaffsReq,
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
  getFamilyMembersReq,
  addFamilyMembersReq,
  updateFamilyMembersReq,
  getMemberForApprovalReq,
  // staff
  addStaffReq,
  getStaffsReq,
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
  // storage
  uploadImageReq,
  deleteImageReq,
};
