import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

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
import { ButtonPrimary } from '../../../generic/buttons'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { HelperTextLink } from '../../../generic/links'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo, {
  getCellMarkProps,
} from '../CollectRecordFormPage/getObservationValidationInfo'
import BenthicPitLitObservationSummaryStats from '../../../BenthicPitLitObservationSummaryStats'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import LabelWithTooltip from '../../../ColumnHeaderToolTip/LabelWithTooltip'
import ObservationsHeadingValidations from '../ObservationsHeadingValidations'
import BleachingStatusCell from '../BleachingStatusCell'
import {
  isIncludeBleachingOn,
  parseBleachingStatusValue,
} from '../../../../library/bleachingStatus'

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

    &.bleaching {
      width: auto;
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
  coralAttributeIds,
  coralAttributeIdsByType,
  collectRecord = undefined,
  formik,
  ignoreObservationValidations,
  unignoreObservationValidations,
  observationsReducer = [],
  markObservationValidationsStale,
  setAreObservationsInputsDirty,
  setIsNewBenthicAttributeModalOpen,
  setObservationIdToAddNewBenthicAttributeTo,
  testId,
}) => {
  const { t } = useTranslation()
  const [observationsState, observationsDispatch] = observationsReducer
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const tooltipGroupRef = useRef(null)

  const noResultsText = t('search.no_results')
  const proposeNewBenthicAttributeText = t('benthic_observations.add_benthic_attribute')
  const deleteObservationLabelText = t('delete_observation')

  const {
    interval_start: intervalStart,
    interval_size: intervalSize,
    include_bleaching: includeBleaching,
  } = formik.values
  const isBleachingOn = isIncludeBleachingOn(includeBleaching)

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
          payload: {
            coralAttributeIds,
            referenceObservation: observation,
            intervalStart,
            intervalSize,
          },
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
      const {
        id: observationId,
        attribute,
        bleaching_status: bleachingStatus,
        growth_form = '',
        interval,
      } = observation
      const isCoral = coralAttributeIds.has(attribute)
      const isBleachingCellEditable = isBleachingOn && isCoral

      const {
        cellMarks,
        isObservationValid,
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
            coralAttributeIds,
            newBenthicAttribute,
            observationId,
          },
        })
        markObservationValidationsStale({
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
        markObservationValidationsStale({
          observationId,
        })
      }

      const handleBleachingStatusChange = (event) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateBleachingStatus',
          payload: {
            newValue: parseBleachingStatusValue(event.target.value),
            observationId,
          },
        })
        markObservationValidationsStale({
          observationId,
        })
      }

      const proposeNewBenthicAttributeClick = () => {
        setObservationIdToAddNewBenthicAttributeTo(observationId)
        setIsNewBenthicAttributeModalOpen(true)
      }

      return (
        <ObservationTr
          key={observationId}
          data-observation-id={observationId}
          $messageType={observationValidationType}
        >
          <Td $align="center">{rowNumber}</Td>
          <Td
            {...getCellMarkProps(cellMarks, 'interval')}
            $align="right"
            aria-labelledby="interval-label"
            data-testid="interval-cell"
          >
            {interval}m
          </Td>
          <Td {...getCellMarkProps(cellMarks, 'attribute')} $align="left">
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
          <Td $align="right">
            <Select
              data-testid="growth-form-select"
              onChange={handleGrowthFormChange}
              onKeyDown={(event) => {
                handleKeyDown({ event, index, observation, isLastCell: !isBleachingCellEditable })
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
          {isBleachingOn ? (
            <BleachingStatusCell
              bleachingStatus={bleachingStatus}
              cellMarkProps={getCellMarkProps(cellMarks, 'bleaching_status')}
              isCoral={isCoral}
              onChange={handleBleachingStatusChange}
              onKeyDown={(event) => {
                handleKeyDown({ event, index, observation, isLastCell: true })
              }}
            />
          ) : null}

          {areValidationsShowing ? (
            <ObservationValidationInfo
              ignoreObservationValidations={ignoreObservationValidations}
              unignoreObservationValidations={unignoreObservationValidations}
              isObservationValid={isObservationValid}
              observationId={observationId}
              observationValidationMessages={observationValidationMessages}
            />
          ) : null}
          <Td $align="center">
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
    coralAttributeIds,
    deleteObservationLabelText,
    ignoreObservationValidations,
    unignoreObservationValidations,
    intervalSize,
    intervalStart,
    isBleachingOn,
    proposeNewBenthicAttributeText,
    noResultsText,
    observationsDispatch,
    observationsState,
    markObservationValidationsStale,
    setAreObservationsInputsDirty,
    setIsNewBenthicAttributeModalOpen,
    setObservationIdToAddNewBenthicAttributeTo,
  ])

  return (
    <>
      <InputWrapper data-testid={testId}>
        <H2 id="table-label">{t('observations.observations')}</H2>
        <ObservationsHeadingValidations />
        <>
          <StyledOverflowWrapper>
            <StickyObservationTable aria-labelledby="table-label">
              <StyledColgroup>
                <col className="number" />
                <col className="interval" />
                <col className="benthicAttribute" />
                <col className="growthForm" />
                {isBleachingOn ? <col className="bleaching" /> : null}
                {areValidationsShowing ? <col className="validations" /> : null}
                <col className="remove" />
              </StyledColgroup>
              <thead>
                <Tr>
                  <Th> </Th>
                  <Th $align="right" id="interval-label">
                    {t('observations.interval')}
                  </Th>
                  <Th $align="left" id="benthic-attribute-label">
                    <LabelWithTooltip
                      label={
                        <>
                          {t('benthic_observations.benthic_attribute')} <RequiredIndicator />
                        </>
                      }
                      tooltipText={
                        <Trans
                          i18nKey="benthic_observations.benthic_attribute_info"
                          components={{
                            helperTextLink: (
                              <HelperTextLink
                                href="https://www.marinespecies.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="#fff"
                              />
                            ),
                          }}
                        />
                      }
                      groupRef={tooltipGroupRef}
                    />
                  </Th>
                  <Th $align="right" id="growth-form-label">
                    <LabelWithTooltip
                      label={t('observations.growth_form')}
                      tooltipText={t('observations.growth_form_info')}
                      groupRef={tooltipGroupRef}
                    />
                  </Th>
                  {isBleachingOn ? (
                    <Th $align="right" id="bleaching-label">
                      <LabelWithTooltip
                        label={t('observations.bleaching')}
                        tooltipText={t('observations.bleaching_info')}
                        groupRef={tooltipGroupRef}
                      />
                    </Th>
                  ) : null}
                  {areValidationsShowing ? (
                    <Th $align="center">{t('validations.validations')}</Th>
                  ) : null}
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
              coralAttributeIdsByType={coralAttributeIdsByType}
              includeBleaching={isBleachingOn}
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
  coralAttributeIds: PropTypes.instanceOf(Set).isRequired,
  coralAttributeIdsByType: PropTypes.shape({
    hardCoral: PropTypes.instanceOf(Set).isRequired,
    softCoral: PropTypes.instanceOf(Set).isRequired,
  }).isRequired,
  collectRecord: benthicPitRecordPropType,
  ignoreObservationValidations: PropTypes.func.isRequired,
  unignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  markObservationValidationsStale: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  formik: PropTypes.shape({
    values: PropTypes.shape({
      include_bleaching: PropTypes.string,
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
