import { Chip, MenuItem, Select } from '@mui/material'
import styled from 'styled-components'

import theme from '../../../theme'

export const CustomMuiChip = styled(Chip).attrs(() => ({
  sx: { fontSize: theme.typography.smallFontSize, fontFamily: 'Open Sans' },
}))`
  margin-left: ${theme.spacing.small};
`

export const CustomMuiSelect = styled(Select).attrs(() => ({
  sx: {
    borderRadius: 0,
    border: '.4px solid',
    width: '100%',
    fontSize: theme.typography.defaultFontSize,

    '&.Mui-focused': {
      color: `${theme.color.primaryColor}`,
      border: '2.5px solid',
    },

    '&.MuiOutlinedInput-root': {
      color: `${theme.color.textColor}`,
      borderColor: `${theme.color.border}`,
    },

    fieldset: {
      display: 'none',
    },
  },
}))``

export const CustomMenuItem = styled(MenuItem).attrs(() => ({
  sx: {
    fontSize: theme.typography.defaultFontSize,
    fontFamily: 'Open Sans',

    '&:hover': {
      backgroundColor: `${theme.color.secondaryHover}`,
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.color.secondaryHover}`,
    },
    '&.Mui-selected&:hover': {
      backgroundColor: `${theme.color.secondaryHover}`,
    },
  },
}))``
