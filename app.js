// ============================================================
// OSL Sat — app logic: router, renderers, picks, conflict engine, map
// ============================================================

const LS_KEY = "osl26-picks";
const USERS = { alan: "Alan", dani: "Dani" };
const STAGE_BY_ID = Object.fromEntries(STAGES.map(s => [s.id, s]));
const STAGE_ORDER = Object.fromEntries(STAGES.map((s, i) => [s.id, i]));

// Map centroids for the schematic SVG (viewBox 0 0 1000 460)
const MAP_POS = {
  landsend:  [185, 245],
  sutro:     [400, 260],
  twinpeaks: [565, 265],
  panhandle: [715, 150],
  soma:      [870, 255],
};

let picks = loadPicks();
let myDayView = "alan";
let mapSel = [];

// ---------- helpers ----------

function loadPicks() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY));
    if (raw && Array.isArray(raw.alan) && Array.isArray(raw.dani)) return raw;
  } catch (e) { /* private mode or corrupt — fall through */ }
  return { alan: [], dani: [] };
}

function savePicks() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(picks)); } catch (e) { /* private mode */ }
}

function fmt(min) {
  let h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + String(m).padStart(2, "0") + " " + ampm;
}

function nowOverride() {
  const p = new URLSearchParams(location.search).get("now");
  if (!p) return null;
  const parts = p.split(":").map(Number);
  return parts[0] * 60 + (parts[1] || 0);
}

function nowMinutes() {
  const o = nowOverride();
  if (o !== null) return o;
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function isFestDay() {
  if (nowOverride() !== null) return true;
  const d = new Date();
  const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  return iso === FEST_DATE;
}

function byStart(a, b) {
  return a.start - b.start || STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage];
}

function setById(id) { return SETS.find(s => s.id === id); }

// ---------- shared row ----------

function setRow(set, extra) {
  const stage = STAGE_BY_ID[set.stage];
  const hl = set.headliner ? '<span class="hl">HEADLINER</span>' : "";
  const aOn = picks.alan.includes(set.id) ? " on" : "";
  const dOn = picks.dani.includes(set.id) ? " on" : "";
  return (
    '<div class="row" data-set="' + set.id + '" data-start="' + set.start + '" data-end="' + set.end + '" style="--stage-c:' + stage.color + '">' +
      '<div class="t"><span class="start">' + fmt(set.start) + '</span><span class="end">– ' + fmt(set.end) + '</span></div>' +
      '<div class="mid">' +
        '<div class="artist">' + set.artist + hl +
          '<span class="badge-now">ON NOW</span><span class="badge-next">UP NEXT</span>' +
          (extra && extra.owner ? extra.owner : "") + '</div>' +
        '<div class="desc">' + set.desc + '</div>' +
        '<span class="stage-chip">' + stage.name + '</span>' +
        (extra && extra.notes ? extra.notes : "") +
      '</div>' +
      '<div class="picks">' +
        '<button class="pick a' + aOn + '" data-pick="alan:' + set.id + '" aria-label="Alan pick">A</button>' +
        '<button class="pick d' + dOn + '" data-pick="dani:' + set.id + '" aria-label="Dani pick">D</button>' +
      '</div>' +
    '</div>'
  );
}

// ---------- By Time ----------

function renderByTime() {
  const sorted = [...SETS].sort(byStart);
  let html = "";
  let lastHour = -1;
  for (const set of sorted) {
    const hour = Math.floor(set.start / 60);
    if (hour !== lastHour) {
      lastHour = hour;
      const label = (hour % 12 || 12) + " " + (hour >= 12 ? "PM" : "AM");
      html += '<div class="hour-sep">' + label + "</div>";
    }
    html += setRow(set);
  }
  document.getElementById("panel-time").innerHTML = html;
}

// ---------- By Stage ----------

function renderByStage() {
  let html = "";
  for (const stage of STAGES) {
    html +=
      '<div class="stage-head" style="--stage-c:' + stage.color + '">' +
        '<span class="nm">' + stage.name + '</span><span class="lc">' + stage.loc + "</span>" +
      "</div>";
    for (const set of SETS.filter(s => s.stage === stage.id).sort(byStart)) {
      html += setRow(set);
    }
  }
  html += '<div class="note-card"><h3>Party stages — no published set times</h3>';
  for (const p of PARTY_STAGES) {
    html += "<p><b>" + p.name + "</b> — " + p.note + "</p>";
  }
  html += "<p>Wander by between main-stage sets.</p></div>";
  document.getElementById("panel-stages").innerHTML = html;
}

