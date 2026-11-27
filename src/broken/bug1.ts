// src/broken/bug1.ts — CORRETTO
// Bug: status "ATTIVO" non apparteneva al literal type "ACTIVE" | "BLOCKED" | "CLOSED".
// tsx lo eseguiva senza errori: lo segnala solo il compilatore (npm run typecheck, TS2322).
interface Account {
  id: string;
  iban: string;
  balance: number;
  status: "ACTIVE" | "BLOCKED" | "CLOSED";
}

const conto: Account = {
  id: "1",
  iban: "IT60X0542811101000000123456",
  balance: 15420.5,
  status: "ACTIVE",
};

function getSaldo(account: Account): number {
  return account.balance;
}

console.log(getSaldo(conto));
