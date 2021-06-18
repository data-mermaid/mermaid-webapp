import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  choicesPropType,
  fishBeltPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonCaution, ButtonPrimary } from '../../../generic/buttons'
import { createUuid } from '../../../../library/createUuid'
import { FishBeltObservationSizeSelect } from './FishBeltObservationSizeSelect'
import { getObjectById } from '../../../../library/arrays/getObjectById'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus, IconRequired } from '../../../icons'
import { InputWrapper } from '../../../generic/form'
import InputNumberNoScroll from '../../../InputNumberNoScroll/InputNumberNoScroll'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'

const FishBeltObservationTable = ({
  collectRecord,
  fishBinSelected,
  choices,
  observationsReducer,
}) => {
  const fishBinSelectedLabel = getObjectById(
    choices?.fishsizebins.data,
    fishBinSelected,
  )?.name

  const [observationsState, observationsDispatch] = observationsReducer
  const haveApiObservationsBeenLoaded = useRef(false)

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
  })

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

  const handleUpdateSize = (eventOrValue, observationId) => {
    // rather than have the size select onChange emit a modified/fake event,
    // we just pass a value instead. The numeric input will pass an event
    const isEvent = !!eventOrValue.target
    const newSize = isEvent ? eventOrValue.target.value : eventOrValue

    observationsDispatch({
      type: 'updateSize',
      payload: { newSize, observationId },
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
    const { id: observationId, count, size } = observation
    const rowNumber = index + 1

    const showNumericSizeInput =
      fishBinSelectedLabel === '1' ||
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
          handleUpdateSize(event, observationId)
        }}
        onKeyDown={(event) => {
          handleKeyDown({ event, index, observation })
        }}
      />
    ) : (
      <> {sizeSelect} </>
    )

    return (
      <tr key={observationId}>
        <td>{rowNumber}</td>
        <td>Species placeholder</td>
        <td>{sizeInput}</td>
        <td>
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
        </td>
        <td>Biomass placeholder</td>
        <td>
          <ButtonCaution
            type="button"
            onClick={() => handleDeleteObservation(observationId)}
            aria-label="Delete Observation"
          >
            <IconClose />
          </ButtonCaution>
        </td>
      </tr>
    )
  })

  return (
    <InputWrapper>
      <H2 id="table-label">Observations</H2>
      <table aria-labelledby="table-label">
        <thead>
          <tr>
            <th> </th>
            <th id="species-label">
              Fish Name <IconRequired />
            </th>
            <th id="fish-size-label">
              Size <IconRequired />
            </th>
            <th id="fish-count-label">
              Count <IconRequired />
            </th>
            <th>Biomass (kg/ha)</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>{observationsRows}</tbody>
      </table>
      <ButtonPrimary type="button" onClick={handleAddObservation}>
        <IconPlus /> Add Row
      </ButtonPrimary>
    </InputWrapper>
  )
}

FishBeltObservationTable.propTypes = {
  collectRecord: fishBeltPropType,
  fishBinSelected: PropTypes.string,
  choices: choicesPropType.isRequired,
  observationsReducer: PropTypes.arrayOf(PropTypes.any).isRequired,
}

FishBeltObservationTable.defaultProps = {
  collectRecord: undefined,
  fishBinSelected: undefined,
}

export default FishBeltObservationTable
