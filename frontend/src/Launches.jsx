import { useState, useEffect, useMemo } from "react";
import { usePageMeta } from "./usePageMeta.js";

const API = "https://australorbit-production.up.railway.app";
const pad = n => String(n).padStart(2, "0");

const LINKS = [
  ["Rastreo",         "/"],
  ["Satélites LATAM",   "/satelites-chilenos"],
  ["Lanzamientos",    "/lanzamientos"],
  ["Clima espacial",  "/espacio"],
  ["Noticias",        "/noticias"],
  ["Contacto",        "/contacto"],
];

const STATUS_MAP = {
  1:{ label:"CONFIRMADO",    color:"#4ade80", bg:"#22c55e12", border:"#22c55e30" },
  2:{ label:"POR CONFIRMAR", color:"#fbbf24", bg:"#f59e0b12", border:"#f59e0b30" },
  3:{ label:"EXITOSO",       color:"#57C7FF", bg:"#57C7FF12", border:"#57C7FF30" },
  4:{ label:"FALLIDO",       color:"#f87171", bg:"#ef444412", border:"#ef444430" },
  5:{ label:"EN ESPERA",     color:"#a78bfa", bg:"#8b5cf612", border:"#8b5cf630" },
  6:{ label:"EN VUELO",      color:"#34d399", bg:"#10b98112", border:"#10b98130" },
  7:{ label:"PARCIAL",       color:"#fb923c", bg:"#f9731612", border:"#f9731630" },
  8:{ label:"PROG. ÉXITO",   color:"#4ade80", bg:"#22c55e12", border:"#22c55e30" },
};

