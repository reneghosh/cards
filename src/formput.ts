import {
  Action,
  ActionsList,
  Formput,
  Choice,
  Input,
  Section,
  Select,
  ShowHideable,
  Table,
  Text,
} from "./types";

//browser document variable
declare const document: Document;

/* look up base classes in a mapping and replace it with its corresponding class(es)*/
export const lookupClass = (...className: string[]): string => {
  let classNameList = [];
  if (formputStyleMapper) {
    const mappedStyle = formputStyleMapper[className.join("-")];
    if (mappedStyle) {
      classNameList.push(mappedStyle);
    }
    return classNameList.join(" ");
  }
  return className.join("-");
};

/* create an html element by tag name and append it to a parent container */
const createSubElement = (
  parentContainer: HTMLElement,
  tagName: string,
): HTMLElement => {
  const container: HTMLElement = document.createElement(tagName);
  parentContainer.appendChild(container);
  return container;
};

/* create an html eleemnt by tag name, with a given class name, and append it to a parent container */
const createSubElementWithClass = (
  parentContainer: HTMLElement,
  tagName: string,
  className: string,
): HTMLElement => {
  const container = createSubElement(parentContainer, tagName);
  if (className && className.length > 0) {
    for (let aClass of className.trim().split(" ")) {
      if (className.length > 0) {
        container.classList.add(aClass);
      }
    }
  }
  return container;
};

/* hide an element in the browser by adding a hidden class to its styles */
const hideElement = (element: HTMLElement) => {
  const formputShownClass = lookupClass("formput-shown");
  const formputHiddenClass = lookupClass("formput-hidden");
  if (formputShownClass && formputShownClass.length > 0) {
    element.classList.remove(formputShownClass);
  }
  if (formputHiddenClass) {
    element.classList.add(formputHiddenClass);
  }
};

/* ensure an element is shown by removing any hidden elements from its styles */
const showElement = (element: HTMLElement) => {
  const formputShownClass = lookupClass("formput-shown");
  const formputHiddenClass = lookupClass("formput-hidden");
  if (formputShownClass) {
    element.classList.add(formputShownClass);
  }
  if (formputHiddenClass) {
    element.classList.remove(formputHiddenClass);
  }
};

/* create a modal busy indicator */
const createBusyLoader = (container: HTMLElement) => {
  const busyLoaderContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-modal"),
  );
  busyLoaderContainer.style.display = "none";
  const loader = createSubElementWithClass(
    busyLoaderContainer,
    "div",
    lookupClass("formput-loader"),
  );
  container.style.position = "relative";
  loader.innerHTML = "<div></div><div></div><div></div><div></div>";
  return busyLoaderContainer;
};
let formputStyleMapper: { [key: string]: string };

/* map default styles to overloads, for theming purposes */
export const setStyleMapping = (mapper: { [key: string]: string }) => {
  formputStyleMapper = mapper;
};

