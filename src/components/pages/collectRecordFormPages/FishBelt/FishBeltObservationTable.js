import React, { useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import { ButtonCaution, ButtonPrimary } from '../../../generic/buttons'
import { createUuid } from '../../../../library/createUuid'
import {
  choicesPropType,
  fishBeltPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { InputWrapper } from '../../../generic/form'

import InputNumberNoScroll from '../../../InputNumberNoScroll/InputNumberNoScroll'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import { getObjectById } from '../../../../library/getObjectById'
import fishbeltObservationReducer from './fishbeltObservationReducer'

const FishBeltObservationTable = ({
  collectRecord,
  fishBinSelected,
  choices,
}) => {
  const fishBinSelectedLabel = getObjectById(
    choices?.fishsizebins.data,
    fishBinSelected,
  )?.name

  const [observationsState, observationsDispatch] = useReducer(
    fishbeltObservationReducer,
    [],
  )
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

  const handleUpdateSize = (event, observationId) => {
    observationsDispatch({
      type: 'updateSize',
      payload: { newSize: event.target.value, observationId },
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
    const { id, count, size } = observation
    const rowNumber = index + 1
    const showNumericSizeInput = fishBinSelectedLabel === '1' ?? true

    const sizeInput = showNumericSizeInput ? (
      <InputNumberNoScrollWithUnit
        type="number"
        min="0"
        value={size}
        unit="cm"
        step="any"
        onChange={(event) => {
          handleUpdateSize(event, id)
        }}
        onKeyDown={(event) => {
          handleKeyDown({ event, index, observation })
        }}
      />
    ) : (
      <> temp placeholder for size dropdown </>
    )

    return (
      <tr key={id}>
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
              handleUpdateCount(event, id)
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
            onClick={() => handleDeleteObservation(id)}
          >
            <IconClose />
          </ButtonCaution>
        </td>
      </tr>
    )
  })

  return (
    <InputWrapper>
      <H2>Observations</H2>
      <table>
        <thead>
          <tr>
            <th> </th>
            <th>Fish Name</th>
            <th>Size</th>
            <th>Count</th>
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
}

FishBeltObservationTable.defaultProps = {
  collectRecord: undefined,
  fishBinSelected: undefined,
}

export default FishBeltObservationTable
