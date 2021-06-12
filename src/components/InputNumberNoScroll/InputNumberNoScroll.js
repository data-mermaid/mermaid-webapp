import React, { useRef } from 'react'
import { Input } from '../generic/form'
import { useNoInputScrolling } from '../../library/useNoInputScrolling'

const InputNumberNoScroll = (props) => {
  const textFieldRef = useRef()

  useNoInputScrolling(textFieldRef)

  return <Input {...props} ref={textFieldRef} />
}

InputNumberNoScroll.propTypes = {}

export default InputNumberNoScroll
