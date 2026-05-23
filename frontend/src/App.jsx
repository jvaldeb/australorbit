import { useState, useEffect } from "react";

const SATELLITES = [
  { id:"ISS",      name:"ISS",           color:"#38bdf8", image:"🏗️", chilean:false, flag:null,  desc:"Estación Espacial Internacional. Hogar permanente de astronautas desde el año 2000.", orbit:"400 km", speed:"27,600 km/h" },
  { id:"HST",      name:"Hubble",        color:"#34d399", image:"🔭", chilean:false, flag:null,  desc:"Más de 30 años fotografiando el universo desde 540 km de altitud.", orbit:"540 km", speed:"27,300 km/h" },
  { id:"TIANGONG", name:"Tiangong",      color:"#fbbf24", image:"🏮", chilean:false, flag:"🇨🇳", desc:"Estación espacial china en expansión activa desde 2021.", orbit:"390 km", speed:"27,700 km/h" },
  { id:"SSOT",     name:"SSOT",          color:"#f43f5e", image:"📡", chilean:true,  flag:"🇨🇱", desc:"Satélite chileno de observación de la Tierra. Lanzado en 2011, captura imágenes de alta resolución.", orbit:"628 km", speed:"27,200 km/h" },
  { id:"SUCHAI",   name:"SUCHAI-1",      color:"#a78bfa", image:"🎓", chilean:true,  flag:"🇨🇱", desc:"Primer CubeSat chileno. Construido por estudiantes de la U. de Chile, 2017.", orbit:"510 km", speed:"27,500 km/h" },
  { id:"SUCHAI2",  name:"SUCHAI-2",      color:"#c084fc", image:"🔬", chilean:true,  flag:"🇨🇱", desc:"Segundo CubeSat de la U. de Chile. Experimentos de plasma ionosférico.", orbit:"550 km", speed:"27,400 km/h" },
  { id:"SUCHAI3",  name:"SUCHAI-3",      color:"#e879f9", image:"🌿", chilean:true,  flag:"🇨🇱", desc:"Tercer CubeSat chileno. Monitoreo forestal y medioambiental.", orbit:"550 km", speed:"27,400 km/h" },
];

const API = "https://australorbit-production.up.railway.app";
const SANTIAGO = { lat:-33.4489, lon:-70.6693 };
const pad = n => String(n).padStart(2,"0");
const d2r = d => d * Math.PI / 180;
const r2d = r => r * 180 / Math.PI;

function groundTrack(lat, lon, inclination, periodMin, minutesAhead=120, step=0.5) {
  const degPerMin = 360 / periodMin;
  const pts = [];
  for (let i = -periodMin; i <= minutesAhead; i += step) {
    const dLon = degPerMin * i;
    const newLon = ((lon + dLon + 180) % 360) - 180;
    const phase = d2r((i / periodMin) * 360);
    const newLat = Math.max(-90, Math.min(90, lat + Math.sin(phase) * inclination * 0.3));
    pts.push({ lat: newLat, lon: newLon, past: i < 0 });
  }
  return pts;
}

function visRadius(altKm) { return r2d(Math.acos(6371 / (6371 + altKm))) * 0.88; }

