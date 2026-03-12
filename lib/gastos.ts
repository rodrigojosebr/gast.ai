import crypto from "crypto";

export function centsToBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function newEventId(): string {
  return crypto.randomUUID();
}
