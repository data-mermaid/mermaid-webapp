import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { Textarea, InputRow, ValidationMessage } from '../form'

const TextareaWithLabelAndValidation = ({
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

  const validationRole =
    validationType === 'error' || 'warning' ? 'alert' : undefined

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <Textarea rows="3" id={id} {...restOfProps} ref={textFieldRef} />
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

TextareaWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

TextareaWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}

export default TextareaWithLabelAndValidation
