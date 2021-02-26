const { css } = require('styled-components')

const mediaQueryPhoneOnly = (content) => css`
  @media (max-width: 599px) {
    ${content};
  }
`
const mediaQueryForTabletPortraitUp = (content) => css`
  @media (min-width: 600px) {
    ${content};
  }
`
const mediaQueryForTabletLandscapeUp = (content) => css`
  @media (min-width: 900px) {
    ${content};
  }
`
const mediaQueryForDesktopUp = (content) => css`
  @media (min-width: 1200px) {
    ${content};
  }
`
const mediaQueryForBigDesktopUp = (content) => css`
  @media (min-width: 1800px) {
    ${content};
  }
`
const hoverState = (content) => css`
  @media (hover: hover) {
    &:hover {
      ${content};
    }
  }
`

export {
  mediaQueryPhoneOnly,
  mediaQueryForBigDesktopUp,
  mediaQueryForTabletLandscapeUp,
  mediaQueryForTabletPortraitUp,
  mediaQueryForDesktopUp,
  hoverState,
}
