import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  choicesPropType,
  fishBeltPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  ButtonCaution,
  ButtonThatLooksLikeLink,
  ButtonPrimary,
} from '../../../generic/buttons'
import {
  IconClose,
  IconLibraryBooks,
  IconPlus,
  IconRequired,
} from '../../../icons'
import {
  Table,
  TableOverflowWrapper,
  Tr,
  Td,
  Th,
} from '../../../generic/Table/table'
import { createUuid } from '../../../../library/createUuid'
import { FishBeltObservationSizeSelect } from './FishBeltObservationSizeSelect'
import { H2 } from '../../../generic/text'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { inputTextareaSelectStyles, InputWrapper } from '../../../generic/form'
import { LinkThatLooksLikeButton } from '../../../generic/links'
import InputAutocomplete from '../../../generic/InputAutocomplete'
import InputNumberNoScroll from '../../../InputNumberNoScroll/InputNumberNoScroll'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import language from '../../../../language'
import theme from '../../../../theme'
import { getFishBinLabel } from './fishBeltBins'
import { getObservationBiomass } from './fishbeltBiomas'
import { RowRight } from '../../../generic/positioning'
import { roundToOneDecimal } from '../../../../library/Numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'

const FishNameAutocomplete = styled(InputAutocomplete)`
  & input {
    border: none;
  }
  width: 100%;
  text-align: inherit;
  padding: ${theme.spacing.xsmall};
`

const InputAutocompleteContainer = styled.div`
  ${inputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  padding: 0;
  border: solid thin magenta;
`

const ObservationsSummaryStats = styled.table`
  border: solid thin magenta;
`

const FishBeltObservationTable = ({
  choices,
  collectRecord,
  fishBinSelected,
  fishNameConstants,
  fishNameOptions,
  observationsReducer,
  openNewFishNameModal,
  persistUnsavedObservationsUtilities,
  transectLengthSurveyed,
  widthId,
}) => {
  const fishBinSelectedLabel = getFishBinLabel(choices, fishBinSelected)
  const [
    haveApiObservationsBeenLoaded,
    setHaveApiObservationsBeenLoaded,
  ] = useState(false)
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(
    false,
  )
  const [isAutoFocusAllowed, setIsAutoFocusAllowed] = useState(false)
  const [observationsState, observationsDispatch] = observationsReducer
  const {
    persistUnsavedFormData: persistUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities

  const _ensureUnsavedObservationsArePersisted = useEffect(() => {
    if (areObservationsInputsDirty) {
      persistUnsavedObservationsData(observationsState)
    }
  }, [
    areObservationsInputsDirty,
    observationsState,
    persistUnsavedObservationsData,
  ])

  const _loadObservationsFromApiIntoState = useEffect(() => {
    if (!haveApiObservationsBeenLoaded && collectRecord) {
      const observationsFromApi = collectRecord.data.obs_belt_fishes ?? []
      const persistedUnsavedObservations = getPersistedUnsavedObservationsData()
      const initialObservationsToLoad =
        persistedUnsavedObservations ?? observationsFromApi
      const observationsFromApiWithIds = initialObservationsToLoad.map(
        (observation) => ({
          ...observation,
          // id exists on observations just for the sake of the front end logic
          // (adding rows, adding new species to observation, etc)
          uiId: observation.uuId ?? createUuid(),
        }),
      )

      observationsDispatch({
        type: 'loadObservationsFromApi',
        payload: observationsFromApiWithIds,
      })

      setHaveApiObservationsBeenLoaded(true)
    }
  }, [collectRecord, observationsDispatch, haveApiObservationsBeenLoaded])

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

  const handleKeyDown = ({
    event,
    index,
    observation,
    isCount,
    isFishName,
  }) => {
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

  const totalAbundance = summarizeArrayObjectValuesByProperty(
    observationsState,
    'count',
  )

  const observationsRows = observationsState.map((observation, index) => {
    const { uiId: observationId, count, size, fish_attribute } = observation

    const rowNumber = index + 1

    const showNumericSizeInput =
      fishBinSelectedLabel?.toString() === '1' ||
      typeof fishBinSelectedLabel === 'undefined'

    const sizeSelect = !showNumericSizeInput && (
      <FishBeltObservationSizeSelect
        onChange={(value) => {
          handleUpdateSize(value, observationId)
        }}
        onKeyDown={(event) => {
          handleKeyDown({ event, index, observation })
        }}
        fishBinSelectedLabel={fishBinSelectedLabel}
        value={size}
        labelledBy="fish-size-label"
      />
    )

    const sizeInput = showNumericSizeInput ? (
      <InputNumberNoScrollWithUnit
        type="number"
        min="0"
        value={size}
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
      observationsBiomass.find((object) => object.uiId === observationId)
        .biomass,
    )

    return (
      <Tr key={observationId}>
        <Td>{rowNumber}</Td>
        <Td>
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
                <LinkThatLooksLikeButton
                  aria-label="fish name reference"
                  target="_blank"
                  href={`https://dev-collect.datamermaid.org/#/reference/fishattributes/species/${fish_attribute}`}
                >
                  <IconLibraryBooks />
                </LinkThatLooksLikeButton>
              )}
            </InputAutocompleteContainer>
          )}
        </Td>
        <Td align="right">{sizeInput}</Td>
        <Td align="right">
          <InputNumberNoScroll
            type="number"
            min="0"
            value={count}
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
        <Td>
          <ButtonCaution
            tabIndex="-1"
            type="button"
            onClick={() => handleDeleteObservation(observationId)}
            aria-label="Delete Observation"
          >
            <IconClose />
          </ButtonCaution>
        </Td>
      </Tr>
    )
  })

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">Observations</H2>
        <TableOverflowWrapper>
          <Table aria-labelledby="table-label">
            <thead>
              <Tr>
                <Th> </Th>
                <Th align="right" id="fish-name-label">
                  Fish Name
                  <IconRequired />
                </Th>
                <Th align="right" id="fish-size-label">
                  Size
                  <IconRequired />
                </Th>
                <Th align="right" id="fish-count-label">
                  Count
                  <IconRequired />
                </Th>
                <Th align="right">Biomass (kg/ha)</Th>
                <Th> </Th>
              </Tr>
            </thead>

            <tbody>{observationsRows}</tbody>
          </Table>
        </TableOverflowWrapper>
        <RowRight>
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
        </RowRight>

        <ButtonPrimary type="button" onClick={handleAddObservation}>
          <IconPlus /> Add Row
        </ButtonPrimary>
      </InputWrapper>
    </>
  )
}

FishBeltObservationTable.propTypes = {
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
  observationsReducer: PropTypes.arrayOf(PropTypes.any).isRequired,
  openNewFishNameModal: PropTypes.func.isRequired,
  persistUnsavedObservationsUtilities: PropTypes.shape({
    persistUnsavedFormData: PropTypes.func,
    clearPersistedUnsavedFormData: PropTypes.func,
    getPersistedUnsavedFormData: PropTypes.func,
  }).isRequired,
  transectLengthSurveyed: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  widthId: PropTypes.string,
}

FishBeltObservationTable.defaultProps = {
  collectRecord: undefined,
  fishBinSelected: undefined,
  transectLengthSurveyed: undefined,
  widthId: undefined,
}

export default FishBeltObservationTable
