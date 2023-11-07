import { Box, OutlinedInput } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

import {
  CustomMenuItem,
  CustomMuiChip,
  CustomMuiSelect,
  getMenuItemStyle,
} from './InputMuiChipSelectWithLabelAndValidation.styles'
import { InputRow, RequiredIndicator } from '../../generic/form'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import theme from '../../../theme'
import language from '../../../language'

const InputMuiChipSelectWithLabelAndValidation = ({
  id,
  required,
  ignoreNonObservationFieldValidations,
  label,
  onChange,
  options,
  resetNonObservationFieldValidations,
  validationMessages,
  validationType,
  value,
  additionalInputContent,
}) => {
  const handleCheckboxGroupChange = (event) => {
    onChange({ selectedItems: event.target.value, event })
  }

  const chips = (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {options
        .filter((option) => value.includes(option.value))
        .map((option) => (
          <CustomMuiChip key={option.value} label={option.label} />
        ))}
    </Box>
  )

  return (
    <InputRow validationType={validationType}>
      <label id={`${id}-mui-chip-select-with-label-and-validation`}>
        {label}
        {required ? <RequiredIndicator /> : null}
      </label>
      <div>
        <CustomMuiSelect
          labelId={`${id}-mui-chip-select-with-label-and-validation`}
          multiple
          value={value}
          onChange={handleCheckboxGroupChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (selected.length ? chips : language.placeholders.select)}
          label=""
          displayEmpty={true}
        >
          {options.map((option) => (
            <CustomMenuItem
              key={option.value}
              value={option.value}
              sx={{ fontSize: theme.typography.defaultFontSize }}
              style={getMenuItemStyle({ option, selectedItems: value, theme })}
            >
              {option.label}
            </CustomMenuItem>
          ))}
        </CustomMuiSelect>
        <div>{additionalInputContent}</div>
      </div>

      <InputValidationInfo
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationMessages={validationMessages}
        validationType={validationType}
      />
    </InputRow>
  )
}

InputMuiChipSelectWithLabelAndValidation.propTypes = {
  additionalInputContent: PropTypes.node,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  resetNonObservationFieldValidations: PropTypes.func,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        profile: PropTypes.string,
        profile_name: PropTypes.string,
      }),
    ]),
  ).isRequired,
}

InputMuiChipSelectWithLabelAndValidation.defaultProps = {
  additionalInputContent: undefined,
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  validationMessages: [],
  validationType: undefined,
}

export default InputMuiChipSelectWithLabelAndValidation
