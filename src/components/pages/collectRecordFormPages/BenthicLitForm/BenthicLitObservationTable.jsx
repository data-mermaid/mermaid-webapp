import PropTypes from 'prop-types'
import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation, Trans } from 'react-i18next'

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
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus, IconInfo } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, LabelContainer, RequiredIndicator, Select } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import { HelperTextLink } from '../../../generic/links'
import BenthicPitLitObservationSummaryStats from '../../../BenthicPitLitObservationSummaryStats'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import ColumnHeaderToolTip from '../../../ColumnHeaderToolTip/ColumnHeaderToolTip'

const StyledColgroup = styled('colgroup')`
  col {
    &.small-width {
      width: 5rem;
    }

    &.auto-width {
      width: auto;
    }
  }
`

const BenthicLitObservationsTable = ({
  areValidationsShowing,
  benthicAttributeSelectOptions,
  choices,
  collectRecord = undefined,
  ignoreObservationValidations,
  observationsReducer = [],
  resetObservationValidations,
  setAreObservationsInputsDirty,
  setIsNewBenthicAttributeModalOpen,
  setObservationIdToAddNewBenthicAttributeTo,
  testId,
}) => {
  const { t } = useTranslation()
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

  const observationsRows = useMemo(() => {
    const growthFormOptions = getOptions(choices.growthforms.data)

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
      const { id: observationId, attribute, growth_form = '', length = '' } = observation

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
          payload: { observationId },
        })
      }

      const handleBenthicAttributeChange = (selectedOption) => {
        const newValue = selectedOption.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateBenthicAttribute',
          payload: {
            newValue,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const handleGrowthFormChange = (selectedOption) => {
        const newValue = selectedOption.target.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateGrowthForm',
          payload: {
            newValue,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const handleLengthChange = (event) => {
        const regExNumbers = new RegExp(/\D/g)
        const newValue = event.target.value.replace(regExNumbers, '')

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateLength',
          payload: {
            newValue,
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

      const handleObservationKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      return (
        <ObservationTr key={observationId} messageType={observationValidationType}>
          <Td align="center">{rowNumber}</Td>

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
                  noResultsText={t('autocomplete.no_results_default')}
                  noResultsAction={
                    <NewOptionButton type="button" onClick={proposeNewBenthicAttributeClick}>
                      {t('pages.collect_record.new_benthic_attribute_link')}
                    </NewOptionButton>
                  }
                />
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">
            <Select
              onChange={handleGrowthFormChange}
              value={growth_form}
              aria-labelledby="growth-form-label"
              onKeyDown={handleObservationKeyDown}
            >
              <option value=""></option>
              {growthFormOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              value={length}
              aria-labelledby="length-label"
              onChange={handleLengthChange}
              onKeyDown={(event) => handleKeyDown({ event, index, observation, isLastCell: true })}
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
    benthicAttributeSelectOptions,
    choices,
    collectRecord,
    ignoreObservationValidations,
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
        <H2 id="observations-label">Observations</H2>
        <>
          <StyledOverflowWrapper>
            <StickyObservationTable aria-labelledby="observations-label">
              <StyledColgroup>
                <col className="small-width" />
                <col className="auto-width" />
                <col className="auto-width" />
                <col className="auto-width" />
                {areValidationsShowing ? <col className="auto-width" /> : null}
                <col className="small-width" />
              </StyledColgroup>
              <thead>
                <Tr>
                  <Th> </Th>

                  <Th align="left" id="benthic-attribute-label">
                    <LabelContainer>
                      <div>
                        Benthic Attribute <RequiredIndicator />
                      </div>
                      {isHelperTextShowing && currentHelperTextLabel === 'benthicAttribute' ? (
                        <ColumnHeaderToolTip
                          helperText={
                            <Trans
                              i18nKey="tooltip.benthic_attribute"
                              components={{
                                a: (
                                  <HelperTextLink
                                    href="https://www.marinespecies.org/"
                                    target="_blank"
                                  />
                                ),
                              }}
                            />
                          }
                          left="3.3em"
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
                          helperText={t('tooltip.growth_form')}
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
                  <Th align="right" id="length-label">
                    Length (cm)
                    <RequiredIndicator />
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
              recordType={'lit'}
            />
          </UnderTableRow>
        </>
      </InputWrapper>
    </>
  )
}

BenthicLitObservationsTable.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  benthicAttributeSelectOptions: inputOptionsPropTypes.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: benthicPitRecordPropType,
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func.isRequired,
  setIsNewBenthicAttributeModalOpen: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
}

export { BenthicLitObservationsTable }
