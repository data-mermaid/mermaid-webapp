import { Chip, MenuItem, Select } from '@mui/material'
import styled from 'styled-components/macro'

import theme from '../../../theme'

export const getMenuItemStyle = ({ option, selectedItems }) => {
  return {
    fontWeight: selectedItems.indexOf(option.value) === -1 ? 'normal' : 'bold',
  }
}

export const CustomMuiChip = styled(Chip).attrs(() => ({
  sx: { fontSize: theme.typography.smallFontSize },
}))`
  margin-left: ${theme.spacing.small};
`

export const CustomMuiSelect = styled(Select).attrs(() => ({
  sx: {
    borderRadius: 0,
    border: '.4px solid',
    width: '100%',
    fontSize: theme.typography.defaultFontSize,
  },
}))``

export const CustomMenuItem = styled(MenuItem).attrs(() => ({
  sx: {
    fontSize: theme.typography.defaultFontSize,
  },
}))``
