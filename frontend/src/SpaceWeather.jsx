import { useState, useEffect } from "react";
import { useGeoLocation } from "./useGeoLocation.js";
import GeoSplash from "./GeoSplash.jsx";
import { usePageMeta } from "./usePageMeta.js";

const pad = n => String(n).padStart(2, "0");

const AURORA_ZONES = [
  { kp:0, lat:"< 66°S",  place:"Antártica",             latNum:-66, visible:false },
  { kp:3, lat:"~60°S",   place:"Islas Malvinas",         latNum:-60, visible:false },
  { kp:5, lat:"~55°S",   place:"Tierra del Fuego",       latNum:-55, visible:true  },
  { kp:6, lat:"~50°S",   place:"Puerto Natales",          latNum:-50, visible:true  },
  { kp:7, lat:"~45°S",   place:"Coyhaique",               latNum:-45, visible:true  },
  { kp:8, lat:"~40°S",   place:"Valdivia / Osorno",      latNum:-40, visible:true  },
  { kp:9, lat:"~35°S",   place:"Santiago / Concepción",  latNum:-35, visible:true  },
];

const LINKS = [
  ["Rastreo",        "/"],
  ["Satélites 🇨🇱",  "/satelites-chilenos"],
  ["Lanzamientos",   "/lanzamientos"],
  ["Clima espacial", "/espacio"],
  ["Noticias",       "/noticias"],
  ["Contacto",       "/contacto"],
];

function Nav({ logoError, setLogoError, menuOpen, setMenuOpen, accentColor }) {
  return (
    <>
      {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:140,background:"rgba(0,0,0,0.6)"}}/>}
      {menuOpen && (
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:"rgba(0,0,0,0.97)",borderBottom:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",padding:"80px 24px 24px",display:"flex",flexDirection:"column",gap:4,animation:"fadeUp 0.2s ease both"}}>
          {LINKS.map(([label,href])=>(
            <a key={href} href={href} onClick={()=>setMenuOpen(false)} style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:href==="/espacio"?"#fff":"rgba(255,255,255,0.55)",textDecoration:"none",padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"color 0.2s"}}>{label}</a>
          ))}
        </div>
      )}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",animation:"fadeIn 0.6s ease both",gap:16,position:"relative",zIndex:160}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",flexShrink:0}}>
          {!logoError
            ?<img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:52,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 14px rgba(10,28,80,0.55)) brightness(1.08)"}}/>
            :<span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#fff"}}>AO</span>
          }
          <div>
            <div style={{display:"flex",alignItems:"baseline",gap:7}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.06em",color:"#fff"}}>AUSTRAL</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:400,letterSpacing:"0.18em",color:accentColor,transition:"color 0.6s"}}>ORBIT</span>
            </div>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7,letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase"}}>Santiago · 33.4°S</span>
          </div>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}} className="nav-desktop">
          {LINKS.map(([label,href])=>(
            <a key={href} href={href} style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:href==="/espacio"?"#fff":"rgba(255,255,255,0.5)",padding:"8px 18px",borderRadius:99,background:href==="/espacio"?"rgba(255,255,255,0.06)":"transparent",border:href==="/espacio"?"1px solid rgba(255,255,255,0.12)":"1px solid transparent",textDecoration:"none",whiteSpace:"nowrap",transition:"all 0.2s"}}>{label}</a>
          ))}
        </div>
        <button onClick={()=>setMenuOpen(o=>!o)} aria-label="Menú" className="nav-hamburger">
          <span style={{transform:menuOpen?"rotate(45deg) translate(4.5px,4.5px)":"none"}}/>
          <span style={{opacity:menuOpen?0:1}}/>
          <span style={{transform:menuOpen?"rotate(-45deg) translate(4.5px,-4.5px)":"none"}}/>
        </button>
      </nav>
    </>
  );
}

