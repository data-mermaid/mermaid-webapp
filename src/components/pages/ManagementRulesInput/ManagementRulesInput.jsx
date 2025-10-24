import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { InputRow, CheckRadioLabel, LabelContainer, RequiredIndicator } from '../../generic/form'
import { managementRegimePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import InputValidationInfo from '../../mermaidInputs/InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../../mermaidInputs/mermaidInputsPropTypes'
import {
  NestedCheckboxHelperText,
  PartialRestrictionsCheckboxCheckRadioWrapper,
  RadioHelperText,
  StyledCheckRadioLabel,
  StyledCheckRadioWrapper,
} from './managementRulesInput.styles'

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
  const { t } = useTranslation()

  const partialRestrictionOptions = [
    {
      value: 'periodic_closure',
      label: t('management_rules.periodic_closure_label'),
      helperText: t('management_rules.periodic_closure_helper'),
    },
    {
      value: 'size_limits',
      label: t('management_rules.size_limits_label'),
      helperText: t('management_rules.size_limits_helper'),
    },
    {
      value: 'gear_restriction',
      label: t('management_rules.gear_restriction_label'),
      helperText: t('management_rules.gear_restrictions'),
    },
    {
      value: 'species_restriction',
      label: t('management_rules.species_restriction_label'),
      helperText: t('management_rules.species_restriction_helper'),
    },
    {
      value: 'access_restriction',
      label: t('management_rules.access_restriction_label'),
      helperText: t('management_rules.access_restrictions'),
    },
  ]
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
          <StyledCheckRadioLabel htmlFor="open-access">
            {t('management_rules.open_access_label')}
          </StyledCheckRadioLabel>
          <RadioHelperText>{t('management_rules.open_access')}</RadioHelperText>
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
            {t('management_rules.no_take_label')}
          </StyledCheckRadioLabel>
          <RadioHelperText>{t('management_rules.no_take')}</RadioHelperText>
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
            {t('management_rules.partial_restrictions_label')}
          </StyledCheckRadioLabel>
          <RadioHelperText>{t('management_rules.partial_restrictions_helper')}</RadioHelperText>
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
