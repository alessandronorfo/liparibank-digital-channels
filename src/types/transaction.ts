// Dominio Transaction — bonifici tra conti LipariBank
import { BaseEntity, UUID } from "./common.js";

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

export interface Transaction extends BaseEntity {
  fromAccountId: UUID;
  toAccountId: UUID;
  amount: number; // ⚠️ In produzione: Decimal
  description: string;
  executedAt: Date;
  status: TransactionStatus;
}

export interface CreateTransactionDto {
  fromAccountId: UUID;
  toAccountId: UUID;
  amount: number;
  description: string;
}