function KpGauge({ kp }) {
  const pct   = (kp / 9) * 100;
  const color = kp >= 7 ? "#f87171" : kp >= 5 ? "#fbbf24" : kp >= 3 ? "#57C7FF" : "#4ade80";
  const label = kp >= 7 ? "TORMENTA SEVERA" : kp >= 5 ? "TORMENTA MODERADA" : kp >= 3 ? "ACTIVO" : "TRANQUILO";
  const desc  = kp >= 7 ? "Auroras visibles hasta latitudes medias" : kp >= 5 ? "Auroras en Tierra del Fuego y sur de Chile" : kp >= 3 ? "Actividad geomagnética elevada" : "Condiciones espaciales normales";
  return (
    <div style={{borderRadius:16,padding:"24px 28px",background:"rgba(255,255,255,0.02)",border:`1px solid ${color}22`,backdropFilter:"blur(12px)",transition:"border-color 0.6s"}}>
      <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.22em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:16}}>Índice Kp planetario</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:16,marginBottom:8}}>
        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:72,fontWeight:600,color,lineHeight:1,letterSpacing:"-0.02em",transition:"color 0.6s"}}>{kp.toFixed(1)}</div>
        <div style={{paddingBottom:10}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color,marginBottom:4,transition:"color 0.6s"}}>{label}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:"'IBM Plex Mono',monospace"}}>{desc}</div>
        </div>
      </div>
      <div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:8}}>
        <div style={{height:"100%",width:`${pct}%`,borderRadius:5,background:"linear-gradient(90deg, #4ade80, #57C7FF, #fbbf24, #f87171)",backgroundSize:"900px 100%",transition:"width 1.2s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.15)"}}>
        {[0,1,2,3,4,5,6,7,8,9].map(n=><span key={n} style={{fontWeight:n===Math.round(kp)?600:400,color:n===Math.round(kp)?color:"rgba(255,255,255,0.15)"}}>{n}</span>)}
      </div>
    </div>
  );
}

