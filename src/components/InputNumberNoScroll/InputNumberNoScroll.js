import React, { useRef } from 'react'
import { Input } from '../generic/form'
import { useStopInputScrollingIncrementNumber } from '../../library/useStopInputScrollingIncrementNumber'

const InputNumberNoScroll = (props) => {
  const textFieldRef = useRef()

  useStopInputScrollingIncrementNumber(textFieldRef)

  return <Input {...props} ref={textFieldRef} />
}

InputNumberNoScroll.propTypes = {}

export default InputNumberNoScroll
