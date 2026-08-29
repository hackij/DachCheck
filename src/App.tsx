import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, BookOpenCheck, Check, ChevronRight, ClipboardCheck, GraduationCap, House, Layers3, RefreshCcw, RotateCcw, Search, Sparkles, Target, TriangleAlert, UsersRound, X } from "lucide-react";
import { CATEGORY_LABEL, LEVEL_LABEL, questions } from "./data/questions";
import { KNOWLEDGE_CATEGORY, knowledgeEntries } from "./data/knowledge";
import type { KnowledgeCategory, KnowledgeEntry } from "./data/knowledge";
import type { Level, Mode, Question } from "./types";

const STORE = "dachcheck-session-v1";
const WORDS = ["DACHPROFI", "BLECHDACH", "DACHKANTE"];
const COUNT: Record<Level, number> = { basis: 9, advanced: 8, pro: 8 };
const assetPath = (path: string) => `${import.meta.env?.BASE_URL ?? "/"}${path.replace(/^\//, "")}`;

type Stored = { secure: Record<Level, string[]>; review: string[] };
type Session = { mode: Mode; level: Level | "mixed"; queue: string[]; current: number; solved: string[]; wrong: string[]; attempts: Record<string, number>; word: string; options: Record<string, string[]>; finished: boolean };
const emptyStored = (): Stored => ({ secure: { basis: [], advanced: [], pro: [] }, review: [] });
const shuffle = <T,>(list: T[]) => {
  const shuffled = [...list];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};
const getStored = (): Stored => { try { return JSON.parse(localStorage.getItem(STORE + "-progress") || "null") || emptyStored(); } catch { return emptyStored(); } };
const saveStored = (data: Stored) => localStorage.setItem(STORE + "-progress", JSON.stringify(data));

export function createSession(mode: Mode, level: Level | "mixed", reviewIds: string[] = []): Session {
  let pool = mode === "review" ? questions.filter(q => reviewIds.includes(q.id)) : level === "mixed" ? questions : questions.filter(q => q.knowledgeLevel === level);
  if (!pool.length) pool = questions.filter(q => q.knowledgeLevel === "basis");
  pool = [...new Map(pool.map(question => [question.id, question])).values()];
  const count = level === "mixed" ? 12 : mode === "review" ? Math.min(10, pool.length) : COUNT[level as Level];
  const picked = shuffle(pool).slice(0, count);
  return { mode, level, queue: picked.map(q => q.id), current: 0, solved: [], wrong: [], attempts: {}, word: level === "basis" ? WORDS[Math.floor(Math.random() * WORDS.length)] : "", options: Object.fromEntries(picked.map(q => [q.id, shuffle([q.correctAnswer, ...q.distractors])])), finished: false };
}

function Header({ onHome, compact = false, showAreaButton = true }: { onHome: () => void; compact?: boolean; showAreaButton?: boolean }) {
  return <header className={compact ? "topbar topbar--compact" : "topbar"}>
    <button className="brand" onClick={onHome} aria-label="Zur DachCheck-Startseite"><span className="brand-mark"><Layers3 /></span><span><strong>DachCheck</strong><small>Dachformen · Gauben · Dachteile</small></span></button>
    <div className="topbar-actions">{showAreaButton && <button className="header-home" type="button" onClick={onHome}><House/><span>Bereichsauswahl</span></button>}<img className="school-logo" src={assetPath("/images/bs1-spengler-logo-transparent.png")} alt="BS1 Spengler" /></div>
  </header>;
}

