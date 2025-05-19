import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.tsx";

const apiUrl = import.meta.env.VITE_FELLOWSEB_LAB_APIURL;

const containerElem = document.getElementById("app-container");

if (!containerElem) {
  throw new Error("Unable to find container element");
}

const root = createRoot(containerElem);
root.render(
  <StrictMode>
    <App apiUrl={apiUrl} />
  </StrictMode>,
);
