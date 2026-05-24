import { useState, useEffect } from "react";

const pad = n => String(n).padStart(2, "0");

function CosmicBg({ kp }) {
  const aurora = kp >= 5;
  const color  = aurora ? "#6EE7B7" : "#57C7FF";
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 130% 90% at 65% 15%, #0D1B2A 0%, #050816 50%, #07111F 100%)"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.032}}>
        <filter id="fn3"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#fn3)"/>
      </svg>
      <div style={{position:"absolute",top:"-20%",left:"10%",width:"90vw",height:"80vh",borderRadius:"50%",background:`radial-gradient(ellipse, ${color}${aurora?"14":"08"} 0%, transparent 68%)`,transition:"background 2s ease",animation:"auroraF3 18s ease-in-out infinite"}}/>
      {aurora && <div style={{position:"absolute",bottom:"-10%",right:"-5%",width:"60vw",height:"50vh",borderRadius:"50%",background:"radial-gradient(ellipse, #6EE7B710 0%, transparent 68%)",animation:"auroraF3 24s ease-in-out infinite reverse"}}/>}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        {Array.from({length:45},(_,i)=>({
          x:((i*177.3)%100).toFixed(1),y:((i*91.7)%100).toFixed(1),
          r:i%8===0?1.2:0.4,op:(0.06+(i%5)*0.05).toFixed(2),dur:3+(i%6),del:(i%9)*0.6,
        })).map((s,i)=>(
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
            <animate attributeName="opacity" values={`${s.op};${(s.op*0.08).toFixed(2)};${s.op}`} dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.02}}>
        <defs><pattern id="pg3" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#pg3)"/>
      </svg>
    </div>
  );
}

function KpGauge({ kp }) {
  const pct   = (kp / 9) * 100;
  const color = kp >= 7 ? "#f87171" : kp >= 5 ? "#fbbf24" : kp >= 3 ? "#57C7FF" : "#4ade80";
  const label = kp >= 7 ? "TORMENTA SEVERA" : kp >= 5 ? "TORMENTA MODERADA" : kp >= 3 ? "ACTIVO" : "TRANQUILO";
  return (
    <div style={{borderRadius:16,padding:"24px 28px",background:"rgba(255,255,255,0.02)",border:`1px solid ${color}22`,backdropFilter:"blur(12px)",transition:"border-color 0.6s"}}>
      <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.22em",color:"#1E3A50",textTransform:"uppercase",marginBottom:16}}>Índice Kp planetario</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:16,marginBottom:20}}>
        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:72,fontWeight:600,color,lineHeight:1,letterSpacing:"-0.02em",transition:"color 0.6s"}}>{kp.toFixed(1)}</div>
        <div style={{paddingBottom:8}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color,marginBottom:4,transition:"color 0.6s"}}>{label}</div>
          <div style={{fontSize:10,color:"#334155",fontFamily:"'IBM Plex Mono',monospace"}}>Escala 0–9</div>
        </div>
      </div>
      <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:10}}>
        <div style={{height:"100%",width:`${pct}%`,borderRadius:4,background:"linear-gradient(90deg, #4ade80, #57C7FF, #fbbf24, #f87171)",backgroundSize:"900px 100%",transition:"width 1s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50"}}>
        {[0,1,2,3,4,5,6,7,8,9].map(n=><span key={n}>{n}</span>)}
      </div>
    </div>
  );
}

