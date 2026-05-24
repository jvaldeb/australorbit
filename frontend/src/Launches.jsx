import { useState, useEffect } from "react";

const API = "https://australorbit-production.up.railway.app";
const pad = n => String(n).padStart(2, "0");

function CosmicBg() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 130% 90% at 65% 15%, #0D1B2A 0%, #050816 50%, #07111F 100%)"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.032}}>
        <filter id="fn2"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#fn2)"/>
      </svg>
      <div style={{position:"absolute",top:"-20%",left:"20%",width:"80vw",height:"70vh",borderRadius:"50%",background:"radial-gradient(ellipse, #C47B480A 0%, transparent 68%)",animation:"auroraF2 22s ease-in-out infinite"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        {Array.from({length:40},(_,i)=>({
          x:((i*193.3)%100).toFixed(1),y:((i*87.1)%100).toFixed(1),
          r:i%8===0?1.1:0.4,op:(0.05+(i%5)*0.04).toFixed(2),dur:3+(i%6),del:(i%8)*0.7,
        })).map((s,i)=>(
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
            <animate attributeName="opacity" values={`${s.op};${(s.op*0.08).toFixed(2)};${s.op}`} dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.02}}>
        <defs><pattern id="pg2" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#pg2)"/>
      </svg>
    </div>
  );
}

const STATUS_MAP = {
  1:  { label:"CONFIRMADO",  color:"#4ade80", bg:"#22c55e12", border:"#22c55e30" },
  2:  { label:"POR CONFIRMAR", color:"#fbbf24", bg:"#f59e0b12", border:"#f59e0b30" },
  3:  { label:"EXITOSO",     color:"#57C7FF", bg:"#57C7FF12", border:"#57C7FF30" },
  4:  { label:"FALLIDO",     color:"#f87171", bg:"#ef444412", border:"#ef444430" },
  5:  { label:"EN ESPERA",   color:"#a78bfa", bg:"#8b5cf612", border:"#8b5cf630" },
  6:  { label:"EN VUELO",    color:"#34d399", bg:"#10b98112", border:"#10b98130" },
  7:  { label:"PARCIAL",     color:"#fb923c", bg:"#f9731612", border:"#f9731630" },
  8:  { label:"PROG. ÉXITO", color:"#4ade80", bg:"#22c55e12", border:"#22c55e30" },
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

function LaunchCard({ launch, isNext }) {
  const [cd, setCd]   = useState(countdown(launch.net));
  const [open, setOpen] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setCd(countdown(launch.net)), 1000);
    return () => clearInterval(t);
  }, [launch.net]);

  const status   = STATUS_MAP[launch.status?.id] || { label: launch.status?.name || "—", color:"#64748b", bg:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.08)" };
  const provider = launch.launch_service_provider?.name || "—";
  const rocket   = launch.rocket?.configuration?.name || "—";
  const pad_name = launch.pad?.name || "—";
  const location = launch.pad?.location?.name || "—";
  const mtype    = launch.mission?.type || null;
  const mdesc    = launch.mission?.description || null;
  // API v2.3: image is an object with image_url and thumbnail_url
  const img      = !imgErr && (launch.image?.image_url || launch.image?.thumbnail_url || null);
  const thumb    = !imgErr && (launch.image?.thumbnail_url || launch.image?.image_url || null);

  return (
    <div style={{borderRadius:16,border:`1px solid ${isNext?"rgba(87,199,255,0.28)":"rgba(255,255,255,0.07)"}`,background:"rgba(255,255,255,0.014)",backdropFilter:"blur(10px)",marginBottom:12,overflow:"hidden",transition:"all 0.2s",boxShadow:isNext?"0 0 30px rgba(87,199,255,0.06)":"none"}}>

      {/* Top image banner — full width, prominent */}
      {img ? (
        <div style={{position:"relative",height:isNext?200:140,overflow:"hidden",cursor:"pointer"}} onClick={() => setOpen(o => !o)}>
          <img
            src={img}
            alt={launch.name}
            style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.75,display:"block",transition:"opacity 0.3s"}}
            onError={() => setImgErr(true)}
          />
          {/* gradient overlay */}
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(5,8,22,0.95) 0%, rgba(5,8,22,0.3) 60%, transparent 100%)"}}/>
          {/* credit badge */}
          {launch.image?.credit && (
            <div style={{position:"absolute",top:10,right:10,fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.35)",background:"rgba(0,0,0,0.4)",padding:"2px 7px",borderRadius:4,letterSpacing:"0.08em"}}>
              © {launch.image.credit}
            </div>
          )}
          {/* PRÓXIMO badge over image */}
          {isNext && (
            <div style={{position:"absolute",top:12,left:12,display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:20,background:"rgba(87,199,255,0.18)",border:"1px solid rgba(87,199,255,0.4)",backdropFilter:"blur(8px)"}}>
              <span style={{display:"block",width:5,height:5,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2s infinite"}}/>
              <span style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.18em"}}>PRÓXIMO LANZAMIENTO</span>
            </div>
          )}
          {/* countdown over image */}
          {cd && (
            <div style={{position:"absolute",bottom:14,right:14,textAlign:"right"}}>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:isNext?26:18,fontWeight:600,color:"white",letterSpacing:"0.04em",textShadow:"0 2px 12px rgba(0,0,0,0.8)"}}>{cd}</div>
              <div style={{fontSize:8.5,color:"rgba(255,255,255,0.45)",fontFamily:"'IBM Plex Mono',monospace"}}>{fmtDate(launch.net)}</div>
            </div>
          )}
        </div>
      ) : null}

      {/* Card body */}
      <div style={{padding:"14px 18px",cursor:"pointer"}} onClick={() => setOpen(o => !o)}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            {isNext && !img && (
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"2px 9px",borderRadius:20,background:"rgba(87,199,255,0.12)",border:"1px solid rgba(87,199,255,0.3)",marginBottom:7}}>
                <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2s infinite"}}/>
                <span style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.18em"}}>PRÓXIMO LANZAMIENTO</span>
              </div>
            )}
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#F0F4F8",letterSpacing:"-0.01em",marginBottom:6,lineHeight:1.3}}>{launch.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",padding:"2px 8px",borderRadius:5,background:status.bg,color:status.color,border:`1px solid ${status.border}`}}>{status.label}</span>
              {mtype && <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#475569",padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>{mtype}</span>}
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#334155"}}>{provider}</span>
            </div>
          </div>
          {/* countdown (when no image) */}
          {!img && (
            <div style={{textAlign:"right",flexShrink:0}}>
              {cd
                ? <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:isNext?20:15,fontWeight:600,color:isNext?"#57C7FF":"#F0F4F8",letterSpacing:"0.04em"}}>{cd}</div>
                : <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:"#334155"}}>Lanzado</div>
              }
              <div style={{fontSize:8.5,color:"#334155",fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>{fmtDate(launch.net)}</div>
            </div>
          )}
          <span style={{color:"#1E3A50",fontSize:11,flexShrink:0,paddingTop:2}}>{open?"▲":"▼"}</span>
        </div>

        <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
          {[["🚀",rocket],["📍",pad_name],["🌍",location]].map(([icon,v]) => (
            <div key={icon} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#64748b",fontFamily:"'IBM Plex Mono',monospace"}}>
              <span style={{fontSize:11}}>{icon}</span>
              <span style={{color:"#8090A0"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{padding:"14px 18px",borderTop:"1px solid rgba(255,255,255,0.05)",animation:"fadeUp 0.2s ease both"}}>
          {mdesc && <>
            <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#1E3A50",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>Descripción de la misión</div>
            <p style={{fontSize:12,color:"#64748b",lineHeight:1.72,fontWeight:300,marginBottom:12}}>{mdesc}</p>
          </>}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {launch.webcast_live && (
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:8,background:"#ef444410",border:"1px solid #ef444430",fontSize:9.5,color:"#f87171",fontFamily:"'IBM Plex Mono',monospace"}}>
                ● TRANSMISIÓN EN VIVO
              </div>
            )}
            {launch.launch_service_provider?.url && (
              <a href={launch.launch_service_provider.info_url || "#"} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:8,background:"rgba(87,199,255,0.07)",border:"1px solid rgba(87,199,255,0.18)",fontSize:9.5,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",textDecoration:"none"}}>
                Ver agencia →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Launches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [now, setNow]           = useState(new Date());
  const [logoError, setLogoError] = useState(false);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    fetch(`${API}/launches/upcoming`)
      .then(r => r.json())
      .then(d => { setLaunches(d.results || []); setLoading(false); })
      .catch(() => { setError("No se pudo cargar la información de lanzamientos."); setLoading(false); });
  }, []);

  const upcoming = launches.filter(l => new Date(l.net) > now);
  const next     = upcoming[0];

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
      `}</style>

      <CosmicBg/>

      <div style={{position:"relative",zIndex:1,padding:"0 22px",minHeight:"100vh"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>

          {/* NAV */}
          <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 0 16px",borderBottom:"1px solid rgba(255,255,255,0.045)",animation:"fadeIn 0.6s ease both"}}>
            <a href="/" style={{display:"flex",alignItems:"center",gap:16,textDecoration:"none"}}>
              {!logoError
                ?<img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:56,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 14px rgba(10,28,80,0.55)) brightness(1.08)"}}/>
                :<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#57C7FF",letterSpacing:"0.14em"}}>AUSTRAL ORBIT</span>
              }
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <div style={{display:"flex",alignItems:"baseline",gap:7}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,letterSpacing:"0.04em",color:"#F5F7FA"}}>AUSTRAL</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:400,letterSpacing:"0.18em",color:"#57C7FF"}}>ORBIT</span>
                </div>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7.5,letterSpacing:"0.28em",color:"#1E3A50",textTransform:"uppercase"}}>Santiago · 33.4°S · Chile</span>
              </div>
            </a>
            <div style={{display:"flex",gap:6}}>
              {[["/ Inicio","/"],["🚀 Lanzamientos","/lanzamientos"],["🌌 Clima espacial","/espacio"]].map(([l,h])=>(
                <a key={h} href={h} style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:window.location.pathname===h?"#57C7FF":"#334155",padding:"5px 10px",borderRadius:7,background:window.location.pathname===h?"rgba(87,199,255,0.1)":"transparent",border:`1px solid ${window.location.pathname===h?"rgba(87,199,255,0.25)":"transparent"}`,textDecoration:"none",letterSpacing:"0.06em",transition:"all 0.2s"}}>{l}</a>
              ))}
            </div>
          </nav>

          {/* HERO */}
          <div style={{padding:"48px 0 36px",animation:"fadeUp 0.8s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 12px",borderRadius:20,background:"rgba(87,199,255,0.1)",border:"1px solid rgba(87,199,255,0.25)",marginBottom:20}}>
              <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2s infinite"}}/>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.2em"}}>THE SPACE DEVS · LAUNCH LIBRARY 2</span>
            </div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.08,marginBottom:14,color:"#F5F7FA"}}>
              Próximos <span style={{color:"#57C7FF"}}>lanzamientos</span><br/>espaciales
            </h1>
            <p style={{fontSize:15,color:"#334155",lineHeight:1.75,fontWeight:300,maxWidth:500}}>
              Todos los lanzamientos orbitales globales con cuenta regresiva en tiempo real.
            </p>
            {next && (
              <div style={{marginTop:28,display:"inline-flex",alignItems:"stretch",borderRadius:14,overflow:"hidden",border:"1px solid rgba(87,199,255,0.22)",backdropFilter:"blur(12px)",background:"rgba(3,8,20,0.5)"}}>
                <div style={{padding:"14px 20px",borderRight:"1px solid rgba(255,255,255,0.055)"}}>
                  <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.2em",color:"#1E3A50",textTransform:"uppercase",marginBottom:4}}>Próximo lanzamiento</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#F0F4F8",maxWidth:260,lineHeight:1.3}}>{next.name}</div>
                  <div style={{fontSize:9.5,color:"#334155",marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{next.launch_service_provider?.name}</div>
                </div>
                <div style={{padding:"14px 20px",display:"flex",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.2em",color:"#1E3A50",textTransform:"uppercase",marginBottom:4}}>Cuenta regresiva</div>
                    <CountdownLive net={next.net}/>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(87,199,255,0.3),transparent)"}}/>

          {/* LIST */}
          <div style={{padding:"24px 0 48px"}}>
            {loading && (
              <div style={{padding:60,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:14,display:"inline-block",animation:"livePulse 1.5s infinite"}}>🚀</div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#57C7FF",letterSpacing:"0.16em"}}>Cargando lanzamientos...</div>
              </div>
            )}
            {error && (
              <div style={{padding:40,textAlign:"center",border:"1px dashed rgba(87,199,255,0.2)",borderRadius:14}}>
                <div style={{fontSize:24,marginBottom:12}}>⚠️</div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#f87171"}}>{error}</div>
              </div>
            )}
            {!loading && !error && launches.map((l, i) => (
              <LaunchCard key={l.id} launch={l} isNext={i === 0}/>
            ))}
          </div>

          {/* FOOTER */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(87,199,255,0.2),transparent)"}}/>
          <div style={{padding:"14px 0 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:7.5,color:"#0C2040",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em"}}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{fontSize:8.5,color:"#0C2040",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>Datos: The Space Devs · Launch Library 2</div>
          </div>
        </div>
      </div>
    </>
  );
}

function CountdownLive({ net }) {
  const [cd, setCd] = useState(countdown(net));
  useEffect(() => {
    const t = setInterval(() => setCd(countdown(net)), 1000);
    return () => clearInterval(t);
  }, [net]);
  return <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:24,fontWeight:600,color:"#57C7FF",letterSpacing:"0.04em"}}>{cd || "Lanzando..."}</div>;
}