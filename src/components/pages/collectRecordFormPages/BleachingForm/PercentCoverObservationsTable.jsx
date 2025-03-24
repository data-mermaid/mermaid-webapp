import PropTypes from 'prop-types'
import React, { useMemo, useState, useEffect } from 'react'
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
import { ButtonPrimary, IconButton } from '../../../generic/buttons'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus, IconInfo } from '../../../icons'
import { InputWrapper, LabelContainer, RequiredIndicator } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import BleachingPercentCoverSummaryStats from '../../../BleachingPercentCoverSummaryStats/BleachingPercentCoverSummaryStats'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ColumnHeaderToolTip from '../../../ColumnHeaderToolTip/ColumnHeaderToolTip'
import language from '../../../../language'

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
  collectRecord = undefined,
  ignoreObservationValidations,
  observationsReducer = [],
  resetObservationValidations,
  setAreObservationsInputsDirty,
  testId,
}) => {
  const [observationsState, observationsDispatch] = observationsReducer
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [currentHelperTextLabel, setCurrentHelperTextLabel] = useState(null)

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)

    observationsDispatch({ type: 'addObservation' })
  }

  const _useOnClickOutsideOfInfoIcon = useEffect(() => {
    document.body.addEventListener('click', () => {
      if (isHelperTextShowing === true) {
        setIsHelperTextShowing(false)
      }
    })
  }, [isHelperTextShowing])

  const handleInfoIconClick = (event, label) => {
    if (currentHelperTextLabel === label) {
      setIsHelperTextShowing(!isHelperTextShowing)
    } else {
      setIsHelperTextShowing(true)
      setCurrentHelperTextLabel(label)
    }

    event.stopPropagation()
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
        const regExNumbers = new RegExp(/\D/g)
        const newValue = event.target.value.replace(regExNumbers, '')

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
        <ObservationTr key={observationId} messageType={observationValidationType}>
          <Td align="center">{rowNumber}</Td>
          <Td align="center">{quadrat_number}</Td>

          <Td align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="hard-coral-percent-cover-label"
              value={percent_hard}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateHardCoralPercent' })
              }}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autoFocusAllowed} // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
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
            <InputNumberNumericCharactersOnly
              aria-labelledby="microalgae-percent-cover-label"
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
                  <Th align="right" id="quadrat-number-label">
                    <LabelContainer>
                      Quadrat <RequiredIndicator />
                      {isHelperTextShowing && currentHelperTextLabel === 'quadrat' ? (
                        <ColumnHeaderToolTip
                          helperText={language.tooltipText.quadrat}
                          left="-3em"
                          top="-6.1em"
                        />
                      ) : null}
                      <IconButton
                        type="button"
                        onClick={(event) => handleInfoIconClick(event, 'quadrat')}
                      >
                        <IconInfo aria-label="info" />
                      </IconButton>
                    </LabelContainer>
                  </Th>
                  <Th align="center" id="hard-coral-percent-cover-label">
                    <LabelContainer>
                      <div>
                        Hard coral % cover <RequiredIndicator />
                      </div>
                      {isHelperTextShowing && currentHelperTextLabel === 'hardCoralPercentage' ? (
                        <ColumnHeaderToolTip
                          helperText={language.tooltipText.hardCoralPercentage}
                          left="4.2em"
                          top="-7.5em"
                        />
                      ) : null}
                      <IconButton
                        type="button"
                        onClick={(event) => handleInfoIconClick(event, 'hardCoralPercentage')}
                      >
                        <IconInfo aria-label="info" />
                      </IconButton>
                    </LabelContainer>
                  </Th>
                  <Th align="center" id="soft-coral-percent-cover-label">
                    <LabelContainer>
                      <div>
                        Soft coral % cover <RequiredIndicator />
                      </div>
                      {isHelperTextShowing && currentHelperTextLabel === 'softCoralPercentage' ? (
                        <ColumnHeaderToolTip
                          helperText={language.tooltipText.softCoralPercentage}
                          left="3.6em"
                          top="-7.5em"
                        />
                      ) : null}
                      <IconButton
                        type="button"
                        onClick={(event) => handleInfoIconClick(event, 'softCoralPercentage')}
                      >
                        <IconInfo aria-label="info" />
                      </IconButton>
                    </LabelContainer>
                  </Th>
                  <Th align="center" id="microalgae-percent-cover-label">
                    <LabelContainer>
                      <div>
                        Macroalgae % cover <RequiredIndicator />
                      </div>
                      {isHelperTextShowing && currentHelperTextLabel === 'macroalgaePercentage' ? (
                        <ColumnHeaderToolTip
                          helperText={language.tooltipText.macroalgaePercentage}
                          left="5em"
                          top="-7.5em"
                        />
                      ) : null}
                      <IconButton
                        type="button"
                        onClick={(event) => handleInfoIconClick(event, 'macroalgaePercentage')}
                      >
                        <IconInfo aria-label="info" />
                      </IconButton>
                    </LabelContainer>
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

export default PercentCoverObservationTable
