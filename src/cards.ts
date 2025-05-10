import {
  Action,
  ActionsList,
  Card,
  Choice,
  Input,
  Section,
  Select,
  ShowHideable,
  Table,
  Text,
} from "./types";

declare const document: Document;
export const lookupClass = (...className: string[]): string => {
  let classNameList = [];
  if (cardStyleMapper) {
    const mappedStyle = cardStyleMapper[className.join("-")];
    if (mappedStyle) {
      classNameList.push(mappedStyle);
    }
    return classNameList.join(" ");
  }
  return className.join("-");
};

const createSubElement = (
  parentContainer: HTMLElement,
  tagName: string,
): HTMLElement => {
  const container: HTMLElement = document.createElement(tagName);
  parentContainer.appendChild(container);
  return container;
};

const createSubElementWithClass = (
  parentContainer: HTMLElement,
  tagName: string,
  className: string,
): HTMLElement => {
  const container = document.createElement(tagName);
  if (className && className.length > 0) {
    for (let aClass of className.trim().split(" ")) {
      if (className.length > 0) {
        container.classList.add(aClass);
      }
    }
  }
  parentContainer.appendChild(container);
  return container;
};

const hideElement = (element: HTMLElement) => {
  const cardShownClass = lookupClass("card-shown");
  const cardHiddenClass = lookupClass("card-hidden");
  if (cardShownClass && cardShownClass.length > 0) {
    element.classList.remove(cardShownClass);
  }
  if (cardHiddenClass) {
    element.classList.add(cardHiddenClass);
  }
};

const showElement = (element: HTMLElement) => {
  const cardShownClass = lookupClass("card-shown");
  const cardHiddenClass = lookupClass("card-hidden");
  if (cardShownClass) {
    element.classList.add(cardShownClass);
  }
  if (cardHiddenClass) {
    element.classList.remove(cardHiddenClass);
  }
};

const createBusyLoader = (container: HTMLElement) => {
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
let cardStyleMapper: { [key: string]: string };

export const setStyleMapping = (mapper: { [key: string]: string }) => {
  cardStyleMapper = mapper;
};

export const buildAction = (
  container: HTMLElement,
  text: string,
  valuesMap: { [key: string]: any },
): Action => {
  const actionContainer = createSubElementWithClass(
    container,
    "button",
    lookupClass("card-button"),
  );
  actionContainer.innerText = text;
  const action: Action = {
    show: () => {
      showElement(actionContainer);
      return action;
    },
    hide: () => {
      hideElement(actionContainer);
      return action;
    },
    onClick: (handler: Function) => {
      actionContainer.onclick = () => {
        handler(valuesMap);
      };
    },
  };
  return action;
};

export const buildTable = (
  container: HTMLElement,
  headers: string[],
): Table => {
  const tableContainer = createSubElementWithClass(
    container,
    "table",
    lookupClass("card-table"),
  );
  const headerContainer = createSubElement(tableContainer, "thead");
  const bodyContainer = createSubElement(tableContainer, "tbody");
  const headerRowContainer = createSubElement(headerContainer, "tr");
  const selectionHandlers: Function[] = [];
  if (headers) {
    for (const header of headers) {
      const headerContainer = createSubElement(headerRowContainer, "th");
      headerContainer.innerText = header;
    }
  }
  const table = {
    addRow: (values: string[]) => {
      const rowContainer = createSubElementWithClass(
        bodyContainer,
        "tr",
        lookupClass("card-table-row"),
      );
      rowContainer.setAttribute("tabindex", "1");
      for (let value of values) {
        const valueContainer = createSubElement(rowContainer, "td");
        valueContainer.innerText = value;
      }
      rowContainer.onclick = () => {
        for (let handler of selectionHandlers) {
          handler(values);
        }
      };
      rowContainer.onkeypress = (event) => {
        if (event.code == "Enter") {
          for (let handler of selectionHandlers) {
            handler(values);
          }
        }
      };
      return table;
    },
    clearAllRows: () => {
      bodyContainer.innerHTML = "";
      return table;
    },
    onSelect: (handler: Function) => {
      selectionHandlers.push(handler);
      return table;
    },
    show: () => {
      showElement(tableContainer);
      return table;
    },
    focus: () => {
      if (bodyContainer) {
        for (let i = 0; i == 0 && i < bodyContainer.childNodes.length; i++) {
          (bodyContainer.childNodes[i] as HTMLInputElement).focus();
        }
      }
      return table;
    },
    hide: () => {
      hideElement(tableContainer);
      return table;
    },
  };
  return table;
};

export const buildActionsList = (container: HTMLElement): ActionsList => {
  const actionListContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-action-list"),
  );
  // const action = buildAction(container);
  const actionsList = {
    // ...action,
    show: () => {
      showElement(actionListContainer);
      return actionsList;
    },
    hide: () => {
      hideElement(actionListContainer);
      return actionsList;
    },
  };
  return actionsList;
};

