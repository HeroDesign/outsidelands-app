# Renders assets/transport-map.webp: OSM street map with numbered, color-coded pins
# for the Getting There view. Run: py -3 tools/make-transport-map.py
import math
import os
import time

import requests
from PIL import Image, ImageDraw, ImageFont
from staticmap import StaticMap

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_WEBP = os.path.join(HERE, "..", "assets", "transport-map.webp")
SCRATCH_PNG = os.path.join(
    os.environ.get("TEMP", HERE),
    "claude", "H--", "36cbbd20-3907-4502-a230-08ccfb8c4621", "scratchpad",
    "transport-map-full.png",
)

GROUP_COLORS = {
    "base": "#eab308",
    "gate": "#34d399",
    "arrival": "#38bdf8",
    "departure": "#f97316",
    "waypoint": "#a78bfa",
    "useful": "#9aa0ab",
}

# (n, group, lat, lng, nominatim query or None, label)
PLACES = [
    (1,  "base",      37.7993, -122.4585, "Lodge at the Presidio, San Francisco", "Lodge at the Presidio"),
    (2,  "gate",      37.7714, -122.4959, None, "VIP Entrance North (36th & JFK)"),
    (3,  "gate",      37.7657, -122.4945, None, "VIP Entrance South (MLK)"),
    # curbside on Balboa (geocoding lands on the school building centroid — keep street-level estimate)
    (4,  "arrival",   37.7766, -122.4900, None, "Rideshare drop-off (Balboa 30-31st)"),
    (5,  "arrival",   37.7775, -122.4899, None, "Secondary rideshare (30th Ave)"),
    (6,  "departure", 37.7804, -122.4957, None, "Uber/Lyft pickup (Geary & 36th)"),
    (7,  "departure", 37.7729, -122.4879, None, "Taxi stand (Fulton 28-29th)"),
    (8,  "departure", 37.7729, -122.4837, None, "Taxi stand alt (Fulton 24-25th)"),
    (9,  "waypoint",  37.7877, -122.4588, "Arguello Gate, Presidio, San Francisco", "Arguello Gate"),
    (10, "waypoint",  37.7859, -122.4725, None, "Lake St & Park Presidio"),
    (11, "useful",    37.7717, -122.4788, None, "Bay Wheels valet (JFK & Transverse)"),
]

ZOOM = 16
PAD = 90  # px padding around pin bbox


def haversine_m(a, b, c, d):
    r = 6371000
    p1, p2 = math.radians(a), math.radians(c)
    dp, dl = math.radians(c - a), math.radians(d - b)
    x = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(x))


def geocode_check():
    for i, (n, grp, lat, lng, query, label) in enumerate(PLACES):
        if not query:
            continue
        try:
            r = requests.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": query, "format": "json", "limit": 1},
                headers={"User-Agent": "OSL-Sat-planner/1.0 (alan@hero-design.com)"},
                timeout=15,
            )
            hits = r.json()
            if hits:
                glat, glng = float(hits[0]["lat"]), float(hits[0]["lon"])
                d = haversine_m(lat, lng, glat, glng)
                print(f"#{n} {label}: geocode {glat:.5f},{glng:.5f} vs est — {d:.0f} m apart")
                if d < 600:
                    PLACES[i] = (n, grp, glat, glng, query, label)
                else:
                    print(f"   >600 m — keeping estimate")
            else:
                print(f"#{n} {label}: no geocode hit, keeping estimate")
        except Exception as e:
            print(f"#{n} {label}: geocode failed ({e}), keeping estimate")
        time.sleep(1.1)


def merc(lat, lng, zoom):
    scale = 256 * (2 ** zoom)
    x = (lng + 180) / 360 * scale
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * scale
    return x, y


def main():
    geocode_check()

    xs, ys = zip(*[merc(p[2], p[3], ZOOM) for p in PLACES])
    w = int(max(xs) - min(xs)) + PAD * 2
    h = int(max(ys) - min(ys)) + PAD * 2
    cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
    # center back to lat/lng for staticmap
    scale = 256 * (2 ** ZOOM)
    clng = cx / scale * 360 - 180
    clat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * cy / scale))))
    print(f"canvas {w}x{h} @ z{ZOOM}, center {clat:.5f},{clng:.5f}")

    m = StaticMap(w, h, url_template="https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                  headers={"User-Agent": "OSL-Sat-planner/1.0 (alan@hero-design.com)"})
    img = m.render(zoom=ZOOM, center=[clng, clat]).convert("RGB")

    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 30)
    except OSError:
        font = ImageFont.load_default()
    R = 26
    for n, grp, lat, lng, _q, _label in PLACES:
        px, py = merc(lat, lng, ZOOM)
        x, y = px - cx + w / 2, py - cy + h / 2
        draw.ellipse([x - R, y - R, x + R, y + R], fill=GROUP_COLORS[grp],
                     outline="#0f1115", width=4)
        draw.text((x, y - 1), str(n), fill="#0f1115", font=font, anchor="mm")

    os.makedirs(os.path.dirname(SCRATCH_PNG), exist_ok=True)
    img.save(SCRATCH_PNG)
    out = img.copy()
    out.thumbnail((1800, 1800))
    out.save(OUT_WEBP, "WEBP", quality=74)
    print("png:", SCRATCH_PNG, img.size)
    print("webp KB:", os.path.getsize(OUT_WEBP) // 1024)


if __name__ == "__main__":
    main()
