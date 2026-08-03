// ============================================================
// OSL Sat — all festival data lives here (edit freely, day-of)
// Times are minutes since midnight: 12:00 PM = 720, 9:55 PM = 1315
// ============================================================

const FEST_DATE = "2026-08-08"; // Saturday, Aug 8 2026

const STAGES = [
  { id: "landsend",  name: "Lands End",  loc: "Polo Field",        color: "#f97316" },
  { id: "twinpeaks", name: "Twin Peaks", loc: "Hellman Hollow",    color: "#a78bfa" },
  { id: "sutro",     name: "Sutro",      loc: "Lindley Meadow",    color: "#34d399" },
  { id: "panhandle", name: "Panhandle",  loc: "Marx Meadow",       color: "#f472b6" },
  { id: "soma",      name: "SOMA",       loc: "Dance tent (east)", color: "#38bdf8" },
];

const SETS = [
  // Lands End
  { id: "landsend-730",  stage: "landsend", start: 730,  end: 775,  artist: "Bandalos Chinos",  desc: "buzzy Argentine indie-pop/funk" },
  { id: "landsend-805",  stage: "landsend", start: 805,  end: 850,  artist: "Haute & Freddy",   desc: "emerging up-and-comer" },
  { id: "landsend-880",  stage: "landsend", start: 880,  end: 930,  artist: "Audrey Hobert",    desc: "rising pop songwriter (Gracie Abrams collaborator)" },
  { id: "landsend-960",  stage: "landsend", start: 960,  end: 1010, artist: "Lucy Dacus",       desc: "introspective indie, boygenius member" },
  { id: "landsend-1040", stage: "landsend", start: 1040, end: 1100, artist: "Ethel Cain",       desc: "gothic, cinematic Americana" },
  { id: "landsend-1130", stage: "landsend", start: 1130, end: 1190, artist: "Djo",              desc: "psych-pop of Joe Keery (“End of Beginning”)" },
  { id: "landsend-1235", stage: "landsend", start: 1235, end: 1315, artist: "The Strokes",      desc: "garage-rock revival icons", headliner: true },

  // Twin Peaks
  { id: "twinpeaks-750",  stage: "twinpeaks", start: 750,  end: 790,  artist: "Red Leather",   desc: "emerging early-slot act" },
  { id: "twinpeaks-835",  stage: "twinpeaks", start: 835,  end: 875,  artist: "After",         desc: "early-slot emerging act" },
  { id: "twinpeaks-910",  stage: "twinpeaks", start: 910,  end: 960,  artist: "Laszewo",       desc: "bright, harmony-driven indie-pop" },
  { id: "twinpeaks-1005", stage: "twinpeaks", start: 1005, end: 1065, artist: "Malcolm Todd",  desc: "young bedroom/indie-pop" },
  { id: "twinpeaks-1110", stage: "twinpeaks", start: 1110, end: 1160, artist: "Dijon",         desc: "raw, soulful indie/R&B" },
  { id: "twinpeaks-1210", stage: "twinpeaks", start: 1210, end: 1285, artist: "The xx",        desc: "hushed, minimalist indie-electronic", headliner: true },

  // Sutro
  { id: "sutro-755",  stage: "sutro", start: 755,  end: 800,  artist: "Rio Kosta",       desc: "DJ/producer warm-up" },
  { id: "sutro-830",  stage: "sutro", start: 830,  end: 875,  artist: "Wunderhorse",     desc: "gritty British indie/alt-rock" },
  { id: "sutro-905",  stage: "sutro", start: 905,  end: 950,  artist: "Sienna Spiro",    desc: "young British soul/pop belter" },
  { id: "sutro-980",  stage: "sutro", start: 980,  end: 1025, artist: "Yard Act",        desc: "witty British post-punk" },
  { id: "sutro-1055", stage: "sutro", start: 1055, end: 1100, artist: "Snow Strippers",  desc: "dark hyperpop/electronic duo" },
  { id: "sutro-1130", stage: "sutro", start: 1130, end: 1200, artist: "It's Murph",      desc: "DJ set" },
  { id: "sutro-1245", stage: "sutro", start: 1245, end: 1305, artist: "PinkPantheress",  desc: "UK garage/DnB-infused pop", headliner: true },

  // Panhandle
  { id: "panhandle-720",  stage: "panhandle", start: 720,  end: 750,  artist: "Ryman",                  desc: "early indie singer-songwriter" },
  { id: "panhandle-790",  stage: "panhandle", start: 790,  end: 830,  artist: "Racing Mount Pleasant",  desc: "lush Michigan indie collective" },
  { id: "panhandle-875",  stage: "panhandle", start: 875,  end: 905,  artist: "Ally Evenson",           desc: "emerging singer-songwriter" },
  { id: "panhandle-960",  stage: "panhandle", start: 960,  end: 1000, artist: "Automatic",              desc: "LA all-female post-punk/synth trio" },
  { id: "panhandle-1065", stage: "panhandle", start: 1065, end: 1105, artist: "Silvana Estrada",        desc: "acclaimed Mexican folk singer-songwriter" },
  { id: "panhandle-1160", stage: "panhandle", start: 1160, end: 1205, artist: "DJ Trixie Mattel",       desc: "campy Drag Race–winner DJ set" },

  // SOMA
  { id: "soma-755",  stage: "soma", start: 755,  end: 835,  artist: "Bad Juuju",        desc: "up-and-coming electronic/DJ" },
  { id: "soma-835",  stage: "soma", start: 835,  end: 925,  artist: "1-800 Girls",      desc: "electronic/DJ set" },
  { id: "soma-925",  stage: "soma", start: 925,  end: 1015, artist: "Camoufly",         desc: "electronic producer" },
  { id: "soma-1015", stage: "soma", start: 1015, end: 1105, artist: "Sultan + Shepard", desc: "progressive melodic house duo" },
  { id: "soma-1120", stage: "soma", start: 1120, end: 1210, artist: "Ben Böhmer",  desc: "cinematic melodic-house live set" },
  { id: "soma-1225", stage: "soma", start: 1225, end: 1315, artist: "Lane 8",           desc: "euphoric melodic/deep house", headliner: true },
];

// Walking times in minutes — rough estimates, crowd-dependent.
// Key = the two stage ids sorted alphabetically, joined with "|". Edit here.
const WALK_MIN = {
  "landsend|sutro": 10,
  "landsend|twinpeaks": 15,
  "landsend|panhandle": 20,
  "landsend|soma": 18,
  "sutro|twinpeaks": 8,
  "panhandle|sutro": 12,
  "soma|sutro": 12,
  "panhandle|twinpeaks": 7,
  "soma|twinpeaks": 8,
  "panhandle|soma": 6,
};

function walkTime(a, b) {
  return a === b ? 0 : WALK_MIN[[a, b].sort().join("|")];
}

const PARTY_STAGES = [
  { name: "Oasis @ Dolores'", note: "Drag and DJ/party sets through the afternoon and night — Darcy Drollinger, Kori King, Beverly Chills and Trixie Mattel's crew." },
  { name: "Duboce Triangle",  note: "Rainbow Girls (folk harmonies), Bootie Mashup and Electric Feels mashup/indie dance parties." },
  { name: "Cocktail Magic",   note: "Bingo Loco interactive music bingo plus rotating DJ/party sets." },
];

const VIP = {
  viewing: ["landsend", "twinpeaks"],
  perks: [
    "Elevated VIP viewing areas at Lands End and Twin Peaks — use them for headliners and packed sets",
    "Dedicated VIP entrance lanes — skip the main gate crush",
    "VIP lounges: private bars, real seating, shade, and premium restrooms",
  ],
};
