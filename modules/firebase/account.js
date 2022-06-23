import bcrypt from "bcryptjs";
import { format as formatDate } from "date-fns";
import { collection, doc, setDoc } from "firebase/firestore";
import { omit as omitFields } from "lodash";

import { db } from "./config";

const collRef = collection(db, "accounts");

const hashIt = (password) => {
  const salt = bcrypt.genSaltSync(6);
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
  // console.log(hash, bcrypt.compareSync("123456w", hash));
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
      password: hashIt(password),
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
    successCb({ id: docRef.id, ...mappedNewDocument });
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};
