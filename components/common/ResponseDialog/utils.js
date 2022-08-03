export const successMessage = ({ noun = "Item", verb = "" }) => {
  return `${noun} successfully ${verb}.`;
};

export const duplicateMessage = ({ noun, item }) => {
  let str = noun ? `${noun} ` : "";
  return `${str}${item} already exist.`;
};

export const associationMessage = ({ noun = "Item", item, verb = "" }) => {
  return `Unable to ${verb} ${item}. Associated with ${noun}.`;
};
