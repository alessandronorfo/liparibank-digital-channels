# Broken Project — Giorno 1: TypeScript Fondamentale

## Istruzioni
1. `npm install`
2. Esegui ogni file bug con `npx tsx src/bug1.ts`, `npx tsx src/bug2.ts`, ecc.
3. Leggi i sintomi, trova il bug, correggilo.
4. La feature opzionale è in `src/feature.ts` — completala.

## Bug 1 — 🔴 Errore di compilazione
**Sintomi**: errore TypeScript, l'app non parte.
**File**: `src/bug1.ts`
**Compito**: leggi l'errore del compilatore e correggi il valore non valido.

## Bug 2 — 🟡 Proprietà `undefined` non gestita
**Sintomi**: compila ma crasha a runtime con `Cannot read properties of undefined`.
**File**: `src/bug2.ts`
**Compito**: gestisci correttamente il campo opzionale `phone`.

## Bug 3 — 🟢 `any` nascosto
**Sintomi**: compila e gira, ma stampa `undefined` per campi inesistenti.
**File**: `src/bug3.ts`
**Compito**: elimina `any`, usa il tipo corretto, e osserva gli errori del compilatore.

## Feature opzionale — Interfaccia Transaction
**File**: `src/feature.ts`
**Compito**: completa l'interfaccia Transaction seguendo le istruzioni nel file.

---

# Soluzione

Ogni correzione è in un commit separato (`git log`). Verificato con Node.js 22 e TypeScript 5.9.

## Come trovare i bug

`npx tsx` **non controlla i tipi**: esegue il codice e basta. Per questo i sintomi reali sono diversi da quelli indicati sopra:

| Bug | Con `npx tsx` | Chi lo trova |
|---|---|---|
| 1 | Nessun errore: stampa `Saldo: 15420.5` | `npm run typecheck` → `TS2322: Type '"ATTIVO"' is not assignable to type '"ACTIVE" \| "BLOCKED" \| "CLOSED"'` |
| 2 | Crash: `TypeError: Cannot read properties of undefined (reading 'replace')` | `npm run typecheck` → `TS18048: 'c.phone' is possibly 'undefined'` (quindi il file non "compila", come dice la consegna: `strict` lo blocca) |
| 3 | Stampa `undefined` per `saldoCorrente` e `tipo` | Il compilatore non lo vede, e `noImplicitAny` non aiuta: blocca solo l'`any` implicito. Lo trova ESLint con la regola `@typescript-eslint/no-explicit-any`. Tolto l'`any`, tsc segnala `TS2339: Property 'saldoCorrente' does not exist on type 'Account'` |

Ho aggiunto lo script `npm run typecheck` (`tsc --noEmit`): è quello che trova i bug 1 e 2.

## Correzioni

| | Prima | Dopo |
|---|---|---|
| Bug 1 | `status: "ATTIVO"` | `status: "ACTIVE"` |
| Bug 2 | `c.phone.replace("+39 ", "0")` | `c.phone?.replace("+39 ", "0") ?? "non disponibile"` |
| Bug 3 | `processAccount(account: any)` con `saldoCorrente` e `tipo` | `processAccount(account: Account): void` con `balance`; `tipo` rimosso perché `Account` non ha quel campo |

## Feature

`BaseEntity`, l'enum `TransactionStatus` e `Transaction` come da istruzioni. `CreateTransactionDto` deriva da `Transaction` con `Omit`, così resta allineato se `Transaction` cambia. `isValidTransaction` controlla che:

- l'importo sia positivo e finito (esclude `NaN` e `Infinity`);
- il conto di addebito sia diverso da quello di accredito;
- la descrizione non sia vuota (una descrizione di soli spazi conta come vuota).

```text
$ npx tsx src/feature.ts
Transazione valida: true
From === To: false
Amount negativo: false
Descrizione vuota: false
Stato della transazione eseguita: COMPLETED
```

## Verifica

```bash
npm install
npm run typecheck        # nessun errore
npx tsx src/bug1.ts      # Saldo: 15420.5
npx tsx src/bug2.ts      # Mario Rossi — Tel: 0333 1234567 / Laura Bianchi — Tel: non disponibile
npx tsx src/bug3.ts      # IBAN: IT60X0542811101000000123456 / Saldo: 15420.5
npx tsx src/feature.ts
```

**Nota:** gli script `dev` e `start` del `package.json` originale puntano a `src/index.ts`, che in questo progetto non esiste. Per eseguire i file si usa `npx tsx src/<file>.ts`.

## Cosa ho aggiunto al progetto originale

- `.gitignore`: senza, `node_modules/` sarebbe finito nel repository.
- `.gitattributes`: fine riga uniformi tra Windows, macOS e Linux.
- `package-lock.json`: versioni esatte delle dipendenze.
- Lo script `typecheck`.
