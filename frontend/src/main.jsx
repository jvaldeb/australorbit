import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Launches from "./Launches.jsx";
import SpaceWeather from "./SpaceWeather.jsx";

const path = window.location.pathname;

const root = ReactDOM.createRoot(document.getElementById("root"));

if (path === "/lanzamientos") {
  root.render(<Launches/>);
} else if (path === "/espacio") {
  root.render(<SpaceWeather/>);
} else {
  root.render(<App/>);
}