function AuroraChileMap({ kp }) {
  const activeZone = [...AURORA_ZONES].reverse().find(z=>kp>=z.kp) || AURORA_ZONES[0];
  const auroraColor = kp >= 5 ? "#6EE7B7" : "#57C7FF";

  // Chile simplificado como línea vertical con ciudades
  const CITIES = [
    { name:"Arica",          lat:-18.5, y:20  },
    { name:"Antofagasta",    lat:-23.7, y:62  },
    { name:"La Serena",      lat:-29.9, y:112 },
    { name:"Santiago",       lat:-33.4, y:148 },
    { name:"Concepción",     lat:-36.8, y:177 },
    { name:"Valdivia",       lat:-39.8, y:202 },
    { name:"Puerto Montt",   lat:-41.5, y:215 },
    { name:"Coyhaique",      lat:-45.6, y:248 },
    { name:"Pto. Natales",   lat:-51.7, y:287 },
    { name:"Pto. Arenas",    lat:-53.2, y:298 },
    { name:"Tierra del Fuego",lat:-54.5,y:308 },
  ];

  // latitud de la zona activa de aurora
  const auroraLatNum = activeZone.latNum;
  // y en el SVG para esa latitud: escala aprox (-17 a -56) → (20 a 308)
  const scaleY = (lat) => 20 + ((lat - (-17)) / ((-56) - (-17))) * (308 - 20);
  const auroraY = scaleY(auroraLatNum);

  return (
    <div style={{borderRadius:16,padding:"20px 22px",background:"rgba(255,255,255,0.018)",border:`1px solid ${auroraColor}22`,backdropFilter:"blur(10px)",transition:"border-color 0.6s"}}>
      <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.18em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:16}}>
        Zona de aurora austral — Chile
      </div>
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:24,alignItems:"start"}}>
        {/* Mapa esquemático de Chile */}
        <svg viewBox="0 0 100 330" style={{width:80,flexShrink:0}}>
          {/* Aurora fill desde el sur hasta la latitud activa */}
          {kp >= 5 && (
            <rect x="20" y={auroraY} width="40" height={330-auroraY}
              fill={auroraColor} fillOpacity="0.15" rx="4"/>
          )}
          {/* Línea de aurora */}
          {kp >= 5 && (
            <>
              <line x1="10" y1={auroraY} x2="70" y2={auroraY}
                stroke={auroraColor} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8"/>
              <text x="72" y={auroraY+4} fontSize="6" fill={auroraColor} opacity="0.9"
                fontFamily="'IBM Plex Mono',monospace">≈{activeZone.lat}</text>
            </>
          )}
          {/* Silueta Chile */}
          <rect x="28" y="16" width="24" height="300" rx="6"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
          {/* Ciudades */}
          {CITIES.map(c => {
            const active = kp >= 5 && c.lat <= activeZone.latNum;
            return (
              <g key={c.name}>
                <circle cx="40" cy={c.y} r={active?3:1.5}
                  fill={active?auroraColor:"rgba(255,255,255,0.25)"}
                  opacity={active?0.9:0.5}/>
              </g>
            );
          })}
        </svg>

        {/* Lista de zonas */}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {AURORA_ZONES.filter(z=>z.kp>=3).map(z=>{
            const active = kp >= z.kp;
            const isCurrentZone = z === activeZone;
            return (
              <div key={z.kp} style={{
                display:"flex",alignItems:"center",gap:10,padding:"8px 12px",
                borderRadius:9,
                background:active?auroraColor+"0f":"rgba(255,255,255,0.02)",
                border:`1px solid ${active?auroraColor+"35":"rgba(255,255,255,0.04)"}`,
                transition:"all 0.5s",
              }}>
                <div style={{
                  width:28,height:28,borderRadius:8,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  background:active?auroraColor+"20":"rgba(255,255,255,0.04)",
                  border:`1px solid ${active?auroraColor+"40":"rgba(255,255,255,0.06)"}`,
                  fontFamily:"'IBM Plex Mono',monospace",fontSize:9,
                  color:active?auroraColor:"rgba(255,255,255,0.2)",fontWeight:600,
                  transition:"all 0.5s",
                }}>Kp{z.kp}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:500,color:active?"#E0E8F0":"rgba(255,255,255,0.3)",transition:"color 0.5s",fontFamily:"'Syne',sans-serif"}}>{z.place}</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace"}}>{z.lat}</div>
                </div>
                {active && <div style={{fontSize:9,color:auroraColor,fontFamily:"'IBM Plex Mono',monospace"}}>✓ VISIBLE</div>}
                {isCurrentZone && kp>=5 && <div style={{display:"block",width:6,height:6,borderRadius:"50%",background:auroraColor,boxShadow:`0 0 8px ${auroraColor}`,animation:"livePulse 2s infinite"}}/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KpHistory({ history }) {
  if (!history.length) return null;
  const last48 = history.slice(-48);
  const maxKp = Math.max(...last48.map(d=>parseFloat(d.kp_index)||0), 1);
  return (
    <div style={{borderRadius:16,padding:"20px 22px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(10px)"}}>
      <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.18em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:16}}>
        Historial Kp — últimas 48 mediciones
      </div>
      <div style={{display:"flex",alignItems:"flex-end",gap:1.5,height:80,position:"relative"}}>
        {/* Líneas de referencia */}
        {[3,5,7].map(kpLine=>(
          <div key={kpLine} style={{
            position:"absolute",left:0,right:0,
            bottom:`${(kpLine/9)*100}%`,
            borderTop:`1px dashed rgba(255,255,255,${kpLine>=7?"0.15":kpLine>=5?"0.10":"0.06"})`,
            pointerEvents:"none",
          }}>
            <span style={{position:"absolute",right:0,top:-8,fontSize:7,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)"}}>G{kpLine>=9?5:kpLine>=7?3:kpLine>=5?1:""} {kpLine}</span>
          </div>
        ))}
        {last48.map((d,i)=>{
          const v = parseFloat(d.kp_index)||0;
          const h = Math.max(2,(v/9)*80);
          const c = v>=7?"#f87171":v>=5?"#fbbf24":v>=3?"#57C7FF":"#334155";
          return (
            <div key={i} title={`Kp ${v.toFixed(1)}`}
              style={{flex:1,height:`${h}px`,borderRadius:"2px 2px 0 0",background:c,opacity:i===last48.length-1?1:0.7,minWidth:0,transition:"height 0.5s ease"}}/>
          );
        })}
      </div>
      <div style={{marginTop:6,display:"flex",justifyContent:"space-between",fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.15)"}}>
        <span>48 mediciones atrás</span><span>Ahora</span>
      </div>
    </div>
  );
}

export default function SpaceWeather() {
  usePageMeta({
    title:       "Clima espacial y aurora austral hoy",
    description: "Índice Kp actual, viento solar y probabilidad de aurora austral visible desde Chile. Datos en tiempo real de NOAA.",
    url:         "https://australorbit.com/espacio",
  });

  const { userCity, userCountry, userCountryCode, userLat, userLon, geoPrompt, setGeoPrompt, requestGeo } = useGeoLocation();

  const [kp, setKp]               = useState(null);
  const [kpHistory, setKpHistory] = useState([]);
  const [wind, setWind]           = useState(null);
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [now, setNow]             = useState(new Date());
  const [logoError, setLogoError] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [skyLocal, setSkyLocal]   = useState(null); // clima local Open-Meteo

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const fetchData = () => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLon}&current=cloud_cover,visibility,weather_code&timezone=auto`)
      .then(r=>r.json()).then(d=>{ const c=d.current; setSkyLocal({clouds:c.cloud_cover,visibility:c.visibility/1000,code:c.weather_code}); }).catch(()=>{});
    fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json")
      .then(r=>r.json()).then(d=>{if(d.length){setKpHistory(d.slice(-48));setKp(parseFloat(d[d.length-1].kp_index));setLastUpdate(new Date());}setLoading(false);}).catch(()=>setLoading(false));
    fetch("https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json")
      .then(r=>r.json()).then(d=>{const last=d.filter(r=>r.speed!==null).slice(-1)[0];if(last)setWind(last);}).catch(()=>{});
    fetch("https://services.swpc.noaa.gov/products/alerts.json")
      .then(r=>r.json()).then(d=>setAlerts(d.slice(0,3))).catch(()=>{});
  };

  useEffect(()=>{fetchData();const t=setInterval(fetchData,60000);return()=>clearInterval(t);},[]);

  const currentKp   = kp ?? 0;
  const auroraChile = currentKp >= 5;
  const auroraColor = auroraChile ? "#6EE7B7" : "#57C7FF";

  // Función cielo local
  function skyCondition(clouds, code) {
    if (code >= 61) return { label: "Lluvia", color: "#64748b", icon: "🌧", score: 0 };
    if (clouds >= 80) return { label: "Muy nublado", color: "#475569", icon: "☁️", score: 1 };
    if (clouds >= 50) return { label: "Parcialmente nublado", color: "#f59e0b", icon: "⛅", score: 2 };
    if (clouds >= 20) return { label: "Mayormente despejado", color: "#57C7FF", icon: "🌤", score: 3 };
    return { label: "Cielo despejado", color: "#4ade80", icon: "★", score: 4 };
  }
  const skyCond = skyLocal ? skyCondition(skyLocal.clouds, skyLocal.code) : null;

  return (
    <>
      {geoPrompt && <GeoSplash onAccept={requestGeo} onSkip={()=>setGeoPrompt(false)} accentColor={auroraColor}/>}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#050816;color:#E0E8F0;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#0C2040;border-radius:2px;}
        button,a{cursor:pointer;font-family:inherit;}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.15;transform:scale(1.5)}}
        @keyframes auroraF3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(2%,3%) scale(1.05)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{opacity:0.4}50%{opacity:1}100%{opacity:0.4}}
        .stat-card{border-radius:13px;padding:18px 20px;background:rgba(255,255,255,0.018);border:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(10px);}
        .nav-hamburger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;flex-direction:column;gap:5px;padding:0;flex-shrink:0;}
        .nav-hamburger span{display:block;width:18px;height:1.5px;background:rgba(255,255,255,0.8);border-radius:2px;transition:all 0.25s;}
        @media(max-width:600px){
          .nav-desktop{display:none!important;}
          .nav-hamburger{display:flex!important;}
          .page-pad{padding:0 16px!important;}
          .sw-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* Background */}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 130% 90% at 65% 15%, #0D1B2A 0%, #050816 50%, #07111F 100%)"}}/>
        <div style={{position:"absolute",top:"-20%",left:"10%",width:"90vw",height:"80vh",borderRadius:"50%",background:`radial-gradient(ellipse, ${auroraColor}${auroraChile?"14":"08"} 0%, transparent 68%)`,transition:"background 2s ease",animation:"auroraF3 18s ease-in-out infinite"}}/>
        {auroraChile && <div style={{position:"absolute",bottom:"-10%",right:"-5%",width:"60vw",height:"50vh",borderRadius:"50%",background:"radial-gradient(ellipse, #6EE7B710 0%, transparent 68%)",animation:"auroraF3 24s ease-in-out infinite reverse"}}/>}
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.02}}>
          <defs><pattern id="pg3" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg3)"/>
        </svg>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          {Array.from({length:40},(_,i)=>({x:((i*177.3)%100).toFixed(1),y:((i*91.7)%100).toFixed(1),r:i%8===0?1.1:0.35,op:(0.05+(i%5)*0.04).toFixed(2),dur:3+(i%6),del:(i%9)*0.6})).map((s,i)=>(
            <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
              <animate attributeName="opacity" values={`${s.op};${(s.op*0.08).toFixed(2)};${s.op}`} dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
            </circle>
          ))}
        </svg>
      </div>

      <div className="page-pad" style={{position:"relative",zIndex:1,padding:"0 22px",minHeight:"100vh"}}>
        <div style={{maxWidth:940,margin:"0 auto"}}>

          <Nav logoError={logoError} setLogoError={setLogoError} menuOpen={menuOpen} setMenuOpen={setMenuOpen} accentColor={auroraColor}/>

          {/* Hero */}
          <div style={{padding:"44px 0 32px",animation:"fadeUp 0.8s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 12px",borderRadius:20,background:`${auroraColor}12`,border:`1px solid ${auroraColor}28`,marginBottom:20,transition:"all 0.6s"}}>
              <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:auroraColor,animation:"livePulse 2s infinite"}}/>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:auroraColor,letterSpacing:"0.2em",transition:"color 0.6s"}}>NOAA SWPC · ACTUALIZACIÓN CADA 1 MIN</span>
            </div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:14,color:"#F5F7FA"}}>
              Clima <span style={{color:auroraColor,transition:"color 0.6s"}}>espacial</span><br/>en tiempo real
            </h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.3)",lineHeight:1.75,fontWeight:300,maxWidth:500,marginBottom:8}}>
              Actividad geomagnética, viento solar y probabilidad de aurora austral sobre {userCity}, {userCountry}.
            </p>
            {lastUpdate && (
              <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em"}}>
                Última actualización: {pad(lastUpdate.getHours())}:{pad(lastUpdate.getMinutes())}:{pad(lastUpdate.getSeconds())}
                {" · "}
                <span style={{color:auroraColor}}>Kp {currentKp.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div style={{height:1,background:`linear-gradient(90deg,transparent,${auroraColor}40,transparent)`,transition:"background 0.6s",marginBottom:28}}/>

          {loading && (
            <div style={{padding:60,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:14,animation:"shimmer 1.5s infinite"}}>🌌</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#57C7FF",letterSpacing:"0.16em"}}>CONECTANDO CON NOAA SWPC...</div>
              <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:10}}>
                {[0,1,2].map(i=><span key={i} style={{display:"block",width:4,height:4,borderRadius:"50%",background:"#57C7FF",animation:`livePulse 1.4s ease-in-out ${i*0.22}s infinite`}}/>)}
              </div>
            </div>
          )}

          {!loading && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}} className="sw-grid">

              {/* Cielo local del usuario */}
              {skyCond && (
                <div style={{gridColumn:"1 / -1",borderRadius:16,padding:"16px 20px",background:`${skyCond.color}08`,border:`1px solid ${skyCond.color}25`,backdropFilter:"blur(10px)",display:"flex",alignItems:"center",gap:16,transition:"all 0.6s",animation:"fadeUp 0.5s ease both"}}>
                  <span style={{fontSize:32}}>{skyCond.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:4}}>Cielo ahora en {userCity}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:skyCond.color}}>{skyCond.label}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>
                      Nubosidad {skyLocal.clouds}% · Visibilidad {skyLocal.visibility >= 20 ? "+20 km" : `${skyLocal.visibility.toFixed(0)} km`}
                      {" · "}{skyCond.score >= 3 ? "✓ Buenas condiciones para observar" : skyCond.score >= 2 ? "Observación posible" : "Difícil observar satélites"}
                    </div>
                  </div>
                </div>
              )}

              {/* Gauge Kp */}
              <div style={{gridColumn:"1 / -1"}}><KpGauge kp={currentKp}/></div>

              {/* Banner aurora */}
              <div style={{
                gridColumn:"1 / -1",borderRadius:16,padding:"20px 24px",
                background:auroraChile?`${auroraColor}0d`:"rgba(255,255,255,0.018)",
                border:`1px solid ${auroraChile?auroraColor+"33":"rgba(255,255,255,0.06)"}`,
                backdropFilter:"blur(10px)",transition:"all 0.6s",
              }}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:auroraChile?16:0}}>
                  <span style={{fontSize:28}}>{auroraChile?"🌌":"🔭"}</span>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:auroraChile?auroraColor:"#F0F4F8",marginBottom:3,transition:"color 0.6s"}}>
                      {auroraChile?"¡Aurora austral posible sobre Chile!":"Sin actividad de aurora en Chile"}
                    </div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontFamily:"'IBM Plex Mono',monospace"}}>
                      {auroraChile
                        ? `Kp ${currentKp.toFixed(1)} — zona visible: ${[...AURORA_ZONES].reverse().find(z=>currentKp>=z.kp)?.place}`
                        : `Kp ${currentKp.toFixed(1)} — se necesita Kp ≥ 5 para aurora en Tierra del Fuego`}
                    </div>
                  </div>
                </div>
                {auroraChile && (
                  <div style={{marginTop:8,padding:"10px 14px",borderRadius:10,background:"rgba(0,0,0,0.25)",border:`1px solid ${auroraColor}20`,fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.7}}>
                    💡 Para verla: busca un lugar oscuro alejado de la ciudad. Mira hacia el sur, cerca del horizonte. Una cámara de celular capta la aurora mejor que el ojo humano — intenta con 5–10 segundos de exposición.
                  </div>
                )}
              </div>

              {/* Mapa de visibilidad por zona */}
              <div style={{gridColumn:"1 / -1"}}>
                <AuroraChileMap kp={currentKp}/>
              </div>

              {/* Viento solar */}
              {wind && (
                <div className="stat-card">
                  <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:14}}>Viento solar</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[
                      ["Velocidad", wind.speed?`${Math.round(wind.speed)} km/s`:"—", wind.speed>600?"#f87171":wind.speed>400?"#fbbf24":"#4ade80"],
                      ["Densidad",  wind.density?`${wind.density.toFixed(1)} p/cm³`:"—", "#57C7FF"],
                      ["Bz (IMF)",  wind.bz_gsm!=null?`${wind.bz_gsm.toFixed(1)} nT`:"—", wind.bz_gsm<-10?"#f87171":wind.bz_gsm<0?"#fbbf24":"#4ade80"],
                      ["Temperatura",wind.temperature?`${(wind.temperature/1e6).toFixed(2)} MK`:"—","#a78bfa"],
                    ].map(([l,v,c])=>(
                      <div key={l} style={{padding:"9px 11px",borderRadius:9,background:"rgba(3,8,20,0.5)",border:"1px solid rgba(255,255,255,0.04)"}}>
                        <div style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
                        <div style={{fontSize:13,fontFamily:"'IBM Plex Mono',monospace",color:c,fontWeight:500}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {wind.bz_gsm<-10&&<div style={{marginTop:10,padding:"7px 11px",borderRadius:8,background:"#f8741610",border:"1px solid #f8741630",fontSize:10,color:"#fb923c",fontFamily:"'IBM Plex Mono',monospace"}}>⚠️ Bz negativo intenso — mayor probabilidad de aurora</div>}
                </div>
              )}

              {/* Escala G */}
              <div className="stat-card">
                <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:14}}>Escala NOAA G</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[
                    {g:"G1",kpMin:5,label:"Menor",      desc:"Fluctuaciones eléctricas menores",        color:"#fbbf24"},
                    {g:"G2",kpMin:6,label:"Moderada",    desc:"Alertas de voltaje en redes eléctricas",  color:"#fb923c"},
                    {g:"G3",kpMin:7,label:"Fuerte",      desc:"Aurora visible en latitudes medias",       color:"#f87171"},
                    {g:"G4",kpMin:8,label:"Severa",      desc:"Problemas en redes eléctricas",            color:"#e879f9"},
                    {g:"G5",kpMin:9,label:"Extrema",     desc:"Apagones masivos posibles",                color:"#c026d3"},
                  ].map(row=>(
                    <div key={row.g} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:8,background:currentKp>=row.kpMin?`${row.color}10`:"rgba(255,255,255,0.02)",border:`1px solid ${currentKp>=row.kpMin?row.color+"30":"rgba(255,255,255,0.04)"}`,transition:"all 0.5s"}}>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600,color:currentKp>=row.kpMin?row.color:"rgba(255,255,255,0.15)",minWidth:26,transition:"color 0.5s"}}>{row.g}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:currentKp>=row.kpMin?"#E0E8F0":"rgba(255,255,255,0.3)",fontWeight:500,transition:"color 0.5s"}}>{row.label}</div>
                        <div style={{fontSize:8.5,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace"}}>{row.desc}</div>
                      </div>
                      <span style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.15)"}}>Kp≥{row.kpMin}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historial */}
              <div style={{gridColumn:"1 / -1"}}><KpHistory history={kpHistory}/></div>

              {/* Alertas NOAA */}
              {alerts.length > 0 && (
                <div style={{gridColumn:"1 / -1",borderRadius:16,padding:"20px 22px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(248,113,113,0.15)",backdropFilter:"blur(10px)"}}>
                  <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:14}}>
                    ⚠️ Alertas NOAA recientes
                  </div>
                  {alerts.map((a,i)=>(
                    <div key={i} style={{padding:"10px 14px",borderRadius:9,background:"rgba(248,113,113,0.05)",border:"1px solid rgba(248,113,113,0.12)",marginBottom:7,fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.6,fontFamily:"monospace"}}>
                      {a.message?.split("\n").slice(0,3).join(" · ")||"—"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{height:1,background:`linear-gradient(90deg,transparent,${auroraColor}20,transparent)`,transition:"background 0.6s"}}/>
          <div style={{padding:"14px 0 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,0.1)",fontFamily:"'IBM Plex Mono',monospace"}}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{fontSize:8.5,color:"rgba(255,255,255,0.1)",fontFamily:"'IBM Plex Mono',monospace"}}>Datos: NOAA Space Weather Prediction Center</div>
          </div>
        </div>
      </div>
    </>
  );
}
