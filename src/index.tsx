import React from "react";
import { hydrate, render } from "react-dom";
import { App } from "./app";

const element = document.getElementById("app");
if (element?.childElementCount) {
  hydrate(<App />, element);
} else {
  render(<App />, element);
}
