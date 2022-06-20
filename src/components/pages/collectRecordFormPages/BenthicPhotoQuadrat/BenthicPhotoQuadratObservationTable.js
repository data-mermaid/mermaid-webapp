import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { ButtonCaution, ButtonPrimary } from '../../../generic/buttons'
import {
  choicesPropType,
  benthicPhotoQuadratPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { H2 } from '../../../generic/text'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../../../library/styling/mediaQueries'
import { IconClose, IconLibraryBooks, IconPlus } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import {
  inputTextareaSelectStyles,
  InputWrapper,
  RequiredIndicator,
  Select,
} from '../../../generic/form'
import { LinkThatLooksLikeButton } from '../../../generic/links'
import { Table, TableOverflowWrapper, Tr, Td, Th } from '../../../generic/Table/table'
import InputAutocomplete from '../../../generic/InputAutocomplete'
import InputNumberNoScroll from '../../../generic/InputNumberNoScroll/InputNumberNoScroll'
import language from '../../../../language'
import theme from '../../../../theme'
import { getOptions } from '../../../../library/getOptions'

const ObservationTr = styled(Tr)`
  border-width: 0 0 0 ${theme.spacing.xsmall};
  border-style: solid;
  border-color: ${(props) => theme.color.getBorderColor(props.messageType)};
`

const BenthicAttributeAutocomplete = styled(InputAutocomplete)`
  & input {
    border: none;
  }
  width: 100%;
  text-align: inherit;
  padding: 0;
`

const InputAutocompleteContainer = styled.div`
  ${inputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  padding: 0;
  border: none;
  background: transparent;
`

const ButtonRemoveRow = styled(ButtonCaution)`
  display: none;
  padding: 0;
`
const StyledLinkThatLooksLikeButtonToReference = styled(LinkThatLooksLikeButton)`
  padding: 0.5rem 1rem 0 1rem;
  background: transparent;
`

const StyledOverflowWrapper = styled(TableOverflowWrapper)`
  border: solid 1px ${theme.color.secondaryColor};
  height: 100%;
  overflow-y: visible;
`

const StyledColgroup = styled('colgroup')`
  col {
    &.number {
      width: 5rem;
    }
    &.quadrat {
      width: 15rem;
    }
    &.benthicAttribute {
      width: auto;
    }
    &.growthForm {
      width: 20%;
    }
    &.numberOfPoints {
      width: 20rem;
    }
    &.remove {
      width: 5rem;
    }
  }
`

const StyledBenthicPhotoQuadratObservationTable = styled(Table)`
  table-layout: auto;
  font-variant: tabular-nums;
  font-feature-settings: 'tnum';
  tr {
    &:focus-within button,
    &:hover button {
      display: inline;
      cursor: pointer;
    }
    th {
      padding: ${theme.spacing.small};
    }
    td {
      padding: 0rem;
      & > div {
        background: transparent;
        border: none;
        span {
          line-height: 1.6;
          background: rgba(255, 255, 255, 0.5);
        }
      }
      input,
      select {
        background: transparent;
        border: none;
        padding: 1px 3px;
        height: 4rem;
        ${hoverState(css`
          outline: ${theme.color.outline};
        `)}
      }
    }
  }
`

const UnderTableRow = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: ${theme.spacing.medium};
  ${mediaQueryTabletLandscapeOnly(css`
    flex-direction: column;
    gap: ${theme.spacing.small};
  `)}
`

const BenthicPhotoQuadratObservationTable = ({
  areObservationsInputsDirty,
  benthicAttributeOptions,
  choices,
  collectRecord,
  observationsReducer,
  persistUnsavedObservationsUtilities,
  setAreObservationsInputsDirty,
}) => {
  const [haveApiObservationsBeenLoaded, setHaveApiObservationsBeenLoaded] = useState(false)
  const [isAutoFocusAllowed, setIsAutoFocusAllowed] = useState(false)
  const [observationsState, observationsDispatch] = observationsReducer

  const {
    persistUnsavedFormData: persistUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities

  const _ensureUnsavedObservationsArePersisted = useEffect(() => {
    if (areObservationsInputsDirty) {
      persistUnsavedObservationsData(observationsState)
    }
  }, [areObservationsInputsDirty, observationsState, persistUnsavedObservationsData])

  const _loadObservationsFromApiIntoState = useEffect(() => {
    if (!haveApiObservationsBeenLoaded && collectRecord) {
      const observationsFromApi = collectRecord.data.obs_benthic_photo_quadrats ?? []

      const persistedUnsavedObservations = getPersistedUnsavedObservationsData()
      const initialObservationsToLoad = persistedUnsavedObservations ?? observationsFromApi

      observationsDispatch({
        type: 'loadObservationsFromApi',
        payload: initialObservationsToLoad,
      })

      setHaveApiObservationsBeenLoaded(true)
    }
  }, [
    collectRecord,
    getPersistedUnsavedObservationsData,
    haveApiObservationsBeenLoaded,
    observationsDispatch,
  ])

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setIsAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation' })
  }

  const observationsRows = useMemo(() => {
    const growthFormOptions = getOptions(choices.growthforms)

    const handleKeyDown = ({ event, index, observation, isBenthicAttribute, isNumberOfPoints }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isNumberOfPoints) {
        event.preventDefault()
        setIsAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation },
        })
      }

      if (isEnterKey && !isBenthicAttribute) {
        event.preventDefault()
        setIsAutoFocusAllowed(true)
        observationsDispatch({
          type: 'addNewObservationBelow',
          payload: {
            referenceObservationIndex: index,
          },
        })
      }
    }

    return observationsState.map((observation, index) => {
      const { id: observationId, quadrat_number, attribute, growth_form, num_points } = observation

      const handleDeleteObservation = () => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({ type: 'deleteObservation', payload: observationId })
      }

      const rowNumber = index + 1

      const quadratNumberOrEmptyStringToAvoidInputValueErrors = quadrat_number ?? ''
      const growthFormOrEmptyStringToAvoidInputValueErrors = growth_form ?? ''
      const numberOfPointsOrEmptyStringToAvoidInputValueErrors = num_points ?? ''

      const handleQuadratNumberChange = (event) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateQuadratNumber',
          payload: { newQuadratNumber: event.target.value, observationId },
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

      const handleNumberOfPointsChange = (event) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateNumberOfPoints',
          payload: { newNumberOfPoints: event.target.value, observationId },
        })
      }

      const handleBenthicAttributeKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isBenthicAttribute: true })
      }

      const handleQuadratNumberKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      const handleGrowthFormKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      const handleNumberOfPointsKeyDown = (event) => {
        handleKeyDown({ event, index, observation, isNumberOfPoints: true })
      }

      return (
        <ObservationTr key={observationId}>
          <Td align="center">{rowNumber}</Td>
          <Td align="right">
            <InputNumberNoScroll
              type="number"
              autoFocus={isAutoFocusAllowed}
              min="0"
              value={quadratNumberOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="quadrat-number-label"
              onChange={handleQuadratNumberChange}
              onKeyDown={handleQuadratNumberKeyDown}
            />
          </Td>
          <Td align="left">
            {benthicAttributeOptions.length && (
              <InputAutocompleteContainer>
                <BenthicAttributeAutocomplete
                  id={`observation-${observationId}`}
                  aria-labelledby="benthic-attribute-label"
                  options={benthicAttributeOptions}
                  onChange={handleBenthicAttributeChange}
                  onKeyDown={handleBenthicAttributeKeyDown}
                  value={attribute}
                  noResultsText={language.autocomplete.noResultsDefault}
                />
                {attribute && (
                  <StyledLinkThatLooksLikeButtonToReference
                    aria-label="benthic attribute reference"
                    target="_blank"
                    tabIndex="-1"
                    href={`https://dev-collect.datamermaid.org/#/reference/benthicattributes/${attribute}`}
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
              value={growthFormOrEmptyStringToAvoidInputValueErrors}
              aria-labelledby="growth-form-label"
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
            <InputNumberNoScroll
              type="number"
              min="0"
              value={numberOfPointsOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="number-of-points-label"
              onChange={handleNumberOfPointsChange}
              onKeyDown={handleNumberOfPointsKeyDown}
            />
          </Td>
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
    observationsState,
    setAreObservationsInputsDirty,
    observationsDispatch,
    choices,
    isAutoFocusAllowed,
    benthicAttributeOptions,
  ])

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">Observations</H2>
        <StyledOverflowWrapper>
          <StyledBenthicPhotoQuadratObservationTable aria-labelledby="table-label">
            <StyledColgroup>
              <col className="number" />
              <col className="quadrat" />
              <col className="benthicAttribute" />
              <col className="growthForm" />
              <col className="numberOfPoints" />
              <col className="remove" />
            </StyledColgroup>
            <thead>
              <Tr>
                <Th> </Th>
                <Th align="right" id="quadrat-number-label">
                  Quadrat <RequiredIndicator />
                </Th>
                <Th align="left" id="benthic-attribute-label">
                  Benthic Attribute <RequiredIndicator />
                </Th>
                <Th align="right" id="growth-form-label">
                  Growth Form <RequiredIndicator />
                </Th>
                <Th align="right" id="number-of-points-label">
                  Number of Points <RequiredIndicator />
                </Th>
                <Th> </Th>
              </Tr>
            </thead>
            <tbody>{observationsRows}</tbody>
          </StyledBenthicPhotoQuadratObservationTable>
        </StyledOverflowWrapper>
        <UnderTableRow>
          <ButtonPrimary type="button" onClick={handleAddObservation}>
            <IconPlus /> Add Row
          </ButtonPrimary>
        </UnderTableRow>
      </InputWrapper>
    </>
  )
}

BenthicPhotoQuadratObservationTable.propTypes = {
  areObservationsInputsDirty: PropTypes.bool.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: benthicPhotoQuadratPropType,
  observationsReducer: observationsReducerPropType,
  persistUnsavedObservationsUtilities: PropTypes.shape({
    persistUnsavedFormData: PropTypes.func,
    clearPersistedUnsavedFormData: PropTypes.func,
    getPersistedUnsavedFormData: PropTypes.func,
  }).isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
}

BenthicPhotoQuadratObservationTable.defaultProps = {
  collectRecord: undefined,
  observationsReducer: [],
}

export default BenthicPhotoQuadratObservationTable
