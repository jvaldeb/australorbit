import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   SATELLITE REGISTRY
───────────────────────────────────────────── */
const SATS = [
  { id:"ISS", name:"ISS", full:"Estación Espacial Internacional", color:"#57C7FF", chilean:false, flag:null, icon:"🏗️",
    desc:"Hogar permanente de astronautas desde el año 2000. Cruza Chile múltiples veces al día a 400 km de altitud.",
    orbit:"400 km", speed:"27,600 km/h",
    norad:25544,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/International_Space_Station_after_undocking_of_STS-132.jpg/1280px-International_Space_Station_after_undocking_of_STS-132.jpg",
    specs:[
      ["NORAD ID","25544"],["Lanzamiento","20 Nov 1998"],["Agencia","NASA / ESA / Roscosmos"],
      ["Masa","420,000 kg"],["Tamaño","109 × 73 m"],["Inclinación","51.6°"],
      ["Período orbital","92.9 min"],["Tripulación","6–7 personas"],["Tipo","Estación espacial"],
    ]},
  { id:"HST", name:"Hubble", full:"Telescopio Espacial Hubble", color:"#7DD9A8", chilean:false, flag:null, icon:"🔭",
    desc:"Más de 30 años fotografiando el universo desde 540 km. Ha producido sobre 1.5 millones de observaciones científicas.",
    orbit:"540 km", speed:"27,300 km/h",
    norad:20580,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HST-SM4.jpeg/1280px-HST-SM4.jpeg",
    specs:[
      ["NORAD ID","20580"],["Lanzamiento","24 Abr 1990"],["Agencia","NASA / ESA"],
      ["Masa","11,110 kg"],["Diámetro espejo","2.4 m"],["Inclinación","28.5°"],
      ["Período orbital","95.4 min"],["Observaciones","+1.5 millones"],["Tipo","Telescopio espacial"],
    ]},
  { id:"TIANGONG", name:"Tiangong", full:"Estación Espacial China", color:"#F5C47A", chilean:false, flag:"🇨🇳", icon:"🏮",
    desc:"Estación espacial modular china en expansión activa desde 2021. Módulo central Tianhe lanzado en abril de ese año.",
    orbit:"390 km", speed:"27,700 km/h",
    norad:48274,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Tiangong_space_station_2022.jpg/1280px-Tiangong_space_station_2022.jpg",
    specs:[
      ["NORAD ID","48274"],["Lanzamiento","29 Abr 2021"],["Agencia","CNSA"],
      ["Masa","~100,000 kg"],["Módulos","3 (Tianhe + Wentian + Mengtian)"],["Inclinación","41.5°"],
      ["Período orbital","91.6 min"],["Tripulación","3 personas"],["Tipo","Estación espacial"],
    ]},
  { id:"SSOT", name:"SSOT", full:"Satélite Chileno de Observación", color:"#C47B48", chilean:true, flag:"🇨🇱", icon:"📡",
    desc:"Primer satélite de observación de Chile. Lanzado en 2011, captura imágenes de 1.45 m de resolución para cartografía y emergencias.",
    orbit:"628 km", speed:"27,200 km/h",
    norad:38011,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
    specs:[
      ["NORAD ID","38011"],["Lanzamiento","16 Dic 2011"],["Agencia","FACH / EADS Astrium"],
      ["Masa","~150 kg"],["Resolución","1.45 m"],["Inclinación","97.8°"],
      ["Período orbital","97.1 min"],["Tipo","Observación terrestre"],["País","🇨🇱 Chile"],
    ]},
  { id:"LEMU", name:"LEMU NGE", full:"Primer Satélite Privado Chileno", color:"#6EE7B7", chilean:true, flag:"🇨🇱", icon:"🌲",
    desc:"Primer satélite privado chileno. Lanzado por SpaceX en agosto 2024. Monitorea biodiversidad con cámara hiperespectral.",
    orbit:"550 km", speed:"27,400 km/h",
    norad:60532,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/SpaceX_Transporter-11_mission_patch.png/800px-SpaceX_Transporter-11_mission_patch.png",
    specs:[
      ["NORAD ID","60532"],["Lanzamiento","16 Ago 2024"],["Empresa","Lemu (Chile)"],
      ["Tipo sat.","CubeSat 6U"],["Sensor","Cámara hiperespectral"],["Inclinación","97.5°"],
      ["Período orbital","95.6 min"],["Misión","Monitoreo biodiversidad"],["País","🇨🇱 Chile"],
    ]},
  { id:"SUCHAI2", name:"SUCHAI-2", full:"CubeSat Universidad de Chile", color:"#A78BFA", chilean:true, flag:"🇨🇱", icon:"🔬",
    desc:"CubeSat científico desarrollado en la Universidad de Chile. Experimentos de plasma ionosférico en órbita baja.",
    orbit:"550 km", speed:"27,400 km/h",
    norad:57757,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    specs:[
      ["NORAD ID","57757"],["Lanzamiento","12 Ene 2023"],["Universidad","U. de Chile"],
      ["Tipo sat.","CubeSat 3U"],["Masa","~3 kg"],["Inclinación","97.5°"],
      ["Período orbital","95.6 min"],["Misión","Plasma ionosférico"],["País","🇨🇱 Chile"],
    ]},
  { id:"SUCHAI3", name:"SUCHAI-3", full:"CubeSat Universidad de Chile", color:"#F472B6", chilean:true, flag:"🇨🇱", icon:"🌿",
    desc:"Tercer CubeSat chileno. Monitoreo forestal y medioambiental desde órbita polar sincrónica al sol.",
    orbit:"550 km", speed:"27,400 km/h",
    norad:57758,
    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
    specs:[
      ["NORAD ID","57758"],["Lanzamiento","12 Ene 2023"],["Universidad","U. de Chile"],
      ["Tipo sat.","CubeSat 3U"],["Masa","~3 kg"],["Inclinación","97.5°"],
      ["Período orbital","95.6 min"],["Misión","Monitoreo forestal"],["País","🇨🇱 Chile"],
    ]},
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
    <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: 420, filter: "drop-shadow(0 0 60px rgba(87,199,255,0.08))" }}>
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
          <stop offset="0%"   stopColor={sat.color + "18"} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <clipPath id="planetClip"><circle cx={cx} cy={cy} r={R} /></clipPath>
        <filter id="satGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* ambient glow */}
      <ellipse cx={cx} cy={cy} rx="180" ry="180" fill="url(#glowGrad)">
        <animate attributeName="rx" values="170;185;170" dur="8s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="170;185;170" dur="8s" repeatCount="indefinite"/>
      </ellipse>

      {/* back orbit halves */}
      {orbits.map((o, i) => (
        <ellipse key={`ob${i}`}
          cx={cx} cy={cy} rx={o.rx} ry={o.ry}
          fill="none" stroke={o.color + "20"} strokeWidth="0.8"
          transform={`rotate(${o.tilt} ${cx} ${cy})`}
        />
      ))}

      {/* planet body */}
      <circle cx={cx} cy={cy} r={R + 12} fill="url(#atmosGrad)" />
      <circle cx={cx} cy={cy} r={R}      fill="url(#planetGrad)" />

      {/* subtle land masses */}
      <g clipPath="url(#planetClip)" opacity="0.4">
        <path d="M155,178 Q162,170 175,173 Q185,176 188,185 Q182,195 170,192 Q158,190 155,178Z" fill="#0A2040" />
        <path d="M185,165 Q196,158 208,162 Q215,170 210,180 Q200,184 192,178 Q185,172 185,165Z" fill="#0A2040" />
        <path d="M168,195 Q178,190 190,198 Q193,208 184,213 Q174,212 168,204Z" fill="#0A2040" />
        <path d="M205,185 Q218,180 228,188 Q232,198 222,203 Q212,204 206,196Z" fill="#0A2040" />
      </g>

      {/* atmosphere ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={sat.color + "35"} strokeWidth="3" />
      <circle cx={cx} cy={cy} r={R + 6} fill="none" stroke={sat.color + "10"} strokeWidth="4" />

      {/* Santiago dot */}
      <circle cx={cx - 22} cy={cy + 18} r="3" fill="#ff4d6d" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx - 22} cy={cy + 18} r="8" fill="none" stroke="#ff4d6d" strokeWidth="0.8" opacity="0.35"/>

      {/* animated satellites on orbits */}
      {orbits.map((o, i) => {
        const id = `sat${i}`;
        const dur = `${o.period}s`;
        const ang = i * 120;
        const rx = o.rx, ry = o.ry;
        const x = cx + rx * Math.cos(d2r(ang));
        const y = cy + ry * Math.sin(d2r(ang));
        return (
          <g key={id} transform={`rotate(${o.tilt} ${cx} ${cy})`}>
            <circle cx={x} cy={y} r={o.r} fill={o.color} filter="url(#satGlow)">
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`}
                dur={dur} repeatCount="indefinite"/>
            </circle>
            <circle cx={x} cy={y} r={o.r * 2.5} fill="none" stroke={o.color + "40"} strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`}
                dur={dur} repeatCount="indefinite"/>
            </circle>
          </g>
        );
      })}

      {/* live label */}
      {pos?.visible_from_santiago && (
        <g>
          <rect x="130" y="340" width="140" height="24" rx="12"
            fill={sat.color + "18"} stroke={sat.color + "55"} strokeWidth="0.8"/>
          <text x="200" y="356" textAnchor="middle" fontSize="9"
            fill={sat.color} fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.12em">
            ● VISIBLE SOBRE SANTIAGO
          </text>
        </g>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   GLOBE (sidebar)
───────────────────────────────────────────── */
function Globe({ sat, pos }) {
  const W = 290, H = 290, R = 124, cx = 145, cy = 145, cLat = -20, cLon = -70;
  function proj(lat, lon) {
    const φ = d2r(lat), λ = d2r(lon), φ0 = d2r(cLat), λ0 = d2r(cLon);
    const c = Math.sin(φ0)*Math.sin(φ) + Math.cos(φ0)*Math.cos(φ)*Math.cos(λ-λ0);
    if (c < 0) return null;
    return [cx + R*Math.cos(φ)*Math.sin(λ-λ0), cy - R*(Math.cos(φ0)*Math.sin(φ) - Math.sin(φ0)*Math.cos(φ)*Math.cos(λ-λ0))];
  }
  const sLat = pos?.lat ?? 0, sLon = pos?.lon ?? 0, alt = pos?.alt_km ?? 400;
  const sXY = proj(sLat, sLon);
  const sPt = proj(SANTIAGO.lat, SANTIAGO.lon);
  const vr = visRadius(alt);
  const vc = Array.from({length:60},(_,i)=>{
    const a=(i/60)*2*Math.PI, vl=sLat+vr*Math.cos(a), vlo=sLon+(vr/Math.cos(d2r(sLat)))*Math.sin(a);
    return proj(Math.max(-90,Math.min(90,vl)),((vlo+180)%360)-180);
  }).filter(Boolean);
  const grid=[];
  for(let la=-80;la<=80;la+=20){const pts=[];for(let lo=-180;lo<=180;lo+=3){const xy=proj(la,lo);if(xy)pts.push(xy);else if(pts.length>1){grid.push([...pts]);pts.length=0;}}if(pts.length>1)grid.push(pts);}
  for(let lo=-180;lo<=180;lo+=20){const pts=[];for(let la=-90;la<=90;la+=3){const xy=proj(la,lo);if(xy)pts.push(xy);else if(pts.length>1){grid.push([...pts]);pts.length=0;}}if(pts.length>1)grid.push(pts);}
  const sa=[[-17,-72],[-10,-62],[-3,-43],[-5,-35],[-12,-37],[-18,-40],[-23,-43],[-28,-49],[-33,-52],[-38,-58],[-42,-64],[-46,-65],[-52,-69],[-55,-68],[-55,-65],[-52,-73],[-48,-75],[-42,-73],[-35,-72],[-27,-70],[-18,-70],[-12,-77],[-3,-80],[5,-77],[10,-75],[12,-72],[-17,-72]];
  const tp=pts=>pts.filter(Boolean).map((p,i)=>`${i===0?"M":"L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const track=groundTrack(sLat,sLon,51.6,92);
  const segs=[];let seg=[];
  for(const pt of track){const xy=proj(pt.lat,pt.lon);if(!xy){if(seg.length>1)segs.push({pts:seg});seg=[];continue;}seg.push({xy,past:pt.past});}
  if(seg.length>1)segs.push({pts:seg});
  const gid=`gl${sat.id}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W}}>
      <defs>
        <radialGradient id={`gb${gid}`} cx="38%" cy="32%">
          <stop offset="0%" stopColor="#0C1E38"/>
          <stop offset="100%" stopColor="#030A14"/>
        </radialGradient>
        <radialGradient id={`ga${gid}`} cx="50%" cy="50%">
          <stop offset="80%" stopColor="transparent"/>
          <stop offset="100%" stopColor={sat.color+"28"}/>
        </radialGradient>
        <clipPath id={`gc${gid}`}><circle cx={cx} cy={cy} r={R}/></clipPath>
        <filter id={`gg${gid}`}><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx={cx} cy={cy} r={R+16} fill={`url(#ga${gid})`}/>
      <circle cx={cx} cy={cy} r={R} fill={`url(#gb${gid})`} stroke={sat.color+"28"} strokeWidth="1"/>
      <g clipPath={`url(#gc${gid})`}>
        {grid.map((pts,i)=><polyline key={i} points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke="#0C2040" strokeWidth="0.5" opacity="0.9"/>)}
        <path d={tp(sa.map(([la,lo])=>proj(la,lo)))} fill="#091C34" stroke="#183660" strokeWidth="1"/>
        {vc.length>3&&<polygon points={vc.map(p=>p.join(",")).join(" ")} fill={sat.color+"10"} stroke={sat.color+"38"} strokeWidth="1" strokeDasharray="4 4"/>}
        {segs.map((s,i)=><polyline key={i} points={s.pts.map(p=>p.xy.join(",")).join(" ")} fill="none" stroke={sat.color} strokeWidth="1.6" opacity={0.88}/>)}
        {sPt&&<><circle cx={sPt[0]} cy={sPt[1]} r="8" fill="none" stroke="#ff4d6d" strokeWidth="0.8" opacity="0.35"/><circle cx={sPt[0]} cy={sPt[1]} r="2.5" fill="#ff4d6d"/><text x={sPt[0]+7} y={sPt[1]-5} fontSize="7.5" fill="#ff4d6d" fontFamily="'IBM Plex Mono',monospace">Santiago</text></>}
        {sXY&&<><circle cx={sXY[0]} cy={sXY[1]} r="20" fill={sat.color+"0a"}/><circle cx={sXY[0]} cy={sXY[1]} r="7" fill={sat.color} filter={`url(#gg${gid})`}/><circle cx={sXY[0]} cy={sXY[1]} r="13" fill="none" stroke={sat.color} strokeWidth="1" opacity="0.4"/><text x={sXY[0]+13} y={sXY[1]-9} fontSize="8" fill={sat.color} fontFamily="'IBM Plex Mono',monospace" fontWeight="600">{sat.name}</text></>}
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={sat.color+"28"} strokeWidth="1"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   CHILE MAP
───────────────────────────────────────────── */
function ChileMap({ sat, pos }) {
  const W=255,H=385,latMin=-56,latMax=-17,lonMin=-76,lonMax=-64;
  const proj=(la,lo)=>[((lo-lonMin)/(lonMax-lonMin))*(W-40)+20,((latMax-la)/(latMax-latMin))*(H-40)+20];
  const sLat=pos?.lat??0,sLon=pos?.lon??0,alt=pos?.alt_km??400;
  const sXY=proj(sLat,sLon),stXY=proj(SANTIAGO.lat,SANTIAGO.lon);
  const inView=pos?.visible_from_santiago??false;
  const vr=visRadius(alt);
  const vc=Array.from({length:72},(_,i)=>{const a=(i/72)*2*Math.PI;return proj(sLat+vr*Math.cos(a),sLon+(vr/Math.cos(d2r(sLat)))*Math.sin(a));});
  const chile=[[-17.5,-70],[-18,-70.3],[-20,-70.1],[-22,-70.1],[-24,-70.6],[-26,-70.8],[-28,-71.3],[-30,-71.5],[-32,-71.7],[-33.4,-71.8],[-35,-72],[-37,-73.5],[-38,-73.5],[-40,-73.5],[-42,-73.5],[-44,-75],[-46,-75],[-48,-75.5],[-50,-75],[-52,-74],[-53,-70.9],[-54,-69],[-55,-68],[-55,-65],[-53,-63],[-51,-59],[-49,-57],[-47,-65],[-44,-66],[-41,-62],[-38,-58],[-36,-57],[-33,-52],[-30,-51],[-27,-50],[-24,-67],[-22,-68],[-20,-70],[-17.5,-70]];
  const cities=[{name:"Santiago",lat:-33.45,lon:-70.67,main:true},{name:"Valparaíso",lat:-33.05,lon:-71.6},{name:"Concepción",lat:-36.82,lon:-73.05},{name:"Antofagasta",lat:-23.65,lon:-70.4},{name:"Pto. Montt",lat:-41.47,lon:-72.94}];
  const trk=groundTrack(sLat,sLon,97,95,120,0.3).filter(p=>p.lat>=latMin-5&&p.lat<=latMax+5&&p.lon>=lonMin-3&&p.lon<=lonMax+3);
  const gid=`cm${sat.id}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W}}>
      <defs>
        <radialGradient id={`cb${gid}`}><stop offset="0%" stopColor="#091828"/><stop offset="100%" stopColor="#030810"/></radialGradient>
        <filter id={`cs${gid}`}><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id={`cc${gid}`}><rect width={W} height={H}/></clipPath>
      </defs>
      <rect width={W} height={H} rx="10" fill={`url(#cb${gid})`}/>
      <g clipPath={`url(#cc${gid})`}>
        {[-70,-65,-60,-55,-50,-45,-40,-35,-30,-25,-20].map(la=>{const[,y]=proj(la,lonMin);return y>=0&&y<=H?<line key={la} x1="0" y1={y} x2={W} y2={y} stroke="#0C2040" strokeWidth="0.5" strokeDasharray="3 6"/>:null;})}
        {[-75,-70,-65].map(lo=>{const[x]=proj(latMin,lo);return x>=0&&x<=W?<line key={lo} x1={x} y1="0" x2={x} y2={H} stroke="#0C2040" strokeWidth="0.5" strokeDasharray="3 6"/>:null;})}
        <polygon points={chile.map(([la,lo])=>proj(la,lo).join(",")).join(" ")} fill="#091C34" stroke="#183660" strokeWidth="1.2"/>
        <polygon points={vc.map(p=>p.join(",")).join(" ")} fill={sat.color+"12"} stroke={sat.color+"50"} strokeWidth="1.4" strokeDasharray="5 4"/>
        {inView&&<line x1={sXY[0]} y1={sXY[1]} x2={stXY[0]} y2={stXY[1]} stroke={sat.color} strokeWidth="1" strokeDasharray="4 4" opacity="0.55"/>}
        {trk.length>1&&trk.map((pt,i)=>{if(!i)return null;const pv=trk[i-1],a=proj(pv.lat,pv.lon),b=proj(pt.lat,pt.lon);return<line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={sat.color} strokeWidth={pt.past?1:1.8} opacity={pt.past?0.18:0.82}/>;},)}
        {cities.map(c=>{const[cx2,cy2]=proj(c.lat,c.lon);if(cx2<-5||cx2>W+5||cy2<-5||cy2>H+5)return null;return<g key={c.name}><circle cx={cx2} cy={cy2} r={c.main?3.5:2.2} fill={c.main?"#ff4d6d":"#2D5070"}/>{c.main&&<circle cx={cx2} cy={cy2} r="8" fill="none" stroke="#ff4d6d" strokeWidth="0.7" opacity="0.3"/>}<text x={cx2+7} y={cy2+4} fontSize={c.main?8:7} fill={c.main?"#ff4d6d":"#2D5070"} fontFamily="'IBM Plex Mono',monospace">{c.name}</text></g>;})}
        {sXY[0]>-30&&sXY[0]<W+30&&sXY[1]>-30&&sXY[1]<H+30&&<><circle cx={sXY[0]} cy={sXY[1]} r="20" fill={sat.color+"0d"}/><circle cx={sXY[0]} cy={sXY[1]} r="8" fill={sat.color} filter={`url(#cs${gid})`}/><circle cx={sXY[0]} cy={sXY[1]} r="14" fill="none" stroke={sat.color} strokeWidth="1" opacity="0.38"/><text x={sXY[0]+15} y={sXY[1]-11} fontSize="8" fill={sat.color} fontFamily="'IBM Plex Mono',monospace" fontWeight="600">{sat.name}</text></>}
      </g>
      <text x="12" y="22" fontSize="7.5" fill={inView?sat.color:"#2D5070"} fontFamily="'IBM Plex Mono',monospace" letterSpacing="0.1em">
        {inView?"✓ EN RANGO DE SANTIAGO":"○ FUERA DE RANGO"}
      </text>
    </svg>
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
    <svg viewBox="0 0 216 216" style={{width:"100%",maxWidth:185}}>
      <circle cx={cx} cy={cy} r={R+5} fill="#05080E" stroke="#0C2040" strokeWidth="1"/>
      {[30,60,90].map(r=><circle key={r} cx={cx} cy={cy} r={R*r/90} fill="none" stroke="#0C2040" strokeWidth="0.7" strokeDasharray="2 4"/>)}
      {[0,90,180,270].map(a=>{const rad=(a-90)*Math.PI/180;return<line key={a} x1={cx+7*Math.cos(rad)} y1={cy+7*Math.sin(rad)} x2={cx+R*Math.cos(rad)} y2={cy+R*Math.sin(rad)} stroke="#0C2040" strokeWidth="0.7"/>;},)}
      {[["N",0],["E",90],["S",180],["O",270]].map(([l,a])=>{const rad=(a-90)*Math.PI/180;return<text key={l} x={cx+(R+13)*Math.cos(rad)} y={cy+(R+13)*Math.sin(rad)} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#1E4060" fontFamily="'IBM Plex Mono',monospace" fontWeight="600">{l}</text>;})}
      <path d={d} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" opacity="0.08"/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.92"/>
      <circle cx={pts[0][0]} cy={pts[0][1]} r="4" fill="#22c55e"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill="#ef4444"/>
      <circle cx={mx} cy={my} r="5.5" fill={color}/>
      <circle cx={mx} cy={my} r="11" fill="none" stroke={color} strokeWidth="1" opacity="0.35"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   LIVE DATA PANEL
───────────────────────────────────────────── */
function LivePanel({ pos, sat }) {
  if (!pos) return null;
  return (
    <div style={{borderRadius:14,padding:"16px 18px",background:`linear-gradient(145deg,${sat.color}09,rgba(3,8,20,0.55))`,border:`1px solid ${sat.color}1E`,backdropFilter:"blur(10px)",transition:"all 0.6s"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <span style={{display:"block",width:5,height:5,borderRadius:"50%",background:sat.color,boxShadow:`0 0 8px ${sat.color}`,animation:"livePulse 2.2s infinite"}}/>
        <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.22em",color:sat.color,textTransform:"uppercase"}}>Posición en vivo</span>
        <span style={{marginLeft:"auto",fontSize:8,color:"#1E3A50",fontFamily:"monospace"}}>↻ 5s</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
        {[
          ["Latitud",   `${Math.abs(pos.lat).toFixed(2)}° ${pos.lat>=0?"N":"S"}`],
          ["Longitud",  `${Math.abs(pos.lon).toFixed(2)}° ${pos.lon>=0?"E":"O"}`],
          ["Altitud",   `${pos.alt_km} km`],
          ["Distancia", `${pos.distance_km?.toLocaleString()} km`],
          ["Elevación", `${pos.elevation_from_santiago}°`],
          ["Azimut",    `${pos.azimuth_from_santiago}° ${azLabel(pos.azimuth_from_santiago)}`],
        ].map(([l,v])=>(
          <div key={l} style={{padding:"9px 11px",borderRadius:9,background:"rgba(3,8,20,0.55)",border:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
            <div style={{fontSize:12.5,fontFamily:"'IBM Plex Mono',monospace",color:"#F0F4F8",fontWeight:500,letterSpacing:"0.02em"}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,padding:"9px 12px",borderRadius:9,background:pos.visible_from_santiago?sat.color+"0c":"rgba(3,8,20,0.4)",border:`1px solid ${pos.visible_from_santiago?sat.color+"2A":"rgba(255,255,255,0.04)"}`}}>
        <span style={{fontSize:10.5,color:pos.visible_from_santiago?sat.color:"#1E3A50",fontFamily:"'IBM Plex Mono',monospace"}}>
          {pos.visible_from_santiago?"✓ Sobre el horizonte de Santiago":"○ Bajo el horizonte de Santiago"}
        </span>
      </div>
    </div>
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
  const qc = pass.max_el >= 60 ? "#34d399"  : pass.max_el >= 30 ? "#fbbf24" : "#334155";
  const dur= `${Math.floor(pass.duration/60)}m ${pass.duration%60}s`;
  return (
    <div onClick={()=>setOpen(!open)} style={{background:open?"rgba(255,255,255,0.025)":"rgba(255,255,255,0.014)",border:`1px solid ${isNext?sat.color+"3A":"rgba(255,255,255,0.055)"}`,borderLeft:`2px solid ${isNext?sat.color:"transparent"}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",transition:"all 0.2s",marginBottom:7,backdropFilter:"blur(8px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{minWidth:76}}>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:23,fontWeight:600,color:"#F0F4F8",letterSpacing:"-0.01em"}}>{fmtTime(pass.rise)}</div>
          <div style={{fontSize:9.5,color:"#334155",marginTop:2,fontFamily:"'IBM Plex Mono',monospace"}}>{fmtDate(pass.rise)}</div>
        </div>
        <div style={{display:"flex",gap:5,flex:1,flexWrap:"wrap",alignItems:"center"}}>
          {isNext&&<span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.15em",padding:"3px 8px",borderRadius:20,background:sat.color+"16",color:sat.color,border:`1px solid ${sat.color}3A`}}>PRÓXIMO</span>}
          {pass.visible&&<span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",padding:"3px 8px",borderRadius:20,background:"#22c55e10",color:"#4ade80",border:"1px solid #22c55e28"}}>● VISIBLE</span>}
          <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",padding:"3px 8px",borderRadius:20,background:qc+"10",color:qc,border:`1px solid ${qc}28`}}>{q} {pass.max_el}°</span>
        </div>
        <div style={{textAlign:"right"}}>
          {isNext&&cd
            ?<div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:18,fontWeight:600,color:sat.color,letterSpacing:"0.06em"}}>{cd}</div>
            :<div style={{fontSize:12.5,color:sat.color,fontFamily:"'IBM Plex Mono',monospace",fontWeight:500}}>{timeUntil(pass.rise)}</div>
          }
          <div style={{fontSize:9.5,color:"#1E3A50",marginTop:2,fontFamily:"monospace"}}>{dur}</div>
        </div>
        <span style={{color:"#1E3A50",fontSize:11}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.045)",display:"grid",gridTemplateColumns:"188px 1fr",gap:20}}>
          <SkyDiagram pass={pass} color={sat.color}/>
          <div style={{display:"flex",flexDirection:"column",gap:9,justifyContent:"center"}}>
            {[["Salida",`${fmtTime(pass.rise)} · ${azLabel(pass.rise_az)} (${pass.rise_az}°)`],["Máximo",`${fmtTime(pass.max)} · ${pass.max_el}° elevación`],["Ocaso",`${fmtTime(pass.set)} · ${azLabel(pass.set_az)} (${pass.set_az}°)`],["Duración",dur],["Visibilidad",pass.visible?"✓ A simple vista":"○ Necesita telescopio"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.038)",paddingBottom:7}}>
                <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#334155",letterSpacing:"0.12em",textTransform:"uppercase"}}>{l}</span>
                <span style={{fontSize:10.5,fontFamily:"'IBM Plex Mono',monospace",color:l==="Visibilidad"?(pass.visible?"#4ade80":"#334155"):"#E0E8F0"}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:5,padding:"11px 13px",background:sat.color+"09",borderRadius:10,border:`1px solid ${sat.color}16`}}>
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
   NEWS CARD
───────────────────────────────────────────── */
function NewsCard({ article }) {
  const src = article.source?.toUpperCase() ?? "";
  const bc = src.includes("NASA") ? { bg:"#081C3A",color:"#57C7FF",b:"#57C7FF18" }
           : src.includes("ESA")  ? { bg:"#0C1830",color:"#7B9FD8",b:"#7B9FD818" }
           : src.includes("SPACE") ? { bg:"#101010",color:"#888",b:"#88888818" }
           :                        { bg:"#0C1A26",color:"#64748b",b:"#64748b18" };
  return (
    <div style={{borderRadius:16,overflow:"hidden",background:"rgba(255,255,255,0.014)",border:"1px solid rgba(255,255,255,0.065)",backdropFilter:"blur(10px)",display:"flex",flexDirection:"column",transition:"border-color 0.2s"}}>
      {article.image
        ?<div style={{height:148,overflow:"hidden",flexShrink:0}}><img src={article.image} alt={article.title} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.78}} onError={e=>{e.target.parentElement.style.display="none";}}/></div>
        :<div style={{height:82,background:"linear-gradient(135deg,#091828,#030810)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,opacity:0.5}}>🛰</div>
      }
      <div style={{padding:"13px 15px",display:"flex",flexDirection:"column",gap:9,flex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.14em",padding:"3px 8px",borderRadius:4,background:bc.bg,color:bc.color,border:`1px solid ${bc.b}`}}>{src}</span>
          <span style={{fontSize:8.5,color:"#1E3A50",fontFamily:"'IBM Plex Mono',monospace"}}>{article.published}</span>
        </div>
        <div style={{fontSize:13,fontWeight:500,color:"#E0E8F0",lineHeight:1.45,letterSpacing:"-0.01em"}}>{article.title}</div>
        <div style={{fontSize:11.5,color:"#334155",lineHeight:1.65,flex:1}}>{article.summary}</div>
        <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:9.5,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",textDecoration:"none",marginTop:3,padding:"5px 10px",borderRadius:7,background:"#57C7FF09",border:"1px solid #57C7FF1E",width:"fit-content",letterSpacing:"0.06em"}}>
          Leer en {article.source} →
        </a>
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
    <div style={{position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",zIndex:200,padding:"12px 20px",borderRadius:14,background:`linear-gradient(135deg,${sat.color}18,rgba(3,8,20,0.96))`,border:`1px solid ${sat.color}55`,backdropFilter:"blur(22px)",display:"flex",alignItems:"center",gap:15,boxShadow:`0 0 50px ${sat.color}18`,maxWidth:"86vw"}}>
      <span style={{fontSize:18}}>🛰</span>
      <div>
        <div style={{fontSize:10,fontWeight:600,color:sat.color,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.14em"}}>PASE EN {m} MINUTOS</div>
        <div style={{fontSize:9.5,color:"#64748b",marginTop:2,fontFamily:"monospace"}}>{sat.name} · {fmtTime(next.rise)} · Máx {next.max_el}°{next.visible?" · 👁 Visible":""}</div>
      </div>
      <button onClick={onDismiss} style={{marginLeft:"auto",color:"#334155",fontSize:13,padding:"4px 8px",borderRadius:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer"}}>✕</button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COSMIC BACKGROUND
───────────────────────────────────────────── */
function CosmicBg({ color }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* base */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 130% 90% at 65% 15%, #0D1B2A 0%, #050816 50%, #07111F 100%)"}}/>
      {/* noise */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.032}}>
        <filter id="fn"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#fn)"/>
      </svg>
      {/* aurora */}
      <div style={{position:"absolute",top:"-25%",left:"25%",width:"85vw",height:"75vh",borderRadius:"50%",background:`radial-gradient(ellipse, ${color}0A 0%, transparent 68%)`,transition:"background 2.5s ease",animation:"auroraF 20s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:"-15%",right:"-5%",width:"55vw",height:"45vh",borderRadius:"50%",background:"radial-gradient(ellipse, #C47B480A 0%, transparent 68%)",animation:"auroraF 28s ease-in-out infinite reverse"}}/>
      {/* stars */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        {Array.from({length:52},(_,i)=>({
          x:((i*179.3)%100).toFixed(1),y:((i*97.1)%100).toFixed(1),
          r:i%8===0?1.3:i%4===0?0.7:0.38,
          op:(0.05+(i%5)*0.05).toFixed(2),dur:3+(i%7),del:(i%9)*0.6,
        })).map((s,i)=>(
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
            <animate attributeName="opacity" values={`${s.op};${(s.op*0.08).toFixed(2)};${s.op}`} dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>
      {/* grid */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.022}}>
        <defs><pattern id="pg" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#pg)"/>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [sat, setSat]                   = useState(SATS[0]);
  const [passes, setPasses]             = useState([]);
  const [pos, setPos]                   = useState(null);
  const [news, setNews]                 = useState([]);
  const [newsLoading, setNewsLoading]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [now, setNow]                   = useState(new Date());
  const [mapTab, setMapTab]             = useState("globe");
  const [onlyVis, setOnlyVis]           = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [logoError, setLogoError]       = useState(false);
  const [section, setSection]           = useState("passes");
  const [fichaOpen, setFichaOpen]       = useState(false);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
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
      .then(d => {
        const articles = Array.isArray(d) ? d : (d.articles || d.results || []);
        setNews(articles);
        setNewsLoading(false);
      })
      .catch(e => { console.error("news fetch:", e); setNewsLoading(false); });
  }, []);

  const future    = passes.filter(p => new Date(p.set) > now);
  const next      = future[0];
  const shown     = onlyVis ? future.filter(p => p.visible) : future;
  const notifNext = future.find(p => { const d = new Date(p.rise) - now; return d > 0 && d < 30*60000; });
  const isLive    = pos?.visible_from_santiago;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#050816;color:#E0E8F0;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#0C2040;border-radius:2px;}
        button{cursor:pointer;border:none;background:none;font-family:inherit;}
        a{color:inherit;}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.15;transform:scale(1.5)}}
        @keyframes auroraF{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(2.5%,1.5%) scale(1.05)}66%{transform:translate(-1.5%,3.5%) scale(0.96)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes orbSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .sat-btn{transition:all 0.25s;}
        .sat-btn:hover{transform:translateY(-1px);}
        .pass-card:hover{border-color:rgba(255,255,255,0.1)!important;}
        @media(max-width:1100px){
          .main-grid{grid-template-columns:272px 1fr!important;}
          .news-sidebar{display:none!important;}
        }
        @media(max-width:880px){
          .main-grid{grid-template-columns:1fr!important;}
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-visual{display:none!important;}
        }
      `}</style>

      <CosmicBg color={sat.color} />
      {!notifDismissed && <NotifBanner next={notifNext} sat={sat} onDismiss={() => setNotifDismissed(true)} />}

      <div style={{position:"relative",zIndex:1,padding:"0 22px"}}>
        <div style={{maxWidth:1150,margin:"0 auto"}}>

          {/* ── NAV ── */}
          <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 0 16px",borderBottom:"1px solid rgba(255,255,255,0.045)",animation:"fadeIn 0.6s ease both"}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              {!logoError
                ?<img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:68,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 14px rgba(10,28,80,0.55)) brightness(1.08)",transition:"filter 0.6s"}}/>
                :<div style={{width:44,height:44,borderRadius:10,background:`${sat.color}18`,border:`1px solid ${sat.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛰</div>
              }
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <div style={{display:"flex",alignItems:"baseline",gap:7}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,letterSpacing:"0.04em",color:"#F5F7FA"}}>AUSTRAL</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:400,letterSpacing:"0.18em",color:sat.color,transition:"color 0.6s"}}>ORBIT</span>
                </div>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7.5,letterSpacing:"0.28em",color:"#1E3A50",textTransform:"uppercase"}}>Santiago · 33.4°S · Chile</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {pos&&(
                <div style={{display:"flex",alignItems:"center",gap:7,padding:"5px 11px",borderRadius:8,background:isLive?sat.color+"14":"rgba(255,255,255,0.025)",border:`1px solid ${isLive?sat.color+"40":"rgba(255,255,255,0.055)"}`,transition:"all 0.6s"}}>
                  <span style={{display:"block",width:5,height:5,borderRadius:"50%",background:isLive?sat.color:"#1E3A50",animation:isLive?"livePulse 2s infinite":"none"}}/>
                  <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:isLive?sat.color:"#334155",letterSpacing:"0.1em"}}>{isLive?"VISIBLE":"NO VISIBLE"}</span>
                </div>
              )}
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:21,color:"#F0F4F8",letterSpacing:"0.04em"}}>{`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`}</div>
                <div style={{fontSize:7.5,color:"#1E3A50",letterSpacing:"0.2em",marginTop:1,fontFamily:"'IBM Plex Mono',monospace"}}>HORA CHILE</div>
              </div>
            </div>
          </nav>

          {/* ── HERO ── */}
          <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 420px",gap:52,padding:"60px 0 48px",alignItems:"center"}}>
            <div style={{animation:"fadeUp 0.9s ease both"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 13px",borderRadius:20,background:sat.color+"10",border:`1px solid ${sat.color}28`,marginBottom:26,transition:"all 0.6s"}}>
                <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:sat.color,animation:"livePulse 2.2s infinite"}}/>
                <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:sat.color,letterSpacing:"0.2em",textTransform:"uppercase",transition:"color 0.6s"}}>Datos reales · Skyfield + CelesTrak</span>
              </div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(24px,3.2vw,42px)",fontWeight:800,lineHeight:1.1,letterSpacing:"-0.02em",marginBottom:16,color:"#F5F7FA"}}>
                El espacio está<br/>
                <span style={{color:sat.color,transition:"color 0.6s"}}>sobre Latinoamérica</span><br/>
                ahora mismo.
              </h1>
              <p style={{fontSize:16,color:"#334155",lineHeight:1.78,fontWeight:300,maxWidth:430,marginBottom:38}}>
                Pases calculados en tiempo real sobre Santiago de Chile. Satélites locales, estaciones espaciales internacionales y más.
              </p>
              {next && (
                <div style={{display:"inline-flex",alignItems:"stretch",gap:0,borderRadius:14,overflow:"hidden",border:`1px solid ${sat.color}22`,backdropFilter:"blur(12px)",background:"rgba(3,8,20,0.5)"}}>
                  <div style={{padding:"16px 22px",borderRight:"1px solid rgba(255,255,255,0.055)"}}>
                    <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.2em",color:"#1E3A50",textTransform:"uppercase",marginBottom:5}}>Próximo · {sat.name}</div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:31,fontWeight:600,color:sat.color,transition:"color 0.6s",letterSpacing:"0.01em"}}>{fmtTime(next.rise)}</div>
                    <div style={{fontSize:9.5,color:"#1E3A50",marginTop:3,fontFamily:"monospace"}}>{fmtDate(next.rise)} · Chile</div>
                  </div>
                  <div style={{padding:"16px 22px"}}>
                    <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.2em",color:"#1E3A50",textTransform:"uppercase",marginBottom:5}}>Faltan</div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:31,fontWeight:600,color:"#F0F4F8",letterSpacing:"0.01em"}}>{timeUntil(next.rise)}</div>
                    <div style={{fontSize:9.5,color:"#1E3A50",marginTop:3}}>Máx {next.max_el}°{next.visible?" · 👁 Visible":""}</div>
                  </div>
                </div>
              )}
            </div>

            {/* hero visual */}
            <div className="hero-visual" style={{display:"flex",justifyContent:"center",animation:"fadeUp 1.1s ease 0.15s both"}}>
              <div style={{position:"relative"}}>
                <div style={{position:"absolute",inset:-40,borderRadius:"50%",background:`radial-gradient(circle, ${sat.color}0E 0%, transparent 72%)`,transition:"background 0.7s",animation:"auroraF 14s ease-in-out infinite"}}/>
                <OrbitalPlanet sat={sat} pos={pos}/>
              </div>
            </div>
          </div>

          <div style={{height:1,background:`linear-gradient(90deg, transparent, ${sat.color}40, transparent)`,transition:"background 0.6s"}}/>

          {/* ── SAT PICKER ── */}
          <div style={{padding:"20px 0 16px"}}>
            <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.24em",color:"#1E3A50",textTransform:"uppercase",marginBottom:12}}>Selecciona satélite</div>
            <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4}}>
              {SATS.map(s=>(
                <button key={s.id} className="sat-btn" onClick={()=>setSat(s)} style={{flexShrink:0,padding:"9px 15px",borderRadius:10,background:sat.id===s.id?s.color+"12":"rgba(255,255,255,0.022)",border:`1px solid ${sat.id===s.id?s.color+"48":"rgba(255,255,255,0.055)"}`,color:sat.id===s.id?s.color:"#334155",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.06em",boxShadow:sat.id===s.id?`0 0 22px ${s.color}14`:"none",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{display:"block",width:5,height:5,borderRadius:"50%",background:sat.id===s.id?s.color:"#1E3A50",boxShadow:sat.id===s.id?`0 0 8px ${s.color}`:"none",flexShrink:0}}/>
                  {s.name}
                  {s.chilean&&<span style={{fontSize:7,background:"#C47B4810",color:"#C47B48",padding:"2px 5px",borderRadius:3,border:"1px solid #C47B4826",letterSpacing:"0.08em"}}>🇨🇱 CL</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{height:1,background:"rgba(255,255,255,0.04)"}}/>

          {/* ── MAIN GRID: left | center | right ── */}
          <div className="main-grid" style={{display:"grid",gridTemplateColumns:"272px 1fr 260px",gap:22,padding:"24px 0",alignItems:"start"}}>

            {/* ── COL 1: mapa + live + stats ── */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"flex",gap:5}}>
                {[["globe","🌍 Globo"],["chile","🇨🇱 Chile"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setMapTab(id)} style={{flex:1,padding:"7px",borderRadius:8,background:mapTab===id?sat.color+"12":"rgba(255,255,255,0.022)",border:`1px solid ${mapTab===id?sat.color+"40":"rgba(255,255,255,0.055)"}`,color:mapTab===id?sat.color:"#334155",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.08em",transition:"all 0.2s",backdropFilter:"blur(8px)"}}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{borderRadius:14,border:`1px solid ${sat.color}16`,background:"rgba(3,8,20,0.45)",padding:9,display:"flex",justifyContent:"center",position:"relative",backdropFilter:"blur(10px)",transition:"border-color 0.6s",minHeight:190}}>
                {!pos&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:14,background:"rgba(3,8,20,0.88)",zIndex:2}}><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:sat.color,letterSpacing:"0.12em"}}>Cargando...</span></div>}
                {mapTab==="globe"?<Globe sat={sat} pos={pos}/>:<ChileMap sat={sat} pos={pos}/>}
              </div>
              <LivePanel pos={pos} sat={sat}/>

              {/* ── FICHA TÉCNICA (colapsable) ── */}
              <div style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                <button onClick={()=>setFichaOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 0",cursor:"pointer",background:"none",border:"none",textAlign:"left"}}>
                  <span style={{fontSize:16,lineHeight:1}}>{sat.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#F5F7FA",letterSpacing:"-0.01em"}}>
                      Ficha técnica <span style={{color:sat.color,transition:"color 0.6s"}}>{sat.name}</span>
                    </div>
                    <div style={{fontSize:8.5,color:"#1E3A50",marginTop:1,fontFamily:"'IBM Plex Mono',monospace"}}>{sat.full}</div>
                  </div>
                  <span style={{fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace",color:fichaOpen?sat.color:"#334155",border:`1px solid ${fichaOpen?sat.color+"44":"rgba(255,255,255,0.1)"}`,borderRadius:6,padding:"3px 8px",background:fichaOpen?sat.color+"10":"rgba(255,255,255,0.03)",transition:"all 0.25s",letterSpacing:"0.08em",flexShrink:0}}>
                    {fichaOpen?"▲":"▼"}
                  </span>
                </button>
                {fichaOpen&&(
                  <div style={{animation:"fadeUp 0.25s ease both",paddingBottom:12}}>
                    <div style={{borderRadius:10,overflow:"hidden",marginBottom:12,border:`1px solid ${sat.color}18`,position:"relative"}}>
                      <img src={sat.photo} alt={sat.name} style={{width:"100%",height:155,objectFit:"cover",opacity:0.82,display:"block"}} onError={e=>{e.target.parentElement.style.display="none";}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(3,8,20,0.7) 0%, transparent 55%)"}}/>
                      <div style={{position:"absolute",bottom:8,left:10,fontFamily:"'IBM Plex Mono',monospace",fontSize:7.5,color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em"}}>IMAGEN REFERENCIAL</div>
                    </div>
                    <p style={{fontSize:11,color:"#64748b",lineHeight:1.7,fontWeight:300,marginBottom:12}}>{sat.desc}</p>
                    <div style={{borderRadius:10,overflow:"hidden",border:"1px solid rgba(255,255,255,0.055)",background:"rgba(3,8,20,0.4)",backdropFilter:"blur(8px)",marginBottom:10}}>
                      {sat.specs.map(([l,v],i)=>(
                        <div key={l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:i%2===0?"transparent":"rgba(255,255,255,0.012)",borderBottom:i<sat.specs.length-1?"1px solid rgba(255,255,255,0.038)":"none"}}>
                          <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#334155",letterSpacing:"0.1em",textTransform:"uppercase"}}>{l}</span>
                          <span style={{fontSize:10.5,fontFamily:"'IBM Plex Mono',monospace",color:"#C0CCD8",fontWeight:500,textAlign:"right",maxWidth:"58%"}}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <a href={`https://www.n2yo.com/satellite/?s=${sat.norad}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:9,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",textDecoration:"none",padding:"5px 10px",borderRadius:7,background:"rgba(87,199,255,0.07)",border:"1px solid rgba(87,199,255,0.18)",letterSpacing:"0.06em"}}>
                        Ver en N2YO.com →
                      </a>
                      {sat.chilean&&<span style={{fontSize:9,color:"#C47B48",fontFamily:"'IBM Plex Mono',monospace",padding:"5px 10px",borderRadius:7,background:"#C47B480A",border:"1px solid #C47B4818",letterSpacing:"0.06em"}}>🇨🇱 Fabricación chilena</span>}
                    </div>
                  </div>
                )}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {[[future.length,"Pases",sat.color],[future.filter(p=>p.visible).length,"Visibles","#4ade80"]].map(([v,l,c])=>(
                  <div key={l} style={{borderRadius:11,padding:"12px 14px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.048)",backdropFilter:"blur(8px)"}}>
                    <div style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
                    <div style={{fontSize:27,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:c,transition:"color 0.6s"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── COL 2: pases ── */}
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {/* passes header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div>
                  <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,letterSpacing:"-0.02em",color:"#F5F7FA"}}>Pases de <span style={{color:sat.color,transition:"color 0.6s"}}>{sat.name}</span></h2>
                  <div style={{fontSize:10,color:"#1E3A50",marginTop:2,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.04em"}}>Santiago · próximos 3 días · elevación mín. 10°</div>
                </div>
                <button onClick={()=>setOnlyVis(!onlyVis)} style={{padding:"6px 12px",borderRadius:8,background:onlyVis?"#22c55e10":"rgba(255,255,255,0.025)",border:`1px solid ${onlyVis?"#22c55e2E":"rgba(255,255,255,0.075)"}`,color:onlyVis?"#4ade80":"#334155",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.1em",transition:"all 0.2s"}}>
                  {onlyVis?"● VISIBLES":"TODOS"}
                </button>
              </div>
              {loading&&<div style={{padding:52,textAlign:"center"}}><div style={{fontSize:24,marginBottom:12,display:"inline-block",animation:"orbSpin 3s linear infinite"}}>🛰</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:sat.color,letterSpacing:"0.14em"}}>Calculando pases reales...</div></div>}
              {error&&<div style={{padding:32,textAlign:"center",border:"1px dashed #f43f5e2E",borderRadius:14,background:"#f43f5e06"}}><div style={{fontSize:22,marginBottom:10}}>⚠️</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#f87171"}}>{error}</div></div>}
              {!loading&&!error&&shown.map((p,i)=><PassCard key={i} pass={p} sat={sat} isNext={i===0}/>)}
              {!loading&&!error&&shown.length===0&&<div style={{padding:48,textAlign:"center",border:"1px dashed rgba(255,255,255,0.05)",borderRadius:14}}><div style={{fontSize:24,marginBottom:10}}>🌑</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:"#1E3A50",letterSpacing:"0.1em"}}>Sin pases en los próximos 3 días</div></div>}

            </div>

            {/* ── COL 3: noticias sidebar ── */}
            <div style={{display:"flex",flexDirection:"column",gap:0,position:"sticky",top:20}}>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:14}}>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,letterSpacing:"-0.01em",color:"#F5F7FA"}}>Noticias <span style={{color:"#57C7FF"}}>espaciales</span></h2>
                <span style={{fontSize:8,color:"#1E3A50",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em"}}>SPACEFLIGHT NEWS</span>
              </div>
              {newsLoading&&<div style={{padding:36,textAlign:"center"}}><div style={{fontSize:20,marginBottom:10}}>📡</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#57C7FF",letterSpacing:"0.12em"}}>Cargando...</div></div>}
              {!newsLoading&&news.length===0&&<div style={{padding:36,textAlign:"center",border:"1px dashed rgba(255,255,255,0.05)",borderRadius:12}}><div style={{fontSize:20,marginBottom:8}}>📭</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#1E3A50"}}>Sin noticias disponibles</div></div>}
              {!newsLoading&&news.map((a,i)=>(
                <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",borderRadius:12,overflow:"hidden",background:"rgba(255,255,255,0.014)",border:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(8px)",marginBottom:10,transition:"border-color 0.2s"}}>
                  {a.image&&<div style={{height:110,overflow:"hidden",flexShrink:0}}><img src={a.image} alt={a.title} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.78}} onError={e=>{e.target.parentElement.style.display="none";}}/></div>}
                  <div style={{padding:"11px 13px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,marginBottom:7}}>
                      <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.12em",padding:"2px 7px",borderRadius:4,background:"rgba(87,199,255,0.08)",color:"#57C7FF",border:"1px solid rgba(87,199,255,0.15)"}}>{(a.source||"SPACE").toUpperCase()}</span>
                      <span style={{fontSize:8,color:"#1E3A50",fontFamily:"'IBM Plex Mono',monospace"}}>{a.published}</span>
                    </div>
                    <div style={{fontSize:12,fontWeight:500,color:"#D0DCE8",lineHeight:1.42,letterSpacing:"-0.01em",marginBottom:6}}>{a.title}</div>
                    {a.summary&&<div style={{fontSize:10.5,color:"#334155",lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.summary}</div>}
                    <div style={{marginTop:8,fontSize:9.5,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em"}}>Leer más →</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{height:1,background:`linear-gradient(90deg,transparent,${sat.color}30,transparent)`,transition:"background 0.6s"}}/>
          <div style={{padding:"16px 0 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {!logoError
                ?<img src="/logo.png" onError={()=>setLogoError(true)} alt="Austral Orbit" style={{height:28,width:"auto",objectFit:"contain",opacity:0.55,filter:"brightness(1.6) drop-shadow(0 1px 6px rgba(10,28,80,0.4))"}}/>
                :<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:"#0C2040",letterSpacing:"0.18em"}}>AUSTRAL ORBIT</span>
              }
              <div style={{fontSize:7.5,color:"#0C2040",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em"}}>Owner: Joaquín Valdebenito Palma</div>
            </div>
            <div style={{fontSize:8.5,color:"#0C2040",fontFamily:"'IBM Plex Mono',monospace",textAlign:"right",letterSpacing:"0.08em"}}>Powered by Skyfield · CelesTrak · Spaceflight News API</div>
          </div>
        </div>
      </div>
    </>
  );
}