function fmtTime(iso) {
  const d = new Date(iso), c = new Date(d.getTime() - 4*3600000);
  return `${pad(c.getUTCHours())}:${pad(c.getUTCMinutes())}`;
}
function fmtDate(iso) {
  const d = new Date(iso), c = new Date(d.getTime() - 4*3600000);
  const D=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const M=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${D[c.getUTCDay()]} ${c.getUTCDate()} ${M[c.getUTCMonth()]}`;
}
function timeUntil(iso) {
  const diff = new Date(iso) - new Date();
  if (diff < 0) return "Pasado";
  const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}
function countdown(iso) {
  const diff = new Date(iso) - new Date();
  if (diff < 0) return null;
  const h = Math.floor(diff/3600000);
  const m = Math.floor((diff%3600000)/60000);
  const s = Math.floor((diff%60000)/1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
const azLabel = deg => ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"][Math.round(deg/22.5)%16];

// ── Source badge color ────────────────────────────────────────────────────────
function sourceBadgeColor(source) {
  if (source.includes("NASA"))   return { bg:"#1e3a5f", color:"#60a5fa" };
  if (source.includes("ESA"))    return { bg:"#1e3352", color:"#818cf8" };
  if (source.includes("SpaceX")) return { bg:"#1a1a2e", color:"#94a3b8" };
  if (source.includes("Space"))  return { bg:"#1e2a1e", color:"#4ade80" };
  return { bg:"#1e2030", color:"#94a3b8" };
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({length:90},(_,i)=>({
    x:((i*137.508)%100).toFixed(2), y:((i*97.333)%100).toFixed(2),
    r:i%4===0?1.4:i%4===1?0.8:0.5, op:(0.08+(i%6)*0.07).toFixed(2), dur:2+(i%5),
  }));
  return (
    <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} preserveAspectRatio="xMidYMid slice">
      {stars.map((s,i)=>(
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
          <animate attributeName="opacity" values={`${s.op};${s.op*0.15};${s.op}`} dur={`${s.dur}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

// ── Globe ─────────────────────────────────────────────────────────────────────
function Globe({ sat, pos }) {
  const W=300,H=300,R=130,cx=150,cy=150,cLat=-20,cLon=-70;
  function proj(lat,lon){
    const φ=d2r(lat),λ=d2r(lon),φ0=d2r(cLat),λ0=d2r(cLon);
    const cosC=Math.sin(φ0)*Math.sin(φ)+Math.cos(φ0)*Math.cos(φ)*Math.cos(λ-λ0);
    if(cosC<0)return null;
    return[cx+R*Math.cos(φ)*Math.sin(λ-λ0),cy-R*(Math.cos(φ0)*Math.sin(φ)-Math.sin(φ0)*Math.cos(φ)*Math.cos(λ-λ0))];
  }
  const satLat=pos?.lat??0,satLon=pos?.lon??0,altKm=pos?.alt_km??400;
  const sXY=proj(satLat,satLon);
  const grid=[];
  for(let lat=-80;lat<=80;lat+=20){const pts=[];for(let lon=-180;lon<=180;lon+=2){const xy=proj(lat,lon);if(xy)pts.push(xy);else if(pts.length>1){grid.push([...pts]);pts.length=0;}}if(pts.length>1)grid.push(pts);}
  for(let lon=-180;lon<=180;lon+=20){const pts=[];for(let lat=-90;lat<=90;lat+=2){const xy=proj(lat,lon);if(xy)pts.push(xy);else if(pts.length>1){grid.push([...pts]);pts.length=0;}}if(pts.length>1)grid.push(pts);}
  const sa=[[-17,-72],[-10,-62],[-3,-43],[-5,-35],[-12,-37],[-18,-40],[-23,-43],[-28,-49],[-33,-52],[-38,-58],[-42,-64],[-46,-65],[-52,-69],[-55,-68],[-55,-65],[-52,-73],[-48,-75],[-42,-73],[-35,-72],[-27,-70],[-18,-70],[-12,-77],[-3,-80],[5,-77],[10,-75],[12,-72],[-17,-72]];
  const toPath=pts=>pts.filter(Boolean).map((p,i)=>`${i===0?"M":"L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const sPt=proj(SANTIAGO.lat,SANTIAGO.lon);
  const vr=visRadius(altKm);
  const vc=Array.from({length:60},(_,i)=>{const a=(i/60)*2*Math.PI,vl=satLat+vr*Math.cos(a),vlo=satLon+(vr/Math.cos(d2r(satLat)))*Math.sin(a);return proj(Math.max(-90,Math.min(90,vl)),((vlo+180)%360)-180);}).filter(Boolean);
  const trackPts=groundTrack(satLat,satLon,51.6,92);
  const segs=[];let seg=[];
  for(const pt of trackPts){const xy=proj(pt.lat,pt.lon);if(!xy){if(seg.length>1)segs.push({pts:seg});seg=[];continue;}seg.push({xy,past:pt.past});}
  if(seg.length>1)segs.push({pts:seg});
  const gid=`g${sat.id}`;
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W}}>
      <defs>
        <radialGradient id={`bg${gid}`} cx="40%" cy="35%"><stop offset="0%" stopColor="#0d2545"/><stop offset="100%" stopColor="#020810"/></radialGradient>
        <radialGradient id={`gw${gid}`}><stop offset="0%" stopColor={sat.color} stopOpacity="0.18"/><stop offset="100%" stopColor={sat.color} stopOpacity="0"/></radialGradient>
        <clipPath id={`cl${gid}`}><circle cx={cx} cy={cy} r={R}/></clipPath>
        <filter id={`sf${gid}`}><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx={cx} cy={cy} r={R+22} fill={`url(#gw${gid})`}/>
      <circle cx={cx} cy={cy} r={R} fill={`url(#bg${gid})`} stroke={sat.color+"44"} strokeWidth="1.5"/>
      <g clipPath={`url(#cl${gid})`}>
        {grid.map((pts,i)=><polyline key={i} points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke="#0d2545" strokeWidth="0.6" opacity="0.9"/>)}
        <path d={toPath(sa.map(([la,lo])=>proj(la,lo)))} fill="#0a1e35" stroke="#1a4a7a" strokeWidth="1"/>
        {vc.length>3&&<polygon points={vc.map(p=>p.join(",")).join(" ")} fill={sat.color+"18"} stroke={sat.color+"55"} strokeWidth="1.2" strokeDasharray="5 3"/>}
        {segs.map((s,i)=><polyline key={i} points={s.pts.map(p=>p.xy.join(",")).join(" ")} fill="none" stroke={sat.color} strokeWidth={2} opacity={0.85}/>)}
        {sPt&&<><circle cx={sPt[0]} cy={sPt[1]} r="10" fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.4"/><circle cx={sPt[0]} cy={sPt[1]} r="5" fill="none" stroke="#f43f5e" strokeWidth="1.5"/><circle cx={sPt[0]} cy={sPt[1]} r="2.5" fill="#f43f5e"/><text x={sPt[0]+9} y={sPt[1]-7} fontSize="9" fill="#f43f5e" fontFamily="monospace" fontWeight="700">Santiago</text></>}
        {sXY&&<><circle cx={sXY[0]} cy={sXY[1]} r="20" fill={sat.color+"0d"}/><circle cx={sXY[0]} cy={sXY[1]} r="7" fill={sat.color} filter={`url(#sf${gid})`}/><circle cx={sXY[0]} cy={sXY[1]} r="13" fill="none" stroke={sat.color} strokeWidth="1.5" opacity="0.5"/><text x={sXY[0]+15} y={sXY[1]-11} fontSize="9" fill={sat.color} fontFamily="monospace" fontWeight="700">{sat.name}</text></>}
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={sat.color+"44"} strokeWidth="1.5"/>
      {pos&&<text x="10" y={H-10} fontSize="8" fill={sat.color+"99"} fontFamily="monospace">{`${Math.abs(satLat).toFixed(1)}°${satLat>=0?"N":"S"}  ${Math.abs(satLon).toFixed(1)}°${satLon>=0?"E":"O"}`}</text>}
    </svg>
  );
}

// ── Chile map ─────────────────────────────────────────────────────────────────
function ChileMap({ sat, pos }) {
  const W=260,H=390,latMin=-56,latMax=-17,lonMin=-76,lonMax=-64;
  const proj=(lat,lon)=>[((lon-lonMin)/(lonMax-lonMin))*(W-40)+20,((latMax-lat)/(latMax-latMin))*(H-40)+20];
  const satLat=pos?.lat??0,satLon=pos?.lon??0,altKm=pos?.alt_km??400;
  const sXY=proj(satLat,satLon),stXY=proj(SANTIAGO.lat,SANTIAGO.lon);
  const inView=pos?.visible_from_santiago??false;
  const vr=visRadius(altKm);
  const vc=Array.from({length:72},(_,i)=>{const a=(i/72)*2*Math.PI;return proj(satLat+vr*Math.cos(a),satLon+(vr/Math.cos(d2r(satLat)))*Math.sin(a));});
  const chile=[[-17.5,-70],[-18,-70.3],[-20,-70.1],[-22,-70.1],[-24,-70.6],[-26,-70.8],[-28,-71.3],[-30,-71.5],[-32,-71.7],[-33.4,-71.8],[-35,-72],[-37,-73.5],[-38,-73.5],[-40,-73.5],[-42,-73.5],[-44,-75],[-46,-75],[-48,-75.5],[-50,-75],[-52,-74],[-53,-70.9],[-54,-69],[-55,-68],[-55,-65],[-53,-63],[-51,-59],[-49,-57],[-47,-65],[-44,-66],[-41,-62],[-38,-58],[-36,-57],[-33,-52],[-30,-51],[-27,-50],[-24,-67],[-22,-68],[-20,-70],[-17.5,-70]];
  const cities=[{name:"Santiago",lat:-33.4489,lon:-70.6693,main:true},{name:"Valparaíso",lat:-33.05,lon:-71.6},{name:"Concepción",lat:-36.82,lon:-73.05},{name:"Antofagasta",lat:-23.65,lon:-70.4},{name:"Pto. Montt",lat:-41.47,lon:-72.94}];
  const trk=groundTrack(satLat,satLon,97,95,120,0.3).filter(pt=>pt.lat>=latMin-5&&pt.lat<=latMax+5&&pt.lon>=lonMin-3&&pt.lon<=lonMax+3);
  const gid2=`c${sat.id}`;
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W}}>
      <defs>
        <radialGradient id={`cbg${gid2}`}><stop offset="0%" stopColor="#0a1628"/><stop offset="100%" stopColor="#020810"/></radialGradient>
        <filter id={`csg${gid2}`}><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id={`ccl${gid2}`}><rect x="0" y="0" width={W} height={H}/></clipPath>
      </defs>
      <rect width={W} height={H} rx="12" fill={`url(#cbg${gid2})`}/>
      {[-70,-65,-60,-55,-50,-45,-40,-35,-30,-25,-20].map(lat=>{const[,y]=proj(lat,lonMin);return y>=0&&y<=H?<line key={lat} x1="0" y1={y} x2={W} y2={y} stroke="#0d2545" strokeWidth="0.6" strokeDasharray="3 5"/>:null;})}
      {[-75,-70,-65].map(lon=>{const[x]=proj(latMin,lon);return x>=0&&x<=W?<line key={lon} x1={x} y1="0" x2={x} y2={H} stroke="#0d2545" strokeWidth="0.6" strokeDasharray="3 5"/>:null;})}
      <g clipPath={`url(#ccl${gid2})`}>
        <polygon points={chile.map(([la,lo])=>proj(la,lo).join(",")).join(" ")} fill="#0a1e35" stroke="#1a4a7a" strokeWidth="1.2"/>
        <polygon points={vc.map(p=>p.join(",")).join(" ")} fill={sat.color+"18"} stroke={sat.color+"66"} strokeWidth="1.5" strokeDasharray="6 4"/>
        {inView&&<line x1={sXY[0]} y1={sXY[1]} x2={stXY[0]} y2={stXY[1]} stroke={sat.color} strokeWidth="1" strokeDasharray="5 4" opacity="0.7"/>}
        {trk.length>1&&trk.map((pt,i)=>{if(i===0)return null;const pv=trk[i-1],a=proj(pv.lat,pv.lon),b=proj(pt.lat,pt.lon);return<line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={sat.color} strokeWidth={pt.past?1:2} opacity={pt.past?0.2:0.8}/>;})}
        {cities.map(c=>{const[cx2,cy2]=proj(c.lat,c.lon);if(cx2<-5||cx2>W+5||cy2<-5||cy2>H+5)return null;return<g key={c.name}>{c.main&&<circle cx={cx2} cy={cy2} r="10" fill="#f43f5e0d"/>}<circle cx={cx2} cy={cy2} r={c.main?4:2.5} fill={c.main?"#f43f5e":"#4a7fa5"}/><text x={cx2+7} y={cy2+4} fontSize={c.main?9:7.5} fill={c.main?"#f87171":"#4a7fa5"} fontFamily="monospace">{c.name}</text></g>;})}
        {sXY[0]>-30&&sXY[0]<W+30&&sXY[1]>-30&&sXY[1]<H+30&&<><circle cx={sXY[0]} cy={sXY[1]} r="24" fill={sat.color+"0d"}/><circle cx={sXY[0]} cy={sXY[1]} r="9" fill={sat.color} filter={`url(#csg${gid2})`} opacity="0.9"/><circle cx={sXY[0]} cy={sXY[1]} r="15" fill="none" stroke={sat.color} strokeWidth="1.5" opacity="0.5"/><text x={sXY[0]+17} y={sXY[1]-13} fontSize="9" fill={sat.color} fontFamily="monospace" fontWeight="700">{sat.name}</text></>}
      </g>
      <rect x="8" y="8" width={inView?138:152} height="22" rx="5" fill={inView?sat.color+"22":"rgba(0,0,0,0.5)"} stroke={inView?sat.color+"55":"rgba(255,255,255,0.1)"} strokeWidth="1"/>
      <text x="15" y="23" fontSize="8.5" fill={inView?sat.color:"#475569"} fontFamily="monospace">{inView?"✓ EN RANGO DE SANTIAGO":"○ FUERA DE RANGO"}</text>
      {pos&&<text x={W-8} y={H-8} fontSize="7.5" fill={sat.color+"77"} fontFamily="monospace" textAnchor="end">{`${Math.abs(satLat).toFixed(1)}°S  ${Math.abs(satLon).toFixed(1)}°O`}</text>}
    </svg>
  );
}