/* build an action button to add to an action list on a formput section (or to the formput anonymous section)*/
export const buildAction = (
  container: HTMLElement,
  text: string,
  valuesMap: { [key: string]: any },
): Action => {
  const actionContainer = createSubElementWithClass(
    container,
    "button",
    lookupClass("formput-button"),
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

/* build a table component with given headers */
export const buildTable = (
  container: HTMLElement,
  headers: string[],
): Table => {
  const tableContainer = createSubElementWithClass(
    container,
    "table",
    lookupClass("formput-table"),
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
        lookupClass("formput-table-row"),
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

/* build an action list for a section (or formput default anonymous section) */
export const buildActionsList = (container: HTMLElement): ActionsList => {
  const actionListContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-action-list"),
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

/* build a text message component */
export const buildText = (
  container: HTMLElement,
  textMessage: string,
): Text => {
  const textContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-text"),
  );
  textContainer.innerHTML = textMessage;
  const text: Text = {
    show: () => {
      showElement(textContainer);
      return text;
    },
    setText: (textText: string) => {
      textContainer.innerHTML = textText;
      return text;
    },
    hide: () => {
      hideElement(textContainer);
      return text;
    },
  };
  return text;
};

/* build an error field */
export const buildError = (container: HTMLElement) => {
  const errorContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-errors"),
  );
  var hidden = true;
  hideElement(errorContainer);
  var errors = [];
  const renderError = (errorText: string) => {
    const errorMessageElement: HTMLElement = createSubElementWithClass(
      errorContainer,
      "div",
      lookupClass("formput-error"),
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

/* build a text input */
export const buildInput = (
  container: HTMLElement,
  type: string,
  prompt: string,
): Input => {
  const itemContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-item"),
  );
  const promptContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("formput-prompt"),
  );
  promptContainer.innerText = prompt;
  const errorMethods = buildError(container);
  let inputContainer;
  if (type.trim().toLowerCase() == "multiline") {
    inputContainer = createSubElementWithClass(
      itemContainer,
      "textarea",
      lookupClass("formput-input"),
    );
  } else {
    inputContainer = createSubElementWithClass(
      itemContainer,
      "input",
      lookupClass("formput-input"),
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

/* build a selection input */
export const buildSelect = (
  container: HTMLElement,
  values: { [key: string]: any }[],
  prompt: string,
): Select => {
  const itemContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-item"),
  );
  const promptContainer = createSubElementWithClass(
    itemContainer,
    "label",
    lookupClass("formput-prompt"),
  );
  const selectionContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("formput-select-container"),
  );
  promptContainer.innerText = prompt;
  const errorMethods = buildError(container);
  const selectElement = createSubElementWithClass(
    selectionContainer,
    "select",
    lookupClass("formput-selection"),
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

/* build a choices input */
export const buildChoices = (
  container: HTMLElement,
  values: { [key: string]: string }[],
  prompt: string,
): Choice => {
  const itemContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-item"),
  );
  const promptContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("formput-prompt"),
  );
  promptContainer.innerText = prompt;
  const errors = buildError(container);
  const selectContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("formput-choices"),
  ) as HTMLSelectElement;
  let firstContainer: HTMLElement;
  let counter = 0;
  const selectedValues = new Set<string>();
  for (let value of values) {
    for (let key in value) {
      const optionContainer = createSubElementWithClass(
        selectContainer,
        "div",
        lookupClass("formput-choice"),
      );
      const checkBoxContainer = createSubElementWithClass(
        optionContainer,
        "input",
        lookupClass("formput-input-checkbox"),
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
        lookupClass("formput-choice-label"),
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

/* build a section */
export const buildSection = (
  container: HTMLElement,
  title?: string,
): Section => {
  const sectionContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-section"),
  );
  const sectionHeaderContainer = createSubElementWithClass(
    sectionContainer,
    "h3",
    lookupClass("formput-section-header"),
  );
  const actionsContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput-actions"),
  );
  hideElement(sectionHeaderContainer);
  hideElement(sectionContainer);
  if (title) {
    const sectionHeaderTitleContainer = createSubElementWithClass(
      sectionHeaderContainer,
      "div",
      lookupClass("formput-section-header-title"),
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
    text: (text: string) => {
      const aText = buildText(sectionContainer, text);
      showElement(sectionContainer);
      return aText;
    },
    ...errors,
  };
  return section as Section;
};

/* build a formput */
export const buildFormput = (containerId: any): Formput => {
  const container = document.getElementById(containerId);
  if (!container) {
    throw `can't find element ${containerId}`;
  }
  const formputContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("formput"),
  );
  const bodyContainer = createSubElementWithClass(
    formputContainer,
    "div",
    lookupClass("formput-body"),
  );
  const headerContainer = createSubElementWithClass(
    bodyContainer,
    "div",
    lookupClass("formput-header"),
  );
  const titleContainer = createSubElementWithClass(
    headerContainer,
    "h1",
    lookupClass("formput-title"),
  );
  const untitledSection = buildSection(bodyContainer);
  const sections: ShowHideable<Section>[] = [];
  const errorMethods = buildError(bodyContainer);
  hideElement(headerContainer);
  hideElement(titleContainer);
  const busyContainer = createBusyLoader(formputContainer);
  const formput: Formput = {
    title: (title: string) => {
      titleContainer.innerText = title;
      showElement(headerContainer);
      showElement(titleContainer);
      return formput;
    },
    hideAllSections: () => {
      for (let section of sections) {
        section.hide();
      }
      return formput;
    },
    showAllSections: () => {
      for (let section of sections) {
        section.show();
      }
      return formput;
    },
    ...untitledSection,
    section: (title?: string) => {
      const aSection = buildSection(bodyContainer, title);
      sections.push(aSection);
      return aSection;
    },
    show: () => {
      showElement(formputContainer);
      return formput;
    },
    hide: () => {
      hideElement(formputContainer);
      return formput;
    },
    busy: () => {
      busyContainer.style.display = "flex";
      busyContainer.style.border = "1px solid red";
      return formput;
    },
    available: () => {
      busyContainer.style.display = "none";
      return formput;
    },
    action: untitledSection.action,
    ...errorMethods,
  };
  return formput;
};

/* build a formput anchored to an html element identified by containerId */
export const formput = (containerId: string): Formput => {
  const container = document.getElementById(containerId);
  if (container) {
    return buildFormput(containerId);
  } else {
    throw `can't find container ${containerId}`;
  }
};
