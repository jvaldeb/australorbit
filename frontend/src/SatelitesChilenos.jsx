import { useState, useEffect } from "react";
import { usePageMeta } from "./usePageMeta.js";

const API = "https://australorbit-production.up.railway.app";

const glass = (extra = {}) => ({
  background: "rgba(255,255,255,0.028)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  borderRadius: 20,
  ...extra,
});

const LINKS = [
  ["Rastreo",            "/"],
  ["Satélites chilenos", "/satelites-chilenos"],
  ["Lanzamientos",       "/lanzamientos"],
  ["Clima espacial",     "/espacio"],
  ["Noticias",           "/noticias"],
  ["Contacto",           "/contacto"],
];

// Satélites chilenos — historia completa, de más antiguo a más nuevo
const CHILEAN_SATS = [
  {
    id: "FASAT_ALFA",
    norad: null,
    name: "FASat-Alfa",
    full: "Fuerza Aérea Satélite Alfa",
    year: 1995,
    launch: "31 Ago 1995",
    agency: "Fuerza Aérea de Chile / Surrey Satellite Technology (UK)",
    orbit: "No logró separarse",
    mass: "~50 kg",
    type: "Microsatélite — Misión fallida",
    color: "#64748b",
    status: "FALLIDO",
    mission: "Primer intento de Chile en el espacio. Lanzado desde Plesetsk, Rusia, a bordo del cohete Tsyklon-3 junto al satélite ucraniano Sich-1. Nunca logró separarse de su satélite madre por una falla en el sistema pirotécnico. A pesar del fracaso, fue un hito histórico: Chile intentaba llegar al espacio por primera vez.",
    facts: [
      "Primer satélite chileno — lanzado en 1995",
      "Falló al no separarse del satélite ucraniano Sich-1",
      "Diseñado para estudios geográficos y de comunicaciones",
      "Sentó las bases del programa espacial de la FACH",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Sich-1_satellite.jpg/800px-Sich-1_satellite.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80",
    specs: [
      ["Lanzamiento", "31 Ago 1995"],
      ["Cohete", "Tsyklon-3"],
      ["Base", "Plesetsk, Rusia"],
      ["Masa", "~50 kg"],
      ["Resultado", "Misión fallida"],
      ["Estado", "Adherido a Sich-1"],
      ["Operador", "FACH"],
      ["Tipo", "Microsatélite"],
    ],
    badge: "FALLIDO",
    badgeColor: "#64748b",
  },
  {
    id: "FASAT_BRAVO",
    norad: 25490,
    name: "FASat-Bravo",
    full: "Fuerza Aérea Satélite Bravo",
    year: 1998,
    launch: "10 Jul 1998",
    agency: "Fuerza Aérea de Chile / Surrey Satellite Technology (UK)",
    orbit: "820 km · SSO",
    mass: "~50 kg",
    type: "Microsatélite — Observación",
    color: "#94a3b8",
    status: "REINGRESÓ",
    mission: "Segundo intento chileno, esta vez exitoso. Lanzado desde Baikonur, Kazajistán, logró separarse correctamente y entró en órbita. Operó durante 3 años enviando más de 1.000 fotografías de Chile y el mundo. Dejó de funcionar en 2001 por falla en su sistema de energía, y reingresó a la atmósfera en 2023.",
    facts: [
      "Primer satélite chileno en llegar exitosamente al espacio",
      "Envió más de 1.000 fotografías durante su operación",
      "Operó 3 años antes de fallar por problema de energía",
      "Reingresó y se desintegró en la atmósfera en 2023",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80",
    specs: [
      ["NORAD ID", "25490"],
      ["Lanzamiento", "10 Jul 1998"],
      ["Cohete", "Zenit-2"],
      ["Base", "Baikonur, Kazajistán"],
      ["Masa", "~50 kg"],
      ["Operación", "1998–2001"],
      ["Reingreso", "2023"],
      ["Tipo", "Microsatélite"],
    ],
    badge: "REINGRESÓ 2023",
    badgeColor: "#475569",
  },
  {
    id: "SSOT",
    norad: 38011,
    name: "FASat-Charlie / SSOT",
    full: "Sistema Satelital para Observación de la Tierra",
    year: 2011,
    launch: "17 Dic 2011",
    agency: "Fuerza Aérea de Chile / EADS Astrium (Francia)",
    orbit: "629 km · SSO",
    mass: "117 kg",
    type: "Satélite de observación terrestre",
    color: "#C47B48",
    status: "EN ÓRBITA",
    mission: "El primer gran satélite chileno. Encargado por el Ministerio de Defensa a EADS Astrium de Francia por 72.5 millones de dólares, captura imágenes de alta resolución de 1.45 m. Ha sido usado en respuesta a terremotos, erupciones volcánicas e inundaciones. Lleva más de una década operando.",
    facts: [
      "Resolución de 1.45 m — puede verse un automóvil",
      "Usado en emergencias: terremotos, volcanes e inundaciones",
      "Más de 13 años en órbita — supera su vida útil estimada",
      "Primero en el Sistema Nacional Satelital de Chile",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
    specs: [
      ["NORAD ID", "38011"],
      ["Lanzamiento", "17 Dic 2011"],
      ["Cohete", "Soyuz-STA/Fregat"],
      ["Base", "Kourou, Guayana Francesa"],
      ["Masa", "117 kg"],
      ["Resolución", "1.45 m"],
      ["Inclinación", "97.88°"],
      ["Período", "97.17 min"],
    ],
    badge: "EN ÓRBITA",
    badgeColor: "#4ade80",
  },
  {
    id: "SUCHAI1",
    norad: 42788,
    name: "SUCHAI-1",
    full: "Satellite of the University of Chile for Aerospace Investigation",
    year: 2017,
    launch: "23 Jun 2017",
    agency: "Universidad de Chile / UTFSM / USACH",
    orbit: "500 km · SSO (reingresó 2023)",
    mass: "~1 kg",
    type: "CubeSat 1U — Educacional",
    color: "#818CF8",
    status: "REINGRESÓ",
    mission: "El primer CubeSat chileno y el primero construido íntegramente en Chile. Desarrollado por estudiantes de tres universidades, operó 457 días enviando datos científicos desde el espacio. Demostró que Chile podía hacer tecnología espacial propia. Reingresó a la atmósfera en 2023.",
    facts: [
      "Primer satélite construido 100% en Chile",
      "Primer CubeSat universitario de Latinoamérica",
      "Operó 457 días enviando datos científicos",
      "Reingresó a la atmósfera y se desintegró en 2023",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    specs: [
      ["NORAD ID", "42788"],
      ["Lanzamiento", "23 Jun 2017"],
      ["Cohete", "PSLV-C38"],
      ["Base", "Sriharikota, India"],
      ["Masa", "~1 kg"],
      ["Tipo", "CubeSat 1U"],
      ["Operación", "2017–2018"],
      ["Reingreso", "2023"],
    ],
    badge: "REINGRESÓ 2023",
    badgeColor: "#475569",
  },
  {
    id: "PLANTSAT",
    norad: 52188,
    name: "PlantSat",
    full: "Plant Satellite — Experimento Biológico Espacial",
    year: 2022,
    launch: "1 Abr 2022",
    agency: "Universidad de Chile — Laboratorio SPEL",
    orbit: "550 km · SSO",
    mass: "~3 kg",
    type: "CubeSat 3U — Biológico",
    color: "#86efac",
    status: "EN ÓRBITA",
    mission: "El primer satélite chileno con un experimento de biología espacial. Llevó semillas de plantas del desierto de Atacama para estudiar su supervivencia en el espacio — con miras a futuras misiones a Marte. Lanzado junto a SUCHAI-2 y SUCHAI-3 en la misión Transporter-4 de SpaceX.",
    facts: [
      "Primer experimento biológico chileno en el espacio",
      "Lleva plantas del desierto de Atacama para estudio en órbita",
      "Misión orientada a futuras colonizaciones de Marte",
      "Parte de la constelación SUCHAI-PLANTSAT de 3 satélites",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
    specs: [
      ["NORAD ID", "52188"],
      ["Lanzamiento", "1 Abr 2022"],
      ["Cohete", "Falcon 9"],
      ["Misión SpaceX", "Transporter-4"],
      ["Masa", "~3 kg"],
      ["Tipo", "CubeSat 3U"],
      ["Inclinación", "97.5°"],
      ["Período", "95.6 min"],
    ],
    badge: "EN ÓRBITA",
    badgeColor: "#4ade80",
  },
  {
    id: "SUCHAI2",
    norad: 57757,
    name: "SUCHAI-2",
    full: "Satellite of the University of Chile for Aerospace Investigation 2",
    year: 2022,
    launch: "1 Abr 2022",
    agency: "Universidad de Chile — Laboratorio SPEL",
    orbit: "550 km · SSO",
    mass: "~3 kg",
    type: "CubeSat 3U — Óptico",
    color: "#A78BFA",
    status: "EN ÓRBITA",
    mission: "Lleva una cámara integrada para monitorear la contaminación lumínica nocturna sobre los observatorios del norte de Chile — uno de los cielos más oscuros del mundo. Sus datos ayudan a proteger los observatorios astronómicos chilenos del avance de la luz artificial.",
    facts: [
      "Monitorea contaminación lumínica sobre observatorios chilenos",
      "Chile tiene el 40% de la observación astronómica mundial",
      "Sus datos protegen el cielo del norte de Chile",
      "Lanzado junto a SUCHAI-3 y PlantSat en Transporter-4",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=1200&q=80",
    specs: [
      ["NORAD ID", "57757"],
      ["Lanzamiento", "1 Abr 2022"],
      ["Cohete", "Falcon 9"],
      ["Misión SpaceX", "Transporter-4"],
      ["Masa", "~3 kg"],
      ["Tipo", "CubeSat 3U"],
      ["Inclinación", "97.5°"],
      ["Período", "95.6 min"],
    ],
    badge: "EN ÓRBITA",
    badgeColor: "#4ade80",
  },
  {
    id: "SUCHAI3",
    norad: 57758,
    name: "SUCHAI-3",
    full: "Satellite of the University of Chile for Aerospace Investigation 3",
    year: 2022,
    launch: "1 Abr 2022",
    agency: "Universidad de Chile — Laboratorio SPEL",
    orbit: "550 km · SSO",
    mass: "~3 kg",
    type: "CubeSat 3U + 2 femtosatélites",
    color: "#F472B6",
    status: "EN ÓRBITA",
    mission: "El más complejo de la constelación. Además de estudiar sistemas de comunicación, desplegó dos femtosatélites propios que miden el campo magnético terrestre. Es la primera vez que Chile lanza un satélite que a su vez despliega satélites más pequeños.",
    facts: [
      "Desplegó 2 femtosatélites — satélites dentro de un satélite",
      "Estudia sistemas de comunicación en órbita",
      "Los femtosats miden el campo magnético terrestre",
      "Primera constelación de satélites universitarios de Chile",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&q=80",
    specs: [
      ["NORAD ID", "57758"],
      ["Lanzamiento", "1 Abr 2022"],
      ["Cohete", "Falcon 9"],
      ["Misión SpaceX", "Transporter-4"],
      ["Masa", "~3 kg"],
      ["Tipo", "CubeSat 3U"],
      ["Femtosats", "2 desplegados"],
      ["Período", "95.6 min"],
    ],
    badge: "EN ÓRBITA",
    badgeColor: "#4ade80",
  },
  {
    id: "FASAT_DELTA",
    norad: null,
    name: "FASat-Delta",
    full: "Sistema Nacional Satelital — Satélite de Alta Resolución",
    year: 2023,
    launch: "12 Jun 2023",
    agency: "Fuerza Aérea de Chile / ImageSat International (Israel)",
    orbit: "SSO",
    mass: "~90 kg",
    type: "SmallSat — Observación de alta resolución",
    color: "#f59e0b",
    status: "CANCELADO",
    mission: "Primer satélite del Sistema Nacional Satelital (SNSat), programa que planea poner 10 satélites en órbita. Lanzado exitosamente en junio de 2023, tuvo problemas para calibrar sus capacidades. En diciembre de 2024, la FACH canceló el proyecto por incumplimiento de objetivos del fabricante israelí.",
    facts: [
      "Primer satélite del ambicioso programa SNSat de 10 satélites",
      "Cancelado en dic 2024 por fallas técnicas del fabricante",
      "Costo estimado: varios millones de dólares del Estado chileno",
      "Su fracaso impulsó el desarrollo de capacidad propia chilena",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80",
    specs: [
      ["Lanzamiento", "12 Jun 2023"],
      ["Cohete", "Falcon 9"],
      ["Base", "Vandenberg, California"],
      ["Masa", "~90 kg"],
      ["Fabricante", "ImageSat Intl. (Israel)"],
      ["Estado", "Cancelado Dic 2024"],
      ["Programa", "SNSat"],
      ["Tipo", "SmallSat"],
    ],
    badge: "CANCELADO",
    badgeColor: "#ef4444",
  },
  {
    id: "LEMU",
    norad: 60532,
    name: "LEMU NGE",
    full: "Ojo del Bosque — Primer Satélite Privado Chileno",
    year: 2024,
    launch: "16 Ago 2024",
    agency: "Lemu SpaceTech — Startup chilena privada",
    orbit: "550 km · SSO",
    mass: "~8 kg",
    type: "CubeSat 6U — Hiperespectral",
    color: "#6EE7B7",
    status: "EN ÓRBITA",
    mission: "El primer satélite privado de Chile y de la Patagonia. Lemu es una startup chilena que lleva una cámara hiperespectral capaz de analizar la composición química de vegetación, agua y suelo. Su nombre en mapudungun significa 'ojo del bosque', reflejo de su misión de proteger la biodiversidad chilena.",
    facts: [
      "Primer satélite privado de Chile — lanzado por SpaceX 2024",
      "Nombre en mapudungun: 'ojo del bosque'",
      "Cámara hiperespectral ve más allá del ojo humano",
      "Monitorea biodiversidad y ecosistemas chilenos",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/SpaceX_Transporter-11_mission_patch.png/800px-SpaceX_Transporter-11_mission_patch.png",
    bgPhoto: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    specs: [
      ["NORAD ID", "60532"],
      ["Lanzamiento", "16 Ago 2024"],
      ["Cohete", "Falcon 9"],
      ["Misión SpaceX", "Transporter-11"],
      ["Masa", "~8 kg"],
      ["Sensor", "Cámara hiperespectral"],
      ["Inclinación", "97.5°"],
      ["Período", "95.6 min"],
    ],
    badge: "EN ÓRBITA",
    badgeColor: "#4ade80",
  },
];

function SatCard({ sat, pos }) {
  const [expanded, setExpanded] = useState(false);
  const isLive = sat.norad && pos;

  return (
    <div style={{
      position: "relative",
      borderRadius: 24,
      overflow: "hidden",
      border: `1px solid ${sat.color}30`,
      transition: "border-color 0.3s",
      cursor: "pointer",
    }}
      onClick={() => setExpanded(e => !e)}
      onMouseEnter={e => e.currentTarget.style.borderColor = sat.color + "60"}
      onMouseLeave={e => e.currentTarget.style.borderColor = sat.color + "30"}
    >
      {/* Foto de fondo */}
      <div style={{
        height: expanded ? 280 : 200,
        overflow: "hidden",
        transition: "height 0.4s ease",
        position: "relative",
      }}>
        <img
          src={sat.bgPhoto}
          alt={sat.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: 0.35, transition: "opacity 0.3s",
          }}
          onError={e => { e.target.style.display = "none"; }}
        />
        {/* Gradiente sobre la foto */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, ${sat.color}08 0%, rgba(0,0,0,0.85) 100%)`,
        }}/>

        {/* Año en la esquina */}
        <div style={{
          position: "absolute", top: 16, left: 20,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.2em",
        }}>{sat.year}</div>

        {/* Badge */}
        <div style={{
          position: "absolute", top: 16, right: 16,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9, letterSpacing: "0.16em",
          padding: "4px 10px", borderRadius: 99,
          background: sat.badgeColor + "20",
          border: `1px solid ${sat.badgeColor}50`,
          color: sat.badgeColor,
        }}>{sat.badge}</div>

        {/* Punto vivo si está rastreando */}
        {isLive && (
          <div style={{
            position: "absolute", bottom: 16, right: 16,
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 99,
            background: "rgba(0,0,0,0.6)",
            border: `1px solid ${sat.color}40`,
          }}>
            <span style={{
              display: "block", width: 5, height: 5, borderRadius: "50%",
              background: "#4ade80", animation: "livePulse 2s infinite",
            }}/>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 8,
              color: "#4ade80", letterSpacing: "0.12em",
            }}>EN VIVO</span>
          </div>
        )}

        {/* Nombre sobre la foto */}
        <div style={{
          position: "absolute", bottom: 16, left: 20,
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800, color: "#fff",
            lineHeight: 1, letterSpacing: "-0.02em",
          }}>{sat.name}</div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontSize: 13,
            color: sat.color, marginTop: 3,
          }}>{sat.type}</div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "20px 24px",
      }}>
        {/* Agencia y lanzamiento */}
        <div style={{
          display: "flex", gap: 16, marginBottom: 14,
          flexWrap: "wrap",
        }}>
          {[
            ["Lanzamiento", sat.launch],
            ["Agencia", sat.agency.split("/")[0].trim()],
            ["Órbita", sat.orbit],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 8, color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.12em", marginBottom: 2,
              }}>{l.toUpperCase()}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, color: "rgba(255,255,255,0.7)",
              }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Misión */}
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7, marginBottom: 16,
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "none" : 2,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
        }}>
          {sat.mission}
        </p>

        {/* Expandido */}
        {expanded && (
          <div style={{ animation: "fadeUp 0.3s ease both" }}>
            {/* Hechos destacados */}
            <div style={{
              marginBottom: 20, padding: "14px 16px",
              background: sat.color + "08",
              borderRadius: 14, border: `1px solid ${sat.color}20`,
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 8.5, color: sat.color,
                letterSpacing: "0.14em", marginBottom: 10,
              }}>HECHOS DESTACADOS</div>
              {sat.facts.map((f, i) => (
                <div key={i} style={{
                  display: "flex", gap: 8, marginBottom: 7,
                  alignItems: "flex-start",
                }}>
                  <span style={{ color: sat.color, fontSize: 10, marginTop: 2, flexShrink: 0 }}>→</span>
                  <span style={{
                    fontSize: 12, color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.5,
                  }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Especificaciones técnicas */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6, marginBottom: 16,
            }}>
              {sat.specs.map(([label, val]) => (
                <div key={label} style={{
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 7.5, color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.1em", marginBottom: 2,
                  }}>{label.toUpperCase()}</div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11, color: "rgba(255,255,255,0.7)",
                  }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Posición en vivo */}
            {isLive && (
              <div style={{
                padding: "12px 16px",
                background: "rgba(74,222,128,0.05)",
                border: "1px solid rgba(74,222,128,0.15)",
                borderRadius: 12, marginBottom: 16,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginBottom: 8,
                }}>
                  <span style={{
                    display: "block", width: 5, height: 5, borderRadius: "50%",
                    background: "#4ade80", animation: "livePulse 2s infinite",
                  }}/>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 8.5, color: "#4ade80", letterSpacing: "0.12em",
                  }}>POSICIÓN EN VIVO</span>
                </div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {[
                    ["Latitud", `${pos.lat?.toFixed(2)}°`],
                    ["Longitud", `${pos.lon?.toFixed(2)}°`],
                    ["Altitud", `${pos.alt_km?.toFixed(0)} km`],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 7.5, color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                      }}>{l}</div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 13, color: "#4ade80", fontWeight: 600,
                      }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón rastrear */}
            {sat.norad && (
              <a href="/" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, padding: "12px 20px", borderRadius: 12,
                background: sat.color + "15",
                border: `1px solid ${sat.color}40`,
                color: sat.color,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, letterSpacing: "0.12em",
                textDecoration: "none", transition: "all 0.2s",
              }}>
                Rastrear {sat.name} en tiempo real →
              </a>
            )}
          </div>
        )}

        {/* Toggle */}
        <div style={{
          textAlign: "center", marginTop: 12,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9, color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em",
        }}>
          {expanded ? "▲ MOSTRAR MENOS" : "▼ VER DETALLES"}
        </div>
      </div>
    </div>
  );
}

export default function SatelitesChilenos() {
  usePageMeta({
    title: "Satélites chilenos en órbita — SSOT, SUCHAI, LEMU NGE",
    description: "Todos los satélites chilenos en órbita: SSOT, SUCHAI-1, SUCHAI-2, SUCHAI-3 y LEMU NGE. Historia, misión y posición en tiempo real.",
    url: "https://australorbit.com/satelites-chilenos",
  });

  const [positions, setPositions] = useState({});
  const [logoError, setLogoError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Obtener posición de cada satélite activo
  useEffect(() => {
    const active = CHILEAN_SATS.filter(s => s.norad);
    active.forEach(sat => {
      const go = () => {
        fetch(`${API}/position/${sat.id}`)
          .then(r => r.json())
          .then(pos => setPositions(p => ({ ...p, [sat.id]: pos })))
          .catch(() => {});
      };
      go();
      const t = setInterval(go, 10000);
      return () => clearInterval(t);
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@1,400&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; color: #E0E8F0; font-family: 'Outfit', sans-serif; min-height: 100vh; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #111; }
        a { color: inherit; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.2;transform:scale(1.6)} }
        @keyframes earthDrift { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.02)} }
        @keyframes earthFadeIn { from{opacity:0} to{opacity:1} }
        .nav-link { text-decoration: none; transition: opacity 0.2s; white-space: nowrap; }
        .nav-link:hover { opacity: 1 !important; }
        .sat-card:hover img { opacity: 0.5 !important; }
        .nav-hamburger { display:none; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); cursor:pointer; flex-direction:column; gap:5px; padding:0; }
        .nav-hamburger span { display:block; width:18px; height:1.5px; background:rgba(255,255,255,0.8); border-radius:2px; transition:all 0.25s; }
        @media(max-width:600px) {
          .nav-desktop { display:none !important; }
          .nav-hamburger { display:flex !important; }
          .page-pad { padding: 0 16px !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
          .timeline-line { display:none !important; }
        }
      `}</style>

      {/* Fondo */}
      <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", inset:0, background:"#000" }}/>
        <div style={{ position:"absolute", inset:0, animation:"earthFadeIn 2.5s ease both" }}>
          <img src="/earth-bg.png" alt="" style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            width:"90vmin", height:"90vmin", objectFit:"contain",
            opacity:0.1, animation:"earthDrift 55s ease-in-out infinite",
            filter:"saturate(0.6) brightness(0.8)",
          }}/>
        </div>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 120% 90% at 50% 50%, transparent 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"25%", background:"linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)" }}/>
        {/* Estrellas */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.4 }}>
          {Array.from({length:80},(_,i)=>(
            <circle key={i}
              cx={`${(i*137.5)%100}%`} cy={`${(i*97.3)%100}%`}
              r={i%5===0?1.2:0.6} fill="white" opacity={0.3+((i*0.13)%0.5)}/>
          ))}
        </svg>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.012 }}>
          <defs><pattern id="pg" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M 90 0 L 0 0 0 90" fill="none" stroke="#C47B48" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg)"/>
        </svg>
      </div>

      <div className="page-pad" style={{ position:"relative", zIndex:1, padding:"0 24px", minHeight:"100vh" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>

          {/* Mobile drawer */}
          {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:140,background:"rgba(0,0,0,0.5)"}}/>}
          {menuOpen && (
            <div style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:"rgba(0,0,0,0.97)",borderBottom:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(30px)",padding:"80px 24px 24px",display:"flex",flexDirection:"column",gap:4,animation:"fadeUp 0.2s ease both"}}>
              {LINKS.map(([label,href])=>(
                <a key={href} href={href} style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:href==="/satelites-chilenos"?"#fff":"rgba(255,255,255,0.5)",textDecoration:"none",padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"color 0.2s"}}>{label}</a>
              ))}
            </div>
          )}

          {/* Nav */}
          <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",animation:"fadeIn 0.7s ease both",gap:16,position:"relative",zIndex:160}}>
            <a href="/" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",flexShrink:0}}>
              {!logoError
                ? <img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:52,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 16px rgba(10,28,80,0.6)) brightness(1.08)"}}/>
                : <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#fff"}}>AO</span>
              }
              <div>
                <div style={{display:"flex",alignItems:"baseline",gap:7}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.06em",color:"#fff"}}>AUSTRAL</span>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontStyle:"italic",color:"#C47B48"}}>Orbit</span>
                </div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7,letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginTop:1}}>Santiago · 33.4°S</div>
              </div>
            </a>

            <div className="nav-desktop" style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}}>
              {LINKS.map(([label,href])=>(
                <a key={href} href={href} className="nav-link"
                  style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",
                    color:href==="/satelites-chilenos"?"#fff":"rgba(255,255,255,0.5)",
                    padding:"8px 16px",borderRadius:99,
                    background:href==="/satelites-chilenos"?"rgba(255,255,255,0.06)":"transparent",
                    border:href==="/satelites-chilenos"?"1px solid rgba(255,255,255,0.12)":"1px solid transparent",
                  }}>{label}</a>
              ))}
            </div>

            <button className="nav-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menú">
              <span style={{transform:menuOpen?"rotate(45deg) translate(4.5px,4.5px)":"none"}}/>
              <span style={{opacity:menuOpen?0:1}}/>
              <span style={{transform:menuOpen?"rotate(-45deg) translate(4.5px,-4.5px)":"none"}}/>
            </button>
          </nav>

          {/* Hero */}
          <div style={{padding:"56px 0 48px",animation:"fadeUp 0.9s ease both"}}>
            {/* Badge */}
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:99,...glass({}),marginBottom:24}}>
              <span style={{fontSize:14}}>🇨🇱</span>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#C47B48",letterSpacing:"0.2em",textTransform:"uppercase"}}>Programa espacial chileno</span>
            </div>

            <h1 style={{lineHeight:1.05,letterSpacing:"-0.02em",marginBottom:16}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(32px,5vw,60px)",fontWeight:800,color:"#fff",display:"block"}}>Chile</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,5.2vw,64px)",fontStyle:"italic",color:"#C47B48",display:"block"}}>en el espacio</span>
            </h1>

            <p style={{fontSize:15,color:"rgba(255,255,255,0.35)",lineHeight:1.8,fontWeight:300,maxWidth:560,marginBottom:32}}>
              Desde 2011, Chile ha lanzado 5 satélites propios al espacio. Aquí está la historia completa — desde el primer satélite de observación de la FACH hasta el primer privado chileno lanzado por SpaceX.
            </p>

            {/* Stats */}
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              {[
                ["9", "satélites lanzados"],
                ["1995", "primer intento"],
                ["5", "actualmente en órbita"],
                ["30", "años de historia espacial"],
              ].map(([n,l])=>(
                <div key={l}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:28,fontWeight:600,color:"#C47B48"}}>{n}</div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(196,123,72,0.5),transparent)",marginBottom:48}}/>

          {/* Timeline + Cards */}
          <div style={{position:"relative",paddingBottom:60}}>
            {/* Línea de tiempo vertical */}
            <div className="timeline-line" style={{
              position:"absolute", left:28, top:0, bottom:0,
              width:1, background:"linear-gradient(to bottom, #C47B48, rgba(196,123,72,0.1))",
              opacity:0.3,
            }}/>

            <div className="cards-grid" style={{
              display:"grid",
              gridTemplateColumns:"1fr 1fr",
              gap:20,
            }}>
              {CHILEAN_SATS.map((sat, i) => (
                <div key={sat.id} className="sat-card" style={{animation:`fadeUp 0.6s ease ${i*0.1}s both`}}>
                  <SatCard sat={sat} pos={positions[sat.id]}/>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(196,123,72,0.3),transparent)"}}/>
          <div style={{padding:"16px 0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em"}}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>Datos: CelesTrak · Skyfield · Wikipedia</div>
          </div>

        </div>
      </div>
    </>
  );
}// Satélites chilenos — historia completa, de más antiguo a más nuevo
const CHILEAN_SATS = [
  {
    id: "FASAT_ALFA", norad: null, name: "FASat-Alfa",
    full: "Fuerza Aérea Satélite Alfa", year: 1995, launch: "31 Ago 1995",
    agency: "FACH / Surrey Satellite Technology (UK)",
    orbit: "No logró separarse", mass: "~50 kg", type: "Microsatélite — Misión fallida",
    color: "#64748b", status: "FALLIDO",
    mission: "Primer intento de Chile en el espacio. Lanzado desde Plesetsk junto al satélite ucraniano Sich-1, nunca logró separarse por falla en el sistema pirotécnico. Sigue adherido al Sich-1 hasta hoy.",
    facts: ["Primer satélite chileno — lanzado en 1995","Falló al no separarse del satélite ucraniano Sich-1","Sentó las bases del programa espacial de la FACH","NORAD sigue monitoreando el Sich-1 con el FASat-Alfa adherido"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80",
    specs: [["Lanzamiento","31 Ago 1995"],["Cohete","Tsyklon-3"],["Base","Plesetsk, Rusia"],["Masa","~50 kg"],["Resultado","Misión fallida"],["Estado","Adherido a Sich-1"],["Operador","FACH"],["Tipo","Microsatélite"]],
    badge: "FALLIDO", badgeColor: "#64748b",
  },
  {
    id: "FASAT_BRAVO", norad: 25490, name: "FASat-Bravo",
    full: "Fuerza Aérea Satélite Bravo", year: 1998, launch: "10 Jul 1998",
    agency: "FACH / Surrey Satellite Technology (UK)",
    orbit: "820 km · SSO", mass: "~50 kg", type: "Microsatélite — Observación",
    color: "#94a3b8", status: "REINGRESÓ",
    mission: "Segundo intento chileno, exitoso. Operó 3 años enviando más de 1.000 fotografías de Chile. Dejó de funcionar en 2001 y reingresó a la atmósfera desintegrándose en 2023.",
    facts: ["Primer satélite chileno en llegar exitosamente al espacio","Envió más de 1.000 fotografías durante su operación","Operó 3 años antes de fallar por problema de energía","Reingresó y se desintegró en la atmósfera en 2023"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80",
    specs: [["NORAD ID","25490"],["Lanzamiento","10 Jul 1998"],["Cohete","Zenit-2"],["Base","Baikonur, Kazajistán"],["Masa","~50 kg"],["Operación","1998–2001"],["Reingreso","2023"],["Tipo","Microsatélite"]],
    badge: "REINGRESÓ 2023", badgeColor: "#475569",
  },
  {
    id: "SSOT", norad: 38011, name: "FASat-Charlie / SSOT",
    full: "Sistema Satelital para Observación de la Tierra", year: 2011, launch: "17 Dic 2011",
    agency: "FACH / EADS Astrium (Francia)",
    orbit: "629 km · SSO", mass: "117 kg", type: "Satélite de observación terrestre",
    color: "#C47B48", status: "EN ÓRBITA",
    mission: "El primer gran satélite chileno. Costó 72.5 millones de dólares y captura imágenes de 1.45 m de resolución. Ha sido usado en terremotos, erupciones volcánicas e inundaciones. Lleva más de 13 años operando — superando su vida útil estimada.",
    facts: ["Resolución de 1.45 m — puede verse un automóvil","Usado en emergencias: terremotos, volcanes e inundaciones","Más de 13 años en órbita — supera su vida útil estimada","Costó 72.5 millones de dólares al Estado chileno"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
    specs: [["NORAD ID","38011"],["Lanzamiento","17 Dic 2011"],["Cohete","Soyuz-STA/Fregat"],["Base","Kourou, Guayana Francesa"],["Masa","117 kg"],["Resolución","1.45 m"],["Inclinación","97.88°"],["Período","97.17 min"]],
    badge: "EN ÓRBITA", badgeColor: "#4ade80",
  },
  {
    id: "SUCHAI1", norad: 42788, name: "SUCHAI-1",
    full: "Satellite of the University of Chile for Aerospace Investigation", year: 2017, launch: "23 Jun 2017",
    agency: "Universidad de Chile / UTFSM / USACH",
    orbit: "500 km (reingresó 2023)", mass: "~1 kg", type: "CubeSat 1U — Educacional",
    color: "#818CF8", status: "REINGRESÓ",
    mission: "El primer CubeSat chileno y el primero construido íntegramente en Chile por estudiantes de tres universidades. Operó 457 días. Demostró que Chile podía hacer tecnología espacial propia. Reingresó a la atmósfera en 2023.",
    facts: ["Primer satélite construido 100% en Chile","Primer CubeSat universitario de Latinoamérica","Operó 457 días enviando datos científicos","Reingresó a la atmósfera y se desintegró en 2023"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    specs: [["NORAD ID","42788"],["Lanzamiento","23 Jun 2017"],["Cohete","PSLV-C38"],["Base","Sriharikota, India"],["Masa","~1 kg"],["Tipo","CubeSat 1U"],["Operación","2017–2018"],["Reingreso","2023"]],
    badge: "REINGRESÓ 2023", badgeColor: "#475569",
  },
  {
    id: "PLANTSAT", norad: 52188, name: "PlantSat",
    full: "Plant Satellite — Experimento Biológico Espacial", year: 2022, launch: "1 Abr 2022",
    agency: "Universidad de Chile — Laboratorio SPEL",
    orbit: "550 km · SSO", mass: "~3 kg", type: "CubeSat 3U — Biológico",
    color: "#86efac", status: "EN ÓRBITA",
    mission: "El primer satélite chileno con experimento de biología espacial. Llevó semillas de plantas del desierto de Atacama para estudiar supervivencia en el espacio — con miras a futuras misiones a Marte.",
    facts: ["Primer experimento biológico chileno en el espacio","Lleva plantas del desierto de Atacama","Misión orientada a futuras colonizaciones de Marte","Parte de la constelación SUCHAI-PLANTSAT"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
    specs: [["NORAD ID","52188"],["Lanzamiento","1 Abr 2022"],["Cohete","Falcon 9"],["Misión","Transporter-4"],["Masa","~3 kg"],["Tipo","CubeSat 3U"],["Inclinación","97.5°"],["Período","95.6 min"]],
    badge: "EN ÓRBITA", badgeColor: "#4ade80",
  },
  {
    id: "SUCHAI2", norad: 57757, name: "SUCHAI-2",
    full: "Satellite of the University of Chile for Aerospace Investigation 2", year: 2022, launch: "1 Abr 2022",
    agency: "Universidad de Chile — Laboratorio SPEL",
    orbit: "550 km · SSO", mass: "~3 kg", type: "CubeSat 3U — Óptico",
    color: "#A78BFA", status: "EN ÓRBITA",
    mission: "Lleva una cámara para monitorear la contaminación lumínica nocturna sobre los observatorios del norte de Chile — que albergan el 40% de la capacidad astronómica mundial. Sus datos protegen el cielo más oscuro del planeta.",
    facts: ["Monitorea contaminación lumínica sobre observatorios chilenos","Chile tiene el 40% de la observación astronómica mundial","Sus datos protegen el cielo del norte de Chile","Lanzado junto a SUCHAI-3 y PlantSat"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=1200&q=80",
    specs: [["NORAD ID","57757"],["Lanzamiento","1 Abr 2022"],["Cohete","Falcon 9"],["Misión","Transporter-4"],["Masa","~3 kg"],["Tipo","CubeSat 3U"],["Inclinación","97.5°"],["Período","95.6 min"]],
    badge: "EN ÓRBITA", badgeColor: "#4ade80",
  },
  {
    id: "SUCHAI3", norad: 57758, name: "SUCHAI-3",
    full: "Satellite of the University of Chile for Aerospace Investigation 3", year: 2022, launch: "1 Abr 2022",
    agency: "Universidad de Chile — Laboratorio SPEL",
    orbit: "550 km · SSO", mass: "~3 kg", type: "CubeSat 3U + 2 femtosatélites",
    color: "#F472B6", status: "EN ÓRBITA",
    mission: "El más complejo de la constelación. Desplegó 2 femtosatélites propios que miden el campo magnético terrestre. Primera vez que Chile lanza un satélite que a su vez despliega satélites más pequeños.",
    facts: ["Desplegó 2 femtosatélites — satélites dentro de un satélite","Estudia sistemas de comunicación en órbita","Los femtosats miden el campo magnético terrestre","Primera constelación de satélites universitarios chilenos"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&q=80",
    specs: [["NORAD ID","57758"],["Lanzamiento","1 Abr 2022"],["Cohete","Falcon 9"],["Misión","Transporter-4"],["Masa","~3 kg"],["Tipo","CubeSat 3U"],["Femtosats","2 desplegados"],["Período","95.6 min"]],
    badge: "EN ÓRBITA", badgeColor: "#4ade80",
  },
  {
    id: "FASAT_DELTA", norad: null, name: "FASat-Delta",
    full: "Sistema Nacional Satelital — Satélite de Alta Resolución", year: 2023, launch: "12 Jun 2023",
    agency: "FACH / ImageSat International (Israel)",
    orbit: "SSO", mass: "~90 kg", type: "SmallSat — Alta resolución",
    color: "#f59e0b", status: "CANCELADO",
    mission: "Primer satélite del ambicioso Sistema Nacional Satelital (SNSat), programa que planea 10 satélites. Tuvo problemas técnicos graves y en diciembre 2024 la FACH canceló el proyecto por incumplimiento de objetivos del fabricante israelí.",
    facts: ["Primer satélite del programa SNSat de 10 satélites","Cancelado en dic 2024 por fallas técnicas del fabricante","Su fracaso impulsa desarrollo de capacidad espacial propia","Chile planea construir sus próximos satélites en el país"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80",
    specs: [["Lanzamiento","12 Jun 2023"],["Cohete","Falcon 9"],["Base","Vandenberg, California"],["Masa","~90 kg"],["Fabricante","ImageSat Intl. (Israel)"],["Estado","Cancelado Dic 2024"],["Programa","SNSat"],["Tipo","SmallSat"]],
    badge: "CANCELADO", badgeColor: "#ef4444",
  },
  {
    id: "LEMU", norad: 60532, name: "LEMU NGE",
    full: "Ojo del Bosque — Primer Satélite Privado Chileno", year: 2024, launch: "16 Ago 2024",
    agency: "Lemu SpaceTech — Startup privada chilena",
    orbit: "550 km · SSO", mass: "~8 kg", type: "CubeSat 6U — Hiperespectral",
    color: "#6EE7B7", status: "EN ÓRBITA",
    mission: "El primer satélite privado de Chile y de la Patagonia. Su nombre en mapudungun significa 'ojo del bosque'. Lleva una cámara hiperespectral que ve más allá del ojo humano para monitorear biodiversidad, vegetación y ecosistemas chilenos.",
    facts: ["Primer satélite privado de Chile — lanzado por SpaceX 2024","Nombre en mapudungun: ojo del bosque","Cámara hiperespectral ve más allá del ojo humano","Monitorea biodiversidad y ecosistemas chilenos"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/SpaceX_Transporter-11_mission_patch.png/800px-SpaceX_Transporter-11_mission_patch.png",
    bgPhoto: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    specs: [["NORAD ID","60532"],["Lanzamiento","16 Ago 2024"],["Cohete","Falcon 9"],["Misión","Transporter-11"],["Masa","~8 kg"],["Sensor","Cámara hiperespectral"],["Inclinación","97.5°"],["Período","95.6 min"]],
    badge: "EN ÓRBITA", badgeColor: "#4ade80",
  },
];

function SatCard({ sat, pos }) {
  const [expanded, setExpanded] = useState(false);
  const isLive = sat.norad && pos;

  return (
    <div style={{
      position: "relative",
      borderRadius: 24,
      overflow: "hidden",
      border: `1px solid ${sat.color}30`,
      transition: "border-color 0.3s",
      cursor: "pointer",
    }}
      onClick={() => setExpanded(e => !e)}
      onMouseEnter={e => e.currentTarget.style.borderColor = sat.color + "60"}
      onMouseLeave={e => e.currentTarget.style.borderColor = sat.color + "30"}
    >
      {/* Foto de fondo */}
      <div style={{
        height: expanded ? 280 : 200,
        overflow: "hidden",
        transition: "height 0.4s ease",
        position: "relative",
      }}>
        <img
          src={sat.bgPhoto}
          alt={sat.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: 0.35, transition: "opacity 0.3s",
          }}
          onError={e => { e.target.style.display = "none"; }}
        />
        {/* Gradiente sobre la foto */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, ${sat.color}08 0%, rgba(0,0,0,0.85) 100%)`,
        }}/>

        {/* Año en la esquina */}
        <div style={{
          position: "absolute", top: 16, left: 20,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.2em",
        }}>{sat.year}</div>

        {/* Badge */}
        <div style={{
          position: "absolute", top: 16, right: 16,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9, letterSpacing: "0.16em",
          padding: "4px 10px", borderRadius: 99,
          background: sat.badgeColor + "20",
          border: `1px solid ${sat.badgeColor}50`,
          color: sat.badgeColor,
        }}>{sat.badge}</div>

        {/* Punto vivo si está rastreando */}
        {isLive && (
          <div style={{
            position: "absolute", bottom: 16, right: 16,
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 99,
            background: "rgba(0,0,0,0.6)",
            border: `1px solid ${sat.color}40`,
          }}>
            <span style={{
              display: "block", width: 5, height: 5, borderRadius: "50%",
              background: "#4ade80", animation: "livePulse 2s infinite",
            }}/>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 8,
              color: "#4ade80", letterSpacing: "0.12em",
            }}>EN VIVO</span>
          </div>
        )}

        {/* Nombre sobre la foto */}
        <div style={{
          position: "absolute", bottom: 16, left: 20,
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800, color: "#fff",
            lineHeight: 1, letterSpacing: "-0.02em",
          }}>{sat.name}</div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontSize: 13,
            color: sat.color, marginTop: 3,
          }}>{sat.type}</div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "20px 24px",
      }}>
        {/* Agencia y lanzamiento */}
        <div style={{
          display: "flex", gap: 16, marginBottom: 14,
          flexWrap: "wrap",
        }}>
          {[
            ["Lanzamiento", sat.launch],
            ["Agencia", sat.agency.split("/")[0].trim()],
            ["Órbita", sat.orbit],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 8, color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.12em", marginBottom: 2,
              }}>{l.toUpperCase()}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, color: "rgba(255,255,255,0.7)",
              }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Misión */}
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7, marginBottom: 16,
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "none" : 2,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
        }}>
          {sat.mission}
        </p>

        {/* Expandido */}
        {expanded && (
          <div style={{ animation: "fadeUp 0.3s ease both" }}>
            {/* Hechos destacados */}
            <div style={{
              marginBottom: 20, padding: "14px 16px",
              background: sat.color + "08",
              borderRadius: 14, border: `1px solid ${sat.color}20`,
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 8.5, color: sat.color,
                letterSpacing: "0.14em", marginBottom: 10,
              }}>HECHOS DESTACADOS</div>
              {sat.facts.map((f, i) => (
                <div key={i} style={{
                  display: "flex", gap: 8, marginBottom: 7,
                  alignItems: "flex-start",
                }}>
                  <span style={{ color: sat.color, fontSize: 10, marginTop: 2, flexShrink: 0 }}>→</span>
                  <span style={{
                    fontSize: 12, color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.5,
                  }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Especificaciones técnicas */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6, marginBottom: 16,
            }}>
              {sat.specs.map(([label, val]) => (
                <div key={label} style={{
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 7.5, color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.1em", marginBottom: 2,
                  }}>{label.toUpperCase()}</div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11, color: "rgba(255,255,255,0.7)",
                  }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Posición en vivo */}
            {isLive && (
              <div style={{
                padding: "12px 16px",
                background: "rgba(74,222,128,0.05)",
                border: "1px solid rgba(74,222,128,0.15)",
                borderRadius: 12, marginBottom: 16,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginBottom: 8,
                }}>
                  <span style={{
                    display: "block", width: 5, height: 5, borderRadius: "50%",
                    background: "#4ade80", animation: "livePulse 2s infinite",
                  }}/>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 8.5, color: "#4ade80", letterSpacing: "0.12em",
                  }}>POSICIÓN EN VIVO</span>
                </div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {[
                    ["Latitud", `${pos.lat?.toFixed(2)}°`],
                    ["Longitud", `${pos.lon?.toFixed(2)}°`],
                    ["Altitud", `${pos.alt_km?.toFixed(0)} km`],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 7.5, color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                      }}>{l}</div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 13, color: "#4ade80", fontWeight: 600,
                      }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón rastrear */}
            {sat.norad && (
              <a href="/" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, padding: "12px 20px", borderRadius: 12,
                background: sat.color + "15",
                border: `1px solid ${sat.color}40`,
                color: sat.color,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, letterSpacing: "0.12em",
                textDecoration: "none", transition: "all 0.2s",
              }}>
                Rastrear {sat.name} en tiempo real →
              </a>
            )}
          </div>
        )}

        {/* Toggle */}
        <div style={{
          textAlign: "center", marginTop: 12,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9, color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em",
        }}>
          {expanded ? "▲ MOSTRAR MENOS" : "▼ VER DETALLES"}
        </div>
      </div>
    </div>
  );
}

export default function SatelitesChilenos() {
  usePageMeta({
    title: "Satélites chilenos en órbita — SSOT, SUCHAI, LEMU NGE",
    description: "Todos los satélites chilenos en órbita: SSOT, SUCHAI-1, SUCHAI-2, SUCHAI-3 y LEMU NGE. Historia, misión y posición en tiempo real.",
    url: "https://australorbit.com/satelites-chilenos",
  });

  const [positions, setPositions] = useState({});
  const [logoError, setLogoError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Obtener posición de cada satélite activo
  useEffect(() => {
    const active = CHILEAN_SATS.filter(s => s.norad);
    active.forEach(sat => {
      const go = () => {
        fetch(`${API}/position/${sat.id}`)
          .then(r => r.json())
          .then(pos => setPositions(p => ({ ...p, [sat.id]: pos })))
          .catch(() => {});
      };
      go();
      const t = setInterval(go, 10000);
      return () => clearInterval(t);
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@1,400&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; color: #E0E8F0; font-family: 'Outfit', sans-serif; min-height: 100vh; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #111; }
        a { color: inherit; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.2;transform:scale(1.6)} }
        @keyframes earthDrift { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.02)} }
        @keyframes earthFadeIn { from{opacity:0} to{opacity:1} }
        .nav-link { text-decoration: none; transition: opacity 0.2s; white-space: nowrap; }
        .nav-link:hover { opacity: 1 !important; }
        .sat-card:hover img { opacity: 0.5 !important; }
        .nav-hamburger { display:none; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); cursor:pointer; flex-direction:column; gap:5px; padding:0; }
        .nav-hamburger span { display:block; width:18px; height:1.5px; background:rgba(255,255,255,0.8); border-radius:2px; transition:all 0.25s; }
        @media(max-width:600px) {
          .nav-desktop { display:none !important; }
          .nav-hamburger { display:flex !important; }
          .page-pad { padding: 0 16px !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
          .timeline-line { display:none !important; }
        }
      `}</style>

      {/* Fondo */}
      <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", inset:0, background:"#000" }}/>
        <div style={{ position:"absolute", inset:0, animation:"earthFadeIn 2.5s ease both" }}>
          <img src="/earth-bg.png" alt="" style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            width:"90vmin", height:"90vmin", objectFit:"contain",
            opacity:0.1, animation:"earthDrift 55s ease-in-out infinite",
            filter:"saturate(0.6) brightness(0.8)",
          }}/>
        </div>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 120% 90% at 50% 50%, transparent 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"25%", background:"linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)" }}/>
        {/* Estrellas */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.4 }}>
          {Array.from({length:80},(_,i)=>(
            <circle key={i}
              cx={`${(i*137.5)%100}%`} cy={`${(i*97.3)%100}%`}
              r={i%5===0?1.2:0.6} fill="white" opacity={0.3+((i*0.13)%0.5)}/>
          ))}
        </svg>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.012 }}>
          <defs><pattern id="pg" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M 90 0 L 0 0 0 90" fill="none" stroke="#C47B48" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg)"/>
        </svg>
      </div>

      <div className="page-pad" style={{ position:"relative", zIndex:1, padding:"0 24px", minHeight:"100vh" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>

          {/* Mobile drawer */}
          {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:140,background:"rgba(0,0,0,0.5)"}}/>}
          {menuOpen && (
            <div style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:"rgba(0,0,0,0.97)",borderBottom:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(30px)",padding:"80px 24px 24px",display:"flex",flexDirection:"column",gap:4,animation:"fadeUp 0.2s ease both"}}>
              {LINKS.map(([label,href])=>(
                <a key={href} href={href} style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:href==="/satelites-chilenos"?"#fff":"rgba(255,255,255,0.5)",textDecoration:"none",padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"color 0.2s"}}>{label}</a>
              ))}
            </div>
          )}

          {/* Nav */}
          <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",animation:"fadeIn 0.7s ease both",gap:16,position:"relative",zIndex:160}}>
            <a href="/" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",flexShrink:0}}>
              {!logoError
                ? <img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:52,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 16px rgba(10,28,80,0.6)) brightness(1.08)"}}/>
                : <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#fff"}}>AO</span>
              }
              <div>
                <div style={{display:"flex",alignItems:"baseline",gap:7}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.06em",color:"#fff"}}>AUSTRAL</span>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontStyle:"italic",color:"#C47B48"}}>Orbit</span>
                </div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7,letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginTop:1}}>Santiago · 33.4°S</div>
              </div>
            </a>

            <div className="nav-desktop" style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}}>
              {LINKS.map(([label,href])=>(
                <a key={href} href={href} className="nav-link"
                  style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",
                    color:href==="/satelites-chilenos"?"#fff":"rgba(255,255,255,0.5)",
                    padding:"8px 16px",borderRadius:99,
                    background:href==="/satelites-chilenos"?"rgba(255,255,255,0.06)":"transparent",
                    border:href==="/satelites-chilenos"?"1px solid rgba(255,255,255,0.12)":"1px solid transparent",
                  }}>{label}</a>
              ))}
            </div>

            <button className="nav-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menú">
              <span style={{transform:menuOpen?"rotate(45deg) translate(4.5px,4.5px)":"none"}}/>
              <span style={{opacity:menuOpen?0:1}}/>
              <span style={{transform:menuOpen?"rotate(-45deg) translate(4.5px,-4.5px)":"none"}}/>
            </button>
          </nav>

          {/* Hero */}
          <div style={{padding:"56px 0 48px",animation:"fadeUp 0.9s ease both"}}>
            {/* Badge */}
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:99,...glass({}),marginBottom:24}}>
              <span style={{fontSize:14}}>🇨🇱</span>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#C47B48",letterSpacing:"0.2em",textTransform:"uppercase"}}>Programa espacial chileno</span>
            </div>

            <h1 style={{lineHeight:1.05,letterSpacing:"-0.02em",marginBottom:16}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(32px,5vw,60px)",fontWeight:800,color:"#fff",display:"block"}}>Chile</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,5.2vw,64px)",fontStyle:"italic",color:"#C47B48",display:"block"}}>en el espacio</span>
            </h1>

            <p style={{fontSize:15,color:"rgba(255,255,255,0.35)",lineHeight:1.8,fontWeight:300,maxWidth:560,marginBottom:32}}>
              Desde 2011, Chile ha lanzado 5 satélites propios al espacio. Aquí está la historia completa — desde el primer satélite de observación de la FACH hasta el primer privado chileno lanzado por SpaceX.
            </p>

            {/* Stats */}
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              {[
                ["9", "satélites lanzados"],
                ["1995", "primer intento"],
                ["5", "actualmente en órbita"],
                ["30", "años de historia espacial"],
              ].map(([n,l])=>(
                <div key={l}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:28,fontWeight:600,color:"#C47B48"}}>{n}</div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(196,123,72,0.5),transparent)",marginBottom:48}}/>

          {/* Timeline + Cards */}
          <div style={{position:"relative",paddingBottom:60}}>
            {/* Línea de tiempo vertical */}
            <div className="timeline-line" style={{
              position:"absolute", left:28, top:0, bottom:0,
              width:1, background:"linear-gradient(to bottom, #C47B48, rgba(196,123,72,0.1))",
              opacity:0.3,
            }}/>

            <div className="cards-grid" style={{
              display:"grid",
              gridTemplateColumns:"1fr 1fr",
              gap:20,
            }}>
              {CHILEAN_SATS.map((sat, i) => (
                <div key={sat.id} className="sat-card" style={{animation:`fadeUp 0.6s ease ${i*0.1}s both`}}>
                  <SatCard sat={sat} pos={positions[sat.id]}/>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(196,123,72,0.3),transparent)"}}/>
          <div style={{padding:"16px 0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em"}}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>Datos: CelesTrak · Skyfield · Wikipedia</div>
          </div>

        </div>
      </div>
    </>
  );
}