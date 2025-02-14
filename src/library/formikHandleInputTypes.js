export const formikHandleNumericTwoDecimalInputChange = ({ formik, event, fieldName }) => {
  const originalInputValue = event.target.value
  const isNumericOrEmpty = !Number.isNaN(Number(originalInputValue))
  const indexOfDecimal = originalInputValue.indexOf('.')
  const hasDecimal = indexOfDecimal !== -1
  const hasMoreThanTwoDecimals =
    hasDecimal && originalInputValue.slice(indexOfDecimal + 1).length > 2

  if (isNumericOrEmpty && hasMoreThanTwoDecimals) {
    const truncatedValue = Math.trunc(Number(originalInputValue) * 100) / 100
    const modifiedInputValue = truncatedValue.toFixed(2)

    formik.setFieldValue(fieldName, modifiedInputValue)
  }
  if (isNumericOrEmpty && !hasMoreThanTwoDecimals) {
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
