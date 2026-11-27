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

| Script              | Cosa fa                                                     |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Esegue `src/server.ts` con tsx e lo riavvia a ogni modifica |
| `npm run build`     | Compila TypeScript in `dist/`                               |
| `npm start`         | Esegue la versione compilata (`dist/server.js`)             |
| `npm run typecheck` | Controlla i tipi senza compilare (tsx non lo fa)            |
| `npm run lint`      | Analisi statica con ESLint                                  |
| `npm run format`    | Formatta il codice con Prettier                             |

## Struttura

Un modulo per ogni contesto del dominio (bounded context): tutto ciò che riguarda i conti sta in `modules/account/`.

```text
src/
├── config/
│   └── env.ts             # Configurazione centralizzata, validata all'avvio
├── types/                 # Tipi condivisi (Account, Customer, Transaction, ApiResponse) e declaration merging
├── modules/
│   └── account/
│       ├── account.controller.ts
│       ├── account.service.ts
│       ├── account.repository.ts
│       ├── account.routes.ts
│       └── account.types.ts
├── middleware/            # Middleware custom
├── utils/                 # Helper trasversali (validatori)
├── app.ts                 # Istanziazione Express
└── server.ts              # Bootstrap + listen
tests/                     # Test
esercizi/                  # Esercizi consegnati come progetti a sé
```

I file di `modules/account/` e `app.ts` sono ancora segnaposto: il codice Express arriva dal Giorno 3.

## Configurazione

Tutte le variabili d'ambiente si leggono in un solo punto, `src/config/env.ts`, che le valida all'avvio. Se manca `DATABASE_URL` o un valore non è valido, l'applicazione **non parte** ed elenca tutti i problemi insieme:

```text
Error: Configurazione non valida:
  - PORT deve essere un intero tra 1 e 65535 (trovato "99999")
  - DATABASE_URL deve iniziare con postgresql://
```

| Variabile      | Obbligatoria | Predefinita             | Note                                          |
| -------------- | ------------ | ----------------------- | --------------------------------------------- |
| `DATABASE_URL` | sì           | —                       | `postgresql://…`                              |
| `PORT`         | no           | `3000`                  | intero tra 1 e 65535                          |
| `NODE_ENV`     | no           | `development`           | `development`, `test` o `production`          |
| `CORS_ORIGIN`  | no           | `http://localhost:5173` | URL del frontend autorizzato; `*` è rifiutato |

Il resto del codice usa l'oggetto `env`, tipizzato, `as const` e congelato con `Object.freeze`:

```ts
import { env } from "./config/env.js";
env.port; // number
env.nodeEnv; // "development" | "test" | "production"
```

`console.log(env)` e `JSON.stringify(env)` mostrano la password del database mascherata (`postgresql://liparibank:****@…`), così non finisce nei log. `env.dbUrl` contiene il valore vero.

## Avanzamento del corso

| Giorno | Contenuto                                                                                                             | Dove                                                                       |
| ------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 0      | Setup: Node.js 22, TypeScript, ESLint, Prettier, PostgreSQL in Docker                                                 | Tutto il progetto                                                          |
| 1      | Modello del dominio tipizzato: interfacce, enum e DTO per conti, clienti e bonifici; validatori, `isValidTransaction` | `src/types/`, `src/utils/`                                                 |
| 1      | Broken Project (dallo zip del corso, con un commit per ogni correzione)                                               | [`esercizi/giorno-01-broken-project/`](esercizi/giorno-01-broken-project/) |
| 1      | Project Work: struttura a moduli, TypeScript strict, tooling, configurazione validata                                 | `src/config/env.ts`, `src/modules/`, `tsconfig.json`, `package.json`       |

## Esercizi

Ogni cartella in `esercizi/` è un progetto indipendente, con il proprio `package.json`: si installa e si esegue dalla sua cartella. I commit originali sono conservati nella cronologia del repository.

```bash
cd esercizi/giorno-01-broken-project
npm ci
npm run typecheck
npx tsx src/feature.ts
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

## Project Work — Giorno 1

| Requisito                                                                                      | Dove è soddisfatto                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Struttura directory canonica                                                                   | `src/config/`, `src/types/`, `src/modules/account/` (5 file), `src/middleware/`, `src/utils/`, `src/app.ts`, `src/server.ts`; i file senza codice contengono `export {};` |
| `typescript`, `tsx`, `@types/node`, `eslint@^9`, `@eslint/js`, `typescript-eslint`, `prettier` | `devDependencies` in `package.json`                                                                                                                                       |
| `tsconfig.json` strict                                                                         | `strict`, `noUncheckedIndexedAccess`, `target: ES2022`, `module: NodeNext`, `outDir: ./dist`, `rootDir: ./src`                                                            |
| `eslint.config.js` (flat config) e `.prettierrc`                                               | root del progetto                                                                                                                                                         |
| Script `dev`, `build`, `start`, `typecheck`, `lint`, `format`                                  | `package.json`                                                                                                                                                            |
| `src/config/env.ts` con fail-fast                                                              | Lancia un'eccezione se manca `DATABASE_URL` o un valore non è valido; esporta `env` tipizzato e `as const` con `port`, `nodeEnv`, `dbUrl`, `corsOrigin`                   |
| `.env.example` committato, `.env` ignorato                                                     | `.env.example`, `.gitignore`                                                                                                                                              |
| Verifica                                                                                       | `npm run typecheck` e `npm run lint` senza errori; `npm run dev` avvia `src/server.ts`, che stampa `env`                                                                  |
| Commit `G1: struttura progetto, TypeScript strict, tooling, env config`                        | `git log`                                                                                                                                                                 |
