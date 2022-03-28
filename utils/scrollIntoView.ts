// https://stackoverflow.com/questions/8922107/javascript-scrollintoview-middle-alignment
export const scrollIntoView = (element: Element | null) => {
  if (element) {
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - window.innerHeight / 2;
    window.scrollTo(0, middle);
  }
};
