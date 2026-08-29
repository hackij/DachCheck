import { mkdirSync, writeFileSync } from "node:fs";
import { questions } from "../src/data/questions";

const dir = new URL("../public/images/questions/", import.meta.url);
mkdirSync(dir, { recursive: true });
const esc = (s: string) => s.replaceAll("&", "&amp;");
const frame = (inner: string, id: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 580" role="img" aria-labelledby="t d"><title id="t">Technische Dachzeichnung ${id}</title><desc id="d">Didaktisch reduzierte Darstellung einer Dachform oder eines Dachteils.</desc><defs><linearGradient id="roof" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d8e3ee"/><stop offset="1" stop-color="#8095ab"/></linearGradient><linearGradient id="wall"><stop stop-color="#f6f1e9"/><stop offset="1" stop-color="#d9d2c6"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#1d324b" flood-opacity=".18"/></filter></defs><rect width="800" height="580" fill="#f8fafc"/><path d="M60 485H740" stroke="#dce5ef" stroke-width="3"/><g filter="url(#shadow)" stroke="#344b63" stroke-width="4" stroke-linejoin="round">${inner}</g><g font-family="system-ui,sans-serif" font-size="15" fill="#6a7b8e"><text x="40" y="45">DACHCHECK · ${id.toUpperCase()}</text></g></svg>`;
const wall = `<path fill="url(#wall)" d="M180 310L400 190 630 315v170H180z"/>`;
const gable = `${wall}<path fill="url(#roof)" d="M125 330L390 165 405 195 180 330z"/><path fill="#9aabba" d="M390 165L690 335 630 355 405 195z"/>`;
const mono = `${wall}<path fill="url(#roof)" d="M140 310L620 205 680 260 180 360z"/>`;
const flat = `<path fill="url(#wall)" d="M160 260H630v220H160z"/><path fill="url(#roof)" d="M125 260L590 205 675 245 190 305z"/>`;
const hip = `<path fill="url(#wall)" d="M165 330L400 225 650 330v155H165z"/><path fill="url(#roof)" d="M105 335L285 185 515 185 695 335 625 350 400 235 180 350z"/><path fill="#98abba" d="M285 185L400 235 180 350 105 335z"/><path fill="#71879b" d="M515 185L695 335 625 350 400 235z"/><path d="M285 185H515" stroke="#f4bf41" stroke-width="9"/>`;
const halfHip = `<path fill="url(#wall)" d="M180 330L400 195 630 330v155H180z"/><path fill="url(#roof)" d="M120 335L330 190 470 190 690 335 630 350 400 220 180 350z"/><path fill="#879caf" d="M330 190L470 190 400 280z"/><path d="M330 190H470" stroke="#f4bf41" stroke-width="8"/>`;
const footHip = `<path fill="url(#wall)" d="M180 325L400 180 630 325v160H180z"/><path fill="url(#roof)" d="M120 330L400 150 690 330 630 350 400 195 180 350z"/><path fill="#879caf" d="M180 350L400 270 630 350 610 410 400 330 200 410z"/>`;
const mansard = `<path fill="url(#wall)" d="M190 355L400 245 620 355v130H190z"/><path fill="#8398aa" d="M115 360L225 200 370 155 400 210 255 255 190 385z"/><path fill="#aab9c6" d="M370 155L510 200 690 360 620 385 480 255 400 210z"/><path d="M225 200L255 255M510 200L480 255" stroke="#f4bf41" stroke-width="8"/>`;
const barrel = `<path fill="url(#wall)" d="M170 330H630v155H170z"/><path fill="url(#roof)" d="M130 335Q400 60 675 335L630 370Q400 145 170 370z"/>`;
const tent = `<path fill="url(#wall)" d="M170 330H630v155H170z"/><path fill="url(#roof)" d="M110 335L400 120 690 335 630 365 170 365z"/><path fill="#899dad" d="M400 120L630 365H170z"/>`;
const shed = `<path fill="url(#wall)" d="M120 330H680v155H120z"/>${[0,1,2].map(i=>`<path fill="url(#roof)" d="M${115+i*180} 330L${235+i*180} 180L${295+i*180} 330z"/><path fill="#aebcca" d="M${235+i*180} 180V330H${295+i*180}z"/>`).join("")}`;
const baseRoof = `${wall}<path fill="url(#roof)" d="M110 335L400 155 690 335 630 360 400 205 180 360z"/>`;

function dormer(kind: string) {
  let d = "";
  if (kind.includes("pointed") || kind.includes("mixed")) d = `<path fill="#e9eef3" d="M330 285L410 210 495 285v100H330z"/><path fill="#71879a" d="M310 290L410 190 430 220 345 305z"/><path fill="#9fb0bf" d="M410 190L515 290 495 305 430 220z"/>`;
  else if (kind.includes("shed")) d = `<path fill="#e9eef3" d="M325 280H500v105H325z"/><path fill="#8398aa" d="M300 280L500 235 530 275 325 315z"/>`;
  else if (kind.includes("barrel")) d = `<path fill="#e9eef3" d="M330 285H500v100H330z"/><path fill="#8398aa" d="M305 290Q415 165 525 290L500 315Q415 220 330 315z"/>`;
  else if (kind.includes("bat")) d = `<path fill="#e9eef3" d="M350 300Q415 235 485 300v80H350z"/><path fill="#8398aa" d="M245 310Q415 145 585 310Q500 260 485 315Q415 225 350 315Q325 260 245 310z"/>`;
  else if (kind.includes("trapezoid")) d = `<path fill="#e9eef3" d="M345 275H485l45 110H305z"/><path fill="#8398aa" d="M300 290L340 235H490l45 55-40 30-160 0z"/>`;
  else d = `<path fill="#e9eef3" d="M330 285H500v100H330z"/><path fill="#8398aa" d="M305 295L365 225H465l65 70-30 25-85-55-85 55z"/>`;
  if (kind.includes("mixed")) d += `<path fill="#e9eef3" d="M520 300H640v80H520z"/><path fill="#8da1b2" d="M500 305L640 260 665 295 520 330z"/>`;
  return baseRoof + d + `<rect x="385" y="310" width="65" height="58" rx="3" fill="#7cb1d2" stroke="#41576c"/>`;
}
function detail(kind: string) {
  const yellow = `stroke="#f2b632" stroke-width="12" stroke-linecap="round" fill="none"`;
  if (kind.includes("valley") || kind.includes("complex-valley")) return `${baseRoof}<path fill="#9aabba" d="M400 205L535 280 465 405 400 365 335 405 265 280z"/><path d="M400 205L400 365" ${yellow}/>`;
  if (kind.includes("hip-valley") || kind.includes("multi-marker")) return `${hip}<path fill="#9aabba" d="M400 235L540 310 470 420 400 380 330 420 260 310z"/><path d="M285 185L180 350" ${yellow}/><path d="M400 235L400 380" stroke="#57a7d8" stroke-width="12"/><text x="205" y="250" fill="#172033" stroke="none" font-size="28">A</text><text x="420" y="305" fill="#172033" stroke="none" font-size="28">B</text>`;
  if (kind.includes("ridge")) return `${gable}<path d="M390 165L690 335" ${yellow}/>`;
  if (kind.includes("eaves")) return `${gable}<path d="M180 330L405 195" opacity="0"/><path d="M180 350H630" ${yellow}/>`;
  if (kind.includes("verge")) return `${gable}<path d="M125 330L390 165" ${yellow}/>`;
  if (kind.includes("hipline")) return `${hip}<path d="M285 185L180 350" ${yellow}/>`;
  if (kind.includes("roof-plane") || kind.includes("projection")) return `${gable}<path fill="#f2bd39" fill-opacity=".56" d="M125 330L390 165 405 195 180 330z"/>`;
  if (kind.includes("roof-break")) return `${mansard}`;
  if (kind.includes("half-hip-plane")) return `${halfHip}<path fill="#f2bd39" fill-opacity=".6" d="M330 190L470 190 400 280z"/>`;
  if (kind.includes("hip-plane")) return `${hip}<path fill="#f2bd39" fill-opacity=".6" d="M285 185L400 235 180 350 105 335z"/>`;
  if (kind.includes("junction")) return `${hip}<circle cx="400" cy="235" r="17" fill="#f2b632" stroke="#fff" stroke-width="5"/>`;
  if (kind.includes("declining")) return `${hip}<path fill="#a7b6c3" d="M400 235L570 280 470 390 400 350z"/><path d="M400 235L470 390" ${yellow}/><path d="M285 185H515" stroke="#344b63"/><path d="M515 185H640" stroke="#344b63"/>`;
  return `${gable}`;
}
function variation(kind: string) {
  if (kind.includes("half-hip")) return halfHip;
  if (kind.includes("foot-half")) return `${footHip}<path fill="#798fa2" d="M330 175L470 175 400 250z"/>`;
  if (kind.includes("foot-hip")) return footHip;
  if (kind.includes("asym")) return `${wall}<path fill="url(#roof)" d="M105 335L330 145 360 205 180 350z"/><path fill="#91a5b6" d="M330 145L690 335 630 350 360 205z"/>`;
  if (kind.includes("unequal-eaves")) return `${wall}<path fill="url(#roof)" d="M100 380L390 160 410 205 175 410z"/><path fill="#91a5b6" d="M390 160L690 315 630 340 410 205z"/><path d="M175 410H340M500 340H630" stroke="#f2b632" stroke-width="9"/>`;
  if (kind.includes("unequal-pitch")) return `${wall}<path fill="url(#roof)" d="M100 340L445 140 455 205 180 360z"/><path fill="#91a5b6" d="M445 140L690 340 630 360 455 205z"/>`;
  if (kind.includes("return")) return `${kind.includes("mono") ? mono : gable}<path fill="#dde6ed" d="M335 315L500 255 610 325 465 405 335 375z"/><path fill="#7890a4" d="M335 315L430 235 525 300 500 330 430 280 360 340z"/>`;
  if (kind.includes("one-side")) return `${gable}<path fill="#7f95a8" d="M390 165L690 335 630 355 405 195z"/>`;
  if (kind.includes("beveled")) return `${hip}<path fill="#6f879a" d="M515 185L660 280 625 350 400 235z"/>`;
  return hip;
}
function visual(kind: string) {
  if (kind === "complex-roofs") return `<g transform="translate(-55 170) scale(.62)">${gable}</g><g transform="translate(345 175) scale(.6)">${hip}</g><text x="185" y="470" fill="#344b63" stroke="none" font-size="22">BAUKÖRPER A</text><text x="515" y="470" fill="#344b63" stroke="none" font-size="22">BAUKÖRPER B</text>`;
  if (kind.includes("dormer") || kind.includes("bat-compare")) return dormer(kind);
  if (["ridge","eaves","verge","hipline","valley","roof-plane","roof-break","hip-plane","half-hip-plane","junction","declining-hip","hip-valley-compare","multi-marker","valley-context","verge-context","complex-valley","roof-plane-projection","junction-reason","declining-hip-reason"].some(x=>kind.includes(x))) return detail(kind);
  if (["half-hip","foot-hip","foot-half","asym","unequal","return","hip-one","hip-beveled"].some(x=>kind.includes(x))) return variation(kind);
  if (kind.includes("mansard")) return mansard;
  if (kind.includes("barrel")) return barrel;
  if (kind.includes("tent")) return tent;
  if (kind.includes("shed")) return shed;
  if (kind.includes("mono")) return mono;
  if (kind.includes("flat")) return flat;
  if (kind.includes("half-hip")) return halfHip;
  if (kind.includes("hip") || kind.includes("complex-roofs")) return hip;
  return gable;
}

for (const q of questions) writeFileSync(new URL(`${q.id}.svg`, dir), frame(visual(q.visual), q.id));
writeFileSync(new URL("../public/images/image-fallback.svg", import.meta.url), frame(`<rect x="180" y="150" width="440" height="280" rx="25" fill="#edf2f7"/><path d="M310 345L385 270 450 330 500 290 575 365H240z" fill="#91a5b7"/><circle cx="535" cy="225" r="30" fill="#f2b632"/>`, "FALLBACK"));
console.log(`Generated ${questions.length} SVG question assets.`);
