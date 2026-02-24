import PropTypes from 'prop-types'
import React, { useMemo, useState, useEffect } from 'react'
import { styled } from 'styled-components'
import { Trans, useTranslation } from 'react-i18next'

import {
  ButtonRemoveRow,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTable,
  UnderTableRow,
} from '../CollectingFormPage.Styles'
import { ButtonPrimary, IconButton } from '../../../generic/buttons'
import {
  choicesPropType,
  benthicPhotoQuadratPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus, IconInfo } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, LabelContainer, RequiredIndicator, Select } from '../../../generic/form'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { ObservationsSummaryStats, Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import { HelperTextLink } from '../../../generic/links'

import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import ColumnHeaderToolTip from '../../../ColumnHeaderToolTip/ColumnHeaderToolTip'

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

    &.validation {
      width: auto;
    }

    &.remove {
      width: 5rem;
    }
  }
`

const BenthicPhotoQuadratObservationTable = ({
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
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [currentHelperTextLabel, setCurrentHelperTextLabel] = useState(null)

  const missingBenthicAttributeText = t('benthic_observations.missing_benthic_attribute')

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
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

  const observationCategoryPercentages = useMemo(() => {
    const getCategory = (benthicAttributeId) =>
      benthicAttributeSelectOptions.find((benthic) => benthic.value === benthicAttributeId)

    const addTopCategoryInfoToObservation = observationsState.map((obs) => {
      const benthicAttribute = getCategory(obs.attribute)

      return { ...obs, top_level_category: benthicAttribute?.topLevelCategory }
    })

    const categoryGroups = addTopCategoryInfoToObservation.reduce((accumulator, obs) => {
      const benthicAttributeName =
        getCategory(obs.top_level_category)?.label ?? missingBenthicAttributeText

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
  }, [observationsState, benthicAttributeSelectOptions, missingBenthicAttributeText])

  const observationsRows = useMemo(() => {
    const growthFormOptions = getOptions(choices.growthforms.data)

    const handleKeyDown = ({ event, index, observation, isNumberOfPoints }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isNumberOfPoints) {
        event.preventDefault()
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation },
        })
        setAreObservationsInputsDirty(true)
      }

      if (isEnterKey) {
        event.preventDefault()
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
      const { id: observationId, quadrat_number, attribute, growth_form, num_points } = observation

      const quadratNumberOrEmptyStringToAvoidInputValueErrors = quadrat_number ?? ''
      const growthFormOrEmptyStringToAvoidInputValueErrors = growth_form ?? ''
      const numberOfPointsOrEmptyStringToAvoidInputValueErrors = num_points ?? ''

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
        observationsDispatch({ type: 'deleteObservation', payload: observationId })
      }

      const handleQuadratNumberChange = (event) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateQuadratNumber',
          payload: { newQuadratNumber: event.target.value, observationId },
        })
        resetObservationValidations({
          observationId,
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

      const handleNumberOfPointsChange = (event) => {
        const regExNumbers = new RegExp(/\D/g)
        const newValue = event.target.value.replace(regExNumbers, '')

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateNumberOfPoints',
          payload: { newNumberOfPoints: newValue, observationId },
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
        <ObservationTr key={observationId} $messageType={observationValidationType}>
          <Td align="center">{rowNumber}</Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              type="number"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true} // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
              min="0"
              value={quadratNumberOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="quadrat-number-label"
              onChange={handleQuadratNumberChange}
              onKeyDown={handleObservationKeyDown}
            />
          </Td>
          <Td align="left">
            {benthicAttributeSelectOptions.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  aria-labelledby="benthic-attribute-label"
                  isLastRow={observationsState.length === rowNumber}
                  noResultsText={t('search.no_results')}
                  onChange={handleBenthicAttributeChange}
                  options={benthicAttributeSelectOptions}
                  value={attribute}
                  noResultsAction={
                    <NewOptionButton type="button" onClick={proposeNewBenthicAttributeClick}>
                      {t('benthic_observations.add_benthic_attribute')}
                    </NewOptionButton>
                  }
                />
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">
            <Select
              onChange={handleGrowthFormChange}
              onKeyDown={handleObservationKeyDown}
              value={growthFormOrEmptyStringToAvoidInputValueErrors}
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
          <Td align="right">
            <InputNumberNumericCharactersOnly
              value={numberOfPointsOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="number-of-points-label"
              onChange={handleNumberOfPointsChange}
              onKeyDown={(event) => {
                handleKeyDown({ event, index, observation, isNumberOfPoints: true })
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
              aria-label={t('delete_observation')}
            >
              <IconClose />
            </ButtonRemoveRow>
          </Td>
        </ObservationTr>
      )
    })
  }, [
    areValidationsShowing,
    benthicAttributeSelectOptions,
    choices.growthforms.data,
    collectRecord,
    ignoreObservationValidations,
    observationsDispatch,
    observationsState,
    resetObservationValidations,
    setAreObservationsInputsDirty,
    setIsNewBenthicAttributeModalOpen,
    setObservationIdToAddNewBenthicAttributeTo,
    t,
  ])

  return (
    <InputWrapper data-testid={testId}>
      <H2 id="table-label">{t('observations.observations')}</H2>
      <StyledOverflowWrapper>
        <StickyObservationTable aria-labelledby="table-label">
          <StyledColgroup>
            <col className="number" />
            <col className="quadrat" />
            <col className="benthicAttribute" />
            <col className="growthForm" />
            <col className="numberOfPoints" />
            {areValidationsShowing ? <col className="validations" /> : null}
            <col className="remove" />
          </StyledColgroup>
          <thead>
            <Tr>
              <Th> </Th>
              <Th align="right" id="quadrat-number-label">
                <LabelContainer>
                  {t('observations.quadrat')} <RequiredIndicator />
                  {isHelperTextShowing && currentHelperTextLabel === 'quadrat' ? (
                    <ColumnHeaderToolTip
                      helperText={t('observations.quadrat_info')}
                      left="-3em"
                      top="-6.5em"
                    />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'quadrat')}
                  >
                    <IconInfo aria-label={t('message_type.info')} />
                  </IconButton>
                </LabelContainer>
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
                                rel="noopener noreferrer"
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
                    <IconInfo aria-label={t('message_type.info')} />
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
                    <IconInfo aria-label={t('message_type.info')} />
                  </IconButton>
                </LabelContainer>
              </Th>
              <Th align="right" id="number-of-points-label">
                <LabelContainer>
                  {t('observations.number_of_points')} <RequiredIndicator />
                  {isHelperTextShowing && currentHelperTextLabel === 'numberOfPoints' ? (
                    <ColumnHeaderToolTip
                      helperText={t('observations.number_of_points_info')}
                      left="-1em"
                      top="-11em"
                    />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'numberOfPoints')}
                  >
                    <IconInfo aria-label={t('message_type.info')} />
                  </IconButton>
                </LabelContainer>
              </Th>
              {areValidationsShowing ? (
                <Th align="center">{t('validations.validations')}</Th>
              ) : null}
              <Th> </Th>
            </Tr>
          </thead>
          <tbody>{observationsRows}</tbody>
        </StickyObservationTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <ButtonPrimary type="button" onClick={handleAddObservation}>
          <IconPlus /> {t('buttons.add_row')}
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
    </InputWrapper>
  )
}

BenthicPhotoQuadratObservationTable.propTypes = {
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

export default BenthicPhotoQuadratObservationTable