function countdown(netStr) {
  const diff = new Date(netStr) - new Date();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m`;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function fmtDate(netStr) {
  const d = new Date(netStr);
  const D = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const M = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${D[d.getUTCDay()]} ${d.getUTCDate()} ${M[d.getUTCMonth()]} ${d.getUTCFullYear()} · ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

function CountdownLive({ net }) {
  const [cd, setCd] = useState(countdown(net));
  useEffect(() => { const t = setInterval(() => setCd(countdown(net)), 1000); return () => clearInterval(t); }, [net]);
  return <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:24,fontWeight:600,color:"#57C7FF",letterSpacing:"0.04em"}}>{cd || "Lanzando..."}</div>;
}

function SkeletonLaunch() {
  return (
    <div style={{borderRadius:16,border:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.01)",marginBottom:12,overflow:"hidden",animation:"shimmer 1.5s ease infinite"}}>
      <div style={{height:140,background:"rgba(255,255,255,0.03)"}}/>
      <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:8}}>
        <div style={{width:"70%",height:16,borderRadius:4,background:"rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",gap:8}}>
          <div style={{width:80,height:12,borderRadius:4,background:"rgba(255,255,255,0.04)"}}/>
          <div style={{width:60,height:12,borderRadius:4,background:"rgba(255,255,255,0.03)"}}/>
        </div>
      </div>
    </div>
  );
}

function Nav({ logoError, setLogoError, menuOpen, setMenuOpen }) {
  return (
    <>
      {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:140,background:"rgba(0,0,0,0.6)"}}/>}
      {menuOpen && (
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:"rgba(0,0,0,0.97)",borderBottom:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",padding:"80px 24px 24px",display:"flex",flexDirection:"column",gap:4,animation:"fadeUp 0.2s ease both"}}>
          {LINKS.map(([label,href])=>(
            <a key={href} href={href} onClick={()=>setMenuOpen(false)} style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:href==="/lanzamientos"?"#fff":"rgba(255,255,255,0.55)",textDecoration:"none",padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"color 0.2s"}}>{label}</a>
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
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:400,letterSpacing:"0.18em",color:"#57C7FF"}}>ORBIT</span>
            </div>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7,letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase"}}>Santiago · 33.4°S</span>
          </div>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}} className="nav-desktop">
          {LINKS.map(([label,href])=>(
            <a key={href} href={href} style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:href==="/lanzamientos"?"#fff":"rgba(255,255,255,0.5)",padding:"8px 18px",borderRadius:99,background:href==="/lanzamientos"?"rgba(255,255,255,0.06)":"transparent",border:href==="/lanzamientos"?"1px solid rgba(255,255,255,0.12)":"1px solid transparent",textDecoration:"none",whiteSpace:"nowrap",transition:"all 0.2s"}}>{label}</a>
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

function LaunchCard({ launch, isNext }) {
  const [cd, setCd]     = useState(countdown(launch.net));
  const [open, setOpen] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  useEffect(() => { const t = setInterval(() => setCd(countdown(launch.net)), 1000); return () => clearInterval(t); }, [launch.net]);

  const status   = STATUS_MAP[launch.status?.id] || { label: launch.status?.name||"—", color:"#64748b", bg:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.08)" };
  const provider = launch.launch_service_provider?.name || "—";
  const rocket   = launch.rocket?.configuration?.name || "—";
  const pad_name = launch.pad?.name || "—";
  const location = launch.pad?.location?.name || "—";
  const mtype    = launch.mission?.type || null;
  const mdesc    = launch.mission?.description || null;
  const img      = !imgErr && (launch.image?.image_url || launch.image?.thumbnail_url || null);

  return (
    <div style={{borderRadius:16,border:`1px solid ${isNext?"rgba(87,199,255,0.28)":"rgba(255,255,255,0.07)"}`,background:"rgba(255,255,255,0.014)",backdropFilter:"blur(10px)",marginBottom:12,overflow:"hidden",transition:"all 0.2s",boxShadow:isNext?"0 0 30px rgba(87,199,255,0.06)":"none"}}
      onMouseEnter={e=>{if(!isNext)e.currentTarget.style.borderColor="rgba(255,255,255,0.14)";}}
      onMouseLeave={e=>{if(!isNext)e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}>
      {img && (
        <div style={{position:"relative",height:isNext?200:140,overflow:"hidden",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
          <img src={img} alt={launch.name} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.75,display:"block",transition:"transform 0.4s ease,opacity 0.3s"}}
            onError={()=>setImgErr(true)}
            onMouseEnter={e=>{e.target.style.transform="scale(1.04)";e.target.style.opacity="0.88";}}
            onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.opacity="0.75";}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(5,8,22,0.95) 0%, rgba(5,8,22,0.3) 60%, transparent 100%)"}}/>
          {launch.image?.credit && <div style={{position:"absolute",top:10,right:10,fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.35)",background:"rgba(0,0,0,0.4)",padding:"2px 7px",borderRadius:4}}>© {launch.image.credit}</div>}
          {isNext && <div style={{position:"absolute",top:12,left:12,display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:20,background:"rgba(87,199,255,0.18)",border:"1px solid rgba(87,199,255,0.4)",backdropFilter:"blur(8px)"}}><span style={{display:"block",width:5,height:5,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2s infinite"}}/><span style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.18em"}}>PRÓXIMO LANZAMIENTO</span></div>}
          {cd && <div style={{position:"absolute",bottom:14,right:14,textAlign:"right"}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:isNext?26:18,fontWeight:600,color:"white",letterSpacing:"0.04em",textShadow:"0 2px 12px rgba(0,0,0,0.8)"}}>{cd}</div><div style={{fontSize:8.5,color:"rgba(255,255,255,0.45)",fontFamily:"'IBM Plex Mono',monospace"}}>{fmtDate(launch.net)}</div></div>}
        </div>
      )}
      <div style={{padding:"14px 18px",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            {isNext && !img && <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"2px 9px",borderRadius:20,background:"rgba(87,199,255,0.12)",border:"1px solid rgba(87,199,255,0.3)",marginBottom:7}}><span style={{display:"block",width:4,height:4,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2s infinite"}}/><span style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.18em"}}>PRÓXIMO LANZAMIENTO</span></div>}
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#F0F4F8",letterSpacing:"-0.01em",marginBottom:6,lineHeight:1.3}}>{launch.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",padding:"2px 8px",borderRadius:5,background:status.bg,color:status.color,border:`1px solid ${status.border}`}}>{status.label}</span>
              {mtype && <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.3)",padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>{mtype}</span>}
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)"}}>{provider}</span>
            </div>
          </div>
          {!img && <div style={{textAlign:"right",flexShrink:0}}>
            {cd?<div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:isNext?20:15,fontWeight:600,color:isNext?"#57C7FF":"#F0F4F8",letterSpacing:"0.04em"}}>{cd}</div>:<div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:"rgba(255,255,255,0.2)"}}>Lanzado</div>}
            <div style={{fontSize:8.5,color:"rgba(255,255,255,0.15)",fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>{fmtDate(launch.net)}</div>
          </div>}
          <span style={{color:"rgba(255,255,255,0.15)",fontSize:11,flexShrink:0,paddingTop:2}}>{open?"▲":"▼"}</span>
        </div>
        <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
          {[["🚀",rocket],["📍",pad_name],["🌍",location]].map(([icon,v])=>(
            <div key={icon} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'IBM Plex Mono',monospace"}}>
              <span style={{fontSize:11}}>{icon}</span><span>{v}</span>
            </div>
          ))}
        </div>
      </div>
      {open && (
        <div style={{padding:"14px 18px",borderTop:"1px solid rgba(255,255,255,0.05)",animation:"fadeUp 0.2s ease both"}}>
          {mdesc && (
            <>
              <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.15)",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>Descripción de la misión</div>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.72,fontWeight:300,marginBottom:12}}>{mdesc}</p>
            </>
          )}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {launch.webcast_live && <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:8,background:"#ef444410",border:"1px solid #ef444430",fontSize:9.5,color:"#f87171",fontFamily:"'IBM Plex Mono',monospace"}}>● TRANSMISIÓN EN VIVO</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Launches() {
  usePageMeta({
    title:       "Próximos lanzamientos espaciales",
    description: "Calendario de lanzamientos espaciales globales con countdown en tiempo real. SpaceX, NASA, ESA y más — desde la perspectiva del hemisferio sur.",
    url:         "https://australorbit.com/lanzamientos",
  });

  const [launches, setLaunches]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [now, setNow]             = useState(new Date());
  const [logoError, setLogoError] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [filterProvider, setFilterProvider] = useState("Todos");

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    fetch(`${API}/launches/upcoming`)
      .then(r => r.json())
      .then(d => { setLaunches(d.results || []); setLoading(false); })
      .catch(() => { setError("No se pudo cargar la información de lanzamientos."); setLoading(false); });
  }, []);

  const upcoming = launches.filter(l => new Date(l.net) > now);
  const next = upcoming[0];

  const providers = useMemo(() => {
    const s = new Set(launches.map(l=>l.launch_service_provider?.name).filter(Boolean));
    return ["Todos", ...Array.from(s)];
  }, [launches]);

  const filtered = useMemo(() => {
    if (filterProvider === "Todos") return launches;
    return launches.filter(l => l.launch_service_provider?.name === filterProvider);
  }, [launches, filterProvider]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#050816;color:#E0E8F0;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#0C2040;border-radius:2px;}
        button,a{cursor:pointer;font-family:inherit;}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.15;transform:scale(1.5)}}
        @keyframes auroraF2{0%,100%{transform:translate(0,0)}50%{transform:translate(2%,3%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{opacity:0.4}50%{opacity:1}100%{opacity:0.4}}
        .nav-hamburger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;flex-direction:column;gap:5px;padding:0;flex-shrink:0;}
        .nav-hamburger span{display:block;width:18px;height:1.5px;background:rgba(255,255,255,0.8);border-radius:2px;transition:all 0.25s;}
        @media(max-width:600px){
          .nav-desktop{display:none!important;}
          .nav-hamburger{display:flex!important;}
          .page-pad{padding:0 16px!important;}
        }
      `}</style>

      {/* Background */}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 130% 90% at 65% 15%, #0D1B2A 0%, #050816 50%, #07111F 100%)"}}/>
        <div style={{position:"absolute",top:"-20%",left:"20%",width:"80vw",height:"70vh",borderRadius:"50%",background:"radial-gradient(ellipse, #C47B480A 0%, transparent 68%)",animation:"auroraF2 22s ease-in-out infinite"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.02}}>
          <defs><pattern id="pg2" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg2)"/>
        </svg>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          {Array.from({length:40},(_,i)=>({x:((i*193.3)%100).toFixed(1),y:((i*87.1)%100).toFixed(1),r:i%8===0?1.1:0.4,op:(0.05+(i%5)*0.04).toFixed(2),dur:3+(i%6),del:(i%8)*0.7})).map((s,i)=>(
            <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
              <animate attributeName="opacity" values={`${s.op};${(s.op*0.08).toFixed(2)};${s.op}`} dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
            </circle>
          ))}
        </svg>
      </div>

      <div className="page-pad" style={{position:"relative",zIndex:1,padding:"0 22px",minHeight:"100vh"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>

          <Nav logoError={logoError} setLogoError={setLogoError} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>

          {/* Hero */}
          <div style={{padding:"48px 0 36px",animation:"fadeUp 0.8s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 12px",borderRadius:20,background:"rgba(87,199,255,0.1)",border:"1px solid rgba(87,199,255,0.25)",marginBottom:20}}>
              <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2s infinite"}}/>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.2em"}}>THE SPACE DEVS · LAUNCH LIBRARY 2</span>
            </div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:14,color:"#F5F7FA"}}>
              Próximos <span style={{color:"#57C7FF"}}>lanzamientos</span><br/>espaciales
            </h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.3)",lineHeight:1.75,fontWeight:300,maxWidth:500}}>
              Todos los lanzamientos orbitales globales con cuenta regresiva en tiempo real.
            </p>
            {next && (
              <div style={{marginTop:28,display:"inline-flex",alignItems:"stretch",borderRadius:14,overflow:"hidden",border:"1px solid rgba(87,199,255,0.22)",backdropFilter:"blur(12px)",background:"rgba(3,8,20,0.5)"}}>
                <div style={{padding:"14px 20px",borderRight:"1px solid rgba(255,255,255,0.055)"}}>
                  <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.2em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:4}}>Próximo lanzamiento</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#F0F4F8",maxWidth:260,lineHeight:1.3}}>{next.name}</div>
                  <div style={{fontSize:9.5,color:"rgba(255,255,255,0.2)",marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{next.launch_service_provider?.name}</div>
                </div>
                <div style={{padding:"14px 20px",display:"flex",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.2em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:4}}>Cuenta regresiva</div>
                    <CountdownLive net={next.net}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(87,199,255,0.3),transparent)"}}/>

          {/* Filtro por proveedor — con scroll horizontal visible */}
          {!loading && !error && launches.length > 0 && (
            <div style={{padding:"16px 0 8px",position:"relative"}}>
              <div style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:8}}>Empresa de lanzamiento</div>
              <div style={{
                display:"flex",gap:6,overflowX:"auto",paddingBottom:8,
                scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.12) transparent",
              }}
                className="providers-scroll">
                {providers.map(p=>(
                  <button key={p}
                    onClick={()=>setFilterProvider(p)}
                    style={{
                      flexShrink:0,padding:"6px 14px",borderRadius:99,cursor:"pointer",
                      background:filterProvider===p?"rgba(87,199,255,0.12)":"transparent",
                      border:`1px solid ${filterProvider===p?"rgba(87,199,255,0.4)":"rgba(255,255,255,0.08)"}`,
                      color:filterProvider===p?"#57C7FF":"rgba(255,255,255,0.4)",
                      fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.06em",
                      transition:"all 0.2s",whiteSpace:"nowrap",
                    }}>
                    {p}
                  </button>
                ))}
              </div>
              {/* Gradiente de fade derecho para indicar scroll */}
              <div style={{position:"absolute",right:0,top:32,bottom:8,width:32,background:"linear-gradient(to right, transparent, #050816)",pointerEvents:"none"}}/>
            </div>
          )}

          {/* Lista */}
          <div style={{padding:"16px 0 48px"}}>
            {loading && [...Array(4)].map((_,i)=><SkeletonLaunch key={i}/>)}
            {error && <div style={{padding:40,textAlign:"center",border:"1px dashed rgba(87,199,255,0.2)",borderRadius:14}}><div style={{fontSize:24,marginBottom:12}}>⚠️</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#f87171"}}>{error}</div></div>}
            {!loading && !error && filtered.map((l,i) => <LaunchCard key={l.id} launch={l} isNext={i===0&&filterProvider==="Todos"}/>)}
            {!loading && !error && filtered.length === 0 && (
              <div style={{padding:40,textAlign:"center",border:"1px dashed rgba(255,255,255,0.05)",borderRadius:14}}>
                <div style={{fontSize:24,marginBottom:10}}>🚀</div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"rgba(255,255,255,0.2)"}}>Sin lanzamientos de {filterProvider}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(87,199,255,0.2),transparent)"}}/>
          <div style={{padding:"14px 0 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,0.1)",fontFamily:"'IBM Plex Mono',monospace"}}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{fontSize:8.5,color:"rgba(255,255,255,0.1)",fontFamily:"'IBM Plex Mono',monospace"}}>Datos: The Space Devs · Launch Library 2</div>
          </div>
        </div>
      </div>
    </>
  );
}
