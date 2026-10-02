# LipariBank Digital Channels — Backend API

Backend del progetto _LipariBank Digital Channels_, sviluppato durante la Node.js Academy.

**Stack:** Node.js 22 LTS · TypeScript · ESLint + Prettier · PostgreSQL 16 in Docker · dotenv

## Prerequisiti

- Node.js 22 installato con nvm (la versione è in `.nvmrc`)
- Docker Desktop con Docker Compose v2
- Git

## Avvio rapido

```bash
git clone <url-del-repository>
cd liparibank-digital-channels

nvm use 22                  # Node 22 dal file .nvmrc
npm ci                      # installa le dipendenze esatte di package-lock.json

cp .env.example .env        # Windows: Copy-Item .env.example .env
# Nel .env imposta POSTGRES_PASSWORD e usa la stessa password in DATABASE_URL

docker compose up -d db     # avvia PostgreSQL 16
npm run dev                 # avvia l'applicazione in modalità sviluppo
```

## Database

PostgreSQL 16 gira in Docker (servizio `db` in `docker-compose.yml`). Le credenziali sono lette dal file `.env`, mai dal repository. I dati restano nel volume `pgdata` anche quando il container viene ricreato.

| Parametro | Valore                     |
| --------- | -------------------------- |
| Host      | `localhost`                |
| Porta     | `5432`                     |
| Database  | `liparibank`               |
| Utente    | `liparibank`               |
| Password  | quella impostata in `.env` |

La porta è esposta solo su `127.0.0.1`: il database è raggiungibile da questo PC, non dalla rete.

| Comando                     | Cosa fa                                      |
| --------------------------- | -------------------------------------------- |
| `docker compose up -d db`   | Avvia il database                            |
| `docker compose ps`         | Mostra lo stato (deve essere `healthy`)      |
| `docker compose logs -f db` | Mostra i log                                 |
| `docker compose down`       | Ferma e rimuove il container, i dati restano |
| `docker compose down -v`    | Cancella anche i dati                        |

## Script npm

| Script              | Cosa fa                                                    |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Esegue `src/index.ts` con tsx e lo riavvia a ogni modifica |
| `npm run build`     | Compila TypeScript in `dist/`                              |
| `npm start`         | Esegue la versione compilata                               |
| `npm run typecheck` | Controlla i tipi senza compilare (tsx non lo fa)           |
| `npm run lint`      | Analisi statica con ESLint                                 |
| `npm run format`    | Formatta il codice con Prettier                            |

## Struttura

```text
src/
├── types/          # Interfacce, enum, DTO
├── utils/          # Utility (validatori, formatter)
├── routes/         # Route Express
├── controllers/    # Controller
├── services/       # Business logic
├── repositories/   # Accesso ai dati
├── middleware/     # Middleware Express
└── index.ts        # Entry point
tests/              # Test
```

## Project Work — Giorno 0

| Requisito                                                    | Dove è soddisfatto                                                                                                                |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Node.js 22 LTS via nvm                                       | `.nvmrc`; `node -v` → `v22.x`                                                                                                     |
| `docker compose up -d db` avvia Postgres 16 sulla 5432       | `docker-compose.yml`: servizio `db`, immagine `postgres:16-alpine`, porta `5432`, volume persistente `pgdata`                     |
| Credenziali in `.env`                                        | `docker-compose.yml` legge `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` da `.env`; nel repository c'è solo `.env.example` |
| Connessione al DB da client esterno                          | DBeaver o psql su `localhost:5432`, database `liparibank`                                                                         |
| `.gitignore` che esclude `.env` e `node_modules/`            | `.gitignore` (esclude anche `dist/` e `coverage/`)                                                                                |
| Primo commit `G0: setup ambiente, Docker Postgres, repo git` | `git log`                                                                                                                         |
