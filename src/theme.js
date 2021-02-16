const Color = require('color')

const primary = Color('#1C4C73')
const secondary = Color('#E6E6E6')
const callout = Color('#52B434')
const white = primary.mix(Color('white'), 0.95)
const black = primary.mix(Color('black'), 0.95)

const color = {
  white,
  black,
  primary: {
    color: primary,
    hover: primary.mix(Color(white), 0.1),
    text: white,
    border: primary.mix(Color(black), 0.2),
  },
  secondary: {
    color: secondary,
    hover: secondary.mix(Color('white'), 0.2),
    text: black,
    border: secondary.mix(Color(black), 0.2),
  },
  callout: {
    color: callout,
    hover: callout.mix(Color(white), 0.1),
    text: white,
    border: callout.mix(Color(black), 0.2),
  },
  disabled: {
    color: '#D5D5DD',
    text: '#969696',
    border: '#969696',
  },
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