function KpHistory({ history }) {
  if (!history.length) return null;
  const last24 = history.slice(-24);
  return (
    <div style={{borderRadius:16,padding:"20px 22px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(10px)"}}>
      <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.18em",color:"#1E3A50",textTransform:"uppercase",marginBottom:16}}>Historial Kp — últimas 24 mediciones</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:2,height:80}}>
        {last24.map((d,i)=>{
          const v = parseFloat(d.kp_index)||0;
          const h = Math.max(2,(v/9)*80);
          const c = v>=7?"#f87171":v>=5?"#fbbf24":v>=3?"#57C7FF":"#334155";
          return <div key={i} title={`Kp ${v.toFixed(1)}`} style={{flex:1,height:`${h}px`,borderRadius:"2px 2px 0 0",background:c,opacity:0.8,minWidth:0}}/>;
        })}
      </div>
      <div style={{marginTop:6,display:"flex",justifyContent:"space-between",fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50"}}>
        <span>-24 mediciones</span><span>Ahora</span>
      </div>
    </div>
  );
}

const AURORA_ZONES = [
  { kp:0, lat:"< 66°S", place:"Antártica",          visible:false },
  { kp:3, lat:"~60°S",  place:"Islas Malvinas",      visible:false },
  { kp:5, lat:"~55°S",  place:"Tierra del Fuego",    visible:true  },
  { kp:6, lat:"~50°S",  place:"Puerto Natales",       visible:true  },
  { kp:7, lat:"~45°S",  place:"Coyhaique",            visible:true  },
  { kp:8, lat:"~40°S",  place:"Valdivia / Osorno",   visible:true  },
  { kp:9, lat:"~35°S",  place:"Santiago / Concepción",visible:true  },
];

/* ── NAV COMPARTIDO ── */
function Nav({ logoError, setLogoError, menuOpen, setMenuOpen, activePath, accentColor }) {
  const LINKS = [
    ["Rastreo",        "/"],
    ["Lanzamientos",   "/lanzamientos"],
    ["Clima espacial", "/espacio"],
    ["Contacto",       "/contacto"],
  ];
  return (
    <>
      {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:140,background:"rgba(0,0,0,0.5)"}}/>}
      {menuOpen && (
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:"rgba(0,0,0,0.97)",borderBottom:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",padding:"80px 24px 24px",display:"flex",flexDirection:"column",gap:4,animation:"fadeUp 0.2s ease both"}}>
          {LINKS.map(([label,href])=>(
            <a key={href} href={href} onClick={()=>setMenuOpen(false)} style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:href===activePath?"#fff":"rgba(255,255,255,0.55)",textDecoration:"none",padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"color 0.2s"}}>{label}</a>
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
            <a key={href} href={href} style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:href===activePath?"#fff":"rgba(255,255,255,0.5)",padding:"8px 18px",borderRadius:99,background:href===activePath?"rgba(255,255,255,0.06)":"transparent",border:href===activePath?"1px solid rgba(255,255,255,0.12)":"1px solid transparent",textDecoration:"none",whiteSpace:"nowrap",transition:"all 0.2s"}}>{label}</a>
          ))}
        </div>
        <button onClick={()=>setMenuOpen(o=>!o)} aria-label="Menú" className="nav-hamburger" style={{display:"none",alignItems:"center",justifyContent:"center",width:40,height:40,borderRadius:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",flexDirection:"column",gap:5,padding:0,flexShrink:0}}>
          <span style={{display:"block",width:18,height:1.5,background:"rgba(255,255,255,0.8)",borderRadius:2,transition:"all 0.25s",transform:menuOpen?"rotate(45deg) translate(4.5px,4.5px)":"none"}}/>
          <span style={{display:"block",width:18,height:1.5,background:"rgba(255,255,255,0.8)",borderRadius:2,transition:"all 0.25s",opacity:menuOpen?0:1}}/>
          <span style={{display:"block",width:18,height:1.5,background:"rgba(255,255,255,0.8)",borderRadius:2,transition:"all 0.25s",transform:menuOpen?"rotate(-45deg) translate(4.5px,-4.5px)":"none"}}/>
        </button>
      </nav>
    </>
  );
}

