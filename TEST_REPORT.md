# Testbericht

## Automatisiert

Ausgeführt am 23.08.2026:

- `npm run assets` – 60 SVGs erzeugt
- `npm test` – 60 IDs, Bildpfade, Antwortmengen, Duplikate, Erklärungen und Niveaustückzahlen bestanden
- `npm run build` – TypeScript und Vite-Produktionsbuild bestanden

## Browser-Smoke-Test

- Startseite lädt vollständig, Hero und Niveaukarten sichtbar
- geführter Basisweg startet mit 1/9 und verdecktem Lösungswort
- falsche Antwort: kein Weiter, kurzer Hinweis, erneute Wahl möglich
- anschließende richtige Antwort: Fachinfo sichtbar, Weiter aktiv
- Smartphone-Breakpoint: einspaltige Quizkarte, große Antwortziele, kein dokumentweiter horizontaler Overflow
- DOM-Prüfung: semantische Überschriften, Status/Alert, deaktivierte Zustände

## Bekannte technische Notiz

Vite 8 warnt wegen des `#` im übergeordneten Workspace-Pfad. Der Produktionsbuild ist erfolgreich. Für störungsfreien Dev-Betrieb ist ein Ordnername ohne `#` empfehlenswert; alternativ `dist` statisch ausliefern.
