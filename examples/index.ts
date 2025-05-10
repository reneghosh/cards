import { formput } from "../src/formput";

const init = (containerId: string) => {
  const main = formput(containerId).title("Basic Example");
  const loginSection = main.section("Log in");
  loginSection
    .select(
      "credentials",
      [{ save: "Yes" }, { dontSave: "No" }],
      "Save Credentials:",
    )
    .onChange((value: string) =>
      console.log("save credentials set to:", value),
    );
  main.text(
    "hello, there! It seems you are trying out the formput library. \n If you like, check out the documentation, there are a good number of things there that you might like.",
  );
  loginSection
    .input("login", "text", "Login: ")
    .onChange((login: string) => console.log("login value set to:", login));
  loginSection
    .input("password", "password", "Password: ")
    .onChange((password: string) =>
      console.log("password value set to:", password),
    );
  loginSection
    .input("comment", "multiline", "Comment: ")
    .onChange((comment: string) => console.log("comment set to:", comment));
  loginSection
    .action("Cancel")
    .onClick(() => loginSection.error("You don't seem to want to log in"));
  loginSection.action("Submit").onClick(() => {
    main.busy();
    setTimeout(() => main.available(), 3000);
  });
  loginSection
    .action("Show input map")
    .onClick(() =>
      loginSection.withValueMap((valueMap: { [key: string]: string }) =>
        console.log(valueMap),
      ),
    );
  loginSection.action("Check Section").onClick(() => {
    loginSection.busy();
    setTimeout(() => loginSection.available(), 3000);
  });
  loginSection.action("show hidden section").onClick(() => {
    loggedInSection.show();
    loginSection.focus("password");
  });
  loginSection
    .action("hide all sections")
    .onClick(() => main.hideAllSections());

  const tableSection = main.section("Table example");
  const table = tableSection.table(["Id", "First Name", "Last Name"]);
  table.addRow([1, "K.D.", "Farago"]);
  table.addRow([2, "Emile", "Kossinsky"]);
  table.onSelect((values: any) => log(values));
  tableSection.action("clear").onClick(() => table.clearAllRows());
  tableSection
    .action("add row")
    .onClick(() => table.addRow([1, "K.D.", "Farago"]));

  const loggedInSection = main.section().hide();
  loginSection.choice(
    "somechoice",
    [{ 1: "one" }, { 2: "two" }],
    "This is another select",
  );
  const lastSection = main.section("Last Section");
  const lastInput = lastSection.choice(
    "someotherchoice",
    [{ 1: "one" }, { 2: "two" }],
    "Input text",
  );
  lastInput.error("This is an error");
};

window.addEventListener("load", () => {
  init("main");
});
