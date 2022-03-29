export const getMessage = (key, parameters) =>
  chrome.i18n.getMessage(key, parameters) || `??${key}??`;

export const arraymove = (array, fromIndex, toIndex) => {
  const clonedArray = [...array];
  const element = clonedArray[fromIndex];
  clonedArray.splice(fromIndex, 1);
  clonedArray.splice(toIndex, 0, element);
  return clonedArray;
};

export const getUpperIndex = (length, index) => {
  if (index === 0) {
    return length - 1;
  }
  return index - 1;
};

export const getLowerIndex = (length, index) => {
  if (index === length - 1) {
    return 0;
  }
  return index + 1;
};
