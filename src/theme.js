import colorHelper from 'color'

const primary = colorHelper('#1C4C73')
const secondary = colorHelper('#E6E6E6')
const callout = colorHelper('#52B434')
const caution = colorHelper('#BD585A')
const white = primary.mix(colorHelper('white'), 0.95)
const black = primary.mix(colorHelper('black'), 0.95)

const color = {
  white,
  black,
  primaryColor: primary,
  primaryHover: primary.mix(colorHelper(white), 0.1),
  primaryText: white,
  primaryBorder: primary.mix(colorHelper(black), 0.2),
  secondaryColor: secondary,
  secondaryHover: secondary.mix(colorHelper('white'), 0.2),
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
}
const spacing = {
  xsmall: '0.4rem',
  small: '1rem',
  medium: '1.6rem',
  large: '2.4rem',
  xlarge: '3.2rem',
  buttonPadding: '1rem 2rem',
}
const typography = {}

const theme = { color, spacing, typography }

export default theme
