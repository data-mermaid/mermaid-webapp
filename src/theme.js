const Color = require('color')

const primary = Color('#1C4C73')
const secondary = Color('#E6E6E6')
const callout = Color('#52B434')
const white = primary.mix(Color('white'), 0.95)
const black = primary.mix(Color('black'), 0.95)

const color = {
  white,
  black,
  primaryColor: primary,
  primaryHover: primary.mix(Color(white), 0.1),
  primaryText: white,
  primaryBorder: primary.mix(Color(black), 0.2),
  secondaryColor: secondary,
  secondaryHover: secondary.mix(Color('white'), 0.2),
  secondaryText: black,
  secondaryBorder: secondary.mix(Color(black), 0.2),
  calloutColor: callout,
  calloutHover: callout.mix(Color(white), 0.1),
  calloutText: white,
  calloutBorder: callout.mix(Color(black), 0.2),
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
