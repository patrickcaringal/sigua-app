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

import { db, timestampFields } from "../../modules/firebase/config";

export default async function handler(req, res) {
  try {
    const q = query(
      collection(db, "queues")
      // where("branchId", "in", ["6aZE5QOnGBliyEaQNqMs", "nbNK8rBWkxVLaqeHr56z"])
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // branchId
    // 6aZE5QOnGBliyEaQNqMs
    // nbNK8rBWkxVLaqeHr56z

    // if (data.length) {
    //   const batch = writeBatch(db);
    //   data.forEach((i) => {
    //     batch.delete(doc(db, "queues", i.id));
    //   });

    //   await batch.commit();
    // }

    res.status(200).json({
      ok: data.length,
    });
    // res.status(200).json({
    //   ok: true,
    // });
  } catch (error) {
    res.status(200).json({
      ok: error,
    });
    console.log(error);
    return { error: error.message };
  }
}
