export const resetEmptyFormikFieldToInitialValue = ({ formik, event, fieldName }) => {
  const { value } = event.target
  if (value.trim() === '') {
    formik.setFieldValue(fieldName, formik.initialValues[fieldName])
  }
}
