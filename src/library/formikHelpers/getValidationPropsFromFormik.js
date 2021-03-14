const getValidationPropsFromFormik = (formik, htmlName) => ({
  id: htmlName,
  validationType: formik.errors[htmlName] && 'error',
  validationMessage: formik.errors[htmlName],
})

export default getValidationPropsFromFormik
