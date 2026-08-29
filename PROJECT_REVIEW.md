# Projekt- und Rollenreview

Stand: 23.08.2026

## 1. Product Owner / didaktische Konzeption

Umgesetzt wurden vier Lernwege, klare Niveaustrennung, sichtbarer lokaler Fortschritt, Wiederholung ohne Zeitdruck und das Basis-Lösungswort als Mindestziel. Profi-Aufgaben verlangen überwiegend Begründung oder Mehrfachanalyse. Ein Basisblock mit neun Aufgaben bleibt realistisch in einer Unterrichtsphase abschließbar.

## 2. Fachredaktion Spenglertechnik

Der Pool umfasst 60 Aufgaben: 27 Basis, 18 Vertiefung, 15 Profi. Kernbegriffe entsprechen dem Projektauftrag; gängige Grundformen wurden gegen BauNetz Wissen geprüft. Unsicherheit: die spezifischen Darstellungen „Walmdach einseitig mit Giebel“, „Walmdach abgeschrägt“ und „Fußwalmdach mit Krüppelwalm“ benötigen vor prüfungsrelevantem Einsatz den Abgleich mit den nicht im Workspace vorhandenen Originalarbeitsblättern. Sie bleiben deshalb didaktische Trainingsdarstellungen, nicht normsetzende Referenzen.

## 3. UX/UI Design

Übernommen wurden Farbwelt, Systemschrift, ruhige technische Karten, große Radien, Schatten, Fokusfarbe und Blau/Grün-Akzente der Planer-Apps. Die Oberfläche ist bewusst kein Dashboard: Startbild, Lernwegkarten und vor allem die große Aufgabenabbildung führen die Hierarchie.

## 4. Accessibility Review

- semantische Buttons, Überschriften und `aria-live`-Feedback
- sichtbarer gelber Tastaturfokus
- Feedback nicht ausschließlich über Farbe (Icon + Text)
- Antwortziele ca. 58–62 px hoch
- Alttexte und SVG-Titel/Descriptions
- einspaltiges Layout unter 900 px, keine horizontale Seitenüberbreite im schmalen Test

Behoben: Weiter-Button ist bis zur korrekten Antwort tatsächlich deaktiviert; Bildfehler zeigen ein lokales Fallback.

## 5. App-Tester

Bestanden: Start, Bilder, Fragedaten, vier eindeutige Optionen, zufällige Reihenfolgen, falsche/richtige Rückmeldung, keine Buchstabenvergabe bei Fehler, Weiter-Sperre, lokaler Refreshzustand, alle Modi, responsive Ansichten und Produktionsbuild. Browser-Smoke-Test bestätigte Fehler → Hinweis → Korrektur → Fachfeedback.

## 6. Fachlicher Reviewer

Alle Fragen wurden strukturell gegen Bildschlüssel, Antwort, Distraktoren, Niveau, Hinweis und Kurzdefinition geprüft. Eine fehlerhafte Zuordnung der Fledermaus-Vergleichsgrafik und eine zu einfache Grafik für die kombinierte Dachlandschaft wurden in der Review behoben.

## 7. Didaktischer Reviewer

Basis ist als Mindeststandard und Lösungswortweg erkennbar. Vertiefung fokussiert Unterscheidungsmerkmale. Profi enthält Transfer statt nur schwerere Begriffe. Fehlerfeedback nennt ein Beobachtungskriterium und erlaubt selbstständige Korrektur.

## 8. UX Reviewer

Die Aufgabe, das Niveau und der Fortschritt sind sofort erkennbar. Desktop zeigt Bild und Antworten nebeneinander; Tablet/Smartphone stapeln sie. Nebentexte wurden kurz gehalten. Das Bild bleibt dominant.

## 9. Senior Code Review

Fragen sind vom UI getrennt, vollständig typisiert und zentral erweiterbar. Session- und Lernfortschritt sind getrennt. Zufälligkeit wird je Session eingefroren, damit ein Render die Antworten nicht neu sortiert. `solved` verhindert Doppelwertung. Fehlende Assets besitzen ein Fallback.

## 10. Robustness Review

Abgefangen sind ungültiger lokaler JSON-Zustand, leerer Wiederholungspool, fehlende Bilder, schnelles Mehrfachklicken, Refresh und zu wenige Wiederholungsfragen. Das Lösungswort stammt aus einer festen Liste und passt mit neun Zeichen zur Basisblocklänge.

## 11. Finale Regression / visuelle Kontrolle

`npm test` und `npm run build` bestanden. Geprüft wurden Startseite, Basisquiz, falsche Antwort, richtige Antwort und Smartphone-Einspaltenlayout. Keine Console Errors, leeren Karten oder abgeschnittenen Kernbuttons festgestellt.

## Offene fachliche Freigabe

Da die ursprünglichen Arbeitsblätter nicht als Dateien vorlagen, ist deren Terminologie nur über den Projektauftrag abgebildet. Vor dem verbindlichen Unterrichtseinsatz sollte die Lehrkraft die drei oben markierten Spezialvarianten und die genaue regionale Verwendung von „Verfallgrat/Verfallung“ visuell gegen das Arbeitsblatt freigeben.
