import bcrypt from "bcryptjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { omit as omitFields } from "lodash";

import { formatDate, getFullName, pluralize } from "../helper";
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

export const createAccountReq = async (newDocument) => {
  try {
    const docRef = doc(collRef);

    // Transform Document
    const { birthdate, password } = newDocument;
    let mappedNewDocument = {
      ...newDocument,
      birthdate: formatDate(birthdate),
      password: hashPassword(password),
      familyMembers: [],
      hasVerificationForApproval: false,
      role: "patient",
    };
    // Add Default Memeber
    mappedNewDocument.familyMembers = [
      {
        id: doc(collRef).id,
        accountId: docRef.id,
        verified: true,
        verificationAttachment: null,
        ...omitFields(mappedNewDocument, [
          "password",
          "familyMembers",
          "role",
          "hasVerificationForApproval",
        ]),
      },
    ];

    // Create Document
    await setDoc(docRef, mappedNewDocument);

    // Remove password field
    delete document.password;

    const data = { id: docRef.id, ...mappedNewDocument };
    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const checkAccountDuplicateReq = async (contactNo) => {
  try {
    const q = query(collRef, where("contactNo", "==", contactNo));

    const querySnapshot = await getDocs(q);

    const isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) throw new Error("Contact No already used.");

    // TODO: check duplication on patient

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const checkAccountCredentialReq = async ({ contactNo, password }) => {
  try {
    const q = query(collRef, where("contactNo", "==", contactNo));
    const querySnapshot = await getDocs(q);

    // Check if account exist
    const exist = querySnapshot.docs.length === 1;
    if (!exist) throw new Error("Invalid contact number or password");

    // Check if correct password
    const document = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    };
    const correctPass = comparePassword(password, document.password);
    if (!correctPass) throw new Error("Invalid contact number or password");

    // Remove password field
    delete document.password;

    return { data: document, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getFamilyMembersReq = async (id) => {
  try {
    const docRef = doc(db, "accounts", id);
    const docSnap = await getDoc(docRef);

    let data = [];
    if (docSnap.exists()) {
      data = docSnap.data().familyMembers;
      data = data.map((i, index) => ({ index, ...i }));
    }

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addFamilyMembersReq = async ({ id, familyMembers }) => {
  try {
    const docRef = doc(db, "accounts", id);
    const docSnap = await getDoc(docRef);

    // Check Duplicates
    let duplicates = [];
    if (docSnap.exists()) {
      const old = docSnap.data().familyMembers;
      familyMembers.forEach((n) => {
        const exist = old.filter((o) => getFullName(o) === getFullName(n));

        if (exist.length) duplicates.push(getFullName(n));
      });
    }

    if (duplicates.length) {
      throw new Error(
        `Duplicate ${pluralize(
          "Family Member",
          duplicates.length
        )}. ${duplicates.join(", ")}`
      );
    }

    // Insert default fields
    familyMembers = familyMembers.map((i) => ({
      ...i,
      id: doc(collRef).id,
      accountId: id,
      birthdate: formatDate(i.birthdate),
      ...(!i.contactNo && { verified: false, verificationAttachment: null }),
    }));

    // Update document
    await updateDoc(docRef, {
      familyMembers: [...docSnap.data().familyMembers, ...familyMembers],
    });

    return { data: familyMembers, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const updateFamilyMembersReq = async ({ id, familyMembers }) => {
  try {
    // Check if has fam member for verification
    const hasVerificationForApproval = familyMembers.some((i) => !i.verified);

    const docRef = doc(db, "accounts", id);
    await updateDoc(docRef, { familyMembers, hasVerificationForApproval });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getMemberForApprovalReq = async ({}) => {
  try {
    const q = query(collRef, where("hasVerificationForApproval", "==", true));

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const mappedData = data.map((i) => {
      // Remove password field
      delete i.password;
      return i;
    });

    return { data: mappedData, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

// export const getUser = async () => {
//   try {
//     const q = query(collRef, where("contactNo", "==", "09994441760"));

//     const querySnapshot = await getDocs(q);
//     const document = querySnapshot.docs[0].data();

//     console.log({ document, x: querySnapshot.docs[0].id });
//   } catch (error) {
//     // errorCb(error.message);
//     console.log(error);
//   }
// };