function Welcome({ onEnter }: { onEnter: () => void }) {
  return <main className="welcome-page">
    <section className="welcome-stage" aria-labelledby="welcome-title">
      <div className="welcome-banner">
        <img src={assetPath("/images/dachcheck-hero.png")} alt="Moderne Gebäude mit verschiedenen Dachformen" />
        <div className="welcome-shade" />
        <div className="welcome-brand"><span className="brand-mark"><Layers3 /></span><span><strong>DachCheck</strong><small>Dachformen · Gauben · Dachteile</small></span></div>
        <div className="welcome-school"><img src={assetPath("/images/bs1-spengler-logo-transparent.png")} alt="BS1 Spengler" /></div>
        <div className="welcome-copy"><span className="eyebrow">Lernapp für das Spenglerhandwerk</span><h1 id="welcome-title">DachCheck</h1><p>Dachformen · Gauben · Dachteile</p></div>
      </div>
      <button className="primary welcome-button" type="button" onClick={onEnter}><BookOpenCheck /> App betreten <ArrowRight /></button>
    </section>
    <p className="welcome-credit">Entwickelt von Jan Hacker für die Staatliche Berufsschule 1 Bayreuth</p>
  </main>;
}

function AreaChoice({ onInfo, onExam }: { onInfo: () => void; onExam: () => void }) {
  return <div className="app-shell"><Header onHome={() => {}} showAreaButton={false}/><main className="area-choice">
    <section className="area-choice__intro"><span className="eyebrow">DachCheck starten</span><h1>Wie möchtest du heute arbeiten?</h1><p>Informiere dich zuerst über Dachformen und Fachbegriffe oder prüfe dein Wissen direkt in einem Training.</p></section>
    <section className="area-grid" aria-label="Lernbereich auswählen">
      <button className="area-card area-card--info" onClick={onInfo}><span className="area-card__icon"><BookOpen/></span><span className="eyebrow">Nachschlagen & verstehen</span><h2>Informieren</h2><p>Entdecke Dachformen, Gauben und wichtige Dachteile mit Bildern, Merkmalen und Hinweisen aus der Praxis.</p><span className="area-card__link">Zum Infobereich <ChevronRight/></span></button>
      <button className="area-card area-card--exam" onClick={onExam}><span className="area-card__icon"><ClipboardCheck/></span><span className="eyebrow">Wissen anwenden</span><h2>Prüfen</h2><p>Bearbeite die bisherigen Trainings in drei Niveaus, erhalte Hinweise und wiederhole unsichere Inhalte.</p><span className="area-card__link">Zum Prüfbereich <ChevronRight/></span></button>
    </section>
  </main><Footer/></div>;
}

function CompetencyIntro({ onContinue }: { onContinue: () => void }) {
  const [progress, setProgress] = useState(0);
  const [readToEnd, setReadToEnd] = useState(false);
  const scrollArea = useRef<HTMLDivElement>(null);
  const trackReading = () => {
    const element = scrollArea.current;
    if (!element) return;
    const maximum = Math.max(1, element.scrollHeight - element.clientHeight);
    const value = Math.min(100, Math.round(element.scrollTop / maximum * 100));
    setProgress(value);
    if (element.scrollTop >= maximum - 8) { setProgress(100); setReadToEnd(true); }
  };
  return <div className="competency-backdrop"><section className="competency-window" role="dialog" aria-modal="true" aria-labelledby="competency-title">
    <header className="competency-heading"><div className="competency-heading__row"><span className="competency-heading__icon"><Target/></span><div><span className="eyebrow">Kompetenzerwartung</span><h1 id="competency-title">Fachsprache macht Dacharbeit eindeutig.</h1></div></div><div className="competency-progress" aria-label={`Lesefortschritt ${progress} Prozent`}><span style={{width: `${progress}%`}}/></div></header>
    <div className="competency-scroll" ref={scrollArea} onScroll={trackReading} tabIndex={0}>
      <p className="competency-lead">Von euch wird erwartet, dass ihr Fachbegriffe rund um Dachformen, Dachteile und konstruktive Details sicher versteht und fachgerecht anwenden könnt.</p>
      <p>Diese gemeinsame Sprache braucht ihr in allen Phasen eines Auftrags: vom Lesen des Werkplans über die Arbeitsvorbereitung bis zur Ausführung und Qualitätskontrolle auf der Baustelle.</p>
      <h2>Das bedeutet für eure Arbeit:</h2>
      <div className="competency-actions">
        <div className="competency-action"><b>Planungen sicher verstehen</b><p>Ihr erkennt Dachformen, Flächen, Linien und Anschlusspunkte in Werkplänen und könnt daraus die notwendigen Arbeitsschritte ableiten.</p></div>
        <div className="competency-action"><b>Arbeiten eindeutig beschreiben</b><p>Ihr könnt benennen, an welchem Dachteil gearbeitet wird, welches Detail gemeint ist und wie die Ausführung vorgesehen ist.</p></div>
        <div className="competency-action"><b>Details gemeinsam abstimmen</b><p>In Gesprächen mit Kollegen, Lehrkräften und anderen Gewerken verwendet ihr dieselben Begriffe. So werden Missverständnisse, falsche Maße und fehlerhafte Anschlüsse vermieden.</p></div>
        <div className="competency-action"><b>Ausführung und Qualität beurteilen</b><p>Ihr könnt Arbeitsergebnisse fachlich erklären, kontrollieren und bei Abweichungen gezielt über Verbesserungen sprechen.</p></div>
      </div>
      <div className="competency-result"><b>Das sollt ihr am Ende können:</b><p>Dachformen, Gauben und Dachteile korrekt erkennen und benennen, Angaben in Werkplänen verstehen sowie Planungs- und Ausführungsdetails verständlich und fachgerecht besprechen.</p></div>
      <div className="competency-end" aria-hidden="true"/>
    </div>
    <footer className="competency-footer"><p>{readToEnd ? <strong>Vollständig gelesen – du kannst fortfahren.</strong> : "Bitte lies den Text und scrolle bis zum Ende."}</p><button className="primary" disabled={!readToEnd} onClick={onContinue}>{readToEnd ? "Verstanden – weiter" : "Bis zum Ende scrollen"}<ArrowRight/></button></footer>
  </section></div>;
}

