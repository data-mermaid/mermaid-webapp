import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  ButtonRemoveRow,
  CellValidation,
  CellValidationButton,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationAutocomplete,
  ObservationTr,
  StyledLinkThatLooksLikeButtonToReference,
  StyledOverflowWrapper,
  StyledObservationTable,
  TableValidationList,
  UnderTableRow,
} from '../CollectingFormPage.Styles'
import { ButtonPrimary } from '../../../generic/buttons'
import {
  choicesPropType,
  benthicPhotoQuadratPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { H2 } from '../../../generic/text'
import { IconClose, IconLibraryBooks, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import InputNumberNoScroll from '../../../generic/InputNumberNoScroll/InputNumberNoScroll'
import language from '../../../../language'
import { getOptions } from '../../../../library/getOptions'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'

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

const getObservationValidations = (observationId, collectRecord) => {
  const allObservationsValidations =
    collectRecord?.validations?.results?.data?.obs_benthic_photo_quadrats ?? []

  const justThisObservationsValidations = allObservationsValidations.flat().filter((validation) => {
    return validation.context?.observation_id === observationId
  })

  return justThisObservationsValidations
}
const BenthicPhotoQuadratObservationTable = ({
  areObservationsInputsDirty,
  areValidationsShowing,
  benthicAttributeOptions,
  choices,
  collectRecord,
  observationsReducer,
  openNewBenthicAttributeModal,
  persistUnsavedObservationsUtilities,
  ignoreObservationValidations,
  resetObservationValidations,
  setAreObservationsInputsDirty,
}) => {
  const [apiObservationsLoaded, setApiObservationsLoaded] = useState(false)
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

  const _loadObservationsFromApiIntoState = useEffect(() => {
    if (!apiObservationsLoaded && collectRecord) {
      const observationsFromApi = collectRecord.data.obs_benthic_photo_quadrats ?? []

      const persistedUnsavedObservations = getPersistedUnsavedObservationsData()
      const initialObservationsToLoad = persistedUnsavedObservations ?? observationsFromApi

      observationsDispatch({
        type: 'loadObservationsFromApi',
        payload: initialObservationsToLoad,
      })

      setApiObservationsLoaded(true)
    }
  }, [
    collectRecord,
    getPersistedUnsavedObservationsData,
    apiObservationsLoaded,
    observationsDispatch,
  ])

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation' })
  }

  const observationsRows = useMemo(() => {
    const growthFormOptions = getOptions(choices.growthforms)

    const handleKeyDown = ({ event, index, observation, isBenthicAttribute, isNumberOfPoints }) => {
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
      }

      if (isEnterKey && !isBenthicAttribute) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'addNewObservationBelow',
          payload: {
            referenceObservationIndex: index,
          },
        })
      }
    }

    return observationsState.map((observation, index) => {
      const rowNumber = index + 1
      const { id: observationId, quadrat_number, attribute, growth_form, num_points } = observation

      const quadratNumberOrEmptyStringToAvoidInputValueErrors = quadrat_number ?? ''
      const growthFormOrEmptyStringToAvoidInputValueErrors = growth_form ?? ''
      const numberOfPointsOrEmptyStringToAvoidInputValueErrors = num_points ?? ''

      const observationValidations = getObservationValidations(observationId, collectRecord)
      const observationValidationsToDisplay = getValidationPropertiesForInput(
        observationValidations,
        areValidationsShowing,
      )

      const { validationType } = observationValidationsToDisplay
      const observationValidationMessages =
        observationValidationsToDisplay?.validationMessages ?? []

      const isObservationValid = validationType === 'ok'
      const hasWarningValidation = validationType === 'warning'
      const hasErrorValidation = validationType === 'error'
      const hasIgnoredValidation = validationType === 'ignore'

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
      }

      const handleNumberOfPointsChange = (event) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateNumberOfPoints',
          payload: { newNumberOfPoints: event.target.value, observationId },
        })
      }

      const handleBenthicAttributeKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isBenthicAttribute: true })
      }

      const handleQuadratNumberKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      const handleGrowthFormKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      const handleNumberOfPointsKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isNumberOfPoints: true })
      }

      const handleIgnoreObservationValidations = () => {
        ignoreObservationValidations({
          observationId,
        })
      }

      const handleResetObservationValidations = () => {
        resetObservationValidations({
          observationId,
        })
      }

      const validationsMarkup = (
        <CellValidation>
          {isObservationValid ? <span aria-label="Passed Validation">&nbsp;</span> : null}
          {hasErrorValidation || hasWarningValidation ? (
            <TableValidationList>
              {observationValidationMessages.map((validation) => (
                <li key={validation.id}>{language.getValidationMessage(validation)}</li>
              ))}
            </TableValidationList>
          ) : null}
          {hasWarningValidation ? (
            <CellValidationButton type="button" onClick={handleIgnoreObservationValidations}>
              Ignore warning
            </CellValidationButton>
          ) : null}
          {hasIgnoredValidation ? (
            <>
              Ignored
              <CellValidationButton type="button" onClick={handleResetObservationValidations}>
                Reset validations
              </CellValidationButton>
            </>
          ) : null}
        </CellValidation>
      )
      const proposeNewBenthicAttributeClick = () => openNewBenthicAttributeModal(observationId)

      return (
        <ObservationTr key={observationId}>
          <Td align="center">{rowNumber}</Td>
          <Td align="right">
            <InputNumberNoScroll
              type="number"
              autoFocus={autoFocusAllowed}
              min="0"
              value={quadratNumberOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="quadrat-number-label"
              onChange={handleQuadratNumberChange}
              onKeyDown={handleQuadratNumberKeyDown}
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
                  onKeyDown={handleBenthicAttributeKeyDown}
                  value={attribute}
                  noResultsText={language.autocomplete.noResultsDefault}
                  noResultsAction={
                    <NewOptionButton type="button" onClick={proposeNewBenthicAttributeClick}>
                      {language.pages.collectRecord.newBenthicAttributeLink}
                    </NewOptionButton>
                  }
                />
                {attribute && (
                  <StyledLinkThatLooksLikeButtonToReference
                    aria-label="benthic attribute reference"
                    target="_blank"
                    tabIndex="-1"
                    href={`https://dev-collect.datamermaid.org/#/reference/benthicattributes/${attribute}`}
                  >
                    <IconLibraryBooks />
                  </StyledLinkThatLooksLikeButtonToReference>
                )}
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">
            <Select
              onChange={handleGrowthFormChange}
              onKeyDown={handleGrowthFormKeyDown}
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
            <InputNumberNoScroll
              type="number"
              min="0"
              value={numberOfPointsOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="number-of-points-label"
              onChange={handleNumberOfPointsChange}
              onKeyDown={handleNumberOfPointsKeyDown}
            />
          </Td>
          {areValidationsShowing ? validationsMarkup : null}
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
    openNewBenthicAttributeModal,
    ignoreObservationValidations,
    resetObservationValidations,
    setAreObservationsInputsDirty,
  ])

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">Observations</H2>
        <StyledOverflowWrapper>
          <StyledObservationTable aria-labelledby="table-label">
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
                  Growth Form <RequiredIndicator />
                </Th>
                <Th align="right" id="number-of-points-label">
                  Number of Points <RequiredIndicator />
                </Th>
                {areValidationsShowing ? <Th align="center">Validations</Th> : null}
                <Th> </Th>
              </Tr>
            </thead>
            <tbody>{observationsRows}</tbody>
          </StyledObservationTable>
        </StyledOverflowWrapper>
        <UnderTableRow>
          <ButtonPrimary type="button" onClick={handleAddObservation}>
            <IconPlus /> Add Row
          </ButtonPrimary>
        </UnderTableRow>
      </InputWrapper>
    </>
  )
}

BenthicPhotoQuadratObservationTable.propTypes = {
  areObservationsInputsDirty: PropTypes.bool.isRequired,
  areValidationsShowing: PropTypes.bool.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: benthicPhotoQuadratPropType,
  observationsReducer: observationsReducerPropType,
  openNewBenthicAttributeModal: PropTypes.func.isRequired,
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
