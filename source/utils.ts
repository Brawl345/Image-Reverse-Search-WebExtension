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

export const base64EncodeIcon = (ctx: CanvasRenderingContext2D): string => {
  const pngBase64 = ctx.canvas.toDataURL();
  const { data: pixels } = ctx.getImageData(0, 0, 24, 24);

  const isTransparent = pixels.some(
    (value, index) => index % 4 === 3 && value !== 255,
  );
  if (isTransparent) {
    return pngBase64;
  }

  const jpegBase64 = ctx.canvas.toDataURL('image/jpeg', 0.8);
  if (pngBase64.length < jpegBase64.length) {
    return pngBase64;
  }
  return jpegBase64;
};

export const isFirefox =
  // @ts-ignore
  typeof window !== 'undefined' && window.browser && browser.runtime;
