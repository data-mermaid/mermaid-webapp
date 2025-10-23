import { Box, OutlinedInput } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  CustomMenuItem,
  CustomMuiChip,
  CustomMuiSelect,
} from './InputMuiChipSelectWithLabelAndValidation.styles'
import { InputRow, RequiredIndicator } from '../../generic/form'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import theme from '../../../theme'

const InputMuiChipSelectWithLabelAndValidation = ({
  id,
  required,
  ignoreNonObservationFieldValidations = () => {},
  label,
  onChange,
  options,
  resetNonObservationFieldValidations = () => {},
  validationMessages,
  validationType = undefined,
  value,
  additionalInputContent = undefined,
}) => {
  const { t } = useTranslation()
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
          renderValue={(selected) => (selected.length ? chips : t('placeholders.select'))}
          label=""
          displayEmpty={true}
          data-testid={`${id}-select`}
        >
          {options.map((option) => (
            <CustomMenuItem
              key={option.value}
              value={option.value}
              sx={{ fontSize: theme.typography.defaultFontSize }}
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

export default InputMuiChipSelectWithLabelAndValidation
