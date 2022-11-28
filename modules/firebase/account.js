import axios from "axios";
import bcrypt from "bcryptjs";
import faker from "faker";
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

import { getBaseApi } from "../env";
import {
  formatDate,
  formatFirebasetimeStamp,
  getFullName,
  getUniquePersonId,
  pluralize,
  sortBy,
} from "../helper";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";
import { MEMBER_STATUS, updatePatientReq } from "./patients";

const collectionName = "accounts";
const collRef = collection(db, collectionName);

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

export const REG_TYPE = {
  SELF_REGISTERED: "SELF_REGISTERED",
  STAFF_REGISTERED: "STAFF_REGISTERED",
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
      account: true,
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

export const changeAccountPasswordReq = async ({
  id,
  oldPassword,
  newPassword,
}) => {
  try {
    const q = doc(db, collectionName, id);
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.exists()) {
      throw new Error("Unable to get Patient doc");
    }

    const data = querySnapshot.data();

    const correctPass = comparePassword(oldPassword, data.password);
    if (!correctPass) throw new Error("Incorrect password");

    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      password: hashPassword(newPassword),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const checkAccountDuplicateReq = async ({ contactNo, name }) => {
  try {
    if (contactNo) {
      // Check contactNo duplicate
      await checkDuplicate({
        collectionName: "accounts",
        whereClause: where("contactNo", "==", contactNo),
        duplicateOutputField: "contactNo",
        customErrorMsg: "Contact No. already used.",
      });
    }

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
    // find account
    const q = query(
      collRef,
      where("contactNo", "==", contactNo),
      where("deleted", "==", false)
    );
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

export const checkContactNoReq = async ({ contactNo }) => {
  try {
    // find account
    const q = query(collRef, where("contactNo", "==", contactNo));
    const querySnapshot = await getDocs(q);

    // Check if account exist
    const exist = querySnapshot.docs.length === 1;
    if (!exist) throw new Error("Contact number not registered.");
    const data = querySnapshot.docs[0].data();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const resetPasswordReq = async ({ id, contactNo }) => {
  try {
    const password = faker.internet.password(8, false, /[a-z]/);
    // const password = "12345678";

    const docRef = doc(db, "accounts", id);
    await updateDoc(docRef, {
      password: hashPassword(password),
    });
    // console.log({ id, password });

    // send sms
    const payload = { password, contactNo };
    await axios.post(getBaseApi("/reset-password-sms"), payload);
    // console.log(payload);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getAccountReq = async ({ id, contactNo }) => {
  try {
    // Patient
    const q = query(
      collection(db, "patients"),
      where("accountId", "==", id),
      where("contactNo", "==", contactNo)
    );
    const querySnapshot = await getDocs(q);

    const exist = querySnapshot.docs.length;
    if (!exist) throw new Error("Unable to get Patient Doc");

    const data = querySnapshot.docs[0].data();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getAccountsReq = async () => {
  try {
    // Get Accounts
    const q = query(collRef, where("deleted", "==", false));
    const querySnapshot = await getDocs(q);

    // Get Patients
    const q2 = query(collection(db, "patients"), where("deleted", "==", false));
    const querySnapshot2 = await getDocs(q2);
    const data2 = querySnapshot2.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("dateCreated"));

    // Join
    const data = querySnapshot.docs
      .map((doc) => {
        const d = doc.data();
        return {
          ...d,
          familyMembers: data2.filter((i) => i.accountId == d.id)?.length,
        };
      })
      .sort(sortBy("dateCreated"));

    return { data, success: true };
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

export const updateAccountReq = async ({ account }) => {
  try {
    // // Check duplicate
    // if (account.name || account.birthdate) {
    //   await checkDuplicate({
    //     collectionName: collectionName,
    //     whereClause: where("nameBirthdate", "==", account.nameBirthdate),
    //     errorMsg: {
    //       noun: "Account",
    //     },
    //   });
    // }

    // Update
    const batch = writeBatch(db);
    const docRef = doc(db, collectionName, account.id);
    const finalDoc = {
      ...account,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register account name
    if (account.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: collectionName,
        names: { [account.id]: account.name },
      });
      batch.update(namesDocRef, names);
    }

    await batch.commit();

    return { success: true };
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
