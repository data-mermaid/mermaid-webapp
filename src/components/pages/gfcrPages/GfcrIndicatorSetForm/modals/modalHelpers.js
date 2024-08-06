import { Box } from '@mui/material'
import React from 'react'
import { CustomMuiChip } from '../../../../mermaidInputs/InputMuiChipSelectWithLabelAndValidation/InputMuiChipSelectWithLabelAndValidation.styles'

export const getChips = (value, options) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {options
      .filter((option) => value.includes(option.id))
      .map((option) => (
        <CustomMuiChip key={option.id} label={option.name} />
      ))}
  </Box>
)
