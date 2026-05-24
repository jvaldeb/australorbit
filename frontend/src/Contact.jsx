import { useState } from "react";

const API = "https://australorbit-production.up.railway.app";

const glass = (extra = {}) => ({
  background: "rgba(255,255,255,0.028)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  borderRadius: 20,
  ...extra,
});

export default function Contact() {
  const [form, setForm]         = useState({ name: "", email: "", message: "" });
  const [status, setStatus]     = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const r = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (data.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 12,
    padding: "13px 16px",
    color: "#F0F4F8",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.22em",
    color: "rgba(255,255,255,0.25)",
    textTransform: "uppercase",
    marginBottom: 7,
    display: "block",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#000;color:#E0E8F0;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#111;border-radius:2px;}
        textarea{resize:vertical;}
        input:focus,textarea:focus{border-color:rgba(87,199,255,0.45)!important;box-shadow:0 0 0 3px rgba(87,199,255,0.06);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes earthDrift{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.022)}}
        @keyframes earthFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.15;transform:scale(1.6)}}
        .nav-section-link{text-decoration:none;transition:opacity 0.2s;white-space:nowrap;}
        .nav-section-link:hover{opacity:1!important;}
        .nav-hamburger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;flex-direction:column;gap:5px;padding:0;}
        .nav-hamburger span{display:block;width:18px;height:1.5px;background:rgba(255,255,255,0.8);border-radius:2px;}
        @media(max-width:600px){
          .nav-desktop-sections{display:none!important;}
          .nav-desktop-clock{display:none!important;}
          .nav-hamburger{display:flex!important;}
          .contact-grid{grid-template-columns:1fr!important;}
          .page-padding{padding:0 16px!important;}
        }
      `}</style>

      {/* Background */}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,background:"#000"}}/>
        <div style={{position:"absolute",inset:0,animation:"earthFadeIn 2.5s ease both"}}>
          <img src="/earth-bg.png" alt="" style={{
            position:"absolute",top:"50%",left:"50%",
            transform:"translate(-50%,-50%)",
            width:"90vmin",height:"90vmin",objectFit:"contain",
            opacity:0.18,animation:"earthDrift 55s ease-in-out infinite",
            filter:"saturate(0.8) brightness(0.9)",pointerEvents:"none",
          }}/>
        </div>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 120% 90% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"22%",background:"linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"22%",background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.015}}>
          <defs><pattern id="pg" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke="#57C7FF" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg)"/>
        </svg>
      </div>

      <div className="page-padding" style={{position:"relative",zIndex:1,padding:"0 24px",minHeight:"100vh"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>

          {/* Mobile menu drawer */}
          {menuOpen && (
            <div onClick={()=>setMenuOpen(false)} style={{
              position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:200,
              background:"rgba(0,0,0,0.5)",
            }}/>
          )}
          {menuOpen && (
            <div style={{
              position:"fixed",top:0,left:0,right:0,zIndex:210,
              background:"rgba(0,0,0,0.97)",
              borderBottom:"1px solid rgba(255,255,255,0.08)",
              backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",
              padding:"80px 24px 24px",
              display:"flex",flexDirection:"column",gap:4,
              animation:"fadeUp 0.2s ease both",
            }}>
              {[["Rastreo","/"],["Lanzamientos","/lanzamientos"],["Clima espacial","/espacio"],["Noticias","/noticias"],["Contacto","/contacto"]].map(([label,href])=>(
                <a key={href} href={href} style={{
                  fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,
                  color:href==="/contacto"?"#fff":"rgba(255,255,255,0.6)",
                  textDecoration:"none",padding:"14px 0",
                  borderBottom:"1px solid rgba(255,255,255,0.06)",
                  transition:"color 0.2s",
                }}>{label}</a>
              ))}
            </div>
          )}

          {/* Nav */}
          <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",animation:"fadeIn 0.7s ease both",gap:16,position:"relative",zIndex:220}}>
            <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
              {!logoError
                ? <img src="/logo.png" alt="Austral Orbit" onError={()=>setLogoError(true)} style={{height:52,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 16px rgba(10,28,80,0.6)) brightness(1.08)"}}/>
                : <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#fff"}}>AO</span>
              }
              <div>
                <div style={{display:"flex",alignItems:"baseline",gap:7}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.06em",color:"#fff"}}>AUSTRAL</span>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontStyle:"italic",color:"#57C7FF"}}>Orbit</span>
                </div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:7,letterSpacing:"0.28em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginTop:1}}>Santiago · 33.4°S</div>
              </div>
            </div>

            <div className="nav-desktop-sections" style={{display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"}}>
              {[["Rastreo","/"],["Lanzamientos","/lanzamientos"],["Clima espacial","/espacio"],["Noticias","/noticias"],["Contacto","/contacto"]].map(([label,href])=>(
                <a key={href} href={href} className="nav-section-link"
                  style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",
                    color:href==="/contacto"?"#fff":"rgba(255,255,255,0.5)",
                    padding:"8px 18px",borderRadius:99,
                    background:href==="/contacto"?"rgba(255,255,255,0.06)":"transparent",
                    border:href==="/contacto"?"1px solid rgba(255,255,255,0.12)":"1px solid transparent",
                  }}>{label}</a>
              ))}
            </div>

            <button
              className="nav-hamburger"
              onClick={()=>setMenuOpen(o=>!o)}
              aria-label="Menú"
              style={{
                display:"none",alignItems:"center",justifyContent:"center",
                width:40,height:40,borderRadius:10,
                background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.1)",
                cursor:"pointer",flexDirection:"column",gap:5,padding:0,
              }}
            >
              <span style={{display:"block",width:18,height:1.5,background:"rgba(255,255,255,0.8)",borderRadius:2,transition:"all 0.25s",transform:menuOpen?"rotate(45deg) translate(4.5px,4.5px)":"none"}}/>
              <span style={{display:"block",width:18,height:1.5,background:"rgba(255,255,255,0.8)",borderRadius:2,transition:"all 0.25s",opacity:menuOpen?0:1}}/>
              <span style={{display:"block",width:18,height:1.5,background:"rgba(255,255,255,0.8)",borderRadius:2,transition:"all 0.25s",transform:menuOpen?"rotate(-45deg) translate(4.5px,-4.5px)":"none"}}/>
            </button>
          </nav>

          {/* Hero */}
          <div style={{padding:"56px 0 48px",animation:"fadeUp 0.9s ease both",maxWidth:620}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:99,...glass({}),marginBottom:22}}>
              <span style={{display:"block",width:4,height:4,borderRadius:"50%",background:"#57C7FF",animation:"livePulse 2.2s infinite"}}/>
              <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:"#57C7FF",letterSpacing:"0.2em",textTransform:"uppercase"}}>Austral Orbit · Chile</span>
            </div>
            <h1 style={{lineHeight:1.08,letterSpacing:"-0.02em",marginBottom:16}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,color:"#fff",display:"block"}}>¿Tienes algo que</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,4.2vw,52px)",fontStyle:"italic",color:"#57C7FF",display:"block"}}>decirme?</span>
            </h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.35)",lineHeight:1.8,fontWeight:300}}>
              Sugerencias, colaboraciones o simplemente saludar — escríbeme y te respondo a la brevedad.
            </p>
          </div>

          {/* Form + info grid */}
          <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:24,paddingBottom:60,alignItems:"start"}}>

            {/* Form */}
            <div style={{...glass({}),padding:"32px 36px",animation:"fadeUp 1s ease 0.1s both"}}>
              {status === "ok" ? (
                <div style={{textAlign:"center",padding:"48px 0"}}>
                  <div style={{fontSize:40,marginBottom:16}}>✅</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:10}}>Mensaje enviado</div>
                  <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",lineHeight:1.7}}>Gracias por escribir. Te respondo pronto.</p>
                  <button onClick={()=>setStatus(null)} style={{marginTop:24,padding:"10px 24px",borderRadius:99,background:"rgba(87,199,255,0.1)",border:"1px solid rgba(87,199,255,0.3)",color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.12em",cursor:"pointer"}}>
                    ENVIAR OTRO
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:20}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                    <div>
                      <label style={labelStyle}>Nombre</label>
                      <input name="name" value={form.name} onChange={handleChange}
                        placeholder="Tu nombre" required style={inputStyle}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="tucorreo@email.com" required style={inputStyle}/>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Mensaje</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      placeholder="Escribe tu mensaje aquí..." required rows={6}
                      style={{...inputStyle,lineHeight:1.7}}/>
                  </div>
                  {status === "error" && (
                    <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.2)",fontSize:12,color:"#f87171",fontFamily:"'IBM Plex Mono',monospace"}}>
                      Error al enviar. Intenta nuevamente.
                    </div>
                  )}
                  <button type="submit" disabled={status==="sending"}
                    style={{padding:"14px 28px",borderRadius:99,background:status==="sending"?"rgba(87,199,255,0.06)":"rgba(87,199,255,0.12)",border:"1px solid rgba(87,199,255,0.35)",color:"#57C7FF",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.14em",cursor:status==="sending"?"not-allowed":"pointer",transition:"all 0.2s",alignSelf:"flex-start",opacity:status==="sending"?0.6:1}}>
                    {status === "sending" ? "ENVIANDO..." : "ENVIAR MENSAJE →"}
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div style={{display:"flex",flexDirection:"column",gap:12,animation:"fadeUp 1s ease 0.2s both"}}>
              {[
                { icon:"🛰", title:"Proyecto", text:"Austral Orbit es un proyecto personal en desarrollo continuo. Siempre hay algo nuevo por agregar." },
                { icon:"🌎", title:"Enfoque", text:"Latinoamérica primero. Si tienes ideas para sumar satélites, países o funciones regionales, escríbeme." },
                { icon:"🤝", title:"Colaboraciones", text:"Abierto a colaborar con estudiantes, investigadores o entusiastas del espacio en la región." },
              ].map(({icon,title,text})=>(
                <div key={title} style={{...glass({}),padding:"20px 22px",display:"flex",gap:14,alignItems:"flex-start"}}>
                  <span style={{fontSize:20,flexShrink:0,marginTop:2}}>{icon}</span>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#fff",marginBottom:6}}>{title}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.7}}>{text}</div>
                  </div>
                </div>
              ))}

              {/* Nav links */}
              <div style={{...glass({}),padding:"20px 22px"}}>
                <div style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.22em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:14}}>Explorar</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[["Rastreo en vivo","/"],["Lanzamientos globales","/lanzamientos"],["Clima espacial","/espacio"],["Noticias espaciales","/noticias"]].map(([label,href])=>(
                    <a key={href} href={href} style={{fontSize:13,color:"rgba(255,255,255,0.5)",textDecoration:"none",fontFamily:"'Outfit',sans-serif",transition:"color 0.2s",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:4,height:4,borderRadius:"50%",background:"rgba(87,199,255,0.4)",flexShrink:0,display:"block"}}/>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(87,199,255,0.25),transparent)"}}/>
          <div style={{padding:"16px 0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.1em"}}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>Powered by Skyfield · CelesTrak · Spaceflight News API</div>
          </div>
        </div>
      </div>
    </>
  );
}