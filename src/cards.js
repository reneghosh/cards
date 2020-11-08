"uses strict";
import { createSubElement, createSubElementWithClass, hideElement, showElement, createBusyLoader } from "./domhelpers.js";
import { proxyChainer } from "./proxychainer.js";

const log = console.log;

export const lookupClass = (...classNames) => {
    let classNameList = [];
    for (let className of classNames) {
        // log(className)
        if (cardStyleMapper != undefined) {
            const mappedStyle = cardStyleMapper[className];
            if ((mappedStyle != undefined)) {
                classNameList.push(mappedStyle);                
            }
            return classNameList.join(" ");
        }
    }
    return classNames.join(" ");
}

export var cardStyleMapper;

export const setStyleMapping = (mapper) => {
    cardStyleMapper = mapper;
}

const actionDefinition = {
    action: {
        build: (container, text) => {
            const actionContainer = createSubElementWithClass(container, "button", lookupClass("card-button"));
            actionContainer.innerText = text;
            return {
                show: () => {
                    showElement(actionContainer);
                },
                hide: () => {
                    hideElement(actionContainer);
                },
                onclick: (handler) => {
                    actionContainer.onclick = (event) => {
                        handler();
                    }
                }
            }
        }
    }
}

const tableDefinition = {
    table: {
        build: (container, headers) => {
            const tableContainer = createSubElementWithClass(container, "table", lookupClass("card-table"));
            const headerContainer = createSubElement(tableContainer, "thead");
            const bodyContainer = createSubElement(tableContainer, "tbody");
            const headerRowContainer = createSubElement(headerContainer, "tr");
            const selectionHandlers = [];
            if (headers != undefined) {
                for (let header of headers) {
                    const headerContainer = createSubElement(headerRowContainer, "th");
                    headerContainer.innerText = header;
                }
            }
            return {
                addRow: (values) => {
                    const rowContainer = createSubElementWithClass(bodyContainer, "tr", lookupClass("card-table-row"));
                    rowContainer.setAttribute("tabindex", "1");
                    for (let value of values) {
                        const valueContainer = createSubElement(rowContainer, "td");
                        valueContainer.innerText = value;
                    }
                    rowContainer.onclick = () => {
                        for (let handler of selectionHandlers) {
                            handler(values);
                        }
                    }
                    rowContainer.onkeypress = (event) => {
                        if (event.code == "Enter") {
                            for (let handler of selectionHandlers) {
                                handler(values);
                            }
                        }
                    }
                },
                clearAllRows: () => {
                    bodyContainer.innerHTML = "";
                },
                onSelect: (handler) => {
                    selectionHandlers.push(handler);
                },
                show: () => {
                    showElement(tableContainer);
                },
                focus: () => {
                    if (bodyContainer != undefined) {
                        for (let i = 0; i == 0 && i < bodyContainer.childNodes.length; i++) {
                            bodyContainer.childNodes[i].focus();
                        }
                    }
                },
                hide: () => {
                    hideElement(tableContainer);
                },
            }
        }
    }
}

const actionListDefinition = {
    actions: {
        build: (container) => {
            const actionListContainer = createSubElementWithClass(container, "div", lookupClass("card-action-list"));
            const actionMethods = proxyChainer(actionDefinition, [actionListContainer]);
            return {
                show: () => {
                    showElement(actionListContainer);
                },
                hide: () => {
                    hideElement(actionListContainer);
                },
                ...actionMethods
            }

        }
    }
}

