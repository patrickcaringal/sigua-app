export const isDevEnv = process.env.NEXT_PUBLIC_ENV === "dev";
export const isMockDataEnabled =
  isDevEnv && process.env.NEXT_PUBLIC_MOCK_DATA === "true";
export const isSmsEnabled = process.env.NEXT_PUBLIC_ENABLE_SMS === "true";
console.log({ isSmsEnabled });
const baseURL = isDevEnv
  ? "http://localhost:3006"
  : "https://sigua-medical-clinic.vercel.app";

const baseAPI = isDevEnv
  ? "http://localhost:3007/api/sigua"
  : "https://rm-aquino-app-be.herokuapp.com/api/sigua";
// ? "http://localhost:3007/api-sigua"
// : "https://rm-aquino-app-be.onrender.com/api-sigua"; // change to heroku

export const getBaseApi = (path) => {
  return `${baseAPI}${path}`;
};

export const getBaseUrl = (path) => {
  return `${baseURL}${path}`;
};
