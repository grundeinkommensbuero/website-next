// create a valid ID for usage in the DOM
export function stringToId(string: string) {
  return string && string.toString().replace(/^[^a-z]+|[^\w:.-]+/gi, '');
}
