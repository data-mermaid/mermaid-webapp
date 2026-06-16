import PropTypes from 'prop-types'
import React, { useMemo, useState, useRef } from 'react'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

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
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import BleachingPercentCoverSummaryStats from '../../../BleachingPercentCoverSummaryStats/BleachingPercentCoverSummaryStats'
import ObservationValidationInfo from '../ObservationValidationInfo'
import LabelWithTooltip from '../../../ColumnHeaderToolTip/LabelWithTooltip'

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
  const tooltipGroupRef = useRef(null)
  const { t } = useTranslation()

  const deleteObservationText = t('delete_observation')

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
        <ObservationTr key={observationId} $messageType={observationValidationType}>
          <Td $align="center">{rowNumber}</Td>
          <Td $align="center">{quadrat_number}</Td>

          <Td $align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="hard-coral-percent-cover-label"
              value={percent_hard}
              min="0"
              step="any"
              data-testid="percent-hard-input"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateHardCoralPercent' })
              }}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autoFocusAllowed} // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td $align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="soft-coral-percent-cover-label"
              value={percent_soft}
              min="0"
              step="any"
              data-testid="percent-soft-input"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateSoftCoralPercent' })
              }}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td $align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="microalgae-percent-cover-label"
              value={percent_algae}
              min="0"
              step="any"
              data-testid="percent-algae-input"
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
          <Td $align="center">
            <ButtonRemoveRow
              tabIndex="-1"
              type="button"
              onClick={handleDeleteObservation}
              aria-label={deleteObservationText}
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
    deleteObservationText,
    ignoreObservationValidations,
    observationsDispatch,
    observationsState,
    resetObservationValidations,
    setAreObservationsInputsDirty,
  ])

  return (
    <>
      <InputWrapper data-testid={testId}>
        <H2 id="percent-cover-label">{t('observations.percent_cover')}</H2>
        <>
          <StyledOverflowWrapper>
            <StickyObservationTable
              aria-labelledby="percent-cover-label"
              data-testid={`${testId}-table`}
            >
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
                  <Th $align="right" id="quadrat-number-label">
                    <LabelWithTooltip
                      label={
                        <>
                          {t('observations.quadrat')} <RequiredIndicator />
                        </>
                      }
                      tooltipText={t('observations.quadrat_info')}
                      groupRef={tooltipGroupRef}
                    />
                  </Th>
                  <Th $align="center" id="hard-coral-percent-cover-label">
                    <LabelWithTooltip
                      label={
                        <>
                          {t('observations.hard_coral_cover')} <RequiredIndicator />
                        </>
                      }
                      tooltipText={t('observations.hard_coral_cover_info')}
                      groupRef={tooltipGroupRef}
                    />
                  </Th>
                  <Th $align="center" id="soft-coral-percent-cover-label">
                    <LabelWithTooltip
                      label={
                        <>
                          {t('observations.soft_coral_cover')} <RequiredIndicator />
                        </>
                      }
                      tooltipText={t('observations.soft_coral_cover_info')}
                      groupRef={tooltipGroupRef}
                    />
                  </Th>
                  <Th $align="center" id="microalgae-percent-cover-label">
                    <LabelWithTooltip
                      label={
                        <>
                          {t('observations.macroalgae_cover')} <RequiredIndicator />
                        </>
                      }
                      tooltipText={t('observations.macroalgae_cover_info')}
                      groupRef={tooltipGroupRef}
                    />
                  </Th>
                  {areValidationsShowing ? (
                    <Th $align="center">{t('validations.validations')}</Th>
                  ) : null}
                  <Th />
                </Tr>
              </thead>
              <tbody>{observationRows}</tbody>
            </StickyObservationTable>
          </StyledOverflowWrapper>
          <UnderTableRow>
            <ButtonPrimary
              type="button"
              onClick={handleAddObservation}
              data-testid="add-observation-row"
            >
              <IconPlus /> {t('buttons.add_row')}
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
