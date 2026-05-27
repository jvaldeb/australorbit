import { useState, useEffect, useRef, useCallback } from "react";
import { usePageMeta } from "./usePageMeta.js";

/* ─────────────────────────────────────────────
   SATELLITE REGISTRY
───────────────────────────────────────────── */
const SATS = [
  { id:"ISS", name:"ISS", full:"Estación Espacial Internacional", color:"#57C7FF", chilean:false, flag:null, icon:"🏗️",
    desc:"Hogar permanente de astronautas desde el año 2000. Cruza Chile múltiples veces al día a 400 km de altitud.",
    orbit:"400 km", speed:"27,600 km/h", norad:25544,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/International_Space_Station_after_undocking_of_STS-132.jpg/1280px-International_Space_Station_after_undocking_of_STS-132.jpg",
    specs:[["NORAD ID","25544"],["Lanzamiento","20 Nov 1998"],["Agencia","NASA / ESA / Roscosmos"],["Masa","420,000 kg"],["Tamaño","109 × 73 m"],["Inclinación","51.6°"],["Período orbital","92.9 min"],["Tripulación","6–7 personas"],["Tipo","Estación espacial"]]},
  { id:"HST", name:"Hubble", full:"Telescopio Espacial Hubble", color:"#7DD9A8", chilean:false, flag:null, icon:"🔭",
    desc:"Más de 30 años fotografiando el universo desde 540 km. Ha producido sobre 1.5 millones de observaciones científicas.",
    orbit:"540 km", speed:"27,300 km/h", norad:20580,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HST-SM4.jpeg/1280px-HST-SM4.jpeg",
    specs:[["NORAD ID","20580"],["Lanzamiento","24 Abr 1990"],["Agencia","NASA / ESA"],["Masa","11,110 kg"],["Diámetro espejo","2.4 m"],["Inclinación","28.5°"],["Período orbital","95.4 min"],["Observaciones","+1.5 millones"],["Tipo","Telescopio espacial"]]},
  { id:"TIANGONG", name:"Tiangong", full:"Estación Espacial China", color:"#F5C47A", chilean:false, flag:"🇨🇳", icon:"🏮",
    desc:"Estación espacial modular china en expansión activa desde 2021. Módulo central Tianhe lanzado en abril de ese año.",
    orbit:"390 km", speed:"27,700 km/h", norad:48274,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Tiangong_space_station_2022.jpg/1280px-Tiangong_space_station_2022.jpg",
    specs:[["NORAD ID","48274"],["Lanzamiento","29 Abr 2021"],["Agencia","CNSA"],["Masa","~100,000 kg"],["Módulos","3 (Tianhe + Wentian + Mengtian)"],["Inclinación","41.5°"],["Período orbital","91.6 min"],["Tripulación","3 personas"],["Tipo","Estación espacial"]]},
  { id:"SSOT", name:"SSOT", full:"Satélite Chileno de Observación", color:"#C47B48", chilean:true, flag:"🇨🇱", icon:"📡",
    desc:"Primer satélite de observación de Chile. Lanzado en 2011, captura imágenes de 1.45 m de resolución para cartografía y emergencias.",
    orbit:"628 km", speed:"27,200 km/h", norad:38011,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
    specs:[["NORAD ID","38011"],["Lanzamiento","16 Dic 2011"],["Agencia","FACH / EADS Astrium"],["Masa","~150 kg"],["Resolución","1.45 m"],["Inclinación","97.8°"],["Período orbital","97.1 min"],["Tipo","Observación terrestre"],["País","🇨🇱 Chile"]]},
  { id:"LEMU", name:"LEMU NGE", full:"Primer Satélite Privado Chileno", color:"#6EE7B7", chilean:true, flag:"🇨🇱", icon:"🌲",
    desc:"Primer satélite privado chileno. Lanzado por SpaceX en agosto 2024. Monitorea biodiversidad con cámara hiperespectral.",
    orbit:"550 km", speed:"27,400 km/h", norad:60532,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/SpaceX_Transporter-11_mission_patch.png/800px-SpaceX_Transporter-11_mission_patch.png",
    specs:[["NORAD ID","60532"],["Lanzamiento","16 Ago 2024"],["Empresa","Lemu (Chile)"],["Tipo sat.","CubeSat 6U"],["Sensor","Cámara hiperespectral"],["Inclinación","97.5°"],["Período orbital","95.6 min"],["Misión","Monitoreo biodiversidad"],["País","🇨🇱 Chile"]]},
  { id:"SUCHAI2", name:"SUCHAI-2", full:"CubeSat Universidad de Chile", color:"#A78BFA", chilean:true, flag:"🇨🇱", icon:"🔬",
    desc:"CubeSat científico desarrollado en la Universidad de Chile. Experimentos de plasma ionosférico en órbita baja.",
    orbit:"550 km", speed:"27,400 km/h", norad:57757,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    specs:[["NORAD ID","57757"],["Lanzamiento","12 Ene 2023"],["Universidad","U. de Chile"],["Tipo sat.","CubeSat 3U"],["Masa","~3 kg"],["Inclinación","97.5°"],["Período orbital","95.6 min"],["Misión","Plasma ionosférico"],["País","🇨🇱 Chile"]]},
  { id:"SUCHAI3", name:"SUCHAI-3", full:"CubeSat Universidad de Chile", color:"#F472B6", chilean:true, flag:"🇨🇱", icon:"🌿",
    desc:"Tercer CubeSat chileno. Monitoreo forestal y medioambiental desde órbita polar sincrónica al sol.",
    orbit:"550 km", speed:"27,400 km/h", norad:57758,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    specs:[["NORAD ID","57758"],["Lanzamiento","12 Ene 2023"],["Universidad","U. de Chile"],["Tipo sat.","CubeSat 3U"],["Masa","~3 kg"],["Inclinación","97.5°"],["Período orbital","95.6 min"],["Misión","Monitoreo forestal"],["País","🇨🇱 Chile"]]},
];

const API      = "https://australorbit-production.up.railway.app";
const SANTIAGO = { lat: -33.4489, lon: -70.6693 };
const d2r      = d => d * Math.PI / 180;
const r2d      = r => r * 180 / Math.PI;
const pad      = n => String(n).padStart(2, "0");

function visRadius(alt) { return r2d(Math.acos(6371 / (6371 + alt))) * 0.88; }
function azLabel(deg)   { return ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"][Math.round(deg / 22.5) % 16]; }
function fmtTime(iso) {
  const d = new Date(iso), c = new Date(d - 4 * 3600000);
  return `${pad(c.getUTCHours())}:${pad(c.getUTCMinutes())}`;
}
function fmtDate(iso) {
  const d = new Date(iso), c = new Date(d - 4 * 3600000);
  const D = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const M = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${D[c.getUTCDay()]} ${c.getUTCDate()} ${M[c.getUTCMonth()]}`;
}
function timeUntil(iso) {
  const diff = new Date(iso) - new Date();
  if (diff < 0) return "Pasado";
  const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}
function countdown(iso) {
  const diff = new Date(iso) - new Date();
  if (diff < 0) return null;
  const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
function groundTrack(lat, lon, inc, period, ahead = 120, step = 0.5) {
  const dpm = 360 / period, pts = [];
  for (let i = -period; i <= ahead; i += step) {
    const nl = ((lon + dpm * i) + 180) % 360 - 180;
    const ph = d2r((i / period) * 360);
    const na = Math.max(-90, Math.min(90, lat + Math.sin(ph) * inc * 0.3));
    pts.push({ lat: na, lon: nl, past: i < 0 });
  }
  return pts;
}

/* ─────────────────────────────────────────────
   ORBITAL PLANET — hero visualization
───────────────────────────────────────────── */
function OrbitalPlanet({ sat, pos }) {
  const cx = 200, cy = 200, R = 68;
  const orbits = [
    { rx: 110, ry: 38, tilt: -18, color: sat.color, period: 14, r: 5 },
    { rx: 145, ry: 52, tilt: 12,  color: "#C47B48", period: 22, r: 3.5 },
    { rx: 88,  ry: 30, tilt: -42, color: "#57C7FF", period: 9,  r: 3 },
  ];
  return (
    <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: 380, filter: "drop-shadow(0 0 60px rgba(87,199,255,0.1))" }}>
      <defs>
        <radialGradient id="planetGrad" cx="38%" cy="35%">
          <stop offset="0%"   stopColor="#0D2545" />
          <stop offset="60%"  stopColor="#071428" />
          <stop offset="100%" stopColor="#030A15" />
        </radialGradient>
        <radialGradient id="atmosGrad" cx="50%" cy="50%">
          <stop offset="78%"  stopColor="transparent" />
          <stop offset="100%" stopColor={sat.color + "30"} />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%">
          <stop offset="0%"   stopColor={sat.color + "15"} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <clipPath id="planetClip"><circle cx={cx} cy={cy} r={R} /></clipPath>
        <filter id="satGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx="180" ry="180" fill="url(#glowGrad)">
        <animate attributeName="rx" values="170;185;170" dur="8s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="170;185;170" dur="8s" repeatCount="indefinite"/>
      </ellipse>
      {orbits.map((o, i) => (
        <ellipse key={`ob${i}`} cx={cx} cy={cy} rx={o.rx} ry={o.ry}
          fill="none" stroke={o.color + "18"} strokeWidth="0.8"
          transform={`rotate(${o.tilt} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={R + 12} fill="url(#atmosGrad)" />
      <circle cx={cx} cy={cy} r={R}      fill="url(#planetGrad)" />
      <g clipPath="url(#planetClip)" opacity="0.35">
        <path d="M155,178 Q162,170 175,173 Q185,176 188,185 Q182,195 170,192 Q158,190 155,178Z" fill="#0A2040" />
        <path d="M185,165 Q196,158 208,162 Q215,170 210,180 Q200,184 192,178 Q185,172 185,165Z" fill="#0A2040" />
        <path d="M205,185 Q218,180 228,188 Q232,198 222,203 Q212,204 206,196Z" fill="#0A2040" />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={sat.color + "30"} strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r={R + 6} fill="none" stroke={sat.color + "0C"} strokeWidth="4" />
      <circle cx={cx - 22} cy={cy + 18} r="3" fill="#ff4d6d" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx - 22} cy={cy + 18} r="8" fill="none" stroke="#ff4d6d" strokeWidth="0.8" opacity="0.3"/>
      {orbits.map((o, i) => {
        const ang = i * 120, rx = o.rx, ry = o.ry;
        const x = cx + rx * Math.cos(d2r(ang)), y = cy + ry * Math.sin(d2r(ang));
        return (
          <g key={i} transform={`rotate(${o.tilt} ${cx} ${cy})`}>
            <circle cx={x} cy={y} r={o.r} fill={o.color} filter="url(#satGlow)">
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`}
                dur={`${o.period}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        );
      })}
      {pos?.visible_from_santiago && (
        <g>
          <rect x="115" y="342" width="170" height="22" rx="11"
            fill={sat.color + "15"} stroke={sat.color + "45"} strokeWidth="0.7"/>
          <text x="200" y="357" textAnchor="middle" fontSize="8.5"
            fill={sat.color} fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.12em">
            ● VISIBLE SOBRE SANTIAGO
          </text>
        </g>
      )}
    </svg>
  );
}
/* ─────────────────────────────────────────────
   GLOBE — SVG estático centrado en Latinoamérica
   Muestra la órbita real del satélite en 3D:
   - Segmentos sólidos = lado visible de la Tierra
   - Segmentos punteados = lado opuesto (detrás)
   - Punto + halo = posición actual del satélite
   - Punto rojo = Santiago
───────────────────────────────────────────── */