function InfoArea({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<KnowledgeCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<KnowledgeEntry | null>(null);
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("de");
    return knowledgeEntries.filter(entry => (category === "all" || entry.category === category) && (!term || [entry.title, entry.lead, entry.practice, ...(entry.aliases || [])].join(" ").toLocaleLowerCase("de").includes(term)));
  }, [category, search]);
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);
  return <div className="app-shell"><Header onHome={onBack}/><main className="info-main">
    <button className="back-link info-back" onClick={onBack}><ArrowLeft/> Bereichsauswahl</button>
    <section className="info-hero"><div className="info-hero__top"><div><span className="eyebrow hero-eyebrow">Informieren</span><h1>Dachwissen zum Nachschlagen.</h1><p>Lerne Formen und Fachbegriffe nicht isoliert, sondern als gemeinsame Sprache für Werkplan, Detailbesprechung, Arbeitsvorbereitung und Baustellenabstimmung.</p></div><label className="info-search"><Search/><span className="sr-only">Fachbegriff suchen</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Fachbegriff suchen …"/></label></div></section>
    <section className="trade-intro" aria-labelledby="trade-intro-title"><span className="trade-intro__icon"><UsersRound/></span><div><span className="eyebrow">Gewerkeübergreifend arbeiten</span><h2 id="trade-intro-title">Fachbegriffe verhindern Gewerkelöcher.</h2><p>Ein <strong>Gewerkeloch</strong> entsteht, wenn jedes Gewerk nur den eigenen Arbeitsbereich betrachtet und niemand den vollständigen Übergang koordiniert. Deshalb müssen Dachteil, Zuständigkeit, Vorleistung, Maße, Materialfolge und Ausführungsreihenfolge vor Beginn eindeutig besprochen werden.</p></div></section>
    <nav className="info-toolbar" aria-label="Informationen filtern">
      <button className={`filter-chip ${category === "all" ? "filter-chip--active" : ""}`} onClick={() => setCategory("all")}>Alle ({knowledgeEntries.length})</button>
      {(Object.keys(KNOWLEDGE_CATEGORY) as KnowledgeCategory[]).map(key => <button key={key} className={`filter-chip ${category === key ? "filter-chip--active" : ""}`} onClick={() => setCategory(key)}>{KNOWLEDGE_CATEGORY[key]}</button>)}
    </nav>
    <section className="knowledge-grid" aria-live="polite">{filtered.length ? filtered.map(entry => <button key={entry.id} className={`knowledge-card ${entry.id.startsWith("dachbegriffe-") ? "knowledge-card--overview" : ""}`} onClick={() => setSelected(entry)}><span className="knowledge-card__image"><img src={entry.image} alt={`Darstellung: ${entry.title}`}/></span><span className="knowledge-card__body"><small>{KNOWLEDGE_CATEGORY[entry.category]}</small><h2>{entry.title}</h2><p>{entry.lead}</p><span className="knowledge-card__more">Details ansehen <ChevronRight/></span></span></button>) : <div className="empty-info"><b>Kein passender Begriff gefunden.</b><p>Versuche einen anderen Suchbegriff oder wähle „Alle“.</p></div>}</section>
    {selected && <div className="knowledge-dialog" role="presentation" onMouseDown={() => setSelected(null)}><article className={`knowledge-dialog__card ${selected.id.startsWith("dachbegriffe-") ? "knowledge-dialog__card--overview" : ""}`} role="dialog" aria-modal="true" aria-labelledby="knowledge-title" onMouseDown={event => event.stopPropagation()}><button className="dialog-close" aria-label="Detailansicht schließen" onClick={() => setSelected(null)}><X/></button><div className="knowledge-dialog__visual"><img src={selected.image} alt={`Darstellung: ${selected.title}`}/></div><div className="knowledge-dialog__content"><span className="eyebrow">{KNOWLEDGE_CATEGORY[selected.category]}</span><h2 id="knowledge-title">{selected.title}</h2>{selected.aliases && <p className="alias-list">Auch: {selected.aliases.join(" · ")}</p>}<p className="knowledge-dialog__lead">{selected.lead}</p><div className="feature-box"><h3>Erkennungsmerkmale</h3><ul>{selected.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div><div className="practice-box"><h3>Warum das in der Praxis wichtig ist</h3><p>{selected.practice}</p></div>{selected.coordination && <div className="coordination-box"><h3><UsersRound/> Abstimmung mit anderen Gewerken</h3><div className="coordination-section"><b>Typisch beteiligt</b><div className="trade-tags">{selected.coordination.trades.map(trade => <span key={trade}>{trade}</span>)}</div></div><div className="coordination-section"><b>Das muss abgestimmt werden</b><ul>{selected.coordination.topics.map(topic => <li key={topic}>{topic}</li>)}</ul></div><p className="coordination-note"><TriangleAlert/> Zuständigkeiten sind projektabhängig. Entscheidend ist, dass der Übergang vollständig geplant und keinem „Gewerkeloch“ überlassen wird.</p></div>}</div></article></div>}
  </main><Footer/></div>;
}

