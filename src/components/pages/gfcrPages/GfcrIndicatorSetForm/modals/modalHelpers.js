import { Box } from '@mui/material'
import React from 'react'
import { CustomMuiChip } from '../../../../mermaidInputs/InputMuiChipSelectWithLabelAndValidation/InputMuiChipSelectWithLabelAndValidation.styles'

export const getOptionList = (selectChoices) => {
  return selectChoices.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))
}

export const getChips = (value, options) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {options
      .filter((option) => value.includes(option.id))
      .map((option) => (
        <CustomMuiChip key={option.id} label={option.name} />
      ))}
  </Box>
)
