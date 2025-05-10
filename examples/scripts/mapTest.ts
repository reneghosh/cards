import { formput } from "../../src/formput";
window.onload = () => {
  const mainFormput = formput("main");
  mainFormput
    .input("feeling", "text", "how are you feeling")
    .onChange((value) => console.log(value));

  mainFormput.choice(
    "arms",
    [{ one: 1 }, { two: 2 }],
    "how many arms do you possess?",
  );

  mainFormput.action("show values").onClick((vals) => console.log(vals));
};
