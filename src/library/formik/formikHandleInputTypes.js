import { getValueTruncatedToXDecimalPlaces } from '../numbers/getValueTruncatedToXDecimalPlaces'

export const formikHandleNumericDecimalInputChange = ({
  formik,
  event,
  fieldName,
  maxNumberOfDecimals = 2,
}) => {
  const originalValue = event.target.value
  const formattedValue = originalValue.replace(/[^0-9.]/g, '')
  formik.setFieldValue(
    fieldName,
    getValueTruncatedToXDecimalPlaces({
      inputValue: formattedValue,
      maxNumberOfDecimals,
    }),
  )
}

export const formikHandleGfcrNumberInputChange = ({ formik, event, fieldName }) => {
  const originalValue = event.target.value
  const formattedValue = originalValue.replace(/[^0-9.]/g, '')
  formik.setFieldValue(fieldName, formattedValue)
}

export const formikHandleIntegerInputOnBlur = ({ formik, event, fieldName }) => {
  const originalInputValue = event.target.value.trim()
  const valueHasMultipleDots = originalInputValue.split('.').length > 2

  if (!originalInputValue || valueHasMultipleDots || originalInputValue === '.') {
    formik.setFieldValue(fieldName, formik.initialValues[fieldName])
    return
  }

  const integerValue = originalInputValue.split('.')[0]
  formik.setFieldValue(fieldName, integerValue)
}

export const formikHandleDecimalInputOnBlur = ({
  formik,
  event,
  fieldName,
  maxNumberOfDecimals = 2,
}) => {
  const originalInputValue = event.target.value.trim()
  const valueHasMultipleDots = originalInputValue.split('.').length > 2

  if (!originalInputValue || valueHasMultipleDots || originalInputValue === '.') {
    formik.setFieldValue(fieldName, formik.initialValues[fieldName])
    return
  }

  let formattedDecimalValue = parseFloat(originalInputValue).toFixed(maxNumberOfDecimals)
  formattedDecimalValue = parseFloat(formattedDecimalValue).toString() //remove trailing zeros

  formik.setFieldValue(fieldName, formattedDecimalValue)
}
