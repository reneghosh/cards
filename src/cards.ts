import {
  createSubElement,
  createSubElementWithClass,
  hideElement,
  showElement,
  createBusyLoader,
} from "./domhelpers";
import { proxyChainer } from "./proxychainer";

const log = console.log;
interface Hideable {
  hide: Function;
}

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

const actionDefinition = {
  action: {
    build: (container: HTMLElement, text: string) => {
      const actionContainer = createSubElementWithClass(
        container,
        "button",
        lookupClass("card-button"),
      );
      actionContainer.innerText = text;
      return {
        show: () => {
          showElement(actionContainer);
        },
        hide: () => {
          hideElement(actionContainer);
        },
        onclick: (handler: Function) => {
          actionContainer.onclick = () => {
            handler();
          };
        },
      };
    },
  },
};

const tableDefinition = {
  table: {
    build: (container: HTMLElement, headers: string[]) => {
      const tableContainer = createSubElementWithClass(
        container,
        "table",
        lookupClass("card-table"),
      );
      const headerContainer = createSubElement(tableContainer, "thead");
      const bodyContainer = createSubElement(tableContainer, "tbody");
      const headerRowContainer = createSubElement(headerContainer, "tr");
      const selectionHandlers: Function[] = [];
      if (headers != undefined) {
        for (const header of headers) {
          const headerContainer = createSubElement(headerRowContainer, "th");
          headerContainer.innerText = header;
        }
      }
      return {
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
        },
        clearAllRows: () => {
          bodyContainer.innerHTML = "";
        },
        onSelect: (handler: Function) => {
          selectionHandlers.push(handler);
        },
        show: () => {
          showElement(tableContainer);
        },
        focus: () => {
          if (bodyContainer) {
            for (
              let i = 0;
              i == 0 && i < bodyContainer.childNodes.length;
              i++
            ) {
              (bodyContainer.childNodes[i] as HTMLInputElement).focus();
            }
          }
        },
        hide: () => {
          hideElement(tableContainer);
        },
      };
    },
  },
};

const actionListDefinition = {
  actions: {
    build: (container: HTMLElement) => {
      const actionListContainer = createSubElementWithClass(
        container,
        "div",
        lookupClass("card-action-list"),
      );
      const actionMethods = proxyChainer(actionDefinition, [
        actionListContainer,
      ]);
      return {
        show: () => {
          showElement(actionListContainer);
        },
        hide: () => {
          hideElement(actionListContainer);
        },
        ...actionMethods,
      };
    },
  },
};

const textDefinition = {
  text: {
    build: (container: HTMLElement, text: string) => {
      const textContainer = createSubElementWithClass(
        container,
        "div",
        lookupClass("card-text"),
      );
      textContainer.innerText = text;
      return {
        show: () => {
          showElement(textContainer);
        },
        setText: (text: string) => {
          textContainer.innerText = text;
        },
        hide: () => {
          hideElement(textContainer);
        },
      };
    },
  },
};
const errorsDefinition = {
  errors: {
    build: (container: HTMLElement) => {
      const errorContainer = createSubElementWithClass(
        container,
        "div",
        lookupClass("card-errors"),
      );
      var hidden = true;
      hideElement(errorContainer);
      var errors = [];
      const renderError = (error: string) => {
        const errorMessageElement: HTMLElement = createSubElementWithClass(
          errorContainer,
          "div",
          lookupClass("card-error"),
        );
        errorMessageElement.innerText = error;
        if (hidden) {
          hidden = false;
          showElement(errorContainer);
        }
      };
      return {
        addError: (error: string) => {
          errors.push(error);
          renderError(error);
        },
        error: (error: string) => {
          errors = [error];
          errorContainer.innerHTML = "";
          renderError(error);
        },
        clearErrors: () => {
          errors = [];
          errorContainer.innerHTML = "";
          hidden = true;
          hideElement(errorContainer);
        },
      };
    },
  },
};
const inputDefinitions = {
  input: {
    build: (container: HTMLElement, type: string, prompt: string) => {
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
      const errorMethods = proxyChainer(errorsDefinition, [
        itemContainer,
      ]).errors();
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
      return {
        setName: (name: string) => {
          inputContainer.setAttribute("name", name);
        },
        onchange: (handler: Function) => {
          inputContainer.onchange = () => {
            handler((inputContainer as HTMLInputElement).value);
          };
        },
        focus: () => {
          inputContainer.focus();
        },
        show: () => {
          showElement(itemContainer);
        },
        hide: () => {
          hideElement(itemContainer);
        },
        withValue: (handler: Function) => {
          handler((inputContainer as HTMLInputElement).value);
        },
        ...errorMethods,
      };
    },
  },
  select: {
    build: (
      container: HTMLElement,
      values: { [key: string]: any }[],
      prompt: string,
    ) => {
      log(lookupClass("card-item", "card-select-container"));
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
      const errorMethods = proxyChainer(errorsDefinition, [
        itemContainer,
      ]).errors();
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
      return {
        setName: (name: string) => {
          selectElement.setAttribute("name", name);
        },
        onchange: (handler: Function) => {
          selectElement.onchange = () => {
            handler(selectElement.value);
          };
        },
        focus: () => {
          selectElement.focus();
        },
        show: () => {
          showElement(itemContainer);
        },
        hide: () => {
          hideElement(itemContainer);
        },
        withValue: (handler: Function) => {
          handler(selectElement.value);
        },
        ...errorMethods,
      };
    },
  },
  choices: {
    build: (container: HTMLElement, values: any[], prompt: string) => {
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
      const errorMethods = proxyChainer(errorsDefinition, [
        itemContainer,
      ]).errors();
      const selectContainer = createSubElementWithClass(
        itemContainer,
        "div",
        lookupClass("card-choices"),
      ) as HTMLSelectElement;
      // const fieldSet = createSubElementWithClass(selectContainer, "fieldset", lookupClass("card-choices"));
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
      return {
        setName: (name: string) => {
          selectContainer.setAttribute("name", name);
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
        },
        show: () => {
          showElement(itemContainer);
        },
        hide: () => {
          hideElement(itemContainer);
        },
        withValue: (handler: Function) => {
          handler(selectContainer.value);
        },
        ...errorMethods,
      };
    },
  },
};

