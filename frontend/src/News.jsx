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
  ["Satélites LATAM",      "/satelites-chilenos"],
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

function NewsCard({ article, featured = false }) {
  const accentColor = article.latam ? "#6EE7B7" : "#57C7FF";
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className="news-card"
      style={{
        display:"flex", flexDirection:"column", textDecoration:"none",
        borderRadius: featured ? 22 : 18, overflow:"hidden",
        background:"rgba(255,255,255,0.025)",
        border:`1px solid rgba(255,255,255,${featured?"0.1":"0.06"})`,
        backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)",
        position:"relative",
      }}>
      {article.image && (
        <div style={{height: featured ? 260 : 190, overflow:"hidden", flexShrink:0, position:"relative"}}>
          <img src={article.image} alt={article.title}
            style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.75,display:"block"}}
            onError={e=>{e.target.parentElement.style.display="none";}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)"}}/>
          <div style={{position:"absolute",bottom:12,left:14,display:"flex",gap:6,alignItems:"center"}}>
            {article.latam && <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",padding:"3px 9px",borderRadius:6,background:"rgba(110,231,183,0.25)",color:"#6EE7B7",border:"1px solid rgba(110,231,183,0.4)",letterSpacing:"0.12em"}}>LATAM</span>}
            <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",padding:"3px 9px",borderRadius:6,background:"rgba(0,0,0,0.5)",color:"rgba(255,255,255,0.7)",letterSpacing:"0.1em"}}>{(article.source||"SPACE").toUpperCase()}</span>
          </div>
          <div style={{position:"absolute",top:12,right:12,fontSize:8.5,color:"rgba(255,255,255,0.4)",fontFamily:"'IBM Plex Mono',monospace",background:"rgba(0,0,0,0.4)",padding:"2px 8px",borderRadius:5}}>{article.published}</div>
        </div>
      )}
      <div style={{padding: featured ? "20px 22px" : "15px 17px", display:"flex",flexDirection:"column",gap:9,flex:1}}>
        {!article.image && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {article.latam && <span style={{fontSize:7,fontFamily:"'IBM Plex Mono',monospace",padding:"2px 7px",borderRadius:4,background:"rgba(110,231,183,0.12)",color:"#6EE7B7",border:"1px solid rgba(110,231,183,0.25)",letterSpacing:"0.1em"}}>LATAM</span>}
              <span style={{fontSize:7.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em",padding:"3px 8px",borderRadius:5,background:`${accentColor}10`,color:accentColor,border:`1px solid ${accentColor}20`}}>{(article.source||"SPACE").toUpperCase()}</span>
            </div>
            <span style={{fontSize:8.5,color:"rgba(255,255,255,0.2)",fontFamily:"'IBM Plex Mono',monospace"}}>{article.published}</span>
          </div>
        )}
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:featured?17:14,fontWeight:700,color:"rgba(255,255,255,0.9)",lineHeight:1.35,letterSpacing:"-0.01em"}}>{article.title}</div>
        {article.summary && (
          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.7,flex:1,display:"-webkit-box",WebkitLineClamp:featured?4:3,WebkitBoxOrient:"vertical",overflow:"hidden",fontWeight:300}}>{article.summary}</div>
        )}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:2}}>
          <span style={{fontSize:9.5,color:accentColor,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em"}}>Leer →</span>
        </div>
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
  const [activeTab, setActiveTab]     = useState("global");
  const [search, setSearch]           = useState("");
  const [activeSource, setActiveSource] = useState("Todos");

  // Keywords LATAM para filtro local — funciona aunque el backend no tenga el endpoint
  const LATAM_KW = [
    "chile","chileno","chilena","argentina","argentino","brasil","brazil","brasileiro",
    "mexico","méxico","mexicano","colombia","colombiano","peru","perú","peruano",
    "venezuela","bolivar","bolivia","boliviano","ecuador","ecuatoriano",
    "latin america","latinoamérica","south america","sudamérica","southern hemisphere",
    "atacama","alma telescope","paranal","eso observatory","conae","inpe","invap",
    "arsat","suchai","lemu","fasat","andes","amazon","patagonia","aurora austral",
  ];

  function filterLatam(articles) {
    return articles
      .filter(a => {
        const t = ((a.title||"") + " " + (a.title_en||"") + " " + (a.summary||"")).toLowerCase();
        return LATAM_KW.some(kw => t.includes(kw));
      })
      .map(a => ({...a, latam: true}));
  }

  function filterCountry(articles, code) {
    const MAP = {
      CL: ["chile","chileno","chilena","ssot","suchai","lemu","plantsat","fasat","atacama","alma","fach"],
      AR: ["argentina","argentino","arsat","invap","conae","patagonia"],
      BR: ["brasil","brazil","brasileiro","inpe","amazonia","amazon"],
      MX: ["mexico","mexicano","morelos"],
      CO: ["colombia","colombiano"],
      PE: ["peru","peruano","perusat","conida"],
      VE: ["venezuela","venezolano","venesat"],
      BO: ["bolivia","boliviano","tupac"],
      EC: ["ecuador","ecuatoriano"],
    };
    const kws = MAP[code] || [];
    return articles
      .filter(a => {
        const t = ((a.title||"") + " " + (a.title_en||"") + " " + (a.summary||"")).toLowerCase();
        return kws.some(kw => t.includes(kw));
      })
      .map(a => ({...a, country_match: code}));
  }

  useEffect(() => {
    fetch(`${API}/news`)
      .then(r => r.json())
      .then(d => {
        const arts = Array.isArray(d) ? d : (d.articles || []);
        setGlobalNews(arts);
        setLoading(false);

        // Filtrar LATAM localmente de inmediato (no esperar backend)
        const localLatam = filterLatam(arts);
        setLatamNews(localLatam);
        setLatamLoading(false);

        // Intentar enriquecer con endpoint del backend (opcional, no bloqueante)
        fetch(`${API}/news/latam`)
          .then(r => { if (!r.ok) return null; return r.json(); })
          .then(d => {
            if (!d) return;
            const backendArts = d.articles || [];
            if (backendArts.length > 0) {
              // Combinar: backend + filtro local, deduplicar por URL
              const seen = new Set(backendArts.map(a => a.url));
              const combined = [
                ...backendArts.map(a => ({...a, latam:true})),
                ...localLatam.filter(a => !seen.has(a.url)),
              ];
              setLatamNews(combined);
            }
          })
          .catch(() => {}); // falla silenciosamente — ya tenemos el filtro local
      })
      .catch(() => { setLoading(false); setLatamLoading(false); });
  }, []);

  useEffect(() => {
    if (!userCountryCode) { setCountryLoading(false); return; }
    // Filtro local primero
    const local = filterCountry(globalNews, userCountryCode);
    if (local.length > 0) { setCountryNews(local); setCountryLoading(false); return; }
    // Si no hay nada local, intentar endpoint
    fetch(`${API}/news/country/${userCountryCode}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setCountryNews(d.articles || []); })
      .catch(() => {})
      .finally(() => setCountryLoading(false));
  }, [userCountryCode, globalNews]);

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
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes earthFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes earthDrift{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.022)}}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.15;transform:scale(1.6)}}
        .news-card{
          transition:transform 0.22s cubic-bezier(0.34,1.2,0.64,1),border-color 0.2s,box-shadow 0.22s;
        }
        .news-card:hover{
          transform:translateY(-4px);
          border-color:rgba(87,199,255,0.28)!important;
          box-shadow:0 12px 40px rgba(0,0,0,0.4);
        }
        .news-card:active{transform:scale(0.98);}
        .news-card img{transition:transform 0.5s ease,opacity 0.3s;}
        .news-card:hover img{transform:scale(1.06);opacity:0.88!important;}
        .tab-btn{transition:all 0.2s cubic-bezier(0.34,1.4,0.64,1);cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;padding:8px 16px;border-radius:99px;border:1px solid transparent;}
        .tab-btn:hover{transform:translateY(-2px);}
        .source-pill{transition:all 0.18s cubic-bezier(0.34,1.4,0.64,1);cursor:pointer;}
        .source-pill:hover{transform:translateY(-2px) scale(1.04);}
        .search-input{outline:none;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:9px 14px 9px 36px;color:#E0E8F0;font-family:'IBM Plex Mono',monospace;font-size:11px;width:100%;transition:border-color 0.2s,box-shadow 0.2s;letter-spacing:0.04em;}
        .search-input::placeholder{color:rgba(255,255,255,0.2);}
        .search-input:focus{border-color:rgba(87,199,255,0.4);box-shadow:0 0 0 3px rgba(87,199,255,0.08);}
        .skeleton-card{border-radius:18px;border:1px solid rgba(255,255,255,0.04);overflow:hidden;background:linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 100%);background-size:200% 100%;animation:shimmer 1.8s ease-in-out infinite;}
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
            <div style={{paddingBottom:48}}>
              {filtered.length > 0 && (() => {
                const [featuredArticle, ...restArticles] = filtered;
                return (
                  <>
                    {/* Featured hero */}
                    <div style={{animation:"fadeUp 0.4s ease both",marginBottom:16}}>
                      <NewsCard article={featuredArticle} featured={true}/>
                    </div>

                    {/* Grid asimétrico del resto */}
                    {restArticles.length > 0 && (
                      <div style={{
                        display:"grid",
                        gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
                        gap:14,
                      }}>
                        {restArticles.map((a,i)=>(
                          <div key={i} style={{animation:`fadeUp 0.4s ease ${Math.min((i+1)*0.05,0.5)}s both`}}>
                            <NewsCard article={a} featured={false}/>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}

              {filtered.length === 0 && (
                <div style={{padding:48,textAlign:"center",border:"1px dashed rgba(255,255,255,0.05)",borderRadius:16}}>
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
