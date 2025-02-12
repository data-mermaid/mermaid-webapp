export const formikHandleNumericTwoDecimalInputChange = ({ formik, event, fieldName }) => {
  const originalInputValue = event.target.value

  const isInputNumericOrEmpty = !isNaN(originalInputValue)
  const indexOfDecimal = originalInputValue.indexOf('.')
  const hasDecimal = indexOfDecimal !== -1
  const doesInputHaveMoreThanTwoDecimalPlaces =
    hasDecimal && originalInputValue.slice(indexOfDecimal + 1).length > 2

  if (isInputNumericOrEmpty && doesInputHaveMoreThanTwoDecimalPlaces) {
    const truncatedValue = Math.trunc(Number(originalInputValue) * 100) / 100
    const modifiedInputValue = truncatedValue.toFixed(2)

    formik.setFieldValue(fieldName, modifiedInputValue)
  }
  if (isInputNumericOrEmpty && !doesInputHaveMoreThanTwoDecimalPlaces) {
    formik.setFieldValue(fieldName, originalInputValue)
  }
}
