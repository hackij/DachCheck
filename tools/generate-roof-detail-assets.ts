import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const output = join(process.cwd(), "public/images/roof-details");
mkdirSync(output, { recursive: true });

const base = `
  <rect width="1200" height="720" rx="24" fill="#f8fafc"/>
  <path d="M58 356 489 388 489 655 58 585Z" fill="#d1b447" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M489 388 704 353 704 603 489 655Z" fill="#f2d45d" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M704 353 805 367 805 625 704 603Z" fill="#c7aa3f" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M805 367 987 177 1144 312 1144 530 805 625Z" fill="#f2d45d" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M58 356 371 169 489 388Z" fill="#60639b" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M371 169 685 154 704 353 489 388Z" fill="#6d70c1" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M685 154 987 177 805 367 704 353Z" fill="#595c8d" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M987 177 1144 312 805 367Z" fill="#f2d45d" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M481 197 540 193 595 229 536 233Z" fill="#7679c9" stroke="#152033" stroke-width="5" stroke-linejoin="round"/>
  <path d="M536 233 595 229 594 302 536 310Z" fill="#f2d45d" stroke="#152033" stroke-width="5" stroke-linejoin="round"/>
  <path d="M481 197 536 233 536 310 501 286Z" fill="#d1b447" stroke="#152033" stroke-width="5" stroke-linejoin="round"/>
`;

const marks: Record<string, string> = {
  first: `<path d="M371 169 685 154M685 154 987 177" fill="none" stroke="#ef3340" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M371 169 685 154M685 154 987 177" fill="none" stroke="#7a0b18" stroke-width="3" stroke-linecap="round"/>`,
  traufe: `<path d="M58 356 489 388 704 353 805 367" fill="none" stroke="#ef3340" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M58 356 489 388 704 353 805 367" fill="none" stroke="#7a0b18" stroke-width="3" stroke-linecap="round"/>`,
  ortgang: `<path d="M987 177 805 367M987 177 1144 312" fill="none" stroke="#ef3340" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M987 177 805 367M987 177 1144 312" fill="none" stroke="#7a0b18" stroke-width="3" stroke-linecap="round"/>`,
  grat: `<path d="M58 356 371 169M371 169 489 388" fill="none" stroke="#ef3340" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M58 356 371 169M371 169 489 388" fill="none" stroke="#7a0b18" stroke-width="3" stroke-linecap="round"/>`,
  kehle: `<path d="M685 154 704 353" fill="none" stroke="#ef3340" stroke-width="20" stroke-linecap="round"/><path d="M685 154 704 353" fill="none" stroke="#7a0b18" stroke-width="3" stroke-linecap="round"/>`,
  anfallpunkt: `<circle cx="371" cy="169" r="23" fill="#ef3340" stroke="#7a0b18" stroke-width="5"/><circle cx="685" cy="154" r="23" fill="#ef3340" stroke="#7a0b18" stroke-width="5"/>`,
  dachflaeche: `<path d="M685 154 987 177 805 367 704 353Z" fill="#ef3340" fill-opacity=".78" stroke="#7a0b18" stroke-width="7" stroke-linejoin="round"/>`,
  walm: `<path d="M58 356 371 169 489 388Z" fill="#ef3340" fill-opacity=".78" stroke="#7a0b18" stroke-width="7" stroke-linejoin="round"/>`,
  giebel: `<path d="M805 367 987 177 1144 312 1144 530 805 625Z" fill="#ef3340" fill-opacity=".72" stroke="#7a0b18" stroke-width="7" stroke-linejoin="round"/>`,
  gaube: `<path d="M481 197 540 193 595 229 594 302 536 310 501 286Z" fill="#ef3340" fill-opacity=".84" stroke="#7a0b18" stroke-width="7" stroke-linejoin="round"/>`,
};

for (const [name, mark] of Object.entries(marks)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="Unbeschriftete Dachlandschaft mit rot markiertem Bauteil">${base}${mark}</svg>`;
  writeFileSync(join(output, `${name}.svg`), svg);
}

const decliningRoof = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="Unbeschriftete Dachlandschaft mit rot markierter Verfallung">
  <rect width="1200" height="720" rx="24" fill="#f8fafc"/>
  <path d="M84 374 580 440 580 650 84 574Z" fill="#eef1f5" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M580 440 810 493 810 674 580 650Z" fill="#e0e5ec" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M810 493 1100 393 1100 572 810 674Z" fill="#f3f5f8" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M84 374 462 112 580 440Z" fill="#e68e9b" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M462 112 776 233 580 440Z" fill="#f19aaa" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M580 440 776 233 938 304 810 493Z" fill="#eb8d9c" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M938 304 1018 253 1100 393 810 493Z" fill="#f49faf" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M1018 253 1147 341 1100 393Z" fill="#f3f5f8" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M462 112 776 233" fill="none" stroke="#152033" stroke-width="7" stroke-linecap="round"/>
  <path d="M938 304 1018 253" fill="none" stroke="#152033" stroke-width="7" stroke-linecap="round"/>
  <path d="M776 233 938 304" fill="none" stroke="#ef3340" stroke-width="22" stroke-linecap="round"/>
  <path d="M776 233 938 304" fill="none" stroke="#7a0b18" stroke-width="4" stroke-linecap="round"/>
  <circle cx="776" cy="233" r="16" fill="#ef3340" stroke="#7a0b18" stroke-width="4"/>
</svg>`;
writeFileSync(join(output, "verfallung.svg"), decliningRoof);

const roofBreak = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="Schleppdachgaube mit rot markierter Übergangslinie zum Hauptdach">
  <rect width="1200" height="720" rx="24" fill="#f8fafc"/>
  <path d="M113 498 1065 498 1065 650 113 650Z" fill="#efd66a" stroke="#152033" stroke-width="6" stroke-linejoin="round"/>
  <path d="M113 498 402 153 977 153 1065 498Z" fill="#676aab" stroke="#152033" stroke-width="7" stroke-linejoin="round"/>
  <path d="M402 153 113 498 58 458 347 113Z" fill="#55598f" stroke="#152033" stroke-width="7" stroke-linejoin="round"/>
  <path d="M419 292 775 292 895 449 539 449Z" fill="#7b7fc8" stroke="#152033" stroke-width="7" stroke-linejoin="round"/>
  <path d="M539 449 895 449 895 585 539 585Z" fill="#f3da6d" stroke="#152033" stroke-width="7" stroke-linejoin="round"/>
  <path d="M419 292 539 449 539 585 467 500Z" fill="#c8ad43" stroke="#152033" stroke-width="7" stroke-linejoin="round"/>
  <path d="M775 292 895 449 895 585 838 507Z" fill="#d7bb4c" stroke="#152033" stroke-width="7" stroke-linejoin="round"/>
  <rect x="644" y="481" width="141" height="104" rx="4" fill="#dcecf4" stroke="#152033" stroke-width="6"/>
  <path d="M714.5 481V585M644 533H785" stroke="#8ba6b8" stroke-width="5"/>
  <path d="M419 292 775 292" fill="none" stroke="#ef3340" stroke-width="22" stroke-linecap="round"/>
  <path d="M419 292 775 292" fill="none" stroke="#7a0b18" stroke-width="4" stroke-linecap="round"/>
</svg>`;
writeFileSync(join(output, "dachknick.svg"), roofBreak);

console.log(`Generated ${Object.keys(marks).length + 2} roof-detail diagrams in ${output}`);
