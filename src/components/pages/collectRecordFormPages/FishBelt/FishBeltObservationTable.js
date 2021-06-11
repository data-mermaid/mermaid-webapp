import React, { useEffect, useReducer, useRef } from 'react'

import { ButtonCaution, ButtonPrimary } from '../../../generic/buttons'
import { createUuid } from '../../../../library/createUuid'
import { fishBeltPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { Input, InputWrapper } from '../../../generic/form'
import InputNumberWithUnit from '../../../generic/InputNumberWithUnit/InputNumberWithUnit'

const reducer = (state, action) => {
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
      throw new Error('This action isn supported by the reducer')
  }
}

const FishBeltObservationTable = ({ collectRecord }) => {
  const [observationsState, observationsDispatch] = useReducer(reducer, [])
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

  const observationsRows = observationsState.map(({ id, count, size }) => (
    <tr key={id}>
      <td>Species placeholder</td>
      <td>
        <InputNumberWithUnit
          type="number"
          min="0"
          value={size}
          onChange={(event) => handleUpdateSize(event, id)}
          unit="cm"
        />
      </td>
      <td>
        <Input
          type="number"
          min="0"
          value={count}
          onChange={(event) => handleUpdateCount(event, id)}
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
  ))

  return (
    <InputWrapper>
      <H2>Observations</H2>
      <table>
        <thead>
          <tr>
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
