import React from 'react'
import styled, { css } from 'styled-components'
import { subNavNodePropTypes } from './subNavNodePropTypes'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'

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
  ${mediaQueryPhoneOnly(css`
    line-height: 1;
  `)}
`
const FullRecord = styled(SubNavList)`
  justify-content: space-around;
  flex-wrap: wrap;
  &:before {
    content: '↳';
  }
  span {
    margin: 0 0.25rem;
  }
  ${mediaQueryPhoneOnly(css`
    &:before {
      content: '';
    }
    flex-direction: column;
  `)}
`
const PartialRecord = styled(SubNavList)`
  justify-content: space-between;
  &:before {
    content: '↳';
  }
  ${mediaQueryPhoneOnly(css`
    &:before {
      content: '';
    }
    flex-direction: column;
  `)}
`
const SingleRecord = styled(SubNavList)`
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
