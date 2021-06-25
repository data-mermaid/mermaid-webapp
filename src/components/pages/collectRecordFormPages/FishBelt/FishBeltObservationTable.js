/* eslint-disable camelcase */
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  choicesPropType,
  fishBeltPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonCaution, ButtonPrimary } from '../../../generic/buttons'
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
import InputNumberNoScroll from '../../../InputNumberNoScroll/InputNumberNoScroll'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import InputAutocomplete from '../../../generic/InputAutocomplete'

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
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [observationsState, observationsDispatch] = observationsReducer
  const haveApiObservationsBeenLoaded = useRef(false)
  const [fishNameOptions, setFishNameOptions] = useState([])

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

  const _loadFishNameOptions = useEffect(() => {
    if (databaseSwitchboardInstance) {
      Promise.all([
        databaseSwitchboardInstance.getSpecies(),
        databaseSwitchboardInstance.getGenera(),
        databaseSwitchboardInstance.getFamilies(),
      ]).then(([species, genera, families]) => {
        const speciesOptions = species.results.map(({ id, display_name }) => ({
          label: display_name,
          value: id,
        }))

        const generaAndFamiliesOptions = [
          ...genera.results,
          ...families.results,
        ].map(({ id, name }) => ({
          label: name,
          value: id,
        }))

        setFishNameOptions([...speciesOptions, ...generaAndFamiliesOptions])
      })
    }
  }, [databaseSwitchboardInstance])

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
          <InputAutocomplete
            aria-labelledby="fish-name-label"
            options={fishNameOptions}
            onChange={(selectedOption) =>
              handleFishNameChange(selectedOption.value, observationId)
            }
            value={fish_attribute}
          />
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
    <InputWrapper>
      <H2 id="table-label">Observations</H2>
      <TableOverflowWrapper>
        <Table aria-labelledby="table-label">
          <thead>
            <Tr>
              <Th> </Th>
              <Th id="fish-name-label">
                Fish Name <IconRequired />
              </Th>
              <Th align="right" id="fish-size-label">
                Size <IconRequired />
              </Th>
              <Th align="right" id="fish-count-label">
                Count <IconRequired />
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
