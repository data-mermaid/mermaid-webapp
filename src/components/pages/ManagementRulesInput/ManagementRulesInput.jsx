import React, { useEffect, useMemo, useState } from 'react'
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
  label,
  managementFormValues = {},
  onChange,
  required,
  testId,
  validationMessages = undefined,
  validationType = undefined,
  ...restOfProps
}) => {
  const { t } = useTranslation()
  const inputRowProps = restOfProps

  const accessRestrictionLabelText = t('management_regimes.access_restriction')
  const accessRestrictionHelperText = t('management_regimes.access_restriction_info')
  const periodicClosureLabelText = t('management_regimes.periodic_closure')
  const periodicClosureHelperText = t('management_regimes.periodic_closure_info')
  const sizeLimitsLabelText = t('management_regimes.size_limits')
  const sizeLimitsHelperText = t('management_regimes.size_limits_info')
  const gearRestrictionLabelText = t('management_regimes.gear_restriction')
  const gearRestrictionHelperText = t('management_regimes.gear_restriction_info')
  const speciesRestrictionLabelText = t('management_regimes.species_restriction')
  const speciesRestrictionHelperText = t('management_regimes.species_restriction_info')

  const resolvedLabel = label ?? t('management_regimes.rules')

  const partialRestrictionOptions = useMemo(
    () => [
      {
        value: 'periodic_closure',
        label: periodicClosureLabelText,
        helperText: periodicClosureHelperText,
        testLabel: 'periodic-closure',
      },
      {
        value: 'size_limits',
        label: sizeLimitsLabelText,
        helperText: sizeLimitsHelperText,
        testLabel: 'size-limits',
      },
      {
        value: 'gear_restriction',
        label: gearRestrictionLabelText,
        helperText: gearRestrictionHelperText,
        testLabel: 'gear-restriction',
      },
      {
        value: 'species_restriction',
        label: speciesRestrictionLabelText,
        helperText: speciesRestrictionHelperText,
        testLabel: 'species-restriction',
      },
      {
        value: 'access_restriction',
        label: accessRestrictionLabelText,
        helperText: accessRestrictionHelperText,
        testLabel: 'access-restriction',
      },
    ],
    [
      accessRestrictionHelperText,
      accessRestrictionLabelText,
      gearRestrictionHelperText,
      gearRestrictionLabelText,
      periodicClosureHelperText,
      periodicClosureLabelText,
      sizeLimitsHelperText,
      sizeLimitsLabelText,
      speciesRestrictionHelperText,
      speciesRestrictionLabelText,
    ],
  )

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
    partialRestrictionOptions.forEach(({ value }) => {
      updatePartialRestrictionRuleValues[value] = false
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
    ? partialRestrictionOptions.map(({ value, label: optionLabel, helperText, testLabel }) => (
        <div key={value}>
          <PartialRestrictionsCheckboxCheckRadioWrapper>
            <input
              id={value}
              type="checkbox"
              value={value}
              checked={partialRestrictionCheckboxValues[value]}
              data-testid={`${testId}-${testLabel}-checkbox`}
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
    <InputRow validationType={validationType} data-testid={testId} {...inputRowProps}>
      <LabelContainer>
        <label id={`${id}-management-rules-input`}>{resolvedLabel}</label>
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
            data-testid={`${testId}-open-access-radio`}
            onChange={handleOpenAccessChange}
          />
          <StyledCheckRadioLabel htmlFor="open-access">
            {t('management_regimes.open_access')}
          </StyledCheckRadioLabel>
          <RadioHelperText>{t('management_regimes.open_access_info')}</RadioHelperText>
        </StyledCheckRadioWrapper>
        <StyledCheckRadioWrapper>
          <input
            type="radio"
            id="no-take"
            name="rules"
            value="no_take"
            checked={managementRulesRadioInputValue.no_take}
            data-testid={`${testId}-no-take-radio`}
            onChange={handleNoTakeChange}
          />
          <StyledCheckRadioLabel htmlFor="no-take">
            {t('management_regimes.no_take')}
          </StyledCheckRadioLabel>
          <RadioHelperText>{t('management_regimes.no_take_info')}</RadioHelperText>
        </StyledCheckRadioWrapper>
        <StyledCheckRadioWrapper>
          <input
            type="radio"
            id="partial-restrictions"
            name="rules"
            value="partial_restrictions"
            checked={managementRulesRadioInputValue.partial_restrictions}
            data-testid={`${testId}-partial-restrictions-radio`}
            onChange={handlePartialRestrictionChange}
          />
          <StyledCheckRadioLabel htmlFor="partial-restrictions">
            {t('management_regimes.partial_restrictions')}
          </StyledCheckRadioLabel>
          <RadioHelperText>{t('management_regimes.partial_restrictions_info')}</RadioHelperText>
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
  testId: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

export default ManagementRulesInput
