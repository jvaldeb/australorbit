from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from skyfield.api import load, wgs84
from datetime import datetime, timedelta, timezone
from deep_translator import GoogleTranslator
import httpx
import json
import os
import signal
import threading

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SANTIAGO = wgs84.latlon(-33.4489, -70.6693, elevation_m=570)

SATELLITE_URLS = {
    "ISS":     "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle",
    "HST":     "https://celestrak.org/NORAD/elements/gp.php?CATNR=20580&FORMAT=tle",
    "TIANGONG":"https://celestrak.org/NORAD/elements/gp.php?CATNR=48274&FORMAT=tle",
    "SSOT":    "https://celestrak.org/NORAD/elements/gp.php?CATNR=38011&FORMAT=tle",
    "LEMU":    "https://celestrak.org/NORAD/elements/gp.php?CATNR=60532&FORMAT=tle",
    "SUCHAI2": "https://celestrak.org/NORAD/elements/gp.php?CATNR=57757&FORMAT=tle",
    "SUCHAI3": "https://celestrak.org/NORAD/elements/gp.php?CATNR=57758&FORMAT=tle",
}

ts = load.timescale()
_tle_cache      = {}
_tle_cache_time = {}          # tracks when each TLE was loaded
TLE_TTL_HOURS   = 6           # refresh TLE every 6 hours
_news_cache = {"date": None, "articles": []}
NEWS_CACHE_FILE = "news_cache.json"

# Satellites with low inclination pass rarely over Chile — give them more search time
LOW_INCL_SATS = {"HST"}       # Hubble: 28.5° inclination

def get_satellite(sat_id):
    now = datetime.now(timezone.utc)
    cached_time = _tle_cache_time.get(sat_id)
    expired = (cached_time is None or
               (now - cached_time).total_seconds() > TLE_TTL_HOURS * 3600)
    if sat_id in _tle_cache and not expired:
        return _tle_cache[sat_id]
    url = SATELLITE_URLS[sat_id]
    filename = f"tle_{sat_id.lower()}.txt"
    # Force fresh download if expired
    if expired and os.path.exists(filename):
        os.remove(filename)
    try:
        sats = load.tle_file(url, filename=filename)
        _tle_cache[sat_id] = sats[0] if sats else None
        _tle_cache_time[sat_id] = now
    except Exception as e:
        print(f"[TLE] Error loading {sat_id}: {e}")
        _tle_cache[sat_id] = None
    return _tle_cache[sat_id]

def _compute_passes(sat_id: str, days: int, result: list):
    """Runs in a thread; appends result so caller can check timeout."""
    try:
        sat = get_satellite(sat_id)
        if not sat:
            result.append({"error": "No se pudo cargar el satélite"})
            return
        ahora = datetime.now(timezone.utc)
        t0 = ts.from_datetime(ahora)
        # Low-inclination sats pass rarely — search fewer days to avoid timeout
        search_days = min(days, 5) if sat_id in LOW_INCL_SATS else days
        t1 = ts.from_datetime(ahora + timedelta(days=search_days))
        # Lower min elevation for HST so we find more passes
        min_el = 5.0 if sat_id in LOW_INCL_SATS else 10.0
        tiempos, eventos = sat.find_events(SANTIAGO, t0, t1, altitude_degrees=min_el)
        passes = []
        pase = {}
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
                pase["set"]      = dt.isoformat()
                pase["set_az"]   = float(round(az.degrees, 1))
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
    if sat_id not in SATELLITE_URLS:
        return {"error": "Satélite no encontrado"}
    timeout_sec = 25 if sat_id in LOW_INCL_SATS else 20
    result = []
    t = threading.Thread(target=_compute_passes, args=(sat_id, days, result))
    t.start()
    t.join(timeout=timeout_sec)
    if not result:
        print(f"[PASSES] Timeout calculando pases de {sat_id}")
        # Invalidate cache so next request downloads fresh TLE
        _tle_cache.pop(sat_id, None)
        _tle_cache_time.pop(sat_id, None)
        return {"satellite": sat_id, "passes": [],
                "warning": f"Timeout calculando pases de {sat_id}. Intenta nuevamente."}
    return result[0]

def get_position(sat_id: str):
    if sat_id not in SATELLITE_URLS:
        return {"error": "Satélite no encontrado"}
    sat = get_satellite(sat_id)
    if not sat:
        return {"error": "No se pudo cargar"}
    t = ts.now()
    geocentric = sat.at(t)
    subpoint = wgs84.subpoint(geocentric)
    dif = (sat - SANTIAGO).at(t)
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
    for a in data.get("results", []):
        try:
            title_es   = translate(a["title"])
            summary_es = translate(a.get("summary", "")[:400])
            pub = datetime.fromisoformat(a["published_at"].replace("Z", "+00:00"))
            meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
            fecha = f"{pub.day} {meses[pub.month-1]} {pub.year} · {pub.strftime('%H:%M')}"
            articles.append({
                "title":         title_es,
                "title_en":      a["title"],
                "summary":       summary_es,
                "url":           a["url"],
                "image":         a.get("image_url", ""),
                "source":        a["news_site"],
                "published":     fecha,
                "published_raw": a["published_at"],
            })
        except Exception as e:
            print(f"[NEWS] Error: {e}")
            continue
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
