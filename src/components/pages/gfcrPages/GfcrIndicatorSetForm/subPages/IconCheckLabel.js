import React from 'react'
import PropTypes from 'prop-types'
import { IconCheck, IconClose } from '../../../../icons'

const IconCheckLabel = ({ isCheck }) => {
  return isCheck ? <IconCheck /> : <IconClose color="red" />
}

IconCheckLabel.propTypes = {
  isCheck: PropTypes.bool,
}

export default IconCheckLabel
