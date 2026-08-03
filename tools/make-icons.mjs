// Generates the app icons (sunset over hills) as PNGs with zero dependencies.
// Run once: node tools/make-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "icons");

// ---- minimal PNG encoder (8-bit RGBA, no filtering) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size, rgba) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- the artwork ----
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const top = [30, 27, 75];      // deep indigo #1e1b4b
  const bot = [249, 115, 22];    // sunset orange #f97316
  const sun = [253, 230, 138];   // warm #fde68a
  const backHill = [26, 32, 44];  // #1a202c
  const frontHill = [13, 17, 23]; // #0d1117
  const sunCx = 0.5, sunCy = 0.54, sunR = 0.17;

  for (let y = 0; y < size; y++) {
    const ty = y / size;
    for (let x = 0; x < size; x++) {
      const tx = x / size;
      const t = Math.pow(ty, 1.15);
      let r = lerp(top[0], bot[0], t);
      let g = lerp(top[1], bot[1], t);
      let b = lerp(top[2], bot[2], t);

      // sun with a 2px-soft edge and faint glow
      const d = Math.hypot(tx - sunCx, ty - sunCy);
      const edge = 2 / size;
      const sunA = 1 - smooth(sunR - edge, sunR + edge, d);
      const glow = 0.35 * (1 - smooth(sunR, sunR * 2.4, d));
      const a = Math.min(1, sunA + glow);
      r = lerp(r, sun[0], a);
      g = lerp(g, sun[1], a);
      b = lerp(b, sun[2], a);

      // rolling hills over the lower third
      const h1 = 0.70 + 0.05 * Math.sin(tx * Math.PI * 2.2 + 0.8);
      const h2 = 0.80 + 0.06 * Math.sin(tx * Math.PI * 1.8 + 3.6);
      if (ty > h1) { r = backHill[0]; g = backHill[1]; b = backHill[2]; }
      if (ty > h2) { r = frontHill[0]; g = frontHill[1]; b = frontHill[2]; }

      const i = (y * size + x) * 4;
      rgba[i] = Math.round(r);
      rgba[i + 1] = Math.round(g);
      rgba[i + 2] = Math.round(b);
      rgba[i + 3] = 255; // fully opaque — required for apple-touch-icon
    }
  }
  return png(size, rgba);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [file, size] of [["icon-512.png", 512], ["icon-192.png", 192], ["apple-touch-icon.png", 180]]) {
  writeFileSync(join(OUT_DIR, file), drawIcon(size));
  console.log("wrote icons/" + file);
}
