// Strips everything except digits and '.' so behavior is identical across locales -
// pair with type="text"/inputMode="decimal" inputs, since native type="number" inputs
// accept a locale-specific decimal separator (e.g. ',' in German) before this ever runs.
export const sanitizeToOneDecimalPlace = (value) => {
  const digitsAndDotOnly = String(value ?? '').replace(/[^\d.]/g, '')
  const [integerPart = '', ...decimalParts] = digitsAndDotOnly.split('.')
  const decimalPart = decimalParts.join('').slice(0, 1)

  return digitsAndDotOnly.includes('.') ? `${integerPart}.${decimalPart}` : integerPart
}