// ---------- My Day ----------

function overlapMin(a, b) {
  return Math.min(a.end, b.end) - Math.max(a.start, b.start);
}

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

function personNotes(list, set) {
  let notes = "";
  for (const other of list) {
    if (other.id !== set.id && overlaps(set, other)) {
      notes +=
        '<span class="overlap-badge">⚠ OVERLAP — ' + other.artist + " (" +
        STAGE_BY_ID[other.stage].name + ") by " + overlapMin(set, other) + " min</span>";
    }
  }
  return notes;
}

function connector(prev, next) {
  const gap = next.start - prev.end;
  if (gap < 0) return ""; // overlap already badged on the rows
  if (prev.stage === next.stage) {
    return '<div class="connector">' + gap + " min break — same stage, hold your spot</div>";
  }
  const w = walkTime(prev.stage, next.stage);
  if (gap < w) {
    return '<div class="connector late">🏃 ' + gap + " min gap, ~" + w + " min walk — you'll arrive ~" + (w - gap) + " min late to " + next.artist + "</div>";
  }
  if (gap < w + 5) {
    return '<div class="connector tight">⏱ ' + gap + " min gap, ~" + w + " min walk — tight, head straight over</div>";
  }
  return '<div class="connector">' + gap + " min gap — ~" + w + " min walk, time for food / restroom / VIP lounge</div>";
}

function renderMyDay() {
  const el = document.getElementById("panel-mine");
  let html =
    '<div class="myday-top">' +
      '<div class="seg">' +
        '<button data-view="alan" class="alan' + (myDayView === "alan" ? " on" : "") + '">Alan</button>' +
        '<button data-view="dani" class="dani' + (myDayView === "dani" ? " on" : "") + '">Dani</button>' +
        '<button data-view="both"' + (myDayView === "both" ? ' class="on"' : "") + ">Both</button>" +
      "</div>" +
      '<button class="share-btn" id="share-picks">Share</button>' +
    "</div>";

  if (myDayView !== "both") {
    const list = picks[myDayView].map(setById).filter(Boolean).sort(byStart);
    if (!list.length) {
      html += '<div class="empty"><span class="big">' + (myDayView === "alan" ? "🟠" : "🩷") + "</span>" +
        "Tap <b>" + (myDayView === "alan" ? "A" : "D") + "</b> on any set to build " + USERS[myDayView] + "'s day.</div>";
    } else {
      for (let i = 0; i < list.length; i++) {
        html += setRow(list[i], { notes: personNotes(list, list[i]) });
        if (i < list.length - 1) html += connector(list[i], list[i + 1]);
      }
    }
  } else {
    const aSet = new Set(picks.alan);
    const dSet = new Set(picks.dani);
    const merged = SETS.filter(s => aSet.has(s.id) || dSet.has(s.id)).sort(byStart);
    if (!merged.length) {
      html += '<div class="empty"><span class="big">🧡🩷</span>Tap <b>A</b> or <b>D</b> on any set to build your day together.</div>';
    } else {
      const together = merged.filter(s => aSet.has(s.id) && dSet.has(s.id));
      for (const set of merged) {
        const isA = aSet.has(set.id), isD = dSet.has(set.id);
        let owner, notes = "";
        if (isA && isD) {
          owner = '<span class="owner-chip together">TOGETHER</span>';
        } else {
          owner = isA ? '<span class="owner-chip alan">ALAN</span>' : '<span class="owner-chip dani">DANI</span>';
          // split detection: the other person is at a different set at the same time
          const otherList = (isA ? picks.dani : picks.alan).map(setById).filter(Boolean);
          for (const other of otherList) {
            if (other.id !== set.id && overlaps(set, other)) {
              const apart = walkTime(set.stage, other.stage);
              const reunite = together.find(t => t.start >= Math.max(set.end, other.end));
              notes +=
                '<span class="split-note">💔 Split: ' + (isA ? "Alan" : "Dani") + " here, " +
                (isA ? "Dani" : "Alan") + " at " + other.artist + " (" + STAGE_BY_ID[other.stage].name + ") — ~" + apart + " min apart" +
                (reunite ? ". Reunite at " + reunite.artist + ", " + fmt(reunite.start) : "") + "</span>";
              break;
            }
          }
        }
        html += setRow(set, { owner: owner, notes: notes });
      }
    }
  }
  el.innerHTML = html;
  updateNowState();
}

