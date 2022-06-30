import { format } from "date-fns";

export const formatDate = (date, dateformat = "yyyy-MM-dd") => {
  return format(new Date(date), dateformat);
};

export const getInitials = (str = "") => {
  return str.toUpperCase().charAt(0);
};

export const getFullName = ({ firstName, lastName, middleName, suffix }) => {
  let fullName = `${firstName} ${lastName} ${middleName} ${middleName}`;
  if (suffix) fullName = `${fullName} ${suffix}`;
  return fullName;
};
