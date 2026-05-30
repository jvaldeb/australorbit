import { useState, useEffect } from "react";

// ── Clave única en localStorage ──────────────────────────────────────────────
const GEO_KEY    = "ao_geo_v2";
const CACHE_DAYS = 30; // refrescar coords cada 30 días

function readStorage() {
  try {
    const raw = localStorage.getItem(GEO_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - (data.ts || 0) > CACHE_DAYS * 86400000) return null;
    return data;
  } catch { return null; }
}

function saveStorage(data) {
  try { localStorage.setItem(GEO_KEY, JSON.stringify({ ...data, ts: Date.now() })); } catch {}
}

const LATAM = new Set([
  "Chile","Argentina","Brasil","Brazil","México","Mexico","Colombia","Perú","Peru",
  "Venezuela","Bolivia","Ecuador","Uruguay","Paraguay","Cuba",
  "República Dominicana","Dominican Republic","Guatemala","Honduras",
  "El Salvador","Nicaragua","Costa Rica","Panamá","Panama","Puerto Rico",
]);

export function useGeoLocation() {
  const saved = readStorage();

  const [userLat, setUserLat]                 = useState(saved?.lat  ?? -33.4489);
  const [userLon, setUserLon]                 = useState(saved?.lon  ?? -70.6693);
  const [userCity, setUserCity]               = useState(saved?.city ?? "Santiago");
  const [userCountry, setUserCountry]         = useState(saved?.country ?? "Chile");
  const [userCountryCode, setUserCountryCode] = useState(saved?.code ?? "CL");
  const [isLatam, setIsLatam]                 = useState(LATAM.has(saved?.country ?? "Chile"));
  const [geoReady, setGeoReady]               = useState(!!saved);
  const [geoPrompt, setGeoPrompt]             = useState(!saved); // splash solo si no hay datos

  const requestGeo = () => {
    setGeoPrompt(false);
    if (!navigator.geolocation) {
      saveStorage({ lat:-33.4489, lon:-70.6693, city:"Santiago", country:"Chile", code:"CL" });
      setGeoReady(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = coords.latitude, lon = coords.longitude;
        setUserLat(lat); setUserLon(lon);
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`)
          .then(r => r.json())
          .then(d => {
            const addr    = d.address || {};
            const city    = addr.city || addr.town || addr.village || addr.county || "tu ciudad";
            const country = addr.country || "Chile";
            const code    = (addr.country_code || "cl").toUpperCase();
            setUserCity(city); setUserCountry(country); setUserCountryCode(code);
            setIsLatam(LATAM.has(country));
            saveStorage({ lat, lon, city, country, code });
            setGeoReady(true);
          })
          .catch(() => {
            saveStorage({ lat, lon, city:"tu ciudad", country:"Chile", code:"CL" });
            setGeoReady(true);
          });
      },
      () => {
        // Rechazó permiso → guardar Santiago para no volver a preguntar nunca
        saveStorage({ lat:-33.4489, lon:-70.6693, city:"Santiago", country:"Chile", code:"CL" });
        setGeoReady(true);
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  const resetLocation = () => {
    try { localStorage.removeItem(GEO_KEY); } catch {}
    setGeoPrompt(true);
  };

  return {
    userLat, userLon, userCity, userCountry, userCountryCode,
    isLatam, geoReady, geoPrompt, setGeoPrompt,
    requestGeo, resetLocation,
  };
}
