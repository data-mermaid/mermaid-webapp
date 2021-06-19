import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import theme from '../../../../theme'
import { InputRow } from '../../../generic/form'

const partial_restriction_choices = {
  periodic_closure: 'Periodic Closure',
  size_limits: 'Size Limits',
  gear_restriction: 'Gear Restriction',
  species_restriction: 'Species Restriction',
  access_restriction: 'Access Restriction',
}

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

const ManagementRulesInput = ({ id, label, managementRulesObj, onChange }) => {
  const managementRulesArray = Object.entries(managementRulesObj)
  const getManagementRulesStates = (rules) => {
    return rules.filter((item) => item[1]).map((filterItem) => filterItem[0])
  }

  const [managementRulesStates, setManagementRulesStates] = useState(
    getManagementRulesStates(managementRulesArray),
  )
  const [partialRestrictionSelected, setPartialRestrictionSelected] = useState(
    !managementRulesObj.open_access && !managementRulesObj.no_take,
  )

  const handleManagementRulesChange = (e) => {
    const currentSelectedRadioValue = e.target.value

    if (currentSelectedRadioValue === 'partial_restrictions')
      setPartialRestrictionSelected(true)
    else setPartialRestrictionSelected(false)

    const updatedManagementRulesArray = managementRulesArray.map((item) => [
      item[0],
      item[0] === currentSelectedRadioValue,
    ])

    const updatedManagementRules = getManagementRulesStates(
      updatedManagementRulesArray,
    )

    setManagementRulesStates(updatedManagementRules)

    const selectedManagementRulesItemsToForm = Object.fromEntries(
      updatedManagementRulesArray,
    )

    onChange(selectedManagementRulesItemsToForm)
  }

  const handlePartialRestrictionChoicesChange = (e) => {
    const currentSelectedCheckboxValue = e.target.value
    const partialRestrictedChoices = [...managementRulesStates]
    const foundIndex = partialRestrictedChoices.indexOf(
      currentSelectedCheckboxValue,
    )

    if (foundIndex > -1) {
      partialRestrictedChoices.splice(foundIndex, 1)
    } else {
      partialRestrictedChoices.push(currentSelectedCheckboxValue)
    }

    const updatedManagementRulesArray = managementRulesArray.map((item) => [
      item[0],
      partialRestrictedChoices.includes(item[0]),
    ])

    setManagementRulesStates(partialRestrictedChoices)

    const selectedManagementRulesItemsToForm = Object.fromEntries(
      updatedManagementRulesArray,
    )

    onChange(selectedManagementRulesItemsToForm)
  }

  const showPartialRestrictionChoices =
    partialRestrictionSelected &&
    Object.keys(partial_restriction_choices).map((item) => (
      <CheckBoxLabel key={item}>
        <input
          id={item}
          type="checkbox"
          value={item}
          checked={managementRulesStates.includes(item)}
          onChange={handlePartialRestrictionChoicesChange}
        />
        <span htmlFor={item}>{partial_restriction_choices[item]}</span>
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
              checked={managementRulesStates.includes('open_access')}
              onChange={handleManagementRulesChange}
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
              checked={managementRulesStates.includes('no_take')}
              onChange={handleManagementRulesChange}
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
              value="partial_restrictions"
              checked={partialRestrictionSelected}
              onChange={handleManagementRulesChange}
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
  managementRulesObj: PropTypes.shape({
    open_access: PropTypes.bool,
    no_take: PropTypes.bool,
    access_restriction: PropTypes.bool,
    periodic_closure: PropTypes.bool,
    size_limits: PropTypes.bool,
    gear_restriction: PropTypes.bool,
    species_restriction: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

ManagementRulesInput.defaultProps = {
  id: 'rules',
  label: 'Rules',
}

export default ManagementRulesInput
