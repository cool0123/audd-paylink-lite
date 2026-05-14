import { readFileSync } from "node:fs";

const requiredFiles = ["index.html", "styles.css", "app.js", "README.md"];
const requiredPhrases = [
  "AUDD PayLink Lite",
  "Generate payment link",
  "Export CSV",
  "No private keys",
  "1000 AUDD",
];

for (const file of requiredFiles) {
  readFileSync(new URL(file, import.meta.url), "utf8");
}

const html = readFileSync(new URL("index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("app.js", import.meta.url), "utf8");
const readme = readFileSync(new URL("README.md", import.meta.url), "utf8");
const bundle = `${html}\n${app}\n${readme}`;

for (const phrase of requiredPhrases) {
  if (!bundle.includes(phrase)) {
    throw new Error(`Missing required phrase: ${phrase}`);
  }
}

if (/AKmX8|[1-9A-HJ-NP-Za-km-z]{80,}|\\b(?:abandon|ability|able|about|above|absent|absorb|abstract|absurd|abuse)\\b(?:\\s+\\w+){11,23}/i.test(bundle)) {
  throw new Error("Potential sensitive value detected in public demo files.");
}

console.log("AUDD PayLink Lite verification passed.");
