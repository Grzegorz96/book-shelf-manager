import { generateKeyBetween } from 'fractional-indexing';

export function getNewOrder(
  prevOrder: string | null | undefined,
  nextOrder: string | null | undefined,
): string {
  return generateKeyBetween(prevOrder ?? null, nextOrder ?? null);
}
