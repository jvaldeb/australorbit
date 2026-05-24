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
    "ISS":     25544,
    "HST":     20580,
    "TIANGONG":48274,
    "SSOT":    38011,
    "LEMU":    60532,
    "SUCHAI2": 57757,
    "SUCHAI3": 57758,
}

# CelesTrak GP endpoint — más confiable que el TLE directo
def tle_urls(norad_id):
    return [
        f"https://celestrak.org/NORAD/elements/gp.php?CATNR={norad_id}&FORMAT=tle",
        f"https://celestrak.org/satcat/gp.php?CATNR={norad_id}&FORMAT=tle",
    ]

ts = load.timescale()
_tle_cache      = {}   # sat_id -> EarthSatellite
_tle_cache_time = {}   # sat_id -> datetime
TLE_TTL_HOURS   = 6
LOW_INCL_SATS   = {"HST"}

_news_cache = {"date": None, "articles": []}
NEWS_CACHE_FILE = "news_cache.json"


# ── TLE loading ──────────────────────────────────────────────────────────────

def _download_tle_text(norad_id: int) -> str | None:
    """Try each URL until one returns valid TLE text."""
    for url in tle_urls(norad_id):
        try:
            import urllib.request
            with urllib.request.urlopen(url, timeout=15) as resp:
                text = resp.read().decode("utf-8").strip()
                if text and len(text.splitlines()) >= 3:
                    return text
        except Exception as e:
            print(f"[TLE] Failed {url}: {e}")
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

    # Try downloading fresh TLE
    text = _download_tle_text(norad_id)

    if text:
        # Save to disk as backup
        with open(tle_file, "w") as f:
            f.write(text)
        sat = _parse_tle_text(text)
    elif os.path.exists(tle_file):
        # Download failed — use stale cached file rather than failing
        print(f"[TLE] Using stale cache for {sat_id}")
        with open(tle_file, "r") as f:
            text = f.read()
        sat = _parse_tle_text(text)
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

def _compute_passes(sat_id: str, days: int, result: list):
    try:
        sat = get_satellite(sat_id)
        if not sat:
            result.append({"error": "No se pudo cargar el satélite"})
            return

        ahora = datetime.now(timezone.utc)
        t0 = ts.from_datetime(ahora)
        search_days = min(days, 5) if sat_id in LOW_INCL_SATS else days
        t1 = ts.from_datetime(ahora + timedelta(days=search_days))
        min_el = 5.0 if sat_id in LOW_INCL_SATS else 10.0

        tiempos, eventos = sat.find_events(SANTIAGO, t0, t1, altitude_degrees=min_el)

        passes, pase = [], {}
        for t, evento in zip(tiempos, eventos):
            dt = t.utc_datetime()
            dif = (sat - SANTIAGO).at(t)
            alt, az, dist = dif.altaz()
            if evento == 0:
                pase = {"rise": dt.isoformat(), "rise_az": float(round(az.degrees, 1))}
            elif evento == 1:
                pase["max"]    = dt.isoformat()
                pase["max_el"] = float(round(alt.degrees, 1))
                pase["max_az"] = float(round(az.degrees, 1))
            elif evento == 2:
                pase["set"]    = dt.isoformat()
                pase["set_az"] = float(round(az.degrees, 1))
                rise_dt = datetime.fromisoformat(pase["rise"])
                pase["duration"] = int((dt - rise_dt.replace(tzinfo=timezone.utc)).seconds)
                pase["visible"]  = bool(pase.get("max_el", 0) > 25)
                if "rise" in pase and "max" in pase:
                    passes.append(pase)
                pase = {}

        result.append({"satellite": sat_id, "passes": passes})

    except Exception as e:
        print(f"[PASSES] Error {sat_id}: {e}")
        result.append({"error": str(e)})


def get_passes(sat_id: str, days: int = 3):
    if sat_id not in SATELLITE_IDS:
        return {"error": "Satélite no encontrado"}

    # If TLE already cached, calculation is fast — no thread needed for timeout
    # Still use thread to protect against edge-case hangs
    timeout_sec = 30 if sat_id in LOW_INCL_SATS else 25
    result = []
    t = threading.Thread(target=_compute_passes, args=(sat_id, days, result))
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

def get_position(sat_id: str):
    if sat_id not in SATELLITE_IDS:
        return {"error": "Satélite no encontrado"}
    sat = get_satellite(sat_id)
    if not sat:
        return {"error": "No se pudo cargar"}
    t = ts.now()
    geocentric = sat.at(t)
    subpoint   = wgs84.subpoint(geocentric)
    dif        = (sat - SANTIAGO).at(t)
    alt, az, dist = dif.altaz()
    return {
        "satellite": sat_id,
        "lat":       float(round(subpoint.latitude.degrees, 4)),
        "lon":       float(round(subpoint.longitude.degrees, 4)),
        "alt_km":    float(round(subpoint.elevation.km, 1)),
        "elevation_from_santiago": float(round(alt.degrees, 1)),
        "azimuth_from_santiago":   float(round(az.degrees, 1)),
        "distance_km":             float(round(dist.km, 0)),
        "visible_from_santiago":   bool(alt.degrees > 0),
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
def passes(sat_id: str, days: int = 3):
    return get_passes(sat_id.upper(), days)

@app.get("/position/{sat_id}")
def position(sat_id: str):
    return get_position(sat_id.upper())

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