export const buildText = (
  container: HTMLElement,
  textMessage: string,
): Text => {
  const textContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-text"),
  );
  textContainer.innerText = textMessage;
  const text: Text = {
    show: () => {
      showElement(textContainer);
      return text;
    },
    setText: (textText: string) => {
      textContainer.innerText = textText;
      return text;
    },
    hide: () => {
      hideElement(textContainer);
      return text;
    },
  };
  return text;
};

export const buildError = (container: HTMLElement) => {
  const errorContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-errors"),
  );
  var hidden = true;
  hideElement(errorContainer);
  var errors = [];
  const renderError = (errorText: string) => {
    const errorMessageElement: HTMLElement = createSubElementWithClass(
      errorContainer,
      "div",
      lookupClass("card-error"),
    );
    errorMessageElement.innerText = errorText;
    if (hidden) {
      hidden = false;
      showElement(errorContainer);
    }
  };
  const error = {
    addError: (errorText: string) => {
      errors.push(errorText);
      renderError(errorText);
      return error;
    },
    error: (errorText: string) => {
      errors = [errorText];
      errorContainer.innerHTML = "";
      renderError(errorText);
      return error;
    },
    clearErrors: () => {
      errors = [];
      errorContainer.innerHTML = "";
      hidden = true;
      hideElement(errorContainer);
      return error;
    },
  };
  return error;
};

export const buildInput = (
  container: HTMLElement,
  type: string,
  prompt: string,
): Input => {
  const itemContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-item"),
  );
  const promptContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("card-prompt"),
  );
  promptContainer.innerText = prompt;
  const errorMethods = buildError(container);
  let inputContainer;
  if (type.trim().toLowerCase() == "multiline") {
    inputContainer = createSubElementWithClass(
      itemContainer,
      "textarea",
      lookupClass("card-input"),
    );
  } else {
    inputContainer = createSubElementWithClass(
      itemContainer,
      "input",
      lookupClass("card-input"),
    );
    inputContainer.setAttribute("type", type);
  }
  const input: Input = {
    setName: (name: string) => {
      inputContainer.setAttribute("name", name);
      return input;
    },
    onChange: (handler: Function) => {
      inputContainer.addEventListener("keyup", () => {
        handler((inputContainer as HTMLInputElement).value);
      });
    },
    focus: () => {
      inputContainer.focus();
      return input;
    },
    show: () => {
      showElement(itemContainer);
      return input;
    },
    hide: () => {
      hideElement(itemContainer);
      return input;
    },
    withValue: (handler: Function) => {
      handler((inputContainer as HTMLInputElement).value);
      return input;
    },
    ...errorMethods,
  };
  return input;
};

