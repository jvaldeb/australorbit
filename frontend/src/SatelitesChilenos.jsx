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

// Satélites chilenos ordenados de más antiguo a más nuevo
const CHILEAN_SATS = [
  {
    id: "SSOT",
    norad: 38011,
    name: "SSOT",
    full: "Satélite Chileno de Observación Terrestre",
    year: 2011,
    launch: "16 Dic 2011",
    agency: "Fuerza Aérea de Chile / EADS Astrium",
    orbit: "628 km · SSO",
    mass: "~150 kg",
    type: "Observación terrestre",
    color: "#C47B48",
    mission: "Primer satélite de observación de Chile. Captura imágenes ópticas de 1.45 m de resolución para apoyo a catastro, planificación territorial y respuesta ante desastres naturales. Operado por la Fuerza Aérea de Chile desde Punta Arenas.",
    facts: [
      "Primer satélite chileno de uso civil y militar",
      "Resolución de 1.45 m — suficiente para ver autos",
      "Órbita polar sincrónica al sol — sobrevuela todo Chile",
      "Usado en respuesta al terremoto de 2010 y erupciones volcánicas",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
    specs: [
      ["NORAD ID", "38011"],
      ["Lanzamiento", "16 Dic 2011"],
      ["Cohete", "Rokot"],
      ["Base", "Plesetsk, Rusia"],
      ["Masa", "~150 kg"],
      ["Resolución", "1.45 m"],
      ["Inclinación", "97.8°"],
      ["Período", "97.1 min"],
    ],
    badge: "PIONERO",
    badgeColor: "#C47B48",
  },
  {
    id: "SUCHAI1",
    norad: null,
    name: "SUCHAI-1",
    full: "Satellite of the University of Chile for Aerospace Investigation",
    year: 2017,
    launch: "14 Jun 2017",
    agency: "Universidad de Chile / UTFSM / USACH",
    orbit: "500 km · SSO",
    mass: "~1 kg",
    type: "CubeSat 1U — Educacional",
    color: "#818CF8",
    mission: "Primer CubeSat chileno y primer satélite universitario de Latinoamérica. Diseñado, construido y operado íntegramente en Chile por estudiantes de tres universidades. Demostró que Chile podía desarrollar tecnología espacial propia.",
    facts: [
      "Primer satélite construido 100% en Chile",
      "Desarrollado por estudiantes universitarios chilenos",
      "Primer CubeSat de Latinoamérica",
      "Sentó las bases del programa espacial universitario chileno",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    specs: [
      ["NORAD ID", "42788"],
      ["Lanzamiento", "14 Jun 2017"],
      ["Cohete", "PSLV-C38"],
      ["Base", "Sriharikota, India"],
      ["Masa", "~1 kg"],
      ["Tipo", "CubeSat 1U"],
      ["Inclinación", "97.5°"],
      ["Período", "94.7 min"],
    ],
    badge: "HISTÓRICO",
    badgeColor: "#818CF8",
  },
  {
    id: "SUCHAI2",
    norad: 57757,
    name: "SUCHAI-2",
    full: "Satellite of the University of Chile for Aerospace Investigation 2",
    year: 2023,
    launch: "12 Ene 2023",
    agency: "Universidad de Chile",
    orbit: "550 km · SSO",
    mass: "~3 kg",
    type: "CubeSat 3U — Científico",
    color: "#A78BFA",
    mission: "Segundo CubeSat de la Universidad de Chile, con mayor capacidad científica que su predecesor. Lleva experimentos de física de plasma ionosférico para estudiar la capa superior de la atmósfera terrestre. Lanzado junto a SUCHAI-3 en la misión Transporter-6 de SpaceX.",
    facts: [
      "Estudia el plasma ionosférico sobre el hemisferio sur",
      "Lanzado por SpaceX en enero 2023",
      "Rastreable en tiempo real desde austral orbit",
      "Parte del programa SUCHAI que comenzó en 2009",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=1200&q=80",
    specs: [
      ["NORAD ID", "57757"],
      ["Lanzamiento", "12 Ene 2023"],
      ["Cohete", "Falcon 9"],
      ["Misión", "Transporter-6"],
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
    year: 2023,
    launch: "12 Ene 2023",
    agency: "Universidad de Chile",
    orbit: "550 km · SSO",
    mass: "~3 kg",
    type: "CubeSat 3U — Medioambiental",
    color: "#F472B6",
    mission: "Gemelo de SUCHAI-2, con enfoque en monitoreo forestal y medioambiental. Lleva sensores para detectar cambios en la vegetación y apoyar la gestión de incendios forestales en Chile. Opera en órbita polar sincrónica al sol, cubriendo todo el territorio chileno.",
    facts: [
      "Monitorea incendios forestales desde el espacio",
      "Cubre todo Chile en su órbita polar",
      "Hermano gemelo de SUCHAI-2, mismo lanzamiento",
      "Apoya gestión de emergencias medioambientales",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    bgPhoto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
    specs: [
      ["NORAD ID", "57758"],
      ["Lanzamiento", "12 Ene 2023"],
      ["Cohete", "Falcon 9"],
      ["Misión", "Transporter-6"],
      ["Masa", "~3 kg"],
      ["Tipo", "CubeSat 3U"],
      ["Inclinación", "97.5°"],
      ["Período", "95.6 min"],
    ],
    badge: "EN ÓRBITA",
    badgeColor: "#4ade80",
  },
  {
    id: "LEMU",
    norad: 60532,
    name: "LEMU NGE",
    full: "Primer Satélite Privado Chileno",
    year: 2024,
    launch: "16 Ago 2024",
    agency: "Lemu SpaceTech (empresa privada chilena)",
    orbit: "550 km · SSO",
    mass: "~8 kg",
    type: "CubeSat 6U — Hiperespectral",
    color: "#6EE7B7",
    mission: "Primer satélite privado de Chile y de la Patagonia. Desarrollado por Lemu, startup chilena, lleva una cámara hiperespectral capaz de analizar la composición química de la vegetación, agua y suelo. Su nombre en mapudungun significa árbol, reflejo de su misión de monitorear la biodiversidad.",
    facts: [
      "Primer satélite privado de Chile y la Patagonia",
      "Cámara hiperespectral — ve más allá del ojo humano",
      "Lanzado por SpaceX Transporter-11 en agosto 2024",
      "Su nombre significa árbol en mapudungun",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/SpaceX_Transporter-11_mission_patch.png/800px-SpaceX_Transporter-11_mission_patch.png",
    bgPhoto: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    specs: [
      ["NORAD ID", "60532"],
      ["Lanzamiento", "16 Ago 2024"],
      ["Cohete", "Falcon 9"],
      ["Misión", "Transporter-11"],
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
                ["5", "satélites chilenos"],
                ["2011", "primer lanzamiento"],
                ["4", "actualmente en órbita"],
                ["3", "universidades involucradas"],
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
