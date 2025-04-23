export const getValueTruncatedToXDecimalPlaces = ({ inputValue, maxNumberOfDecimals = 2 }) => {
  // will return a number if a number is used as the input, and a string if a string is used as the input
  const numericMaxNumberOfDecimals = Number(maxNumberOfDecimals)
  if (
    Number.isNaN(numericMaxNumberOfDecimals) ||
    numericMaxNumberOfDecimals < 0 ||
    numericMaxNumberOfDecimals > 100
  ) {
    throw new Error('maxNumberOfDecimals must be a string or numeric value between 0 and 100')
  }
  const inputValueType = typeof inputValue
  if (inputValueType !== 'string' && inputValueType !== 'number') {
    throw new Error('inputValue must be a string or numeric value')
  }
  const isInputValueString = inputValueType === 'string'
  const stringifiedInputValue = isInputValueString ? inputValue : inputValue.toString()
  const isNumericOrEmpty = !Number.isNaN(Number(stringifiedInputValue))
  const indexOfDecimal = stringifiedInputValue.indexOf('.')
  const hasDecimal = indexOfDecimal !== -1
  const hasMoreThanMaxDecimals =
    hasDecimal && stringifiedInputValue.slice(indexOfDecimal + 1).length > maxNumberOfDecimals

  if (isNumericOrEmpty && hasMoreThanMaxDecimals) {
    const multiplierToCreateTruncatedValue = Math.pow(10, maxNumberOfDecimals)
    const truncatedValue =
      Math.trunc(Number(stringifiedInputValue) * multiplierToCreateTruncatedValue) /
      multiplierToCreateTruncatedValue
    const modifiedInputValueString = truncatedValue.toFixed(maxNumberOfDecimals)

    return isInputValueString ? modifiedInputValueString : Number(modifiedInputValueString)
  }
  if (isNumericOrEmpty && !hasMoreThanMaxDecimals) {
    return inputValue
  }
  console.error('Unable to truncate value: ', inputValue)
  return inputValue
}
