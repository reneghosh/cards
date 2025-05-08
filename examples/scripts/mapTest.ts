// import { card } from "../../dist/cards";
import { card } from "../../src/cards";
window.onload = () => {
  const mainCard = card("main");
  mainCard
    .input("feeling", "text", "how are you feeling")
    .onChange((value) => console.log(value));

  mainCard.choice(
    "arms",
    [{ one: 1 }, { two: 2 }],
    "how many arms do you possess?",
  );

  mainCard.action("show values").onClick((vals) => console.log(vals));

  // console.log(aha);
  // mainCard.ad
};