export const buildSelect = (
  container: HTMLElement,
  values: { [key: string]: any }[],
  prompt: string,
): Select => {
  const itemContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-item"),
  );
  const promptContainer = createSubElementWithClass(
    itemContainer,
    "label",
    lookupClass("card-prompt"),
  );
  const selectionContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("card-select-container"),
  );
  promptContainer.innerText = prompt;
  const errorMethods = buildError(container);
  const selectElement = createSubElementWithClass(
    selectionContainer,
    "select",
    lookupClass("card-selection"),
  ) as HTMLSelectElement;
  createSubElement(selectElement, "option");
  // optionContainer.innerText = prompt;
  for (let value of values) {
    for (let key in value) {
      const optionContainer = createSubElement(selectElement, "option");
      optionContainer.setAttribute("value", key);
      optionContainer.innerText = value[key];
    }
  }
  const select = {
    setName: (name: string) => {
      selectElement.setAttribute("name", name);
      return select;
    },
    onChange: (handler: Function) => {
      selectElement.addEventListener("change", () => {
        handler(selectElement.value);
      });
    },
    focus: () => {
      selectElement.focus();
      return select;
    },
    show: () => {
      showElement(itemContainer);
      return select;
    },
    hide: () => {
      hideElement(itemContainer);
      return select;
    },
    withValue: (handler: Function) => {
      handler(selectElement.value);
      return select;
    },
    ...errorMethods,
  };
  return select;
};
export const buildChoices = (
  container: HTMLElement,
  values: { [key: string]: string }[],
  prompt: string,
): Choice => {
  const itemContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-item"),
  );
  const promptContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("card-prompt"),
  );
  promptContainer.innerText = prompt;
  const errors = buildError(container);
  const selectContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("card-choices"),
  ) as HTMLSelectElement;
  let firstContainer: HTMLElement;
  let counter = 0;
  const selectedValues = new Set<string>();
  for (let value of values) {
    for (let key in value) {
      const optionContainer = createSubElementWithClass(
        selectContainer,
        "div",
        lookupClass("card-choice"),
      );
      const checkBoxContainer = createSubElementWithClass(
        optionContainer,
        "input",
        lookupClass("card-input-checkbox"),
      ) as HTMLInputElement;
      if (counter == 0) {
        firstContainer = checkBoxContainer;
      }
      counter += 1;
      checkBoxContainer.setAttribute("type", "checkbox");
      checkBoxContainer.setAttribute("value", key);
      checkBoxContainer.setAttribute("id", key);
      checkBoxContainer.addEventListener("change", () => {
        if (checkBoxContainer.checked) {
          selectedValues.add(key);
        } else {
          selectedValues.delete(key);
        }
      });
      const textContainer = createSubElementWithClass(
        optionContainer,
        "label",
        lookupClass("card-choice-label"),
      );
      textContainer.setAttribute("for", key);
      textContainer.innerText = value[key];
    }
  }
  const choices: Choice = {
    setName: (name: string) => {
      selectContainer.setAttribute("name", name);
      return choices;
    },
    onChange: (handler: Function) => {
      const allInputs = Array.from(selectContainer.querySelectorAll("input"));
      for (let anInput of allInputs) {
        anInput.addEventListener("change", () => {
          handler(Array.from(selectedValues.values()));
        });
      }
    },
    focus: () => {
      if (firstContainer) {
        firstContainer.focus();
      }
      return choices;
    },
    show: () => {
      showElement(itemContainer);
      return choices;
    },
    hide: () => {
      hideElement(itemContainer);
      return choices;
    },
    withValue: (handler: Function) => {
      handler(selectContainer.value);
      return choices;
    },
    ...errors,
  };
  return choices;
};

