// We check every x ms if the element of the hash exists and then scroll to it.
// This is useful for slow internet.
export const jumpToHash = (hash: string) => {
  if (hash) {
    waitForElementToDisplay(
      hash,
      (element: Element) => {
        element.scrollIntoView();
      },
      800,
      15000
    );
  }
};

// Function to wait for the display of an element
const waitForElementToDisplay = (
  selector: string,
  callback: (element: Element) => void,
  checkFrequencyInMs: number,
  timeoutInMs: number
) => {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    const element = document.querySelector(selector);
    if (element !== null) {
      callback(element);
      return;
    } else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
};
