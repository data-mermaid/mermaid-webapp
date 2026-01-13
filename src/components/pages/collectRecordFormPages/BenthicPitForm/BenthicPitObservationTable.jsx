import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
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
import { HelperTextLink } from '../../../generic/links'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
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
  const { t } = useTranslation()
  const [observationsState, observationsDispatch] = observationsReducer
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [currentHelperTextLabel, setCurrentHelperTextLabel] = useState(null)

  const noResultsText = t('search.no_results')
  const proposeNewBenthicAttributeText = t('benthic_observations.add_benthic_attribute')
  const deleteObservationLabelText = t('delete_observation')

  const { interval_start: intervalStart, interval_size: intervalSize } = formik.values

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
          <Td align="right" aria-labelledby="interval-label" data-testid="interval-cell">
            {interval}m
          </Td>
          <Td align="left">
            {benthicAttributeSelectOptions.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  data-testid="observation-benthic-attribute-input"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={autoFocusAllowed} // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
                  isLastRow={observationsState.length === rowNumber}
                  aria-labelledby="benthic-attribute-label"
                  options={benthicAttributeSelectOptions}
                  onChange={handleBenthicAttributeChange}
                  value={attribute}
                  noResultsText={noResultsText}
                  noResultsAction={
                    <NewOptionButton
                      type="button"
                      onClick={proposeNewBenthicAttributeClick}
                      data-testid="propose-new-benthic-attribute-button"
                    >
                      {proposeNewBenthicAttributeText}
                    </NewOptionButton>
                  }
                />
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">
            <Select
              data-testid="growth-form-select"
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
              aria-label={deleteObservationLabelText}
              data-testid="delete-observation-button"
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
    deleteObservationLabelText,
    ignoreObservationValidations,
    intervalSize,
    intervalStart,
    proposeNewBenthicAttributeText,
    noResultsText,
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
        <H2 id="table-label">{t('observations.observations')}</H2>
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
                    {t('observations.interval')}
                  </Th>
                  <Th align="left" id="benthic-attribute-label">
                    <LabelContainer>
                      {t('benthic_observations.benthic_attribute')} <RequiredIndicator />
                      {isHelperTextShowing && currentHelperTextLabel === 'benthicAttribute' ? (
                        <ColumnHeaderToolTip
                          helperText={
                            <Trans
                              i18nKey="benthic_observations.benthic_attribute_info"
                              components={{
                                helperTextLink: (
                                  <HelperTextLink
                                    href="https://www.marinespecies.org/"
                                    target="_blank"
                                    color="#fff"
                                  />
                                ),
                              }}
                            />
                          }
                          left="3em"
                          top="-13.5em"
                        />
                      ) : null}
                      <IconButton
                        type="button"
                        onClick={(event) => handleInfoIconClick(event, 'benthicAttribute')}
                      >
                        <IconInfo aria-label={t('info')} />
                      </IconButton>
                    </LabelContainer>
                  </Th>
                  <Th align="right" id="growth-form-label">
                    <LabelContainer>
                      <div>{t('observations.growth_form')}</div>
                      {isHelperTextShowing && currentHelperTextLabel === 'growthForm' ? (
                        <ColumnHeaderToolTip
                          helperText={t('observations.growth_form_info')}
                          left="-0.5em"
                          top="-9em"
                        />
                      ) : null}
                      <IconButton
                        type="button"
                        onClick={(event) => handleInfoIconClick(event, 'growthForm')}
                      >
                        <IconInfo aria-label={t('info')} />
                      </IconButton>
                    </LabelContainer>
                  </Th>
                  {areValidationsShowing ? <Th align="center">{t('validations')}</Th> : null}
                  <Th> </Th>
                </Tr>
              </thead>
              <tbody>{observationsRows}</tbody>
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
            <BenthicPitLitObservationSummaryStats
              benthicAttributeSelectOptions={benthicAttributeSelectOptions}
              observations={observationsState}
              recordType={'pit'}
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
