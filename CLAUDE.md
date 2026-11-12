# Heizöl — Projektkontext für Claude Code

Heizöltank-Verwaltung als PWA von claudemn61: Füllstand, Verbrauch,
Bestelltermin und Bestellmenge. Gleicher Autor wie die Schwester-Projekte
`Tauchbuch` und `Flugbuch`.

## Sprache & Stil

- **Alle Code-Kommentare, Commit-Messages und Antworten an mich: Deutsch, Schweizer
  Rechtschreibung** (z.B. "ss" statt "ß").
- Kurze, direkte Antworten bevorzugt. Ich melde mich meist mit kurzen Korrekturen
  ("Missverständnis: ...") statt langen Erklärungen — dann bitte den vorherigen
  Schritt korrigieren, nicht neu diskutieren.
- Kürzel in meinen Nachrichten: **"V-"** heisst "Version so belassen, kein Bump
  nötig" (wie explizites "nichts"/"keine Version").

## Tech-Stack

- **Kein Build-Schritt, kein Framework**: Vanilla JS, HTML wird per
  Template-Strings und `innerHTML` gerendert. Die ganze App steckt in
  `index.html`.
- Deployment: GitHub Pages direkt vom `main`-Branch, Ordner `/ (root)` (kein
  GitHub-Actions-Workflow — Push auf `main` deployt automatisch).
- Persistenz: `localStorage`, Key `heizoel-tracker-v1`, Zustand
  `{ v:1, events:[...], settings:{...} }`. Läuft die App als Claude-Artifact,
  wird zusätzlich über `claude.use('db')` ins Konto synchronisiert
  (`initDb`/`pushDb`, Dokument `data/users/<id>/heizoel`).
- Ereignisse: `type:'read'` (`date`, `level`) und `type:'fill'` (`date`,
  `before`, `vol`, `after`). `normalize()` ist die einzige Stelle, die
  geladene/importierte Daten bereinigt — neue Felder dort ergänzen, sonst gehen
  sie beim Laden/Import verloren.
- Backup (analog Flugbuch), Tab «Mehr»: «Backup sichern» (`onAct('download')`)
  schreibt `{v, exportedAt, events, settings}` gzip-komprimiert als
  `heizoel-backup-JJJJ-MM-TT.json.gz`, bevorzugt über das Teilen-Menü (iOS «In
  Dateien sichern»), sonst als Download. «Backup importieren» (`onFile`) liest
  `.json.gz` und unkomprimiertes `.json` (Erkennung über gzip-Magic-Bytes) und
  ersetzt die Daten erst nach «Übernehmen». Neue Einstellungen gehören in
  `DEFAULTS`, damit sie automatisch im Backup landen.
- Backup-Status (nicht Teil des Backups): `heizoel-lastBackupAt` (Anzeige im
  Kopf) und `heizoel-backupDirty` (Punkt an «Mehr» und «Backup sichern»).
  `persist()` setzt «geändert», Sichern und Import setzen es zurück.
- Es gibt **keine vorgeladenen Daten** mehr im Code: eine neue Installation
  startet leer und wird per «Backup importieren» befüllt.

## Aufbau `index.html`

| Script-Block | Inhalt |
|---|---|
| 1. Kernlogik (ohne DOM, testbar) | `PRIOR`, `DEFAULTS`, `buildPoints/Intervals/Segments`, `fitK`, `simulate`, `analyze` |
| 2. UI (IIFE) | Speicher, `render()`, Tabs `home`/`add`/`log`/`analysis`/`more`, SVG-Diagramme, Sheet, Aktionen |
| 3. Start | Service-Worker-Registrierung, `navigator.storage.persist()` |

Weitere Dateien: `sw.js` (Service Worker), `manifest.webmanifest`,
`icon-180.png`, `icon-192.png`, `icon-512.png`.

## Service Worker / Cache

- `sw.js` liefert eigene Dateien **cache-first mit Hintergrund-Aktualisierung**.
  Ohne Änderung an `VER` sehen Nutzer eine neue Version erst beim zweiten Laden.
- Deshalb bei **jeder ausgelieferten Änderung** `VER` in `sw.js` erhöhen
  (`heizoel-v1` → `heizoel-v2` …). Neue Dateien zusätzlich in `SHELL` eintragen.

## Versionierung

- **Patch** = Bugfix, **Minor** = neues Feature, **Major** = Architekturänderung.
- **Vor jeder Code-Änderung fragen**, welche Stufe zutrifft (ausser ich sage explizit
  "nichts"/"keine Version"/"V-").
- Aktuell gibt es noch kein `APP_VERSION` und keinen Changelog in der App —
  einzige Versionsmarke ist `VER` in `sw.js` (siehe oben).

## Git-Workflow

- Nach Abschluss einer Änderung **immer ungefragt**: committen, auf den
  Feature-Branch pushen, nach `main` mergen und pushen. Kein Nachfragen mehr,
  ob auf `main` gepusht werden soll.

## Vorgehen bei Änderungen

- Nach jeder Änderung: **Syntax wirklich prüfen**, nicht nur vermuten — die
  Script-Blöcke extrahieren und z.B. mit `node --check` verifizieren, bevor
  etwas ausgeliefert wird.
- Bei Berechnungen (Verbrauch, Prognose, Bestelltermin): mit den echten Daten
  aus einem Backup-Export testen, nicht nur mit erfundenen
  Beispieldaten. Die Kernlogik (Block 1) läuft ohne DOM und lässt sich direkt
  in Node ausführen.
- **Konsistenz über Tabs hinweg** ist mir wichtig — wenn ich "identisch auch für
  X/Y/Z" sage, meine ich das wörtlich: gleiche Struktur, gleiche Optik, nicht
  nur sinngemäss ähnlich.
- Bei mehrdeutigen Anfragen lieber kurz nachfragen (max. 1–2 gezielte Fragen) als
  eine aufwändige Änderung in die falsche Richtung zu bauen.

## Nicht tun

- Keine neuen Abhängigkeiten/Build-Tools einführen — bewusst kein Build-Schritt.
- Keine automatischen "smarten" Sortierungen oder Automatismen einbauen, wenn
  nicht explizit gewünscht — lieber eine neutrale Standardeinstellung und die
  Wahl dem Nutzer überlassen.
