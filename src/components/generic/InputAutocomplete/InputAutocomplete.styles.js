import styled from 'styled-components'
import theme from '../../../theme'

export const Menu = styled('ul')`
  padding: 0;
  margin-top: 2px;
  background: ${theme.color.white};
  position: absolute;
  width: 100%;
  max-height: 20rem;
  cursor: default;
  overflow-y: auto;
  overflow-x: hidden;
  outline: ${theme.color.outline};
  border-color: ${theme.color.border};
  border-width: 0 1px 1px 1px;
  border-style: solid;
  color: ${theme.color.textColor};
  z-index: 99;
  top: 4rem;
`(({ isOpen }) => ({
  border: isOpen ? null : 'none',
  outline: isOpen ? null : 'none',
}))

export const Item = styled('li')`
  position: relative;
  display: block;
  border: none;
  height: auto;
  border-top: none;
  padding: ${theme.spacing.buttonPadding};
  white-space: normal;
  word-wrap: normal;
`(({ isActive, isSelected }) => {
  const styles = []

  if (isActive) {
    // this is also hover
    styles.push({
      background: `${theme.color.secondaryHover}`,
    })
  }
  if (isSelected) {
    styles.push({
      fontWeight: '700',
    })
  }

  return styles
})
