import { formput } from "../../src/formput";
window.onload = () => {
  const mainFormput = formput("main").title("Formput Example");
  mainFormput.text(
    `This is a simple login page with inputs for username and password.
    
    Clicking 'Cancel' will create an error, 'Submit will launch the busy indicator and 'Show input map' will <code>console.log</code>
    the current key-value map.`,
  );

  const loginSection = mainFormput.section("Log in");
  loginSection
    .input("login", "text", "Login: ")
    .onChange((login: string) => console.log("login value set to:", login));
  loginSection
    .input("password", "password", "Password: ")
    .onChange((password: string) =>
      console.log("password value set to:", password),
    );
  loginSection
    .action("Cancel")
    .onClick(() => loginSection.error("You don't seem to want to log in"));
  loginSection.action("Submit").onClick(() => {
    mainFormput.busy();
    setTimeout(() => mainFormput.available(), 3000);
  });
  loginSection
    .action("Show input map")
    .onClick(() =>
      loginSection.withValueMap((valueMap) => console.log(valueMap)),
    );
};
