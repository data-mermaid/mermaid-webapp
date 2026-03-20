import { styled } from 'styled-components'

import theme from '../../theme'

export const Figure = styled.figure`
  all: unset;
  & figcaption {
    font-weight: bold;
    margin-bottom: ${theme.spacing.small};
  }
`
export const Dl = styled.dl`
  all: unset;
  & dt {
    margin-top: ${theme.spacing.medium};
    font-weight: bold;
  }
  & dt:first-child {
    margin-top: 0;
  }
  & dd {
    margin-left: ${theme.spacing.medium};
  }
`
