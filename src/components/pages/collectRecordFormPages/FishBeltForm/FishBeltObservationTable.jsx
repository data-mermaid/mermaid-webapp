import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  choicesPropType,
  observationsReducerPropType,
  fishNameConstantsPropType,
  fishBeltPropType,
  fishFamiliesPropType,
  fishGroupingsPropType,
  fishGeneraPropType,
  fishSpeciesPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  ButtonRemoveRow,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTable,
  UnderTableRow,
  UnderTableRowButtonArea,
  ButtonPopover,
  Popover,
} from '../CollectingFormPage.Styles'
import { ButtonPrimary, IconButton } from '../../../generic/buttons'
import { FishBeltObservationSizeSelect } from './FishBeltObservationSizeSelect'
import { getFishBinLabel } from './fishBeltBins'
import { getObservationBiomass } from './fishBeltBiomass'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus, IconInfo, IconBook } from '../../../icons'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper, LabelContainer, RequiredIndicator } from '../../../generic/form'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { ObservationsSummaryStats, Tr, Td, Th } from '../../../generic/Table/table'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import ColumnHeaderToolTip from '../../../ColumnHeaderToolTip/ColumnHeaderToolTip'
import theme from '../../../../theme'
import { getFishNameTable } from '../../../../App/mermaidData/fishNameHelpers'
import { useTranslation, Trans } from 'react-i18next'
import { HelperTextLink } from '../../../generic/links'
import { links } from '../../../../link_constants'

const StyledColgroup = styled('colgroup')`
  col {
    &.number {
      width: 5rem;
    }

    &.fishName {
      width: auto;
    }

    &.size {
      width: 15%;
    }

    &.count {
      width: 10%;
    }

    &.biomass {
      width: 10rem;
    }

    &.validation {
      width: auto;
    }

    &.remove {
      width: 5rem;
    }
  }
`

const getObservationValidations = (observationId, collectRecord) => {
  const allObservationsValidations =
    collectRecord?.validations?.results?.data?.obs_belt_fishes ?? []

  const justThisObservationsValidations = allObservationsValidations.flat().filter((validation) => {
    return validation.context?.observation_id === observationId
  })

  return justThisObservationsValidations
}

