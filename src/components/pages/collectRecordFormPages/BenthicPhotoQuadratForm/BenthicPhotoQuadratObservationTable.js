import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'

import {
  ButtonRemoveRow,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationsSummaryStats,
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTable,
  UnderTableRow,
} from '../CollectingFormPage.Styles'
import { ButtonPrimary } from '../../../generic/buttons'
import {
  choicesPropType,
  benthicPhotoQuadratPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPageAlternative/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import language from '../../../../language'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'

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
  areObservationsInputsDirty,
  areValidationsShowing,
  benthicAttributeOptions,
  choices,
  collectRecord,
  observationsReducer,
  openNewObservationModal,
  persistUnsavedObservationsUtilities,
  ignoreObservationValidations,
  resetObservationValidations,
  setAreObservationsInputsDirty,
}) => {
  const [isObservationReducerInitialized, setIsObservationReducerInitialized] = useState(false)
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [observationsState, observationsDispatch] = observationsReducer

  const {
    persistUnsavedFormData: persistUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities

  const _ensureUnsavedObservationsArePersisted = useEffect(() => {
    if (areObservationsInputsDirty) {
      persistUnsavedObservationsData(observationsState)
    }
  }, [areObservationsInputsDirty, observationsState, persistUnsavedObservationsData])

  const handleAddEmptyInitialObservation = useCallback(() => {
    setAreObservationsInputsDirty(true)

    observationsDispatch({ type: 'addObservation' })
  }, [observationsDispatch, setAreObservationsInputsDirty])

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation' })
  }

  const _initializeObservationReducer = useEffect(() => {
    if (!isObservationReducerInitialized && collectRecord) {
      const observationsFromApi = collectRecord.data.obs_benthic_photo_quadrats ?? []

      const persistedUnsavedObservations = getPersistedUnsavedObservationsData()
      const initialObservationsToLoad = persistedUnsavedObservations ?? observationsFromApi

      if (initialObservationsToLoad.length) {
        observationsDispatch({
          type: 'loadObservationsFromApi',
          payload: initialObservationsToLoad,
        })
      }
      if (!initialObservationsToLoad.length) {
        handleAddEmptyInitialObservation()
      }

      setIsObservationReducerInitialized(true)
    }
    if (!isObservationReducerInitialized && !collectRecord) {
      handleAddEmptyInitialObservation()
      setIsObservationReducerInitialized(true)
    }
  }, [
    collectRecord,
    getPersistedUnsavedObservationsData,
    isObservationReducerInitialized,
    observationsDispatch,
    handleAddEmptyInitialObservation,
  ])

  const observationCategoryPercentages = useMemo(() => {
    const getCategory = (benthicAttributeId) =>
      benthicAttributeOptions.find((benthic) => benthic.value === benthicAttributeId)

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
  }, [observationsState, benthicAttributeOptions])

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

      const proposeNewBenthicAttributeClick = () => openNewObservationModal(observationId)

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
            {benthicAttributeOptions.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  aria-labelledby="benthic-attribute-label"
                  options={benthicAttributeOptions}
                  onChange={handleBenthicAttributeChange}
                  value={attribute}
                  noResultsText={language.autocomplete.noResultsDefault}
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
    benthicAttributeOptions,
    collectRecord,
    choices,
    observationsDispatch,
    observationsState,
    openNewObservationModal,
    ignoreObservationValidations,
    resetObservationValidations,
    setAreObservationsInputsDirty,
  ])

  return (
    <InputWrapper>
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
                Quadrat <RequiredIndicator />
              </Th>
              <Th align="left" id="benthic-attribute-label">
                Benthic Attribute <RequiredIndicator />
              </Th>
              <Th align="right" id="growth-form-label">
                Growth Form
              </Th>
              <Th align="right" id="number-of-points-label">
                Number of Points <RequiredIndicator />
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
  areObservationsInputsDirty: PropTypes.bool.isRequired,
  areValidationsShowing: PropTypes.bool.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: benthicPhotoQuadratPropType,
  observationsReducer: observationsReducerPropType,
  openNewObservationModal: PropTypes.func.isRequired,
  persistUnsavedObservationsUtilities: PropTypes.shape({
    persistUnsavedFormData: PropTypes.func,
    clearPersistedUnsavedFormData: PropTypes.func,
    getPersistedUnsavedFormData: PropTypes.func,
  }).isRequired,
  ignoreObservationValidations: PropTypes.func.isRequired,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
}

BenthicPhotoQuadratObservationTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
}

export default BenthicPhotoQuadratObservationTable
