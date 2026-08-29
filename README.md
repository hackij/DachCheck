# DachCheck

DachCheck ist eine offline-fähige Lern-Web-App für Auszubildende im Spengler-/Klempnerhandwerk (11. Jahrgangsstufe). Sie trainiert die visuelle Erkennung von Dachformen, Dachvarianten, Gauben und Dachteilen in drei didaktisch getrennten Niveaus.

## Starten

```bash
npm install
npm run assets
npm run dev
```

Produktionsprüfung:

```bash
npm test
npm run build
```

Hinweis: Der aktuelle Ordnername enthält ein `#`. Vite 8 warnt deshalb im Dev-Server. Der Produktionsbuild funktioniert. Falls der Dev-Server den Einstieg nicht auflöst, den Ordner in einen Namen ohne `#` verschieben oder `dist` nach `npm run build` statisch ausliefern.

## Inhalte pflegen

Alle Fragen stehen in `src/data/questions.ts`. Jede Zeile enthält ID, Niveau, Kategorie, Visual-Schlüssel, Fragetext, vier Antworten (die erste ist intern die richtige), Erklärung und Hinweis. Die UI mischt die Antworten bei jeder Session.

1. **Neue Frage:** Seed in `src/data/questions.ts` ergänzen und eine eindeutige ID vergeben.
2. **Bild austauschen:** Eigenes SVG/PNG unter `public/images/questions/ID.svg` ablegen. Wenn der Generator weiter benutzt wird, zuerst einen passenden Visual-Fall in `tools/generate-assets.ts` ergänzen.
3. **Anzahl je Durchlauf:** `COUNT` in `src/App.tsx` ändern; gemischtes Training wird in `createSession` konfiguriert.
4. **Lösungswort ändern:** `WORDS` in `src/App.tsx` bearbeiten. Für den Basisdurchlauf müssen Wortlänge und `COUNT.basis` übereinstimmen.
5. **Neues Lösungswort:** Großgeschrieben und ohne Sonderzeichen zu `WORDS` hinzufügen.
6. **Neue Dachform:** Frage ergänzen, eindeutigen Visual-Schlüssel definieren und die SVG-Geometrie im Generator hinterlegen.
7. **Bildquelle:** `source` und `sourceLicense` am Datensatz pflegen; fremde Assets zusätzlich in `CONTENT_SOURCES.md` eintragen.
8. **Niveau zuordnen:** `basis`, `advanced` oder `pro` verwenden. Basis = Mindestkompetenz, advanced = Merkmalsvergleich, pro = begründeter Transfer.

Nach Inhaltsänderungen immer `npm run assets && npm test && npm run build` ausführen.

## Architektur

- `src/data/questions.ts` – zentraler Pool mit 60 Aufgaben
- `src/App.tsx` – Modi, Quiz, Fortschritt, Wiederholung und Lösungswort
- `src/styles.css` – responsives Designsystem
- `tools/generate-assets.ts` – deterministische SVG-Bildbibliothek
- `tests/questions.test.ts` – Daten- und Assetvalidierung
- `public/images` – alle lokalen Assets

Es gibt kein Backend, keine Accounts, keine Tracker und keine personenbezogenen Lerndaten. Der Zustand liegt ausschließlich im Browser (`sessionStorage` für den laufenden Durchgang, `localStorage` für sicheren Fortschritt und Wiederholungsbedarf).
