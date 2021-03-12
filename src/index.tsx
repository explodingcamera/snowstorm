import React from "react";
import { hydrate, render } from "react-dom";
import { App } from "./app";

const element = document.getElementById("app");

if (import.meta.hot) {
  render(<App />, element);
} else {
  hydrate(<App />, element);
}
