import { css } from 'styled-components'

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
const mediaQueryTabletLandscapeOnly = (content) => css`
  @media (max-width: 960px) {
    ${content};
  }
`
const mediaQueryForTabletLandscapeUp = (content) => css`
  @media (min-width: 900px) {
    ${content};
  }
`
const mediaQueryForDesktopUp = (content) => css`
  @media (min-width: 1300px) {
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
    &:hover:not([disabled]) {
      ${content};
    }
  }
`

export {
  mediaQueryPhoneOnly,
  mediaQueryForBigDesktopUp,
  mediaQueryForTabletLandscapeUp,
  mediaQueryTabletLandscapeOnly,
  mediaQueryForTabletPortraitUp,
  mediaQueryForDesktopUp,
  hoverState,
}
