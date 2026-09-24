/** Query string sent to inventory search. Hyphenated ISBNs become digits. */
export function productLookupTerm(raw: string): string {
  const trimmed = raw.trim();
  const compact = trimmed.replace(/[\s-]/g, "");
  if (/^(?:\d{10}|\d{9}[Xx]|\d{13})$/.test(compact)) {
    return compact.toUpperCase();
  }
  return trimmed;
}

/**
 * Pick the edition to sell after a manual lookup.
 * A single match is selected immediately so an ISBN entry continues the sale.
 */
export function resolveManualEditionId(
  editionIds: string[],
  requestedId?: string,
): string | undefined {
  if (requestedId && editionIds.includes(requestedId)) {
    return requestedId;
  }
  if (editionIds.length === 1) {
    return editionIds[0];
  }
  return undefined;
}
