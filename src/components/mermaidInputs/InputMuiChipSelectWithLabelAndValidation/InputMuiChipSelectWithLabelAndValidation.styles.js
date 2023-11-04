import { Chip, Select } from '@mui/material'
import styled from 'styled-components/macro'

import theme from '../../../theme'

export const getMenuItemStyle = ({ option, selectedItems }) => {
  return {
    fontWeight: selectedItems.indexOf(option.value) === -1 ? 'normal' : 'bold',
  }
}

export const CustomMuiChip = styled(Chip)`
  margin-left: ${theme.spacing.small};
`

CustomMuiChip.defaultProps = {
  sx: { fontSize: theme.typography.smallFontSize },
}

export const CustomMuiSelect = styled(Select)``

CustomMuiSelect.defaultProps = {
  sx: { borderRadius: 0, border: '.4px solid' },
}
