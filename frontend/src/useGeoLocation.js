import { useState, useEffect } from "react";

const STORAGE_KEY = "ao_user_location";
const CITY_KEY    = "ao_user_city";
const COUNTRY_KEY = "ao_user_country";
const CODE_KEY    = "ao_user_country_code";

// Países de LATAM para detección
const LATAM_COUNTRIES = new Set([
  "Chile","Argentina","Brasil","Brazil","México","Mexico","Colombia","Perú","Peru",
  "Venezuela","Bolivia","Ecuador","Uruguay","Paraguay","Cuba","República Dominicana",
  "Dominican Republic","Guatemala","Honduras","El Salvador","Nicaragua","Costa Rica",
  "Panamá","Panama","Puerto Rico","Jamaica","Trinidad and Tobago",
]);

export function useGeoLocation() {
  const [userLat, setUserLat]         = useState(-33.4489);
  const [userLon, setUserLon]         = useState(-70.6693);
  const [userCity, setUserCity]       = useState("Santiago");
  const [userCountry, setUserCountry] = useState("Chile");
  const [userCountryCode, setUserCountryCode] = useState("CL");
  const [isLatam, setIsLatam]         = useState(true);
  const [geoReady, setGeoReady]       = useState(false);
  const [geoPrompt, setGeoPrompt]     = useState(false);

  // Al montar, intentar cargar del localStorage primero
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const city  = localStorage.getItem(CITY_KEY);
    const country = localStorage.getItem(COUNTRY_KEY);
    const code  = localStorage.getItem(CODE_KEY);

    if (saved && city) {
      const [lat, lon] = JSON.parse(saved);
      setUserLat(lat);
      setUserLon(lon);
      setUserCity(city);
      if (country) {
        setUserCountry(country);
        setIsLatam(LATAM_COUNTRIES.has(country));
      }
      if (code) setUserCountryCode(code);
      setGeoReady(true);
    } else {
      // No hay ubicación guardada — mostrar splash
      setGeoPrompt(true);
    }
  }, []);

  const requestGeo = () => {
    setGeoPrompt(false);
    if (!navigator.geolocation) {
      setGeoReady(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;
        setUserLat(lat);
        setUserLon(lon);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([lat, lon]));

        // Reverse geocoding con Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`)
          .then(r => r.json())
          .then(d => {
            const addr    = d.address || {};
            const city    = addr.city || addr.town || addr.village || addr.county || "tu ciudad";
            const country = addr.country || "Chile";
            const code    = addr.country_code?.toUpperCase() || "CL";
            setUserCity(city);
            setUserCountry(country);
            setUserCountryCode(code);
            setIsLatam(LATAM_COUNTRIES.has(country));
            localStorage.setItem(CITY_KEY, city);
            localStorage.setItem(COUNTRY_KEY, country);
            localStorage.setItem(CODE_KEY, code);
            setGeoReady(true);
          })
          .catch(() => setGeoReady(true));
      },
      () => {
        // Rechazó permiso — usar Santiago por default
        setGeoReady(true);
      }
    );
  };

  const resetLocation = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CITY_KEY);
    localStorage.removeItem(COUNTRY_KEY);
    localStorage.removeItem(CODE_KEY);
    setGeoPrompt(true);
  };

  return {
    userLat, userLon, userCity, userCountry, userCountryCode,
    isLatam, geoReady, geoPrompt, setGeoPrompt,
    requestGeo, resetLocation,
  };
}

export { LATAM_COUNTRIES };
