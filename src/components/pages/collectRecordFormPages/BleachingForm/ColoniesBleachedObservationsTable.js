import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  CellValidation,
  CellValidationButton,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationAutocomplete,
  ObservationTr,
  StyledLinkThatLooksLikeButtonToReference,
  StyledOverflowWrapper,
  StickyObservationTable,
  TableValidationList,
  UnderTableRow,
  ButtonRemoveRow,
} from '../CollectingFormPage.Styles'
import {
  choicesPropType,
  observationsReducerPropType,
  bleachingRecordPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonPrimary } from '../../../generic/buttons'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconLibraryBooks, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPageAlternative/getObservationValidationInfo'
import InputNumberNoScroll from '../../../generic/InputNumberNoScroll/InputNumberNoScroll'
import language from '../../../../language'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import BleachincColoniesBleachedSummaryStats from '../../../BleachingColoniesBleachedSummaryStats/BleachingColoniesBleachedSummaryStats'

const mermaidReferenceLink = process.env.REACT_APP_MERMAID_REFERENCE_LINK

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
  collectRecord,
  ignoreObservationValidations,
  observationsReducer,
  resetObservationValidations,
  setAreObservationsInputsDirty,
  setIsNewBenthicAttributeModalOpen,
  setObservationIdToAddNewBenthicAttributeTo,
  testId,
}) => {
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [observationsState, observationsDispatch] = observationsReducer

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)

    observationsDispatch({ type: 'addObservation' })
  }

  const observationRows = useMemo(() => {
    const growthFormSelectOptions = getOptions(choices.growthforms)

    const handleKeyDown = ({ event, index, observation, isLastCell, isBenthicAttribute }) => {
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

      if (isEnterKey && !isBenthicAttribute) {
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
      }

      const handleBenthicAttributeKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isBenthicAttribute: true })
      }

      const handleLastCellKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isLastCell: true })
      }

      const handleIgnoreObservationValidations = () => {
        ignoreObservationValidations({
          observationId,
        })
      }

      const handleResetObservationValidations = () => {
        resetObservationValidations({
          observationId,
        })
      }
      const validationsMarkup = (
        <CellValidation>
          {isObservationValid ? <span aria-label="Passed Validation">&nbsp;</span> : null}
          {hasObservationErrorValidation || hasObservationWarningValidation ? (
            <TableValidationList>
              {observationValidationMessages.map((validation) => (
                <li className={`${observationValidationType}-indicator`} key={validation.id}>
                  {language.getValidationMessage(validation)}
                </li>
              ))}
            </TableValidationList>
          ) : null}
          {hasObservationWarningValidation ? (
            <CellValidationButton type="button" onClick={handleIgnoreObservationValidations}>
              Ignore warning
            </CellValidationButton>
          ) : null}
          {hasObservationIgnoredValidation ? (
            <>
              Ignored
              <CellValidationButton type="button" onClick={handleResetObservationValidations}>
                Reset validations
              </CellValidationButton>
            </>
          ) : null}
        </CellValidation>
      )

      const proposeNewBenthicAttributeClick = () => {
        setObservationIdToAddNewBenthicAttributeTo(observationId)
        setIsNewBenthicAttributeModalOpen(true)
      }

      return (
        <ObservationTr key={observationId}>
          <Td align="center">{rowNumber}</Td>

          <Td align="left">
            {benthicAttributeSelectOptions?.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  autoFocus={autoFocusAllowed}
                  aria-labelledby="benthic-attribute-label"
                  options={benthicAttributeSelectOptions}
                  onChange={handleBenthicAttributeChange}
                  onKeyDown={handleBenthicAttributeKeyDown}
                  value={attribute}
                  noResultsText={language.autocomplete.noResultsDefault}
                  noResultsAction={
                    <NewOptionButton type="button" onClick={proposeNewBenthicAttributeClick}>
                      {language.pages.collectRecord.newBenthicAttributeLink}
                    </NewOptionButton>
                  }
                />
                {attribute && (
                  <StyledLinkThatLooksLikeButtonToReference
                    aria-label="benthic attribute reference"
                    target="_blank"
                    tabIndex="-1"
                    href={`${mermaidReferenceLink}/benthicattributes/${attribute}`}
                  >
                    <IconLibraryBooks />
                  </StyledLinkThatLooksLikeButtonToReference>
                )}
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">
            <Select
              onChange={handleGrowthFormChange}
              value={growth_form}
              aria-labelledby="growth-form-label"
            >
              <option value=""> </option>
              {growthFormSelectOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="normal-label"
              value={count_normal}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateNormal' })
              }}
            />
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="pale-label"
              value={count_pale}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updatePale' })
              }}
            />
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="20-bleached-label"
              value={count_20}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'update20Bleached' })
              }}
            />
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="50-bleached-label"
              value={count_50}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'update50Bleached' })
              }}
            />
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="80-bleached-label"
              value={count_80}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'update80Bleached' })
              }}
            />
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="100-bleached-label"
              value={count_100}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'update100Bleached' })
              }}
            />
          </Td>
          <Td align="right">
            <InputNumberNoScroll
              aria-labelledby="recently-dead-label"
              value={count_dead}
              min="0"
              step="any"
              onChange={(event) => {
                handleObservationInputChange({ event, dispatchType: 'updateRecentlyDead' })
              }}
              onKeyDown={handleLastCellKeyDown}
            />
          </Td>

          {areValidationsShowing ? validationsMarkup : null}
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
            <StickyObservationTable aria-labelledby="colonies-bleached-label">
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
            </StickyObservationTable>
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

ColoniesBleachedObservationTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
}

export default ColoniesBleachedObservationTable
