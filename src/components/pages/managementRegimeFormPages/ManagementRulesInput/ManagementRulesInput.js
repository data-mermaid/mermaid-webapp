import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import theme from '../../../../theme'
import { InputRow } from '../../../generic/form'
import { managementRegimePropType } from '../../../../App/mermaidData/mermaidDataProptypes'

const partialRestrictionOptions = [
  { value: 'periodic_closure', label: 'Periodic Closure' },
  { value: 'size_limits', label: 'Size Limits' },
  { value: 'gear_restriction', label: 'Gear Restriction' },
  { value: 'species_restriction', label: 'Species Restriction' },
  { value: 'access_restriction', label: 'Access Restriction' },
]

const CheckBoxLabel = styled.label`
  padding-left: ${theme.spacing.xlarge} !important;
  width: 100%;
  display: inline-block;
  input {
    cursor: pointer;
  }
`

const RadioLabel = styled.label`
  padding: 6px 5px !important;
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: x-small;
    padding-left: ${theme.spacing.medium};
  }
`

const ManagementRulesInput = ({
  id,
  label,
  managementFormValues,
  onChange,
}) => {
  const getManagementRulesRadioInputValue = (rules) => {
    return {
      open_access: rules.open_access,
      no_take: rules.no_take,
      partial_restrictions:
        rules.access_restriction ||
        rules.periodic_closure ||
        rules.size_limits ||
        rules.gear_restriction ||
        rules.species_restriction,
    }
  }

  const getPartialRestrictionCheckboxValues = (rules) => {
    return {
      access_restriction: rules.access_restriction,
      periodic_closure: rules.periodic_closure,
      size_limits: rules.size_limits,
      gear_restriction: rules.gear_restriction,
      species_restriction: rules.species_restriction,
    }
  }

  const [
    managementRulesRadioInputValue,
    setManagementRulesRadioInputValue,
  ] = useState(getManagementRulesRadioInputValue(managementFormValues))

  const [
    partialRestrictionCheckboxValues,
    setPartialRestrictionCheckboxValues,
  ] = useState(getPartialRestrictionCheckboxValues(managementFormValues))

  const resetPartialRestrictionProperties = () => {
    const updatedValues = { ...partialRestrictionCheckboxValues }
    const partialRestrictionOptionValues = partialRestrictionOptions.map(
      (item) => item.value,
    )

    partialRestrictionOptionValues.forEach((item) => {
      updatedValues[item] = false

      onChange(item, false)
    })

    setPartialRestrictionCheckboxValues(updatedValues)
  }

  const handleOpenAccessChange = () => {
    setManagementRulesRadioInputValue({
      open_access: true,
      no_take: false,
      partial_restrictions: false,
    })
    onChange('open_access', true)
    onChange('no_take', false)
    resetPartialRestrictionProperties()
  }

  const handleNoTakeChange = () => {
    setManagementRulesRadioInputValue({
      open_access: false,
      no_take: true,
      partial_restrictions: false,
    })
    onChange('open_access', false)
    onChange('no_take', true)
    resetPartialRestrictionProperties()
  }

  const handlePartialRestrictionChange = () => {
    setManagementRulesRadioInputValue({
      open_access: false,
      no_take: false,
      partial_restrictions: true,
    })
  }

  const handlePartialRestrictionChoicesChange = (e) => {
    const value = e.target.checked
    const property = e.target.value

    const updateValues = { ...partialRestrictionCheckboxValues }

    updateValues[property] = value

    setPartialRestrictionCheckboxValues(updateValues)
    onChange(property, value)
  }

  const showPartialRestrictionChoices =
    managementRulesRadioInputValue.partial_restrictions &&
    partialRestrictionOptions.map(({ value, label: optionLabel }) => (
      <CheckBoxLabel key={value}>
        <input
          id={value}
          type="checkbox"
          value={value}
          checked={partialRestrictionCheckboxValues[value]}
          onChange={handlePartialRestrictionChoicesChange}
        />
        <span htmlFor={value}>{optionLabel}</span>
      </CheckBoxLabel>
    ))

  return (
    <InputRow>
      <label htmlFor={id}>{label}</label>
      <div>
        <div>
          <RadioLabel htmlFor="open-access">
            <input
              type="radio"
              id="open-access"
              value="open_access"
              checked={managementRulesRadioInputValue.open_access}
              onChange={handleOpenAccessChange}
            />
            Open Access
            <span>Open for fishing and entering</span>
          </RadioLabel>
        </div>
        <div>
          <RadioLabel htmlFor="no-take">
            <input
              type="radio"
              id="no-take"
              value="no_take"
              checked={managementRulesRadioInputValue.no_take}
              onChange={handleNoTakeChange}
            />
            No Take
            <span>Total extraction ban</span>
          </RadioLabel>
        </div>
        <div>
          <RadioLabel htmlFor="partial-restrictions">
            <input
              type="radio"
              id="partial-restrictions"
              checked={managementRulesRadioInputValue.partial_restrictions}
              onChange={handlePartialRestrictionChange}
            />
            Partial Restrictions
            <span>
              e.g. periodic closures, size limits, gear restrictions, species
              restrictions
            </span>
          </RadioLabel>
          {showPartialRestrictionChoices}
        </div>
      </div>
    </InputRow>
  )
}

ManagementRulesInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  managementFormValues: managementRegimePropType,
  onChange: PropTypes.func.isRequired,
}

ManagementRulesInput.defaultProps = {
  id: 'rules',
  label: 'Rules',
  managementFormValues: {},
}

export default ManagementRulesInput