const textDefinition = {
    text: {
        build: (container, text) => {
            const textContainer = createSubElementWithClass(container, "div", lookupClass("card-text"));
            textContainer.innerText = text;
            return {
                show: () => {
                    showElement(textContainer);
                },
                setText: (text) => {
                    textContainer.innerText = text;
                },
                hide: () => {
                    hideElement(textContainer);
                },

            }

        }
    }
}
const errorsDefinition = {
    errors: {
        build: (container) => {
            const errorContainer = createSubElementWithClass(container, "div", lookupClass("card-errors"));
            var hidden = true;
            hideElement(errorContainer);
            var errors = [];
            const renderError = (error) => {
                const errorMessageElement = createSubElementWithClass(errorContainer, "div", lookupClass("card-error"));
                errorMessageElement.innerText = error;
                if (hidden) {
                    hidden = false;
                    showElement(errorContainer);
                }
            }
            return {
                addError: (error) => {
                    errors.push(error);
                    renderError(error);
                },
                error: (error) => {
                    errors = [error];
                    errorContainer.innerHTML = "";
                    renderError(error);
                },
                clearErrors: () => {
                    errors = [];
                    errorContainer.innerHTML = "";
                    hidden = true;
                    hideElement(errorContainer);
                }
            }
        }
    }
}
const inputDefinitions = {
    input: {
        build: (container, type, prompt) => {
            const itemContainer = createSubElementWithClass(container, "div", lookupClass("card-item"));
            const promptContainer = createSubElementWithClass(itemContainer, "div", lookupClass("card-prompt"));
            promptContainer.innerText = prompt;
            const errorMethods = proxyChainer(errorsDefinition, [itemContainer]).errors();
            let inputContainer;
            if (type.trim().toLowerCase() == "multiline"){
                inputContainer = createSubElementWithClass(itemContainer, "textarea", lookupClass("card-input"));
            } else {
                inputContainer = createSubElementWithClass(itemContainer, "input", lookupClass("card-input"));
                inputContainer.setAttribute("type", type);
            }
            return {
                setName: (name) => {
                    inputContainer.setAttribute("name", name);
                },
                onchange: (handler) => {
                    inputContainer.onchange = (event) => {
                        handler(inputContainer.value);
                    }
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
                withValue: (handler) => {
                    handler(inputContainer.value);
                },
                ...errorMethods
            }
        }
    },
    select: {
        build: (container, values, prompt) => {
            log(lookupClass("card-item", "card-select-container"))
            const itemContainer = createSubElementWithClass(container, "div", lookupClass("card-item"));
            const promptContainer = createSubElementWithClass(itemContainer, "label", lookupClass("card-prompt"));
            const selectionContainer = createSubElementWithClass(itemContainer, "div", lookupClass("card-select-container"));
            promptContainer.innerText = prompt;
            const errorMethods = proxyChainer(errorsDefinition, [itemContainer]).errors();
            const selectElement = createSubElementWithClass(selectionContainer, "select", lookupClass("card-selection"));
            const optionContainer = createSubElement(selectElement, "option");
            // optionContainer.innerText = prompt;
            for (let value of values) {
                for (let key in value) {
                    const optionContainer = createSubElement(selectElement, "option");
                    optionContainer.setAttribute("value", key);
                    optionContainer.innerText = value[key];
                }
            }
            return {
                setName: (name) => {
                    selectElement.setAttribute("name", name);
                },
                onchange: (handler) => {
                    selectElement.onchange = (event) => {
                        handler(selectElement.value);
                    }
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
                withValue: (handler) => {
                    handler(selectElement.value);
                },
                ...errorMethods
            }
        }
    },
    choices: {
        build: (container, values, prompt) => {
            const itemContainer = createSubElementWithClass(container, "div", lookupClass("card-item"));
            const promptContainer = createSubElementWithClass(itemContainer, "div", lookupClass("card-prompt"));
            promptContainer.innerText = prompt;
            const errorMethods = proxyChainer(errorsDefinition, [itemContainer]).errors();
            const selectContainer = createSubElementWithClass(itemContainer, "div", lookupClass("card-choices"));
            // const fieldSet = createSubElementWithClass(selectContainer, "fieldset", lookupClass("card-choices"));
            var firstContainer;
            let counter = 0;
            for (let value of values) {
                for (let key in value) {
                    const optionContainer = createSubElementWithClass(selectContainer, "div", lookupClass("card-choice"));
                    const checkBoxContainer = createSubElementWithClass(optionContainer, "input", lookupClass("card-input-checkbox"));
                    if (counter == 0) {
                        firstContainer = checkBoxContainer;
                    }
                    counter += 1;
                    checkBoxContainer.setAttribute("type", "checkbox")
                    checkBoxContainer.setAttribute("value", key);
                    checkBoxContainer.setAttribute("id", key);
                    const textContainer = createSubElementWithClass(optionContainer, "label", lookupClass("card-choice-label"));
                    textContainer.setAttribute("for", key);
                    textContainer.innerText = value[key];
                }
            }
            return {
                setName: (name) => {
                    selectContainer.setAttribute("name", name);
                },
                onchange: (handler) => {
                    selectContainer.onchange = (event) => {
                        handler(selectContainer.value);
                    }
                },
                focus: () => {
                    if (firstContainer != undefined) {
                        firstContainer.focus();
                    }
                },
                show: () => {
                    showElement(itemContainer);
                },
                hide: () => {
                    hideElement(itemContainer);
                },
                withValue: (handler) => {
                    handler(selectContainer.value);
                },
                ...errorMethods
            }
        }
    }
}

const formGroupDefinition = {
    formGroup: {
        build: (container) => {
            const inputMethods = proxyChainer(inputDefinitions, [container]);
            const proxifiedMethods = {};
            const keyMap = {};
            for (let [methodName, methodFunction] of Object.entries(inputMethods)) {
                proxifiedMethods[methodName] = (key, ...args) => {
                    const input = methodFunction(...args);
                    input.setName(key);
                    keyMap[key] = input;
                    return input;
                }
            }
            return {
                withValueMap: (handler) => {
                    const map = {};
                    for (let [key, input] of Object.entries(keyMap)) {
                        input.withValue(value => {
                            map[key] = value
                        });
                    }
                    handler(map);
                },
                focus: (key) => {
                    const elementToFocus = keyMap[key];
                    if (elementToFocus != undefined) {
                        elementToFocus.focus();
                    }
                },
                ...proxifiedMethods
            }
        }
    }
}

const sectionDefinition = {
    section: {
        build: (container, title) => {
            const sectionContainer = createSubElementWithClass(container, "div", lookupClass("card-section"));
            const sectionHeaderContainer = createSubElementWithClass(sectionContainer, "h3", lookupClass("card-section-header"));
            if (title != undefined) {
                const sectionHeaderTitleContainer = createSubElementWithClass(sectionHeaderContainer, "div", lookupClass("card-section-header-title"));
                sectionHeaderTitleContainer.innerText = title;
            }
            const sectionItems = []
            const inputMethods = proxyChainer(inputDefinitions, [sectionContainer]);
            const actionListMethods = proxyChainer(actionListDefinition, [sectionContainer]);
            const textMethods = proxyChainer(textDefinition, [sectionContainer]);
            const formGroupMethods = proxyChainer(formGroupDefinition, [sectionContainer]);
            const errorMethods = proxyChainer(errorsDefinition, [sectionContainer]).errors();
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
                ...textMethods
            }
        }
    }
}

const cardDefinition = {
    card: {
        build: (container) => {
            let title, subtitle;
            const cardContainer = createSubElementWithClass(container, "div", lookupClass("card"));
            const bodyContainer = createSubElementWithClass(cardContainer, "div", lookupClass("card-body"));
            const headerContainer = createSubElementWithClass(bodyContainer, "div", lookupClass("card-header"));
            const titleContainer = createSubElementWithClass(headerContainer, "h1", lookupClass("card-title"));
            // const subtitleContainer = createSubElementWithClass(headerContainer, "h2", lookupClass("card-subtitle"));
            const sections = [];
            const errorMethods = proxyChainer(errorsDefinition, [bodyContainer]).errors();
            const sectionMethods = proxyChainer(sectionDefinition, [bodyContainer]);
            const unProxifiedNewSection = sectionMethods.section;
            sectionMethods.section = (...args) => {
                const newSection = unProxifiedNewSection(...args);
                sections.push(newSection);
                return newSection;

            }
            hideElement(headerContainer);
            hideElement(titleContainer);
            // hideElement(subtitleContainer);
            const busyLoaderContainer = createBusyLoader(cardContainer);
            return {
                title: (title) => {
                    title = title;
                    titleContainer.innerText = title;
                    showElement(headerContainer);
                    showElement(titleContainer);
                },
                // subtitle: (subtitle) => {
                //     subtitle = subtitle;
                //     subtitleContainer.innerText = subtitle;
                //     showElement(headerContainer);
                //     showElement(subtitleContainer);
                // },
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
                ...sectionMethods
            }
        }
    }
}
export const card = (containerId) => {
    const container = document.getElementById(containerId);
    if (container != undefined) {
        let cardMethods = proxyChainer(cardDefinition, [container]);
        return cardMethods.card();
    } else {
        log("can't find container", containerId);
    }
}