import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '../../../generic/buttons'
import {
  choicesPropType,
  fishBeltPropType,
  observationsReducerPropType,
  fishNameConstantsPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { FishBeltObservationSizeSelect } from './FishBeltObservationSizeSelect'
import { getFishBinLabel } from './fishBeltBins'
import { getObservationBiomass } from './fishBeltBiomass'
import { H2 } from '../../../generic/text'
import { IconClose, IconLibraryBooks, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, RequiredIndicator } from '../../../generic/form'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputNumberNoScroll from '../../../generic/InputNumberNoScroll/InputNumberNoScroll'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import language from '../../../../language'
import {
  ButtonRemoveRow,
  CellValidation,
  CellValidationButton,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationAutocomplete,
  ObservationsSummaryStats,
  ObservationTr,
  StyledLinkThatLooksLikeButtonToReference,
  StyledOverflowWrapper,
  StickyObservationTable,
  TableValidationList,
  UnderTableRow,
} from '../CollectingFormPage.Styles'

const StyledColgroup = styled('colgroup')`
  col {
    &.number {
      width: 5rem;
    }
    &.fishName {
      width: auto;
    }
    &.size {
      width: 15%;
    }
    &.count {
      width: 10%;
    }
    &.biomass {
      width: 10rem;
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
    collectRecord?.validations?.results?.data?.obs_belt_fishes ?? []

  const justThisObservationsValidations = allObservationsValidations.flat().filter((validation) => {
    return validation.context?.observation_id === observationId
  })

  return justThisObservationsValidations
}

const FishBeltObservationTable = ({
  areObservationsInputsDirty,
  areValidationsShowing,
  formik,
  choices,
  collectRecord,
  fishNameConstants,
  fishNameOptions,
  ignoreObservationValidations,
  observationsReducer,
  openNewObservationModal,
  persistUnsavedObservationsUtilities,
  resetObservationValidations,
  setAreObservationsInputsDirty,
}) => {
  const {
    size_bin: fishBinSelected,
    len_surveyed: transectLengthSurveyed,
    width: widthId,
  } = formik?.values
  const [apiObservationsLoaded, setApiObservationsLoaded] = useState(false)
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [observationsState, observationsDispatch] = observationsReducer
  const fishBinSelectedLabel = getFishBinLabel(choices, fishBinSelected)
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
      const observationsFromApi = collectRecord.data.obs_belt_fishes ?? []
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

  const observationsBiomass = useMemo(
    () =>
      observationsState.map((observation) => ({
        id: observation.id,
        biomass: getObservationBiomass({
          choices,
          fishNameConstants,
          observation,
          transectLengthSurveyed,
          widthId,
        }),
      })),
    [choices, fishNameConstants, transectLengthSurveyed, widthId, observationsState],
  )

  const totalBiomass = useMemo(
    () => roundToOneDecimal(summarizeArrayObjectValuesByProperty(observationsBiomass, 'biomass')),
    [observationsBiomass],
  )

  const totalAbundance = useMemo(
    () => summarizeArrayObjectValuesByProperty(observationsState, 'count'),
    [observationsState],
  )

  const observationsRows = useMemo(() => {
    const handleKeyDown = ({ event, index, observation, isCount, isFishName }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isCount) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation },
        })
      }

      if (isEnterKey && !isFishName) {
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
      const { id: observationId, count, size, fish_attribute } = observation

      const handleDeleteObservation = () => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({ type: 'deleteObservation', payload: observationId })
      }

      const rowNumber = index + 1

      const sizeOrEmptyStringToAvoidInputValueErrors = size ?? ''
      const countOrEmptyStringToAvoidInputValueErrors = count ?? ''

      const showNumericSizeInput =
        fishBinSelectedLabel?.toString() === '1' || typeof fishBinSelectedLabel === 'undefined'

      const handleUpdateSize = (newSize) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateSize',
          payload: { newSize, observationId },
        })
      }

      const handleUpdateSizeEvent = (event) => {
        handleUpdateSize(event.target.value, observationId)
      }

      const handleObservationKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      const handleUpdateCount = (event) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateCount',
          payload: { newCount: event.target.value, observationId },
        })
      }

      const sizeSelect = !showNumericSizeInput ? (
        <FishBeltObservationSizeSelect
          onValueEntered={handleUpdateSize}
          onKeyDown={handleObservationKeyDown}
          fishBinSelectedLabel={fishBinSelectedLabel}
          value={sizeOrEmptyStringToAvoidInputValueErrors}
          labelledBy="fish-size-label"
        />
      ) : null

      const sizeInput = showNumericSizeInput ? (
        <InputNumberNoScrollWithUnit
          type="number"
          min="0"
          value={sizeOrEmptyStringToAvoidInputValueErrors}
          unit="cm"
          step="any"
          aria-labelledby="fish-size-label"
          onChange={handleUpdateSizeEvent}
          onKeyDown={handleObservationKeyDown}
        />
      ) : (
        <> {sizeSelect} </>
      )

      const observationBiomass = roundToOneDecimal(
        observationsBiomass.find((object) => object.id === observationId).biomass,
      )

      const observationValidations = getObservationValidations(observationId, collectRecord)

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

      const handleFishNameChange = (selectedOption) => {
        const newFishName = selectedOption.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateFishName',
          payload: {
            newFishName,
            observationId,
          },
        })
      }

      const handleFishNameKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isFishName: true })
      }

      const handleCountKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isCount: true })
      }

      const proposeNewSpeciesClick = () => openNewObservationModal(observationId)

      return (
        <ObservationTr key={observationId} messageType={validationType}>
          <Td align="center">{rowNumber}</Td>
          <Td align="left">
            {fishNameOptions.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  // we only want autofocus to take over focus after the user adds
                  // new observations, not before. Otherwise initial page load focus
                  // is on the most recently painted observation instead of default focus.
                  // This approach seems easier than handling a list of refs for each observation
                  // and the logic to focus on the right one. in react autoFocus just focuses
                  // the newest element with the autoFocus tag
                  autoFocus={autoFocusAllowed}
                  aria-labelledby="fish-name-label"
                  options={fishNameOptions}
                  onChange={handleFishNameChange}
                  onKeyDown={handleFishNameKeyDown}
                  value={fish_attribute}
                  noResultsText={language.autocomplete.noResultsDefault}
                  noResultsAction={
                    <NewOptionButton type="button" onClick={proposeNewSpeciesClick}>
                      {language.pages.collectRecord.newFishSpeciesLink}
                    </NewOptionButton>
                  }
                />
                {fish_attribute && (
                  <StyledLinkThatLooksLikeButtonToReference
                    aria-label="fish name reference"
                    target="_blank"
                    tabIndex="-1"
                    href={`https://dev-collect.datamermaid.org/#/reference/fishattributes/species/${fish_attribute}`}
                  >
                    <IconLibraryBooks />
                  </StyledLinkThatLooksLikeButtonToReference>
                )}
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">{sizeInput}</Td>
          <Td align="right">
            <InputNumberNoScroll
              type="number"
              min="0"
              value={countOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="fish-count-label"
              onChange={handleUpdateCount}
              onKeyDown={handleCountKeyDown}
            />
          </Td>
          <Td align="right">{observationBiomass ?? <> - </>}</Td>
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
    fishBinSelectedLabel,
    fishNameOptions,
    collectRecord,
    ignoreObservationValidations,
    autoFocusAllowed,
    observationsBiomass,
    observationsDispatch,
    observationsState,
    openNewObservationModal,
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
            <col className="fishName" />
            <col className="size" />
            <col className="count" />
            <col className="biomass" />
            {areValidationsShowing ? <col className="validations" /> : null}
            <col className="remove" />
          </StyledColgroup>
          <thead>
            <Tr>
              <Th> </Th>
              <Th align="left" id="fish-name-label">
                Fish Name <RequiredIndicator />
              </Th>
              <Th align="right" id="fish-size-label">
                Size <RequiredIndicator />
              </Th>
              <Th align="right" id="fish-count-label">
                Count <RequiredIndicator />
              </Th>
              <Th align="right">
                Biomass
                <br />
                <small>(kg/ha)</small>
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
            <Tr>
              <Th>{language.pages.collectRecord.totalBiomassLabel}</Th>
              <Td>{totalBiomass}</Td>
            </Tr>
            <Tr>
              <Th>{language.pages.collectRecord.totalAbundanceLabel}</Th>
              <Td>{totalAbundance}</Td>
            </Tr>
          </tbody>
        </ObservationsSummaryStats>
      </UnderTableRow>
    </InputWrapper>
  )
}

FishBeltObservationTable.propTypes = {
  areObservationsInputsDirty: PropTypes.bool.isRequired,
  areValidationsShowing: PropTypes.bool.isRequired,
  formik: formikPropType,
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  fishNameConstants: fishNameConstantsPropType.isRequired,
  fishNameOptions: inputOptionsPropTypes.isRequired,
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  openNewObservationModal: PropTypes.func.isRequired,
  persistUnsavedObservationsUtilities: PropTypes.shape({
    persistUnsavedFormData: PropTypes.func,
    clearPersistedUnsavedFormData: PropTypes.func,
    getPersistedUnsavedFormData: PropTypes.func,
  }).isRequired,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
}

FishBeltObservationTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
  formik: undefined,
}

export default FishBeltObservationTable