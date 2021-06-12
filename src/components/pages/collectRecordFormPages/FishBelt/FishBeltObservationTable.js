import React, { useEffect, useReducer, useRef } from 'react'

import { ButtonCaution, ButtonPrimary } from '../../../generic/buttons'
import { createUuid } from '../../../../library/createUuid'
import { fishBeltPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { InputWrapper } from '../../../generic/form'

import InputNumberNoScroll from '../../../InputNumberNoScroll/InputNumberNoScroll'

const observationReducer = (state, action) => {
  switch (action.type) {
    case 'loadObservationsFromApi':
      return [...action.payload]

    case 'deleteObservation': {
      const idOfRemovee = action.payload

      const observationsWithTheRightOneRemoved = state.filter(
        (observation) => observation.id !== idOfRemovee,
      )

      return observationsWithTheRightOneRemoved
    }

    case 'addObservation':
      return [...state, { id: createUuid(), count: 0, size: 0 }]
    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const indexToInsertAt = action.payload + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        count: 0,
        size: 0,
      })

      return observationsWithInsertedRow
    }

    case 'duplicateLastObservation': {
      const observationWithNewId = {
        ...action.payload.observation,
        id: createUuid(),
      }

      return [...state, observationWithNewId]
    }
    case 'updateCount':
      return state.map((observation) => {
        const isObservationToUpdate =
          observation.id === action.payload.observationId

        return isObservationToUpdate
          ? { ...observation, count: action.payload.newCount }
          : observation
      })
    case 'updateSize':
      return state.map((observation) => {
        const isObservationToUpdate =
          observation.id === action.payload.observationId

        return isObservationToUpdate
          ? { ...observation, size: action.payload.newSize }
          : observation
      })
    default:
      throw new Error("This action isn't supported by the observationReducer")
  }
}

const FishBeltObservationTable = ({ collectRecord }) => {
  const [observationsState, observationsDispatch] = useReducer(
    observationReducer,
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

    return (
      <tr key={id}>
        <td>{rowNumber}</td>
        <td>Species placeholder</td>
        <td>
          <InputNumberNoScroll
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
        </td>
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
}

FishBeltObservationTable.defaultProps = { collectRecord: undefined }

export default FishBeltObservationTable
