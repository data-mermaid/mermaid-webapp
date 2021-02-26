import colorHelper from 'color'

const primary = colorHelper('#1C4C73')
const secondary = colorHelper('#E6E6E6')
const callout = colorHelper('#52B434')
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
  calloutColor: callout,
  calloutHover: callout.mix(colorHelper(white), 0.1),
  calloutText: white,
  calloutBorder: callout.mix(colorHelper(black), 0.2),
  disabledColor: '#D5D5DD',
  disabledText: '#969696',
  disabledBorder: '#969696',
}
const spacing = {
  xsmall: '4px',
  small: '10px',
  medium: '16px',
  large: '24px',
  xlarge: '32px',
}
const typography = {}

const theme = { color, spacing, typography }

export default theme
