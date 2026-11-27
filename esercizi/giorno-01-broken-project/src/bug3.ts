// Bug 3 — any nascosto che disabilita il type checking
interface Account {
  id: string;
  iban: string;
  balance: number;
}

// ✅ FIX: il parametro era "any" e TypeScript non controllava nulla.
// Con il tipo Account, tsc segnala i campi inesistenti (TS2339):
// saldoCorrente → sostituito da balance; tipo → rimosso, Account non ha quel campo.
// Nota: noImplicitAny non basta, blocca solo l'any implicito. Quello esplicito
// lo trova ESLint con la regola @typescript-eslint/no-explicit-any.
function processAccount(account: Account): void {
  console.log(`IBAN: ${account.iban}`);
  console.log(`Saldo: ${account.balance}`);
}

const conto: Account = {
  id: "1",
  iban: "IT60X0542811101000000123456",
  balance: 15420.50,
};

processAccount(conto);