const SAT_ORB = {
  ISS:      { inc: 51.6, period: 92.9  },
  HST:      { inc: 28.5, period: 95.4  },
  TIANGONG: { inc: 41.5, period: 91.6  },
  SSOT:     { inc: 97.8, period: 97.1  },
  LEMU:     { inc: 97.5, period: 95.6  },
  SUCHAI2:  { inc: 97.5, period: 95.6  },
  SUCHAI3:  { inc: 97.5, period: 95.6  },
};

// Proyección ortográfica centrada en lat0,lon0
function ortho(lat, lon, lat0, lon0, R, cx, cy) {
  const f  = d2r, sinLat0 = Math.sin(f(lat0)), cosLat0 = Math.cos(f(lat0));
  const sinLat = Math.sin(f(lat)), cosLat = Math.cos(f(lat));
  const dLon   = f(lon - lon0);
  const cosC   = sinLat0 * sinLat + cosLat0 * cosLat * Math.cos(dLon);
  // cosC < 0 → punto en el hemisferio opuesto (detrás del globo)
  const x = R * cosLat * Math.sin(dLon);
  const y = R * (cosLat0 * sinLat - sinLat0 * cosLat * Math.cos(dLon));
  return { x: cx + x, y: cy - y, visible: cosC >= 0 };
}

// Genera órbita completa: 1 período completo centrada en posición actual
function buildFullOrbit(lat, lon, inc, period) {
  const pts = [];
  const steps = 360;
  const degPerStep = 360 / steps;
  for (let i = 0; i <= steps; i++) {
    const t   = (i / steps - 0.5) * period;           // minutos
    const dLon = (360 / period) * t;
    const phase = (t / period) * 2 * Math.PI;
    const oLat  = lat + Math.sin(phase) * inc * 0.28;
    const oLon  = lon + dLon;
    const cLat  = Math.max(-90, Math.min(90, oLat));
    const cLon  = ((oLon + 180) % 360 + 360) % 360 - 180;
    pts.push({ lat: cLat, lon: cLon, t });
  }
  return pts;
}

