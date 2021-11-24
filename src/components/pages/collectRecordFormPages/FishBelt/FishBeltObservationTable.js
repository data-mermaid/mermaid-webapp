import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../../../library/styling/mediaQueries'
import {
  choicesPropType,
  fishBeltPropType,
  observationPropTypeShape,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  ButtonCaution,
  ButtonThatLooksLikeLink,
  ButtonPrimary,
  ButtonSecondary,
} from '../../../generic/buttons'
import { IconClose, IconLibraryBooks, IconPlus, IconRequired, IconCheck } from '../../../icons'
import { Table, TableOverflowWrapper, Tr, Td, Th } from '../../../generic/Table/table'
import { createUuid } from '../../../../library/createUuid'
import { FishBeltObservationSizeSelect } from './FishBeltObservationSizeSelect'
import { H2 } from '../../../generic/text'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import {
  inputTextareaSelectStyles,
  InputWrapper,
  ValidationMessage,
  validationBorderColors,
} from '../../../generic/form'
import { LinkThatLooksLikeButton } from '../../../generic/links'
import InputAutocomplete from '../../../generic/InputAutocomplete'
import InputNumberNoScroll from '../../../generic/InputNumberNoScroll/InputNumberNoScroll'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import language from '../../../../language'
import theme from '../../../../theme'
import { getFishBinLabel } from './fishBeltBins'
import { getObservationBiomass } from './fishbeltBiomas'
import { roundToOneDecimal } from '../../../../library/Numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import { Column } from '../../../generic/positioning'

const ObservationTr = styled(Tr)`
  border-width: 0 0 0 ${theme.spacing.xxsmall};
  border-style: solid;
  ${validationBorderColors}
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
const IconRequiredWrapper = styled.span`
  color: ${theme.color.cautionHover};
  svg {
    width: ${theme.typography.smallIconSize};
  }
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
  overflow: visible;
