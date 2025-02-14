import styled from 'styled-components'
import theme from '../../theme'

export const P = styled.p`
  max-width: ${theme.spacing.maxTextWidth};
`
export const PNoMargins = styled(P)`
  margin: 0;
`
export const PSmall = styled(P)`
  font-size: ${theme.typography.smallFontSize};
`
export const H1 = styled.h1``
export const H2 = styled.h2``
export const H3 = styled.h3``
export const H4 = styled.h4``
export const H5 = styled.h5``
export const H6 = styled.h6``

export const ItalicizedInfo = styled.p`
  font-style: italic;
  color: ${theme.color.grey0};
`
export const DisabledText = styled.span`
  color: ${theme.color.disabledColor};
`
