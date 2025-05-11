# Formput

FormPut is a typescript library for adding simple forme-based input maps to static websites.

## When to use it

For websites that are mostly content-based and only require small pockets of user interactivity, Forput provides a fluent interface that
allows for easily embedding simple form prompts to gather user input data in a key-value map format.

# Status

This project is very much in alpha stage at the moment, and the interface is still evolving. It's nevertheless usable, and can be integrated into existing projets by cloning this repository and copying the `.js` files into another project.

## Installation

Formput can be installed directly into your project through cdn: `https://cdn.jsdelivr.net/gh/reneghosh/formput@main/src/formput.ts`


## Example usage

To begin building a formput page, start from the HTML element with a unique id where you want to anchor the interface. Pass the id to the formput builder, then chain API functions to build it.

Example using it in a webpage:

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="../style.css">
        <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
        <script type="module">
            import { formput } from "../formputs";
            window.onload = () => {
                const mainFormput = formput("main").title("Formput Example");
                const loginSection = mainFormput.section("Log in");
                loginSection.input("login", "text", "Login: ")
                    .onchange(login => console.log("login value set to:", login));
                loginSection.input("password", "password", "Password: ")
                    .onchange(password => console.log("password value set to:", password));
                const loginActions = loginSection.actions();
                loginActions.action("Cancel")
                    .onclick(() => loginSection.error("You don't seem to want to log in"));
                loginActions.action("Submit")
                    .onclick(() => { mainFormput.busy(); setTimeout(() => mainFormput.available(), 3000) });
                loginActions.action("Show input map")
                    .onclick(() => loginSection.withValueMap(valueMap => console.log(valueMap)));
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

- `formput(containerId)`: create a formput anchored to HTML element of given id
    - `title(text)`: set the formput title to `text`
    - `busy()`: show busy animation to freeze the interface on the entire formput while awaiting the result of an async operation
    - `available()`: hide busy animation upon termination of an async operation
    - `hideAllSections()`: hide all sections that are registered on the formput
    - `[error functions]`
    - `section(title)`: add section with optional `title` text.
        - `[error functions]`
        - `busy()`: show busy animation to freeze the interface on the section only while awaiting the result of an async operation
        - `available()`: hide busy animation upon termination of an async operation
        - `[error functions]`
        - `withValues()`: execute `fn` with the group value map
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
| formput                       | The main enclosing container. Use this for overall formput looks |
| formput-body                  | A container for the formput body. Use this for the layout of formput sections |
| formput-header                | The formput header container, which holds the title |
| formput-sections              | A container off off formput-body with one child per formput section |
| formput-title                 | Styling for the formput title |
| formput-errors                | Container for a list of errors, present at formput, section and input level |
| formput-error                 | A formput error, set within the error container, present at formput, section and input level |
| formput-section               | Container for sections, each of which has its onw inputs and action lists |
| formput-section-header        | The container for section title |
| formput-section-header-title  | Styling for the section title |
| formput-table                 | Styling for tables |
| formput-table-row             | Styling for each row of a table |
| formput-text                  | Styling for text information boxes |
| formput-input                 | Styling for input fields |
| formput-item                  | Styling for each item of a section, an item containing either input containers or action containers |
| formput-hidden                | Styling for a hidden section or item |
| formput-shown                 | Styling for a shown section or item |
| formput-prompt                | Container for an input's prompt |
| formput-selection             | Container for a selection |
| formput-choices               | Container for a list of choice checkboxes |
| formput-choice                | Container for a checkbox and label |
| formput-input-checkbox        | Styling for a checkbox |
| formput-choice-label          | Styling for a checkbox label |
| formput-action-list           | Container for a list of actions |
| formput-button                | Styling for an action |


### Example styling with Bootstrap:

```javascript
import { setStyleMapping, formut } from "../formput";
setStyleMapping({
    "formput": "flex-column border-bottom",
    "formput-body": "",
    "formput-header": "",
    "formput-sections": "flex-column",
    "formput-title": "text-center",
    "formput-errors": "bg-danger bd-gradient",
    "formput-error": "text-white",
    "formput-section": "border-top",
    "formput-section-header": "bg-light",
    "formput-section-header-title": "",
    "formput-table": "table table-striped",
    "formput-table-row": "",
    "formput-text": "lead",
    "formput-input": "form-control",
    "formput-item": "flex-row",
    "formput-hidden": "d-none",
    "formput-shown": "d-flex-column",
    "formput-prompt": "form-check-label",
    "formput-selection": "form-select",
    "formput-choices": "d-flex-row",
    "formput-choice": "form-check form-check-inline",
    "formput-input-checkbox": "form-check-input",
    "formput-choice-label": "form-check-label",
    "formput-action-list": "flex-row justify-content-center m-2",
    "formput-button": "btn btn-dark m-1",
});
const mainFormput = formput("main").title("Formput Example");
//...
```

See other examples in the (examples)[./examples] folder.

## Adding custom components

The library can be extended with custom components, or even redevelopped with a whole new set of components.

A component is added through its *definition*. A component definition is an object that contains a series of keys, each key representing the component's calling function name. Associated to the key is a build function that takes the input build parameters returns an object with all the functions that this component exposes.

*TBD*