export default function SpaceWeather() {
  const [kp, setKp]               = useState(null);
  const [kpHistory, setKpHistory] = useState([]);
  const [wind, setWind]           = useState(null);
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [now, setNow]             = useState(new Date());
  const [logoError, setLogoError] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const fetchData = () => {
    fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json")
      .then(r=>r.json()).then(d=>{if(d.length){setKpHistory(d.slice(-48));setKp(parseFloat(d[d.length-1].kp_index));setLastUpdate(new Date());}setLoading(false);}).catch(()=>setLoading(false));
    fetch("https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json")
      .then(r=>r.json()).then(d=>{const last=d.filter(r=>r.speed!==null).slice(-1)[0];if(last)setWind(last);}).catch(()=>{});
    fetch("https://services.swpc.noaa.gov/products/alerts.json")
      .then(r=>r.json()).then(d=>setAlerts(d.slice(0,5))).catch(()=>{});
  };

  useEffect(()=>{fetchData();const t=setInterval(fetchData,60000);return()=>clearInterval(t);},[]);

  const currentKp   = kp ?? 0;
  const auroraZone  = [...AURORA_ZONES].reverse().find(z=>currentKp>=z.kp)||AURORA_ZONES[0];
  const auroraChile = currentKp >= 5;
  const auroraColor = auroraChile ? "#6EE7B7" : "#57C7FF";

  return (
    <>
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
        @media(max-width:600px){
          .nav-desktop{display:none!important;}
          .nav-hamburger{display:flex!important;}
          .page-pad{padding:0 16px!important;}
          .sw-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      <CosmicBg kp={currentKp}/>

      <div className="page-pad" style={{position:"relative",zIndex:1,padding:"0 22px",minHeight:"100vh"}}>
        <div style={{maxWidth:940,margin:"0 auto"}}>

          <Nav logoError={logoError} setLogoError={setLogoError} menuOpen={menuOpen} setMenuOpen={setMenuOpen} activePath="/espacio" accentColor={auroraColor}/>

          {/* HERO */}
          <div style={{padding:"44px 0 32px",animation:"fadeUp 0.8s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 12px",borderRadius:20,background:`${auroraColor}12`,border:`1px solid ${auroraColor}28`,marginBottom:20,transition:"all 0.6s"}}>
              <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:auroraColor,animation:"livePulse 2s infinite"}}/>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:auroraColor,letterSpacing:"0.2em",transition:"color 0.6s"}}>NOAA SWPC · ACTUALIZACIÓN CADA 1 MIN</span>
            </div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:14,color:"#F5F7FA"}}>
              Clima <span style={{color:auroraColor,transition:"color 0.6s"}}>espacial</span><br/>en tiempo real
            </h1>
            <p style={{fontSize:15,color:"#334155",lineHeight:1.75,fontWeight:300,maxWidth:500,marginBottom:8}}>
              Actividad geomagnética, viento solar y probabilidad de aurora austral sobre Chile.
            </p>
            {lastUpdate && <div style={{fontSize:9,color:"#1E3A50",fontFamily:"'IBM Plex Mono',monospace"}}>Última actualización: {pad(lastUpdate.getHours())}:{pad(lastUpdate.getMinutes())}:{pad(lastUpdate.getSeconds())}</div>}
          </div>

          <div style={{height:1,background:`linear-gradient(90deg,transparent,${auroraColor}40,transparent)`,transition:"background 0.6s",marginBottom:28}}/>

          {loading && <div style={{padding:60,textAlign:"center"}}><div style={{fontSize:28,marginBottom:14,animation:"shimmer 1.5s infinite"}}>🌌</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#57C7FF",letterSpacing:"0.16em"}}>Conectando con NOAA...</div></div>}

          {!loading && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}} className="sw-grid">
              <div style={{gridColumn:"1 / -1"}}><KpGauge kp={currentKp}/></div>

              <div style={{gridColumn:"1 / -1",borderRadius:16,padding:"20px 24px",background:auroraChile?`${auroraColor}0d`:"rgba(255,255,255,0.018)",border:`1px solid ${auroraChile?auroraColor+"33":"rgba(255,255,255,0.06)"}`,backdropFilter:"blur(10px)",transition:"all 0.6s"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <span style={{fontSize:28}}>{auroraChile?"🌌":"🔭"}</span>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:auroraChile?auroraColor:"#F0F4F8",marginBottom:3,transition:"color 0.6s"}}>{auroraChile?"¡Aurora austral posible sobre Chile!":"Sin actividad de aurora en Chile"}</div>
                    <div style={{fontSize:11,color:"#64748b",fontFamily:"'IBM Plex Mono',monospace"}}>Kp {currentKp.toFixed(1)} · Zona visible estimada: {auroraZone.lat} ({auroraZone.place})</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
                  {AURORA_ZONES.slice(2).map(z=>(
                    <div key={z.kp} style={{padding:"9px 12px",borderRadius:9,background:currentKp>=z.kp?auroraColor+"0f":"rgba(255,255,255,0.02)",border:`1px solid ${currentKp>=z.kp?auroraColor+"30":"rgba(255,255,255,0.04)"}`,transition:"all 0.5s"}}>
                      <div style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50",marginBottom:4,letterSpacing:"0.1em"}}>Kp ≥ {z.kp}</div>
                      <div style={{fontSize:11,fontFamily:"'IBM Plex Mono',monospace",color:currentKp>=z.kp?auroraColor:"#334155",fontWeight:500,transition:"color 0.5s"}}>{z.place}</div>
                      <div style={{fontSize:8.5,color:"#1E3A50",marginTop:2}}>{z.lat}</div>
                    </div>
                  ))}
                </div>
              </div>

              {wind && (
                <div className="stat-card">
                  <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:14}}>Viento solar</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[["Velocidad",wind.speed?`${Math.round(wind.speed)} km/s`:"—",wind.speed>600?"#f87171":wind.speed>400?"#fbbf24":"#4ade80"],["Densidad",wind.density?`${wind.density.toFixed(1)} p/cm³`:"—","#57C7FF"],["Bz (IMF)",wind.bz_gsm!=null?`${wind.bz_gsm.toFixed(1)} nT`:"—",wind.bz_gsm<-10?"#f87171":wind.bz_gsm<0?"#fbbf24":"#4ade80"],["Temperatura",wind.temperature?`${(wind.temperature/1e6).toFixed(2)} MK`:"—","#a78bfa"]].map(([l,v,c])=>(
                      <div key={l} style={{padding:"9px 11px",borderRadius:9,background:"rgba(3,8,20,0.5)",border:"1px solid rgba(255,255,255,0.04)"}}>
                        <div style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
                        <div style={{fontSize:13,fontFamily:"'IBM Plex Mono',monospace",color:c,fontWeight:500}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {wind.bz_gsm<-10&&<div style={{marginTop:10,padding:"7px 11px",borderRadius:8,background:"#f8741610",border:"1px solid #f8741630",fontSize:10,color:"#fb923c",fontFamily:"'IBM Plex Mono',monospace"}}>⚠️ Bz negativo intenso — mayor probabilidad de aurora</div>}
                </div>
              )}

              <div className="stat-card">
                <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:14}}>Escala NOAA G</div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {[{g:"G1",kpMin:5,label:"Menor",desc:"Fluctuaciones eléctricas menores",color:"#fbbf24"},{g:"G2",kpMin:6,label:"Moderada",desc:"Alertas de voltaje en redes",color:"#fb923c"},{g:"G3",kpMin:7,label:"Fuerte",desc:"Posible aurora en latitudes medias",color:"#f87171"},{g:"G4",kpMin:8,label:"Severa",desc:"Problemas en redes eléctricas",color:"#e879f9"},{g:"G5",kpMin:9,label:"Extrema",desc:"Apagones masivos posibles",color:"#c026d3"}].map(row=>(
                    <div key={row.g} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:8,background:currentKp>=row.kpMin?`${row.color}10`:"rgba(255,255,255,0.02)",border:`1px solid ${currentKp>=row.kpMin?row.color+"30":"rgba(255,255,255,0.04)"}`,transition:"all 0.5s"}}>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600,color:currentKp>=row.kpMin?row.color:"#1E3A50",minWidth:26,transition:"color 0.5s"}}>{row.g}</span>
                      <div style={{flex:1}}><div style={{fontSize:10,color:currentKp>=row.kpMin?"#E0E8F0":"#334155",fontWeight:500,transition:"color 0.5s"}}>{row.label}</div><div style={{fontSize:8.5,color:"#1E3A50",fontFamily:"'IBM Plex Mono',monospace"}}>{row.desc}</div></div>
                      <span style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50"}}>Kp≥{row.kpMin}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{gridColumn:"1 / -1"}}><KpHistory history={kpHistory}/></div>

              {alerts.length>0&&(
                <div style={{gridColumn:"1 / -1",borderRadius:16,padding:"20px 22px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(10px)"}}>
                  <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:14}}>Alertas NOAA recientes</div>
                  {alerts.map((a,i)=>(
                    <div key={i} style={{padding:"10px 14px",borderRadius:9,background:"rgba(3,8,20,0.4)",border:"1px solid rgba(255,255,255,0.05)",marginBottom:7,fontSize:11,color:"#64748b",lineHeight:1.6,fontFamily:"monospace"}}>{a.message?.split("\n").slice(0,3).join(" · ")||"—"}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{height:1,background:`linear-gradient(90deg,transparent,${auroraColor}20,transparent)`,transition:"background 0.6s"}}/>
          <div style={{padding:"14px 0 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:7.5,color:"#0C2040",fontFamily:"'IBM Plex Mono',monospace"}}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{fontSize:8.5,color:"#0C2040",fontFamily:"'IBM Plex Mono',monospace"}}>Datos: NOAA Space Weather Prediction Center</div>
          </div>
        </div>
      </div>
    </>
  );
}