/**
 * GFCR amounts arrive from the API as strings, because Django serialises DecimalField that
 * way. Parse once at the boundary so the rest of the app only ever handles a plain number.
 * Returns null for empty, missing or unparseable input.
 */
export const parseGfcrNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const parsed = typeof value === 'number' ? value : parseFloat(String(value))

  return Number.isNaN(parsed) ? null : parsed
}
