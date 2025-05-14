import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.jsx";

const apiUrl = import.meta.env.VITE_FELLOWSEB_LAB_APIURL;

const root = createRoot(document.getElementById("app-container"));
root.render(<App apiUrl={apiUrl} win={window} />);