// ---------- Map ----------

function stageShapeSVG(stage) {
  const [cx, cy] = MAP_POS[stage.id];
  const c = stage.color;
  let shape;
  if (stage.id === "landsend") {
    shape = '<ellipse class="shape" cx="' + cx + '" cy="' + cy + '" rx="115" ry="78" fill="' + c + '" fill-opacity="0.3" stroke="' + c + '" stroke-width="2.5"/>';
  } else if (stage.id === "soma") {
    // dance tent — hex tent shape
    shape = '<polygon class="shape" points="' +
      (cx - 48) + "," + (cy + 38) + " " + (cx - 55) + "," + (cy - 12) + " " + cx + "," + (cy - 48) + " " +
      (cx + 55) + "," + (cy - 12) + " " + (cx + 48) + "," + (cy + 38) +
      '" fill="' + c + '" fill-opacity="0.3" stroke="' + c + '" stroke-width="2.5"/>';
  } else {
    const rx = stage.id === "twinpeaks" ? 72 : 62;
    const ry = stage.id === "twinpeaks" ? 56 : 48;
    shape = '<ellipse class="shape" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + c + '" fill-opacity="0.3" stroke="' + c + '" stroke-width="2.5"/>';
  }
  return (
    '<g class="stage-shape" data-stage="' + stage.id + '" style="color:' + c + '">' +
      shape +
      '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="20" font-weight="800" fill="#e7e7ea">' + stage.name + "</text>" +
      '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="13" fill="#9aa0ab">' + stage.loc + "</text>" +
    "</g>"
  );
}

function vipSVG() {
  // gold viewing wedges at the front (east side) of Lands End and Twin Peaks
  const g = "#eab308";
  let s = "";
  const wedge = (id, dx) => {
    const [cx, cy] = MAP_POS[id];
    const x = cx + dx;
    return '<path d="M ' + x + " " + (cy - 34) + " A 40 40 0 0 1 " + x + " " + (cy + 34) +
      ' L ' + (x - 14) + " " + (cy + 22) + " A 26 26 0 0 0 " + (x - 14) + " " + (cy - 22) + ' Z" ' +
      'fill="url(#vipHatch)" stroke="' + g + '" stroke-width="1.5"/>';
  };
  s += wedge("landsend", 78);
  s += wedge("twinpeaks", 40);
  // VIP entrances (star markers) + lounges
  const entr = (x, y, label, anchor) =>
    '<g><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-size="17" fill="' + g + '">★</text>' +
    '<text x="' + (anchor === "start" ? x + 12 : x) + '" y="' + (y + 24) + '" text-anchor="' + (anchor || "middle") + '" font-size="11" font-weight="700" fill="' + g + '">' + label + "</text></g>";
  s += entr(150, 390, "VIP ENTRANCE");
  s += entr(640, 390, "VIP ENTRANCE");
  const lounge = (x, y) =>
    '<g><rect x="' + (x - 44) + '" y="' + (y - 13) + '" width="88" height="26" rx="13" fill="' + g + '" fill-opacity="0.15" stroke="' + g + '" stroke-width="1.2"/>' +
    '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + g + '">VIP LOUNGE</text></g>';
  s += lounge(185, 130);
  s += lounge(565, 350);
  return s;
}