// ── Sky diagram ───────────────────────────────────────────────────────────────
function SkyDiagram({ pass, color }) {
  const cx=110,cy=110,R=90;
  const toXY=(az,el)=>{const r=R*(1-el/90),a=(az-90)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];};
  const pts=Array.from({length:21},(_,i)=>{const f=i/20,az=pass.rise_az+(pass.set_az-pass.rise_az)*f,el=f<0.5?pass.max_el*f*2:pass.max_el*(1-f)*2;return toXY(az,Math.max(0,el));});
  const d=pts.map((p,i)=>`${i===0?"M":"L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const[mx,my]=toXY(pass.max_az,pass.max_el);
  return(
    <svg viewBox="0 0 220 220" style={{width:"100%",maxWidth:190}}>
      <circle cx={cx} cy={cy} r={R+4} fill="#060d18" stroke="#0d2545" strokeWidth="1"/>
      {[30,60,90].map(r=><circle key={r} cx={cx} cy={cy} r={R*r/90} fill="none" stroke="#0d2545" strokeWidth="0.8" strokeDasharray="3 4"/>)}
      {[0,90,180,270].map(a=>{const rad=(a-90)*Math.PI/180;return<line key={a} x1={cx+8*Math.cos(rad)} y1={cy+8*Math.sin(rad)} x2={cx+R*Math.cos(rad)} y2={cy+R*Math.sin(rad)} stroke="#0d2545" strokeWidth="0.8"/>;})}
      {[["N",0],["E",90],["S",180],["O",270]].map(([l,a])=>{const rad=(a-90)*Math.PI/180;return<text key={l} x={cx+(R+14)*Math.cos(rad)} y={cy+(R+14)*Math.sin(rad)} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#2a5a7a" fontFamily="monospace" fontWeight="700">{l}</text>;})}
      <path d={d} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.12"/>
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.9"/>
      <circle cx={pts[0][0]} cy={pts[0][1]} r="4" fill="#22c55e"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill="#ef4444"/>
      <circle cx={mx} cy={my} r="6" fill={color}/>
      <circle cx={mx} cy={my} r="11" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5"/>
    </svg>
  );
}

// ── Live panel ────────────────────────────────────────────────────────────────
function LivePanel({ pos, sat }) {
  if (!pos) return null;
  return (
    <div style={{borderRadius:12,padding:16,background:`linear-gradient(135deg,${sat.color}0d,rgba(0,0,0,0.3))`,border:`1px solid ${sat.color}33`,transition:"all 0.4s"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:sat.color,boxShadow:`0 0 8px ${sat.color}`,animation:"pulse 1.5s infinite"}}/>
        <div style={{fontSize:9,fontFamily:"monospace",letterSpacing:"0.2em",color:sat.color,textTransform:"uppercase"}}>Posición en vivo</div>
        <div style={{marginLeft:"auto",fontSize:8,color:"#334155",fontFamily:"monospace"}}>↻ cada 5s</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          ["Latitud",   `${Math.abs(pos.lat).toFixed(2)}°${pos.lat>=0?"N":"S"}`],
          ["Longitud",  `${Math.abs(pos.lon).toFixed(2)}°${pos.lon>=0?"E":"O"}`],
          ["Altitud",   `${pos.alt_km} km`],
          ["Distancia", `${pos.distance_km?.toLocaleString()} km`],
          ["Elevación", `${pos.elevation_from_santiago}°`],
          ["Azimut",    `${pos.azimuth_from_santiago}° ${azLabel(pos.azimuth_from_santiago)}`],
        ].map(([l,v])=>(
          <div key={l} style={{padding:"7px 10px",borderRadius:8,background:"rgba(0,0,0,0.3)"}}>
            <div style={{fontSize:8,fontFamily:"monospace",color:"#334155",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{l}</div>
            <div style={{fontSize:12,fontFamily:"monospace",color:"white",fontWeight:700}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:pos.visible_from_santiago?"#22c55e0d":"rgba(0,0,0,0.2)",border:`1px solid ${pos.visible_from_santiago?"#22c55e33":"rgba(255,255,255,0.05)"}`}}>
        <span style={{fontSize:11,color:pos.visible_from_santiago?"#4ade80":"#475569",fontFamily:"monospace"}}>
          {pos.visible_from_santiago?"✓ Sobre el horizonte de Santiago":"○ Bajo el horizonte de Santiago"}
        </span>
      </div>
    </div>
  );
}

// ── Pass card ─────────────────────────────────────────────────────────────────
function PassCard({ pass, sat, isNext }) {
  const[open,setOpen]=useState(false);
  const[cd,setCd]=useState(null);
  useEffect(()=>{
    if(!isNext)return;
    const t=setInterval(()=>setCd(countdown(pass.rise)),1000);
    return()=>clearInterval(t);
  },[isNext,pass.rise]);
  const q=pass.max_el>=60?"ÓPTIMO":pass.max_el>=30?"BUENO":"BAJO";
  const qc=pass.max_el>=60?"#34d399":pass.max_el>=30?"#fbbf24":"#64748b";
  const dur=`${Math.floor(pass.duration/60)}m ${pass.duration%60}s`;
  return(
    <div onClick={()=>setOpen(!open)} style={{background:open?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.02)",border:`1px solid ${isNext?sat.color+"55":"rgba(255,255,255,0.07)"}`,borderLeft:`3px solid ${isNext?sat.color:"transparent"}`,borderRadius:10,padding:"13px 17px",cursor:"pointer",transition:"all 0.2s",marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{minWidth:80}}>
          <div style={{fontFamily:"monospace",fontSize:20,fontWeight:700,color:"white"}}>{fmtTime(pass.rise)}</div>
          <div style={{fontSize:10,color:"#475569",marginTop:1}}>{fmtDate(pass.rise)}</div>
        </div>
        <div style={{display:"flex",gap:5,flex:1,flexWrap:"wrap",alignItems:"center"}}>
          {isNext&&<span style={{fontSize:8,fontFamily:"monospace",letterSpacing:"0.12em",padding:"2px 7px",borderRadius:20,background:sat.color+"22",color:sat.color,border:`1px solid ${sat.color}55`}}>PRÓXIMO</span>}
          {pass.visible&&<span style={{fontSize:8,fontFamily:"monospace",padding:"2px 7px",borderRadius:20,background:"#22c55e15",color:"#4ade80",border:"1px solid #22c55e33"}}>👁 VISIBLE</span>}
          <span style={{fontSize:8,fontFamily:"monospace",padding:"2px 7px",borderRadius:20,background:qc+"15",color:qc,border:`1px solid ${qc}33`}}>{q} {pass.max_el}°</span>
        </div>
        <div style={{textAlign:"right"}}>
          {isNext&&cd ? (
            <div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,color:sat.color,letterSpacing:"0.08em"}}>{cd}</div>
          ) : (
            <div style={{fontSize:12,color:sat.color,fontFamily:"monospace",fontWeight:700}}>{timeUntil(pass.rise)}</div>
          )}
          <div style={{fontSize:10,color:"#334155",marginTop:1}}>{dur}</div>
        </div>
        <span style={{color:"#334155",fontSize:12}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.06)",display:"grid",gridTemplateColumns:"190px 1fr",gap:18}}>
          <SkyDiagram pass={pass} color={sat.color}/>
          <div style={{display:"flex",flexDirection:"column",gap:9,justifyContent:"center"}}>
            {[["Salida",`${fmtTime(pass.rise)} · ${azLabel(pass.rise_az)} (${pass.rise_az}°)`],["Máximo",`${fmtTime(pass.max)} · ${pass.max_el}° elevación`],["Ocaso",`${fmtTime(pass.set)} · ${azLabel(pass.set_az)} (${pass.set_az}°)`],["Duración",dur],["Visibilidad",pass.visible?"✓ A simple vista":"○ Necesita telescopio"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.04)",paddingBottom:7}}>
                <span style={{fontSize:9,fontFamily:"monospace",color:"#475569",letterSpacing:"0.12em",textTransform:"uppercase"}}>{l}</span>
                <span style={{fontSize:11,fontFamily:"monospace",color:l==="Visibilidad"?(pass.visible?"#4ade80":"#64748b"):"white"}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:4,padding:"10px 12px",background:sat.color+"0d",borderRadius:8,border:`1px solid ${sat.color}22`}}>
              <div style={{fontSize:9,color:"#475569",fontFamily:"monospace",letterSpacing:"0.1em",marginBottom:4}}>CONSEJO</div>
              <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.6}}>{pass.visible?`Mira hacia el ${azLabel(pass.rise_az)} y busca un punto de luz moviéndose. Alcanzará ${pass.max_el}° de altura.`:`Con ${pass.max_el}° de elevación máxima se recomienda usar binoculares.`}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── News card ─────────────────────────────────────────────────────────────────
function NewsCard({ article }) {
  const badge = sourceBadgeColor(article.source);
  return (
    <div style={{borderRadius:14,overflow:"hidden",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",transition:"border-color 0.2s",display:"flex",flexDirection:"column"}}>
      {/* Imagen */}
      {article.image ? (
        <div style={{height:160,overflow:"hidden",background:"#0a1628",flexShrink:0}}>
          <img
            src={article.image}
            alt={article.title}
            style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.85}}
            onError={e=>{e.target.parentElement.style.display="none";}}
          />
        </div>
      ) : (
        <div style={{height:100,background:"linear-gradient(135deg,#0a1628,#020810)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>🛰</div>
      )}
      {/* Content */}
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10,flex:1}}>
        {/* Source + date */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <span style={{fontSize:9,fontFamily:"monospace",letterSpacing:"0.12em",padding:"3px 8px",borderRadius:4,background:badge.bg,color:badge.color}}>{article.source.toUpperCase()}</span>
          <span style={{fontSize:10,color:"#334155",fontFamily:"monospace"}}>{article.published}</span>
        </div>
        {/* Title */}
        <div style={{fontSize:14,fontWeight:600,color:"white",lineHeight:1.4}}>{article.title}</div>
        {/* Summary */}
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.6,flex:1}}>{article.summary}</div>
        {/* Link */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e=>e.stopPropagation()}
          style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,color:"#38bdf8",fontFamily:"monospace",textDecoration:"none",marginTop:4,padding:"6px 10px",borderRadius:7,background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",width:"fit-content",transition:"all 0.2s"}}
        >
          Leer en {article.source} →
        </a>
      </div>
    </div>
  );
}

// ── Notif banner ──────────────────────────────────────────────────────────────
function NotifBanner({ next, sat, onDismiss }) {
  if(!next)return null;
  const diff=new Date(next.rise)-new Date();
  if(diff<0||diff>30*60000)return null;
  const m=Math.floor(diff/60000);
  return(
    <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:100,padding:"12px 20px",borderRadius:12,background:`linear-gradient(135deg,${sat.color}22,rgba(6,13,24,0.96))`,border:`1px solid ${sat.color}88`,backdropFilter:"blur(12px)",display:"flex",alignItems:"center",gap:14,boxShadow:`0 0 30px ${sat.color}33`,maxWidth:"90vw"}}>
      <div style={{fontSize:22}}>🛰</div>
      <div>
        <div style={{fontSize:12,fontWeight:700,color:sat.color,fontFamily:"monospace",letterSpacing:"0.1em"}}>¡PASE EN {m} MINUTOS!</div>
        <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{sat.name} · {fmtTime(next.rise)} · Máx: {next.max_el}°{next.visible?" · 👁 Visible":""}</div>
      </div>
      <button onClick={onDismiss} style={{marginLeft:"auto",color:"#475569",fontSize:16,padding:"4px 8px",borderRadius:6,background:"rgba(255,255,255,0.05)"}}>✕</button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const[sat,setSat]         = useState(SATELLITES[0]);
  const[passes,setPasses]   = useState([]);
  const[pos,setPos]         = useState(null);
  const[news,setNews]       = useState([]);
  const[newsLoading,setNewsLoading] = useState(false);
  const[loading,setLoading] = useState(false);
  const[error,setError]     = useState(null);
  const[now,setNow]         = useState(new Date());
  const[mapTab,setMapTab]   = useState("globe");
  const[onlyVis,setOnlyVis] = useState(false);
  const[notifDismissed,setNotifDismissed] = useState(false);
  const[logoError,setLogoError] = useState(false);
  const[activeSection,setActiveSection] = useState("passes"); // passes | news

  // Reloj
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  // Pases
  useEffect(()=>{
    setLoading(true);setError(null);setPasses([]);setNotifDismissed(false);
    fetch(`${API}/passes/${sat.id}`)
      .then(r=>r.json()).then(data=>{setPasses(data.passes||[]);setLoading(false);})
      .catch(()=>{setError("No se pudo conectar al servidor.");setLoading(false);});
  },[sat]);

  // Posición cada 5s
  useEffect(()=>{
    setPos(null);
    const fetchPos=()=>fetch(`${API}/position/${sat.id}`).then(r=>r.json()).then(setPos).catch(()=>{});
    fetchPos();
    const t=setInterval(fetchPos,5000);
    return()=>clearInterval(t);
  },[sat]);

  // Noticias (una vez)
  useEffect(()=>{
    setNewsLoading(true);
    fetch(`${API}/news`)
      .then(r=>r.json()).then(data=>{setNews(data.articles||[]);setNewsLoading(false);})
      .catch(()=>setNewsLoading(false));
  },[]);

  const future=passes.filter(p=>new Date(p.set)>now);
  const next=future[0];
  const shown=onlyVis?future.filter(p=>p.visible):future;
  const notifNext=future.find(p=>new Date(p.rise)>now&&(new Date(p.rise)-now)<30*60000);

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#060d18;color:white;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#1a3a5c;border-radius:2px;}
        button{cursor:pointer;border:none;background:none;font-family:inherit;}
        a{color:inherit;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @media(max-width:900px){
          .main-grid{grid-template-columns:1fr!important;}
          .news-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      <Stars/>
      {!notifDismissed&&<NotifBanner next={notifNext} sat={sat} onDismiss={()=>setNotifDismissed(true)}/>}

      <div style={{position:"relative",zIndex:1,padding:"0 20px"}}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>

          {/* NAV */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {!logoError?(
                <img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:56,width:"auto",objectFit:"contain",filter:"drop-shadow(0 0 10px rgba(56,189,248,0.25))"}}/>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${sat.color}33,${sat.color}0d)`,border:`1px solid ${sat.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛰</div>
                  <div style={{fontFamily:"'Space Mono'",fontSize:15,fontWeight:700,letterSpacing:"0.12em",color:sat.color}}>AUSTRAL ORBIT</div>
                </div>
              )}
              <div style={{fontSize:10,color:"#334155",letterSpacing:"0.2em",textTransform:"uppercase",display:logoError?"none":"block"}}>Santiago · 33.4°S · 70.6°O</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {pos&&(
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:7,background:pos.visible_from_santiago?sat.color+"18":"rgba(255,255,255,0.03)",border:`1px solid ${pos.visible_from_santiago?sat.color+"55":"rgba(255,255,255,0.07)"}`}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:pos.visible_from_santiago?sat.color:"#334155",animation:pos.visible_from_santiago?"pulse 1.5s infinite":"none"}}/>
                  <span style={{fontSize:9,fontFamily:"monospace",color:pos.visible_from_santiago?sat.color:"#475569",letterSpacing:"0.1em"}}>{pos.visible_from_santiago?"VISIBLE":"NO VISIBLE"}</span>
                </div>
              )}
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Space Mono'",fontSize:20,color:"white",letterSpacing:"0.08em"}}>{`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`}</div>
                <div style={{fontSize:9,color:"#334155",letterSpacing:"0.2em",marginTop:1}}>HORA CHILE</div>
              </div>
            </div>
          </div>

          {/* HERO */}
          <div style={{padding:"40px 0 30px",textAlign:"center"}}>
            <div style={{fontSize:10,fontFamily:"'Space Mono'",letterSpacing:"0.3em",color:sat.color,marginBottom:14,transition:"color 0.4s"}}>● DATOS REALES · Skyfield + CelesTrak</div>
            <h1 style={{fontSize:"clamp(28px,5vw,56px)",fontWeight:800,lineHeight:1.1,marginBottom:18,letterSpacing:"-0.02em"}}>
              Satélites cruzando<br/><span style={{color:sat.color,transition:"color 0.4s"}}>tu cielo</span> esta noche
            </h1>
            <p style={{fontSize:15,color:"#64748b",maxWidth:460,margin:"0 auto",lineHeight:1.7,fontWeight:300}}>Pases calculados en tiempo real sobre Santiago de Chile.</p>
            {next&&(
              <div style={{display:"inline-flex",alignItems:"center",gap:18,marginTop:26,padding:"14px 24px",borderRadius:14,background:"rgba(255,255,255,0.03)",border:`1px solid ${sat.color}33`,flexWrap:"wrap",justifyContent:"center"}}>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:9,fontFamily:"'Space Mono'",letterSpacing:"0.2em",color:"#475569",textTransform:"uppercase"}}>Próximo · {sat.name}</div>
                  <div style={{fontSize:26,fontFamily:"'Space Mono'",fontWeight:700,color:sat.color,marginTop:3,transition:"color 0.4s"}}>{fmtTime(next.rise)}</div>
                  <div style={{fontSize:11,color:"#475569",marginTop:1}}>{fmtDate(next.rise)} · hora Chile</div>
                </div>
                <div style={{width:1,height:42,background:"rgba(255,255,255,0.08)"}}/>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:9,fontFamily:"'Space Mono'",letterSpacing:"0.2em",color:"#475569",textTransform:"uppercase"}}>Faltan</div>
                  <div style={{fontSize:26,fontFamily:"'Space Mono'",fontWeight:700,color:"white",marginTop:3}}>{timeUntil(next.rise)}</div>
                  <div style={{fontSize:11,color:"#475569",marginTop:1}}>Máx: {next.max_el}°{next.visible?" · 👁 Visible":""}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(56,189,248,0.3),transparent)"}}/>

          {/* SAT PICKER */}
          <div style={{padding:"18px 0 14px"}}>
            <div style={{fontSize:9,fontFamily:"'Space Mono'",letterSpacing:"0.2em",color:"#334155",textTransform:"uppercase",marginBottom:10}}>Selecciona satélite</div>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
              {SATELLITES.map(s=>(
                <button key={s.id} onClick={()=>setSat(s)} style={{flexShrink:0,padding:"9px 14px",borderRadius:9,background:sat.id===s.id?s.color+"18":"rgba(255,255,255,0.03)",border:`1px solid ${sat.id===s.id?s.color+"66":"rgba(255,255,255,0.07)"}`,color:sat.id===s.id?s.color:"#64748b",fontFamily:"'Space Mono'",fontSize:11,letterSpacing:"0.06em",transition:"all 0.25s",display:"flex",alignItems:"center",gap:7,boxShadow:sat.id===s.id?`0 0 18px ${s.color}22`:"none"}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:sat.id===s.id?s.color:"#334155",flexShrink:0}}/>
                  {s.name}
                  {s.chilean&&<span style={{fontSize:8,background:"#f43f5e15",color:"#f87171",padding:"1px 5px",borderRadius:3,border:"1px solid #f43f5e30"}}>🇨🇱</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{height:1,background:"rgba(255,255,255,0.05)"}}/>

          {/* MAIN GRID */}
          <div className="main-grid" style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:24,padding:"22px 0",alignItems:"start"}}>

            {/* LEFT */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",gap:6}}>
                {[["globe","🌍 Globo"],["chile","🇨🇱 Chile"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setMapTab(id)} style={{flex:1,padding:"8px",borderRadius:8,background:mapTab===id?sat.color+"18":"rgba(255,255,255,0.03)",border:`1px solid ${mapTab===id?sat.color+"55":"rgba(255,255,255,0.07)"}`,color:mapTab===id?sat.color:"#64748b",fontFamily:"'Space Mono'",fontSize:10,letterSpacing:"0.08em",transition:"all 0.2s"}}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{borderRadius:14,border:`1px solid ${sat.color}22`,background:"rgba(255,255,255,0.01)",padding:12,display:"flex",justifyContent:"center",transition:"border-color 0.4s",position:"relative"}}>
                {!pos&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:14,background:"rgba(6,13,24,0.8)",zIndex:2}}><div style={{fontFamily:"monospace",fontSize:10,color:sat.color,letterSpacing:"0.1em"}}>Cargando posición...</div></div>}
                {mapTab==="globe"?<Globe sat={sat} pos={pos}/>:<ChileMap sat={sat} pos={pos}/>}
              </div>
              <LivePanel pos={pos} sat={sat}/>
              <div style={{borderRadius:12,padding:16,background:`linear-gradient(135deg,${sat.color}0d,rgba(255,255,255,0.02))`,border:`1px solid ${sat.color}28`,transition:"all 0.4s"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:28}}>{sat.image}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Space Mono'",fontSize:14,fontWeight:700,color:sat.color,letterSpacing:"0.08em",transition:"color 0.4s"}}>{sat.name}</div>
                    {sat.flag&&<div style={{fontSize:16,marginTop:2}}>{sat.flag}</div>}
                  </div>
                </div>
                <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6,fontWeight:300,marginBottom:10}}>{sat.desc}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                  {[["Órbita",sat.orbit],["Velocidad",sat.speed]].map(([l,v])=>(
                    <div key={l} style={{padding:"7px 10px",borderRadius:8,background:"rgba(0,0,0,0.3)",textAlign:"center"}}>
                      <div style={{fontSize:8,fontFamily:"monospace",color:"#334155",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{l}</div>
                      <div style={{fontSize:11,fontFamily:"monospace",color:"white",fontWeight:700}}>{v}</div>
                    </div>
                  ))}
                </div>
                {sat.chilean&&<div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:"#f43f5e0d",border:"1px solid #f43f5e22",fontSize:11,color:"#f87171"}}>🇨🇱 Satélite de fabricación chilena</div>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[[future.length,"Pases",sat.color],[future.filter(p=>p.visible).length,"Visibles","#4ade80"]].map(([v,l,c])=>(
                  <div key={l} style={{borderRadius:10,padding:"12px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)"}}>
                    <div style={{fontSize:8,fontFamily:"monospace",color:"#334155",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
                    <div style={{fontSize:28,fontFamily:"monospace",fontWeight:700,color:c,transition:"color 0.4s"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {/* Section tabs */}
              <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                {[["passes","🛰 Pases"],["news","📰 Noticias espaciales"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setActiveSection(id)} style={{padding:"10px 20px",fontFamily:"'Space Mono'",fontSize:11,letterSpacing:"0.08em",color:activeSection===id?"white":"#475569",borderBottom:activeSection===id?`2px solid ${sat.color}`:"2px solid transparent",transition:"all 0.2s",background:"none",marginBottom:-1}}>
                    {label}
                  </button>
                ))}
              </div>

              {/* PASSES */}
              {activeSection==="passes"&&<>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
                  <div>
                    <div style={{fontSize:17,fontWeight:700}}>Pases de <span style={{color:sat.color,transition:"color 0.4s"}}>{sat.name}</span></div>
                    <div style={{fontSize:11,color:"#475569",marginTop:2}}>Santiago · próximos 3 días · elevación mín. 10°</div>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{textAlign:"center"}}><div style={{fontSize:22,fontFamily:"monospace",fontWeight:700,color:sat.color}}>{future.length}</div><div style={{fontSize:8,color:"#334155",fontFamily:"monospace",letterSpacing:"0.1em"}}>PASES</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:22,fontFamily:"monospace",fontWeight:700,color:"#4ade80"}}>{future.filter(p=>p.visible).length}</div><div style={{fontSize:8,color:"#334155",fontFamily:"monospace",letterSpacing:"0.1em"}}>VISIBLES</div></div>
                    <button onClick={()=>setOnlyVis(!onlyVis)} style={{padding:"7px 12px",borderRadius:8,background:onlyVis?"#22c55e15":"rgba(255,255,255,0.04)",border:`1px solid ${onlyVis?"#22c55e44":"rgba(255,255,255,0.1)"}`,color:onlyVis?"#4ade80":"#64748b",fontFamily:"'Space Mono'",fontSize:9,letterSpacing:"0.08em",transition:"all 0.2s"}}>
                      {onlyVis?"👁 VISIBLES":"TODOS"}
                    </button>
                  </div>
                </div>
                {loading&&<div style={{padding:48,textAlign:"center"}}><div style={{fontSize:32,marginBottom:12}}>⏳</div><div style={{fontFamily:"monospace",fontSize:11,color:sat.color,letterSpacing:"0.1em"}}>Calculando pases reales...</div></div>}
                {error&&<div style={{padding:32,textAlign:"center",border:"1px dashed #f43f5e44",borderRadius:12,background:"#f43f5e08"}}><div style={{fontSize:28,marginBottom:10}}>⚠️</div><div style={{fontFamily:"monospace",fontSize:11,color:"#f87171"}}>{error}</div></div>}
                {!loading&&!error&&shown.map((p,i)=><PassCard key={i} pass={p} sat={sat} isNext={i===0}/>)}
                {!loading&&!error&&shown.length===0&&<div style={{padding:44,textAlign:"center",border:"1px dashed rgba(255,255,255,0.07)",borderRadius:12}}><div style={{fontSize:32,marginBottom:10}}>🌑</div><div style={{fontFamily:"monospace",fontSize:11,color:"#334155"}}>Sin pases en los próximos 3 días</div></div>}
              </>}

              {/* NEWS */}
              {activeSection==="news"&&<>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
                  <div>
                    <div style={{fontSize:17,fontWeight:700}}>Noticias <span style={{color:"#38bdf8"}}>espaciales</span></div>
                    <div style={{fontSize:11,color:"#475569",marginTop:2}}>Actualizadas diariamente · traducidas al español</div>
                  </div>
                  <div style={{fontSize:9,color:"#334155",fontFamily:"monospace",letterSpacing:"0.1em"}}>Fuente: Spaceflight News API</div>
                </div>
                {newsLoading&&<div style={{padding:48,textAlign:"center"}}><div style={{fontSize:32,marginBottom:12}}>📡</div><div style={{fontFamily:"monospace",fontSize:11,color:"#38bdf8",letterSpacing:"0.1em"}}>Cargando noticias...</div></div>}
                {!newsLoading&&(
                  <div className="news-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
                    {news.map((article,i)=><NewsCard key={i} article={article}/>)}
                  </div>
                )}
                {!newsLoading&&news.length===0&&<div style={{padding:44,textAlign:"center",border:"1px dashed rgba(255,255,255,0.07)",borderRadius:12}}><div style={{fontSize:32,marginBottom:10}}>📭</div><div style={{fontFamily:"monospace",fontSize:11,color:"#334155"}}>No se pudieron cargar las noticias</div></div>}
              </>}
            </div>
          </div>

          {/* FOOTER */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(56,189,248,0.2),transparent)"}}/>
          <div style={{padding:"16px 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            {!logoError
              ?<img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:28,width:"auto",objectFit:"contain",opacity:0.35,filter:"brightness(0) invert(1)"}}/>
              :<div style={{fontFamily:"'Space Mono'",fontSize:9,color:"#1a3050",letterSpacing:"0.15em"}}>AUSTRAL ORBIT</div>
            }
            <div style={{fontSize:9,color:"#1a3050",fontFamily:"monospace"}}>Powered by Skyfield · CelesTrak · Spaceflight News API</div>
          </div>
        </div>
      </div>
    </>
  );
}