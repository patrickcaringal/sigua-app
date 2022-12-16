import { differenceInYears, format, nextSaturday, nextSunday } from "date-fns";
import { Timestamp } from "firebase/firestore";
import lodash from "lodash";

export const formatDate = (date, dateformat = "yyyy-MM-dd") => {
  return format(new Date(date), dateformat);
};

export const formatTimeStamp = (timestamp, dateformat = "yyyy-MM-dd") => {
  if (typeof timestamp === "string")
    return format(new Date(timestamp), dateformat);

  if ("seconds" in timestamp && "nanoseconds" in timestamp) {
    return format(
      new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000),
      dateformat
    );
  } else {
    return format(new Date(timestamp), dateformat);
  }
};

export const formatFirebasetimeStamp = (timestamp) => {
  return Timestamp.fromDate(new Date(timestamp));
};

export const convertToDate = (timestamp) => {
  if (typeof timestamp === "string") return new Date(timestamp);

  if ("seconds" in timestamp && "nanoseconds" in timestamp) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else {
    return new Date(timestamp);
  }
};

export const today = formatTimeStamp(new Date());
export const saturdayThisWeek = {
  date: nextSunday(new Date()),
  formatted: formatTimeStamp(nextSunday(new Date())),
};

export const sortBy =
  (key, sortBy = "asc") =>
  (a, b) => {
    if (sortBy === "asc")
      return new Date(convertToDate(a[key])) - new Date(convertToDate(b[key]));

    return new Date(convertToDate(b[key])) - new Date(convertToDate(a[key]));
  };

export const sortByDate_Branch =
  (key1, key2, sortBy = "asc") =>
  (a, b) => {
    const d1 = new Date(convertToDate(a[key1]));
    const d2 = new Date(convertToDate(b[key1]));

    const b1 = a[key2];
    const b2 = b[key2];
    if (sortBy === "asc") {
      // Sort by dates
      // If the first item has a higher number, move it down
      // If the first item has a lower number, move it up
      if (d1 > d2) return 1;
      if (d1 < d2) return -1;

      // If the dates are the same between both items, sort by branch
      // If the first item comes first in the alphabet, move it up
      if (b1 > b2) return 1;
      if (b1 < b2) return -1;
    }

    if (d2 > d1) return 1;
    if (d2 < d1) return -1;

    if (b2 > b1) return 1;
    if (b2 < b1) return -1;
  };

export const calculateAge = (birthdate) => {
  const age = differenceInYears(new Date(), new Date(birthdate));
  return age;
};

export const getInitials = (str = "") => {
  return str.toUpperCase().charAt(0);
};

export const getFullName = ({ firstName, lastName, middleName, suffix }) => {
  let fullName = `${firstName}`;
  if (middleName) fullName = `${fullName} ${middleName}`;
  fullName = `${fullName} ${lastName}`;
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
  const id = `${fullname} ${formatTimeStamp(birthdate)}`;
  return id;
};

export const pluralize = (noun, count, suffix = "s") =>
  `${noun}${count !== 1 ? suffix : ""}`;

export const arrayStringify = (array, separator = ", ") =>
  array.join(separator);

export const compareObj = ({ latest, old, fields = [], retainFields = [] }) => {
  const a = lodash.pick(latest, fields);
  const b = lodash.pick(old, fields);

  const isEqual = lodash.isEqual(a, b);
  const diff = {
    ...lodash
      .differenceWith(lodash.toPairs(a), lodash.toPairs(b), lodash.isEqual)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    // for retainng fields like id
    ...retainFields.reduce((acc, i) => ({ ...acc, [i]: old[i] }), {}),
  };

  return {
    isEqual,
    diff,
  };
};

export const personBuiltInFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

export const localUpdateDocs = ({
  updatedDoc,
  oldDocs,
  additionalDiffFields,
}) => {
  const index = oldDocs.findIndex((i) => i.id === updatedDoc.id);
  const oldDoc = oldDocs[index];

  const { diff } = compareObj({
    latest: updatedDoc,
    old: oldDoc,
    fields: Object.keys(oldDoc),
    retainFields: ["id"],
  });

  const updates = {
    ...diff,
    ...(!!additionalDiffFields && additionalDiffFields(diff)),
  };

  oldDocs[index] = {
    ...oldDocs[index],
    ...updates,
  };

  return {
    latestDocs: oldDocs,
    updates,
  };
};
