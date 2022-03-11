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

const RecordName = ({ subNavNode }) => {
  const { name, number, label } = subNavNode

  if (!number && !label) {
    return <span>{name}</span>
  }
  if (!name) {
    return (
      <span>
        {number} {label}
      </span>
    )
  }

  return (
    <span>
      <span>{name}</span>
      {number} {label}
    </span>
  )
}

const SubNavMenuRecordName = ({ subNavNode }) => {
  return subNavNode ? (
    <SubNavList>
      <RecordName subNavNode={subNavNode} />
    </SubNavList>
  ) : (
    <></>
  )
}

RecordName.propTypes = {
  subNavNode: PropTypes.shape({
    name: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
  }),
}

SubNavMenuRecordName.propTypes = {
  subNavNode: PropTypes.shape({
    name: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
  }),
}

RecordName.defaultProps = { subNavNode: null }
SubNavMenuRecordName.defaultProps = { subNavNode: null }

export default SubNavMenuRecordName
