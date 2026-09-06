# Zahlenraten 


## Schnellstart

### Schritt 1: Hochfahren

```bash
docker compose up -d --build
```

Compose startet die beiden Container in der richtigen Reihenfolge und
wartet dabei ab:

```
db  (wartet bis MySQL antwortet)  ->  app  (legt fehlende Tabellen an)
```

### Schritt 2: Öffnen

http://localhost:5000

Fertig. Wenn die Startseite kommt, läuft alles.

### Läuft wirklich alles?

```bash
docker compose ps -a
```

So sieht es richtig aus:

```
SERVICE   STATUS
app       Up
db        Up (healthy)
```

## Befehle

```bash
docker compose up -d --build      # starten (nach Code-Aenderungen)
docker compose up -d              # starten (ohne Neubau, schneller)
docker compose down               # stoppen, Daten bleiben erhalten
docker compose down -v            # stoppen und Datenbank loeschen
docker compose logs -f app        # Logs der App mitlesen
```

**`--build` nicht vergessen**, wenn Dateien geändert wurden, die per
`COPY` ins Image wandern.

## Aufbau des Codes

Der Code unter `backend/` ist in vier Schichten geteilt, von aussen nach
innen:

```
controller   -> nur HTTP. Kein SQL, keine Spielregeln.
service      -> Spielregeln und Ablauf. Kennt Flask nicht.
persistence  -> nur SQL. Kennt die Regeln nicht.
model        -> reine Daten, die zwischen den Schichten wandern.
```

Aufrufe gehen ausschliesslich nach unten: ein Controller darf einen Service
rufen, ein Service ein Repository. Nie umgekehrt.

`app.py` liegt daneben und ist der Einstiegspunkt - er baut die Flask-App
zusammen und registriert die Blueprints.

## Schema ändern

Nach jeder Schema-Änderung:

```bash
docker compose down -v && docker compose up -d --build
```

Wenn gar nichts mehr geht:

```bash
docker compose down -v
docker compose up -d --build
```

