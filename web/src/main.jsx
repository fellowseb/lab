import React from "react";
// eslint-disable-next-line react/no-deprecated
import { render } from "react-dom";
import App from "./components/App.jsx";

const apiUrl = import.meta.env.VITE_FELLOWSEB_LAB_APIURL;

render(
  <App apiUrl={apiUrl} win={window} />,
  document.getElementById("app-container"),
);