function Globe({ sat, pos }) {
  const W = 280, H = 280, R = 120, cx = 140, cy = 140;
  // Centrado en Latinoamérica: lat -15, lon -65
  const cLat = -15, cLon = -65;

  const orb  = SAT_ORB[sat.id] || { inc: 51.6, period: 92.9 };
  const sLat = pos?.lat ?? -15;
  const sLon = pos?.lon ?? -65;
  const alt  = pos?.alt_km ?? 400;

  // Órbita completa
  const orbitPts = buildFullOrbit(sLat, sLon, orb.inc, orb.period);

  // Convertir a puntos proyectados
  const projected = orbitPts.map(p => ({
    ...ortho(p.lat, p.lon, cLat, cLon, R, cx, cy),
    t: p.t,
  }));

  // Separar en segmentos continuos visible/oculto
  function buildSegments(pts) {
    const segs = [];
    let seg = null, lastVis = null;
    for (const p of pts) {
      if (lastVis !== null && p.visible !== lastVis) {
        if (seg) segs.push(seg);
        seg = { visible: p.visible, pts: [] };
      }
      if (!seg) seg = { visible: p.visible, pts: [] };
      seg.pts.push(p);
      lastVis = p.visible;
    }
    if (seg && seg.pts.length > 1) segs.push(seg);
    return segs;
  }
  const segments = buildSegments(projected);

  // Posición actual del satélite
  const satProj  = ortho(sLat, sLon, cLat, cLon, R, cx, cy);
  // Santiago
  const stProj   = ortho(SANTIAGO.lat, SANTIAGO.lon, cLat, cLon, R, cx, cy);
  // Punto subsatelital (nadir en la superficie)
  const nadProj  = ortho(sLat, sLon, cLat, cLon, R, cx, cy);

  // Altitud real del satélite en escala visual (max ~800km → +18px extra)
  const altOffset = Math.min((alt / 6371) * R * 0.9, 22);

  // Grilla de meridianos/paralelos
  const grid = [];
  for (let la = -80; la <= 80; la += 20) {
    const pts2 = [];
    for (let lo = -180; lo <= 180; lo += 3) {
      const p = ortho(la, lo, cLat, cLon, R, cx, cy);
      if (p.visible) pts2.push(p);
      else if (pts2.length > 1) { grid.push([...pts2]); pts2.length = 0; }
    }
    if (pts2.length > 1) grid.push(pts2);
  }
  for (let lo = -180; lo <= 180; lo += 20) {
    const pts2 = [];
    for (let la = -90; la <= 90; la += 3) {
      const p = ortho(la, lo, cLat, cLon, R, cx, cy);
      if (p.visible) pts2.push(p);
      else if (pts2.length > 1) { grid.push([...pts2]); pts2.length = 0; }
    }
    if (pts2.length > 1) grid.push(pts2);
  }

  // Contorno de continentes simplificado (Sudamérica + Centroamérica visible)
  const SA = [[-5,-81],[0,-80],[2,-77],[6,-77],[8,-77],[10,-75],[12,-72],[10,-62],[12,-61],[10,-61],[8,-60],[6,-60],[4,-52],[4,-51],[2,-50],[0,-50],[-3,-42],[-5,-35],[-9,-35],[-12,-37],[-15,-39],[-20,-40],[-23,-43],[-26,-48],[-28,-49],[-30,-51],[-33,-52],[-38,-58],[-41,-62],[-44,-65],[-46,-65],[-50,-69],[-52,-69],[-54,-68],[-55,-65],[-55,-63],[-53,-58],[-51,-59],[-48,-65],[-44,-66],[-40,-62],[-36,-57],[-33,-52],[-28,-49],[-24,-46],[-20,-41],[-15,-39],[-10,-37],[-5,-35],[-3,-42],[0,-50],[2,-50],[4,-52],[6,-60],[8,-60],[10,-61],[10,-62],[12,-61],[10,-75],[8,-77],[6,-77],[4,-77],[2,-77],[0,-80],[-5,-81]];

  const toPath = (pts) => pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const saProjected = SA.map(([la,lo]) => ortho(la, lo, cLat, cLon, R, cx, cy)).filter(p => p.visible);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', maxWidth: W, display:'block' }}>
      <defs>
        <radialGradient id={`gbg_${sat.id}`} cx="38%" cy="32%">
          <stop offset="0%"   stopColor="#0D1E36"/>
          <stop offset="100%" stopColor="#030A14"/>
        </radialGradient>
        <radialGradient id={`gatm_${sat.id}`} cx="50%" cy="50%">
          <stop offset="75%"  stopColor="transparent"/>
          <stop offset="100%" stopColor={sat.color + "18"}/>
        </radialGradient>
        <clipPath id={`gclip_${sat.id}`}>
          <circle cx={cx} cy={cy} r={R}/>
        </clipPath>
        <filter id={`glow_${sat.id}`}>
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Fondo del globo */}
      <circle cx={cx} cy={cy} r={R} fill={`url(#gbg_${sat.id})`}/>

      {/* Grilla */}
      <g clipPath={`url(#gclip_${sat.id})`}>
        {grid.map((pts2,i) => (
          <polyline key={i}
            points={pts2.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
            fill="none" stroke="#0C2545" strokeWidth="0.5" opacity="0.8"/>
        ))}

        {/* Sudamérica */}
        {saProjected.length > 2 && (
          <path d={toPath(saProjected)} fill="#0A1E34" stroke="#1A3A60" strokeWidth="1.2" fillRule="evenodd"/>
        )}

        {/* ── ÓRBITA ──
            Segmentos sólidos = frente del globo (visible)
            Segmentos punteados = detrás del globo (oculto)  */}
        {segments.map((seg, i) => {
          const pts2 = seg.pts.filter(p => p.visible || !seg.visible);
          if (pts2.length < 2) return null;
          const d = pts2.map((p,j) => `${j===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
          return (
            <path key={i} d={d} fill="none"
              stroke={sat.color}
              strokeWidth={seg.visible ? 1.8 : 0.8}
              strokeOpacity={seg.visible ? 0.85 : 0.25}
              strokeDasharray={seg.visible ? 'none' : '4 5'}
            />
          );
        })}

        {/* Santiago */}
        {stProj.visible && (
          <g>
            <circle cx={stProj.x} cy={stProj.y} r={8} fill="none" stroke="#ff4d6d" strokeWidth="0.7" opacity="0.3"/>
            <circle cx={stProj.x} cy={stProj.y} r={2.8} fill="#ff4d6d"/>
            <text x={stProj.x+6} y={stProj.y-4} fontSize="7" fill="#ff4d6d"
              fontFamily="'IBM Plex Mono',monospace" fontWeight="600">Santiago</text>
          </g>
        )}

        {/* Satélite — visible o detrás del globo */}
        {satProj.visible ? (
          <g filter={`url(#glow_${sat.id})`}>
            {/* Línea nadir (satélite → superficie) */}
            <line
              x1={satProj.x} y1={satProj.y}
              x2={nadProj.x} y2={nadProj.y}
              stroke={sat.color} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 3"/>
            {/* Halo grande */}
            <circle cx={satProj.x} cy={satProj.y} r={16} fill={sat.color} fillOpacity="0.07"/>
            {/* Halo medio */}
            <circle cx={satProj.x} cy={satProj.y} r={10} fill={sat.color} fillOpacity="0.15">
              <animate attributeName="r" values="8;12;8" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="fill-opacity" values="0.15;0.05;0.15" dur="2.4s" repeatCount="indefinite"/>
            </circle>
            {/* Núcleo */}
            <circle cx={satProj.x} cy={satProj.y} r={5} fill={sat.color}/>
            {/* Label */}
            <text x={satProj.x+9} y={satProj.y-7} fontSize="8" fill={sat.color}
              fontFamily="'IBM Plex Mono',monospace" fontWeight="600">{sat.name}</text>
          </g>
        ) : (
          /* Satélite detrás del globo — mostrar posición aproximada tenue */
          <g opacity="0.2">
            <circle cx={cx + (satProj.x-cx)*0.85} cy={cy + (satProj.y-cy)*0.85} r={4} fill={sat.color}/>
            <text x={cx + (satProj.x-cx)*0.85+7} y={cy + (satProj.y-cy)*0.85-5}
              fontSize="7" fill={sat.color} fontFamily="'IBM Plex Mono',monospace">{sat.name} ←</text>
          </g>
        )}
      </g>

      {/* Atmósfera */}
      <circle cx={cx} cy={cy} r={R+10} fill={`url(#gatm_${sat.id})`}/>
      {/* Borde del globo */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={sat.color+"28"} strokeWidth="1.2"/>

      {/* Badge estado */}
      <rect x="8" y="8" width="130" height="18" rx="5" fill="rgba(0,0,0,0.55)" stroke={satProj.visible ? sat.color+"50" : "rgba(255,255,255,0.08)"} strokeWidth="0.7"/>
      <circle cx="18" cy="17" r="3" fill={satProj.visible ? sat.color : "#334155"}>
        {satProj.visible && <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>}
      </circle>
      <text x="26" y="21" fontSize="7.5" fontFamily="'IBM Plex Mono',monospace"
        fill={satProj.visible ? sat.color : "#334155"} letterSpacing="0.1em">
        {satProj.visible ? "SOBRE HEMISFERIO" : "LADO OPUESTO"}
      </text>
    </svg>
  );
}

   CHILE MAP — Leaflet con tiles satelitales Esri
───────────────────────────────────────────── */
function ChileMap({ sat, pos }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const satMarkerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    function initMap(L) {
      if (leafletRef.current) return;

      // Inyectar CSS de Leaflet si no está
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);
      }

      const map = L.map(el, {
        center: [-33.4, -65],
        zoom: 3,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
      });

      // Tiles satelitales Esri (sin API key, gratis)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(map);

      // Overlay de labels (nombres de países/ciudades)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.6 }
      ).addTo(map);

      // Marcador Santiago
      const stIcon = L.divIcon({
        html: `<div style="width:10px;height:10px;border-radius:50%;background:#ff4d6d;border:2px solid rgba(255,77,109,0.4);box-shadow:0 0 8px #ff4d6d;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
        className: '',
      });
      L.marker([-33.45, -70.67], { icon: stIcon })
        .addTo(map)
        .bindTooltip('Santiago', { permanent: false, direction: 'right', className: 'sat-tooltip' });

      // Marcador satélite
      const satIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${sat.color};border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 12px ${sat.color};"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: '',
      });

      const initLat = pos?.lat ?? -20;
      const initLon = pos?.lon ?? -60;
      const marker = L.marker([initLat, initLon], { icon: satIcon }).addTo(map);
      satMarkerRef.current = marker;

      // Círculo de visibilidad
      const vr = visRadius(pos?.alt_km ?? 400) * 111000;
      const circle = L.circle([initLat, initLon], {
        radius: vr,
        color: sat.color,
        fillColor: sat.color,
        fillOpacity: 0.06,
        weight: 1.2,
        dashArray: '5 5',
      }).addTo(map);
      circleRef.current = circle;

      leafletRef.current = map;
    }

    if (window.L) {
      initMap(window.L);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => initMap(window.L);
      document.head.appendChild(script);
    }

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
        satMarkerRef.current = null;
        circleRef.current = null;
      }
    };
  }, [sat.id, sat.color]);

  // Actualizar posición del satélite en tiempo real
  useEffect(() => {
    if (!satMarkerRef.current || pos?.lat === undefined) return;
    const latlng = [pos.lat, pos.lon];
    satMarkerRef.current.setLatLng(latlng);
    if (circleRef.current) {
      circleRef.current.setLatLng(latlng);
      circleRef.current.setRadius(visRadius(pos.alt_km ?? 400) * 111000);
    }
  }, [pos]);

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", width: "100%", height: 370 }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      {/* Badge encima del mapa */}
      <div style={{
        position: "absolute", top: 10, left: 10, zIndex: 1000,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 8,
        color: pos?.visible_from_santiago ? sat.color : "rgba(255,255,255,0.3)",
        letterSpacing: "0.14em", textTransform: "uppercase",
        background: "rgba(0,0,0,0.65)", padding: "4px 10px",
        borderRadius: 6, border: `1px solid ${pos?.visible_from_santiago ? sat.color + "50" : "rgba(255,255,255,0.1)"}`,
        backdropFilter: "blur(8px)",
      }}>
        {pos?.visible_from_santiago ? "✓ EN RANGO DE SANTIAGO" : "○ FUERA DE RANGO"}
      </div>
      <style>{`
        .sat-tooltip { background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-family: 'IBM Plex Mono', monospace; font-size: 10px; }
        .leaflet-container { background: #030A14 !important; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKY DIAGRAM
───────────────────────────────────────────── */
function SkyDiagram({ pass, color }) {
  const cx=108,cy=108,R=86;
  const toXY=(az,el)=>{const r=R*(1-el/90),a=(az-90)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];};
  const pts=Array.from({length:21},(_,i)=>{const f=i/20,az=pass.rise_az+(pass.set_az-pass.rise_az)*f,el=f<0.5?pass.max_el*f*2:pass.max_el*(1-f)*2;return toXY(az,Math.max(0,el));});
  const d=pts.map((p,i)=>`${i===0?"M":"L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const[mx,my]=toXY(pass.max_az,pass.max_el);
  return(
    <svg viewBox="0 0 216 216" style={{width:"100%",maxWidth:180}}>
      <circle cx={cx} cy={cy} r={R+5} fill="#05080E" stroke="#0C2040" strokeWidth="1"/>
      {[30,60,90].map(r=><circle key={r} cx={cx} cy={cy} r={R*r/90} fill="none" stroke="#0C2040" strokeWidth="0.7" strokeDasharray="2 4"/>)}
      {[0,90,180,270].map(a=>{const rad=(a-90)*Math.PI/180;return<line key={a} x1={cx+7*Math.cos(rad)} y1={cy+7*Math.sin(rad)} x2={cx+R*Math.cos(rad)} y2={cy+R*Math.sin(rad)} stroke="#0C2040" strokeWidth="0.7"/>;},)}
      {[["N",0],["E",90],["S",180],["O",270]].map(([l,a])=>{const rad=(a-90)*Math.PI/180;return<text key={l} x={cx+(R+13)*Math.cos(rad)} y={cy+(R+13)*Math.sin(rad)} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#1E4060" fontFamily="'IBM Plex Mono',monospace" fontWeight="600">{l}</text>;})}
      <path d={d} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.07"/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.9"/>
      <circle cx={pts[0][0]} cy={pts[0][1]} r="4" fill="#22c55e"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill="#ef4444"/>
      <circle cx={mx} cy={my} r="5" fill={color}/>
      <circle cx={mx} cy={my} r="10" fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   PASS CARD
───────────────────────────────────────────── */
function PassCard({ pass, sat, isNext }) {
  const [open, setOpen] = useState(false);
  const [cd, setCd]     = useState(null);
  useEffect(() => {
    if (!isNext) return;
    const t = setInterval(() => setCd(countdown(pass.rise)), 1000);
    return () => clearInterval(t);
  }, [isNext, pass.rise]);
  const q  = pass.max_el >= 60 ? "ÓPTIMO" : pass.max_el >= 30 ? "BUENO" : "BAJO";
  const qc = pass.max_el >= 60 ? "#34d399" : pass.max_el >= 30 ? "#fbbf24" : "#334155";
  const dur= `${Math.floor(pass.duration/60)}m ${pass.duration%60}s`;
  return (
    <div
      onClick={()=>setOpen(!open)}
      style={{
        background: open ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.018)",
        border: `1px solid ${isNext ? sat.color+"45" : "rgba(255,255,255,0.07)"}`,
        borderLeft: `2px solid ${isNext ? sat.color : "transparent"}`,
        borderRadius: 16,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "all 0.2s",
        marginBottom: 8,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{minWidth:80}}>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:26,fontWeight:600,color:"#F0F4F8",letterSpacing:"-0.01em"}}>{fmtTime(pass.rise)}</div>
          <div style={{fontSize:9,color:"#334155",marginTop:2,fontFamily:"'IBM Plex Mono',monospace"}}>{fmtDate(pass.rise)}</div>
        </div>
        <div style={{display:"flex",gap:5,flex:1,flexWrap:"wrap",alignItems:"center"}}>
          {isNext&&<span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.15em",padding:"3px 9px",borderRadius:20,background:sat.color+"14",color:sat.color,border:`1px solid ${sat.color}38`}}>PRÓXIMO</span>}
          {pass.visible&&<span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",padding:"3px 9px",borderRadius:20,background:"#22c55e10",color:"#4ade80",border:"1px solid #22c55e28"}}>● VISIBLE</span>}
          <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",padding:"3px 9px",borderRadius:20,background:qc+"10",color:qc,border:`1px solid ${qc}28`}}>{q} {pass.max_el}°</span>
        </div>
        <div style={{textAlign:"right"}}>
          {isNext&&cd
            ?<div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:20,fontWeight:600,color:sat.color,letterSpacing:"0.06em"}}>{cd}</div>
            :<div style={{fontSize:13,color:sat.color,fontFamily:"'IBM Plex Mono',monospace",fontWeight:500}}>{timeUntil(pass.rise)}</div>
          }
          <div style={{fontSize:9,color:"#1E3A50",marginTop:2,fontFamily:"monospace"}}>{dur}</div>
        </div>
        <span style={{color:"#1E3A50",fontSize:10}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{marginTop:18,paddingTop:18,borderTop:"1px solid rgba(255,255,255,0.05)",display:"grid",gridTemplateColumns:"190px 1fr",gap:20}}>
          <SkyDiagram pass={pass} color={sat.color}/>
          <div style={{display:"flex",flexDirection:"column",gap:9,justifyContent:"center"}}>
            {[["Salida",`${fmtTime(pass.rise)} · ${azLabel(pass.rise_az)} (${pass.rise_az}°)`],["Máximo",`${fmtTime(pass.max)} · ${pass.max_el}° elevación`],["Ocaso",`${fmtTime(pass.set)} · ${azLabel(pass.set_az)} (${pass.set_az}°)`],["Duración",dur],["Visibilidad",pass.visible?"✓ A simple vista":"○ Necesita telescopio"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.035)",paddingBottom:7}}>
                <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#334155",letterSpacing:"0.12em",textTransform:"uppercase"}}>{l}</span>
                <span style={{fontSize:10.5,fontFamily:"'IBM Plex Mono',monospace",color:l==="Visibilidad"?(pass.visible?"#4ade80":"#334155"):"#E0E8F0"}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:5,padding:"12px 14px",background:sat.color+"08",borderRadius:12,border:`1px solid ${sat.color}14`}}>
              <div style={{fontSize:7.5,color:"#1E3A50",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.12em",marginBottom:5,textTransform:"uppercase"}}>Consejo de observación</div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.7}}>{pass.visible?`Mira hacia el ${azLabel(pass.rise_az)} y busca un punto de luz moviéndose uniformemente. Alcanzará ${pass.max_el}° de altura sobre el horizonte.`:`Con ${pass.max_el}° de elevación máxima, se recomienda usar binoculares para mejor visibilidad.`}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────
   OBSERVATION SIDEBAR
   - Clima del cielo en tiempo real (Open-Meteo)
   - Guía visual: cómo ver el satélite
   - Condiciones del próximo pase
───────────────────────────────────────────── */
function ObservationSidebar({ sat, next, userLat = -33.4489, userLon = -70.6693 }) {
  const [sky, setSky] = useState(null);
  const [skyLoad, setSkyLoad] = useState(true);

  useEffect(() => {
    // Open-Meteo: clima actual, sin API key
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLon}&current=cloud_cover,visibility,weather_code&timezone=auto`)
      .then(r => r.json())
      .then(d => {
        const c = d.current;
        setSky({
          clouds:     c.cloud_cover,       // 0-100%
          visibility: c.visibility / 1000, // km
          code:       c.weather_code,      // WMO code
        });
        setSkyLoad(false);
      })
      .catch(() => setSkyLoad(false));
  }, [userLat, userLon]);

  // Interpretar condición del cielo
  function skyCondition(clouds, code) {
    if (code >= 61) return { label: "Lluvia", color: "#64748b", icon: "🌧", score: 0 };
    if (clouds >= 80) return { label: "Muy nublado", color: "#475569", icon: "☁️", score: 1 };
    if (clouds >= 50) return { label: "Parcialmente nublado", color: "#f59e0b", icon: "⛅", score: 2 };
    if (clouds >= 20) return { label: "Mayormente despejado", color: "#57C7FF", icon: "🌤", score: 3 };
    return { label: "Cielo despejado", color: "#4ade80", icon: "★", score: 4 };
  }

  const cond = sky ? skyCondition(sky.clouds, sky.code) : null;

  // Condiciones del próximo pase combinadas con clima
  function passQuality() {
    if (!next || !sky) return null;
    const elScore  = next.max_el >= 60 ? 3 : next.max_el >= 30 ? 2 : 1;
    const skyScore = cond?.score ?? 2;
    const visScore = next.visible ? 2 : 1;
    const total    = elScore + skyScore + visScore;
    if (total >= 7) return { label: "Condiciones excelentes", color: "#4ade80" };
    if (total >= 5) return { label: "Buenas condiciones", color: "#57C7FF" };
    if (total >= 3) return { label: "Condiciones regulares", color: "#f59e0b" };
    return { label: "Difícil de observar", color: "#64748b" };
  }

  const pq = passQuality();
  const glass = (extra={}) => ({
    background: "rgba(255,255,255,0.028)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    borderRadius: 16,
    ...extra,
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12, position:"sticky", top:20 }}>

      {/* ── BLOQUE 1: Clima del cielo ── */}
      <div style={{...glass(), padding:"16px 18px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#fff"}}>
            Cielo ahora
          </span>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7.5,color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>
            OPEN-METEO
          </span>
        </div>

        {skyLoad && (
          <div style={{padding:"16px 0",textAlign:"center",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#57C7FF",letterSpacing:"0.12em"}}>
            Consultando clima...
          </div>
        )}

        {!skyLoad && sky && cond && (
          <>
            {/* Indicador principal */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,padding:"12px 14px",background:cond.color+"10",borderRadius:12,border:`1px solid ${cond.color}30`}}>
              <span style={{fontSize:28}}>{cond.icon}</span>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:cond.color,fontFamily:"'Syne',sans-serif"}}>{cond.label}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>
                  {cond.score >= 3 ? "Buenas condiciones para observar" : cond.score >= 2 ? "Observación posible" : "Difícil observar satélites"}
                </div>
              </div>
            </div>

            {/* Barra de nubosidad */}
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em"}}>NUBOSIDAD</span>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:cond.color}}>{sky.clouds}%</span>
              </div>
              <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                <div style={{height:4,width:`${sky.clouds}%`,background:cond.color,borderRadius:2,transition:"width 0.8s ease"}}/>
              </div>
            </div>

            {/* Visibilidad */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em"}}>VISIBILIDAD</span>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.6)"}}>
                {sky.visibility >= 20 ? "+20 km" : `${sky.visibility.toFixed(0)} km`}
              </span>
            </div>
          </>
        )}

        {!skyLoad && !sky && (
          <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace",textAlign:"center",padding:"10px 0"}}>
            No se pudo obtener el clima
          </div>
        )}
      </div>

      {/* ── BLOQUE 2: Calidad del próximo pase ── */}
      {next && pq && (
        <div style={{...glass(), padding:"16px 18px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#fff",marginBottom:12}}>
            Próximo pase
          </div>
          <div style={{padding:"10px 14px",background:pq.color+"10",borderRadius:10,border:`1px solid ${pq.color}30`,marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:600,color:pq.color,fontFamily:"'Syne',sans-serif"}}>{pq.label}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontFamily:"'IBM Plex Mono',monospace",marginTop:3}}>
              {fmtDate(next.rise)} · {fmtTime(next.rise)}h
            </div>
          </div>
          {[
            ["Elevación", `${next.max_el}°`, next.max_el >= 40 ? "#4ade80" : next.max_el >= 20 ? "#f59e0b" : "#64748b"],
            ["Visible", next.visible ? "Sí" : "No", next.visible ? "#4ade80" : "#64748b"],
            ["Cielo", cond ? cond.label : "—", cond ? cond.color : "#64748b"],
          ].map(([label, val, color]) => (
            <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:8,marginBottom:8,borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em"}}>{label.toUpperCase()}</span>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10.5,color}}>{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── BLOQUE 3: Guía visual cómo observar ── */}
      <div style={{...glass(), padding:"16px 18px"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#fff",marginBottom:14}}>
          ¿Cómo ver {sat.name}?
        </div>

        {/* Ilustración SVG del cielo nocturno con satélite */}
        <svg viewBox="0 0 240 120" style={{width:"100%",borderRadius:10,marginBottom:14,background:"#020810"}}>
          {/* Estrellas */}
          {[[20,15],[45,8],[80,20],[110,5],[150,18],[190,10],[220,15],[30,40],[170,35],[200,45],[60,55],[130,50]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={0.8} fill="white" opacity={0.4+Math.random()*0.4}/>
          ))}
          {/* Horizonte */}
          <rect x="0" y="90" width="240" height="30" fill="#0A1628"/>
          <line x1="0" y1="90" x2="240" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
          {/* Silueta ciudad */}
          <rect x="10"  y="78" width="12" height="12" fill="#0A1628"/>
          <rect x="25"  y="72" width="8"  height="18" fill="#0A1628"/>
          <rect x="36"  y="80" width="10" height="10" fill="#0A1628"/>
          <rect x="190" y="75" width="14" height="15" fill="#0A1628"/>
          <rect x="207" y="70" width="9"  height="20" fill="#0A1628"/>
          <rect x="219" y="78" width="12" height="12" fill="#0A1628"/>
          {/* Trayectoria del satélite */}
          <path d="M 20 70 Q 120 20 220 55" fill="none" stroke={sat.color} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4"/>
          {/* Satélite con halo */}
          <circle cx="120" cy="28" r="10" fill={sat.color} fillOpacity="0.08"/>
          <circle cx="120" cy="28" r="5"  fill={sat.color} fillOpacity="0.18">
            <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="fill-opacity" values="0.18;0.05;0.18" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="120" cy="28" r="2.5" fill={sat.color}/>
          {/* Etiqueta */}
          <text x="128" y="24" fontSize="7" fill={sat.color} fontFamily="monospace">{sat.name}</text>
          {/* Dirección: N, S, E, O */}
          {[["N",120,106],["S",120,87],["E",230,97],["O",8,97]].map(([l,x,y])=>(
            <text key={l} x={x} y={y} fontSize="7" fill="rgba(255,255,255,0.2)" fontFamily="monospace" textAnchor="middle">{l}</text>
          ))}
          {/* Observador */}
          <circle cx="120" cy="93" r="3" fill="#ff4d6d"/>
          <line x1="120" y1="90" x2="120" y2="35" stroke="#ff4d6d" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 3"/>
          <text x="128" y="98" fontSize="6.5" fill="#ff4d6d" fontFamily="monospace">Tú</text>
        </svg>

        {/* Pasos */}
        {[
          { n:"1", title:"Sal afuera", desc:"Ve a un lugar oscuro, lejos de luces artificiales. 5 min antes del pase." },
          { n:"2", title:"Mira al horizonte", desc:`Dirígete hacia el ${next ? azLabel(next.rise_az) : "norte"} — por ahí saldrá ${sat.name}.` },
          { n:"3", title:"Busca un punto de luz", desc:"Se mueve uniformemente y más rápido que los aviones. No parpadea." },
          { n:"4", title:"Síguela con la vista", desc:`Tendrás ~${next ? Math.floor(next.duration/60)+"m "+next.duration%60+"s" : "varios minutos"} para verla cruzar el cielo.` },
        ].map(step => (
          <div key={step.n} style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}>
            <div style={{
              width:22,height:22,borderRadius:"50%",flexShrink:0,
              background:sat.color+"15",border:`1px solid ${sat.color}40`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:sat.color,fontWeight:700,
            }}>{step.n}</div>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.8)",marginBottom:2,fontFamily:"'Syne',sans-serif"}}>{step.title}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",lineHeight:1.5}}>{step.desc}</div>
            </div>
          </div>
        ))}

        {/* Tip final */}
        <div style={{marginTop:4,padding:"10px 12px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em",marginBottom:4}}>CONSEJO</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.6}}>
            {sat.name === "ISS"
              ? "La ISS es el objeto más brillante del cielo nocturno después de la Luna. Con magnitud -3 puede verse incluso en ciudades con contaminación lumínica."
              : `${sat.name} es más pequeño que la ISS. Necesitarás cielo oscuro y ojos adaptados a la oscuridad (~10 min en la penumbra).`
            }
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────
   NOTIF BANNER
