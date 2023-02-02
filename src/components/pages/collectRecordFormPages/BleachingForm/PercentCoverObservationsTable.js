import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTable,
  UnderTableRow,
  ButtonRemoveRow,
} from '../CollectingFormPage.Styles'
import {
  bleachingRecordPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonPrimary } from '../../../generic/buttons'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { InputWrapper, RequiredIndicator } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPageAlternative/getObservationValidationInfo'
import InputNumberNoScroll from '../../../generic/InputNumberNoScroll/InputNumberNoScroll'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import BleachingPercentCoverSummaryStats from '../../../BleachingPercentCoverSummaryStats/BleachingPercentCoverSummaryStats'
import ObservationValidationInfo from '../ObservationValidationInfo'

const StyledColgroup = styled('colgroup')`
  col {
    &.number {
      width: 5rem;
    }
    &.quadratNumber {
      width: 5rem;
    }
    &.autoWidth {
      width: auto;
    }
    &.remove {
      width: 5rem;
    }
  }
`

const PercentCoverObservationTable = ({
  areValidationsShowing,
  collectRecord,
  ignoreObservationValidations,
  observationsReducer,
  resetObservationValidations,
  setAreObservationsInputsDirty,
  testId,
}) => {
  const [observationsState, observationsDispatch] = observationsReducer
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation' })
  }

  const observationRows = useMemo(() => {
    const handleKeyDown = ({ event, index, observation, isLastCell }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isLastCell) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation },
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
          },
        })
        setAreObservationsInputsDirty(true)
      }
    }

    return observationsState.map((observation, index) => {
      const rowNumber = index + 1
      const {
        id: observationId,
        percent_hard,
        percent_soft,
        percent_algae,
        quadrat_number,
      } = observation

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
        observationsPropertyName: getObservationsPropertyNames(collectRecord)[1],
      })

      const handleDeleteObservation = () => {
        setAreObservationsInputsDirty(true)

        observationsDispatch({
          type: 'deleteObservation',
          payload: { observationId },
        })
      }

      const handleObservationInputChange = ({ event, dispatchType }) => {
        const newValue = event.target.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: dispatchType,
          payload: {
            newValue,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const handleObservationKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      return (
        <ObservationTr key={observationId}>
          <Td align="center">{rowNumber}</Td>
          <Td align="center">{quadrat_number}</Td>

          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="hard-coral-percent-cover-label"
              value={percent_hard}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateHardCoralPercent' })
              }}
              autoFocus={autoFocusAllowed}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="soft-coral-percent-cover-label"
              value={percent_soft}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateSoftCoralPercent' })
              }}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="macroalgee-percent-cover-label"
              value={percent_algae}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateAlgaePercent' })
              }}
              onKeyDown={(event) => {
                handleKeyDown({ event, index, observation, isLastCell: true })
              }}
            />
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
    collectRecord,
    ignoreObservationValidations,
    observationsDispatch,
    observationsState,
    resetObservationValidations,
    setAreObservationsInputsDirty,
  ])

  return (
    <>
      <InputWrapper data-testid={testId}>
        <H2 id="percent-cover-label">Observations - Percent Cover</H2>
        <>
          <StyledOverflowWrapper>
            <StickyObservationTable aria-labelledby="percent-cover-label">
              <StyledColgroup>
                <col className="number" />
                <col className="quadratNumber" />
                <col className="autoWidth" />
                <col className="autoWidth" />
                <col className="autoWidth" />
                {areValidationsShowing ? <col className="validations" /> : null}
                <col className="remove" />
              </StyledColgroup>
              <thead>
                <Tr>
                  <Th />
                  <Th align="center" id="quadrat-number">
                    Quadrat
                  </Th>
                  <Th align="center" id="hard-coral-percent-cover-label">
                    Hard coral % cover <RequiredIndicator />
                  </Th>
                  <Th align="center" id="soft-coral-percent-cover-label">
                    Soft coral % cover <RequiredIndicator />
                  </Th>
                  <Th align="center" id="macroalgee-percent-cover-label">
                    Macroalgee % cover <RequiredIndicator />
                  </Th>
                  {areValidationsShowing ? <Th align="center">Validations</Th> : null}
                  <Th />
                </Tr>
              </thead>
              <tbody>{observationRows}</tbody>
            </StickyObservationTable>
          </StyledOverflowWrapper>
          <UnderTableRow>
            <ButtonPrimary type="button" onClick={handleAddObservation}>
              <IconPlus /> Add Row
            </ButtonPrimary>
            <BleachingPercentCoverSummaryStats observations={observationsState} />
          </UnderTableRow>
        </>
      </InputWrapper>
    </>
  )
}

PercentCoverObservationTable.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  collectRecord: bleachingRecordPropType,
  ignoreObservationValidations: PropTypes.func.isRequired,
  formik: PropTypes.shape({
    values: PropTypes.shape({
      interval_start: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      interval_size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }).isRequired,
  observationsReducer: observationsReducerPropType,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
}

PercentCoverObservationTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
}

export default PercentCoverObservationTable
