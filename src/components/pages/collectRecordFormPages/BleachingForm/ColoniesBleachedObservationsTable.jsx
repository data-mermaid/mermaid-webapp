import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTableWrapTh,
  UnderTableRow,
  ButtonRemoveRow,
} from '../CollectingFormPage.Styles'
import {
  choicesPropType,
  observationsReducerPropType,
  bleachingRecordPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonPrimary } from '../../../generic/buttons'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import BleachincColoniesBleachedSummaryStats from '../../../BleachingColoniesBleachedSummaryStats/BleachingColoniesBleachedSummaryStats'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import language from '../../../../language'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'

const StyledColgroup = styled('colgroup')`
  col {
    &.number {
      width: 5rem;
    }
    &.autoWidth {
      width: auto;
    }
    &.growthForm {
      width: 20%;
    }
    &.remove {
      width: 5rem;
    }
  }
`

const ColoniesBleachedObservationTable = ({
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
  const [observationsState, observationsDispatch] = observationsReducer
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)

    observationsDispatch({ type: 'addObservation' })
  }

  const observationRows = useMemo(() => {
    const growthFormOptions = getOptions(choices.growthforms.data)

    const handleKeyDown = ({ event, index, observation, isLastCell }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastCell && isLastRow) {
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
        count_100,
        count_20,
        count_50,
        count_80,
        count_dead,
        count_normal,
        count_pale,
        growth_form = '',
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
            {benthicAttributeSelectOptions?.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={autoFocusAllowed} // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
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
              value={growth_form}
              aria-labelledby="growth-form-label"
              onKeyDown={handleObservationKeyDown}
            >
              <option value=""> </option>
              {growthFormOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="normal-label"
              value={count_normal}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateNormal' })
              }}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="pale-label"
              value={count_pale}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updatePale' })
              }}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="20-bleached-label"
              value={count_20}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'update20Bleached' })
              }}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="50-bleached-label"
              value={count_50}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'update50Bleached' })
              }}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="80-bleached-label"
              value={count_80}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'update80Bleached' })
              }}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="100-bleached-label"
              value={count_100}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'update100Bleached' })
              }}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              aria-labelledby="recently-dead-label"
              value={count_dead}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateRecentlyDead' })
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
        <H2 id="colonies-bleached-label">Observations - Colonies Bleached</H2>
        <>
          <StyledOverflowWrapper>
            <StickyObservationTableWrapTh aria-labelledby="colonies-bleached-label">
              <StyledColgroup>
                <col className="number" />
                <col className="autoWidth" />
                <col className="growthForm" />
                <col className="autoWidth" />
                <col className="autoWidth" />
                <col className="autoWidth" />
                <col className="autoWidth" />
                <col className="autoWidth" />
                <col className="autoWidth" />
                <col className="autoWidth" />
                {areValidationsShowing ? <col className="validations" /> : null}
                <col className="remove" />
              </StyledColgroup>
              <thead>
                <Tr>
                  <Th colSpan="3" />
                  <Th colSpan="7" align="center">
                    Number of Colonies
                  </Th>
                  <Th colSpan="1" />
                </Tr>
                <Tr>
                  <Th />
                  <Th align="center" id="benthic-attribute-label">
                    Benthic Attribute <RequiredIndicator />
                  </Th>
                  <Th align="center" id="growth-form-label">
                    Growth Form
                  </Th>
                  <Th align="center" id="normal-label">
                    Normal
                  </Th>
                  <Th align="center" id="pale-label">
                    Pale
                  </Th>
                  <Th align="center" id="20-bleached-label">
                    0-20% bleached
                  </Th>
                  <Th align="center" id="50-bleached-label">
                    20-50% bleached
                  </Th>
                  <Th align="center" id="80-bleached-label">
                    50-80% bleached
                  </Th>
                  <Th align="center" id="100-bleached-label">
                    80-100% bleached
                  </Th>
                  <Th align="center" id="recently-dead-label">
                    Recently dead
                  </Th>
                  {areValidationsShowing ? <Th align="center">Validations</Th> : null}
                  <Th />
                </Tr>
              </thead>
              <tbody>{observationRows}</tbody>
            </StickyObservationTableWrapTh>
          </StyledOverflowWrapper>
          <UnderTableRow>
            <ButtonPrimary type="button" onClick={handleAddObservation}>
              <IconPlus /> Add Row
            </ButtonPrimary>
            <BleachincColoniesBleachedSummaryStats
              observationsColoniesBleached={observationsState}
            />
          </UnderTableRow>
        </>
      </InputWrapper>
    </>
  )
}

ColoniesBleachedObservationTable.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  benthicAttributeSelectOptions: inputOptionsPropTypes.isRequired,
  choices: choicesPropType.isRequired,
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
  setIsNewBenthicAttributeModalOpen: PropTypes.func.isRequired,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
}

export default ColoniesBleachedObservationTable
