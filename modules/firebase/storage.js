import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const storage = getStorage();

export const uploadImageReq = async (
  { file },
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    // upload
    const filename = v4();
    const storageRef = ref(storage, `fam-verification/${filename}`);
    const res = await uploadBytes(storageRef, file);

    // get uploaded url
    const url = await getDownloadURL(res.ref);
    successCb(url);
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};
