import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { InputRow, ValidationMessage } from '../form'
import { RowCenter } from '../positioning'

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
      <input id={id} {...restOfProps} ref={textFieldRef} />
      {validationMessage ? (
        <RowCenter>
          <ValidationMessage validationType={validationType}>
            {validationMessage}
          </ValidationMessage>
        </RowCenter>
      ) : null}
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
