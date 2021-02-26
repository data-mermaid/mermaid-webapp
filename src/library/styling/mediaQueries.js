const { css } = require('styled-components')

const mediaQueryPhoneOnly = (content) => css`
  @media (max-width: 599px) {
    ${content};
  }
`
const mediaQueryHover = (content) => css`
  @media (hover: hover) {
    &:hover {
      ${content};
    }
  }
`

export { mediaQueryPhoneOnly, mediaQueryHover }
