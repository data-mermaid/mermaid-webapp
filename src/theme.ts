import { css } from 'styled-components'
import colorHelper from 'color'
import { MessageType } from './types/constants'

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
const textColor = colorHelper('#13124A').toString()
const valid = textColor

const xxsmall = '0.1rem'
const xsmall = '0.2rem'
const small = '0.5rem'
const medium = '1rem'
const large = '1.5rem'
const xlarge = '2rem'

const color = {
  textColor,
  brandSecondary: '#f2645a',
  white: white.toString(),
  grey0: grey0.toString(),
  grey1: grey1.toString(),
  grey2: grey2.toString(),
  grey3: grey3.toString(),
  grey4: grey4.toString(),
  grey5: grey5.toString(),
  background: background.toString(),
  black: black.toString(),
  black90: black.fade(0.9).toString(),
  warning: warning.toString(),
  callout: callout.toString(),
  ignore: ignore.toString(),
  ignoreColor: ignore.toString(),
  ignoreHover: ignore.mix(colorHelper(white), 0.1).toString(),
  infoColor: ignore.toString(),
  ignoreBorder: ignore.mix(colorHelper('black'), 0.1).toString().toString(),
  infoBorder: ignore.mix(colorHelper('black'), 0.1).toString(),
  valid,
  warningColor: warning.toString(),
  warningBorder: warning.mix(colorHelper('black'), 0.1).toString(),
  warningHover: warning.mix(colorHelper(white), 0.1).toString(),
  backgroundColor: background.toString(),
  primaryColor: primary.toString(),
  primaryHover: primary.mix(colorHelper(white), 0.1).toString(),
  primaryActive: primary.mix(colorHelper(black), 0.3).toString(),
  primaryText: white.toString(),
  primaryBorder: primary.mix(colorHelper(black), 0.2).toString(),
  primaryDisabledColor: primary.mix(colorHelper('grey'), 0.6).toString(),
  primaryDisabledText: '#9AA8B7',

  secondaryColor: secondary.toString(),
  secondaryHover: secondary.mix(colorHelper('white'), 0.2).toString(),
  secondaryActive: secondary.mix(colorHelper('black'), 0.2).toString(),
  secondaryText: textColor,
  secondaryBorder: secondary.mix(colorHelper(black), 0.2).toString(),
  secondaryDisabledColor: white.mix(colorHelper(black), 0.2).toString(),
  secondaryDisabledText: '#6B6B6B',

  cautionColor: caution.toString(),
  cautionHover: caution.mix(colorHelper(white), 0.9).toString(),
  cautionText: white.toString(),
  cautionBorder: caution.mix(colorHelper(black), 0.2).toString(),
  cautionActive: caution.mix(colorHelper(white), 0.7).toString(),
  cautionDisabledColor: caution.mix(colorHelper('black'), 0.2).toString(),
  cautionDisabledText: '#C0766C',
  inlineErrorColor: '#F6DCD9',

  calloutColor: white.toString(),
  calloutHover: callout.mix(colorHelper(white), 0.9).toString(),
  calloutText: callout.toString(),
  calloutBorder: callout.toString(),
  calloutActive: callout.mix(colorHelper('white'), 0.8).toString(),
  calloutDisabledColor: callout.mix(colorHelper('black'), 0.2).toString(),
  calloutDisabledText: '#969696',

  disabledColor: '#D5D5DD',
  disabledInputBackground: '#E4E4E4',
  disabledText: 'rgba(255,255,255,0.5)',
  disabledTextDark: 'rgba(0,0,0,0.5)',
  disabledBorder: '#969696',

  border: white.mix(colorHelper(black), 0.5).toString(),
  tableBorderColor: grey2.toString(),
  sideBarColor: black.mix(colorHelper(white), 0.9).toString(),
  headerColor: primary.toString(),
  footerColor: white.toString(),
  tableRowOdd: '#fdfdfe',
  tableRowEven: '#f8f8fa',
  tableRowHover: '#f1f1f4',
  focusWithin: secondary.toString(),
  unitBackground: white.mix(colorHelper(black), 0.1).toString(),
  inputBackground: white.toString(),
  outline: `solid 2px ${primary}`,
  headerDropdownMenuBackground: `#174b82ee`,
  getMessageColorBackground: function getMessageColorBackground(messageType: MessageType) {
    if (messageType === 'ignore') {
      return ignore.alpha(0.15).toString()
    }
    if (messageType === 'info') {
      return ignore.alpha(0.15).toString()
    }
    if (messageType === 'warning') {
      return warning.alpha(0.15).toString()
    }
    if (messageType === 'error') {
      return caution.alpha(0.15).toString()
    }

    return undefined
  },
  getBorderColor: function getBorderColor(messageType: MessageType) {
    if (messageType === 'ignore') {
      return ignore.toString()
    }
    if (messageType === 'info') {
      return ignore.toString()
    }
    if (messageType === 'warning') {
      return warning.toString()
    }
    if (messageType === 'error') {
      return caution.toString()
    }

    return primary.toString()
  },
  getHoverColor: function getHoverColor(messageType: MessageType) {
    if (messageType === 'ignore') {
      return ignore.alpha(0.4).toString()
    }
    if (messageType === 'info') {
      return ignore.alpha(0.4).toString()
    }
    if (messageType === 'warning') {
      return warning.alpha(0.4).toString()
    }
    if (messageType === 'error') {
      return caution.alpha(0.4).toString()
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
    word-break: break-word;
    hyphens: auto;
  `,
  upperCase: css`
    text-transform: uppercase;
    letter-spacing: 2px;
  `,
}

const zIndex = {
  autocomplete: 15,
  header: 10,
  modal: 20,
  stickyToolbar: 1,
  nestedStickyPageHeader: 1,
}

const theme = { color, timing, spacing, typography, zIndex }

export default theme
