import React, { useRef } from 'react'
import { Input } from '../form'

const InputNumberNumericCharactersOnly = (props) => {
  const textFieldRef = useRef()

  return <Input type="text" inputMode="numeric" pattern="[0-9]*" {...props} ref={textFieldRef} />
}

InputNumberNumericCharactersOnly.propTypes = {}

export default InputNumberNumericCharactersOnly
