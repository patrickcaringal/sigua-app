import {
  endOfDay,
  format,
  getMonth,
  getWeek,
  getYear,
  startOfDay,
} from "date-fns";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import lodash from "lodash";

import { sortBy } from "../helper";
import { db, timestampFields } from "./config";

export const LOG_ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  RESTORE: "RESTORE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
};

export const RESOURCE_TYPE = {
  MEDICAL_RECORD: "MEDICAL_RECORD",
  PATIENT: "PATIENT",
  STAFF: "STAFF",
  DOCTOR: "DOCTOR",
  SERVICE: "SERVICE",
  BRANCH: "BRANCH",
  QUEUE: "QUEUE",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  PROFILE: "PROFILE",
  PASSWORD: "PASSWORD",
};

const collectionName = "logs";
const collRef = collection(db, collectionName);

export const getLogsByMonthReq = async ({ date }) => {
  try {
    const q = query(
      collRef,
      where("date", ">=", startOfDay(new Date(date))),
      where("date", "<=", endOfDay(new Date(date)))
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("date", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const saveLogReq = async (log) => {
  try {
    const logDate = new Date(); //"01-jan-2022"

    const d = {
      ...log,
      date: logDate,
      week: getWeek(logDate),
      month: getMonth(logDate) + 1,
      year: getYear(logDate),
    };

    const docRef = doc(collRef);
    const id = docRef.id;
    await setDoc(doc(db, collectionName, id), d);

    return { success: true };
  } catch (error) {
    console.log(error, error.code);
    return { error: error.message };
  }
};

export const omitKeys = (data, resource) => {
  let k = ["id"];

  switch (resource) {
    case RESOURCE_TYPE.STAFF:
    case RESOURCE_TYPE.DOCTOR:
      k = ["id", "name", "nameBirthdate", "branch"];
      break;

    case RESOURCE_TYPE.BRANCH:
      k = ["id", "servicesId"];
      break;

    default:
      k = ["id"];
  }

  return lodash.omit(data, k);
};
// export const saveLogReq = async ({ log }) => {
//   const logDate = new Date(); //"01-jan-2022"
//   const logId = format(logDate, "yyyyMMww");
//   log = {
//     ...log,
//     date: logDate,
//   };

//   try {
//     const docRef = doc(db, collectionName, logId);
//     await updateDoc(docRef, {
//       logs: arrayUnion(log),
//     });

//     return { success: true };
//   } catch (error) {
//     // doc not existing, create doc
//     if (error.code === "not-found") {
//       const d = {
//         id: logId,
//         week: getWeek(logDate),
//         month: getMonth(logDate) + 1,
//         year: getYear(logDate),
//         logs: [log],
//         deleted: false,
//         ...timestampFields({ dateCreated: true, dateUpdated: true }),
//       };
//       await setDoc(doc(db, collectionName, logId), d);

//       return { success: true };
//     }

//     console.log(error, error.code);
//     return { error: error.message };
//   }
// };
