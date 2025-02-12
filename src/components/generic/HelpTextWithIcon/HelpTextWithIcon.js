import React from 'react'
import PropTypes from 'prop-types'

import { IconInfo } from '../../icons'
import { HelpTextWrapper } from './HelpTextWithIcon.styles'

export const HelpTextWithIcon = ({ children }) => {
  return (
    <HelpTextWrapper>
      <IconInfo />
      {children}
    </HelpTextWrapper>
  )
}

HelpTextWithIcon.propTypes = { children: PropTypes.node.isRequired }
