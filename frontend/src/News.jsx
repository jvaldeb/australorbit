import { useState, useEffect, useMemo } from "react";
import { usePageMeta } from "./usePageMeta.js";
import { useGeoLocation } from "./useGeoLocation.js";
import GeoSplash from "./GeoSplash.jsx";

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

// Bandera emoji por código de país
function flagEmoji(code) {
  if (!code || code.length !== 2) return "🌎";
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

function SkeletonCard() {
  return (
    <div style={{borderRadius:18,overflow:"hidden",...glass({}),animation:"shimmer 1.5s ease infinite"}}>
      <div style={{height:180,background:"rgba(255,255,255,0.04)"}}/>
      <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div style={{width:60,height:14,borderRadius:4,background:"rgba(255,255,255,0.05)"}}/>
          <div style={{width:80,height:14,borderRadius:4,background:"rgba(255,255,255,0.03)"}}/>
        </div>
        <div style={{width:"90%",height:18,borderRadius:4,background:"rgba(255,255,255,0.05)"}}/>
        <div style={{width:"70%",height:18,borderRadius:4,background:"rgba(255,255,255,0.04)"}}/>
        <div style={{width:"100%",height:12,borderRadius:4,background:"rgba(255,255,255,0.03)"}}/>
      </div>
    </div>
  );
}

function NewsCard({ article }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-card"
      style={{display:"flex",flexDirection:"column",textDecoration:"none",borderRadius:18,overflow:"hidden",...glass({})}}>
      {article.image && (
        <div style={{height:180,overflow:"hidden",flexShrink:0}}>
          <img src={article.image} alt={article.title}
            style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.78,display:"block"}}
            onError={e=>{e.target.parentElement.style.display="none";}}/>
        </div>
      )}
      {/* Badge LATAM si aplica */}
      {article.latam && (
        <div style={{position:"relative"}}>
          <span style={{
            position:"absolute",top:-28,left:12,
            fontSize:7,fontFamily:"'IBM Plex Mono',monospace",
            padding:"2px 7px",borderRadius:4,
            background:"rgba(110,231,183,0.15)",
            color:"#6EE7B7",border:"1px solid rgba(110,231,183,0.3)",
            letterSpacing:"0.1em",
          }}>LATAM</span>
        </div>
      )}
      <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:10,flex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.12em",padding:"3px 8px",borderRadius:5,background:"rgba(87,199,255,0.08)",color:"#57C7FF",border:"1px solid rgba(87,199,255,0.15)"}}>{(article.source||"SPACE").toUpperCase()}</span>
          <span style={{fontSize:8.5,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace"}}>{article.published}</span>
        </div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"rgba(255,255,255,0.88)",lineHeight:1.38,letterSpacing:"-0.01em"}}>{article.title}</div>
        {article.summary && (
          <div style={{fontSize:12,color:"rgba(255,255,255,0.32)",lineHeight:1.68,flex:1,display:"-webkit-box",WebkitLineClamp:4,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{article.summary}</div>
        )}
        <div style={{fontSize:10,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginTop:4}}>Leer en {article.source} →</div>
      </div>
    </a>
  );
}