function renderMap() {
  const el = document.getElementById("panel-map");
  let svg =
    '<svg viewBox="0 0 1000 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schematic festival map">' +
    "<defs>" +
      '<pattern id="vipHatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
        '<rect width="7" height="7" fill="#eab308" fill-opacity="0.12"/>' +
        '<line x1="0" y1="0" x2="0" y2="7" stroke="#eab308" stroke-width="2" stroke-opacity="0.6"/>' +
      "</pattern>" +
    "</defs>" +
    // park
    '<rect x="15" y="45" width="970" height="390" rx="26" fill="#16211a" stroke="#2c313b" stroke-width="1.5"/>' +
    '<text x="30" y="32" font-size="14" fill="#9aa0ab">Golden Gate Park — schematic, not to scale · West ← → East</text>' +
    // drives
    '<path d="M 25 90 C 250 70, 700 100, 975 80" fill="none" stroke="#3a4150" stroke-width="5" stroke-linecap="round"/>' +
    '<text x="500" y="72" text-anchor="middle" font-size="11" fill="#727a88">JFK Drive</text>' +
    '<path d="M 25 415 C 300 400, 720 425, 975 405" fill="none" stroke="#3a4150" stroke-width="5" stroke-linecap="round"/>' +
    '<text x="380" y="443" text-anchor="middle" font-size="11" fill="#727a88">MLK Jr Drive</text>' +
    '<path d="M 483 88 L 470 412" fill="none" stroke="#3a4150" stroke-width="4" stroke-linecap="round"/>' +
    '<text x="497" y="405" font-size="11" fill="#727a88">Transverse Dr</text>' +
    // tree texture
    '<g fill="#1f2f24">' +
      '<circle cx="310" cy="120" r="14"/><circle cx="330" cy="132" r="10"/>' +
      '<circle cx="760" cy="330" r="14"/><circle cx="782" cy="318" r="10"/>' +
      '<circle cx="930" cy="120" r="12"/><circle cx="70" cy="350" r="12"/>' +
    "</g>" +
    vipSVG() +
    STAGES.map(stageShapeSVG).join("") +
    '<line id="walk-line" x1="0" y1="0" x2="0" y2="0" stroke="#e7e7ea" stroke-width="3" stroke-dasharray="8 7" stroke-linecap="round" opacity="0"/>' +
    "</svg>";

  let legend = '<div class="legend">';
  for (const s of STAGES) {
    legend += '<span><span class="dot" style="background:' + s.color + '"></span>' + s.name + "</span>";
  }
  legend += '<span><span class="dot" style="background:#eab308"></span>VIP areas</span></div>';

  let matrix = '<details class="matrix"><summary>Full walk-time table (min)</summary><table><tr><th></th>';
  for (const s of STAGES) matrix += "<th>" + s.name.split(" ")[0] + "</th>";
  matrix += "</tr>";
  for (const a of STAGES) {
    matrix += '<tr><th class="rowh">' + a.name + "</th>";
    for (const b of STAGES) {
      matrix += "<td>" + (a.id === b.id ? "—" : "~" + walkTime(a.id, b.id)) + "</td>";
    }
    matrix += "</tr>";
  }
  matrix += "</table></details>";

  let vip = '<div class="vip-card"><h3>★ Your VIP perks</h3><ul>';
  for (const p of VIP.perks) vip += "<li>" + p + "</li>";
  vip += "</ul></div>";

  el.innerHTML =
    '<div class="map-wrap">' + svg + "</div>" +
    legend +
    '<div class="walk-result" id="walk-result"><span class="hint">Tap two stages on the map to see the walk time.</span></div>' +
    matrix +
    vip +
    '<div class="disclaimer">All walk times are rough estimates — crowds slow everything down, especially around headliner changeovers.</div>';
}

function updateMapSelection() {
  const svgGroups = document.querySelectorAll("#panel-map g.stage-shape");
  svgGroups.forEach(g => g.classList.toggle("sel", mapSel.includes(g.dataset.stage)));
  const line = document.getElementById("walk-line");
  const result = document.getElementById("walk-result");
  if (mapSel.length === 2) {
    const [a, b] = mapSel;
    line.setAttribute("x1", MAP_POS[a][0]); line.setAttribute("y1", MAP_POS[a][1]);
    line.setAttribute("x2", MAP_POS[b][0]); line.setAttribute("y2", MAP_POS[b][1]);
    line.setAttribute("opacity", "0.85");
    result.innerHTML =
      "<span>" + STAGE_BY_ID[a].name + " ↔ " + STAGE_BY_ID[b].name + ": <b class=\"min\">~" + walkTime(a, b) +
      " min walk</b> <span class=\"hint\">(estimate — crowds slow this down)</span></span>";
  } else {
    line.setAttribute("opacity", "0");
    result.innerHTML = mapSel.length === 1
      ? '<span class="hint">' + STAGE_BY_ID[mapSel[0]].name + " selected — tap another stage.</span>"
      : '<span class="hint">Tap two stages on the map to see the walk time.</span>';
  }
}

// ---------- now / next ----------

