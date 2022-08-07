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
  writeBatch,
} from "firebase/firestore";
import lodash from "lodash";

import {
  formatDate,
  formatFirebasetimeStamp,
  getFullName,
  getUniquePersonId,
  pluralize,
} from "../helper";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";
import { MEMBER_STATUS } from "./patients";

const collRef = collection(db, "accounts");

const transformedFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(6);
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

export const comparePassword = (password, hashedPassword) => {
  const isMatched = bcrypt.compareSync(password, hashedPassword);
  return isMatched;
};

export const createAccountReq = async (account) => {
  try {
    const batch = writeBatch(db);

    // Transform Document
    const docRef = doc(collRef);
    let accountDoc = {
      ...account,
      id: docRef.id,
      password: hashPassword(account.password),
      role: "patient",
      deleted: false,
      ...transformedFields(account),
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };
    // Create Account Document
    batch.set(docRef, accountDoc);

    // Patient Document
    const docRef2 = doc(collection(db, "patients"));
    const patientDoc = {
      ...lodash.omit(accountDoc, ["password", "role"]),
      id: docRef2.id,
      accountId: accountDoc.id,
      verified: true,
      verifiedContactNo: true,
      verificationAttachment: null,
      verificationRejectReason: null,
      status: MEMBER_STATUS.VERFIED,
    };
    // Create Patient Document
    batch.set(docRef2, patientDoc);

    // Register Account name
    const regAccount = await registerNames({
      collectionName: "accounts",
      names: { [accountDoc.id]: accountDoc.name },
    });
    batch.update(regAccount.namesDocRef, regAccount.names);

    // Register Patient name
    const regPatients = await registerNames({
      collectionName: "patients",
      names: { [docRef2.id]: accountDoc.name },
    });
    batch.update(regPatients.namesDocRef, regPatients.names);

    await batch.commit();

    delete accountDoc.password; // Remove password field
    const data = accountDoc;
    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const checkAccountDuplicateReq = async ({ contactNo, name }) => {
  try {
    // Check contactNo duplicate
    await checkDuplicate({
      collectionName: "accounts",
      whereClause: where("contactNo", "==", contactNo),
      duplicateOutputField: "contactNo",
      customErrorMsg: "Contact No. already used.",
    });

    // Check patient name duplicate
    await checkDuplicate({
      collectionName: "patients",
      whereClause: where("nameBirthdate", "==", name),
      errorMsg: {
        noun: "Patient",
      },
    });

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
      verified: false,
      verifiedContactNo: false,
      verificationAttachment: null,
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