export const buildSection = (
  container: HTMLElement,
  title?: string,
): Section => {
  const sectionContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-section"),
  );
  const sectionHeaderContainer = createSubElementWithClass(
    sectionContainer,
    "h3",
    lookupClass("card-section-header"),
  );
  const actionsContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-actions"),
  );
  hideElement(sectionHeaderContainer);
  hideElement(sectionContainer);
  if (title) {
    const sectionHeaderTitleContainer = createSubElementWithClass(
      sectionHeaderContainer,
      "div",
      lookupClass("card-section-header-title"),
    );
    sectionHeaderTitleContainer.innerText = title;
    showElement(sectionHeaderContainer);
  }
  const errors = buildError(sectionContainer);
  const busyLoaderContainer = createBusyLoader(sectionContainer);
  let section = {};
  const keyMap: { [key: string]: any } = {};
  const valuesMap = {};
  section = {
    busy: () => {
      busyLoaderContainer.style.display = "flex";
      return section;
    },
    available: () => {
      busyLoaderContainer.style.display = "none";
      return section;
    },
    show: () => {
      showElement(sectionContainer);
      return section;
    },
    hide: () => {
      hideElement(sectionContainer);
      return section;
    },
    action: (text: string) => {
      showElement(sectionContainer);
      return buildAction(actionsContainer, text, valuesMap);
    },
    table: (headers: string[]) => {
      showElement(sectionContainer);
      return buildTable(container, headers);
    },
    withValueMap: (handler: Function) => {
      handler(valuesMap);
      showElement(sectionContainer);
      return parent;
    },
    focus: (key: string) => {
      const elementToFocus = keyMap[key];
      if (elementToFocus) {
        elementToFocus.focus();
      }
      return parent;
    },
    select: (key: string, values: { [key: string]: any }[], prompt: string) => {
      const aSelect = buildSelect(sectionContainer, values, prompt);
      Object.assign(keyMap, { [key]: aSelect });
      aSelect.onChange((value: string) => {
        Object.assign(valuesMap, { [key]: value });
      });
      showElement(sectionContainer);
      return aSelect;
    },
    input: (key: string, type: string, prompt: string) => {
      const anInput = buildInput(sectionContainer, type, prompt);
      Object.assign(keyMap, { [key]: anInput });
      anInput.onChange((value: string) => {
        Object.assign(valuesMap, { [key]: value });
      });
      showElement(sectionContainer);
      return anInput;
    },
    choice: (key: string, values: { [key: string]: any }[], prompt: string) => {
      const aChoice = buildChoices(sectionContainer, values, prompt);
      Object.assign(keyMap, { [key]: aChoice });
      aChoice.onChange((value: string) => {
        Object.assign(valuesMap, { [key]: value });
      });
      showElement(sectionContainer);
      return aChoice;
    },
    ...errors,
  };
  return section as Section;
};
export const buildCard = (containerId: any): Card => {
  const container = document.getElementById(containerId);
  if (!container) {
    throw `can't find element ${containerId}`;
  }
  const cardContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card"),
  );
  const bodyContainer = createSubElementWithClass(
    cardContainer,
    "div",
    lookupClass("card-body"),
  );
  const headerContainer = createSubElementWithClass(
    bodyContainer,
    "div",
    lookupClass("card-header"),
  );
  const titleContainer = createSubElementWithClass(
    headerContainer,
    "h1",
    lookupClass("card-title"),
  );
  const untitledSection = buildSection(bodyContainer);
  const sections: ShowHideable<Section>[] = [];
  const errorMethods = buildError(bodyContainer);
  hideElement(headerContainer);
  hideElement(titleContainer);
  const busyContainer = createBusyLoader(cardContainer);
  const card: Card = {
    title: (title: string) => {
      titleContainer.innerText = title;
      showElement(headerContainer);
      showElement(titleContainer);
      return card;
    },
    hideAllSections: () => {
      for (let section of sections) {
        section.hide();
      }
      return card;
    },
    showAllSections: () => {
      for (let section of sections) {
        section.show();
      }
      return card;
    },
    ...untitledSection,
    section: (title?: string) => {
      const aSection = buildSection(bodyContainer, title);
      sections.push(aSection);
      return aSection;
    },
    show: () => {
      showElement(cardContainer);
      return card;
    },
    hide: () => {
      hideElement(cardContainer);
      return card;
    },
    busy: () => {
      busyContainer.style.display = "flex";
      busyContainer.style.border = "1px solid red";
      console.log(busyContainer);
      return card;
    },
    available: () => {
      busyContainer.style.display = "none";
      return card;
    },
    action: untitledSection.action,
    ...errorMethods,
  };
  return card;
};

export const card = (containerId: string): Card => {
  const container = document.getElementById(containerId);
  if (container) {
    return buildCard(containerId);
  } else {
    throw `can't find container ${containerId}`;
  }
};
