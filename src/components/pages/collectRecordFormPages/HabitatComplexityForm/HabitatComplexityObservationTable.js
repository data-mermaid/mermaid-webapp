import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTable,
  UnderTableRow,
  ButtonRemoveRow,
} from '../CollectingFormPage.Styles'
import {
  choicesPropType,
  observationsReducerPropType,
  habitatComplexityPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonPrimary } from '../../../generic/buttons'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import ObservationValidationInfo from '../ObservationValidationInfo'

const StyledColgroup = styled('colgroup')`
  col {
    &.interval {
      width: 15rem;
    }
    &.small-width {
      width: 5rem;
    }
    &.auto-width {
      width: auto;
    }
  }
`

const HabitatComplexityObservationsTable = ({
  areValidationsShowing,
  choices,
  collectRecord,
  formik,
  ignoreObservationValidations,
  observationsReducer,
  resetObservationValidations,
  setAreObservationsInputsDirty,
  testId,
}) => {
  const [observationsState, observationsDispatch] = observationsReducer
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)

  const { interval_size: intervalSize } = formik.values

  useEffect(
    function recalculateObservationIntervals() {
      observationsDispatch({
        type: 'recalculateObservationIntervals',
        payload: { intervalSize },
      })
    },
    [intervalSize, observationsDispatch],
  )

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)

    observationsDispatch({ type: 'addObservation', payload: { intervalSize } })
  }

  const observationsRows = useMemo(() => {
    const habitatComplexityScoreOptions = getOptions(choices.habitatcomplexityscores.data)

    const handleKeyDown = ({ event, index, observation, isLastCell }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isLastCell) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation, intervalSize },
        })
        setAreObservationsInputsDirty(true)
      }

      if (isEnterKey) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'addNewObservationBelow',
          payload: {
            referenceObservationIndex: index,
            intervalSize,
          },
        })
        setAreObservationsInputsDirty(true)
      }
    }

    return observationsState.map((observation, index) => {
      const rowNumber = index + 1
      const { id: observationId, score: habitatComplexityScore = '', interval } = observation

      const {
        isObservationValid,
        hasObservationWarningValidation,
        hasObservationErrorValidation,
        hasObservationIgnoredValidation,
        observationValidationMessages,
        observationValidationType,
      } = getObservationValidationInfo({
        observationId,
        collectRecord,
        areValidationsShowing,
        observationsPropertyName: getObservationsPropertyNames(collectRecord)[0],
      })

      const handleDeleteObservation = () => {
        setAreObservationsInputsDirty(true)

        observationsDispatch({
          type: 'deleteObservation',
          payload: { observationId, intervalSize },
        })
      }

      const handleHabitatComplexityScoreChange = (selectedOption) => {
        const newValue = selectedOption.target.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateHabitatComplexityScore',
          payload: {
            newValue,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      return (
        <ObservationTr key={observationId}>
          <Td align="center">{rowNumber}</Td>
          <Td align="right" aria-labelledby="interval-label">
            {interval}m
          </Td>

          <Td align="center">
            <Select
              onChange={handleHabitatComplexityScoreChange}
              onKeyDown={(event) => {
                handleKeyDown({ event, index, observation, isLastCell: true })
              }}
              value={habitatComplexityScore}
              aria-labelledby="habitat-complexity-score-label"
              autoFocus={autoFocusAllowed}
            >
              <option value=""> </option>
              {habitatComplexityScoreOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Td>

          {areValidationsShowing ? (
            <ObservationValidationInfo
              hasObservationErrorValidation={hasObservationErrorValidation}
              hasObservationIgnoredValidation={hasObservationIgnoredValidation}
              hasObservationWarningValidation={hasObservationWarningValidation}
              ignoreObservationValidations={ignoreObservationValidations}
              isObservationValid={isObservationValid}
              observationId={observationId}
              observationValidationMessages={observationValidationMessages}
              observationValidationType={observationValidationType}
              resetObservationValidations={resetObservationValidations}
            />
          ) : null}
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
    autoFocusAllowed,
    choices,
    collectRecord,
    ignoreObservationValidations,
    intervalSize,
    observationsDispatch,
    observationsState,
    resetObservationValidations,
    setAreObservationsInputsDirty,
  ])

  return (
    <>
      <InputWrapper data-testid={testId}>
        <H2 id="table-label">Observations</H2>
        <>
          <StyledOverflowWrapper>
            <StickyObservationTable aria-labelledby="table-label">
              <StyledColgroup>
                <col className="small-width" />
                <col className="interval" />
                <col className="auto-width" />
                {areValidationsShowing ? <col className="auto-width" /> : null}
                <col className="small-width" />
              </StyledColgroup>
              <thead>
                <Tr>
                  <Th> </Th>
                  <Th align="right" id="interval-label">
                    Interval
                  </Th>
                  <Th align="center" id="habitat-complexity-score-label">
                    Habitat Complexity Score <RequiredIndicator />
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
          </UnderTableRow>
        </>
      </InputWrapper>
    </>
  )
}

HabitatComplexityObservationsTable.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: habitatComplexityPropType,
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  formik: PropTypes.shape({
    values: PropTypes.shape({
      interval_size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }).isRequired,
  testId: PropTypes.string.isRequired,
}

HabitatComplexityObservationsTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
}

export default HabitatComplexityObservationsTable
