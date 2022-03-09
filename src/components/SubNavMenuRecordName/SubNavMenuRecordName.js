import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../theme'

const SubNavList = styled.li`
  background-color: ${theme.color.primaryColor};
  color: ${theme.color.white};
  padding: ${theme.spacing.small};
  span {
    line-height: 1.2;
    padding: ${theme.spacing.small} 0;
    display: block;
    word-wrap: break-word;
    > span {
      border-bottom: solid 1px white;
    }
  }
`
const SubNavMenuRecordName = ({ subNavName }) => {
  return (
    subNavName && (
      <SubNavList>
        <span>{subNavName}</span>
      </SubNavList>
    )
  )
}

SubNavMenuRecordName.propTypes = {
  subNavName: PropTypes.node,
}

SubNavMenuRecordName.defaultProps = { subNavName: null }

export default SubNavMenuRecordName
