import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  CellValidation,
  CellValidationButton,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationAutocomplete,
  ObservationsSummaryStats,
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
  benthicPhotoQuadratPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonPrimary } from '../../../generic/buttons'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconLibraryBooks, IconPlus } from '../../../icons'
import { InputWrapper, RequiredIndicator, Select } from '../../../generic/form'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPageAlternative/getObservationValidationInfo'
import language from '../../../../language'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'

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
  collectRecord,
  formik,
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

  const { interval_start: intervalStart, interval_size: intervalSize } = formik.values

  useEffect(
    function recalculateObservationIntervals() {
      observationsDispatch({
        type: 'recalculateObservationIntervals',
        payload: { intervalStart, intervalSize },
      })
    },
    [intervalSize, intervalStart, observationsDispatch],
  )

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)

    observationsDispatch({ type: 'addObservation', payload: { intervalStart, intervalSize } })
  }

  const observationCategoryPercentages = useMemo(() => {
    const getCategory = (benthicAttributeId) =>
      benthicAttributeSelectOptions.find((benthic) => benthic.value === benthicAttributeId)

    const addTopCategoryInfoToObservation = observationsState.map((obs) => {
      const benthicAttribute = getCategory(obs.attribute)

      return { ...obs, top_level_category: benthicAttribute?.topLevelCategory }
    })

    const categoryGroups = addTopCategoryInfoToObservation.reduce((accumulator, obs) => {
      const benthicAttributeName = getCategory(obs.top_level_category)?.label

      accumulator[benthicAttributeName] = accumulator[benthicAttributeName] || []
      accumulator[benthicAttributeName].push(obs)

      return accumulator
    }, {})

    const categoryNames = Object.keys(categoryGroups).sort()
    const totalNumberOfPoints = summarizeArrayObjectValuesByProperty(
      observationsState,
      'num_points',
    )
    const categoryPercentages = categoryNames.map((category) => {
      const categoryPercentage =
        (summarizeArrayObjectValuesByProperty(categoryGroups[category], 'num_points') /
          totalNumberOfPoints) *
        100

      return {
        benthicAttribute: category,
        benthicAttributePercentage: roundToOneDecimal(categoryPercentage),
      }
    })

    return categoryPercentages
  }, [observationsState, benthicAttributeSelectOptions])

  const observationsRows = useMemo(() => {
    const mermaidReferenceLink = process.env.REACT_APP_MERMAID_REFERENCE_LINK
    const growthFormSelectOptions = getOptions(choices.growthforms)

    const handleKeyDown = ({ event, index, observation, isGrowthForm, isBenthicAttribute }) => {
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

      if (isEnterKey && !isBenthicAttribute) {
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
      } = getObservationValidationInfo({ observationId, collectRecord, areValidationsShowing })

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
      }

      const handleBenthicAttributeKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isBenthicAttribute: true })
      }

      const handleGrowthFormKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isGrowthForm: true })
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
          <Td align="right" aria-labelledby="interval-label">
            {interval}m
          </Td>
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
              onKeyDown={handleGrowthFormKeyDown}
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
                    Benthic Attribute <RequiredIndicator />
                  </Th>
                  <Th align="right" id="growth-form-label">
                    Growth Form
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
            <ObservationsSummaryStats>
              <tbody>
                {observationCategoryPercentages.map((obs) => {
                  const isPercentageAvailable = !Number.isNaN(
                    parseFloat(obs.benthicAttributePercentage),
                  )

                  return (
                    isPercentageAvailable && (
                      <Tr key={obs.benthicAttribute}>
                        <Th>{`% ${obs.benthicAttribute}`}</Th>
                        <Td>{obs.benthicAttributePercentage}</Td>
                      </Tr>
                    )
                  )
                })}
              </tbody>
            </ObservationsSummaryStats>
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
  collectRecord: benthicPhotoQuadratPropType,
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

BenthicPitObservationsTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
}

export default BenthicPitObservationsTable
