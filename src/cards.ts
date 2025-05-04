import {
  createSubElement,
  createSubElementWithClass,
  hideElement,
  showElement,
  createBusyLoader,
} from "./domhelpers";
import {
  Action,
  ActionsList,
  Card,
  FocusFunction,
  FormGroup,
  HideFunction,
  Input,
  Section,
  Select,
  SetNameFunction,
  ShowFunction,
  ShowHideable,
  Table,
  Text,
  WithValueFunction,
} from "./types";

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

let cardStyleMapper: { [key: string]: string };

export const setStyleMapping = (mapper: { [key: string]: string }) => {
  cardStyleMapper = mapper;
};

export const buildAction = (container: HTMLElement, text: string): Action => {
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
        handler();
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
    setText: (text: string) => {
      textContainer.innerText = text;
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
export interface Choice extends Error {
  setName: SetNameFunction<Choice>;
  focus: FocusFunction<Choice>;
  show: ShowFunction<Choice>;
  hide: HideFunction<Choice>;
  withValue: WithValueFunction<Choices>;
}
export const buildChoices = (
  container: HTMLElement,
  values: any[],
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
  const errorMethods = buildError(container);
  const selectContainer = createSubElementWithClass(
    itemContainer,
    "div",
    lookupClass("card-choices"),
  ) as HTMLSelectElement;
  let firstContainer: HTMLElement;
  let counter = 0;
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
      );
      if (counter == 0) {
        firstContainer = checkBoxContainer;
      }
      counter += 1;
      checkBoxContainer.setAttribute("type", "checkbox");
      checkBoxContainer.setAttribute("value", key);
      checkBoxContainer.setAttribute("id", key);
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
    onchange: (handler: Function) => {
      selectContainer.onchange = () => {
        handler(selectContainer.value);
      };
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
    ...errorMethods,
  };
  return choices;
};

export const buildFormGroup = (container: HTMLElement): FormGroup => {
  const keyMap = {};
  const valuesMap = {};
  const formGroup = {
    withValueMap: (handler: Function) => {
      handler(valuesMap);
    },
    focus: (key: string) => {
      const elementToFocus = keyMap[key];
      if (elementToFocus) {
        elementToFocus.focus();
      }
      return formGroup;
    },
    select: (key: string, values: { [key: string]: any }[], prompt: string) => {
      const aSelect = buildSelect(container, values, prompt);
      Object.assign(keyMap, { [key]: aSelect });
      aSelect.onChange((value: string) => {
        Object.assign(valuesMap, { [key]: value });
      });
      return aSelect;
    },
    input: (key: string, type: string, prompt: string) => {
      const anInput = buildInput(container, type, prompt);
      Object.assign(keyMap, { [key]: anInput });
      anInput.onChange((value: string) => {
        Object.assign(valuesMap, { [key]: value });
      });
      return anInput;
    },
  };
  return formGroup;
};

export const buildSection = (
  container: HTMLElement,
  title: string,
): Section => {
  const errorContainer = createSubElementWithClass(
    container,
    "div",
    lookupClass("card-errors"),
  );
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
  if (title) {
    const sectionHeaderTitleContainer = createSubElementWithClass(
      sectionHeaderContainer,
      "div",
      lookupClass("card-section-header-title"),
    );
    sectionHeaderTitleContainer.innerText = title;
  }
  const errors = buildError(errorContainer);
  const busyLoaderContainer = createBusyLoader(sectionContainer);
  const section = {
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
      return buildAction(actionsContainer, text);
    },
    table: (headers: string[]) => {
      return buildTable(container, headers);
    },
    choice: (values: string[], prompt: string) => {
      return buildChoices(container, values, prompt);
    },
    formGroup: () => {
      return buildFormGroup(sectionContainer);
    },
    ...errors,
  };
  return section;
};
const makeBusyOrAvailable = (container: HTMLElement) => ({
  busy: () => {
    container.style.display = "flex";
    return card;
  },
  available: () => {
    container.style.display = "none";
    return card;
  },
});
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
  const sections: ShowHideable<Section>[] = [];
  const errorMethods = buildError(container);
  hideElement(headerContainer);
  hideElement(titleContainer);
  const busyContainer = createBusyLoader(cardContainer);
  const busyLoaderContainer = createBusyLoader(busyContainer);
  const card: Card = {
    title: (title: string) => {
      title = title;
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
    section: (title: string) => {
      const aSection = buildSection(bodyContainer, title);
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
    ...makeBusyOrAvailable(busyLoaderContainer),
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
