// GeoSplash.jsx — pantalla de bienvenida compartida para todas las páginas

export default function GeoSplash({ onAccept, onSkip, accentColor = "#57C7FF" }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:700,
      background:"rgba(0,0,0,0.97)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
      backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      animation:"fadeIn 0.4s ease both",
    }}>
      <div style={{
        maxWidth:380, width:"100%", textAlign:"center",
        animation:"fadeUp 0.5s ease 0.1s both",
      }}>
        <div style={{fontSize:48, marginBottom:20}}>🛰</div>

        <div style={{
          fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800,
          color:"#fff", lineHeight:1.15, marginBottom:12,
        }}>
          El espacio está sobre<br/>
          <span style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic",
            fontWeight:400, color:accentColor,
          }}>tu ciudad</span>
        </div>

        <p style={{
          fontSize:13, color:"rgba(255,255,255,0.4)",
          lineHeight:1.75, marginBottom:28, fontWeight:300,
        }}>
          Austral Orbit personaliza pases, clima espacial y noticias
          exactamente desde donde estás. Necesitamos tu ubicación.
        </p>

        <div style={{
          padding:"12px 16px", borderRadius:12,
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.08)",
          marginBottom:20, fontSize:11,
          color:"rgba(255,255,255,0.3)",
          fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.6,
        }}>
          📍 Solo se usa localmente · No se almacena en servidores
        </div>

        <button
          onClick={onAccept}
          style={{
            width:"100%", padding:"14px", borderRadius:14, marginBottom:10,
            background:accentColor, border:"none",
            color:"#000", fontFamily:"'Syne',sans-serif",
            fontSize:14, fontWeight:700, cursor:"pointer", transition:"opacity 0.2s",
          }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >
          Compartir mi ubicación
        </button>

        <button
          onClick={onSkip}
          style={{
            width:"100%", padding:"12px", borderRadius:14,
            background:"transparent",
            border:"1px solid rgba(255,255,255,0.1)",
            color:"rgba(255,255,255,0.3)",
            fontFamily:"'IBM Plex Mono',monospace",
            fontSize:10, letterSpacing:"0.1em", cursor:"pointer",
          }}
        >
          Continuar sin ubicación
        </button>
      </div>
    </div>
  );
}