function ProgressRing({ value, label }: { value: number; label: string }) {
  return <div className="mini-progress"><div className="ring" style={{"--p": `${value}%`} as React.CSSProperties}><span>{value}%</span></div><span>{label}</span></div>;
}

function Home({ progress, onStart, onReset, onAreaChoice }: { progress: Stored; onStart: (mode: Mode, level: Level | "mixed") => void; onReset: () => void; onAreaChoice: () => void }) {
  const percent = (l: Level) => Math.min(100, Math.round(progress.secure[l].length / (l === "basis" ? 9 : 8) * 100));
  return <div className="app-shell"><Header onHome={onAreaChoice} /><main>
    <section className="hero">
      <img src={assetPath("/images/dachcheck-hero.png")} alt="Mehrere moderne Gebäude mit Sattel-, Walm-, Pult- und Mansarddach" />
      <div className="hero-shade"/><div className="hero-copy"><span className="eyebrow hero-eyebrow">Lernapp für das Spenglerhandwerk</span><h1>Dächer sehen.<br/><em>Fachlich benennen.</em></h1>
      <div className="competency-note"><span>Lernziel · Dächer mit metallischen Werkstoffen decken</span><p>Du benennst Dachformen, Gauben und Dachteile sicher. So kannst du Werkpläne verstehen, Details eindeutig besprechen und die Ausführung mit Kollegen sowie anderen Gewerken zuverlässig planen und abstimmen.</p></div>
      <button className="primary hero-action" onClick={() => onStart("guided", "basis")}><BookOpenCheck/> Geführten Lernweg starten <ChevronRight/></button></div>
    </section>
    <section className="intro-row"><div><span className="eyebrow">Dein Lernweg</span><h2>Wähle, was heute zu dir passt.</h2><p>Keine Zeitbegrenzung. Hinweise helfen dir beim zweiten Versuch; unsichere Inhalte landen automatisch in der Wiederholung.</p></div><div className="progress-overview"><ProgressRing value={percent("basis")} label="Basis"/><ProgressRing value={percent("advanced")} label="Vertieft"/><ProgressRing value={percent("pro")} label="Profi"/></div></section>
    <section className="level-grid" aria-label="Lernniveaus">
      <button className="level-card level-card--basis" onClick={() => onStart("free", "basis")}><span className="level-icon"><Target/></span><span className="level-number">NIVEAU 1</span><h3>Basiswissen</h3><p>Das musst du sicher können.</p><span className="card-meta"><b>{progress.secure.basis.length}</b> sicher gelöst</span><span className="card-link">Training wählen <ChevronRight/></span></button>
      <button className="level-card level-card--advanced" onClick={() => onStart("free", "advanced")}><span className="level-icon"><Layers3/></span><span className="level-number">NIVEAU 2</span><h3>Vertieftes Wissen</h3><p>Unterscheide Varianten und Merkmale.</p><span className="card-meta"><b>{progress.secure.advanced.length}</b> sicher gelöst</span><span className="card-link">Training wählen <ChevronRight/></span></button>
      <button className="level-card level-card--pro" onClick={() => onStart("free", "pro")}><span className="level-icon"><GraduationCap/></span><span className="level-number">NIVEAU 3</span><h3>Profi-Wissen</h3><p>Begründe und übertrage auf komplexe Dächer.</p><span className="card-meta"><b>{progress.secure.pro.length}</b> sicher gelöst</span><span className="card-link">Training wählen <ChevronRight/></span></button>
    </section>
    <section className="action-strip"><div><span className="action-icon"><Sparkles/></span><div><h3>Gemischtes Training</h3><p>Aufgaben aus allen drei Niveaus – ideal zum Festigen.</p></div></div><button className="secondary" onClick={() => onStart("mixed", "mixed")}>Gemischt starten <ArrowRight/></button></section>
    {progress.review.length > 0 && <section className="action-strip action-strip--review"><div><span className="action-icon"><RefreshCcw/></span><div><h3>Wiederholung</h3><p>{progress.review.length} unsichere Inhalte warten auf dich.</p></div></div><button className="secondary" onClick={() => onStart("review", "mixed")}>Jetzt wiederholen <ArrowRight/></button></section>}
    <button className="text-button reset" onClick={onReset}><RotateCcw/> Lokalen Lernfortschritt zurücksetzen</button>
  </main><Footer/></div>;
}

