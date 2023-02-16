export const isNullish = <T>(
  argument: T | undefined | null,
): argument is undefined | null => argument === null || argument === undefined;

export const getMessage = (
  key: string,
  parameters?: string | string[] | undefined,
) => chrome.i18n.getMessage(key, parameters) || `??${key}??`;

export const arraymove = <T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): T[] => {
  const clonedArray = [...array];
  const [element] = clonedArray.splice(fromIndex, 1);
  clonedArray.splice(toIndex, 0, element);
  return clonedArray;
};

export const getUpperIndex = (length: number, index: number) => {
  if (index === 0) {
    return length - 1;
  }
  return index - 1;
};

export const getLowerIndex = (length: number, index: number) => {
  if (index === length - 1) {
    return 0;
  }
  return index + 1;
};
