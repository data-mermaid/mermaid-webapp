import styled from 'styled-components'

export const Menu = styled('ul')(
  {
    padding: 0,
    marginTop: 0,
    position: 'absolute',
    backgroundColor: 'white',
    width: '300px',
    maxHeight: '16.5rem',
    overflowY: 'auto',
    overflowX: 'hidden',
    outline: '0',
    transition: 'opacity .1s ease',
    borderRadius: '0 0 .28571429rem .28571429rem',
    boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    borderColor: '#96c8da',
    borderTopWidth: '0',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  ({ isOpen }) => ({
    border: isOpen ? null : 'none',
  }),
)

export const Item = styled('li')(
  {
    position: 'relative',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1.2rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({ isActive, isSelected }) => {
    const styles = []

    if (isActive) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        background: 'rgba(0,0,0,.03)',
      })
    }
    if (isSelected) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        fontWeight: '700',
      })
    }

    return styles
  },
)
