/**
 * Formats a given number as a USD currency string.
 *
 * @param {number|string} amount - The number to format. Can be a number or a numeric string.
 * @returns {string} - The formatted currency string (e.g., "$1,234.56").
 */
const formatCurrencyAmount = (amount) => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return ''
  }

  const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericValue)
}

export default formatCurrencyAmount
