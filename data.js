// ============================================================
// OSL Sat — all festival data lives here (edit freely, day-of)
// Times are minutes since midnight: 12:00 PM = 720, 9:55 PM = 1315
// ============================================================

const FEST_DATE = "2026-08-08"; // Saturday, Aug 8 2026
const APP_VERSION = "v9"; // keep in sync with VERSION in sw.js — shown in the header

const STAGES = [
  { id: "landsend",  name: "Lands End",  loc: "Polo Field (west end)",    color: "#f97316" },
  { id: "twinpeaks", name: "Twin Peaks", loc: "Hellman Hollow (east)",    color: "#a78bfa" },
  { id: "sutro",     name: "Sutro",      loc: "Lindley Meadow",           color: "#34d399" },
  { id: "panhandle", name: "Panhandle",  loc: "Hellman Hollow (west)",    color: "#f472b6" },
  { id: "soma",      name: "SOMA",       loc: "Marx Meadow",              color: "#38bdf8" },
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
  { id: "sutro-755",  stage: "sutro", start: 755,  end: 800,  artist: "Rio Kosta",       desc: "hazy LA psych/funk duo" },
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

// Walking times in minutes — estimates scaled from the official 2026 patron map,
// crowd-dependent. Key = the two stage ids sorted alphabetically, joined with "|".
const WALK_MIN = {
  "landsend|sutro": 8,
  "landsend|twinpeaks": 20,
  "landsend|panhandle": 15,
  "landsend|soma": 18,
  "sutro|twinpeaks": 15,
  "panhandle|sutro": 12,
  "soma|sutro": 13,
  "panhandle|twinpeaks": 5,
  "soma|twinpeaks": 6,
  "panhandle|soma": 5,
};

function walkTime(a, b) {
  return a === b ? 0 : WALK_MIN[[a, b].sort().join("|")];
}

const PARTY_STAGES = [
  { name: "Oasis @ Dolores'", where: "Polo Field", note: "Drag and DJ/party sets through the afternoon and night — Darcy Drollinger, Kori King, Beverly Chills and Trixie Mattel's crew." },
  { name: "Duboce Triangle",  where: "McLaren Pass", note: "Rainbow Girls (folk harmonies), Bootie Mashup and Electric Feels mashup/indie dance parties." },
  { name: "Cocktail Magic",   where: "Lindley Meadow", note: "Bingo Loco interactive music bingo plus rotating DJ/party sets." },
];

// Longer artist bios (researched Aug 2026) — shown when a set row is tapped.
const BIOS = {
  "landsend-730": "Six-piece indie-pop band from Béccar, Argentina, who fold funk, disco, and synth-pop into irresistibly danceable Spanish-language hooks, fronted by the magnetic Goyo Degano. They broke out with 2018's BACH and turned rawer and rockier on 2025's Grammy-nominated Vándalos, whose world tour brings them here. Their sets are essentially a bilingual dance party — you don't need to speak Spanish to move to them.",
  "landsend-805": "LA duo of vocalist Michelle Buzz and drummer Lance Shipp, former behind-the-scenes pop songwriters (credits with Katy Perry, Britney Spears, Calvin Harris camps) who stepped out front with a theatrical blend of '80s synth-pop and vintage circus imagery. They broke through with 2024's 'Scantily Clad' and released their debut album Big Disgrace in 2026. The live show leans hard into carnival theatrics — costumes, drums, and camp — more spectacle than typical festival pop set.",
  "landsend-880": "Sharp, funny confessional pop from Gracie Abrams's childhood best friend, who co-wrote Abrams hits like 'That's So True' and 'I Love You, I'm Sorry' before debuting with 2025's Who's the Clown? and its single 'Sue Me.' Her songs are diaristic and self-deprecating, delivered with a talky, wry charm that plays like stand-up set to synth-pop. A good bet if you want a rising songwriter at the small-stage stage of her career.",
  "landsend-960": "Richmond, Virginia songwriter with a warm alto and novelistic lyrics about memory, faith, and love — one-third of boygenius alongside Phoebe Bridgers and Julien Baker. Best known for the slow-burn breakup epic 'Night Shift' and albums Historian, Home Video, and 2025's lush, romantic Forever Is a Feeling. Live she's understated and conversational, and the whole-crowd scream-along at the end of 'Night Shift' is reliably the emotional peak.",
  "landsend-1040": "The Southern-gothic project of Florida-raised Hayden Anhedönia, who writes cinematic, slow-burning Americana about religion, violence, and doomed love. Her 2022 concept album Preacher's Daughter (home of 'American Teenager') made her a cult figure, and 2025's Willoughby Tucker, I'll Always Love You continued the saga. Expect a hymn-like, deliberately paced set with long crescendos and one of the most devoted fanbases at the festival — transfixing if you surrender to it, slow if you don't.",
  "landsend-1130": "The psych-pop alias of Stranger Things actor Joe Keery, whose wistful 'End of Beginning' became a global viral smash in 2024. His 2025 album The Crux traded synth-heavy sounds for warm '70s-flavored guitar pop, and he's closing his summer tour with this set. Live it's a real full-band rock show — talkbox solos, Beatles-esque harmonies, and a massive singalong when 'End of Beginning' drops — no celebrity-vanity-project asterisk needed.",
  "landsend-1235": "The New York band that kick-started the 2000s garage-rock revival with Is This It and hits like 'Last Nite,' 'Reptilia,' and 'Someday,' fronted by leather-jacketed mumbler-in-chief Julian Casablancas. They're touring behind Reality Awaits, their first album since 2020's Grammy-winning The New Abnormal, produced by Rick Rubin. Their live shows are famously loose — rambling banter, occasional sloppiness — but the catalog is wall-to-wall anthems and the highs are euphoric.",
  "twinpeaks-750": "An anonymous Reno-born singer-songwriter who never shows his face and mixes alt-rock, country, and folk into gravelly, angst-ridden anthems about addiction and recovery — he went from busking Hollywood Boulevard to millions of TikTok followers. His albums Reno (2023) and Tahoe (2026) chronicle getting sober after surviving a suicide attempt and overdose. Expect a raw, cathartic set that hits harder emotionally than technically.",
  "twinpeaks-835": "LA duo Justine Dorsey and Graham Epstein — who met on Hinge and turned out to share the exact same birthdate — making moody Y2K-inspired pop pitched as 'Massive Attack meets Michelle Branch': trip-hop beats under breezy early-2000s melodies. They have two EPs out on Mom + Pop, with standouts like 'Deep Diving' and 'Cold.' Still an early-days act, so expect an intimate, atmospheric small-stage set.",
  "twinpeaks-910": "Santa Barbara-formed trio (stylized Łaszewo) of producers Matt Ehrlich and Justin De La Fuente with singer Keeva Bouley, blending sunny indie-pop songwriting with dance-music energy. They went viral with 'Up In Flames' and 'Til U Hate Me' and released debut album In Color in 2024. Their live sets sit between a band show and a DJ set — bright, bouncy, and built for daytime festival dancing.",
  "twinpeaks-1005": "Early-twenties LA singer who came up self-releasing funky, guitar-driven bedroom pop and broke big with the viral hit 'Chest Pain (I Love)' from his 2025 self-titled album. His 2026 follow-up Do That Again charted top 5 on Apple Music, and he's headlining Radio City and the Greek this fall — so this is a catch-him-while-he's-mid-ascent set. Live he's scrappy and high-energy with a young, loud crowd.",
  "twinpeaks-1110": "Baltimore-raised, LA-based singer making raw, deconstructed R&B and soul — cracked vocals, live-in-the-room production, sudden bursts of noise inside pretty songs. His 2021 cult classic Absolutely ('Many Times') and 2025's Baby, written amid marriage and new fatherhood, are two of the most acclaimed indie-R&B records of the decade. Onstage with a seven-piece band he tears songs apart and rebuilds them — chaotic, ecstatic, and widely considered one of the best live acts going.",
  "twinpeaks-1210": "London trio — Romy Madley Croft, Oliver Sim, and producer Jamie xx — whose hushed, minimalist mix of intertwined boy-girl vocals, spare guitar and bass, and skeletal electronics defined a whole strain of late-2000s indie. Their Mercury Prize-winning 2009 debut xx ('Intro,' 'Crystalised') and later hit 'On Hold' remain the touchstones, and 2026 marks their first shows since 2018. Live it's intimate rather than bombastic — gorgeous lighting, whisper-quiet moments, and Jamie xx's beats giving it a late-night pulse — the moody counterweight to the Strokes' headline slot.",
  "sutro-755": "Not a DJ act despite early billing — Rio Kosta is an LA duo of studio-rat producers Mike Del Rio and Kosta Galanopoulos, who met working on singer LP's album Churches and make hazy '70s psychedelia, instrumental funk, and soulful harmonies in the Khruangbin vein. They emerged in late 2022 with the double A-side 'Ancients' / 'Volar Lejos (Like a Feather)', and the live show is their real ballpark: hypnotic, groove-locked jams that suit a sun-drunk afternoon slot.",
  "sutro-830": "British four-piece built around Jacob Slater, ex-frontman of Dead Pretties who also played Sid Vicious in Danny Boyle's Pistol before retreating to Cornwall to surf and write the raw, Americana-tinged 2022 debut Cub. The 2024 follow-up Midas was cut live-to-tape with the mistakes left in, chasing a Nirvana-adjacent grunge-folk sound, and it pushed them to arena support slots with Sam Fender. On stage they're genuinely visceral — Slater sings like he's tearing something loose, and the band thrashes accordingly.",
  "sutro-905": "London-born singer (b. 2005) with a huge, raspy old-soul voice who blew up when her cover of 'Read All About It' went viral on TikTok in 2022. Her single 'Die on This Hill' cracked the UK top 10 and her debut album Visitor just dropped in July 2026, mixing soul, jazz, and piano-driven pop. Expect an emotive, belt-heavy set — she's the raw-vocal-talent pick of the day.",
  "sutro-980": "Leeds post-punk crew fronted by James Smith, whose deadpan, talk-sung character studies made the Mercury-nominated 2022 debut The Overload a word-of-mouth hit; 2024's Where's My Utopia? folded in disco grooves, and their third album You're Gonna Need A Little Music landed in July 2026 with the menacing single 'Redeemer.' Live, Smith is a proper frontman — quick-witted crowd banter, half stand-up and half sermon, over a band that grooves harder than post-punk usually allows.",
  "sutro-1055": "Detroit-formed duo — singer Tatiana Schwaninger and producer Graham Perez, who met on Tinder — making trashy, nocturnal electro-pop that mashes witch house, electroclash, trance, and hyperpop into an indie-sleaze revival. Their 2023 track 'Under Your Spell' became a social-media sensation after a run of self-released albums and April Mixtape tapes. The live show is a strobe-lit, lo-fi rave: Tati's ghostly vocals over pounding, distorted club beats.",
  "sutro-1130": "Alias of Garrett Murphy, a Nashville-raised producer who fell for electronic music at a Porter Robinson show, moved to LA for USC, and went viral in 2023 with his debut single 'Food For The Soul' (4 million streams in a month). His DJ sets blend house, tech house, and heavy bass in the Fred again.. / Chris Lake lane, and he's already played Coachella, Beyond Wonderland, and Splash House — expect a euphoric, groove-forward party set.",
  "sutro-1245": "The UK's reigning bedroom-pop-meets-club auteur, splicing 2-step garage, drum & bass, and Y2K samples into sugary two-minute pop songs — best known for 'Boy's a liar Pt. 2' with Ice Spice, 'Pain,' and 2025 mixtape Fancy That with its standout hit 'Illegal.' She started as an anonymous TikTok phenomenon in 2021 and now headlines her own world tour. Live she's charming and light on her feet, with a DJ/band setup that turns the breakbeats into an actual dance party.",
  "panhandle-720": "Nashville-born singer-songwriter from a musical family who signed his first record deal before finishing high school and calls his sound 'Barn Pop' or 'Y'allternative' — indie folk, alt-country, and indie pop with heart-on-sleeve storytelling. His debut album Growing Pains chronicles early-adulthood upheaval, and he's toured with Role Model and Ben Kweller. He has the noon-opening slot Saturday; a low-key, earnest way to start the day.",
  "panhandle-790": "Seven-piece collective from Ann Arbor, Michigan — formed at a University of Michigan freshman orientation, formerly called Kingfisher — stacking saxophones, trumpet, strings, and multiple voices into sprawling, emotional indie rock frequently compared to Black Country, New Road and Arcade Fire. Their self-titled 2025 album, a concept record about memory and distance, made them one of the year's breakout critical darlings. Live, the seven of them build slow-burn songs into huge brass-and-strings crescendos; a strong bet if you like catharsis with your indie.",
  "panhandle-875": "Detroit-scene indie singer-songwriter raised in Port Huron, Michigan, writing confessional alt-pop/indie rock about loss, relationships, and self-esteem — heard on releases like 'Blue Super Love' and the EP Not So Pretty. She's an emerging act rather than a household name; expect an intimate, feelings-forward set of sharp, honest songwriting.",
  "panhandle-960": "All-female LA trio — Izzy Glaudini (synths), Halle Saxon (bass), and drummer Lola Dompé, daughter of Bauhaus's Kevin Haskins — who ditched guitars entirely for icy synths, driving basslines, and motorik drums, landing somewhere between Kraftwerk, Devo, and disco-punk. Signed to Stones Throw, they've released Signal (2019), Excess (2022), and 2025's Is It Now?. Live they're cool, hypnotic, and locked-in — deadpan vocals over grooves that sneak up on you until the whole crowd is moving.",
  "panhandle-1065": "Veracruz-born Mexican singer-songwriter, raised by luthier parents, who won the 2022 Latin Grammy for Best New Artist and accompanies her astonishing, hushed-to-soaring voice mainly on the small Venezuelan cuatro. Her 2022 debut Marchita and self-produced 2025 follow-up Vendrán Suaves Lluvias (with the Latin Grammy-nominated 'Como Un Pájaro') mix Mexican folk traditions with jazz and chamber-pop intimacy. Her shows are pin-drop spellbinding — the rare festival set that silences a field.",
  "panhandle-1160": "Winner of RuPaul's Drag Race All Stars 3 and a legitimately accomplished musician — her folk-country albums like One Stone topped Billboard's Heatseekers chart — Trixie has lately reinvented herself as a touring club DJ. This is not an acoustic set: expect a campy, high-energy party of pop and dance remixes delivered in full drag with comedian-grade crowd work. Pure fun, zero pretension.",
  "soma-755": "San Francisco's own: a local DJ (and Vitamin1000 collective resident) who came up through SF warehouse raves and clubs like Public Works and 1015 Folsom, and is one half of the project CYBER1A. Her sets skew darker and harder than the rest of this stage, weaving techno, bass, breaks, and trance into a hypnotic, percussive blend. Expect an underground-rave feel rather than hands-in-the-air melodies — a strong pick if you want grit before the headliners.",
  "soma-835": "Alias of UK producer Jake Stewart, who filters old-school British rave nostalgia into a woozy, emotional blend of house, UK garage, and breaks, with releases on respected underground labels like Shall Not Fade and Lost Palms and steady BBC 6 Music support. His sets are warm and scrappy in the best way — skippy garage drums, chopped-up vocal hooks, and sudden bursts of euphoria that feel more sweaty basement party than big-stage EDM.",
  "soma-925": "An anonymous Italian producer who performs in a crochet mask and signed to Ninja Tune's Technicolour imprint, known for 'Kaleidoscope (Me&U)', the 2023 EP In Plain Sight, and 2025 debut album New Skin. His sound is shape-shifting, sample-heavy bass music that jumps between future bass, dubstep, and hyper-melodic club sounds without warning. The set is high-energy and playful — the wildcard of this lineup, better for jumping around than swaying.",
  "soma-1015": "Grammy-nominated Montreal duo (Ossama 'Sultan' Al Sarraf and Ned Shepard) who spent years in big-room EDM and pop production — including a Grammy-nominated remix of Bruno Mars' 'Locked Out of Heaven' — before reinventing themselves as a melodic/progressive house act on Lane 8's This Never Happened label, with acclaimed albums Something, Everything (2021) and Forever, Now (2023). Their DJ sets are polished, driving, and emotive — shimmering synths and steady progressive builds that pair naturally with Lane 8 and Ben Böhmer, ideal for settling in at this stage for the evening.",
  "soma-1120": "Berlin producer on Anjunadeep (now Ninja Tune) famous for lush, cinematic melodic house — albums Breathing (2019), Begin Again (2021), and Bloom (2024), plus the Cercle set performed in a hot-air balloon over Cappadocia that became one of the most-watched electronic sets on YouTube. He performs a true live set, playing synths and hardware on stage rather than DJing, rebuilding tracks like 'Cappadocia' and 'Beyond Beliefs' in real time. Expect sweeping, goosebump-chasing melodies over club drums — emotional and immersive, especially as the sun goes down.",
  "soma-1225": "Daniel Goldstein, an Anjunadeep alum and one of the most beloved names in American deep/melodic house, who runs the This Never Happened label (home to Sultan + Shepard) famous for its phone-free shows. His albums — including Little by Little and Brightest Lights — trade drops for long, patient, melody-driven builds, with fan favorites like 'Brightest Lights' and 'Sunday Song.' His DJ sets are smooth, euphoric journeys that reward staying for the whole arc; the natural headliner-energy closer for fans of feel-good, emotional dance music.",
};
SETS.forEach(s => { if (BIOS[s.id]) s.bio = BIOS[s.id]; });

// Verified Spotify artist pages (Bad Juuju has none — the app falls back to a search link)
const SPOTIFY = {
  "landsend-730":  "https://open.spotify.com/artist/0wn2qDKzeFlhjRUtJAwJjp",
  "landsend-805":  "https://open.spotify.com/artist/66T34XqGkEWbzKWALSBDuR",
  "landsend-880":  "https://open.spotify.com/artist/4N0TAwz9vhnQtjCqS65aKS",
  "landsend-960":  "https://open.spotify.com/artist/07D1Bjaof0NFlU32KXiqUP",
  "landsend-1040": "https://open.spotify.com/artist/0avMDS4HyoCEP6RqZJWpY2",
  "landsend-1130": "https://open.spotify.com/artist/5p9HO3XC5P3BLxJs5Mtrhm",
  "landsend-1235": "https://open.spotify.com/artist/0epOFNiUfyON9EYx7Tpr6V",
  "twinpeaks-750":  "https://open.spotify.com/artist/2qltFRTCjw1j67Da9FR8F1",
  "twinpeaks-835":  "https://open.spotify.com/artist/7KfMR05zRrWyhQimnYa8li",
  "twinpeaks-910":  "https://open.spotify.com/artist/6jxGLrn1I14RIeRYodOpLN",
  "twinpeaks-1005": "https://open.spotify.com/artist/7eKkW1zo5uzW8kUntiiBvz",
  "twinpeaks-1110": "https://open.spotify.com/artist/0knGpCTbmG4ctl1wzYRZs4",
  "twinpeaks-1210": "https://open.spotify.com/artist/3iOvXCl6edW5Um0fXEBRXy",
  "sutro-755":  "https://open.spotify.com/artist/4xU7M9wEvpnvkNOyPdVi5y",
  "sutro-830":  "https://open.spotify.com/artist/41pd7r1XBRsvdxY3vHEgib",
  "sutro-905":  "https://open.spotify.com/artist/02gSuSAWEdWa5UOvqzjX6v",
  "sutro-980":  "https://open.spotify.com/artist/2h3ooJn8m8X8cL2g1BZ1Rd",
  "sutro-1055": "https://open.spotify.com/artist/6TsAG8Ve1icEC8ydeHm3C8",
  "sutro-1130": "https://open.spotify.com/artist/3zW0xazqnHoq9QV9zBROVC",
  "sutro-1245": "https://open.spotify.com/artist/78rUTD7y6Cy67W1RVzYs7t",
  "panhandle-720":  "https://open.spotify.com/artist/1ZUNE7b5nNiN31AnJ0Smqj",
  "panhandle-790":  "https://open.spotify.com/artist/5zaSiNpGxS2lOvZTIZiOQX",
  "panhandle-875":  "https://open.spotify.com/artist/6UzwpF9cqjxgxXb2N6mb7y",
  "panhandle-960":  "https://open.spotify.com/artist/3uX1tstdmFJyxW9b5mSNlU",
  "panhandle-1065": "https://open.spotify.com/artist/72VywtXEoONiBLNu3ibGI7",
  "panhandle-1160": "https://open.spotify.com/artist/33hAj1SghVYxDAxZxNDcyc",
  "soma-835":  "https://open.spotify.com/artist/67yGrC4QoCSD0g7YMcGIgJ",
  "soma-925":  "https://open.spotify.com/artist/6ZmJg6NCjGmRgC2GEI86pQ",
  "soma-1015": "https://open.spotify.com/artist/14Tg9FvbNismPR1PJHxRau",
  "soma-1120": "https://open.spotify.com/artist/5tDjiBYUsTqzd0RkTZxK7u",
  "soma-1225": "https://open.spotify.com/artist/27gtK7m9vYwCyJ04zz0kIb",
};
SETS.forEach(s => { if (SPOTIFY[s.id]) s.spotify = SPOTIFY[s.id]; });

// Getting There — transport & lodging. Pin numbers/colors match assets/transport-map.webp
// (regenerate with tools/make-transport-map.py if these change).
const PLACE_GROUPS = [
  { name: "Base",      color: "#eab308" },
  { name: "Your gate", color: "#34d399" },
  { name: "Arrival",   color: "#38bdf8" },
  { name: "Departure", color: "#f97316" },
  { name: "Route waypoints for the drive home", color: "#a78bfa" },
  { name: "Useful",    color: "#9aa0ab" },
];

const PLACES = [
  { n: 1,  group: "Base",      name: "The Lodge at the Presidio",            detail: "105 Montgomery St — home base",                                        lat: 37.80184, lng: -122.45824 },
  { n: 2,  group: "Your gate", name: "VIP Entrance (North)",                 detail: "36th Ave & JFK Drive — your main way in",                              lat: 37.7714,  lng: -122.4959 },
  { n: 3,  group: "Your gate", name: "VIP Entrance (South, shuttle riders)", detail: "MLK Jr Drive, west of South Gate — backup only",                       lat: 37.7657,  lng: -122.4945 },
  { n: 4,  group: "Arrival",   name: "Official rideshare drop-off",          detail: "Balboa St between 30th & 31st Ave (alongside Washington High School)", lat: 37.7766,  lng: -122.4900 },
  { n: 5,  group: "Arrival",   name: "Secondary rideshare zone",             detail: "30th Ave between Balboa & Anza",                                       lat: 37.7775,  lng: -122.4899 },
  { n: 6,  group: "Departure", name: "Geary Blvd & 36th Ave",                detail: "Primary Uber/Lyft pickup — ~15 min walk north from the gate",          lat: 37.7804,  lng: -122.4957 },
  { n: 7,  group: "Departure", name: "Taxi stand",                           detail: "Fulton St between 28th & 29th — metered, no surge, open until 2am Monday", lat: 37.7729, lng: -122.4879 },
  { n: 8,  group: "Departure", name: "Taxi stand (alt)",                     detail: "Fulton St between 24th & 25th Ave",                                    lat: 37.7729,  lng: -122.4837 },
  { n: 9,  group: "Route waypoints for the drive home", name: "Arguello Gate", detail: "Arguello Blvd & Lake St — the Presidio entrance you'll come through", lat: 37.7877, lng: -122.4588 },
  { n: 10, group: "Route waypoints for the drive home", name: "Lake St & Park Presidio Blvd", detail: "The turn — also a quieter pickup spot if Geary is chaotic", lat: 37.7859, lng: -122.4725 },
  { n: 11, group: "Useful",    name: "Bay Wheels valet station",             detail: "JFK Drive just east of Transverse Dr — near the east gate, ~1 mile from yours", lat: 37.7717, lng: -122.4788 },
];

const VIP = {
  viewing: ["landsend", "sutro", "twinpeaks"],
  perks: [
    "VIP viewing areas at Sutro and Twin Peaks, plus the VIP Courtyard at Polo Field (Lands End)",
    "Your gates: North VIP Gate (west side, near 30th Ave) and South VIP Gate (south of Polo Field) — skip the main entrance crush",
    "VIP Box Office on the west side if you need ticket help",
    "VIP lounges: private bars, real seating, shade, and premium restrooms",
  ],
};
