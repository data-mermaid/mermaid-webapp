import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { InputRow, CheckRadioLabel, CheckRadioWrapper } from '../../../generic/form'
import { managementRegimePropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import InputValidationInfo from '../../../mermaidInputs/InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../../../mermaidInputs/mermaidInputsPropTypes'

const partialRestrictionOptions = [
  { value: 'periodic_closure', label: 'Periodic Closure' },
  { value: 'size_limits', label: 'Size Limits' },
  { value: 'gear_restriction', label: 'Gear Restriction' },
  { value: 'species_restriction', label: 'Species Restriction' },
  { value: 'access_restriction', label: 'Access Restriction' },
]

const StyledCheckRadioWrapper = styled(CheckRadioWrapper)`
  display: block;
`
const PartialRestrictionsCheckboxCheckRadioWrapper = styled(CheckRadioWrapper)`
  margin-left: 2rem;
`
const StyledCheckRadioLabel = styled(CheckRadioLabel)`
  > span {
    display: block;
    font-size: x-small;
    padding-left: 2rem;
  }
`

const ManagementRulesInput = ({
  id,
  label,
  managementFormValues,
  onChange,
  validationMessages,
  validationType,
  ...restOfProps
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

  const [managementRulesRadioInputValue, setManagementRulesRadioInputValue] = useState(
    getManagementRulesRadioInputValue(managementFormValues),
  )

  const [partialRestrictionCheckboxValues, setPartialRestrictionCheckboxValues] = useState(
    getPartialRestrictionCheckboxValues(managementFormValues),
  )

  const resetPartialRestrictionProperties = () => {
    const updatedValues = { ...partialRestrictionCheckboxValues }
    const partialRestrictionOptionValues = partialRestrictionOptions.map((item) => item.value)

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
    onChange('open_access', false)
    onChange('no_take', false)
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
      <PartialRestrictionsCheckboxCheckRadioWrapper key={value}>
        <input
          id={value}
          type="checkbox"
          value={value}
          checked={partialRestrictionCheckboxValues[value]}
          onChange={handlePartialRestrictionChoicesChange}
        />
        <CheckRadioLabel htmlFor={value} key={value}>
          {optionLabel}
        </CheckRadioLabel>
      </PartialRestrictionsCheckboxCheckRadioWrapper>
    ))

  return (
    <InputRow required {...restOfProps}>
      <label htmlFor={id}>{label}</label>
      <div>
        <StyledCheckRadioWrapper>
          <input
            type="radio"
            id="open-access"
            name="rules"
            value="open_access"
            checked={managementRulesRadioInputValue.open_access}
            onChange={handleOpenAccessChange}
          />
          <StyledCheckRadioLabel htmlFor="open-access">
            Open Access
            <span>Open for fishing and entering</span>
          </StyledCheckRadioLabel>
        </StyledCheckRadioWrapper>
        <StyledCheckRadioWrapper>
          <input
            type="radio"
            id="no-take"
            name="rules"
            value="no_take"
            checked={managementRulesRadioInputValue.no_take}
            onChange={handleNoTakeChange}
          />
          <StyledCheckRadioLabel htmlFor="no-take">
            No Take
            <span>Total extraction ban</span>
          </StyledCheckRadioLabel>
        </StyledCheckRadioWrapper>
        <StyledCheckRadioWrapper>
          <input
            type="radio"
            id="partial-restrictions"
            name="rules"
            checked={managementRulesRadioInputValue.partial_restrictions}
            onChange={handlePartialRestrictionChange}
          />
          <StyledCheckRadioLabel htmlFor="partial-restrictions">
            Partial Restrictions
            <span>
              e.g. periodic closures, size limits, gear restrictions, species restrictions
            </span>
          </StyledCheckRadioLabel>
          {showPartialRestrictionChoices}
        </StyledCheckRadioWrapper>
      </div>
      <InputValidationInfo
        validationType={validationType}
        validationMessages={validationMessages}
      />
    </InputRow>
  )
}

ManagementRulesInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  managementFormValues: managementRegimePropType,
  onChange: PropTypes.func.isRequired,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

ManagementRulesInput.defaultProps = {
  id: 'rules',
  label: 'Rules',
  managementFormValues: {},
  validationMessages: undefined,
  validationType: undefined,
}

export default ManagementRulesInput
