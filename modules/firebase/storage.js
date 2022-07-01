import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const storage = getStorage();

export const uploadImageReq = async ({ file }) => {
  try {
    // upload
    const filename = v4();
    const storageRef = ref(storage, `fam-verification/${filename}`);
    const res = await uploadBytes(storageRef, file);

    // get uploaded url
    const url = await getDownloadURL(res.ref);
    return { data: url, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
