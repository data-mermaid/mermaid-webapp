import React from 'react'
import styled, { css } from 'styled-components'
import { subNavNodePropTypes } from './subNavNodePropTypes'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'

const SubNavListLi = styled('li')`
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
const NavListSubItemWrapper = styled('div')`
  justify-content: space-around;
  flex-wrap: wrap;
  &::before {
    content: '↳';
  }
  span {
    margin: 0 0.25rem;
  }
  ${mediaQueryPhoneOnly(css`
    &::before {
      content: '';
    }
    flex-direction: column;
  `)}
`
const RecordName = ({ subNavNode = null }) => {
  const { name, number, label } = subNavNode

  if (!number && !label) {
    return <NavListSubItemWrapper>{name}</NavListSubItemWrapper>
  }
  if (!name) {
    return (
      <NavListSubItemWrapper>
        <NavListSubItem>{number}</NavListSubItem>
        <NavListSubItem>{label}</NavListSubItem>
      </NavListSubItemWrapper>
    )
  }

  return (
    <NavListSubItemWrapper>
      <NavListSubItem>{name}</NavListSubItem>
      <NavListSubItem>{number}</NavListSubItem>
      <NavListSubItem>{label}</NavListSubItem>
    </NavListSubItemWrapper>
  )
}

const SubNavMenuRecordName = ({ subNavNode = null }) => {
  return subNavNode ? (
    <SubNavListLi>
      <RecordName subNavNode={subNavNode} />
    </SubNavListLi>
  ) : null
}

RecordName.propTypes = {
  subNavNode: subNavNodePropTypes,
}

SubNavMenuRecordName.propTypes = {
  subNavNode: subNavNodePropTypes,
}

export default SubNavMenuRecordName
