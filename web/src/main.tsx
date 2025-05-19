import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.tsx";

const containerElem = document.getElementById("app-container");

if (!containerElem) {
  throw new Error("Unable to find container element");
}

const root = createRoot(containerElem);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