interface WithValue {
  withValue: Function;
  focus: Function;
}

const formGroupDefinition = {
  formGroup: {
    build: (container: HTMLElement) => {
      const inputMethods = proxyChainer(inputDefinitions, [container]);
      const proxifiedMethods: { [key: string]: any } = {};
      const keyMap: { [key: string]: WithValue } = {};
      for (let [methodName, methodFunction] of Object.entries(inputMethods)) {
        proxifiedMethods[methodName] = (key: string, ...args: any[]) => {
          const input = methodFunction(...args);
          input.setName(key);
          keyMap[key] = input;
          return input;
        };
      }
      return {
        withValueMap: (handler: Function) => {
          const map: { [key: string]: any } = {};
          for (let [key, input] of Object.entries(keyMap)) {
            input.withValue((value: any) => {
              map[key] = value;
            });
          }
          handler(map);
        },
        focus: (key: string) => {
          const elementToFocus = keyMap[key];
          if (elementToFocus != undefined) {
            elementToFocus.focus();
          }
        },
        ...proxifiedMethods,
      };
    },
  },
};

const sectionDefinition = {
  section: {
    build: (container: HTMLElement, title: string) => {
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
      if (title) {
        const sectionHeaderTitleContainer = createSubElementWithClass(
          sectionHeaderContainer,
          "div",
          lookupClass("card-section-header-title"),
        );
        sectionHeaderTitleContainer.innerText = title;
      }
      const inputMethods = proxyChainer(inputDefinitions, [sectionContainer]);
      const actionListMethods = proxyChainer(actionListDefinition, [
        sectionContainer,
      ]);
      const textMethods = proxyChainer(textDefinition, [sectionContainer]);
      const formGroupMethods = proxyChainer(formGroupDefinition, [
        sectionContainer,
      ]);
      const errorMethods = proxyChainer(errorsDefinition, [
        sectionContainer,
      ]).errors();
      const tableMethods = proxyChainer(tableDefinition, [sectionContainer]);
      const busyLoaderContainer = createBusyLoader(sectionContainer);
      return {
        busy: () => {
          busyLoaderContainer.style.display = "flex";
        },
        available: () => {
          busyLoaderContainer.style.display = "none";
        },
        show: () => {
          showElement(sectionContainer);
        },
        hide: () => {
          hideElement(sectionContainer);
        },
        ...inputMethods,
        ...tableMethods,
        ...actionListMethods,
        ...formGroupMethods,
        ...errorMethods,
        ...textMethods,
      };
    },
  },
};

const cardDefinition = {
  card: {
    build: (container: any) => {
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
      const sections: Hideable[] = [];
      const errorMethods = proxyChainer(errorsDefinition, [
        bodyContainer,
      ]).errors();
      const sectionMethods = proxyChainer(sectionDefinition, [bodyContainer]);
      const unProxifiedNewSection = sectionMethods.section;
      sectionMethods.section = (...args: any[]) => {
        const newSection = unProxifiedNewSection(...args);
        sections.push(newSection);
        return newSection;
      };
      hideElement(headerContainer);
      hideElement(titleContainer);
      const busyLoaderContainer = createBusyLoader(cardContainer);
      return {
        title: (title: string) => {
          title = title;
          titleContainer.innerText = title;
          showElement(headerContainer);
          showElement(titleContainer);
        },
        hideAllSections: () => {
          for (let section of sections) {
            section.hide();
          }
        },
        busy: () => {
          busyLoaderContainer.style.display = "flex";
        },
        available: () => {
          busyLoaderContainer.style.display = "none";
        },
        ...errorMethods,
        ...sectionMethods,
      };
    },
  },
};
export const card = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (container != undefined) {
    let cardMethods = proxyChainer(cardDefinition, [container]);
    return cardMethods.card();
  } else {
    log("can't find container", containerId);
  }
};
