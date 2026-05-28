from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from skyfield.api import load, wgs84
from datetime import datetime, timedelta, timezone
from deep_translator import GoogleTranslator
import httpx
import json
import os
import threading
import resend

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SANTIAGO = wgs84.latlon(-33.4489, -70.6693, elevation_m=570)

SATELLITE_IDS = {
    # ── GLOBALES ──────────────────────────────────────
    "ISS":       25544,   # Estacion Espacial Internacional
    "HST":       20580,   # Hubble Space Telescope
    "TIANGONG":  48274,   # Estacion Espacial China
    "STARLINK":  44713,   # Starlink (representativo)

    # ── CHILE 🇨🇱 ──────────────────────────────────────
    "SSOT":      38011,   # FASat-Charlie / SSOT
    "LEMU":      60532,   # LEMU NGE (privado)
    "SUCHAI2":   57757,   # SUCHAI-2 (U. de Chile)
    "SUCHAI3":   57758,   # SUCHAI-3 (U. de Chile)
    "PLANTSAT":  52188,   # PlantSat (U. de Chile)

    # ── ARGENTINA 🇦🇷 ──────────────────────────────────
    "ARSAT1":    40272,   # ARSAT-1 (GEO, posicion fija)
    "ARSAT2":    40941,   # ARSAT-2 (GEO, posicion fija)

    # ── BRASIL 🇧🇷 ─────────────────────────────────────
    "AMAZONIA1": 47699,   # Amazonia-1 (observacion terrestre)
    "SGDC":      42692,   # SGDC-1 (GEO, defensa/comunicaciones)

    # ── MEXICO 🇲🇽 ─────────────────────────────────────
    "MORELOS3":  41036,   # Morelos-3 (GEO, telecomunicaciones)

    # ── BOLIVIA 🇧🇴 ────────────────────────────────────
    "TUPAC":     39217,   # Tupac Katari (GEO, telecomunicaciones)

    # ── VENEZUELA 🇻🇪 ──────────────────────────────────
    "VENESAT":   33410,   # VENESAT-1 Simon Bolivar (GEO)

    # ── PERU 🇵🇪 ───────────────────────────────────────
    "PERUSAT1":  41818,   # PeruSAT-1 (observacion terrestre)

    # ── COLOMBIA 🇨🇴 ───────────────────────────────────
    "LIBERTAD1": 31128,   # Libertad-1 (reingreso 2008, historico)

    # ── ECUADOR 🇪🇨 ────────────────────────────────────
    "PEGASO":    38760,   # NEE-01 Pegaso (reingreso, historico)
}

# Satelites GEO — orbita fija, no generan pases visibles desde tierra
GEO_SATS = {"ARSAT1", "ARSAT2", "SGDC", "MORELOS3", "TUPAC", "VENESAT"}

# Satelites historicos que ya reingresaron — solo informacion, sin TLE activo
REINGRESED_SATS = {"LIBERTAD1", "PEGASO"}

# TLE sources — se prueban en orden hasta que una funcione
def tle_urls(norad_id):
    return [
        # CelesTrak GP JSON (devuelve JSON, parseamos abajo)
        f"https://celestrak.org/NORAD/elements/gp.php?CATNR={norad_id}&FORMAT=tle",
        # CelesTrak alternativo
        f"https://celestrak.org/satcat/gp.php?CATNR={norad_id}&FORMAT=tle",
        # Heavens-Above via satnogs
        f"https://db.satnogs.org/api/tle/?norad_cat_id={norad_id}&format=json",
        # KeepTrack TLE mirror
        f"https://celestrak.org/NORAD/elements/gp.php?CATNR={norad_id}&FORMAT=json",
    ]

ts = load.timescale()
_tle_cache      = {}   # sat_id -> EarthSatellite
_tle_cache_time = {}   # sat_id -> datetime
TLE_TTL_HOURS   = 6
LOW_INCL_SATS   = {"HST"}

_news_cache = {"date": None, "articles": []}
NEWS_CACHE_FILE = "news_cache.json"


# ── TLE loading ──────────────────────────────────────────────────────────────

