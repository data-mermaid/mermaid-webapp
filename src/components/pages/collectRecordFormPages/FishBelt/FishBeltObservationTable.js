import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import {
  ButtonCaution,
  ButtonThatLooksLikeLink,
  ButtonPrimary,
  ButtonSecondary,
} from '../../../generic/buttons'
import { choicesPropType, fishBeltPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { FishBeltObservationSizeSelect } from './FishBeltObservationSizeSelect'
import { getFishBinLabel } from './fishBeltBins'
import { getObservationBiomass } from './fishbeltBiomas'
import { H2 } from '../../../generic/text'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../../../library/styling/mediaQueries'
import { IconClose, IconLibraryBooks, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { inputTextareaSelectStyles, InputWrapper } from '../../../generic/form'
import { LinkThatLooksLikeButton } from '../../../generic/links'
import { roundToOneDecimal } from '../../../../library/Numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { Table, TableOverflowWrapper, Tr, Td, Th } from '../../../generic/Table/table'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputAutocomplete from '../../../generic/InputAutocomplete'
import InputNumberNoScroll from '../../../generic/InputNumberNoScroll/InputNumberNoScroll'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import language from '../../../../language'
import theme from '../../../../theme'

const ObservationTr = styled(Tr)`
  border-width: 0 0 0 ${theme.spacing.xsmall};
  border-style: solid;
  border-color: ${(props) => theme.color.getBorderColor(props.messageType)};
`
const CellValidation = styled(Td)``
const CellValidationButton = styled(ButtonSecondary)`
  font-size: smaller;
  padding: ${theme.spacing.xxsmall} ${theme.spacing.xsmall};
  margin: ${theme.spacing.xsmall};
  text-transform: capitalize;
`
const TableValidationList = styled.ul`
  padding: ${theme.spacing.xsmall};
  margin: 0;
  list-style: none; ;
`
const FishNameAutocomplete = styled(InputAutocomplete)`
  & input {
    border: none;
  }
  width: 100%;
  text-align: inherit;
  padding: 0;
`

const InputAutocompleteContainer = styled.div`
  ${inputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  padding: 0;
  border: none;
  background: transparent;
`
const ObservationsSummaryStats = styled(Table)`
  width: 25%;
  table-layout: auto;
  min-width: auto;
  max-width: 40rem;
  border: solid 1px ${theme.color.secondaryColor};
  tr:nth-child(even),
  tr:nth-child(odd) {
    background-color: ${theme.color.white};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    font-size: smaller;
  `)}
`
const ButtonRemoveRow = styled(ButtonCaution)`
  display: none;
  padding: 0;
`
const StyledLinkThatLooksLikeButtonToReference = styled(LinkThatLooksLikeButton)`
  padding: 0.5rem 1rem 0 1rem;
  background: transparent;
`
const StyledOverflowWrapper = styled(TableOverflowWrapper)`
  border: solid 1px ${theme.color.secondaryColor};
  height: 100%;
  overflow-y: visible;
`
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
const StyledFishBeltObservationTable = styled(Table)`
  table-layout: auto;
  font-variant: tabular-nums;
  font-feature-settings: 'tnum';
  tr {
    &:focus-within button,
    &:hover button {
      display: inline;
      cursor: pointer;
    }
    th {
      padding: ${theme.spacing.small};
    }
    td {
      padding: 0rem;
      & > div {
        background: transparent;
        border: none;
        span {
          line-height: 1.6;
          background: rgba(255, 255, 255, 0.5);
        }
      }
      input,
      select {
        background: transparent;
        border: none;
        padding: 1px 3px;
        height: 4rem;
        ${hoverState(css`
          outline: ${theme.color.outline};
        `)}
      }
    }
  }
