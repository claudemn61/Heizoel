# Heizöltank-PWA — Zusammenfassung der Sitzung

Stand: 16.11.2026 · App-Version **1.0.0** · letzter Commit `50d80d9` auf `main`

## 1. Ausgangslage und Ziel

Du hast eine fertige PWA zur Heizöltank-Verwaltung hochgeladen (`index.html`,
`sw.js`, Manifest, drei Icons). In der Sitzung wurde sie in ein eigenes
GitHub-Repo übernommen, mit deinen Originaldaten abgeglichen und um mehrere
Funktionen erweitert.

## 2. Aufbau der App

| Datei | Zweck |
|---|---|
| `index.html` | Die ganze App: Version/Changelog, Kernlogik, Oberfläche, Start |
| `sw.js` | Service Worker (Offline, Cache) |
| `manifest.webmanifest` | Installation als App |
| `icon-180/192/512.png` | Icons |
| `CLAUDE.md` | Projektregeln für Claude Code (analog Tauchbuch) |

`index.html` hat drei Script-Blöcke: Kernlogik ohne DOM (`PRIOR`, `DEFAULTS`,
`buildPoints/Intervals/Segments`, `fitK`, `simulate`, `analyze`), die
Oberfläche (Speicher, `render()`, fünf Tabs: Übersicht, Erfassen, Verlauf,
Analyse, Mehr) und den Start (Service Worker). Kein Build-Schritt, kein
Framework.

**Prognose:** Aus den Messpunkten wird ein Verbrauchsfaktor k bestimmt (neuere
Daten zählen stärker, Halbwertszeit ca. 2 Jahre). Damit wird der Füllstand mit
einem Monatsprofil in drei Szenarien weitergerechnet (normal, mild, kalt).
Daraus folgen Bestelltermin, Bestellmenge und die Termine «schwelle erreicht»,
«Reserve unterschritten» und «Tank leer».

## 3. Was in der Sitzung umgesetzt wurde

Alle Änderungen sind auf `main` und damit auf GitHub Pages.

| Commit | Änderung |
|---|---|
| `2cf937d` | Erstversion aus dem ZIP übernommen |
| `a096f53` | `CLAUDE.md` angelegt, Muster wie Tauchbuch |
| `77a954d` | Startdaten nach deiner Tabelle korrigiert und ergänzt |
| `55299b5` | Zeitachse: Beschriftungen nach verfügbarer Breite (Monate, dann Jahre) |
| `2615cf9` | «heute», «bestellen», «Lieferung» am rechten Rand nicht mehr abgeschnitten |
| `914374e` | Sicherung nur noch als Datei, «Datei laden» (Zwischenschritt) |
| `35f3b8b` | Backup-System wie Flugbuch, vorgeladene Daten entfernt |
| `8570bea` | Füllstand-Grafik zoombar mit Spreizgeste |
| `3b40fed` | Feld «Begründung der Korrektur» beim Ändern eines Eintrags |
| `8352dcc` | Service Worker lädt die Seite zuerst aus dem Netz |
| `3902ec4` | Zoom-Grafik: mit einem Finger verschieben |
| `87ef4a6` | Analyse: laufender Heizzyklus auch direkt nach einer Lieferung |
| `6369e00` | Lieferung planen: geplante Lieferung immer in der Grafik sichtbar |
| `50d80d9` | Versionierung eingeführt, `APP_VERSION` 1.0.0 mit Changelog |

### Funktionen im Einzelnen

- **Backup (Mehr):** «Backup sichern» erstellt `heizoel-backup-JJJJ-MM-TT.json.gz`
  (komprimiert) und öffnet das Teilen-Menü von iOS («In Dateien sichern»), sonst
  Download. «Backup importieren» liest `.json.gz` und `.json`, zeigt zuerst
  Anzahl Einträge und letztes Datum und ersetzt erst nach «Übernehmen».
  Ein Punkt an «Mehr» und am Sichern-Knopf zeigt Änderungen seit dem letzten
  Backup, die Kopfzeile zeigt Datum und Zeit des letzten Backups.
- **Zoom (Übersicht, Füllstand und Prognose):** zwei Finger zoomen (bis ca.
  3 Wochen), ein Finger verschiebt waagrecht, senkrecht scrollt die Seite.
  «Ganze Ansicht» setzt zurück; Trackpad-Pinch am Desktop.
- **Begründung bei Korrektur:** optionales Feld im Bearbeiten-Fenster, im
  Verlauf kursiv angezeigt, im Backup enthalten.
- **Zeitachsen:** Beschriftung passt sich der Breite an (Monate bis ca.
  2½ Jahre, darüber Jahre).
- **Lieferung planen:** Bezugsdatum ist das Ende der Heizperiode nach der
  Lieferung; die grüne Kurve ist immer sichtbar.
- **Analyse:** Zyklentabelle zeigt auch den laufenden Zyklus ohne Folgemessung.
- **Version und Changelog:** unten in «Mehr» aufklappbar.
- **Service Worker:** Seite network-first (offline aus dem Cache); die
  Cache-Version folgt automatisch aus `APP_VERSION` (`sw.js?v=…`).

## 4. Datenquellen

- **Hochgeladene Dateien:** `heizoel-pwa.zip` und `index.html` (Ausgangsstand).
- **Deine Tabelle «Käufe Heizöl» / «Verbrauch»** (Screenshots): Lieferungen
  2000–2026 mit Rest, Menge, Total und Preisen sowie die Ablesungen.
- **Gescanntes Tankbüchlein** (`Gescanntes_Dokument.pdf`): Originaleinträge der
  Tankfüllungen, zum Abgleich der Lieferungen.
