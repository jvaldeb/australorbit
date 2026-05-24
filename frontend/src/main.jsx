import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Launches from "./Launches.jsx";
import SpaceWeather from "./SpaceWeather.jsx";
import Contact from "./Contact.jsx";

const path = window.location.pathname.replace(/\/$/, "") || "/";

let Component;
if (path === "/lanzamientos") {
  Component = Launches;
} else if (path === "/espacio") {
  Component = SpaceWeather;
} else if (path === "/contacto") {
  Component = Contact;
} else {
  Component = App;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>
);