function Quiz({ session, setSession, onHome, onAreaChoice, onNextLevel }: { session: Session; setSession: (s: Session) => void; onHome: () => void; onAreaChoice: () => void; onNextLevel: (l: Level) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"right" | "wrong" | null>(null);
  const id = session.queue[session.current];
  const q = questions.find(x => x.id === id);
  useEffect(() => { setSelected(null); setFeedback(null); }, [id]);
  if (session.finished || !q) return <Complete session={session} onHome={onHome} onAreaChoice={onAreaChoice} onNextLevel={onNextLevel}/>;
  const total = session.queue.length;
  const level = session.level === "mixed" ? q.knowledgeLevel : session.level;
  const options = session.options[q.id] || [q.correctAnswer, ...q.distractors];
  const answer = (option: string) => {
    if (feedback === "right") return;
    setSelected(option);
    const correct = option === q.correctAnswer;
    setFeedback(correct ? "right" : "wrong");
    if (!correct) {
      const wrong = session.wrong.includes(q.id) ? session.wrong : [...session.wrong, q.id];
      setSession({...session, wrong, attempts: {...session.attempts, [q.id]: (session.attempts[q.id] || 0) + 1}});
      const stored = getStored(); if (!stored.review.includes(q.id)) { stored.review.push(q.id); saveStored(stored); }
    }
  };
  const next = () => {
    if (feedback !== "right") return;
    const solved = session.solved.includes(q.id) ? session.solved : [...session.solved, q.id];
    const stored = getStored();
    if (!stored.secure[q.knowledgeLevel].includes(q.id)) stored.secure[q.knowledgeLevel].push(q.id);
    stored.review = stored.review.filter(x => x !== q.id); saveStored(stored);
    const last = session.current >= session.queue.length - 1;
    setSession({...session, solved, current: last ? session.current : session.current + 1, finished: last});
  };
  const progress = Math.round((session.current / total) * 100);
  const letters = session.word.split("").map((letter, i) => i < session.solved.length ? letter : "_").join(" ");
  const textOnly = !q.image;
  return <div className="app-shell quiz-shell"><Header onHome={onAreaChoice} compact/><main className="quiz-main">
    <div className="quiz-status"><div><button className="back-link" onClick={onHome}><ArrowLeft/> Übersicht</button><span className={`level-pill level-pill--${level}`}>{LEVEL_LABEL[level as Level]}</span><span className="category-pill">{CATEGORY_LABEL[q.category]}</span></div><div className="question-count"><b>{session.current + 1}</b> / {total}</div></div>
    <div className="progress-track" aria-label={`Fortschritt ${progress} Prozent`}><span style={{width: `${progress}%`}}/></div>
    <section className={`quiz-card ${textOnly ? "quiz-card--text-only" : ""}`}>
      {!textOnly && <div className="visual-panel"><div className="image-wrap"><img src={q.image} alt={`Technische Darstellung zur Frage: ${q.question}`} onError={e => { e.currentTarget.src = assetPath("/images/image-fallback.svg"); }}/><span className="image-label">TECHNISCHE DARSTELLUNG</span></div>{session.word && <div className="solution-progress"><span>Lösungswort</span><strong aria-label="Bisherige Buchstaben">{letters}</strong></div>}</div>}
      <div className="answer-panel">{textOnly && <div className="text-question-note"><BookOpen/><span><b>Fachfrage ohne Abbildung</b><small>Entscheidend sind Bedeutung und sichere Anwendung des Fachbegriffs.</small></span></div>}<span className="eyebrow">Frage {session.current + 1}</span><h1>{q.question}</h1><div className="answers">{options.map((o, i) => { const state = selected === o ? feedback : feedback === "right" && o === q.correctAnswer ? "right" : null; return <button key={o} className={`answer ${state ? `answer--${state}` : ""}`} disabled={feedback === "right"} onClick={() => answer(o)}><span>{String.fromCharCode(65+i)}</span><b>{o}</b>{state === "right" ? <Check/> : state === "wrong" ? <X/> : null}</button>})}</div>
      {textOnly && session.word && <div className="solution-progress solution-progress--text"><span>Lösungswort</span><strong aria-label="Bisherige Buchstaben">{letters}</strong></div>}
      {feedback === "wrong" && <div className="feedback feedback--wrong" role="alert"><TriangleAlert/><div><b>Noch nicht.</b><p>{q.hint}</p><small>Du kannst direkt noch einmal wählen.</small></div></div>}
      {feedback === "right" && <div className="feedback feedback--right" role="status"><Check/><div><b>Richtig – {q.correctAnswer}</b><p>{q.explanation}</p></div></div>}
      <button className="primary next-button" disabled={feedback !== "right"} onClick={next}>{session.current === total - 1 ? "Training abschließen" : "Weiter"}<ArrowRight/></button></div>
    </section>
  </main><Footer/></div>;
}

function Complete({ session, onHome, onAreaChoice, onNextLevel }: { session: Session; onHome: () => void; onAreaChoice: () => void; onNextLevel: (l: Level) => void }) {
  return <div className="app-shell"><Header onHome={onAreaChoice}/><main className="complete"><div className="complete-icon"><Check/></div><span className="eyebrow">Training abgeschlossen</span><h1>{session.level === "basis" ? "Basiswissen sicher." : "Stark gearbeitet."}</h1><p>Du hast alle Aufgaben dieses Durchlaufs richtig gelöst{session.wrong.length ? " und Unsicherheiten verbessert" : ""}.</p>
  {session.word && <div className="word-card"><small>DEIN LÖSUNGSWORT</small><strong>{session.word}</strong><p>Nenne deiner Lehrkraft dieses Lösungswort.</p></div>}
  <div className="complete-actions"><button className="secondary" onClick={onHome}>Zur Übersicht</button>{session.level === "basis" && <button className="primary" onClick={() => onNextLevel("advanced")}>Vertieft weiterlernen <ArrowRight/></button>}{session.level === "advanced" && <button className="primary" onClick={() => onNextLevel("pro")}>Profi-Wissen starten <ArrowRight/></button>}</div></main><Footer/></div>;
}

function Footer(){return <footer><p>Entwickelt von Jan Hacker für die Staatliche Berufsschule 1 Bayreuth · Keine personenbezogenen Daten</p><p className="asset-credit">Dachgrafiken: <a href="https://commons.wikimedia.org/wiki/File:Dachformen.png" target="_blank" rel="noreferrer">Stilfehler / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a> · Gaubengrafiken: <a href="https://commons.wikimedia.org/wiki/File:Dachgauben_Dachkanten_2_simple_numbered.svg" target="_blank" rel="noreferrer">Roland Bergmann / Hietzinger Friedhof</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a> · Verfallungsgrafik: Uwe Reinsch Zimmerei, von der Lehrkraft bereitgestellt</p></footer>}

export function App() {
  const [entered, setEntered] = useState(false);
  const [competencyAccepted, setCompetencyAccepted] = useState(false);
  const [area, setArea] = useState<"choice" | "info" | "exam">("choice");
  const [progress, setProgress] = useState<Stored>(() => getStored());
  const [session, setSessionState] = useState<Session | null>(() => { try { return JSON.parse(sessionStorage.getItem(STORE) || "null"); } catch { return null; } });
  const setSession = (s: Session | null) => { setSessionState(s); if (s) sessionStorage.setItem(STORE, JSON.stringify(s)); else sessionStorage.removeItem(STORE); setProgress(getStored()); window.scrollTo({top:0, behavior:"smooth"}); };
  useEffect(() => { window.scrollTo({top: 0, behavior: "auto"}); }, [area]);
  const start = (mode: Mode, level: Level | "mixed") => setSession(createSession(mode, level, progress.review));
  const reset = () => { if (confirm("Möchtest du den lokalen Lernfortschritt wirklich zurücksetzen?")) { localStorage.removeItem(STORE + "-progress"); sessionStorage.removeItem(STORE); setProgress(emptyStored()); setSessionState(null); } };
  if (!entered) return <Welcome onEnter={() => setEntered(true)} />;
  if (area === "choice") return <><div aria-hidden={!competencyAccepted}><AreaChoice onInfo={() => setArea("info")} onExam={() => setArea("exam")}/></div>{!competencyAccepted && <CompetencyIntro onContinue={() => setCompetencyAccepted(true)}/>}</>;
  if (area === "info") return <InfoArea onBack={() => setArea("choice")}/>;
  return session ? <Quiz session={session} setSession={setSession} onHome={() => setSession(null)} onAreaChoice={() => setArea("choice")} onNextLevel={l => start("guided", l)}/> : <Home progress={progress} onStart={start} onReset={reset} onAreaChoice={() => setArea("choice")}/>;
}
