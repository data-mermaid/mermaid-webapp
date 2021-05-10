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

    textFieldRef.current.addEventListener('wheel', handleWheel)

    return () => {
      if (textFieldRef.current)
        textFieldRef.current.removeEventListener('wheel', handleWheel)
    }
  }, [textFieldRef])

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <Input id={id} {...restOfProps} ref={textFieldRef} />
      <div>
        {validationMessage ? (
          <ValidationMessage
            validationType={validationType}
            role={validationRole}
          >
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
