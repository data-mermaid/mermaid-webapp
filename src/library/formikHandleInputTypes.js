export const formikHandleNumericDecimalInputChange = ({
  formik,
  event,
  fieldName,
  maxNumberOfDecimals = 2,
}) => {
  const originalInputValue = event.target.value
  const isNumericOrEmpty = !Number.isNaN(Number(originalInputValue))
  const indexOfDecimal = originalInputValue.indexOf('.')
  const hasDecimal = indexOfDecimal !== -1
  const hasMoreThanMaxDecimals =
    hasDecimal && originalInputValue.slice(indexOfDecimal + 1).length > maxNumberOfDecimals

  if (isNumericOrEmpty && hasMoreThanMaxDecimals) {
    const multiplierToCreateTruncatedValue = Math.pow(10, maxNumberOfDecimals)
    const truncatedValue =
      Math.trunc(Number(originalInputValue) * multiplierToCreateTruncatedValue) /
      multiplierToCreateTruncatedValue
    const modifiedInputValue = truncatedValue.toFixed(maxNumberOfDecimals)

    formik.setFieldValue(fieldName, modifiedInputValue)
  }
  if (isNumericOrEmpty && !hasMoreThanMaxDecimals) {
    formik.setFieldValue(fieldName, originalInputValue)
  }
}

export const formikHandleIntegerInputChange = ({ formik, event, fieldName }) => {
  const originalInputValue = event.target.value
  const isNumericOrEmpty = !Number.isNaN(Number(originalInputValue))
  const indexOfDecimal = originalInputValue.indexOf('.')
  const hasDecimal = indexOfDecimal !== -1

  if (isNumericOrEmpty && !hasDecimal) {
    formik.setFieldValue(fieldName, originalInputValue)
  }
  if (isNumericOrEmpty && hasDecimal) {
    const integerValue = originalInputValue.slice(0, indexOfDecimal)
    formik.setFieldValue(fieldName, integerValue)
  }
}
