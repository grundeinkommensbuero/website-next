// Make sure a string can be used in a URL
export const encodeURL = (uri: string): string => {
  return encodeURI(uri.split(' ').join('-').toLowerCase());
};
