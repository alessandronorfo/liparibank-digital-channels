// Bug 1 — Errore di compilazione: valore non valido per literal type
interface Account {
  id: string;
  iban: string;
  balance: number;
  status: "ACTIVE" | "BLOCKED" | "CLOSED";
}

const conto: Account = {
  id: "1",
  iban: "IT60X0542811101000000123456",
  balance: 15420.50,
  status: "ACTIVE", // ✅ FIX: "ATTIVO" non era ammesso dal literal type (TS2322)
};

function getSaldo(account: Account): number {
  return account.balance;
}

console.log("Saldo:", getSaldo(conto));
