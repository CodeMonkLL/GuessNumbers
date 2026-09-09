# Zahlenraten

## Schnellstart

```bash
docker compose up -d --build
```

Anwendung: http://localhost:3000

## Aufbau

Drei Container in einem Compose-Netzwerk (`app-network`):

```
mysql_db   MySQL, Schema und Testdaten aus db/init.sql
backend    Flask-API auf Port 5000
frontend   NestJS auf Port 3000
```

Swagger-UI: http://localhost:5000/apidocs

### Läuft wirklich alles?

```bash
docker compose ps -a
```

So sieht es richtig aus:

```
SERVICE    STATUS                  PORTS
mysql_db   Up (healthy)            0.0.0.0:3306->3306/tcp
backend    Up                      0.0.0.0:5000->5000/tcp
frontend   Up                      0.0.0.0:3000->3000/tcp
```

## Befehle

```bash
docker compose up -d --build      # starten (nach Code-Aenderungen)
docker compose up -d              # starten (ohne Neubau, schneller)
docker compose down               # stoppen, Daten bleiben erhalten
docker compose down -v            # stoppen und Datenbank loeschen
docker compose logs -f backend    # Logs des Backends mitlesen
docker compose logs -f frontend   # Logs des Frontends mitlesen
```

**`--build` nicht vergessen**, wenn Dateien geändert wurden, die per
`COPY` ins Image wandern. Es gibt keinen Volume-Mount. Änderungen am
Frontend brauchen also einen Neubau.

## Aufbau des Codes

### backend/

Vier Schichten, von aussen nach innen:
```
controller   -> nur HTTP. Kein SQL, keine Spielregeln.
service      -> Spielregeln und Ablauf. Kennt Flask nicht.
persistence  -> nur SQL. Kennt die Regeln nicht.
model        -> reine Daten, die zwischen den Schichten wandern.
```

Aufrufe gehen ausschliesslich nach unten: 
Ein Controller darf einen Service rufen, ein Service ein Repository. Nie umgekehrt.

`app.py` liegt daneben und ist der Einstiegspunkt, er baut die Flask-App
zusammen und registriert die Blueprints.

## Schema ändern

Nach jeder Schema-Änderung:

```bash
docker compose down -v && docker compose up -d --build
```