- Die Daten liegen **nicht im Code**: Sie sind nur auf deinem iPhone
  (`localStorage`, Key `heizoel-tracker-v1`) und in deinen Backups. Ein
  Reset oder eine Neuinstallation startet leer.

## 5. Datenstand nach dem Abgleich

40 Einträge ausgewertet (24 Lieferungen, 16 Ablesungen), danach durch dich
geändert. Korrekturen gegenüber der ersten Tabellen-Version:

| Eintrag | Korrektur |
|---|---|
| Ablesung 08.11.26 | Datum 07.11.26 |
| Lieferung 12.11.26 | neu: Rest 1700, Menge 2152, Total 3852 |
| Lieferung 13.01.01 | Datum 13.02.2001 (bestätigt) |
| Lieferung 09.01.14 | Datum 29.01.2014 (bestätigt, Rest «ca 1400») |
| Lieferung 24.02.15 | Menge 3973, Total 5973 (bestätigt) |
| Lieferung 07.07.25 | Rest 700, Menge 5275, Total **5975** (bestätigt) |
| Ablesung 15.02.26 | 3050 statt 4050, mit Begründung (von dir in der App) |
| Ablesung 31.08.25 | von dir gelöscht (Ausreisser 14.9 l/Tag im Sommer) |

Lieferungen 2000–2020 (19 Stück) aus «Käufe Heizöl» nachgetragen. Die
Lieferungen 14.08.03, 26.01.06 und 10.10.06 hast du bestätigt.

## 6. Entscheidungen

- **Repo:** `claudemn61/Heizoel` (GitHub erlaubt kein «ö»), Pages von `main`,
  Ordner `/ (root)`.
- **Patch-Stufe «keine Versionen» bis zur Einführung von 1.0.0:** Datenkorrekturen
  und Diagramm-Fixes liefen bewusst ohne Versionsnummer; ab 1.0.0 gilt: jede
  Stufe erhöht `APP_VERSION` + Changelog.
- **Backup nur als Datei**, Text-Export/-Import entfernt, komprimiert wie bei
  Flugbuch. Bestätigungsschritt vor dem Ersetzen bleibt (anders als Flugbuch).
- **Keine vorgeladenen Daten mehr** im Code; Daten kommen per Backup.
- **15.02.26 = 3050 l** (Ablesefehler von 1000 l, vom Modell gestützt).
- **07.07.25:** 5975 l ist der Gesamtbestand; die Ablesung vom 31.08.25 (5158)
  wurde danach gelöscht.
- **Sprache GitHub:** Heizoel erscheint als «HTML» (Code in `index.html`);
  bewusst so gelassen.
- **Alte Einträge ohne Rest** (z. B. 04.10.2001, Rest 1500 aus der Tabelle,
  im Büchlein leer) bleiben als Schätzung stehen.

## 7. Offene Punkte

- **Frisches Backup sichern** nach den Datenkorrekturen («Mehr → Backup sichern»).
- **Preise pro Lieferung** (Tabelle «Käufe Heizöl», Preis/100 l und Total) sind
  nicht in der App; sie kennt nur den festen Preis aus den Einstellungen.
- **Winter 2025/26:** Verbrauch zwischen 15.02. und 22.03.26 ist mit 3.7 l/Tag
  niedrig (130 l); beim 22.03.26 (2920 l) ist unklar, ob er stimmt.
- **Sommer 2025:** Nach dem Löschen des 31.08.25 gibt es für Juli bis August
  keine Messung mehr.
- **Nicht auf dem iPhone geprüft:** Das Teilen-Menü von iOS und die Zwei-Finger-Gesten
  wurden nur im Browser simuliert, nicht auf einem echten iPhone geprüft.
- **Eigene Hilfe-Seite** gibt es nicht (bei Minor entfällt das Nachführen).
- **`.gitattributes`** für Sprache «JavaScript» wurde nicht angelegt.

## 8. Wo liegt was

| Was | Ort |
|---|---|
| Quellcode | GitHub `claudemn61/Heizoel`, Branch `main` (Entwicklungsbranch `claude/eloquent-gauss-jkar1b` identisch) |
| Arbeitskopie (Sitzung) | `/home/user/heizoel` |
| Veröffentlichte App | GitHub Pages: `https://claudemn61.github.io/Heizoel/` (genaue Schreibweise unter Settings → Pages) |
| Deine Daten | iPhone (`localStorage`) und Backup-Dateien in «Dateien»/iCloud Drive |
| Update-Dateien (nicht nötig) | Scratchpad der Sitzung: `heizoel-update.json`, `heizoel-update-ohne-31-08-25.json` |
| Projektregeln | `CLAUDE.md` im Repo |
| Schwester-Projekte | `claudemn61/Tauchbuch`, `claudemn61/Flugbuch` (Backup-Muster übernommen) |

## 9. Hinweise für die weitere Arbeit

- Vor jeder Änderung fragt Claude nach der Versionsstufe, ausser bei «V-».
- Nach jeder Änderung: `node --check` auf die Script-Blöcke, Test im Browser mit
  echten Daten aus einem Backup, dann Commit, Push auf den Feature-Branch,
  Merge nach `main`.
- Das `<svg>` des Füllstand-Diagramms nicht mehr auf `host.innerHTML` umbauen,
  sonst brechen die Touch-Gesten ab.
- Neue Felder in Einträgen immer in `normalize()` ergänzen, neue Einstellungen
  in `DEFAULTS`, sonst gehen sie beim Import verloren.
