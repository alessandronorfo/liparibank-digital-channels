// src/broken/bug3.ts — CORRETTO
// Bug: il parametro "any" spegneva il controllo dei tipi, quindi i campi inesistenti
// (saldoCorrente, tipo) stampavano undefined senza errori.
// noImplicitAny non aiuta: blocca solo l'any implicito. Questo any esplicito lo segnala
// ESLint (npm run lint, @typescript-eslint/no-explicit-any).
// Con il tipo Account il compilatore segnala i due campi (TS2339).
interface Account {
  id: string;
  iban: string;
  balance: number;
}

function processAccount(account: Account): void {
  console.log(`IBAN: ${account.iban}`);
  console.log(`Saldo: ${account.balance}`);
  // "tipo" non esiste in Account: la riga è stata rimossa
}

const conto: Account = {
  id: "1",
  iban: "IT60X0542811101000000123456",
  balance: 15420.5,
};

processAccount(conto);
