import { format } from "date-fns";

export const formatDate = (date, dateformat = "yyyy-MM-dd") => {
  return format(new Date(date), dateformat);
};

export const getInitials = (str = "") => {
  return str.toUpperCase().charAt(0);
};

export const getFullName = ({ firstName, lastName, middleName, suffix }) => {
  let fullName = `${firstName} ${lastName} ${middleName}`;
  if (suffix) fullName = `${fullName} ${suffix}`;
  return fullName;
};

export const getUniquePersonId = ({
  firstName,
  lastName,
  middleName,
  suffix,
  birthdate,
}) => {
  const fullname = getFullName({ firstName, middleName, lastName, suffix });
  const id = `${fullname} ${formatDate(birthdate)}`;
  return id;
};
