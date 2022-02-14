import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../theme'

const SubNavList = styled.li`
  background-color: ${theme.color.primaryColor};
  color: ${theme.color.white};
`
const SubNavMenuRecordName = ({ subNavName }) => {
  return subNavName && <SubNavList>{subNavName}</SubNavList>
}

SubNavMenuRecordName.propTypes = {
  subNavName: PropTypes.string,
}

SubNavMenuRecordName.defaultProps = { subNavName: null }

export default SubNavMenuRecordName