`
const StyledColgroup = styled('colgroup')`
  col {
    &:nth-child(1) {
      // count
      width: 6rem;
    }
    &:nth-child(2) {
      // Fish name
      width: auto;
    }
    &:nth-child(3) {
      // Size
      width: 15%;
    }
    &:nth-child(4) {
      // Count
      width: 10rem;
    }
    &:nth-child(5) {
      // Biomass
      width: 15%;
    }
    &:nth-child(6) {
      // remove
      width: 6rem;
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
  observationValidationsCloneWithUuids,
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

  const getObservationValidations = (observationId) => {
    return observationValidationsCloneWithUuids.filter(
      (validation) => validation.observationUiId === observationId,
    )[0]
  }

  const _loadObservationsFromApiIntoState = useEffect(() => {
    if (!haveApiObservationsBeenLoaded && collectRecord) {
      const observationsFromApi = collectRecord.data.obs_belt_fishes ?? []
      const persistedUnsavedObservations = getPersistedUnsavedObservationsData()
      const initialObservationsToLoad = persistedUnsavedObservations ?? observationsFromApi
      const observationsFromApiWithIds = initialObservationsToLoad.map((observation) => ({
        ...observation,
        /* uiId exists on observations for the sake of the front end logic
         (adding rows, adding new species to observation, validation, etc).
         In the future it would be better sourced from the back end where
         database type logic is better situated. This tech debt is tracked
         in ticket M453.*/

        uiId: observation.uuId ?? createUuid(),
      }))

      observationsDispatch({
        type: 'loadObservationsFromApi',
        payload: observationsFromApiWithIds,
      })

      setHaveApiObservationsBeenLoaded(true)
    }
  }, [
    collectRecord,
    getPersistedUnsavedObservationsData,
    haveApiObservationsBeenLoaded,
    observationsDispatch,
  ])

  const handleDeleteObservation = (observationId) => {
    setAreObservationsInputsDirty(true)
    observationsDispatch({ type: 'deleteObservation', payload: observationId })
  }

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setIsAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation' })
  }

  const handleUpdateCount = (event, observationId) => {
    setAreObservationsInputsDirty(true)
    observationsDispatch({
      type: 'updateCount',
      payload: { newCount: event.target.value, observationId },
    })
  }

  const handleUpdateSize = (newSize, observationId) => {
    setAreObservationsInputsDirty(true)
    observationsDispatch({
      type: 'updateSize',
      payload: { newSize, observationId },
    })
  }

  const handleFishNameChange = (newFishName, observationId) => {
    setAreObservationsInputsDirty(true)
    observationsDispatch({
      type: 'updateFishName',
      payload: {
        newFishName,
        observationId,
      },
    })
  }

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
  const observationsBiomass = observationsState.map((observation) => ({
    uiId: observation.uiId,
    biomass: getObservationBiomass({
      choices,
      fishNameConstants,
      observation,
      transectLengthSurveyed,
      widthId,
    }),
  }))

  const totalBiomass = roundToOneDecimal(
    summarizeArrayObjectValuesByProperty(observationsBiomass, 'biomass'),
  )

  const totalAbundance = summarizeArrayObjectValuesByProperty(observationsState, 'count')

  const observationsRows = observationsState.map((observation, index) => {
    const { uiId: observationId, count, size, fish_attribute } = observation

    const rowNumber = index + 1

    const sizeOrEmptyStringToAvoidInputValueErrors = size ?? ''
    const countOrEmptyStringToAvoidInputValueErrors = count ?? ''

    const showNumericSizeInput =
      fishBinSelectedLabel?.toString() === '1' || typeof fishBinSelectedLabel === 'undefined'

    const sizeSelect = !showNumericSizeInput ? (
      <FishBeltObservationSizeSelect
        onValueEntered={(value) => {
          handleUpdateSize(value, observationId)
        }}
        onKeyDown={(event) => {
          handleKeyDown({ event, index, observation })
        }}
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
        onChange={(event) => {
          handleUpdateSize(event.target.value, observationId)
        }}
        onKeyDown={(event) => {
          handleKeyDown({ event, index, observation })
        }}
      />
    ) : (
      <> {sizeSelect} </>
    )

    const observationBiomass = roundToOneDecimal(
      observationsBiomass.find((object) => object.uiId === observationId).biomass,
    )

    const observationValidations = getObservationValidations(observationId)

    const handleIgnoreObservationValidations = () => {
      ignoreObservationValidations({
        observationUiId: observationId,
      })
    }

    const handleResetObservationValidations = () => {
      resetObservationValidations({
        observationUiId: observationId,
      })
    }

    const observationValidationsToDisplay = getValidationPropertiesForInput(
      observationValidations?.validations,
      areValidationsShowing,
    )
    const { validationType } = observationValidationsToDisplay
    const observationValidationMessages = observationValidationsToDisplay?.validationMessages ?? []
    const isObservationValid = validationType === 'ok'
    const hasWarningValidation = validationType === 'warning'
    const hasErrorValidation = validationType === 'error'
    const hasIgnoredValidation = validationType === 'ignore'

    const validationsMarkup = (
      <Td>
        {isObservationValid ? <IconCheck aria-label="Passed validation" /> : null}
        {hasErrorValidation || hasWarningValidation ? (
          <ul>
            {observationValidationMessages.map((validation) => (
              <li key={validation.id}>
                <ValidationMessage validationType={validationType}>
                  {validation.message}
                </ValidationMessage>
              </li>
            ))}
          </ul>
        ) : null}
        {hasWarningValidation ? (
          <ButtonSecondary type="button" onClick={handleIgnoreObservationValidations}>
            Ignore all warnings
          </ButtonSecondary>
        ) : null}
        {hasIgnoredValidation ? (
          <Column>
            <ValidationMessage validationType={validationType}>Ignored</ValidationMessage>
            <ButtonSecondary type="button" onClick={handleResetObservationValidations}>
              Reset validations
            </ButtonSecondary>
          </Column>
        ) : null}
      </Td>
    )

    return (
      <ObservationTr key={observationId} validationType={validationType}>
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
                onChange={(selectedOption) =>
                  handleFishNameChange(selectedOption.value, observationId)
                }
                onKeyDown={(event) => {
                  handleKeyDown({ event, index, observation, isFishName: true })
                }}
                value={fish_attribute}
                noResultsDisplay={
                  <ButtonThatLooksLikeLink
                    type="button"
                    onClick={() => openNewFishNameModal(observationId)}
                  >
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
            onChange={(event) => {
              handleUpdateCount(event, observationId)
            }}
            onKeyDown={(event) => {
              handleKeyDown({ event, index, observation, isCount: true })
            }}
          />
        </Td>
        <Td align="right">{observationBiomass ?? <> - </>}</Td>
        {areValidationsShowing ? validationsMarkup : null}
        <Td align="center">
          <ButtonRemoveRow
            tabIndex="-1"
            type="button"
            onClick={() => handleDeleteObservation(observationId)}
            aria-label="Delete Observation"
          >
            <IconClose />
          </ButtonRemoveRow>
        </Td>
      </ObservationTr>
    )
  })

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">Observations</H2>
        <StyledOverflowWrapper>
          <StyledFishBeltObservationTable aria-labelledby="table-label">
            <StyledColgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
            </StyledColgroup>
            <thead>
              <Tr>
                <Th> </Th>
                <Th align="left" id="fish-name-label">
                  Fish Name
                  <IconRequiredWrapper>
                    <IconRequired />
                  </IconRequiredWrapper>
                </Th>
                <Th align="right" id="fish-size-label">
                  Size
                  <IconRequiredWrapper>
                    <IconRequired />
                  </IconRequiredWrapper>
                </Th>
                <Th align="right" id="fish-count-label">
                  Count
                  <IconRequiredWrapper>
                    <IconRequired />
                  </IconRequiredWrapper>
                </Th>
                <Th align="right">Biomass (kg/ha)</Th>
                {areValidationsShowing ? <Th>Validations</Th> : null}

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
  observationValidationsCloneWithUuids: PropTypes.arrayOf(
    PropTypes.shape({ ...observationPropTypeShape, observationId: PropTypes.string }),
  ).isRequired,
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
