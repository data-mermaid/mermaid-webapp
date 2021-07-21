import styled from 'styled-components'
import theme from '../../../theme'

export const Menu = styled('ul')(
  {
    padding: 0,
    marginTop: '2px',
    background: `${theme.color.white}`,
    position: 'absolute',
    width: '100%',
    maxHeight: '20rem',
    cursor: 'default',
    overflowY: 'auto',
    overflowX: 'hidden',
    outline: `${theme.color.outline}`,
    borderColor: `${theme.color.border}`,
    borderWidth: '0 1px 1px 1px',
    borderStyle: 'solid',
    color: `${theme.color.textColor}`,
    zIndex: '1',
    top: '4rem',
  },
  ({ isOpen }) => ({
    border: isOpen ? null : 'none',
    outline: isOpen ? null : 'none',
  }),
)

export const Item = styled('li')(
  {
    position: 'relative',
    display: 'block',
    border: 'none',
    height: 'auto',
    borderTop: 'none',
    padding: `${theme.spacing.buttonPadding}`,
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({ isActive, isSelected }) => {
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
  },
)
