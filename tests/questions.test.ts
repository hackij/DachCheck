import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { questions } from "../src/data/questions";
import { knowledgeEntries } from "../src/data/knowledge";
import { createSession } from "../src/App";

assert.equal(questions.length, 63, "Der Pool muss genau 63 geprüfte Aufgaben enthalten.");
assert.equal(new Set(questions.map(q => q.id)).size, questions.length, "Frage-IDs müssen eindeutig sein.");
for (const q of questions) {
  const options = [q.correctAnswer, ...q.distractors];
  assert.equal(options.length, 4, `${q.id}: genau vier Optionen erforderlich`);
  assert.equal(new Set(options).size, 4, `${q.id}: doppelte Optionen`);
  assert(options.includes(q.correctAnswer), `${q.id}: richtige Antwort fehlt`);
  assert(q.explanation && q.hint, `${q.id}: Feedback/Hinweis fehlt`);
  if (q.image) assert(existsSync(new URL(`../public${q.image}`, import.meta.url)), `${q.id}: Bild fehlt (${q.image})`);
  assert(!q.image?.includes("/images/questions/"), `${q.id}: uneindeutige Eigenzeichnung darf nicht mehr verwendet werden`);
}
assert(questions.filter(q => !q.image).length >= 17, "Die Prüfung benötigt ausreichend bildfreie Fachfragen.");
assert.equal(questions.filter(q => q.knowledgeLevel === "basis").length, 27);
assert.equal(questions.filter(q => q.knowledgeLevel === "advanced").length, 20);
assert.equal(questions.filter(q => q.knowledgeLevel === "pro").length, 16);
assert(knowledgeEntries.length >= 20, "Der Infobereich benötigt mindestens 20 Fachartikel.");
assert.equal(new Set(knowledgeEntries.map(entry => entry.id)).size, knowledgeEntries.length, "Info-IDs müssen eindeutig sein.");
for (const entry of knowledgeEntries) {
  assert(entry.lead && entry.practice && entry.features.length >= 2, `${entry.id}: Fachinhalt unvollständig`);
  assert(existsSync(new URL(`../public${entry.image}`, import.meta.url)), `${entry.id}: Infobild fehlt (${entry.image})`);
  if (entry.category === "detail") {
    assert(entry.coordination && entry.coordination.trades.length >= 2, `${entry.id}: beteiligte Gewerke fehlen`);
    assert(entry.coordination.topics.length >= 2, `${entry.id}: Abstimmungspunkte fehlen`);
  }
}
for (const [mode, level] of [["guided", "basis"], ["free", "advanced"], ["free", "pro"], ["mixed", "mixed"]] as const) {
  for (let run = 0; run < 100; run += 1) {
    const queue = createSession(mode, level).queue;
    assert.equal(new Set(queue).size, queue.length, `${mode}/${level}: Eine Prüfung darf keine Frage doppelt enthalten.`);
  }
}
console.log(`✓ ${questions.length} Fragen und ${knowledgeEntries.length} Fachartikel samt Bildassets geprüft.`);
