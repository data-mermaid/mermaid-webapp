import { css } from 'styled-components/macro'
import colorHelper from 'color'

const primary = colorHelper('#1C4C73')
const secondary = colorHelper('#E6E6E6')
const callout = colorHelper('#52B434')
const caution = colorHelper('#BD585A')
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
  backgroundColor: white.mix(colorHelper(black), 0.05),
  primaryColor: primary,
  primaryHover: primary.mix(colorHelper(white), 0.1),
  primaryActive: primary.mix(colorHelper(black), 0.1),
  primaryText: white,
  primaryBorder: primary.mix(colorHelper(black), 0.2),
  secondaryColor: secondary,
  secondaryHover: secondary.mix(colorHelper('white'), 0.2),
  secondaryActive: secondary.mix(colorHelper('black'), 0.2),
  secondaryText: black,
  secondaryBorder: secondary.mix(colorHelper(black), 0.2),
  cautionColor: caution,
  cautionHover: caution.mix(colorHelper(white), 0.1),
  cautionText: white,
  cautionBorder: caution.mix(colorHelper(black), 0.2),
  calloutColor: callout,
  calloutHover: callout.mix(colorHelper(white), 0.1),
  calloutText: white,
  calloutBorder: callout.mix(colorHelper(black), 0.2),
  disabledColor: '#D5D5DD',
  disabledText: '#969696',
  disabledBorder: '#969696',
  border: white.mix(colorHelper(black), 0.5),
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
}

const timing = {
  hoverTransition: '0.25s',
}

const typography = {
  defaultFontSize: '1.8rem',
  lineHeight: '1.2',
  fontStack: 'Arial, Helvetica Neue, Helvetica, sans-serif',
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
