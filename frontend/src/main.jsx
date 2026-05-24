import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Launches from "./Launches.jsx";
import SpaceWeather from "./SpaceWeather.jsx";

const path = window.location.pathname.replace(/\/$/, "") || "/";

let Component;
if (path === "/lanzamientos") {
  Component = Launches;
} else if (path === "/espacio") {
  Component = SpaceWeather;
} else {
  Component = App;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>
);

