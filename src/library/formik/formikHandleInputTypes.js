import { getValueTruncatedToXDecimalPlaces } from '../numbers/getValueTruncatedToXDecimalPlaces'

export const formikHandleNumericDecimalInputChange = ({
  formik,
  event,
  fieldName,
  maxNumberOfDecimals = 2,
}) => {
  formik.setFieldValue(
    fieldName,
    getValueTruncatedToXDecimalPlaces({
      inputValue: event.target.value,
      maxNumberOfDecimals,
    }),
  )
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
