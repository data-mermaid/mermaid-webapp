import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { Input, InputRow, ValidationMessage } from '../form'

const InputWithLabelAndValidation = ({
  label,
  id,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  const textFieldRef = useRef(null)

  const _preventScrollingFromChangingValues = useEffect(() => {
    const handleWheel = (e) => e.preventDefault()
    const snapshotOfTextFieldRef = textFieldRef.current

    snapshotOfTextFieldRef.addEventListener('wheel', handleWheel)

    return () => {
      if (snapshotOfTextFieldRef)
        snapshotOfTextFieldRef.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <Input id={id} {...restOfProps} ref={textFieldRef} />
      <div>
        {validationMessage ? (
          <ValidationMessage validationType={validationType}>
            {validationMessage}
          </ValidationMessage>
        ) : null}
      </div>
    </InputRow>
  )
}

InputWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}

export default InputWithLabelAndValidation
