// Utility di validazione base per il dominio bancario italiano.
// Al Giorno 4, queste saranno sostituite da schema Zod.
import { CreateTransactionDto } from "../types/transaction.js";

/** Verifica che un IBAN sia italiano e lungo 27 caratteri */
export function isValidItalianIban(iban: string): boolean {
  const ibanRegex = /^IT\d{2}[A-Z]\d{10}[A-Z0-9]{12}$/;
  return ibanRegex.test(iban);
}

/** Verifica il formato del codice fiscale italiano */
export function isValidFiscalCode(cf: string): boolean {
  const cfRegex = /^[A-Z]{6}\d{2}[A-EHLMPRST]\d{2}[A-Z]\d{3}[A-Z]$/;
  return cfRegex.test(cf.toUpperCase());
}

/** Verifica che un importo sia un numero positivo finito */
export function isPositiveAmount(amount: number): boolean {
  return typeof amount === "number" && amount > 0 && isFinite(amount);
}

/**
 * Verifica una richiesta di bonifico: importo positivo, conto di addebito
 * diverso da quello di accredito, descrizione non vuota (gli spazi non contano).
 */
export function isValidTransaction(tx: CreateTransactionDto): boolean {
  return (
    isPositiveAmount(tx.amount) &&
    tx.fromAccountId !== tx.toAccountId &&
    tx.description.trim().length > 0
  );
}
