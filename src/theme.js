import { css } from 'styled-components/macro'
import colorHelper from 'color'

const primary = colorHelper('#004c76')
const secondary = colorHelper('#E6E6E6')
const callout = colorHelper('#078600')
const caution = colorHelper('#BD585A')
const warning = colorHelper('#F0E0B6')
const ignore = colorHelper('#D6DDE6')
const white = primary.mix(colorHelper('white'), 0.98)
const black = primary.mix(colorHelper('black'), 0.95)

const xsmall = '0.5rem'
const small = '1rem'
const medium = '2rem'
const large = '2.5rem'
const xlarge = '3.5rem'

const color = {
  white,
  black,
  warning,
  ignore,
  ignoreColor: ignore,
  warningColor: warning,
  backgroundColor: black.mix(colorHelper(white), 0.9),
  primaryColor: primary,
  primaryHover: primary.mix(colorHelper(white), 0.1),
  primaryActive: primary.mix(colorHelper(black), 0.3),
  primaryText: white,
  primaryBorder: primary.mix(colorHelper(black), 0.2),
  primaryDisabledColor: primary.mix(colorHelper('grey'), 0.6),
  secondaryColor: secondary,
  secondaryHover: secondary.mix(colorHelper('white'), 0.2),
  secondaryActive: secondary.mix(colorHelper('black'), 0.2),
  secondaryText: black,
  secondaryBorder: secondary.mix(colorHelper(black), 0.2),
  secondaryDisabledColor: white.mix(colorHelper(black), 0.2),
  cautionColor: caution,
  cautionHover: caution.mix(colorHelper(white), 0.1),
  cautionText: white,
  cautionBorder: caution.mix(colorHelper(black), 0.2),
  cautionActive: caution.mix(colorHelper('black'), 0.2),
  cautionDisabledColor: caution.mix(colorHelper('black'), 0.2),
  calloutColor: callout,
  calloutHover: callout.mix(colorHelper(white), 0.1),
  calloutText: white,
  calloutBorder: callout.mix(colorHelper(black), 0.2),
  calloutActive: callout.mix(colorHelper('black'), 0.2),
  calloutDisabledColor: callout.mix(colorHelper('black'), 0.2),
  disabledColor: '#D5D5DD',
  disabledText: '#969696',
  disabledBorder: '#969696',
  border: white.mix(colorHelper(black), 0.5),
  sideBarColor: black.mix(colorHelper(white), 0.9),
  headerColor: primary,
  footerColor: white,
  tableRowOdd: primary.mix(colorHelper(white), 0.9),
  tableRowEven: primary.mix(colorHelper(white), 0.95),
  tableRowHover: '#D7DDE2',
  inputBackground: white,
  outline: `solid 2px ${primary}`,
}
const spacing = {
  xsmall,
  small,
  medium,
  large,
  xlarge,
  buttonPadding: `${small} ${medium}`,
  width: '90vw',
  maxWidth: '1200px',
  headerHeight: '4.4rem',
  sideNavWidthTabletLandscapeOnly: '8rem',
  sideNavWidthPhoneOnly: '6rem',
  sideNavWidthDesktop: '25rem',
  borderSmall: '1px',
  borderMedium: '2px',
  borderLarge: '4px',
  borderXLarge: '8px',
}

const timing = {
  hoverTransition: '0.25s',
  activeTransition: '0.25s',
}

const typography = {
  defaultFontSize: '1.8rem',
  smallFontSize: '1.2rem',
  xSmallFontSize: '1rem',
  lineHeight: '1.2',
  fontStack: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  smallIconSize: '1rem',
  defaultIconSize: '1.8rem',
  largeIconSize: '3.5rem',
  noWordBreak: css`
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-all;
    word-break: break-word;
    hyphens: auto;
  `,
  upperCase: css`
    text-transform: uppercase;
    letter-spacing: 2px;
  `,
}

const theme = { color, timing, spacing, typography }

export default theme