───────────────────────────────────────────── */
function NotifBanner({ next, sat, onDismiss }) {
  if (!next) return null;
  const diff = new Date(next.rise) - new Date();
  if (diff < 0 || diff > 30 * 60000) return null;
  const m = Math.floor(diff / 60000);
  return (
    <div style={{position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",zIndex:300,padding:"12px 20px",borderRadius:16,background:"rgba(0,0,0,0.85)",border:`1px solid ${sat.color}55`,backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",display:"flex",alignItems:"center",gap:15,boxShadow:`0 0 40px ${sat.color}18`,maxWidth:"86vw"}}>
      <span style={{fontSize:18}}>🛰</span>
      <div>
        <div style={{fontSize:10,fontWeight:600,color:sat.color,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.14em"}}>PASE EN {m} MINUTOS</div>
        <div style={{fontSize:9.5,color:"#64748b",marginTop:2,fontFamily:"monospace"}}>{sat.name} · {fmtTime(next.rise)} · Máx {next.max_el}°{next.visible?" · 👁 Visible":""}</div>
      </div>
      <button onClick={onDismiss} style={{marginLeft:"auto",color:"#334155",fontSize:13,padding:"4px 8px",borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",cursor:"pointer"}}>✕</button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  usePageMeta({
    title:       "Rastreo de satélites en tiempo real",
    description: "Sigue la ISS, satélites chilenos y eventos espaciales en vivo desde Chile. Próximos pases, posición en tiempo real y clima espacial.",
    url:         "https://australorbit.com",
  });

  const [sat, setSat]                       = useState(SATS[0]);
  const [passes, setPasses]                 = useState([]);
  const [pos, setPos]                       = useState(null);
  const [news, setNews]                     = useState([]);
  const [newsLoading, setNewsLoading]       = useState(false);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [now, setNow]                       = useState(new Date());
  const [mapTab, setMapTab]                 = useState("globe");
  const [onlyVis, setOnlyVis]               = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [logoError, setLogoError]           = useState(false);
  const [fichaOpen, setFichaOpen]           = useState(false);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [alertsEnabled, setAlertsEnabled]   = useState(false);
  const [alertMinutes, setAlertMinutes]     = useState(10);
  const [alertPermission, setAlertPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "default");
  const [activeSection, setActiveSection]   = useState("passes"); // "passes" | "news"
  const alertTimers = useRef([]);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const scheduleAlerts = useCallback((passList, sat, minutes) => {
    alertTimers.current.forEach(t => clearTimeout(t));
    alertTimers.current = [];
    if (!alertsEnabled || Notification.permission !== "granted") return;
    const nowMs = Date.now();
    passList.forEach(pass => {
      const riseMs = new Date(pass.rise).getTime();
      const delay  = riseMs - minutes * 60000 - nowMs;
      if (delay < 0) return;
      const t = setTimeout(() => {
        const mins = Math.round((riseMs - Date.now()) / 60000);
        new Notification(`🛰 ${sat.name} pasa sobre Santiago`, {
          body: `En ${mins} min · Máx: ${pass.max_el}° · ${pass.visible ? "👁 Visible a simple vista" : "Usa binoculares"}`,
          icon: "/logo.png", badge: "/logo.png", tag: `${sat.id}-${pass.rise}`,
        });
      }, delay);
      alertTimers.current.push(t);
    });
  }, [alertsEnabled]);

  useEffect(() => {
    if (alertsEnabled && passes.length > 0) scheduleAlerts(passes, sat, alertMinutes);
    return () => alertTimers.current.forEach(t => clearTimeout(t));
  }, [alertsEnabled, passes, sat, alertMinutes, scheduleAlerts]);

  const requestAlerts = async () => {
    if (!("Notification" in window)) { alert("Tu navegador no soporta notificaciones."); return; }
    if (Notification.permission === "granted") { setAlertsEnabled(a => !a); return; }
    const perm = await Notification.requestPermission();
    setAlertPermission(perm);
    if (perm === "granted") setAlertsEnabled(true);
  };

  useEffect(() => {
    setLoading(true); setError(null); setPasses([]); setNotifDismissed(false); setFichaOpen(false);
    fetch(`${API}/passes/${sat.id}`)
      .then(r => r.json()).then(d => { setPasses(d.passes || []); setLoading(false); })
      .catch(() => { setError("No se pudo conectar al servidor."); setLoading(false); });
  }, [sat]);

  useEffect(() => {
    setPos(null);
    const go = () => fetch(`${API}/position/${sat.id}`).then(r => r.json()).then(setPos).catch(() => {});
    go(); const t = setInterval(go, 5000); return () => clearInterval(t);
  }, [sat]);

  useEffect(() => {
    setNewsLoading(true);
    fetch(`${API}/news`)
      .then(r => r.json())
      .then(d => { setNews(Array.isArray(d) ? d : (d.articles || d.results || [])); setNewsLoading(false); })
      .catch(() => setNewsLoading(false));
  }, []);

  const future    = passes.filter(p => new Date(p.set) > now);
  const next      = future[0];
  const shown     = onlyVis ? future.filter(p => p.visible) : future;
  const notifNext = future.find(p => { const d = new Date(p.rise) - now; return d > 0 && d < 30*60000; });
  const isLive    = pos?.visible_from_santiago;

  /* ── glass panel style helper ── */
  const glass = (extra = {}) => ({
    background: "rgba(255,255,255,0.028)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    borderRadius: 20,
    ...extra,
  });

  const pill = (active, color = "#57C7FF") => ({
    padding: "7px 16px",
    borderRadius: 99,
    border: `1px solid ${active ? color + "55" : "rgba(255,255,255,0.1)"}`,
    background: active ? color + "14" : "rgba(255,255,255,0.03)",
    color: active ? color : "rgba(255,255,255,0.45)",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.1em",
    cursor: "pointer",
    transition: "all 0.25s",
    boxShadow: active ? `0 0 18px ${color}18` : "none",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@0,700;1,400;1,600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#000;color:#E0E8F0;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#111;border-radius:2px;}
        button{cursor:pointer;border:none;background:none;font-family:inherit;}
        a{color:inherit;}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.15;transform:scale(1.6)}}
        @keyframes auroraFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(2%,1.5%) scale(1.04)}66%{transform:translate(-1.5%,3%) scale(0.97)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}
        @keyframes issFloat{0%{transform:translate(0,0) scale(1) rotate(0deg)}25%{transform:translate(18px,-12px) scale(1.012) rotate(0.4deg)}50%{transform:translate(32px,6px) scale(1.018) rotate(-0.3deg)}75%{transform:translate(14px,20px) scale(1.008) rotate(0.5deg)}100%{transform:translate(0,0) scale(1) rotate(0deg)}}
        @keyframes issFadeIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
        @keyframes bgPulse{0%,100%{opacity:0.13}50%{opacity:0.19}}
        @keyframes earthFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes earthDrift{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.022)}}
        .nav-section-link{position:relative;text-decoration:none;transition:all 0.25s;white-space:nowrap;}
        .nav-section-link::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform 0.3s ease;}
        .nav-section-link:hover::after,.nav-section-link.active::after{transform:scaleX(1);}
        .nav-section-link:hover{opacity:1!important;}
        .sat-pill{transition:all 0.25s;}
        .sat-pill:hover{transform:translateY(-1px);}
        .glass-card{transition:border-color 0.2s;}
        .glass-card:hover{border-color:rgba(255,255,255,0.13)!important;}

        /* ── TABLET ── */
        @media(max-width:1080px){
          .three-col{grid-template-columns:260px 1fr!important;}
          .news-col{display:none!important;}
        }
        @media(max-width:820px){
          .three-col{grid-template-columns:1fr!important;}
          .left-col{display:none!important;}
        }
        @media(max-width:680px){
          .hero-grid{grid-template-columns:1fr!important;}
          .planet-col{display:none!important;}
        }

        /* ── MOBILE ── */
        @media(max-width:600px){
          /* Nav: hide desktop sections, show hamburger */
          .nav-desktop-sections{display:none!important;}
          .nav-desktop-clock{display:none!important;}
          .nav-hamburger{display:flex!important;}
          .nav-live-badge{display:none!important;}
          /* Ocultar tabs Pases/Noticias en mobile — noticias va por su propia página */
          .section-tabs-desktop{display:none!important;}

          /* Ficha técnica — visible en mobile, oculta en desktop */
          .ficha-mobile{display:block!important;}
          .ficha-desktop{display:none!important;}

          /* Mobile menu drawer */
          .mobile-menu{
            display:flex;flex-direction:column;gap:4px;
            position:fixed;top:0;left:0;right:0;
            background:rgba(0,0,0,0.97);
            border-bottom:1px solid rgba(255,255,255,0.08);
            backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);
            padding:80px 24px 24px;
            z-index:150;
            animation:fadeUp 0.2s ease both;
          }
          .mobile-menu a{
            font-family:'Syne',sans-serif;font-size:22px;font-weight:700;
            color:rgba(255,255,255,0.7);text-decoration:none;
            padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);
            transition:color 0.2s;letter-spacing:0.02em;
          }
          .mobile-menu a.active{color:#fff;}
          .mobile-menu a:last-child{border-bottom:none;}

          /* Hero mobile */
          .hero-mobile-next{display:flex!important;}
          .hero-description{display:none!important;}
          .hero-padding{padding:32px 0 28px!important;}
          .hero-title-line{font-size:32px!important;}
          .hero-title-italic{font-size:34px!important;}
          .hero-badge{margin-bottom:18px!important;}

          /* Earth bg smaller on mobile */
          .earth-bg-img{width:110vw!important;height:110vw!important;opacity:0.15!important;}

          /* Content padding */
          .page-padding{padding:0 16px!important;}

          /* Sat picker — smaller pills */
          .sat-picker-label{font-size:7px!important;}

          /* Pass cards */
          .pass-time-num{font-size:20px!important;}
          .pass-cd{font-size:16px!important;}

          /* Mobile next pass strip — compact */
          .next-pass-card{flex-direction:column!important;gap:0!important;}
          .next-pass-cell{padding:12px 16px!important;font-size:26px!important;}
          .next-pass-cell-time{font-size:26px!important;}
        }

        /* Nav on mobile: just logo + hamburger */
        .nav-hamburger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;flex-direction:column;gap:5px;padding:0;}
        .nav-hamburger span{display:block;width:18px;height:1.5px;background:rgba(255,255,255,0.8);border-radius:2px;transition:all 0.25s;}
        .nav-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(4.5px,4.5px);}
        .nav-hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0);}
        .nav-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(4.5px,-4.5px);}

        /* Mobile clock — compact, right of logo */
        .nav-mobile-clock{display:none;}
        @media(max-width:600px){
          .nav-mobile-clock{display:block;font-family:'IBM Plex Mono',monospace;font-size:18px;color:#fff;letter-spacing:0.04em;margin-left:auto;margin-right:12px;}
        }
      `}</style>

      {/* ── BACKGROUND ── */}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        {/* Deep black base */}
        <div style={{position:"absolute",inset:0,background:"#000"}}/>

        {/* Earth hero background */}
        <div style={{
          position:"absolute", inset:0,
          animation:"earthFadeIn 2.5s ease both",
        }}>
          <img
            src="/earth-bg.png"
            alt=""
            style={{
              position:"absolute",
              top:"50%", left:"50%",
              transform:"translate(-50%,-50%)",
              width:"90vmin", height:"90vmin",
              objectFit:"contain",
              opacity:0.22,
              animation:"earthDrift 55s ease-in-out infinite",
              filter:"saturate(0.8) brightness(0.9)",
              pointerEvents:"none",
              userSelect:"none",
              className:"earth-bg-img",
            }}
          />
        </div>

        {/* Dark vignette so content stays readable */}
        <div style={{
          position:"absolute",inset:0,
          background:"radial-gradient(ellipse 120% 90% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.88) 100%)",
        }}/>
        {/* Top + bottom fades for nav/footer legibility */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"22%",background:"linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, transparent 100%)"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"22%",background:"linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)"}}/>

        {/* Satellite color aurora */}
        <div style={{position:"absolute",top:"-30%",left:"20%",width:"90vw",height:"80vh",borderRadius:"50%",background:`radial-gradient(ellipse, ${sat.color}07 0%, transparent 65%)`,transition:"background 2.5s ease",animation:"auroraFloat 22s ease-in-out infinite"}}/>

        {/* Noise grain */}
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.025}}>
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#noise)"/>
        </svg>
        {/* Stars */}
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          {Array.from({length:55},(_,i)=>({
            x:((i*179.3)%100).toFixed(1),y:((i*97.1)%100).toFixed(1),
            r:i%8===0?1.2:i%4===0?0.65:0.35,
            op:(0.04+(i%5)*0.05).toFixed(2),dur:3+(i%7),del:(i%9)*0.6,
          })).map((s,i)=>(
            <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
              <animate attributeName="opacity" values={`${s.op};${(s.op*0.1).toFixed(2)};${s.op}`} dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
            </circle>
          ))}
        </svg>
        {/* Grid */}
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.015}}>
          <defs><pattern id="pg" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg)"/>
        </svg>
      </div>

      {/* ── CONTENT ── */}
      <div className="page-padding" style={{position:"relative",zIndex:1,padding:"0 24px",minHeight:"100vh"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>

          {/* ── MOBILE MENU DRAWER ── */}
          {menuOpen && (
            <div className="mobile-menu" onClick={()=>setMenuOpen(false)}>
              <a href="/" className="active">Rastreo</a>
              <a href="/lanzamientos">Lanzamientos</a>
              <a href="/espacio">Clima espacial</a>
              <a href="/noticias">Noticias</a>
              <a href="/contacto">Contacto</a>
            </div>
          )}
          {/* Backdrop */}
          {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:140,background:"rgba(0,0,0,0.5)"}}/>}

          {/* ── NAV ── */}
          <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",animation:"fadeIn 0.7s ease both",gap:16,position:"relative",zIndex:160}}>

            {/* Logo */}
            <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
              {!logoError
                ?<img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:52,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 16px rgba(10,28,80,0.6)) brightness(1.08)",transition:"filter 0.6s"}}/>
                :<span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,letterSpacing:"0.06em",color:"#fff"}}>AO</span>
              }
              <div>
                <div style={{display:"flex",alignItems:"baseline",gap:7}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.06em",color:"#fff"}}>AUSTRAL</span>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontStyle:"italic",fontWeight:400,color:sat.color,transition:"color 0.6s"}}>Orbit</span>
                </div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7,letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginTop:1}}>Santiago · 33.4°S</div>
              </div>
            </div>

            {/* ── DESKTOP: section links centradas ── */}
            <div className="nav-desktop-sections" style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}}>
              <a href="/" className="nav-section-link active" style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:"#fff",padding:"8px 18px",borderRadius:99,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)"}}>Rastreo</a>
              <a href="/lanzamientos" className="nav-section-link" style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:"rgba(255,255,255,0.5)",padding:"8px 18px",borderRadius:99,border:"1px solid transparent"}}>Lanzamientos</a>
              <a href="/espacio" className="nav-section-link" style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:"rgba(255,255,255,0.5)",padding:"8px 18px",borderRadius:99,border:"1px solid transparent"}}>Clima espacial</a>
              <a href="/noticias" className="nav-section-link" style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:"rgba(255,255,255,0.5)",padding:"8px 18px",borderRadius:99,border:"1px solid transparent"}}>Noticias</a>
              <a href="/contacto" className="nav-section-link" style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:"rgba(255,255,255,0.5)",padding:"8px 18px",borderRadius:99,border:"1px solid transparent"}}>Contacto</a>
              <span style={{width:1,height:16,background:"rgba(255,255,255,0.1)",margin:"0 4px"}}/>
            </div>

            {/* MOBILE: reloj compacto */}
            <div className="nav-mobile-clock">{`${pad(now.getHours())}:${pad(now.getMinutes())}`}</div>

            {/* Right: live + clock (desktop) + hamburger (mobile) */}
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              {/* Live badge — desktop only */}
              {pos && (
                <div className="nav-live-badge" style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:99,...glass({}),transition:"all 0.6s"}}>
                  <span style={{display:"block",width:5,height:5,borderRadius:"50%",background:isLive?sat.color:"rgba(255,255,255,0.15)",animation:isLive?"livePulse 2s infinite":"none",boxShadow:isLive?`0 0 8px ${sat.color}`:"none"}}/>
                  <span style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:isLive?sat.color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>{isLive?"VISIBLE":"NO VISIBLE"}</span>
                </div>
              )}
              {/* Clock — desktop only */}
              <div className="nav-desktop-clock" style={{textAlign:"right"}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:20,color:"#fff",letterSpacing:"0.04em",lineHeight:1}}>{`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`}</div>
                <div style={{fontSize:7,color:"rgba(255,255,255,0.2)",letterSpacing:"0.2em",marginTop:1,fontFamily:"'IBM Plex Mono',monospace"}}>HORA CHILE</div>
              </div>
              {/* Hamburger — mobile only */}
              <button className={`nav-hamburger${menuOpen?" open":""}`} onClick={()=>setMenuOpen(o=>!o)} aria-label="Menú">
                <span/><span/><span/>
              </button>
            </div>
          </nav>

          {/* ── HERO ── */}
          <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 400px",gap:56,padding:"48px 0 40px",alignItems:"center"}}>
            <div style={{animation:"fadeUp 0.9s ease both"}}>
              {/* Live badge */}
              <div className="hero-badge" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:99,...glass({}),marginBottom:22,transition:"all 0.6s"}}>
                <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:sat.color,boxShadow:`0 0 8px ${sat.color}`,animation:"livePulse 2.2s infinite"}}/>
                <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:sat.color,letterSpacing:"0.2em",textTransform:"uppercase"}}>Datos reales · Skyfield + CelesTrak</span>
              </div>

              {/* Title */}
              <h1 style={{marginBottom:16,lineHeight:1.08,letterSpacing:"-0.02em"}}>
                <span className="hero-title-line" style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,3.5vw,46px)",fontWeight:800,color:"#fff",display:"block"}}>El espacio está</span>
                <span className="hero-title-italic" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,3.8vw,50px)",fontStyle:"italic",fontWeight:400,color:sat.color,transition:"color 0.6s",display:"block"}}>sobre Latinoamérica</span>
                <span className="hero-title-line" style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,3.5vw,46px)",fontWeight:800,color:"rgba(255,255,255,0.85)",display:"block"}}>ahora mismo.</span>
              </h1>

              <p className="hero-description" style={{fontSize:15,color:"rgba(255,255,255,0.35)",lineHeight:1.8,fontWeight:300,maxWidth:420,marginBottom:32}}>
                Pases calculados en tiempo real sobre Santiago de Chile. Satélites locales, estaciones espaciales internacionales y más.
              </p>

              {/* Next pass — full card desktop, compact strip mobile */}
              {next && (
                <div style={{display:"inline-flex",alignItems:"stretch",gap:0,borderRadius:16,overflow:"hidden",...glass({}),maxWidth:"100%"}}>
                  <div style={{padding:"14px 20px",borderRight:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.2em",color:"rgba(255,255,255,0.25)",textTransform:"uppercase",marginBottom:5}}>Próximo · {sat.name}</div>
                    <div className="next-pass-cell-time" style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:30,fontWeight:600,color:sat.color,letterSpacing:"0.01em"}}>{fmtTime(next.rise)}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:3,fontFamily:"monospace"}}>{fmtDate(next.rise)} · Chile</div>
                  </div>
                  <div style={{padding:"14px 20px"}}>
                    <div style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.2em",color:"rgba(255,255,255,0.25)",textTransform:"uppercase",marginBottom:5}}>Faltan</div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:30,fontWeight:600,color:"#fff",letterSpacing:"0.01em"}}>{timeUntil(next.rise)}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:3}}>Máx {next.max_el}°{next.visible?" · 👁 Visible":""}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Orbital planet */}
            <div className="planet-col" style={{display:"flex",justifyContent:"center",animation:"fadeUp 1.1s ease 0.15s both"}}>
              <div style={{position:"relative"}}>
                <div style={{position:"absolute",inset:-50,borderRadius:"50%",background:`radial-gradient(circle, ${sat.color}0C 0%, transparent 70%)`,transition:"background 0.8s",animation:"auroraFloat 15s ease-in-out infinite"}}/>
                <OrbitalPlanet sat={sat} pos={pos}/>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div style={{height:1,background:`linear-gradient(90deg, transparent, ${sat.color}35, transparent)`,transition:"background 0.6s",marginBottom:0}}/>

          {/* ── SAT PICKER ── */}
          <div style={{padding:"22px 0 18px"}}>
            <div style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:12}}>Selecciona satélite</div>
            <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
              {SATS.map(s=>(
                <button key={s.id} className="sat-pill" onClick={()=>setSat(s)}
                  style={{flexShrink:0,padding:"9px 16px",borderRadius:99,background:sat.id===s.id?s.color+"12":"rgba(255,255,255,0.025)",border:`1px solid ${sat.id===s.id?s.color+"50":"rgba(255,255,255,0.07)"}`,color:sat.id===s.id?s.color:"rgba(255,255,255,0.35)",fontFamily:"'IBM Plex Mono',monospace",fontSize:10.5,letterSpacing:"0.06em",boxShadow:sat.id===s.id?`0 0 20px ${s.color}14`:"none",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{display:"block",width:5,height:5,borderRadius:"50%",background:sat.id===s.id?s.color:"rgba(255,255,255,0.15)",boxShadow:sat.id===s.id?`0 0 8px ${s.color}`:"none",flexShrink:0}}/>
                  {s.name}
                  {s.chilean&&<span style={{fontSize:7,background:"rgba(196,123,72,0.12)",color:"#C47B48",padding:"2px 5px",borderRadius:4,border:"1px solid rgba(196,123,72,0.2)",letterSpacing:"0.06em"}}>🇨🇱 CL</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{height:1,background:"rgba(255,255,255,0.04)",marginBottom:0}}/>

          {/* ── FICHA TÉCNICA MOBILE (solo visible en mobile, fuera del grid) ── */}
          <div className="ficha-mobile" style={{display:"none",padding:"16px 0 4px"}}>
            <button onClick={()=>setFichaOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer",background:"rgba(255,255,255,0.025)",border:`1px solid ${fichaOpen?sat.color+"40":"rgba(255,255,255,0.08)"}`,borderRadius:14,textAlign:"left",transition:"all 0.2s"}}>
              <span style={{fontSize:18}}>{sat.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:"#fff"}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontWeight:400,color:sat.color,transition:"color 0.6s"}}>{sat.name}</span>
                  {" "}— Ficha técnica
                </div>
                <div style={{fontSize:8,color:"rgba(255,255,255,0.2)",marginTop:2,fontFamily:"'IBM Plex Mono',monospace"}}>{sat.full}</div>
              </div>
              <span style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:fichaOpen?sat.color:"rgba(255,255,255,0.3)",border:`1px solid ${fichaOpen?sat.color+"40":"rgba(255,255,255,0.1)"}`,borderRadius:8,padding:"4px 10px",background:fichaOpen?sat.color+"0C":"rgba(255,255,255,0.02)",transition:"all 0.25s",flexShrink:0}}>
                {fichaOpen?"▲":"▼"}
              </span>
            </button>
            {fichaOpen&&(
              <div style={{animation:"fadeUp 0.25s ease both",padding:"14px 0 4px"}}>
                <div style={{borderRadius:14,overflow:"hidden",marginBottom:12,border:`1px solid ${sat.color}15`,position:"relative"}}>
                  <img src={sat.photo} alt={sat.name} style={{width:"100%",height:180,objectFit:"cover",opacity:0.8,display:"block"}} onError={e=>{e.target.parentElement.style.display="none";}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)"}}/>
                </div>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.72,fontWeight:300,marginBottom:14,padding:"0 2px"}}>{sat.desc}</p>
                <div style={{borderRadius:12,overflow:"hidden",border:"1px solid rgba(255,255,255,0.07)",...glass({}),marginBottom:12}}>
                  {sat.specs.map(([l,v],i)=>(
                    <div key={l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:i%2===0?"transparent":"rgba(255,255,255,0.015)",borderBottom:i<sat.specs.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                      <span style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{l}</span>
                      <span style={{fontSize:11,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.75)",fontWeight:500,textAlign:"right",maxWidth:"55%"}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",padding:"0 2px"}}>
                  <a href={`https://www.n2yo.com/satellite/?s=${sat.norad}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:10,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",textDecoration:"none",padding:"7px 12px",borderRadius:9,background:"rgba(87,199,255,0.06)",border:"1px solid rgba(87,199,255,0.16)",letterSpacing:"0.06em"}}>
                    Ver en N2YO.com →
                  </a>
                  {sat.chilean&&<span style={{fontSize:10,color:"#C47B48",fontFamily:"'IBM Plex Mono',monospace",padding:"7px 12px",borderRadius:9,background:"rgba(196,123,72,0.06)",border:"1px solid rgba(196,123,72,0.16)",letterSpacing:"0.06em"}}>🇨🇱 Fabricación chilena</span>}
                </div>
              </div>
            )}
          </div>
          <div className="three-col" style={{display:"grid",gridTemplateColumns:"275px 1fr 265px",gap:20,padding:"22px 0 32px",alignItems:"start"}}>

            {/* ── COL 1: Map + Live + Stats + Ficha ── */}
            <div className="left-col" style={{display:"flex",flexDirection:"column",gap:12}}>

              {/* Map tab switcher */}
              <div style={{display:"flex",gap:5}}>
                {[["globe","🌍 Globo"],["chile","🇨🇱 Chile"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setMapTab(id)}
                    style={{flex:1,padding:"7px",borderRadius:10,...glass({}),color:mapTab===id?sat.color:"rgba(255,255,255,0.3)",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.08em",transition:"all 0.2s",border:`1px solid ${mapTab===id?sat.color+"40":"rgba(255,255,255,0.07)"}`}}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Map container */}
              <div style={{borderRadius:18,...glass({}),padding:10,display:"flex",justifyContent:"center",position:"relative",minHeight:195,transition:"border-color 0.6s"}}>
                {!pos&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:18,background:"rgba(0,0,0,0.75)",zIndex:2}}><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:sat.color,letterSpacing:"0.14em",animation:"shimmer 1.5s ease infinite"}}>Cargando...</span></div>}
                {mapTab==="globe"?<Globe sat={sat} pos={pos}/>:<ChileMap sat={sat} pos={pos}/>}
              </div>

              {/* Live data */}
              {pos && (
                <div style={{borderRadius:16,padding:"15px 17px",...glass({}),transition:"all 0.6s",border:`1px solid ${sat.color}18`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
                    <span style={{display:"block",width:5,height:5,borderRadius:"50%",background:sat.color,boxShadow:`0 0 8px ${sat.color}`,animation:"livePulse 2.2s infinite"}}/>
                    <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.22em",color:sat.color,textTransform:"uppercase"}}>Posición en vivo</span>
                    <span style={{marginLeft:"auto",fontSize:8,color:"rgba(255,255,255,0.15)",fontFamily:"monospace"}}>↻ 5s</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[
                      ["Latitud",`${Math.abs(pos.lat).toFixed(2)}° ${pos.lat>=0?"N":"S"}`],
                      ["Longitud",`${Math.abs(pos.lon).toFixed(2)}° ${pos.lon>=0?"E":"O"}`],
                      ["Altitud",`${pos.alt_km} km`],
                      ["Distancia",`${pos.distance_km?.toLocaleString()} km`],
                      ["Elevación",`${pos.elevation_from_santiago}°`],
                      ["Azimut",`${pos.azimuth_from_santiago}° ${azLabel(pos.azimuth_from_santiago)}`],
                    ].map(([l,v])=>(
                      <div key={l} style={{padding:"8px 10px",borderRadius:10,background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.04)"}}>
                        <div style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
                        <div style={{fontSize:12,fontFamily:"'IBM Plex Mono',monospace",color:"#F0F4F8",fontWeight:500}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:9,padding:"8px 12px",borderRadius:10,background:pos.visible_from_santiago?sat.color+"0B":"rgba(0,0,0,0.3)",border:`1px solid ${pos.visible_from_santiago?sat.color+"22":"rgba(255,255,255,0.04)"}`}}>
                    <span style={{fontSize:10,color:pos.visible_from_santiago?sat.color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace"}}>
                      {pos.visible_from_santiago?"✓ Sobre el horizonte de Santiago":"○ Bajo el horizonte de Santiago"}
                    </span>
                  </div>
                </div>
              )}

              {/* Ficha Técnica — solo desktop, en mobile aparece arriba fuera del grid */}
              <div className="ficha-desktop" style={{borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                <button onClick={()=>setFichaOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"13px 0",cursor:"pointer",background:"none",border:"none",textAlign:"left"}}>
                  <span style={{fontSize:16}}>{sat.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#fff"}}>
                      <span style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontWeight:400,color:sat.color,transition:"color 0.6s"}}>{sat.name}</span>
                      {" "}— Ficha técnica
                    </div>
                    <div style={{fontSize:8,color:"rgba(255,255,255,0.2)",marginTop:2,fontFamily:"'IBM Plex Mono',monospace"}}>{sat.full}</div>
                  </div>
                  <span style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:fichaOpen?sat.color:"rgba(255,255,255,0.25)",border:`1px solid ${fichaOpen?sat.color+"40":"rgba(255,255,255,0.1)"}`,borderRadius:8,padding:"3px 8px",background:fichaOpen?sat.color+"0C":"rgba(255,255,255,0.02)",transition:"all 0.25s",flexShrink:0}}>
                    {fichaOpen?"▲":"▼"}
                  </span>
                </button>
                {fichaOpen&&(
                  <div style={{animation:"fadeUp 0.25s ease both",paddingBottom:14}}>
                    <div style={{borderRadius:12,overflow:"hidden",marginBottom:12,border:`1px solid ${sat.color}15`,position:"relative"}}>
                      <img src={sat.photo} alt={sat.name} style={{width:"100%",height:150,objectFit:"cover",opacity:0.78,display:"block"}} onError={e=>{e.target.parentElement.style.display="none";}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)"}}/>
                    </div>
                    <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",lineHeight:1.72,fontWeight:300,marginBottom:12}}>{sat.desc}</p>
                    <div style={{borderRadius:12,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",...glass({}),marginBottom:10}}>
                      {sat.specs.map(([l,v],i)=>(
                        <div key={l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:i%2===0?"transparent":"rgba(255,255,255,0.012)",borderBottom:i<sat.specs.length-1?"1px solid rgba(255,255,255,0.035)":"none"}}>
                          <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{l}</span>
                          <span style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.7)",fontWeight:500,textAlign:"right",maxWidth:"58%"}}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <a href={`https://www.n2yo.com/satellite/?s=${sat.norad}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:9,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",textDecoration:"none",padding:"5px 10px",borderRadius:8,background:"rgba(87,199,255,0.06)",border:"1px solid rgba(87,199,255,0.16)",letterSpacing:"0.06em"}}>
                        Ver en N2YO.com →
                      </a>
                      {sat.chilean&&<span style={{fontSize:9,color:"#C47B48",fontFamily:"'IBM Plex Mono',monospace",padding:"5px 10px",borderRadius:8,background:"rgba(196,123,72,0.06)",border:"1px solid rgba(196,123,72,0.16)",letterSpacing:"0.06em"}}>🇨🇱 Fabricación chilena</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats pills */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[[future.length,"Pases",sat.color],[future.filter(p=>p.visible).length,"Visibles","#4ade80"]].map(([v,l,c])=>(
                  <div key={l} style={{borderRadius:14,padding:"13px 15px",...glass({})}}>
                    <div style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
                    <div style={{fontSize:28,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:c,transition:"color 0.6s"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── COL 2: Passes ── */}
            <div>
              {/* Section toggle — solo visible en desktop */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",gap:6}} className="section-tabs-desktop">
                  {[["passes","Pases"],["news","Noticias"]].map(([id,label])=>(
                    <button key={id} onClick={()=>setActiveSection(id)}
                      style={pill(activeSection===id, sat.color)}>
                      {label}
                    </button>
                  ))}
                </div>

                {activeSection==="passes" && (
                  <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
                    {/* Alert button */}
                    <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 11px",borderRadius:99,...glass({}),border:`1px solid ${alertsEnabled?"#22c55e2A":"rgba(255,255,255,0.07)"}`,transition:"all 0.3s"}}>
                      <button onClick={requestAlerts} style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:alertsEnabled?"#4ade80":alertPermission==="denied"?"#f87171":"rgba(255,255,255,0.3)",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:5}}>
                        <span>{alertsEnabled?"🔔":"🔕"}</span>
                        <span>{alertPermission==="denied"?"BLOQUEADO":alertsEnabled?"ALERTAS ON":"ALERTAS"}</span>
                      </button>
                      {alertsEnabled&&(
                        <div style={{display:"flex",alignItems:"center",gap:4,borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:6}}>
                          {[5,10,15,30].map(m=>(
                            <button key={m} onClick={()=>setAlertMinutes(m)} style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",padding:"2px 6px",borderRadius:5,background:alertMinutes===m?"#22c55e14":"transparent",color:alertMinutes===m?"#4ade80":"rgba(255,255,255,0.25)",border:`1px solid ${alertMinutes===m?"#22c55e28":"transparent"}`,cursor:"pointer",transition:"all 0.15s"}}>
                              {m}m
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={()=>setOnlyVis(!onlyVis)} style={pill(onlyVis,"#22c55e")}>
                      {onlyVis?"● VISIBLES":"TODOS"}
                    </button>
                  </div>
                )}
              </div>

              {/* Section header label */}
              {activeSection==="passes" && (
                <div style={{marginBottom:16}}>
                  <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,letterSpacing:"-0.02em",color:"#fff",lineHeight:1.2}}>
                    Pases de{" "}
                    <span style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontWeight:400,color:sat.color,transition:"color 0.6s"}}>{sat.name}</span>
                  </h2>
                  <div style={{fontSize:9.5,color:"rgba(255,255,255,0.2)",marginTop:4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.04em"}}>Santiago · próximos 3 días · elevación mín. 10°</div>
                </div>
              )}

              {activeSection==="news" && (
                <div style={{marginBottom:16}}>
                  <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,letterSpacing:"-0.02em",color:"#fff",lineHeight:1.2}}>
                    Noticias{" "}
                    <span style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontWeight:400,color:"#57C7FF"}}>espaciales</span>
                  </h2>
                  <div style={{fontSize:9.5,color:"rgba(255,255,255,0.2)",marginTop:4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.04em"}}>Spaceflight News API · actualizadas diariamente</div>
                </div>
              )}

              {/* PASSES SECTION */}
              {activeSection==="passes" && (
                <>
                  {loading&&<div style={{padding:52,textAlign:"center"}}><div style={{fontSize:24,marginBottom:12,display:"inline-block",animation:"spinSlow 3s linear infinite"}}>🛰</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:sat.color,letterSpacing:"0.14em"}}>Calculando pases reales...</div></div>}
                  {error&&<div style={{padding:32,textAlign:"center",border:"1px dashed rgba(244,63,94,0.2)",borderRadius:16,background:"rgba(244,63,94,0.04)"}}><div style={{fontSize:22,marginBottom:10}}>⚠️</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#f87171"}}>{error}</div></div>}
                  {!loading&&!error&&shown.map((p,i)=><PassCard key={i} pass={p} sat={sat} isNext={i===0}/>)}
                  {!loading&&!error&&shown.length===0&&<div style={{padding:48,textAlign:"center",border:"1px dashed rgba(255,255,255,0.05)",borderRadius:16}}><div style={{fontSize:24,marginBottom:10}}>🌑</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:"rgba(255,255,255,0.15)",letterSpacing:"0.1em"}}>Sin pases en los próximos 3 días</div></div>}
                </>
              )}

              {/* NEWS SECTION (mobile fallback — also primary on md) */}
              {activeSection==="news" && (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
                  {newsLoading&&<div style={{padding:36,textAlign:"center",gridColumn:"1/-1"}}><div style={{fontSize:20,marginBottom:10}}>📡</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#57C7FF",letterSpacing:"0.12em"}}>Cargando noticias...</div></div>}
                  {!newsLoading&&news.length===0&&<div style={{padding:36,textAlign:"center",border:"1px dashed rgba(255,255,255,0.05)",borderRadius:14,gridColumn:"1/-1"}}><div style={{fontSize:20,marginBottom:8}}>📭</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.15)"}}>Sin noticias disponibles</div></div>}
                  {!newsLoading&&news.map((a,i)=>(
                    <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",borderRadius:16,overflow:"hidden",...glass({}),transition:"border-color 0.2s"}}>
                      {a.image&&<div style={{height:130,overflow:"hidden"}}><img src={a.image} alt={a.title} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.75}} onError={e=>{e.target.parentElement.style.display="none";}}/></div>}
                      <div style={{padding:"13px 15px"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,marginBottom:8}}>
                          <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.12em",padding:"2px 7px",borderRadius:4,background:"rgba(87,199,255,0.08)",color:"#57C7FF",border:"1px solid rgba(87,199,255,0.15)"}}>{(a.source||"SPACE").toUpperCase()}</span>
                          <span style={{fontSize:8,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace"}}>{a.published}</span>
                        </div>
                        <div style={{fontSize:12.5,fontWeight:500,color:"rgba(255,255,255,0.8)",lineHeight:1.45,letterSpacing:"-0.01em",marginBottom:7}}>{a.title}</div>
                        {a.summary&&<div style={{fontSize:11,color:"rgba(255,255,255,0.3)",lineHeight:1.65,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.summary}</div>}
                        <div style={{marginTop:9,fontSize:9.5,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em"}}>Leer más →</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* ── COL 3: Observation sidebar (desktop only) ── */}
            <div className="news-col">
              <ObservationSidebar
                sat={sat}
                next={next}
                userLat={userCity !== "tu ciudad" ? undefined : SANTIAGO.lat}
                userLon={userCity !== "tu ciudad" ? undefined : SANTIAGO.lon}
              />
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{height:1,background:`linear-gradient(90deg,transparent,${sat.color}28,transparent)`,transition:"background 0.6s"}}/>
          <div style={{padding:"16px 0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              {!logoError
                ?<img src="/logo.png" onError={()=>setLogoError(true)} alt="Austral Orbit" style={{height:26,width:"auto",objectFit:"contain",opacity:0.4,filter:"brightness(2)"}}/>
                :<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:"rgba(255,255,255,0.1)",letterSpacing:"0.18em"}}>AUSTRAL ORBIT</span>
              }
              <div style={{fontSize:7.5,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em"}}>Owner: Joaquín Valdebenito Palma</div>
            </div>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",textAlign:"right",letterSpacing:"0.08em"}}>Powered by Skyfield · CelesTrak · Spaceflight News API</div>
          </div>
        </div>
      </div>

      {/* Notif banner */}
      {!notifDismissed && <NotifBanner next={notifNext} sat={sat} onDismiss={() => setNotifDismissed(true)} />}
    </>
  );
}