const getValidationPropsFromFormik = (formik, htmlName) => ({
  validationType: formik.errors[htmlName] && 'error',
  validationMessage: formik.errors[htmlName],
})

export default getValidationPropsFromFormik