# TLE lines hardcodeadas como último fallback (se actualizan al arrancar)
_TLE_FALLBACK = {
    "ISS":     ("ISS (ZARYA)", "1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9993", "2 25544  51.6412  47.6303 0001EB  88.9232 271.2077 15.49577947435406"),
    "HST":     ("HST",         "1 20580U 90037B   24001.50000000  .00000882  00000-0  37578-4 0  9994", "2 20580  28.4694 152.9731 0002717 312.4539  47.5768 15.09437741 78640"),
    "TIANGONG":("CSS (TIANHE)", "1 48274U 21035A   24001.50000000  .00015000  00000-0  17000-3 0  9991", "2 48274  41.4700 120.0000 0005000  90.0000 270.0000 15.61000000160000"),
    "SSOT":    ("SSOT",         "1 38011U 11075A   24001.50000000  .00000100  00000-0  50000-4 0  9995", "2 38011  97.7800  90.0000 0001500  90.0000 270.0000 14.87000000600000"),
    "LEMU":    ("LEMU NGE",     "1 60532U 24122A   24001.50000000  .00001000  00000-0  50000-4 0  9990", "2 60532  97.5000 100.0000 0001000  90.0000 270.0000 15.15000000 10000"),
    "SUCHAI2": ("SUCHAI-2",     "1 57757U 23009AH  24001.50000000  .00001500  00000-0  80000-4 0  9993", "2 57757  97.5000 100.0000 0001000  90.0000 270.0000 15.15000000 50000"),
    "SUCHAI3": ("SUCHAI-3",     "1 57758U 23009AJ  24001.50000000  .00001500  00000-0  80000-4 0  9992", "2 57758  97.5000 100.0000 0001000  90.0000 270.0000 15.15000000 50000"),
}


def _download_tle_text(norad_id: int) -> str | None:
    """Try multiple sources until one returns valid TLE text."""
    import urllib.request, json as _json

    urls = [
        f"https://celestrak.org/NORAD/elements/gp.php?CATNR={norad_id}&FORMAT=tle",
        f"https://celestrak.org/satcat/gp.php?CATNR={norad_id}&FORMAT=tle",
        f"https://celestrak.org/NORAD/elements/gp.php?CATNR={norad_id}&FORMAT=tle",
    ]

    for url in urls:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "AustralOrbit/1.0"})
            with urllib.request.urlopen(req, timeout=12) as resp:
                text = resp.read().decode("utf-8").strip()
                if not text:
                    continue
                # Si es JSON con TLE_LINE1/TLE_LINE2
                if text.startswith("[") or text.startswith("{"):
                    try:
                        data = _json.loads(text)
                        if isinstance(data, list) and data:
                            d = data[0]
                        else:
                            d = data
                        line1 = d.get("TLE_LINE1") or d.get("line1") or d.get("tle_line1")
                        line2 = d.get("TLE_LINE2") or d.get("line2") or d.get("tle_line2")
                        name  = d.get("OBJECT_NAME") or d.get("name") or "SAT"
                        if line1 and line2:
                            return f"{name}\n{line1}\n{line2}"
                    except Exception as je:
                        print(f"[TLE] JSON parse error {url}: {je}")
                    continue
                # Texto TLE normal
                lines = [l.strip() for l in text.splitlines() if l.strip()]
                if len(lines) >= 2:
                    return text
        except Exception as e:
            print(f"[TLE] Failed {url}: {e}")

    # Intentar SatNOGS como último recurso online
    try:
        satnogs_url = f"https://db.satnogs.org/api/tle/?norad_cat_id={norad_id}&format=json"
        req = urllib.request.Request(satnogs_url, headers={"User-Agent": "AustralOrbit/1.0"})
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = _json.loads(resp.read().decode("utf-8"))
            if data:
                d = data[0]
                line1 = d.get("tle1") or d.get("TLE_LINE1")
                line2 = d.get("tle2") or d.get("TLE_LINE2")
                name  = d.get("tle0") or d.get("OBJECT_NAME") or "SAT"
                if line1 and line2:
                    print(f"[TLE] Got from SatNOGS: {norad_id}")
                    return f"{name}\n{line1}\n{line2}"
    except Exception as e:
        print(f"[TLE] SatNOGS failed: {e}")

    return None