function updateNowState() {
  const live = isFestDay();
  const now = nowMinutes();
  document.querySelectorAll(".row[data-start]").forEach(row => {
    const start = +row.dataset.start, end = +row.dataset.end;
    row.classList.toggle("past", live && end <= now);
    row.classList.toggle("on-now", live && start <= now && now < end);
    row.classList.remove("up-next");
  });
  if (live) {
    const future = [...SETS].filter(s => s.start > now);
    if (future.length) {
      const nextStart = Math.min(...future.map(s => s.start));
      document.querySelectorAll("#panel-time .row[data-start='" + nextStart + "']")
        .forEach(r => r.classList.add("up-next"));
    }
  }
}

// ---------- share / import ----------

function sharePicks() {
  const payload = btoa(JSON.stringify(picks));
  const url = location.origin + location.pathname + "#import=" + payload;
  const done = () => alert("Link copied — send it to the other phone and open it there.");
  if (navigator.share) {
    navigator.share({ title: "OSL Saturday picks", url: url }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done, () => prompt("Copy this link:", url));
  } else {
    prompt("Copy this link:", url);
  }
}

function checkImport() {
  const m = location.hash.match(/^#import=(.+)$/);
  if (!m) return;
  history.replaceState(null, "", location.pathname + location.search + "#mine");
  let incoming;
  try {
    incoming = JSON.parse(atob(m[1]));
    if (!incoming || !Array.isArray(incoming.alan) || !Array.isArray(incoming.dani)) throw 0;
  } catch (e) {
    alert("That share link couldn't be read.");
    return;
  }
  if (confirm("Import picks from this link? They'll be merged with what's already on this phone.")) {
    picks.alan = [...new Set([...picks.alan, ...incoming.alan])];
    picks.dani = [...new Set([...picks.dani, ...incoming.dani])];
    savePicks();
    renderAll();
  }
}

// ---------- router ----------

const TABS = ["time", "stages", "mine", "map"];

function route() {
  let tab = location.hash.replace("#", "");
  if (!TABS.includes(tab)) tab = "time";
  TABS.forEach(t => {
    document.getElementById("panel-" + t).classList.toggle("active", t === tab);
  });
  document.querySelectorAll("nav.tabbar a").forEach(a => {
    a.classList.toggle("active", a.dataset.tab === tab);
  });
}

// ---------- events ----------

document.addEventListener("click", e => {
  const pickBtn = e.target.closest("[data-pick]");
  if (pickBtn) {
    const [user, setId] = pickBtn.dataset.pick.split(":");
    const arr = picks[user];
    const i = arr.indexOf(setId);
    if (i >= 0) arr.splice(i, 1); else arr.push(setId);
    savePicks();
    // sync every chip for this user+set across tabs
    document.querySelectorAll("[data-pick='" + user + ":" + setId + "']")
      .forEach(b => b.classList.toggle("on", i < 0));
    if (document.getElementById("panel-mine").classList.contains("active")) renderMyDay();
    return;
  }
  const segBtn = e.target.closest("[data-view]");
  if (segBtn) {
    myDayView = segBtn.dataset.view;
    renderMyDay();
    return;
  }
  if (e.target.closest("#share-picks")) {
    sharePicks();
    return;
  }
  const stageG = e.target.closest("g.stage-shape");
  if (stageG) {
    const id = stageG.dataset.stage;
    if (mapSel.includes(id)) mapSel = mapSel.filter(x => x !== id);
    else if (mapSel.length >= 2) mapSel = [id];
    else mapSel.push(id);
    updateMapSelection();
  }
});

window.addEventListener("hashchange", () => {
  if (location.hash.startsWith("#import=")) { checkImport(); return; }
  route();
  if (location.hash === "#mine") renderMyDay();
});

// ---------- boot ----------

function renderAll() {
  renderByTime();
  renderByStage();
  renderMyDay();
  renderMap();
  updateNowState();
}

renderAll();
checkImport();
route();

// auto-scroll to what's happening now (festival day, By Time tab)
if (isFestDay() && (location.hash === "" || location.hash === "#time")) {
  const target = document.querySelector("#panel-time .row.on-now, #panel-time .row.up-next");
  if (target) setTimeout(() => target.scrollIntoView({ block: "center" }), 50);
}

setInterval(updateNowState, 60 * 1000);
