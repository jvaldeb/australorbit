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
  ["Satélites 🇨🇱",      "/satelites-chilenos"],
  ["Lanzamientos",       "/lanzamientos"],
  ["Clima espacial",     "/espacio"],
  ["Noticias",           "/noticias"],
  ["Contacto",           "/contacto"],
];

export default function News() {
  usePageMeta({
    title:       "Noticias espaciales en español",
    description: "Las últimas noticias del espacio traducidas al español. NASA, SpaceX, ESA y exploración espacial desde una perspectiva latinoamericana.",
    url:         "https://australorbit.com/noticias",
  });

  const [news, setNews]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    fetch(`${API}/news`)
      .then(r => r.json())
      .then(d => { setNews(Array.isArray(d) ? d : (d.articles || [])); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#000;color:#E0E8F0;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#111;border-radius:2px;}
        a{color:inherit;}
        button{cursor:pointer;border:none;background:none;font-family:inherit;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{opacity:0.4}50%{opacity:1}100%{opacity:0.4}}
        @keyframes earthFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes earthDrift{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.022)}}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.15;transform:scale(1.6)}}
        .nav-section-link{text-decoration:none;transition:opacity 0.2s;white-space:nowrap;}
        .nav-section-link:hover{opacity:1!important;}
        .news-card{transition:border-color 0.2s,transform 0.2s;}
        .news-card:hover{border-color:rgba(87,199,255,0.22)!important;transform:translateY(-2px);}
        @media(max-width:600px){
          .nav-desktop-sections{display:none!important;}
          .nav-hamburger{display:flex!important;}
          .page-padding{padding:0 16px!important;}
          .news-grid{grid-template-columns:1fr!important;}
        }
        .nav-hamburger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;flex-direction:column;gap:5px;padding:0;}
        .nav-hamburger span{display:block;width:18px;height:1.5px;background:rgba(255,255,255,0.8);border-radius:2px;transition:all 0.25s;}
      `}</style>

      {/* Background */}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,background:"#000"}}/>
        <div style={{position:"absolute",inset:0,animation:"earthFadeIn 2.5s ease both"}}>
          <img src="/earth-bg.png" alt="" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"90vmin",height:"90vmin",objectFit:"contain",opacity:0.15,animation:"earthDrift 55s ease-in-out infinite",filter:"saturate(0.8) brightness(0.9)",pointerEvents:"none"}}/>
        </div>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 120% 90% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.92) 100%)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"22%",background:"linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, transparent 100%)"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.015}}>
          <defs><pattern id="pg" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg)"/>
        </svg>
      </div>

      <div className="page-padding" style={{position:"relative",zIndex:1,padding:"0 24px",minHeight:"100vh"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>

          {/* Mobile drawer */}
          {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:140,background:"rgba(0,0,0,0.5)"}}/>}
          {menuOpen && (
            <div style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:"rgba(0,0,0,0.97)",borderBottom:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(30px)",padding:"80px 24px 24px",display:"flex",flexDirection:"column",gap:4,animation:"fadeUp 0.2s ease both"}}>
              {LINKS.map(([label,href])=>(
                <a key={href} href={href} style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:href==="/noticias"?"#fff":"rgba(255,255,255,0.55)",textDecoration:"none",padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"color 0.2s"}}>{label}</a>
              ))}
            </div>
          )}

          {/* Nav */}
          <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",animation:"fadeIn 0.7s ease both",gap:16,position:"relative",zIndex:160}}>
            <a href="/" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",flexShrink:0}}>
              {!logoError
                ?<img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:52,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 16px rgba(10,28,80,0.6)) brightness(1.08)"}}/>
                :<span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#fff"}}>AO</span>
              }
              <div>
                <div style={{display:"flex",alignItems:"baseline",gap:7}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.06em",color:"#fff"}}>AUSTRAL</span>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontStyle:"italic",color:"#57C7FF"}}>Orbit</span>
                </div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7,letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginTop:1}}>Santiago · 33.4°S</div>
              </div>
            </a>

            <div className="nav-desktop-sections" style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}}>
              {LINKS.map(([label,href])=>(
                <a key={href} href={href} className="nav-section-link"
                  style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",
                    color:href==="/noticias"?"#fff":"rgba(255,255,255,0.5)",
                    padding:"8px 18px",borderRadius:99,
                    background:href==="/noticias"?"rgba(255,255,255,0.06)":"transparent",
                    border:href==="/noticias"?"1px solid rgba(255,255,255,0.12)":"1px solid transparent",
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
          <div style={{padding:"52px 0 40px",animation:"fadeUp 0.9s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:99,...glass({}),marginBottom:22}}>
              <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2.2s infinite"}}/>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.2em",textTransform:"uppercase"}}>Spaceflight News API · actualizado diariamente</span>
            </div>
            <h1 style={{lineHeight:1.08,letterSpacing:"-0.02em",marginBottom:14}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,color:"#fff",display:"block"}}>Noticias</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,4.2vw,52px)",fontStyle:"italic",color:"#57C7FF",display:"block"}}>espaciales</span>
            </h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.3)",lineHeight:1.8,fontWeight:300,maxWidth:480}}>
              Las últimas novedades del mundo espacial, traducidas al español y actualizadas cada día.
            </p>
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(87,199,255,0.3),transparent)",marginBottom:32}}/>

          {/* Grid */}
          {loading && (
            <div style={{padding:60,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:14,animation:"shimmer 1.5s infinite"}}>📡</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#57C7FF",letterSpacing:"0.16em"}}>Cargando noticias...</div>
            </div>
          )}

          {!loading && (
            <div className="news-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16,paddingBottom:48}}>
              {news.map((a,i)=>(
                <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="news-card"
                  style={{display:"flex",flexDirection:"column",textDecoration:"none",borderRadius:18,overflow:"hidden",...glass({})}}>
                  {a.image && (
                    <div style={{height:180,overflow:"hidden",flexShrink:0}}>
                      <img src={a.image} alt={a.title} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.78,transition:"opacity 0.3s"}} onError={e=>{e.target.parentElement.style.display="none";}}/>
                    </div>
                  )}
                  <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:10,flex:1}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                      <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.12em",padding:"3px 8px",borderRadius:5,background:"rgba(87,199,255,0.08)",color:"#57C7FF",border:"1px solid rgba(87,199,255,0.15)"}}>{(a.source||"SPACE").toUpperCase()}</span>
                      <span style={{fontSize:8.5,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace"}}>{a.published}</span>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"rgba(255,255,255,0.88)",lineHeight:1.38,letterSpacing:"-0.01em"}}>{a.title}</div>
                    {a.summary && (
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.32)",lineHeight:1.68,flex:1,display:"-webkit-box",WebkitLineClamp:4,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.summary}</div>
                    )}
                    <div style={{fontSize:10,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginTop:4}}>Leer en {a.source} →</div>
                  </div>
                </a>
              ))}
              {!loading && news.length === 0 && (
                <div style={{padding:48,textAlign:"center",border:"1px dashed rgba(255,255,255,0.05)",borderRadius:16,gridColumn:"1/-1"}}>
                  <div style={{fontSize:24,marginBottom:10}}>📭</div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:"rgba(255,255,255,0.15)"}}>Sin noticias disponibles</div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(87,199,255,0.25),transparent)"}}/>
          <div style={{padding:"16px 0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em"}}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>Powered by Spaceflight News API</div>
          </div>
        </div>
      </div>
    </>
  );
}