def _parse_tle_text(text: str):
    """Parse raw TLE text into EarthSatellite (handles 2-line or 3-line)."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if len(lines) >= 3:
        name, line1, line2 = lines[0], lines[1], lines[2]
    elif len(lines) == 2:
        name, line1, line2 = "SAT", lines[0], lines[1]
    else:
        return None
    from skyfield.api import EarthSatellite
    return EarthSatellite(line1, line2, name, ts)


def get_satellite(sat_id: str):
    """Return cached EarthSatellite, refreshing TLE if stale."""
    now = datetime.now(timezone.utc)
    cached_time = _tle_cache_time.get(sat_id)
    expired = (
        cached_time is None
        or (now - cached_time).total_seconds() > TLE_TTL_HOURS * 3600
    )

    if sat_id in _tle_cache and not expired:
        return _tle_cache[sat_id]

    norad_id = SATELLITE_IDS[sat_id]
    tle_file = f"tle_{sat_id.lower()}.txt"

    # 1. Try downloading fresh TLE
    text = _download_tle_text(norad_id)

    if text:
        with open(tle_file, "w") as f:
            f.write(text)
        sat = _parse_tle_text(text)
        print(f"[TLE] Downloaded fresh TLE for {sat_id}")
    elif os.path.exists(tle_file):
        # 2. Use stale cached file
        print(f"[TLE] Using stale disk cache for {sat_id}")
        with open(tle_file, "r") as f:
            text = f.read()
        sat = _parse_tle_text(text)
    else:
        # 3. Last resort: hardcoded approximate TLE
        print(f"[TLE] Using hardcoded fallback TLE for {sat_id}")
        if sat_id in _TLE_FALLBACK:
            name, line1, line2 = _TLE_FALLBACK[sat_id]
            from skyfield.api import EarthSatellite
            try:
                sat = EarthSatellite(line1, line2, name, ts)
                # Save to disk so next time we at least have something
                with open(tle_file, "w") as f:
                    f.write(f"{name}\n{line1}\n{line2}")
            except Exception as e:
                print(f"[TLE] Fallback parse error {sat_id}: {e}")
                sat = None
        else:
            sat = None

    _tle_cache[sat_id] = sat
    _tle_cache_time[sat_id] = now
    return sat


def _preload_all_tles():
    """Pre-download all TLEs on startup so first request is instant."""
    print("[STARTUP] Pre-loading TLEs...")
    for sat_id in SATELLITE_IDS:
        try:
            sat = get_satellite(sat_id)
            status = "OK" if sat else "FAILED"
            print(f"[STARTUP]  {sat_id}: {status}")
        except Exception as e:
            print(f"[STARTUP]  {sat_id}: ERROR {e}")
    print("[STARTUP] TLEs loaded.")


# ── Pass calculation ─────────────────────────────────────────────────────────

def _compute_passes(sat_id: str, days: int, result: list, user_lat: float = -33.4489, user_lon: float = -70.6693):
    try:
        sat = get_satellite(sat_id)
        if not sat:
            result.append({"error": "No se pudo cargar el satélite"})
            return

        # Ubicación del usuario (por defecto Santiago)
        observer = wgs84.latlon(user_lat, user_lon, elevation_m=0)

        ahora = datetime.now(timezone.utc)
        t0 = ts.from_datetime(ahora)
        search_days = min(days, 5) if sat_id in LOW_INCL_SATS else days
        t1 = ts.from_datetime(ahora + timedelta(days=search_days))
        min_el = 5.0 if sat_id in LOW_INCL_SATS else 10.0

        tiempos, eventos = sat.find_events(observer, t0, t1, altitude_degrees=min_el)

        passes, pase = [], {}
        for t, evento in zip(tiempos, eventos):
            dt = t.utc_datetime()
            dif = (sat - observer).at(t)
            alt, az, dist = dif.altaz()
            if evento == 0:
                pase = {"rise": dt.isoformat(), "rise_az": float(round(az.degrees, 1))}
            elif evento == 1:
                pase["max"]    = dt.isoformat()
                pase["max_el"] = float(round(alt.degrees, 1))
                pase["max_az"] = float(round(az.degrees, 1))
            elif evento == 2:
                if "rise" not in pase or "max" not in pase:
                    pase = {}
                    continue
                pase["set"]    = dt.isoformat()
                pase["set_az"] = float(round(az.degrees, 1))
                rise_dt = datetime.fromisoformat(pase["rise"])
                pase["duration"] = int((dt - rise_dt.replace(tzinfo=timezone.utc)).seconds)
                pase["visible"]  = bool(pase.get("max_el", 0) > 25)
                passes.append(pase)
                pase = {}

        result.append({"satellite": sat_id, "passes": passes,
                        "observer": {"lat": user_lat, "lon": user_lon}})

    except Exception as e:
        print(f"[PASSES] Error {sat_id}: {e}")
        result.append({"error": str(e)})


def get_passes(sat_id: str, days: int = 3, user_lat: float = -33.4489, user_lon: float = -70.6693):
    if sat_id not in SATELLITE_IDS:
        return {"error": "Satélite no encontrado"}

    timeout_sec = 30 if sat_id in LOW_INCL_SATS else 25
    result = []
    t = threading.Thread(target=_compute_passes, args=(sat_id, days, result, user_lat, user_lon))
    t.start()
    t.join(timeout=timeout_sec)

    if not result:
        print(f"[PASSES] Timeout {sat_id} — invalidating cache")
        _tle_cache.pop(sat_id, None)
        _tle_cache_time.pop(sat_id, None)
        return {
            "satellite": sat_id,
            "passes": [],
            "warning": f"Timeout calculando pases de {sat_id}. Intenta nuevamente.",
        }
    return result[0]


# ── Position ─────────────────────────────────────────────────────────────────

def get_position(sat_id: str, user_lat: float = -33.4489, user_lon: float = -70.6693):
    if sat_id not in SATELLITE_IDS:
        return {"error": "Satélite no encontrado"}
    sat = get_satellite(sat_id)
    if not sat:
        return {"error": "No se pudo cargar"}
    t = ts.now()
    geocentric = sat.at(t)
    subpoint   = wgs84.subpoint(geocentric)
    observer   = wgs84.latlon(user_lat, user_lon, elevation_m=0)
    dif        = (sat - observer).at(t)
    alt, az, dist = dif.altaz()
    # Mantener compatibilidad con campo "from_santiago" pero calculado desde usuario
    return {
        "satellite": sat_id,
        "lat":       float(round(subpoint.latitude.degrees, 4)),
        "lon":       float(round(subpoint.longitude.degrees, 4)),
        "alt_km":    float(round(subpoint.elevation.km, 1)),
        "elevation_from_santiago": float(round(alt.degrees, 1)),
        "azimuth_from_santiago":   float(round(az.degrees, 1)),
        "distance_km":             float(round(dist.km, 0)),
        "visible_from_santiago":   bool(alt.degrees > 0),
        "observer_lat": user_lat,
        "observer_lon": user_lon,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ── News ─────────────────────────────────────────────────────────────────────

def translate(text: str) -> str:
    try:
        if not text or len(text.strip()) < 5:
            return text
        return GoogleTranslator(source="en", target="es").translate(text[:500])
    except Exception:
        return text


def load_news_cache():
    if os.path.exists(NEWS_CACHE_FILE):
        try:
            with open(NEWS_CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"date": None, "articles": []}


def save_news_cache(data):
    with open(NEWS_CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


async def fetch_and_translate_news():
    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://api.spaceflightnewsapi.net/v4/articles/?limit=12&ordering=-published_at",
            timeout=15,
        )
        data = r.json()
    articles = []
    meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
    for a in data.get("results", []):
        try:
            pub = datetime.fromisoformat(a["published_at"].replace("Z", "+00:00"))
            articles.append({
                "title":         translate(a["title"]),
                "title_en":      a["title"],
                "summary":       translate(a.get("summary", "")[:400]),
                "url":           a["url"],
                "image":         a.get("image_url", ""),
                "source":        a["news_site"],
                "published":     f"{pub.day} {meses[pub.month-1]} {pub.year} · {pub.strftime('%H:%M')}",
                "published_raw": a["published_at"],
            })
        except Exception as e:
            print(f"[NEWS] Error: {e}")
    return articles


async def get_news_cached():
    global _news_cache
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if not _news_cache["articles"]:
        _news_cache = load_news_cache()
    if _news_cache.get("date") == today and _news_cache.get("articles"):
        return _news_cache["articles"]
    print(f"[NEWS] Actualizando para {today}...")
    try:
        articles = await fetch_and_translate_news()
        _news_cache = {"date": today, "articles": articles}
        save_news_cache(_news_cache)
        return articles
    except Exception as e:
        print(f"[NEWS] Error: {e}")
        return _news_cache.get("articles", [])


# ── Startup: pre-load TLEs in background ─────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    threading.Thread(target=_preload_all_tles, daemon=True).start()


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "AustralOrbit API funcionando 🛰️"}

@app.get("/passes/{sat_id}")
def passes(sat_id: str, days: int = 3, lat: float = -33.4489, lon: float = -70.6693):
    sid = sat_id.upper()
    # Satelites GEO — no tienen pases visibles desde tierra
    if sid in GEO_SATS:
        return {"satellite": sid, "passes": [], "type": "GEO",
                "message": "Satelite geoestacionario — orbita fija, no genera pases visibles desde tierra"}
    # Satelites historicos que ya reingresaron
    if sid in REINGRESED_SATS:
        return {"satellite": sid, "passes": [], "type": "REINGRESED",
                "message": "Satelite historico — ya reingreso a la atmosfera, sin TLE activo"}
    return get_passes(sid, days, user_lat=lat, user_lon=lon)

@app.get("/position/{sat_id}")
def position(sat_id: str, lat: float = -33.4489, lon: float = -70.6693):
    sid = sat_id.upper()
    # Satelites GEO — posicion fija aproximada sobre el ecuador
    if sid in GEO_SATS:
        geo_lons = {
            "ARSAT1": -71.8, "ARSAT2": -81.0,
            "SGDC": -75.0, "MORELOS3": -116.8,
            "TUPAC": -87.2, "VENESAT": -78.0,
        }
        lon = geo_lons.get(sid, -75.0)
        return {
            "satellite": sid, "type": "GEO",
            "lat": 0.0, "lon": lon,
            "alt_km": 35786,
            "speed_kmh": 3070,
            "visible_from_santiago": False,
            "elevation_from_santiago": -90,
            "azimuth_from_santiago": 0,
            "distance_km": 35786,
            "message": f"Orbita geoestacionaria fija — {lon}° W"
        }
    # Satelites historicos
    if sid in REINGRESED_SATS:
        return {"satellite": sid, "type": "REINGRESED",
                "message": "Ya reingreso a la atmosfera"}
    return get_position(sid)

@app.get("/news")
async def news():
    articles = await get_news_cached()
    return {"articles": articles, "count": len(articles)}

@app.post("/news/refresh")
async def refresh_news():
    global _news_cache
    _news_cache = {"date": None, "articles": []}
    if os.path.exists(NEWS_CACHE_FILE):
        os.remove(NEWS_CACHE_FILE)
    articles = await get_news_cached()
    return {"status": "actualizado", "count": len(articles)}

@app.get("/spaceweather/kp")
async def kp_index():
    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json", timeout=10)
        return r.json()

@app.get("/spaceweather/wind")
async def solar_wind():
    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json", timeout=10)
        return r.json()

@app.get("/spaceweather/alerts")
async def space_alerts():
    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://services.swpc.noaa.gov/products/alerts.json", timeout=10)
        return r.json()

@app.get("/launches/upcoming")
async def launches_upcoming():
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(
                "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=12&ordering=net&mode=detailed",
                timeout=20, headers={"User-Agent": "AustralOrbit/1.0"})
            if r.status_code == 429:
                raise Exception("rate limit")
            return r.json()
        except Exception:
            r = await client.get(
                "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=12&ordering=net&mode=detailed",
                timeout=20)
            return r.json()


# ── Contact form ──────────────────────────────────────────────────────────────

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

@app.post("/contact")
async def contact(form: ContactForm):
    resend.api_key = os.getenv("RESEND_API_KEY", "")
    tu_email = os.getenv("TU_EMAIL", "")

    if not resend.api_key or not tu_email:
        return {"ok": False, "error": "Servidor no configurado para envío de emails"}

    try:
        resend.Emails.send({
            "from": "Austral Orbit <onboarding@resend.dev>",
            "to": tu_email,
            "subject": f"Mensaje de {form.name} — Austral Orbit",
            "html": f"""
                <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:12px;">
                  <h2 style="margin:0 0 24px;color:#050816;">📡 Nuevo mensaje — Austral Orbit</h2>
                  <table style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:10px 0;color:#555;font-size:13px;width:100px;">Nombre</td>
                      <td style="padding:10px 0;font-weight:600;color:#111;">{form.name}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;color:#555;font-size:13px;">Email</td>
                      <td style="padding:10px 0;color:#57C7FF;">{form.email}</td>
                    </tr>
                  </table>
                  <div style="margin-top:20px;padding:16px;background:#fff;border-radius:8px;border:1px solid #eee;">
                    <p style="margin:0;color:#333;line-height:1.7;font-size:14px;">{form.message}</p>
                  </div>
                  <p style="margin-top:24px;font-size:11px;color:#aaa;">Enviado desde australorbit.com</p>
                </div>
            """,
        })
        return {"ok": True}
    except Exception as e:
        print(f"[CONTACT] Error: {e}")
        return {"ok": False, "error": str(e)}
