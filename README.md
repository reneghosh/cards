# cards

A library for building simple card-based user interfaces in browser applications.

## Motivation

The fluidity and adaptability of the browser blurs the line between content sites and applications. A plethora of frameworks exist to build consistent, performant interfaces for applications, covering the widest range of visual and functional possibilities.

This library aims for something simpler: allow ECMAScript developpers to build card-based interfaces through a simple API that uses function chaining to provide simple user interactions.

# Status

This project is very much in alpha stage at the moment, and the interface is still evolving. It's nevertheless usable, and can be integrated into existing projets by cloning this repository and copying the `.js` files into another project.

## Installation

*TBD node and release file installation guide*

## Sample usage

To begin building a card application, start from the HTML element with a unique id where you want to anchor the interface. Pass the id to the card builder, then chain API functions to build it.

Example using it in a webpage:

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="../style.css">
        <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
        <script type="module">
            import { card } from "../cards.js";
            window.onload = () => {
                const mainCard = card("main").title("Card Example");
                const loginSection = mainCard.section("Log in");
                const formGroup = loginSection.formGroup();
                formGroup.input("login", "text", "Login: ")
                    .onchange(login => console.log("login value set to:", login));
                formGroup.input("password", "password", "Password: ")
                    .onchange(password => console.log("password value set to:", password));
                const loginActions = loginSection.actions();
                loginActions.action("Cancel")
                    .onclick(() => loginSection.error("You don't seem to want to log in"));
                loginActions.action("Submit")
                    .onclick(() => { card.busy(); setTimeout(() => card.available(), 3000) });
                loginActions.action("Show input map")
                    .onclick(() => formGroup.withValueMap(valueMap => console.log(valueMap)));
            };
        </script>
    </head>
    <body>
        <div id="main" style="width: 30em">
        </div>
    </body>
</html>
```
## Component hierarchy of chainable functions

**Item functions:**

- `card(containerId)`: create a card anchored to HTML element of given id
    - `title(text)`: set the card title to `text`
    - `busy()`: show busy animation to freeze the interface on the entire card while awaiting the result of an async operation
    - `available()`: hide busy animation upon termination of an async operation
    - `hideAllSections()`: hide all sections that are registered on the card
    - `[error functions]`
    - `section(title)`: add section with optional `title` text.
        - `[error functions]`
        - `busy()`: show busy animation to freeze the interface on the section only while awaiting the result of an async operation
        - `available()`: hide busy animation upon termination of an async operation
        - `input(inputType, prompt)`: add a text input field of `inputType` (`text`,`password`, `date` etc.) with an associated label containing `prompt` text. *Note: to use a textarea instead of a standard text input, set type to `multiline`.
            - `[error functions]`
            - `onchange(fn)`: execute `fn` with the input field value upon change
            - `withValue()`: execute `fn` with input field value
        - `select()`: 
            - `[error functions]`
            - `onchange()`: execute `fn` with the selected value upon change
            - `withValue()`: execute `fn` with the selected value
        - `choice()`: 
            - `[error functions]`
            - `onchange()`: execute `fn` with the chosen field values upon change
            - `withValue(fn)`: execute `fn` with the chosen values
        - `formGroup()`: 
            - `[error functions]`
            - `withValues()`: execute `fn` with the group value map
        - `text(text)`: add an information text box
        - `table(headers)`: add a data table, initialized with the `headers` array of table headers
            - `addRow(data)`: add `data` containing an array of values, as a row
            - `clearAllRows()`: remove all data rows
        - `actions()`: 
            - `action(label)`: add an action button with given `label`.
                - `onclick(fn)`: execution `fn` when the button is activated

**Error functions:**

- `addError(text)`: add `text` to list of errors
- `error(text)`: set the sole error to `text`
- `clearErrors()`: clear all errors from the display

## Integrating with existing CSS

An opiniated framework that doesn't do everything you need yet doesn't integrate with your existing CSS would not be very useful!

To leverage your own styles or develop your own look and feel, you simply provide a mapper object that translates the preset css class names to those of your choice.

The list of styles that can be overload is as follows:

|     Class name             |                 Where it goes                   |
| ---------------------------| ------------------------------------------------|
| card                       | The main enclosing container. Use this for overall card looks |
| card-body                  | A container for the card body. Use this for the layout of card sections |
| card-header                | The card header container, which holds the title |
| card-sections              | A container off off card-body with one child per card section |
| card-title                 | Styling for the card title |
| card-errors                | Container for a list of errors, present at card, section and input level |
| card-error                 | A card error, set within the error container, present at card, section and input level |
| card-section               | Container for sections, each of which has its onw inputs and action lists |
| card-section-header        | The container for section title |
| card-section-header-title  | Styling for the section title |
| card-table                 | Styling for tables |
| card-table-row             | Styling for each row of a table |
| card-text                  | Styling for text information boxes |
| card-input                 | Styling for input fields |
| card-item                  | Styling for each item of a section, an item containing either input containers or action containers |
| card-hidden                | Styling for a hidden section or item |
| card-shown                 | Styling for a shown section or item |
| card-prompt                | Container for an input's prompt |
| card-selection             | Container for a selection |
| card-choices               | Container for a list of choice checkboxes |
| card-choice                | Container for a checkbox and label |
| card-input-checkbox        | Styling for a checkbox |
| card-choice-label          | Styling for a checkbox label |
| card-action-list           | Container for a list of actions |
| card-button                | Styling for an action |


### Example styling with Bootstrap:

```javascript
import { setStyleMapping, card } from "../cards.js";
setStyleMapping({
    "card": "flex-column border-bottom",
    "card-body": "",
    "card-header": "",
    "card-sections": "flex-column",
    "card-title": "text-center",
    "card-errors": "bg-danger bd-gradient",
    "card-error": "text-white",
    "card-section": "border-top",
    "card-section-header": "bg-light",
    "card-section-header-title": "",
    "card-table": "table table-striped",
    "card-table-row": "",
    "card-text": "lead",
    "card-input": "form-control",
    "card-item": "flex-row",
    "card-hidden": "d-none",
    "card-shown": "d-flex-column",
    "card-prompt": "form-check-label",
    "card-selection": "form-select",
    "card-choices": "d-flex-row",
    "card-choice": "form-check form-check-inline",
    "card-input-checkbox": "form-check-input",
    "card-choice-label": "form-check-label",
    "card-action-list": "flex-row justify-content-center m-2",
    "card-button": "btn btn-dark m-1",
});
const mainCard = card("main").title("Card Example");
//...
```

See other examples in the (examples)[./examples] folder.

## Adding custom components

The library can be extended with custom components, or even redevelopped with a whole new set of components.

A component is added through its *definition*. A component definition is an object that contains a series of keys, each key representing the component's calling function name. Associated to the key is a build function that takes the input build parameters returns an object with all the functions that this component exposes.

*TBD*
