// src/broken/bug2.ts — CORRETTO
// Bug: phone è opzionale, ma veniva usato senza controllo.
// A runtime: TypeError "Cannot read properties of undefined (reading 'replace')".
// Il compilatore lo segnalava già (npm run typecheck, TS18048 'c.phone' is possibly 'undefined').
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

const clienti: Customer[] = [
  {
    id: "1",
    firstName: "Mario",
    lastName: "Rossi",
    email: "mario@example.com",
    phone: "+39 333 1234567",
  },
  { id: "2", firstName: "Laura", lastName: "Bianchi", email: "laura@example.com" },
];

function stampaContatti(customers: Customer[]): void {
  for (const c of customers) {
    // ?. salta la chiamata se phone è undefined; ?? fornisce il testo alternativo
    const telefono = c.phone?.replace("+39 ", "0") ?? "non disponibile";
    console.log(`${c.firstName} ${c.lastName} — Tel: ${telefono}`);
  }
}

stampaContatti(clienti);
