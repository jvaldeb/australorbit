import React from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App.jsx";
import Launches from "./Launches.jsx";
import SpaceWeather from "./SpaceWeather.jsx";
import Contact from "./Contact.jsx";
import News from "./News.jsx";
import SatelitesChilenos from "./SatelitesChilenos.jsx";

inject();

const path = window.location.pathname.replace(/\/$/, "") || "/";

let Component;
if      (path === "/lanzamientos")        Component = Launches;
else if (path === "/espacio")             Component = SpaceWeather;
else if (path === "/contacto")            Component = Contact;
else if (path === "/noticias")            Component = News;
else if (path === "/satelites-chilenos")  Component = SatelitesChilenos;
else                                      Component = App;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>
);
