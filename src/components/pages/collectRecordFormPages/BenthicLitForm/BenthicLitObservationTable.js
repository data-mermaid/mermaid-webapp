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
  benthicPitRecordPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonPrimary } from '../../../generic/buttons'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconLibraryBooks, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { Tr, Td, Th } from '../../../generic/Table/table'
import BenthicPitLitObservationSummaryStats from '../../../BenthicPitLitObservationSummaryStats/BenthicPitLitObservationSummaryStats'
import getObservationValidationInfo from '../CollectRecordFormPageAlternative/getObservationValidationInfo'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit'
import language from '../../../../language'

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
  collectRecord,
  ignoreObservationValidations,
  observationsReducer,
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

  const observationsRows = useMemo(() => {
    const mermaidReferenceLink = process.env.REACT_APP_MERMAID_REFERENCE_LINK
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

      const handleLengthChange = (event) => {
        const newValue = event.target.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateLength',
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
            {benthicAttributeSelectOptions.length && (
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
            <InputNumberNoScrollWithUnit
              value={length}
              unit="m"
              aria-labelledby="length-label"
              onChange={handleLengthChange}
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
                    Benthic Attribute
                    <RequiredIndicator />
                  </Th>
                  <Th align="right" id="growth-form-label">
                    Growth Form
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
  formik: PropTypes.shape({
    values: PropTypes.shape({
      interval_start: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      interval_size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }).isRequired,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func.isRequired,
  setIsNewBenthicAttributeModalOpen: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
}

BenthicLitObservationsTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
}

export { BenthicLitObservationsTable }