`
const UnderTableRow = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: ${theme.spacing.medium};
  ${mediaQueryTabletLandscapeOnly(css`
    flex-direction: column;
    gap: ${theme.spacing.small};
  `)}
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
  choices,
  collectRecord,
  fishBinSelected,
  fishNameConstants,
  fishNameOptions,
  ignoreObservationValidations,
  observationsReducer,
  openNewFishNameModal,
  persistUnsavedObservationsUtilities,
  resetObservationValidations,
  setAreObservationsInputsDirty,
  transectLengthSurveyed,
  widthId,
}) => {
  const [haveApiObservationsBeenLoaded, setHaveApiObservationsBeenLoaded] = useState(false)
  const [isAutoFocusAllowed, setIsAutoFocusAllowed] = useState(false)
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
    if (!haveApiObservationsBeenLoaded && collectRecord) {
      const observationsFromApi = collectRecord.data.obs_belt_fishes ?? []
      const persistedUnsavedObservations = getPersistedUnsavedObservationsData()
      const initialObservationsToLoad = persistedUnsavedObservations ?? observationsFromApi

      observationsDispatch({
        type: 'loadObservationsFromApi',
        payload: initialObservationsToLoad,
      })

      setHaveApiObservationsBeenLoaded(true)
    }
  }, [
    collectRecord,
    getPersistedUnsavedObservationsData,
    haveApiObservationsBeenLoaded,
    observationsDispatch,
  ])

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setIsAutoFocusAllowed(true)
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
        setIsAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation },
        })
      }

      if (isEnterKey && !isFishName) {
        event.preventDefault()
        setIsAutoFocusAllowed(true)
        observationsDispatch({
          type: 'addNewObservationBelow',
          payload: {
            referenceObservation: observation,
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
          {isObservationValid ? <span aria-label="Passed validation">&nbsp;</span> : null}
          {hasErrorValidation || hasWarningValidation ? (
            <TableValidationList>
              {observationValidationMessages.map((validation) => (
                <li key={validation.id}>{validation.message}</li>
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

      const proposeNewSpeciesClick = () => openNewFishNameModal(observationId)

      return (
        <ObservationTr key={observationId} messageType={validationType}>
          <Td align="center">{rowNumber}</Td>
          <Td align="left">
            {fishNameOptions.length && (
              <InputAutocompleteContainer>
                <FishNameAutocomplete
                  id={`observation-${observationId}`}
                  // we only want autofocus to take over focus after the user adds
                  // new observations, not before. Otherwise initial page load focus
                  // is on the most recently painted observation instead of default focus.
                  // This approach seems easier than handling a list of refs for each observation
                  // and the logic to focus on the right one. in react autoFocus just focuses
                  // the newest element with the autoFocus tag
                  autoFocus={isAutoFocusAllowed}
                  aria-labelledby="fish-name-label"
                  options={fishNameOptions}
                  onChange={handleFishNameChange}
                  onKeyDown={handleFishNameKeyDown}
                  value={fish_attribute}
                  noResultsDisplay={
                    <ButtonThatLooksLikeLink type="button" onClick={proposeNewSpeciesClick}>
                      {language.pages.collectRecord.newFishSpeciesLink}
                    </ButtonThatLooksLikeLink>
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
    isAutoFocusAllowed,
    observationsBiomass,
    observationsDispatch,
    observationsState,
    openNewFishNameModal,
    resetObservationValidations,
    setAreObservationsInputsDirty,
  ])

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">Observations</H2>
        <StyledOverflowWrapper>
          <StyledFishBeltObservationTable aria-labelledby="table-label">
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
                  Fish Name
                </Th>
                <Th align="right" id="fish-size-label">
                  Size
                </Th>
                <Th align="right" id="fish-count-label">
                  Count
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
          </StyledFishBeltObservationTable>
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
    </>
  )
}

FishBeltObservationTable.propTypes = {
  areObservationsInputsDirty: PropTypes.bool.isRequired,
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  fishBinSelected: PropTypes.string,
  fishNameConstants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      biomass_constant_a: PropTypes.number,
      biomass_constant_b: PropTypes.number,
      biomass_constant_c: PropTypes.number,
    }),
  ).isRequired,
  fishNameOptions: inputOptionsPropTypes.isRequired,
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: PropTypes.arrayOf(PropTypes.any).isRequired,
  openNewFishNameModal: PropTypes.func.isRequired,
  persistUnsavedObservationsUtilities: PropTypes.shape({
    persistUnsavedFormData: PropTypes.func,
    clearPersistedUnsavedFormData: PropTypes.func,
    getPersistedUnsavedFormData: PropTypes.func,
  }).isRequired,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  transectLengthSurveyed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  widthId: PropTypes.string,
}

FishBeltObservationTable.defaultProps = {
  collectRecord: undefined,
  fishBinSelected: undefined,
  transectLengthSurveyed: undefined,
  widthId: undefined,
}

export default FishBeltObservationTable
