"uses strict";
const log = console.log;
import { card } from "../cards.js";

const init = (containerId) => {    
    const mainCard = card(containerId).title("Card Example");
    const loginSection = mainCard.section("Log in");
    const formGroup = loginSection.formGroup();
    formGroup.select("credentials", [{save: "Yes"},{dontSave: "No"}], "Save Credentials:").onchange(value => log("save credentials set to:", value));
    formGroup.input("login", "text", "Login: ").onchange(login => console.log("login value set to:", login));
    formGroup.input("password", "password", "Password: ").onchange(password => console.log("password value set to:", password));
    formGroup.input("comment", "multiline", "Comment: ").onchange(comment => console.log("comment set to:", comment));
    const loginActions = loginSection.actions();
    loginActions.action("Cancel").onclick(() => loginSection.error("You don't seem to want to log in"));
    loginActions.action("Submit").onclick(() => { mainCard.busy(); setTimeout(() => mainCard.available(), 3000) });
    loginActions.action("Show input map").onclick(() => formGroup.withValueMap(valueMap => console.log(valueMap)));
    loginActions.action("Check Section").onclick(() => { loginSection.busy(); setTimeout(() => loginSection.available(), 3000) });
    loginActions.action("show hidden section").onclick(() => {loggedInSection.show();formGroup.focus("password");});
    loginActions.action("hide all sections").onclick(() => mainCard.hideAllSections());
    
    const tableSection = mainCard.section("Table example");
    const table = tableSection.table(["Id", "First Name", "Last Name"]);
    table.addRow([1, "K.D.", "Farago"]);
    table.addRow([2, "Emile", "Kossinsky"]);
    table.onSelect(values => log(values));
    tableSection.actions().action("clear").onclick(()=> table.clearAllRows());
    tableSection.actions().action("add row").onclick(()=> table.addRow([1, "K.D.", "Farago"]));
    
    const loggedInSection = mainCard.section().hide();
    const choices2 = loginSection.choices([{1: "one"}, {2: "two"}], "This is another select");
    const text2 = loggedInSection.text("This is text");
    const input2 = loggedInSection.input("text", "This is another input");
    const select2 = loggedInSection.select([{1: "one"}, {2: "two"}], "This is another select");
    const lastSection = mainCard.section("Last Section");
    const lastInput = lastSection.choices([{1: "one"}, {2: "two"}], "Input text");
    lastInput.error("This is an error")
}


window.addEventListener('load', e => {
    init("main");
})

