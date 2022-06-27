import { format } from "date-fns";

export const formatDate = (date, dateformat = "yyyy-MM-dd") => {
  return format(new Date(date), dateformat);
};

export const getInitials = (str = "") => {
  return str.toUpperCase().charAt(0);
};
