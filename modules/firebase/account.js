import bcrypt from "bcryptjs";
import { format as formatDate } from "date-fns";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { omit as omitFields } from "lodash";

import { db } from "./config";

const collRef = collection(db, "accounts");

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(6);
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

export const comparePassword = (password, hashedPassword) => {
  const isMatched = bcrypt.compareSync(password, hashedPassword);
  return isMatched;
};

export const createAccountReq = async (
  newDocument,
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    const docRef = doc(collRef);

    // Transform Document
    const { firstName, middleName, lastName, suffix, birthdate, password } =
      newDocument;
    let mappedNewDocument = {
      ...newDocument,
      firstName: firstName.toLowerCase(),
      middleName: middleName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      suffix: suffix.toLowerCase(),
      birthdate: formatDate(new Date(birthdate), "yyyy-MM-dd"),
      password: hashPassword(password),
      familyMembers: [],
    };
    // Add Default Memeber
    mappedNewDocument.familyMembers = [
      {
        accountId: docRef.id,
        ...omitFields(mappedNewDocument, ["password", "familyMembers"]),
      },
    ];

    // Create Document
    await setDoc(docRef, mappedNewDocument);

    // remove password field
    delete document.password;

    successCb({ id: docRef.id, ...mappedNewDocument });
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};

export const checkAccountDuplicateReq = async (
  contactNo,
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    const q = query(collRef, where("contactNo", "==", contactNo));

    const querySnapshot = await getDocs(q);

    const isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) throw new Error("Contact No already used.");

    // TODO: check duplication on patient

    successCb();
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};

export const checkAccountCredentialReq = async (
  { contactNo, password },
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    const q = query(collRef, where("contactNo", "==", contactNo));
    const querySnapshot = await getDocs(q);

    // Check if account exist
    const exist = querySnapshot.docs.length === 1;
    if (!exist) throw new Error("Invalid contact number or password");

    // Check if correct password
    const document = querySnapshot.docs[0].data();
    const correctPass = comparePassword(password, document.password);
    if (!correctPass) throw new Error("Invalid contact number or password");

    // remove password field
    delete document.password;

    successCb(document);
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};
