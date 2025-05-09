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

export const formikHandleIntegerInputChange = ({ formik, event, fieldName }) => {
  const originalValue = event.target.value
  const formattedValue = originalValue.replace(/[^0-9.]/g, '')
  formik.setFieldValue(fieldName, formattedValue)
}
