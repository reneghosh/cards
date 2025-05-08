import { card } from "../src/cards";

const init = (containerId: string) => {
  const mainCard = card(containerId).title("Card Example");
  const loginSection = mainCard.section("Log in");
  loginSection
    .select(
      "credentials",
      [{ save: "Yes" }, { dontSave: "No" }],
      "Save Credentials:",
    )
    .onChange((value: string) =>
      console.log("save credentials set to:", value),
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
    mainCard.busy();
    setTimeout(() => mainCard.available(), 3000);
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
    .onClick(() => mainCard.hideAllSections());

  const tableSection = mainCard.section("Table example");
  const table = tableSection.table(["Id", "First Name", "Last Name"]);
  table.addRow([1, "K.D.", "Farago"]);
  table.addRow([2, "Emile", "Kossinsky"]);
  table.onSelect((values: any) => log(values));
  tableSection.action("clear").onClick(() => table.clearAllRows());
  tableSection
    .action("add row")
    .onClick(() => table.addRow([1, "K.D.", "Farago"]));

  const loggedInSection = mainCard.section().hide();
  loginSection.choice([{ 1: "one" }, { 2: "two" }], "This is another select");
  const lastSection = mainCard.section("Last Section");
  const lastInput = lastSection.choice(
    [{ 1: "one" }, { 2: "two" }],
    "Input text",
  );
  lastInput.error("This is an error");
};

window.addEventListener("load", () => {
  init("main");
});
