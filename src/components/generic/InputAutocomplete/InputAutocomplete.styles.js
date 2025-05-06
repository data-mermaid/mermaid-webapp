import styled from 'styled-components'
import theme from '../../../theme'

export const Menu = styled('ul')`
  z-index: 15;
  position: absolute;
  top: 4rem;
  padding: 0;
  margin-top: 2px;
  background: ${theme.color.white};
  width: 100%;
  max-height: 18rem;
  cursor: default;
  overflow-y: auto;
  overflow-x: hidden;
  outline: ${theme.color.outline};
  border-color: ${theme.color.border};
  border-width: 0 1px 1px 1px;
  border-style: solid;
  color: ${theme.color.textColor};
  border: ${(props) => (props.isOpen ? null : 'none')};
  outline: ${(props) => (props.isOpen ? null : 'none')};
`

export const Item = styled('li')`
  position: relative;
  display: block;
  border: none;
  height: auto;
  border-top: none;
  padding: ${theme.spacing.buttonPadding};
  white-space: normal;
  word-wrap: normal;
  background-color: ${(props) =>
    props.highlighted ? theme.color.primaryColor : theme.color.white};
  color: ${(props) => (props.highlighted ? theme.color.white : theme.color.black)};
`
