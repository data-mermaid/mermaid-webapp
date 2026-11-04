import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { styled } from 'styled-components'
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
import { ButtonPrimary } from '../../../generic/buttons'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import BenthicPitLitObservationSummaryStats from '../../../BenthicPitLitObservationSummaryStats'
import getObservationValidationInfo, {
  getCellMarkProps,
} from '../CollectRecordFormPage/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import LabelWithTooltip from '../../../ColumnHeaderToolTip/LabelWithTooltip'
import { HelperTextLink } from '../../../generic/links'
import ObservationsHeadingValidations from '../ObservationsHeadingValidations'
import BleachingStatusCell from '../BleachingStatusCell'
import { getCoralAttributeIds, isIncludeBleachingOn } from '../../../../library/bleachingStatus'

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

const WORMS_LINK = 'https://www.marinespecies.org/'

const BenthicLitObservationsTable = ({
  areValidationsShowing,
  benthicAttributeSelectOptions,
  choices,
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
  const proposeNewBenthicAttributeText = `${t('benthic_observations.add_benthic_attribute')}...`
  const deleteObservationAriaLabel = t('delete_observation')

  const isBleachingOn = isIncludeBleachingOn(formik.values.include_bleaching)
  const coralAttributeIds = useMemo(
    () => getCoralAttributeIds(benthicAttributeSelectOptions),
    [benthicAttributeSelectOptions],
  )

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)

    observationsDispatch({ type: 'addObservation' })
  }

  // Filling only adds Normal to coral rows with no status, so it can run on every change. Clearing
  // waits for the diver to switch the field off: formik holds the default No until the record's
  // values arrive, and clearing on that would wipe the saved statuses.
  useEffect(
    function fillBleachingStatusesWhileIncluded() {
      if (isBleachingOn) {
        observationsDispatch({ type: 'fillBleachingStatuses', payload: { coralAttributeIds } })
      }
    },
    [coralAttributeIds, isBleachingOn, observationsDispatch, observationsState],
  )

  const wasBleachingOnRef = useRef(isBleachingOn)

  useEffect(
    function clearBleachingStatusesWhenSwitchedOff() {
      if (wasBleachingOnRef.current && !isBleachingOn) {
        observationsDispatch({ type: 'clearBleachingStatuses' })
      }
      wasBleachingOnRef.current = isBleachingOn
    },
    [isBleachingOn, observationsDispatch],
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
        attribute,
        bleaching_status: bleachingStatus,
        growth_form = '',
        length = '',
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
        // A row that stops being coral is no longer assessed. One that becomes coral is filled
        // with Normal by fillBleachingStatuses.
        if (isBleachingCellEditable && !coralAttributeIds.has(newValue)) {
          observationsDispatch({
            type: 'updateBleachingStatus',
            payload: { newValue: null, observationId },
          })
        }
        markObservationValidationsStale({
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
        markObservationValidationsStale({
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
        markObservationValidationsStale({
          observationId,
        })
      }

      const handleBleachingStatusChange = (event) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateBleachingStatus',
          payload: {
            newValue: Number(event.target.value),
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

      const handleObservationKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      return (
        <ObservationTr
          key={observationId}
          data-observation-id={observationId}
          $messageType={observationValidationType}
        >
          <Td $align="center">{rowNumber}</Td>

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
                  menuTestId="observation-benthic-attribute-menu"
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
          <Td {...getCellMarkProps(cellMarks, 'length')} $align="right">
            <InputNumberNumericCharactersOnly
              value={length}
              aria-labelledby="length-label"
              onChange={handleLengthChange}
              onKeyDown={(event) =>
                handleKeyDown({ event, index, observation, isLastCell: !isBleachingCellEditable })
              }
              data-testid="observation-length-input"
            />
          </Td>
          {isBleachingOn ? (
            <BleachingStatusCell
              bleachingStatus={bleachingStatus}
              isCoral={isCoral}
              onChange={handleBleachingStatusChange}
              onKeyDown={(event) => handleKeyDown({ event, index, observation, isLastCell: true })}
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
              aria-label={deleteObservationAriaLabel}
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
    coralAttributeIds,
    deleteObservationAriaLabel,
    collectRecord,
    ignoreObservationValidations,
    unignoreObservationValidations,
    isBleachingOn,
    noResultsText,
    observationsDispatch,
    observationsState,
    proposeNewBenthicAttributeText,
    markObservationValidationsStale,
    setAreObservationsInputsDirty,
    setIsNewBenthicAttributeModalOpen,
    setObservationIdToAddNewBenthicAttributeTo,
  ])

  return (
    <>
      <InputWrapper data-testid={testId}>
        <H2 id="observations-label">{t('observations.observations')}</H2>
        <ObservationsHeadingValidations />
        <>
          <StyledOverflowWrapper>
            <StickyObservationTable aria-labelledby="observations-label">
              <StyledColgroup>
                <col className="small-width" />
                <col className="auto-width" />
                <col className="auto-width" />
                <col className="auto-width" />
                {isBleachingOn ? <col className="auto-width" /> : null}
                {areValidationsShowing ? <col className="auto-width" /> : null}
                <col className="small-width" />
              </StyledColgroup>
              <thead>
                <Tr>
                  <Th> </Th>

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
                                href={WORMS_LINK}
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
                  <Th $align="right" id="length-label">
                    {t('observations.length')} ({t('measurements.centimeter_short')})
                    <RequiredIndicator />
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
  formik: PropTypes.shape({
    values: PropTypes.shape({
      include_bleaching: PropTypes.string,
    }),
  }).isRequired,
  ignoreObservationValidations: PropTypes.func.isRequired,
  unignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  markObservationValidationsStale: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func.isRequired,
  setIsNewBenthicAttributeModalOpen: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
}

export { BenthicLitObservationsTable }
