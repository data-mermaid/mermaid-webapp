/* eslint-disable camelcase */
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  choicesPropType,
  fishBeltPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  ButtonCaution,
  ButtonLink,
  ButtonPrimary,
} from '../../../generic/buttons'
import { createUuid } from '../../../../library/createUuid'
import { FishBeltObservationSizeSelect } from './FishBeltObservationSizeSelect'
import { getObjectById } from '../../../../library/getObjectById'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus, IconRequired } from '../../../icons'
import { InputWrapper } from '../../../generic/form'
import {
  Table,
  TableOverflowWrapper,
  Tr,
  Td,
  Th,
} from '../../../generic/Table/table'
import InputAutocomplete from '../../../generic/InputAutocomplete'
import InputNumberNoScroll from '../../../InputNumberNoScroll/InputNumberNoScroll'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import language from '../../../../language'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'

const FishBeltObservationTable = ({
  collectRecord,
  fishBinSelected,
  choices,
  observationsReducer,
  openNewFishNameModal,
  fishNameOptions,
}) => {
  const fishBinSelectedLabel = getObjectById(
    choices?.fishsizebins.data,
    fishBinSelected,
  )?.name

  const [observationsState, observationsDispatch] = observationsReducer
  const haveApiObservationsBeenLoaded = useRef(false)
  // const [fishNameOptions, setFishNameOptions] = useState([])

  const _loadObservationsFromApiIntoState = useEffect(() => {
    if (!haveApiObservationsBeenLoaded.current && collectRecord) {
      const observationsFromApi = collectRecord.data.obs_belt_fishes ?? []
      const observationsFromApiWithIds = observationsFromApi.map(
        (observation) => ({
          ...observation,
          id: createUuid(),
        }),
      )

      observationsDispatch({
        type: 'loadObservationsFromApi',
        payload: observationsFromApiWithIds,
      })

      haveApiObservationsBeenLoaded.current = true
    }
  }, [collectRecord, observationsDispatch])

  const handleDeleteObservation = (observationId) => {
    observationsDispatch({ type: 'deleteObservation', payload: observationId })
  }

  const handleAddObservation = () => {
    observationsDispatch({ type: 'addObservation' })
  }

  const handleUpdateCount = (event, observationId) => {
    observationsDispatch({
      type: 'updateCount',
      payload: { newCount: event.target.value, observationId },
    })
  }

  const handleUpdateSize = (newSize, observationId) => {
    observationsDispatch({
      type: 'updateSize',
      payload: { newSize, observationId },
    })
  }

  const handleFishNameChange = (newFishName, observationId) => {
    observationsDispatch({
      type: 'updateFishName',
      payload: {
        newFishName,
        observationId,
      },
    })
  }

  const handleKeyDown = ({ event, index, observation, isCount }) => {
    const isTabKey = event.code === 'Tab' && !event.shiftKey
    const isEnterKey = event.code === 'Enter'
    const isLastRow = index === observationsState.length - 1

    if (isTabKey && isLastRow && isCount) {
      observationsDispatch({
        type: 'duplicateLastObservation',
        payload: { observation },
      })
    }

    if (isEnterKey) {
      observationsDispatch({
        type: 'addNewObservationBelow',
        payload: index,
      })
    }
  }

  const observationsRows = observationsState.map((observation, index) => {
    const { id: observationId, count, size, fish_attribute } = observation

    const rowNumber = index + 1

    const showNumericSizeInput =
      fishBinSelectedLabel?.toString() === '1' ||
      typeof fishBinSelectedLabel === 'undefined'

    const sizeSelect = !showNumericSizeInput && (
      <FishBeltObservationSizeSelect
        onChange={(value) => {
          handleUpdateSize(value, observationId)
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

    return (
      <Tr key={observationId}>
        <Td>{rowNumber}</Td>
        <Td>
          {fishNameOptions.length ? (
            <>
              <InputAutocomplete
                aria-labelledby="fish-name-label"
                options={fishNameOptions}
                onChange={(selectedOption) =>
                  handleFishNameChange(selectedOption.value, observationId)
                }
                value={fish_attribute}
                noResultsDisplay={
                  <ButtonLink
                    type="button"
                    onClick={() => openNewFishNameModal(observationId)}
                  >
                    {language.pages.collectRecord.newFishSpeciesLink}
                  </ButtonLink>
                }
              />
            </>
          ) : (
            <LoadingIndicator aria-label="fish name loading indicator" />
          )}
        </Td>
        <Td align="right">{sizeInput}</Td>
        <Td align="right">
          <InputNumberNoScroll
            type="number"
            min="0"
            value={count}
            step="any"
            onChange={(event) => {
              handleUpdateCount(event, observationId)
            }}
            onKeyDown={(event) => {
              handleKeyDown({ event, index, observation, isCount: true })
            }}
          />
        </Td>
        <Td>Biomass placeholder</Td>
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
                <Th>Biomass (kg/ha)</Th>
                <Th> </Th>
              </Tr>
            </thead>

            <tbody>{observationsRows}</tbody>
          </Table>
        </TableOverflowWrapper>
        <ButtonPrimary type="button" onClick={handleAddObservation}>
          <IconPlus /> Add Row
        </ButtonPrimary>
      </InputWrapper>
    </>
  )
}

FishBeltObservationTable.propTypes = {
  collectRecord: fishBeltPropType,
  fishBinSelected: PropTypes.string,
  choices: choicesPropType.isRequired,
  observationsReducer: PropTypes.arrayOf(PropTypes.any).isRequired,
  openNewFishNameModal: PropTypes.func.isRequired,
  fishNameOptions: inputOptionsPropTypes.isRequired,
}

FishBeltObservationTable.defaultProps = {
  collectRecord: undefined,
  fishBinSelected: undefined,
}

export default FishBeltObservationTable