export default function News() {
  usePageMeta({
    title:       "Noticias espaciales — Global y Latinoamérica",
    description: "Noticias espaciales globales y de Latinoamérica en español. NASA, SpaceX, ESA y agencias espaciales de Chile, Argentina, Brasil y más.",
    url:         "https://australorbit.com/noticias",
  });

  const { userCity, userCountry, userCountryCode, geoPrompt, setGeoPrompt, requestGeo } = useGeoLocation();

  const [globalNews, setGlobalNews]   = useState([]);
  const [latamNews, setLatamNews]     = useState([]);
  const [countryNews, setCountryNews] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [latamLoading, setLatamLoading] = useState(true);
  const [countryLoading, setCountryLoading] = useState(true);
  const [logoError, setLogoError]     = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activeTab, setActiveTab]     = useState("global"); // "global" | "latam" | "pais"
  const [search, setSearch]           = useState("");
  const [activeSource, setActiveSource] = useState("Todos");

  useEffect(() => {
    fetch(`${API}/news`)
      .then(r => r.json())
      .then(d => { setGlobalNews(Array.isArray(d) ? d : (d.articles || [])); setLoading(false); })
      .catch(() => setLoading(false));

    fetch(`${API}/news/latam`)
      .then(r => r.json())
      .then(d => { setLatamNews(d.articles || []); setLatamLoading(false); })
      .catch(() => setLatamLoading(false));
  }, []);

  useEffect(() => {
    if (!userCountryCode || userCountryCode === "CL") {
      setCountryNews([]);
      setCountryLoading(false);
      return;
    }
    fetch(`${API}/news/country/${userCountryCode}`)
      .then(r => r.json())
      .then(d => { setCountryNews(d.articles || []); setCountryLoading(false); })
      .catch(() => setCountryLoading(false));
  }, [userCountryCode]);

  const currentNews = activeTab === "global" ? globalNews : activeTab === "latam" ? latamNews : countryNews;
  const currentLoading = activeTab === "global" ? loading : activeTab === "latam" ? latamLoading : countryLoading;

  const sources = useMemo(() => {
    const s = new Set(currentNews.map(a => a.source).filter(Boolean));
    return ["Todos", ...Array.from(s).sort()];
  }, [currentNews]);

  const filtered = useMemo(() => {
    let arr = currentNews;
    if (activeSource !== "Todos") arr = arr.filter(a => a.source === activeSource);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(a => a.title?.toLowerCase().includes(q) || a.summary?.toLowerCase().includes(q));
    }
    return arr;
  }, [currentNews, activeSource, search]);

  const flag = flagEmoji(userCountryCode);
  const hasCountryTab = countryNews.length > 0 || userCountryCode !== "CL";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#000;color:#E0E8F0;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#111;border-radius:2px;}
        a{color:inherit;} button{cursor:pointer;border:none;background:none;font-family:inherit;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}
        @keyframes earthFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes earthDrift{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.022)}}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.15;transform:scale(1.6)}}
        .news-card{transition:border-color 0.2s,transform 0.15s;}
        .news-card:hover{border-color:rgba(87,199,255,0.25)!important;transform:translateY(-2px);}
        .news-card img{transition:transform 0.4s ease,opacity 0.3s;}
        .news-card:hover img{transform:scale(1.04);}
        .tab-btn{transition:all 0.2s;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;padding:8px 16px;border-radius:99px;border:1px solid transparent;}
        .tab-btn:hover{opacity:1!important;}
        .source-pill{transition:all 0.2s;cursor:pointer;}
        .search-input{outline:none;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:9px 14px 9px 36px;color:#E0E8F0;font-family:'IBM Plex Mono',monospace;font-size:11px;width:100%;transition:border-color 0.2s;letter-spacing:0.04em;}
        .search-input::placeholder{color:rgba(255,255,255,0.2);}
        .search-input:focus{border-color:rgba(87,199,255,0.35);}
        .nav-hamburger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;flex-direction:column;gap:5px;padding:0;}
        .nav-hamburger span{display:block;width:18px;height:1.5px;background:rgba(255,255,255,0.8);border-radius:2px;transition:all 0.25s;}
        @media(max-width:600px){
          .nav-desktop-sections{display:none!important;}
          .nav-hamburger{display:flex!important;}
          .page-padding{padding:0 16px!important;}
          .news-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* Geo Splash */}
      {geoPrompt && <GeoSplash onAccept={requestGeo} onSkip={()=>setGeoPrompt(false)}/>}

      {/* Background */}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,background:"#000"}}/>
        <div style={{position:"absolute",inset:0,animation:"earthFadeIn 2.5s ease both"}}>
          <img src="/earth-bg.png" alt="" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"90vmin",height:"90vmin",objectFit:"contain",opacity:0.12,animation:"earthDrift 55s ease-in-out infinite",filter:"saturate(0.6) brightness(0.8)",pointerEvents:"none"}}/>
        </div>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 120% 90% at 50% 50%, transparent 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.94) 100%)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"22%",background:"linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.015}}>
          <defs><pattern id="pg" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg)"/>
        </svg>
      </div>

      <div className="page-padding" style={{position:"relative",zIndex:1,padding:"0 24px",minHeight:"100vh"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>

          {/* Mobile drawer */}
          {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:140,background:"rgba(0,0,0,0.6)"}}/>}
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
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7,letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginTop:1}}>{userCity} · {userCountry}</div>
              </div>
            </a>
            <div className="nav-desktop-sections" style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}}>
              {LINKS.map(([label,href])=>(
                <a key={href} href={href} style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:href==="/noticias"?"#fff":"rgba(255,255,255,0.5)",padding:"8px 18px",borderRadius:99,background:href==="/noticias"?"rgba(255,255,255,0.06)":"transparent",border:href==="/noticias"?"1px solid rgba(255,255,255,0.12)":"1px solid transparent",textDecoration:"none",transition:"all 0.2s"}}>{label}</a>
              ))}
            </div>
            <button className="nav-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menú">
              <span style={{transform:menuOpen?"rotate(45deg) translate(4.5px,4.5px)":"none"}}/>
              <span style={{opacity:menuOpen?0:1}}/>
              <span style={{transform:menuOpen?"rotate(-45deg) translate(4.5px,-4.5px)":"none"}}/>
            </button>
          </nav>

          {/* Hero */}
          <div style={{padding:"52px 0 32px",animation:"fadeUp 0.9s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:99,...glass({}),marginBottom:22}}>
              <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2.2s infinite"}}/>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.2em",textTransform:"uppercase"}}>Spaceflight News API · actualizado diariamente</span>
            </div>
            <h1 style={{lineHeight:1.08,letterSpacing:"-0.02em",marginBottom:14}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,color:"#fff",display:"block"}}>Noticias</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,4.2vw,52px)",fontStyle:"italic",color:"#57C7FF",display:"block"}}>espaciales</span>
            </h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.3)",lineHeight:1.8,fontWeight:300,maxWidth:520}}>
              Lo último del espacio, con foco en {userCountry === "Chile" ? "Latinoamérica" : userCountry + " y Latinoamérica"}.
            </p>
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(87,199,255,0.3),transparent)",marginBottom:0}}/>

          {/* TABS — Global / LATAM / Mi País */}
          <div style={{display:"flex",gap:4,padding:"20px 0 16px",overflowX:"auto",scrollbarWidth:"none"}}>
            {[
              ["global",  "🌍 Global",    "Todas las noticias"],
              ["latam",   "🌎 LATAM",     `${latamNews.length} artículos`],
              ...(hasCountryTab ? [["pais", `${flag} ${userCountry}`, `${countryNews.length} artículos`]] : []),
            ].map(([id, label, sub]) => (
              <button key={id} className="tab-btn"
                onClick={()=>{ setActiveTab(id); setActiveSource("Todos"); setSearch(""); }}
                style={{
                  flexShrink:0,
                  background:activeTab===id?"rgba(87,199,255,0.1)":"transparent",
                  border:`1px solid ${activeTab===id?"rgba(87,199,255,0.4)":"rgba(255,255,255,0.08)"}`,
                  color:activeTab===id?"#57C7FF":"rgba(255,255,255,0.4)",
                  display:"flex",flexDirection:"column",alignItems:"flex-start",
                  padding:"10px 16px",gap:2,
                }}>
                <span style={{fontSize:12,fontWeight:activeTab===id?700:500,letterSpacing:"0.04em"}}>{label}</span>
                <span style={{fontSize:8,opacity:0.6,letterSpacing:"0.08em"}}>{sub}</span>
              </button>
            ))}
          </div>

          {/* Banner contextual por tab */}
          {activeTab === "latam" && (
            <div style={{marginBottom:20,padding:"12px 16px",borderRadius:12,background:"rgba(110,231,183,0.06)",border:"1px solid rgba(110,231,183,0.2)",display:"flex",alignItems:"center",gap:10,animation:"fadeIn 0.4s ease both"}}>
              <span style={{fontSize:20}}>🌎</span>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#6EE7B7",marginBottom:2}}>Espacio latinoamericano</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>Noticias sobre agencias, satélites y misiones de Chile, Argentina, Brasil, México y más.</div>
              </div>
            </div>
          )}
          {activeTab === "pais" && (
            <div style={{marginBottom:20,padding:"12px 16px",borderRadius:12,background:"rgba(87,199,255,0.06)",border:"1px solid rgba(87,199,255,0.2)",display:"flex",alignItems:"center",gap:10,animation:"fadeIn 0.4s ease both"}}>
              <span style={{fontSize:20}}>{flag}</span>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#57C7FF",marginBottom:2}}>Noticias de {userCountry}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>Artículos que mencionan misiones, agencias espaciales y hitos de {userCountry}.</div>
              </div>
            </div>
          )}

          {/* Filtros */}
          {!currentLoading && currentNews.length > 0 && (
            <div style={{marginBottom:20,display:"flex",flexDirection:"column",gap:10}}>
              <div style={{position:"relative",maxWidth:360}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input className="search-input" placeholder="Buscar noticias..."
                  value={search} onChange={e=>setSearch(e.target.value)}/>
                {search && <button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",fontSize:16,cursor:"pointer",background:"none",border:"none",padding:"2px 4px"}}>×</button>}
              </div>
              <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:2}}>
                {sources.map(s=>(
                  <button key={s} className="source-pill"
                    onClick={()=>setActiveSource(s)}
                    style={{flexShrink:0,padding:"4px 12px",borderRadius:99,background:activeSource===s?"rgba(87,199,255,0.12)":"transparent",border:`1px solid ${activeSource===s?"rgba(87,199,255,0.4)":"rgba(255,255,255,0.08)"}`,color:activeSource===s?"#57C7FF":"rgba(255,255,255,0.35)",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.06em"}}>
                    {s}
                  </button>
                ))}
              </div>
              <div style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>
                {filtered.length} {filtered.length===1?"artículo":"artículos"}{activeSource!=="Todos"?` · ${activeSource}`:""}{search?` · "${search}`:""}
              </div>
            </div>
          )}

          {/* Skeleton / Grid */}
          {currentLoading && (
            <div className="news-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16,paddingBottom:48}}>
              {[...Array(6)].map((_,i)=><SkeletonCard key={i}/>)}
            </div>
          )}

          {!currentLoading && (
            <div className="news-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16,paddingBottom:48}}>
              {filtered.map((a,i)=><NewsCard key={i} article={a}/>)}

              {filtered.length === 0 && (
                <div style={{padding:48,textAlign:"center",border:"1px dashed rgba(255,255,255,0.05)",borderRadius:16,gridColumn:"1/-1"}}>
                  <div style={{fontSize:28,marginBottom:12}}>
                    {activeTab==="pais"?"🛰":activeTab==="latam"?"🌎":"🔭"}
                  </div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"rgba(255,255,255,0.2)",marginBottom:8}}>
                    {search ? `Sin resultados para "${search}"` : activeTab==="pais" ? `No encontramos noticias recientes de ${userCountry}` : "Sin noticias disponibles"}
                  </div>
                  {search && <button onClick={()=>setSearch("")} style={{fontSize:10,color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",cursor:"pointer",background:"none",border:"none",textDecoration:"underline"}}>Limpiar búsqueda</button>}
                  {activeTab==="pais" && !search && (
                    <button onClick={()=>setActiveTab("latam")} style={{marginTop:8,fontSize:10,color:"#6EE7B7",fontFamily:"'IBM Plex Mono',monospace",cursor:"pointer",background:"none",border:"none",textDecoration:"underline",display:"block",margin:"8px auto 0"}}>
                      Ver noticias LATAM →
                    </button>
                  )}
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
