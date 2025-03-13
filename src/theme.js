import { css } from 'styled-components'
import colorHelper from 'color'

const primary = colorHelper('#174b82')
const secondary = colorHelper('#DDDCE4')
const callout = colorHelper('#DB3B00')
const caution = colorHelper('#BB1600')
const warning = colorHelper('#FEDD2F')
const ignore = colorHelper('#D6DDE6')
const white = colorHelper('#fff')
const black = primary.mix(colorHelper('black'), 0.95)
const grey0 = colorHelper.hsl(248, 13, 55)
const grey1 = colorHelper.hsl(248, 13, 88)
const grey2 = colorHelper.hsl(248, 13, 91)
const grey3 = colorHelper.hsl(248, 13, 93)
const grey4 = colorHelper.hsl(248, 13, 95)
const grey5 = colorHelper.hsl(248, 13, 98)
const background = grey1
const textColor = colorHelper('#13124A')
const valid = textColor

const xxsmall = '0.1rem'
const xsmall = '0.2rem'
const small = '0.5rem'
const medium = '1rem'
const large = '1.5rem'
const xlarge = '2rem'

const color = {
  textColor,
  white,
  grey0,
  grey1,
  grey2,
  grey3,
  grey4,
  grey5,
  background,
  black,
  warning,
  callout,
  ignore,
  ignoreColor: ignore,
  ignoreHover: ignore.mix(colorHelper(white), 0.1),
  infoColor: ignore,
  ignoreBorder: ignore.mix(colorHelper('black'), 0.1),
  infoBorder: ignore.mix(colorHelper('black'), 0.1),
  valid,
  warningColor: warning,
  warningBorder: warning.mix(colorHelper('black'), 0.1),
  warningHover: warning.mix(colorHelper(white), 0.1),
  backgroundColor: background,

  primaryColor: primary,
  primaryHover: primary.mix(colorHelper(white), 0.1),
  primaryActive: primary.mix(colorHelper(black), 0.3),
  primaryText: white,
  primaryBorder: primary.mix(colorHelper(black), 0.2),
  primaryDisabledColor: primary.mix(colorHelper('grey'), 0.6),
  primaryDisabledText: '#9AA8B7',

  secondaryColor: secondary,
  secondaryHover: secondary.mix(colorHelper('white'), 0.2),
  secondaryActive: secondary.mix(colorHelper('black'), 0.2),
  secondaryText: textColor,
  secondaryBorder: secondary.mix(colorHelper(black), 0.2),
  secondaryDisabledColor: white.mix(colorHelper(black), 0.2),
  secondaryDisabledText: '#6B6B6B',

  cautionColor: caution,
  cautionHover: caution.mix(colorHelper(white), 0.9),
  cautionText: white,
  cautionBorder: caution.mix(colorHelper(black), 0.2),
  cautionActive: caution.mix(colorHelper(white), 0.7),
  cautionDisabledColor: caution.mix(colorHelper('black'), 0.2),
  cautionDisabledText: '#C0766C',
  inlineErrorColor: '#F6DCD9',

  calloutColor: white,
  calloutHover: callout.mix(colorHelper(white), 0.9),
  calloutText: callout,
  calloutBorder: callout,
  calloutActive: callout.mix(colorHelper('white'), 0.8),
  calloutDisabledColor: callout.mix(colorHelper('black'), 0.2),
  calloutDisabledText: '#969696',

  disabledColor: '#D5D5DD',
  disabledInputBackground: '#E4E4E4',
  disabledText: 'rgba(255,255,255,0.5)',
  disabledTextDark: 'rgba(0,0,0,0.5)',
  disabledBorder: '#969696',

  border: white.mix(colorHelper(black), 0.5),
  tableBorderColor: grey2,
  sideBarColor: black.mix(colorHelper(white), 0.9),
  headerColor: primary,
  footerColor: white,
  tableRowOdd: '#fdfdfe',
  tableRowEven: '#f8f8fa',
  tableRowHover: '#f1f1f4',
  focusWithin: secondary,
  unitBackground: white.mix(colorHelper(black), 0.1),
  inputBackground: white,
  outline: `solid 2px ${primary}`,
  headerDropdownMenuBackground: `#174b82ee`,
  getMessageColorBackground: function getMessageColorBackground(messageType) {
    if (messageType === 'ignore') {
      return this.ignoreColor.alpha(0.15)
    }
    if (messageType === 'info') {
      return this.infoColor.alpha(0.15)
    }
    if (messageType === 'warning') {
      return this.warningColor.alpha(0.15)
    }
    if (messageType === 'error') {
      return this.cautionColor.alpha(0.15)
    }

    return undefined
  },
  getBorderColor: function getBorderColor(messageType) {
    if (messageType === 'ignore') {
      return this.ignoreColor
    }
    if (messageType === 'info') {
      return this.infoColor
    }
    if (messageType === 'warning') {
      return this.warningColor
    }
    if (messageType === 'error') {
      return this.cautionColor
    }

    return this.primaryColor
  },
  getHoverColor: function getHoverColor(messageType) {
    if (messageType === 'ignore') {
      return this.ignoreColor.alpha(0.4)
    }
    if (messageType === 'info') {
      return this.infoColor.alpha(0.4)
    }
    if (messageType === 'warning') {
      return this.warningColor.alpha(0.4)
    }
    if (messageType === 'error') {
      return this.cautionColor.alpha(0.4)
    }

    return undefined
  },
}
const spacing = {
  xxsmall,
  xsmall,
  small,
  medium,
  large,
  xlarge,
  buttonSpacing: `${small}`,
  buttonPadding: `${small} ${medium}`,
  width: '90vw',
  maxWidth: '1200px',
  maxTextWidth: '78ch',
  fullViewportWidth: 'calc(100vw - (100vw - 100%))',
  headerHeight: '4.9rem',
  toolbarHeight: '7rem',
  sideNavWidth: '17.5rem',
  mobileSideNavWidth: '9rem',
  borderSmall: '1px',
  borderMedium: '2px',
  borderLarge: '4px',
  borderXLarge: '8px',
}

const timing = {
  hoverTransition: '0.25s',
  activeTransition: '0.25s',
  TooltipTransition: 'visibility 0.1s linear 0.1s',
}

const typography = {
  largeFontSize: '2.5rem',
  mediumFontSize: '2rem',
  defaultFontSize: '1.6rem',
  smallFontSize: '1.2rem',
  xSmallFontSize: '1rem',
  lineHeight: '1.5',
  smallIconSize: '1rem',
  defaultIconSize: '1.5rem',
  mediumIconSize: '2.25rem',
  largeIconSize: '3rem',
  xLargeIconSize: '4rem',
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
