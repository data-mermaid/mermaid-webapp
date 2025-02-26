import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { InputRow, CheckRadioLabel, LabelContainer, RequiredIndicator } from '../../generic/form'
import { managementRegimePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import InputValidationInfo from '../../mermaidInputs/InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../../mermaidInputs/mermaidInputsPropTypes'
import language from '../../../language'
import {
  NestedCheckboxHelperText,
  PartialRestrictionsCheckboxCheckRadioWrapper,
  RadioHelperText,
  StyledCheckRadioLabel,
  StyledCheckRadioWrapper,
} from './managementRulesInput.styles'

const regimeRulesLanguage = language.helperText.managementRegimeRules

const partialRestrictionOptions = [
  {
    value: 'periodic_closure',
    label: 'Periodic Closure',
    helperText: regimeRulesLanguage.periodicClosure,
  },
  { value: 'size_limits', label: 'Size Limits', helperText: regimeRulesLanguage.sizeLimits },
  {
    value: 'gear_restriction',
    label: 'Gear Restriction',
    helperText: regimeRulesLanguage.gearRestrictions,
  },
  {
    value: 'species_restriction',
    label: 'Species Restriction',
    helperText: regimeRulesLanguage.speciesRestrictions,
  },
  {
    value: 'access_restriction',
    label: 'Access Restriction',
    helperText: regimeRulesLanguage.accessRestrictions,
  },
]

const ManagementRulesInput = ({
  id = 'rules',
  label = 'Rules',
  managementFormValues = {},
  onChange,
  required,
  validationMessages = undefined,
  validationType = undefined,
  ...restOfProps
}) => {
  const getManagementRulesRadioInputValue = (rules) => {
    const {
      open_access,
      no_take,
      access_restriction,
      periodic_closure,
      size_limits,
      gear_restriction,
      species_restriction,
    } = rules

    const partialRestrictionRules =
      access_restriction ||
      periodic_closure ||
      size_limits ||
      gear_restriction ||
      species_restriction

    return {
      open_access,
      no_take,
      partial_restrictions: partialRestrictionRules,
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

  const [managementRulesRadioInputValue, setManagementRulesRadioInputValue] = useState({})

  const [partialRestrictionCheckboxValues, setPartialRestrictionCheckboxValues] = useState({})

  const [isPartialRestrictionsExpanded, setIsPartialRestrictionsExpanded] = useState(
    managementRulesRadioInputValue.partial_restrictions,
  )

  useEffect(
    function keepPartialRestrictionRulesExpandedWhenAppropriate() {
      if (getManagementRulesRadioInputValue(managementFormValues).partial_restrictions) {
        setIsPartialRestrictionsExpanded(true)
      }
    },
    [isPartialRestrictionsExpanded, managementFormValues],
  )

  useEffect(
    function initializeManagementFormValues() {
      setManagementRulesRadioInputValue(getManagementRulesRadioInputValue(managementFormValues))
      setPartialRestrictionCheckboxValues(getPartialRestrictionCheckboxValues(managementFormValues))
    },
    [managementFormValues],
  )
  const resetPartialRestrictionRulesAndUpdateFormikOnChange = (formikProperty) => {
    const updatePartialRestrictionRuleValues = { ...partialRestrictionCheckboxValues }
    const partialRestrictionOptionValues = partialRestrictionOptions.map((item) => item.value)

    partialRestrictionOptionValues.forEach((item) => {
      updatePartialRestrictionRuleValues[item] = false
    })

    setPartialRestrictionCheckboxValues(updatePartialRestrictionRuleValues)
    onChange(formikProperty, updatePartialRestrictionRuleValues)
  }

  const handleOpenAccessChange = () => {
    setManagementRulesRadioInputValue({
      open_access: true,
      no_take: false,
      partial_restrictions: false,
    })
    resetPartialRestrictionRulesAndUpdateFormikOnChange('open_access')
    setIsPartialRestrictionsExpanded(false)
  }

  const handleNoTakeChange = () => {
    setManagementRulesRadioInputValue({
      open_access: false,
      no_take: true,
      partial_restrictions: false,
    })
    resetPartialRestrictionRulesAndUpdateFormikOnChange('no_take')
    setIsPartialRestrictionsExpanded(false)
  }

  const handlePartialRestrictionChange = () => {
    setManagementRulesRadioInputValue({
      open_access: false,
      no_take: false,
      partial_restrictions: true,
    })
    resetPartialRestrictionRulesAndUpdateFormikOnChange('partial_restrictions')
    setIsPartialRestrictionsExpanded(true)
  }

  const handlePartialRestrictionChoicesChange = (e) => {
    const { value: property, checked: checkboxValue } = e.target
    const updatePartialRestrictionRuleValues = { ...partialRestrictionCheckboxValues }

    updatePartialRestrictionRuleValues[property] = checkboxValue

    setPartialRestrictionCheckboxValues(updatePartialRestrictionRuleValues)
    onChange('partial_restrictions', updatePartialRestrictionRuleValues)
  }

  const showPartialRestrictionChoices = isPartialRestrictionsExpanded
    ? partialRestrictionOptions.map(({ value, label: optionLabel, helperText }) => (
        <div key={value}>
          <PartialRestrictionsCheckboxCheckRadioWrapper>
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
          <NestedCheckboxHelperText>{helperText}</NestedCheckboxHelperText>
        </div>
      ))
    : null

  return (
    <InputRow {...restOfProps} validationType={validationType}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <LabelContainer>
        <label id={`${id}-management-rules-input`}>{label}</label>
        <span>{required ? <RequiredIndicator /> : null}</span>
      </LabelContainer>
      <div aria-labelledby={`${id}-management-rules-input`}>
        <StyledCheckRadioWrapper>
          <input
            type="radio"
            id="open-access"
            name="rules"
            value="open_access"
            checked={managementRulesRadioInputValue.open_access}
            onChange={handleOpenAccessChange}
          />
          <StyledCheckRadioLabel htmlFor="open-access">Open Access</StyledCheckRadioLabel>
          <RadioHelperText>{regimeRulesLanguage.openAccess}</RadioHelperText>
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
          <StyledCheckRadioLabel htmlFor="no-take">No Take</StyledCheckRadioLabel>
          <RadioHelperText>{regimeRulesLanguage.noTake}</RadioHelperText>
        </StyledCheckRadioWrapper>
        <StyledCheckRadioWrapper>
          <input
            type="radio"
            id="partial-restrictions"
            name="rules"
            value="partial_restrictions"
            checked={managementRulesRadioInputValue.partial_restrictions}
            onChange={handlePartialRestrictionChange}
          />
          <StyledCheckRadioLabel htmlFor="partial-restrictions">
            Partial Restrictions
          </StyledCheckRadioLabel>
          <RadioHelperText>{regimeRulesLanguage.partialRestrictions}</RadioHelperText>
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
  required: PropTypes.bool.isRequired,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

export default ManagementRulesInput
