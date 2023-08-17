import PropTypes from 'prop-types'
import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'

import {
  ButtonRemoveRow,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTable,
  UnderTableRow,
} from '../CollectingFormPage.Styles'
import { ButtonPrimary, IconButton } from '../../../generic/buttons'
import {
  choicesPropType,
  benthicPhotoQuadratPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus, IconInfo } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, LabelContainer, RequiredIndicator, Select } from '../../../generic/form'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { ObservationsSummaryStats, Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'

import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import ColumnHeaderToolTip from '../../../ColumnHeaderToolTip/ColumnHeaderToolTip'
import language from '../../../../language'

const StyledColgroup = styled('colgroup')`
  col {
    &.number {
      width: 5rem;
    }
    &.quadrat {
      width: 15rem;
    }
    &.benthicAttribute {
      width: auto;
    }
    &.growthForm {
      width: 20%;
    }
    &.numberOfPoints {
      width: 20rem;
    }
    &.validation {
      width: auto;
    }
    &.remove {
      width: 5rem;
    }
  }
`

const BenthicPhotoQuadratObservationTable = ({
  areValidationsShowing,
  benthicAttributeSelectOptions,
  choices,
  collectRecord,
  ignoreObservationValidations,
  observationsReducer,
  resetObservationValidations,
  setAreObservationsInputsDirty,
  setIsNewBenthicAttributeModalOpen,
  setObservationIdToAddNewBenthicAttributeTo,
  testId,
}) => {
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [observationsState, observationsDispatch] = observationsReducer
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [currentHelperTextLabel, setCurrentHelperTextLabel] = useState(null)

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation' })
  }

  const _useOnClickOutsideOfInfoIcon = useEffect(() => {
    document.body.addEventListener('click', () => {
      if (isHelperTextShowing === true) {
        setIsHelperTextShowing(false)
      }
    })
  }, [isHelperTextShowing])

  const handleInfoIconClick = (event, label) => {
    if (currentHelperTextLabel === label) {
      isHelperTextShowing ? setIsHelperTextShowing(false) : setIsHelperTextShowing(true)
    } else {
      setIsHelperTextShowing(true)
      setCurrentHelperTextLabel(label)
    }

    event.stopPropagation()
  }

  const observationCategoryPercentages = useMemo(() => {
    const getCategory = (benthicAttributeId) =>
      benthicAttributeSelectOptions.find((benthic) => benthic.value === benthicAttributeId)

    const addTopCategoryInfoToObservation = observationsState.map((obs) => {
      const benthicAttribute = getCategory(obs.attribute)

      return { ...obs, top_level_category: benthicAttribute?.topLevelCategory }
    })

    const categoryGroups = addTopCategoryInfoToObservation.reduce((accumulator, obs) => {
      const benthicAttributeName = getCategory(obs.top_level_category)?.label

      accumulator[benthicAttributeName] = accumulator[benthicAttributeName] || []
      accumulator[benthicAttributeName].push(obs)

      return accumulator
    }, {})

    const categoryNames = Object.keys(categoryGroups).sort()
    const totalNumberOfPoints = summarizeArrayObjectValuesByProperty(
      observationsState,
      'num_points',
    )
    const categoryPercentages = categoryNames.map((category) => {
      const categoryPercentage =
        (summarizeArrayObjectValuesByProperty(categoryGroups[category], 'num_points') /
          totalNumberOfPoints) *
        100

      return {
        benthicAttribute: category,
        benthicAttributePercentage: roundToOneDecimal(categoryPercentage),
      }
    })

    return categoryPercentages
  }, [observationsState, benthicAttributeSelectOptions])

  const observationsRows = useMemo(() => {
    const growthFormOptions = getOptions(choices.growthforms.data)

    const handleKeyDown = ({ event, index, observation, isNumberOfPoints }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isNumberOfPoints) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation },
        })
        setAreObservationsInputsDirty(true)
      }

      if (isEnterKey) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'addNewObservationBelow',
          payload: {
            referenceObservationIndex: index,
          },
        })
        setAreObservationsInputsDirty(true)
      }
    }

    return observationsState.map((observation, index) => {
      const rowNumber = index + 1
      const { id: observationId, quadrat_number, attribute, growth_form, num_points } = observation

      const quadratNumberOrEmptyStringToAvoidInputValueErrors = quadrat_number ?? ''
      const growthFormOrEmptyStringToAvoidInputValueErrors = growth_form ?? ''
      const numberOfPointsOrEmptyStringToAvoidInputValueErrors = num_points ?? ''

      const {
        isObservationValid,
        hasObservationWarningValidation,
        hasObservationErrorValidation,
        hasObservationIgnoredValidation,
        observationValidationMessages,
        observationValidationType,
      } = getObservationValidationInfo({
        observationId,
        collectRecord,
        areValidationsShowing,
        observationsPropertyName: getObservationsPropertyNames(collectRecord)[0],
      })

      const handleDeleteObservation = () => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({ type: 'deleteObservation', payload: observationId })
      }

      const handleQuadratNumberChange = (event) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateQuadratNumber',
          payload: { newQuadratNumber: event.target.value, observationId },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const handleBenthicAttributeChange = (selectedOption) => {
        const newBenthicAttribute = selectedOption.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateBenthicAttribute',
          payload: {
            newBenthicAttribute,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const handleGrowthFormChange = (selectedOption) => {
        const newGrowthForm = selectedOption.target.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateGrowthForm',
          payload: {
            newGrowthForm,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const handleNumberOfPointsChange = (event) => {
        const regExNumbers = new RegExp(/\D/g)
        const newValue = event.target.value.replace(regExNumbers, '')

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateNumberOfPoints',
          payload: { newNumberOfPoints: newValue, observationId },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const proposeNewBenthicAttributeClick = () => {
        setObservationIdToAddNewBenthicAttributeTo(observationId)
        setIsNewBenthicAttributeModalOpen(true)
      }

      const handleObservationKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      return (
        <ObservationTr key={observationId}>
          <Td align="center">{rowNumber}</Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              type="number"
              autoFocus={autoFocusAllowed}
              min="0"
              value={quadratNumberOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="quadrat-number-label"
              onChange={handleQuadratNumberChange}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="left">
            {benthicAttributeSelectOptions.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  aria-labelledby="benthic-attribute-label"
                  autoFocus={autoFocusAllowed}
                  isLastRow={observationsState.length === rowNumber}
                  noResultsText={language.autocomplete.noResultsDefault}
                  onChange={handleBenthicAttributeChange}
                  options={benthicAttributeSelectOptions}
                  value={attribute}
                  noResultsAction={
                    <NewOptionButton type="button" onClick={proposeNewBenthicAttributeClick}>
                      {language.pages.collectRecord.newBenthicAttributeLink}
                    </NewOptionButton>
                  }
                />
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">
            <Select
              onChange={handleGrowthFormChange}
              onKeyDown={handleObservationKeyDown}
              value={growthFormOrEmptyStringToAvoidInputValueErrors}
              aria-labelledby="growth-form-label"
            >
              <option value=""> </option>
              {growthFormOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              value={numberOfPointsOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="number-of-points-label"
              onChange={handleNumberOfPointsChange}
              onKeyDown={(event) => {
                handleKeyDown({ event, index, observation, isNumberOfPoints: true })
              }}
            />
          </Td>
          {areValidationsShowing ? (
            <ObservationValidationInfo
              hasObservationErrorValidation={hasObservationErrorValidation}
              hasObservationIgnoredValidation={hasObservationIgnoredValidation}
              hasObservationWarningValidation={hasObservationWarningValidation}
              ignoreObservationValidations={ignoreObservationValidations}
              isObservationValid={isObservationValid}
              observationId={observationId}
              observationValidationMessages={observationValidationMessages}
              observationValidationType={observationValidationType}
              resetObservationValidations={resetObservationValidations}
            />
          ) : null}
          <Td align="center">
            <ButtonRemoveRow
              tabIndex="-1"
              type="button"
              onClick={handleDeleteObservation}
              aria-label="Delete Observation"
            >
              <IconClose />
            </ButtonRemoveRow>
          </Td>
        </ObservationTr>
      )
    })
  }, [
    areValidationsShowing,
    autoFocusAllowed,
    benthicAttributeSelectOptions,
    choices.growthforms.data,
    collectRecord,
    ignoreObservationValidations,
    observationsDispatch,
    observationsState,
    resetObservationValidations,
    setAreObservationsInputsDirty,
    setIsNewBenthicAttributeModalOpen,
    setObservationIdToAddNewBenthicAttributeTo,
  ])

  return (
    <InputWrapper data-testid={testId}>
      <H2 id="table-label">Observations</H2>
      <StyledOverflowWrapper>
        <StickyObservationTable aria-labelledby="table-label">
          <StyledColgroup>
            <col className="number" />
            <col className="quadrat" />
            <col className="benthicAttribute" />
            <col className="growthForm" />
            <col className="numberOfPoints" />
            {areValidationsShowing ? <col className="validations" /> : null}
            <col className="remove" />
          </StyledColgroup>
          <thead>
            <Tr>
              <Th> </Th>
              <Th align="right" id="quadrat-number-label">
                <LabelContainer>
                  Quadrat <RequiredIndicator />
                  {isHelperTextShowing && currentHelperTextLabel === 'quadrat' ? (
                    <ColumnHeaderToolTip helperText={language.tooltipText.quadrat} left="-2em" />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'quadrat')}
                  >
                    <IconInfo aria-label="info" />
                  </IconButton>
                </LabelContainer>
              </Th>
              <Th align="left" id="benthic-attribute-label">
                <LabelContainer>
                  Benthic Attribute <RequiredIndicator />
                  {isHelperTextShowing && currentHelperTextLabel === 'benthicAttribute' ? (
                    <ColumnHeaderToolTip
                      helperText={language.tooltipText.getBenthicAttribute()}
                      left="4.2em"
                    />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'benthicAttribute')}
                  >
                    <IconInfo aria-label="info" />
                  </IconButton>
                </LabelContainer>
              </Th>
              <Th align="right" id="growth-form-label">
                <LabelContainer>
                  <div>Growth Form</div>
                  {isHelperTextShowing && currentHelperTextLabel === 'growthForm' ? (
                    <ColumnHeaderToolTip
                      helperText={language.tooltipText.getBenthicAttribute()}
                      left="0.2em"
                    />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'growthForm')}
                  >
                    <IconInfo aria-label="info" />
                  </IconButton>
                </LabelContainer>
              </Th>
              <Th align="right" id="number-of-points-label">
                <LabelContainer>
                  Number of Points <RequiredIndicator />
                  {isHelperTextShowing && currentHelperTextLabel === 'numberOfPoints' ? (
                    <ColumnHeaderToolTip helperText={language.tooltipText.numberOfPoints} />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'numberOfPoints')}
                  >
                    <IconInfo aria-label="info" />
                  </IconButton>
                </LabelContainer>
              </Th>
              {areValidationsShowing ? <Th align="center">Validations</Th> : null}
              <Th> </Th>
            </Tr>
          </thead>
          <tbody>{observationsRows}</tbody>
        </StickyObservationTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <ButtonPrimary type="button" onClick={handleAddObservation}>
          <IconPlus /> Add Row
        </ButtonPrimary>
        <ObservationsSummaryStats>
          <tbody>
            {observationCategoryPercentages.map((obs) => {
              const isPercentageAvailable = !Number.isNaN(
                parseFloat(obs.benthicAttributePercentage),
              )

              return (
                isPercentageAvailable && (
                  <Tr key={obs.benthicAttribute}>
                    <Th>{`% ${obs.benthicAttribute}`}</Th>
                    <Td>{obs.benthicAttributePercentage}</Td>
                  </Tr>
                )
              )
            })}
          </tbody>
        </ObservationsSummaryStats>
      </UnderTableRow>
    </InputWrapper>
  )
}

BenthicPhotoQuadratObservationTable.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  benthicAttributeSelectOptions: inputOptionsPropTypes.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: benthicPhotoQuadratPropType,
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  formik: PropTypes.shape({
    values: PropTypes.shape({
      interval_start: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      interval_size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }).isRequired,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func.isRequired,
  setIsNewBenthicAttributeModalOpen: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
}

BenthicPhotoQuadratObservationTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
}

export default BenthicPhotoQuadratObservationTable
