import React from 'react'
import styled from 'styled-components'
import { subNavNodePropTypes } from './subNavNodePropTypes'
import theme from '../../theme'

const SubNavList = styled('li')`
  background-color: ${theme.color.primaryColor};
  color: ${theme.color.white};
  padding: ${theme.spacing.xsmall};
  display: flex;
  width: 100%;
`
const NavListSubItem = styled('span')`
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-thickness: 2px;
  flex: 0;
  line-height: 1.2;
  padding: ${theme.spacing.small} 0;
  word-wrap: break-word;
`
const FullRecord = styled(SubNavList)`
  &:before {
    content: '↳';
  }
  justify-content: space-around;
  flex-wrap: wrap;
  span {
    margin: 0 0.25rem;
  }
`
const PartialRecord = styled(SubNavList)`
  &:before {
    content: '↳';
  }
  justify-content: space-between;
`
const SingleRecord = styled('span')`
  text-decoration: none;
`

const RecordName = ({ subNavNode }) => {
  const { name, number, label } = subNavNode

  if (!number && !label) {
    return <SingleRecord>↳{name}</SingleRecord>
  }
  if (!name) {
    return (
      <PartialRecord>
        <NavListSubItem>{number}</NavListSubItem>
        <NavListSubItem>{label}</NavListSubItem>
      </PartialRecord>
    )
  }

  return (
    <FullRecord>
      <NavListSubItem>{name}</NavListSubItem>
      <NavListSubItem>{number}</NavListSubItem>
      <NavListSubItem>{label}</NavListSubItem>
    </FullRecord>
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
  subNavNode: subNavNodePropTypes,
}

SubNavMenuRecordName.propTypes = {
  subNavNode: subNavNodePropTypes,
}

RecordName.defaultProps = { subNavNode: null }
SubNavMenuRecordName.defaultProps = { subNavNode: null }

export default SubNavMenuRecordName
