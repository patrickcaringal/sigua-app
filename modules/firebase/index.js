import {
  addFamilyMembersReq,
  checkAccountCredentialReq,
  checkAccountDuplicateReq,
  createAccountReq,
  getFamilyMembersReq,
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
import { addBranchReq, getBranchesReq, updateBranchReq } from "./branches";
import { auth, db } from "./config";
import { addServiceReq, getServicesReq } from "./services";
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
  getServicesReq,
  addServiceReq,
  // branch
  addBranchReq,
  getBranchesReq,
  updateBranchReq,
  // storage
  uploadImageReq,
  deleteImageReq,
};
