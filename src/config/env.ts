// Configurazione centralizzata: è l'unico punto dell'applicazione che legge process.env.
// Le variabili vengono validate all'avvio (fail-fast): se manca qualcosa o un valore non è valido,
// l'applicazione si ferma subito con un messaggio chiaro, invece di fallire più tardi in produzione.
import "dotenv/config";
import { inspect } from "node:util";

const NODE_ENVS = ["development", "test", "production"] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];

const DEFAULT_PORT = 3000;
const DEFAULT_CORS_ORIGIN = "http://localhost:5173"; // frontend React in sviluppo (Vite)

// Gli errori vengono raccolti tutti, così si correggono in una volta sola
const errors: string[] = [];

function isNodeEnv(value: string): value is NodeEnv {
  return (NODE_ENVS as readonly string[]).includes(value);
}

function readPort(): number {
  const raw = process.env.PORT?.trim();
  if (!raw) return DEFAULT_PORT;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.push(`PORT deve essere un intero tra 1 e 65535 (trovato "${raw}")`);
  }
  return port;
}

function readNodeEnv(): NodeEnv {
  const raw = process.env.NODE_ENV?.trim() || "development";
  if (!isNodeEnv(raw)) {
    errors.push(`NODE_ENV deve essere uno tra ${NODE_ENVS.join(", ")} (trovato "${raw}")`);
    return "development";
  }
  return raw;
}

function readDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    errors.push("DATABASE_URL mancante: copia .env.example in .env e completala");
    return "";
  }
  // Nei messaggi non si riporta mai il valore: contiene la password del database
  if (!URL.canParse(raw)) {
    errors.push("DATABASE_URL non è un URL valido");
  } else if (!["postgresql:", "postgres:"].includes(new URL(raw).protocol)) {
    errors.push("DATABASE_URL deve iniziare con postgresql://");
  }
  return raw;
}

function readCorsOrigin(): string {
  const raw = process.env.CORS_ORIGIN?.trim() || DEFAULT_CORS_ORIGIN;
  // "*" autorizzerebbe qualunque sito a chiamare le API: in banca non è accettabile
  if (raw === "*" || !URL.canParse(raw) || !["http:", "https:"].includes(new URL(raw).protocol)) {
    errors.push(
      `CORS_ORIGIN deve essere l'URL del frontend, per esempio ${DEFAULT_CORS_ORIGIN} (trovato "${raw}")`,
    );
  }
  return raw;
}

/** URL con la password sostituita da asterischi, da usare nei log */
function redactUrl(raw: string): string {
  const url = new URL(raw);
  if (url.password) url.password = "****";
  return url.toString();
}

const port = readPort();
const nodeEnv = readNodeEnv();
const dbUrl = readDatabaseUrl();
const corsOrigin = readCorsOrigin();

if (errors.length > 0) {
  throw new Error(`Configurazione non valida:\n  - ${errors.join("\n  - ")}`);
}

function redacted() {
  return { port, nodeEnv, dbUrl: redactUrl(dbUrl), corsOrigin };
}

export const env = Object.freeze({
  port,
  nodeEnv,
  dbUrl,
  corsOrigin,
  // console.log(env) e JSON.stringify(env) mostrano la password mascherata; env.dbUrl resta quello vero
  [inspect.custom]: redacted,
  toJSON: redacted,
} as const);

export type Env = typeof env;