const FishBeltObservationTable = ({
  areValidationsShowing,
  choices,
  collectRecord = undefined,
  formik,
  ignoreObservationValidations,
  observationsReducer = [],
  resetObservationValidations,
  setAreObservationsInputsDirty,
  setIsNewBenthicAttributeModalOpen,
  setObservationIdToAddNewBenthicAttributeTo,
  fishNameConstants,
  fishNameOptions,
  testId,
  fishFamilies,
  fishGroupings,
  fishGenera,
  fishSpecies,
}) => {
  const { t } = useTranslation()
  const fishBinSelected = formik?.values?.size_bin
  const transectLengthSurveyed = formik?.values?.len_surveyed
  const widthId = formik?.values?.width
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [observationsState, observationsDispatch] = observationsReducer
  const fishBinSelectedLabel = getFishBinLabel(choices, fishBinSelected)
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [currentHelperTextLabel, setCurrentHelperTextLabel] = useState(null)
  const [observationIdWithFishNamePopoverShowing, setObservationIdWithFishNamePopoverShowing] =
    useState()
  const [fishNamePopoverContent, setFishNamePopoverContent] = useState()

  const searchNoResultsText = t('search.no_results')
  const proposeNewSpeciesText = t('propose_new_species')
  const viewFishInfoText = t('view_fish_info')
  const deleteObservationText = t('delete_observation')

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation' })
  }

  const observationsBiomass = useMemo(
    () =>
      observationsState.map((observation) => ({
        id: observation.id,
        biomass: getObservationBiomass({
          choices,
          fishNameConstants,
          observation,
          transectLengthSurveyed,
          widthId,
        }),
      })),
    [choices, fishNameConstants, transectLengthSurveyed, widthId, observationsState],
  )

  const totalBiomass = useMemo(
    () => roundToOneDecimal(summarizeArrayObjectValuesByProperty(observationsBiomass, 'biomass')),
    [observationsBiomass],
  )

  const totalAbundance = useMemo(
    () => summarizeArrayObjectValuesByProperty(observationsState, 'count'),
    [observationsState],
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

  const handlePopoverButtonClick = useCallback(
    ({ observationId, fishNameId }) => {
      const popoverTable = getFishNameTable({
        fishFamilies,
        fishGroupings,
        choices,
        fishGenera,
        fishSpecies,
        fishNameId,
      })

      setFishNamePopoverContent(popoverTable)
      setObservationIdWithFishNamePopoverShowing(observationId)
    },
    [choices, fishFamilies, fishGenera, fishSpecies, fishGroupings],
  )

  const resetObservationIdWithFishNamePopoverShowing = () => {
    setObservationIdWithFishNamePopoverShowing(null)
  }

  const observationsRows = useMemo(() => {
    const handleKeyDown = ({ event, index, observation, isCount }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isCount && fishBinSelectedLabel) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation },
        })
        setAreObservationsInputsDirty(true)
      }

      if (isEnterKey && fishBinSelectedLabel) {
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
      const { id: observationId, count, size, fish_attribute: fishNameId } = observation
      const shouldShowObservationFishnamePopover =
        observationId === observationIdWithFishNamePopoverShowing

      const handleDeleteObservation = () => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({ type: 'deleteObservation', payload: observationId })
      }

      const rowNumber = index + 1

      const sizeOrEmptyStringToAvoidInputValueErrors = size ?? ''
      const countOrEmptyStringToAvoidInputValueErrors = count ?? ''

      const showNumericSizeInput =
        fishBinSelectedLabel?.toString() === '1' || typeof fishBinSelectedLabel === 'undefined'

      const handleUpdateSize = (newSize) => {
        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateSize',
          payload: { newSize, observationId },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const handleUpdateSizeEvent = (event) => {
        const regExNumbers = new RegExp(/\D/g)
        const newValue = event.target.value.replace(regExNumbers, '')

        handleUpdateSize(newValue, observationId)
      }

      const handleObservationKeyDown = (event) => {
        handleKeyDown({ event, index, observation })
      }

      const handleUpdateCount = (event) => {
        const regExNumbers = new RegExp(/\D/g)
        const newValue = event.target.value.replace(regExNumbers, '')

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateCount',
          payload: { newCount: newValue, observationId },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const sizeSelect = !showNumericSizeInput ? (
        <FishBeltObservationSizeSelect
          onValueEntered={handleUpdateSize}
          onKeyDown={handleObservationKeyDown}
          fishBinSelectedLabel={fishBinSelectedLabel}
          value={sizeOrEmptyStringToAvoidInputValueErrors}
          labelledBy="fish-size-label"
          testid="fish-size-select"
        />
      ) : null

      const sizeInput = showNumericSizeInput ? (
        <InputNumberNumericCharactersOnly
          value={sizeOrEmptyStringToAvoidInputValueErrors}
          step="any"
          disabled={!fishBinSelectedLabel}
          aria-labelledby="fish-size-label"
          data-testid="fish-size-input"
          onChange={handleUpdateSizeEvent}
          onKeyDown={handleObservationKeyDown}
        />
      ) : (
        <> {sizeSelect} </>
      )

      const observationBiomass = roundToOneDecimal(
        observationsBiomass.find((object) => object.id === observationId).biomass,
      )

      const observationValidations = getObservationValidations(observationId, collectRecord)

      const observationValidationsToDisplay = getValidationPropertiesForInput(
        observationValidations,
        areValidationsShowing,
      )

      const { validationType } = observationValidationsToDisplay

      const handleFishNameChange = (selectedOption) => {
        const newFishName = selectedOption.value

        setAreObservationsInputsDirty(true)
        observationsDispatch({
          type: 'updateFishName',
          payload: {
            newFishName,
            observationId,
          },
        })
        resetObservationValidations({
          observationId,
        })
      }

      const proposeNewSpeciesClick = () => {
        setObservationIdToAddNewBenthicAttributeTo(observationId)
        setIsNewBenthicAttributeModalOpen(true)
      }

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

      return (
        <ObservationTr key={observationId} messageType={validationType}>
          <Td align="center">{rowNumber}</Td>
          <Td align="left">
            {fishNameOptions.length && (
              <InputAutocompleteContainer>
                <ObservationAutocomplete
                  id={`observation-${observationId}`}
                  data-testid="fish-name-autocomplete"
                  disabled={!fishBinSelectedLabel}
                  // we only want autofocus to take over focus after the user adds
                  // new observations, not before. Otherwise initial page load focus
                  // is on the most recently painted observation instead of default focus.
                  // This approach seems easier than handling a list of refs for each observation
                  // and the logic to focus on the right one. in react autoFocus just focuses
                  // the newest element with the autoFocus tag
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={autoFocusAllowed} // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
                  isLastRow={observationsState.length === rowNumber}
                  aria-labelledby="fish-name-label"
                  options={fishNameOptions}
                  onChange={handleFishNameChange}
                  value={fishNameId}
                  noResultsText={searchNoResultsText}
                  noResultsAction={
                    <NewOptionButton
                      type="button"
                      data-testid="propose-new-species-button"
                      onClick={proposeNewSpeciesClick}
                    >
                      {proposeNewSpeciesText}
                    </NewOptionButton>
                  }
                />
                {shouldShowObservationFishnamePopover ? (
                  <Popover>{fishNamePopoverContent}</Popover>
                ) : null}
                {fishNameId ? (
                  <ButtonPopover
                    tabIndex="-1"
                    type="button"
                    aria-label={viewFishInfoText}
                    onClick={() => handlePopoverButtonClick({ observationId, fishNameId })}
                  >
                    {/* we set height ahd with here in addition in the styled component to suppress svg errors */}
                    <IconBook
                      height={theme.typography.mediumIconSize}
                      width={theme.typography.mediumIconSize}
                    />
                  </ButtonPopover>
                ) : null}
              </InputAutocompleteContainer>
            )}
          </Td>
          <Td align="right">{sizeInput}</Td>
          <Td align="right">
            <InputNumberNumericCharactersOnly
              value={countOrEmptyStringToAvoidInputValueErrors}
              step="any"
              aria-labelledby="fish-count-label"
              onChange={handleUpdateCount}
              disabled={!fishBinSelectedLabel}
              data-testid="fish-count-input"
              onKeyDown={(event) => {
                handleKeyDown({ event, index, observation, isCount: true })
              }}
            />
          </Td>
          <Td align="right">{observationBiomass ?? <> - </>}</Td>
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
              aria-label={deleteObservationText}
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
    collectRecord,
    fishBinSelectedLabel,
    fishNameOptions,
    fishNamePopoverContent,
    handlePopoverButtonClick,
    ignoreObservationValidations,
    observationIdWithFishNamePopoverShowing,
    observationsBiomass,
    observationsDispatch,
    observationsState,
    resetObservationValidations,
    setAreObservationsInputsDirty,
    setIsNewBenthicAttributeModalOpen,
    setObservationIdToAddNewBenthicAttributeTo,
    proposeNewSpeciesText,
    searchNoResultsText,
    viewFishInfoText,
    deleteObservationText,
  ])

  return (
    <InputWrapper data-testid={testId}>
      <H2 id="table-label">{t('observations')}</H2>
      <StyledOverflowWrapper>
        <StickyObservationTable
          data-testid="fish-observations-table"
          aria-labelledby="table-label"
          onMouseLeave={resetObservationIdWithFishNamePopoverShowing}
        >
          <StyledColgroup>
            <col className="number" />
            <col className="fishName" />
            <col className="size" />
            <col className="count" />
            <col className="biomass" />
            {areValidationsShowing ? <col className="validations" /> : null}
            <col className="remove" />
          </StyledColgroup>
          <thead>
            <Tr>
              <Th> </Th>
              <Th align="left" id="fish-name-label">
                <LabelContainer>
                  {t('fish_name')} <RequiredIndicator />
                  {isHelperTextShowing && currentHelperTextLabel === 'fishName' ? (
                    <ColumnHeaderToolTip
                      helperText={
                        <Trans
                          i18nKey="fish_name_observed"
                          components={{
                            a: (
                              <HelperTextLink
                                href={links.fishBaseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="#fff"
                              />
                            ),
                          }}
                        />
                      }
                      top="-13.5em"
                      left="-1.5em"
                      paddingBottom="3.5em"
                    />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'fishName')}
                  >
                    <IconInfo aria-label={t('show_fish_name_info')} />
                  </IconButton>
                </LabelContainer>
              </Th>
              <Th align="right" id="fish-size-label">
                <LabelContainer>
                  {t('size_cm')} <RequiredIndicator />
                  {isHelperTextShowing && currentHelperTextLabel === 'fishSize' ? (
                    <ColumnHeaderToolTip
                      helperText={t('fish_size_observed')}
                      top="-6em"
                      left="-2.8em"
                    />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'fishSize')}
                  >
                    <IconInfo aria-label={t('show_fish_size_info')} />
                  </IconButton>
                </LabelContainer>
              </Th>
              <Th align="right" id="fish-count-label">
                <LabelContainer>
                  {t('count')} <RequiredIndicator />
                  {isHelperTextShowing && currentHelperTextLabel === 'fishCount' ? (
                    <ColumnHeaderToolTip
                      helperText={t('fish_count_observed')}
                      top="-6em"
                      left="-4.7em"
                    />
                  ) : null}
                  <IconButton
                    type="button"
                    onClick={(event) => handleInfoIconClick(event, 'fishCount')}
                  >
                    <IconInfo aria-label={t('show_fish_count_info')} />
                  </IconButton>
                </LabelContainer>
              </Th>
              <Th align="right" id="fish-biomass-label">
                {t('biomass')}
                <br />
                <small>(kg/ha)</small>
              </Th>
              {areValidationsShowing ? (
                <Th align="center" id="fish-validations-label">
                  {t('validations')}
                </Th>
              ) : null}
              <Th> </Th>
            </Tr>
          </thead>

          <tbody>{observationsRows}</tbody>
        </StickyObservationTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <UnderTableRowButtonArea>
          <ButtonPrimary
            type="button"
            onClick={handleAddObservation}
            disabled={!fishBinSelectedLabel}
          >
            <IconPlus /> Add Row
          </ButtonPrimary>
          {!fishBinSelectedLabel ? <p>{t('must_select_fish_warning')}</p> : null}
        </UnderTableRowButtonArea>
        <ObservationsSummaryStats>
          <tbody>
            <Tr>
              <Th>{t('total_biomass')}</Th>
              <Td>{totalBiomass}</Td>
            </Tr>
            <Tr>
              <Th>{t('total_abundance')}</Th>
              <Td>{totalAbundance.toFixed(1)}</Td>
            </Tr>
          </tbody>
        </ObservationsSummaryStats>
      </UnderTableRow>
    </InputWrapper>
  )
}

FishBeltObservationTable.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  fishNameConstants: fishNameConstantsPropType.isRequired,
  fishNameOptions: inputOptionsPropTypes.isRequired,
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  resetObservationValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  formik: PropTypes.shape({
    values: PropTypes.shape({
      interval_start: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      interval_size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      len_surveyed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      size_bin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    setFieldValue: PropTypes.func,
  }).isRequired,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func.isRequired,
  setIsNewBenthicAttributeModalOpen: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  fishFamilies: fishFamiliesPropType.isRequired,
  fishGroupings: fishGroupingsPropType.isRequired,
  fishGenera: fishGeneraPropType.isRequired,
  fishSpecies: fishSpeciesPropType.isRequired,
}

export default FishBeltObservationTable
