import React, { useRef } from 'react'
import { Input } from '../form'
import { useStopInputScrollingIncrementNumber } from '../../../library/useStopInputScrollingIncrementNumber'

const InputNumberNoScroll = (props) => {
  const textFieldRef = useRef()

  useStopInputScrollingIncrementNumber(textFieldRef)

  return <Input type="text" inputmode="numeric" pattern="[0-9]*" {...props} ref={textFieldRef} />
}

InputNumberNoScroll.propTypes = {}

export default InputNumberNoScroll
