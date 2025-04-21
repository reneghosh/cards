import { lookupClass } from "./cards";

declare const document: Document;
export const createSubElement = (parentContainer, tagName): HTMLElement => {
  const container: HTMLElement = document.createElement(tagName);
  parentContainer.appendChild(container);
  return container;
};

export const createSubElementWithClass = (
  parentContainer: HTMLElement,
  tagName: string,
  className: string,
): HTMLElement => {
  const container = document.createElement(tagName);
  if (className && className.length > 0) {
    for (let eachClass of className.trim().split(" ")) {
      if (className.length > 0) {
        container.classList.add(eachClass);
      }
    }
  }
  parentContainer.appendChild(container);
  return container;
};

export const hideElement = (element: HTMLElement) => {
  const cardShownClass = lookupClass("card-shown");
  const cardHiddenClass = lookupClass("card-hidden");
  if (cardShownClass && cardShownClass.length > 0) {
    element.classList.remove(cardShownClass);
  }
  if (cardHiddenClass != undefined && cardHiddenClass.length > 0) {
    element.classList.add(cardHiddenClass);
  }
};

export const showElement = (element: HTMLElement) => {
  const cardShownClass = lookupClass("card-shown");
  const cardHiddenClass = lookupClass("card-hidden");
  if (cardShownClass != undefined && cardShownClass.length > 0) {
    element.classList.add(cardShownClass);
  }
  if (cardHiddenClass != undefined && cardHiddenClass.length > 0) {
    element.classList.remove(cardHiddenClass);
  }
};

export const createBusyLoader = (container: HTMLElement) => {
  const busyLoaderContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-modal"),
  );
  busyLoaderContainer.style.display = "none";
  const loader = createSubElementWithClass(
    busyLoaderContainer,
    "div",
    lookupClass("card-loader"),
  );
  container.style.position = "relative";
  loader.innerHTML = "<div></div><div></div><div></div><div></div>";
  return busyLoaderContainer;
};
