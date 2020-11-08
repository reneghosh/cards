"uses strict";
import { lookupClass } from "./cards.js";


export const createSubElement = (parentContainer, tagName) => {
    const container = document.createElement(tagName);
    parentContainer.appendChild(container);
    return container;
}

export const createSubElementWithClass = (parentContainer, tagName, className) => {
    const container = document.createElement(tagName);
    if ((className != undefined) && (className.length > 0)) {
        for (let eachClass of className.trim().split(" ")) {
            if (className.length>0){
                container.classList.add(eachClass);
            }
        }
    }
    parentContainer.appendChild(container);
    return container;
}

export const hideElement = (element) => {
    const cardShownClass = lookupClass("card-shown");
    const cardHiddenClass = lookupClass("card-hidden");
    if ((cardShownClass != undefined) && (cardShownClass.length > 0)) {
        element.classList.remove(cardShownClass);
    }
    if ((cardHiddenClass != undefined) && (cardHiddenClass.length > 0)) {
        element.classList.add(cardHiddenClass);
    }
}


export const showElement = (element) => {
    const cardShownClass = lookupClass("card-shown");
    const cardHiddenClass = lookupClass("card-hidden");
    if ((cardShownClass != undefined) && (cardShownClass.length > 0)) {
        element.classList.add(cardShownClass);
    }
    if ((cardHiddenClass != undefined) && (cardHiddenClass.length > 0)) {
        element.classList.remove(cardHiddenClass);
    }
}

export const createBusyLoader = (container) => {
    const busyLoaderContainer = createSubElementWithClass(container, "div", lookupClass("card-modal"));
    busyLoaderContainer.style.display = "none";
    const loader = createSubElementWithClass(busyLoaderContainer, "div", lookupClass("card-loader"));
    container.style.position = "relative";
    loader.innerHTML = "<div></div><div></div><div></div><div></div>";
    return busyLoaderContainer;
}
