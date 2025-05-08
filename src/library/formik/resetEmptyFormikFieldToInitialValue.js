export const resetEmptyFormikFieldToInitialValue = ({
  formik,
  event,
  fieldName,
  resetRemoveDecimal = false,
}) => {
  const originalInputValue = event.target.value.trim()

  // Reset to initial value if the input is empty
  if (!originalInputValue) {
    formik.setFieldValue(fieldName, formik.initialValues[fieldName])
    return
  }

  // Remove decimal part if resetRemoveDecimal is true
  if (resetRemoveDecimal && originalInputValue.includes('.')) {
    const integerValue = originalInputValue.split('.')[0]
    formik.setFieldValue(fieldName, integerValue)
  }
}
