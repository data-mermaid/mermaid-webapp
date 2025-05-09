export const resetEmptyFormikFieldToInitialValue = ({
  formik,
  event,
  fieldName,
  resetRemoveDecimal = false,
}) => {
  const originalInputValue = event.target.value.trim()
  const valueHasMultipleDots = originalInputValue.split('.').length > 2

  // Reset to initial value if the input is empty or has multiple dots
  if (!originalInputValue || valueHasMultipleDots) {
    formik.setFieldValue(fieldName, formik.initialValues[fieldName])
    return
  }

  // Remove decimal part if resetRemoveDecimal is true
  if (resetRemoveDecimal && originalInputValue.includes('.')) {
    const integerValue = originalInputValue.split('.')[0]
    formik.setFieldValue(fieldName, integerValue)
  }
}
