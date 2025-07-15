import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTable,
  UnderTableRow,
  ButtonRemoveRow,
} from '../CollectingFormPage.Styles'
import {
  choicesPropType,
  observationsReducerPropType,
  benthicPitRecordPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonPrimary, IconButton } from '../../../generic/buttons'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus, IconInfo } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, LabelContainer, RequiredIndicator, Select } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import language from '../../../../language'
import BenthicPitLitObservationSummaryStats from '../../../BenthicPitLitObservationSummaryStats'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import ColumnHeaderToolTip from '../../../ColumnHeaderToolTip/ColumnHeaderToolTip'

const StyledColgroup = styled('colgroup')`
  col {
    &.number {
      width: 5rem;
    }

    &.interval {
      width: 15rem;
    }

    &.benthicAttribute {
      width: auto;
    }

    &.growthForm {
      width: 20%;
    }

    &.validation {
      width: auto;
    }

    &.remove {
      width: 5rem;
    }
  }
`

const BenthicPitObservationsTable = ({
  areValidationsShowing,
  benthicAttributeSelectOptions,
  choices,
  collectRecord = undefined,
  formik,
  ignoreObservationValidations,
  observationsReducer = [],
  resetObservationValidations,
  setAreObservationsInputsDirty,
  setIsNewBenthicAttributeModalOpen,
  setObservationIdToAddNewBenthicAttributeTo,
  testId,
}) => {
  const [observationsState, observationsDispatch] = observationsReducer
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [currentHelperTextLabel, setCurrentHelperTextLabel] = useState(null)

  const {
    interval_start: intervalStart,
    interval_size: intervalSize,
    len_surveyed: transectLengthSurveyed,
  } = formik.values

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation', payload: { intervalStart, intervalSize } })
  }

  useEffect(
    function recalculateObservationIntervals() {
      observationsDispatch({
        type: 'recalculateObservationIntervals',
        payload: { intervalStart, intervalSize },
      })
    },
    [intervalSize, intervalStart, observationsDispatch],
  )

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

  const observationsRows = useMemo(() => {
    const growthFormOptions = getOptions(choices.growthforms.data)

    const handleKeyDown = ({ event, index, observation, isGrowthForm }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isGrowthForm) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation, intervalStart, intervalSize },
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
            intervalStart,
          },
        })
        setAreObservationsInputsDirty(true)
      }
    }

    return observationsState.map((observation, index) => {
      const rowNumber = index + 1
      const { id: observationId, attribute, growth_form = '', interval } = observation

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
          payload: { observationId, intervalSize, intervalStart },
        })
      }

      const handleBenthicAttributeChange = (selectedOption) => {
        const newBenthicAttribute = selectedOption.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateBenthicAttribute',
          payload: {
            newBenthicAttribute,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const handleGrowthFormChange = (selectedOption) => {
        const newGrowthForm = selectedOption.target.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateGrowthForm',
          payload: {
            newGrowthForm,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const proposeNewBenthicAttributeClick = () => {
        setObservationIdToAddNewBenthicAttributeTo(observationId)
        setIsNewBenthicAttributeModalOpen(true)
      }

      return (
        <ObservationTr key={observationId} messageType={observationValidationType}>
          <Td align="center">{rowNumber}</Td>
          <Td align="right" aria-labelledby="interval-label">
            {interval}m
          </Td>
          <Td align="left">
            {benthicAttributeSelectOptions.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={autoFocusAllowed} // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
                  isLastRow={observationsState.length === rowNumber}
                  aria-labelledby="benthic-attribute-label"
                  options={benthicAttributeSelectOptions}
                  onChange={handleBenthicAttributeChange}
                  value={attribute}
                  noResultsText={language.autocomplete.noResultsDefault}
                  noResultsAction={
                    <NewOptionButton type="button" onClick={proposeNewBenthicAttributeClick}>
                      {language.pages.collectRecord.newBenthicAttributeLink}
                    </NewOptionButton>
                  }
                />
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">
            <Select
              onChange={handleGrowthFormChange}
              onKeyDown={(event) => {
                handleKeyDown({ event, index, observation, isGrowthForm: true })
              }}
              value={growth_form}
              aria-labelledby="growth-form-label"
            >
              <option value=""></option>
              {growthFormOptions.map((item) => (
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
    benthicAttributeSelectOptions,
    choices,
    collectRecord,
    ignoreObservationValidations,
    intervalSize,
    intervalStart,
    observationsDispatch,
    observationsState,
    resetObservationValidations,
    setAreObservationsInputsDirty,
    setIsNewBenthicAttributeModalOpen,
    setObservationIdToAddNewBenthicAttributeTo,
  ])

  return (
    <>
      <InputWrapper data-testid={testId}>
        <H2 id="table-label">Observations</H2>
        <>
          <StyledOverflowWrapper>
            <StickyObservationTable aria-labelledby="table-label">
              <StyledColgroup>
                <col className="number" />
                <col className="interval" />
                <col className="benthicAttribute" />
                <col className="growthForm" />
                {areValidationsShowing ? <col className="validations" /> : null}
                <col className="remove" />
              </StyledColgroup>
              <thead>
                <Tr>
                  <Th> </Th>
                  <Th align="right" id="interval-label">
                    Interval
                  </Th>
                  <Th align="left" id="benthic-attribute-label">
                    <LabelContainer>
                      Benthic Attribute <RequiredIndicator />
                      {isHelperTextShowing && currentHelperTextLabel === 'benthicAttribute' ? (
                        <ColumnHeaderToolTip
                          helperText={language.tooltipText.getBenthicAttribute()}
                          left="3em"
                          top="-13.5em"
                        />
                      ) : null}
                      <IconButton
                        type="button"
                        onClick={(event) => handleInfoIconClick(event, 'benthicAttribute')}
                      >
                        <IconInfo aria-label="info" />
                      </IconButton>
                    </LabelContainer>
                  </Th>
                  <Th align="right" id="growth-form-label">
                    <LabelContainer>
                      <div>Growth Form</div>
                      {isHelperTextShowing && currentHelperTextLabel === 'growthForm' ? (
                        <ColumnHeaderToolTip
                          helperText={language.tooltipText.growthForm}
                          left="-0.5em"
                          top="-9em"
                        />
                      ) : null}
                      <IconButton
                        type="button"
                        onClick={(event) => handleInfoIconClick(event, 'growthForm')}
                      >
                        <IconInfo aria-label="info" />
                      </IconButton>
                    </LabelContainer>
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
            <BenthicPitLitObservationSummaryStats
              benthicAttributeSelectOptions={benthicAttributeSelectOptions}
              observations={observationsState}
              transectLengthSurveyed={transectLengthSurveyed}
            />
          </UnderTableRow>
        </>
      </InputWrapper>
    </>
  )
}

BenthicPitObservationsTable.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  benthicAttributeSelectOptions: inputOptionsPropTypes.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: benthicPitRecordPropType,
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  formik: PropTypes.shape({
    values: PropTypes.shape({
      interval_start: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      interval_size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      len_surveyed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }).isRequired,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func.isRequired,
  setIsNewBenthicAttributeModalOpen: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
}

export default BenthicPitObservationsTable
