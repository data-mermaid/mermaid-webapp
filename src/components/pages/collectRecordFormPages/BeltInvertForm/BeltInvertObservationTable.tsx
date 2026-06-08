import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditNotesModal from './EditNotesModal'
import modalStyles from './EditNotesModal.module.scss'
import tableStyles from './BeltInvertObservationTable.module.scss'

import {
  ButtonRemoveRow,
  InputAutocompleteContainer,
  NewOptionButton,
  ObservationTr,
  StyledOverflowWrapper,
  StickyObservationTable,
  UnderTableRow,
  UnderTableRowButtonArea,
} from '../CollectingFormPage.Styles'
import { ButtonPrimary } from '../../../generic/buttons'
import { H2 } from '../../../generic/text'
import { IconClose, IconPlus } from '../../../icons'
import { InputWrapper, LabelContainer, RequiredIndicator, Select } from '../../../generic/form'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { ObservationsSummaryStats, Tr, Td, Th } from '../../../generic/Table/table'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import getObservationValidationInfo from '../CollectRecordFormPage/getObservationValidationInfo'
import InputNumberNumericCharactersOnly from '../../../generic/InputNumberNumericCharctersOnly/InputNumberNumericCharactersOnly'
import ObservationValidationInfo from '../ObservationValidationInfo'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'

interface ObservationRecord {
  id: string
  count?: number | null
  size?: number | string | null
  invert_attribute?: string | null
  notes?: string | null
  include?: boolean
}

interface ValidationRecord {
  context?: {
    observation_id?: string
  }
}

interface SizeBinChoice {
  id: string
  name: string
}

interface ChoicesWithSizeBins {
  invertsizebins?: { data?: SizeBinChoice[] }
  fishsizebins?: { data?: SizeBinChoice[] }
}

interface FormikValues {
  size_bin?: string | number
}

interface FormikLike {
  values?: FormikValues
}

interface InvertAttributeOptionInput {
  id: string
  name: string
  display_name?: string
}

interface SelectOption {
  label: string
  value: string | number
}

const getObservationValidations = (observationId: string, collectRecord?: unknown) => {
  const dataRoot = (
    collectRecord as {
      validations?: { results?: { data?: { obs_belt_inverts?: ValidationRecord[] } } }
    }
  )?.validations?.results?.data
  const allObservationsValidations = dataRoot?.obs_belt_inverts ?? []

  return allObservationsValidations.flat().filter((validation: ValidationRecord) => {
    return validation.context?.observation_id === observationId
  })
}

const getBinLabelById = (choices: ChoicesWithSizeBins, sizeBinId: string | number | undefined) => {
  const sizeBins = choices?.invertsizebins?.data ?? choices?.fishsizebins?.data ?? []
  const selected = sizeBins.find((bin) => bin.id === sizeBinId)
  return selected?.name
}

const buildSizeOptionsFromBinLabel = (sizeBinLabel: string | undefined) => {
  const sizeBinInterval = Number.parseInt(sizeBinLabel ?? '', 10)

  if (!Number.isFinite(sizeBinInterval) || sizeBinInterval <= 1) {
    return []
  }

  const sizeOptions = []
  for (let lower = 0; lower < 50; lower += sizeBinInterval) {
    const upper = lower + sizeBinInterval
    const midpoint = lower + sizeBinInterval / 2
    sizeOptions.push({ label: `${lower} - ${upper}`, value: midpoint })
  }

  sizeOptions.push({ label: '50+', value: 50 })
  return sizeOptions
}

interface BeltInvertObservationTableProps {
  areValidationsShowing: boolean
  choices: ChoicesWithSizeBins
  collectRecord?: unknown
  formik: FormikLike
  ignoreObservationValidations: (...args: unknown[]) => void
  observationsReducer: [ObservationRecord[], (action: unknown) => void]
  resetObservationValidations: (args: { observationId: string }) => void
  setAreObservationsInputsDirty: (isDirty: boolean) => void
  setIsNewInvertAttributeModalOpen: (isOpen: boolean) => void
  setObservationIdToAddNewInvertAttributeTo: (observationId: string) => void
  invertAttributes?: InvertAttributeOptionInput[]
  invertAttributesLoadError?: boolean
  testId: string
}

interface ObservationRowProps {
  areValidationsShowing: boolean
  autoFocusAllowed: boolean
  collectRecord?: unknown
  deleteObservationText: string
  ignoreObservationValidations: (...args: unknown[]) => void
  index: number
  invertAttributeOptions: SelectOption[]
  noResultsText: string
  observation: ObservationRecord
  observationsCount: number
  observationsDispatch: (action: unknown) => void
  onNotesClick: (observationId: string) => void
  proposeNewSpeciesText: string
  resetObservationValidations: (args: { observationId: string }) => void
  setAreObservationsInputsDirty: (isDirty: boolean) => void
  setIsNewInvertAttributeModalOpen: (isOpen: boolean) => void
  setObservationIdToAddNewInvertAttributeTo: (observationId: string) => void
  sizeBinSelectedLabel?: string
  sizeOptions: SelectOption[]
  onObservationKeyDown: (args: {
    event: React.KeyboardEvent
    index: number
    observation: ObservationRecord
    isCount?: boolean
  }) => void
}

const BeltInvertObservationRow = ({
  areValidationsShowing,
  autoFocusAllowed,
  collectRecord,
  deleteObservationText,
  ignoreObservationValidations,
  index,
  invertAttributeOptions,
  noResultsText,
  observation,
  observationsCount,
  observationsDispatch,
  onNotesClick,
  proposeNewSpeciesText,
  resetObservationValidations,
  setAreObservationsInputsDirty,
  setIsNewInvertAttributeModalOpen,
  setObservationIdToAddNewInvertAttributeTo,
  sizeBinSelectedLabel,
  sizeOptions,
  onObservationKeyDown,
}: ObservationRowProps) => {
  const { id: observationId, count, size, invert_attribute: invertAttributeId } = observation
  const rowNumber = index + 1
  const sizeOrEmptyString = size ?? ''
  const countOrEmptyString = count ?? ''

  const showNumericSizeInput =
    sizeBinSelectedLabel?.toString() === '1' || typeof sizeBinSelectedLabel === 'undefined'

  const handleDeleteObservation = () => {
    setAreObservationsInputsDirty(true)
    observationsDispatch({ type: 'deleteObservation', payload: observationId })
  }

  const handleUpdateSize = (newSize: string) => {
    setAreObservationsInputsDirty(true)
    observationsDispatch({
      type: 'updateSize',
      payload: { newSize, observationId },
    })
    resetObservationValidations({ observationId })
  }

  const handleUpdateSizeFromInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regExNumbers = new RegExp(/\D/g)
    const newValue = event.target.value.replace(regExNumbers, '')
    handleUpdateSize(newValue)
  }

  const handleUpdateCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regExNumbers = new RegExp(/\D/g)
    const newValue = event.target.value.replace(regExNumbers, '')

    setAreObservationsInputsDirty(true)
    observationsDispatch({
      type: 'updateCount',
      payload: { newCount: newValue, observationId },
    })
    resetObservationValidations({ observationId })
  }

  const handleInvertAttributeChange = (selectedOption: { value: string }) => {
    const newInvertAttribute = selectedOption.value

    setAreObservationsInputsDirty(true)
    observationsDispatch({
      type: 'updateInvertName',
      payload: {
        newInvertAttribute,
        observationId,
      },
    })
    resetObservationValidations({ observationId })
  }

  const proposeNewSpeciesClick = () => {
    setObservationIdToAddNewInvertAttributeTo(observationId)
    setIsNewInvertAttributeModalOpen(true)
  }

  const handleIncludeToggle = () => {
    observationsDispatch({
      type: 'includeToggle',
      payload: { observationId },
    })
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

  const sizeInput = showNumericSizeInput ? (
    <InputNumberNumericCharactersOnly
      value={sizeOrEmptyString}
      step="any"
      disabled={!sizeBinSelectedLabel}
      aria-labelledby="invert-size-label"
      data-testid="invert-size-input"
      onChange={handleUpdateSizeFromInput}
      onKeyDown={(event: React.KeyboardEvent) =>
        onObservationKeyDown({ event, index, observation })
      }
    />
  ) : (
    <Select
      value={sizeOrEmptyString}
      aria-labelledby="invert-size-label"
      data-testid="invert-size-select"
      disabled={!sizeBinSelectedLabel}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
        handleUpdateSize(event.target.value)
      }
      onKeyDown={(event: React.KeyboardEvent) =>
        onObservationKeyDown({ event, index, observation })
      }
    >
      <option value=""> </option>
      {sizeOptions.map((option: SelectOption) => {
        return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )
      })}
    </Select>
  )

  return (
    <ObservationTr key={observationId}>
      <Td $align="center">{rowNumber}</Td>
      <Td $align="left">
        <InputAutocompleteContainer>
          <ObservationAutocomplete
            id={`observation-${observationId}`}
            data-testid="invert-name-autocomplete"
            disabled={!sizeBinSelectedLabel}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocusAllowed}
            isLastRow={observationsCount === rowNumber}
            aria-labelledby="invert-name-label"
            options={invertAttributeOptions}
            onChange={handleInvertAttributeChange}
            value={invertAttributeId}
            noResultsText={noResultsText}
            noResultsAction={
              <NewOptionButton
                type="button"
                data-testid="propose-new-invert-button"
                onClick={proposeNewSpeciesClick}
              >
                {proposeNewSpeciesText}
              </NewOptionButton>
            }
          />
        </InputAutocompleteContainer>
      </Td>
      <Td $align="right">{sizeInput}</Td>
      <Td $align="right">
        <InputNumberNumericCharactersOnly
          value={countOrEmptyString}
          step="any"
          aria-labelledby="invert-count-label"
          onChange={handleUpdateCount}
          disabled={!sizeBinSelectedLabel}
          data-testid="invert-count-input"
          onKeyDown={(event: React.KeyboardEvent) => {
            onObservationKeyDown({ event, index, observation, isCount: true })
          }}
        />
      </Td>
      <Td $align="center">
        <input
          type="checkbox"
          checked={observation.include ?? true}
          onChange={handleIncludeToggle}
          data-testid="invert-include-checkbox"
          aria-label={`Include observation row ${index + 1}`}
        />
      </Td>
      <Td
        className={modalStyles.clickableNotesTd}
        $align="left"
        role="button"
        tabIndex={0}
        aria-label={`Edit notes for row ${rowNumber}`}
        data-testid="notes-cell"
        onClick={() => onNotesClick(observationId)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onNotesClick(observationId)
          }
        }}
      >
        {observation.notes ?? ''}
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
      <Td $align="center">
        <ButtonRemoveRow
          tabIndex={-1}
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
}

const BeltInvertObservationTable = ({
  areValidationsShowing,
  choices,
  collectRecord = undefined,
  formik,
  ignoreObservationValidations,
  observationsReducer = [[], () => undefined],
  resetObservationValidations,
  setAreObservationsInputsDirty,
  setIsNewInvertAttributeModalOpen,
  setObservationIdToAddNewInvertAttributeTo,
  invertAttributes = [],
  invertAttributesLoadError = false,
  testId,
}: BeltInvertObservationTableProps) => {
  const { t } = useTranslation()
  const sizeBinSelected = formik?.values?.size_bin
  const sizeBinSelectedLabel = getBinLabelById(choices, sizeBinSelected)
  const [autoFocusAllowed, setAutoFocusAllowed] = useState(false)
  const [observationsState, observationsDispatch] = observationsReducer
  const [notesModalObservationId, setNotesModalObservationId] = useState<string | null>(null)

  const notesModalObservation = notesModalObservationId
    ? observationsState.find((o) => o.id === notesModalObservationId) ?? null
    : null
  const notesModalRowIndex = notesModalObservationId
    ? observationsState.findIndex((o) => o.id === notesModalObservationId)
    : -1

  const handleNotesDone = (newNote: string) => {
    if (!notesModalObservationId) {
      return
    }
    setAreObservationsInputsDirty(true)
    observationsDispatch({
      type: 'updateNotes',
      payload: { observationId: notesModalObservationId, newNotes: newNote },
    })
    setNotesModalObservationId(null)
  }

  const noResultsText = t('search.no_results')
  const proposeNewSpeciesText = t('propose_new_species')
  const deleteObservationText = t('delete_observation')

  const invertAttributeOptions = useMemo(() => {
    return ((invertAttributes as InvertAttributeOptionInput[]) ?? []).map(
      ({ id, name, display_name }) => ({
        label: display_name ?? name,
        value: id,
      }),
    )
  }, [invertAttributes])
  const sizeOptions = useMemo(
    () => buildSizeOptionsFromBinLabel(sizeBinSelectedLabel),
    [sizeBinSelectedLabel],
  )

  const totalAbundance = useMemo(
    () => summarizeArrayObjectValuesByProperty(observationsState, 'count'),
    [observationsState],
  )

  const handleAddObservation = () => {
    setAreObservationsInputsDirty(true)
    setAutoFocusAllowed(true)
    observationsDispatch({ type: 'addObservation' })
  }

  const handleObservationKeyDown = useCallback(
    ({
      event,
      index,
      observation,
      isCount = false,
    }: {
      event: React.KeyboardEvent
      index: number
      observation: ObservationRecord
      isCount?: boolean
    }) => {
      const isTabKey = event.code === 'Tab' && !event.shiftKey
      const isEnterKey = event.code === 'Enter'
      const isLastRow = index === observationsState.length - 1

      if (isTabKey && isLastRow && isCount && sizeBinSelectedLabel) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'duplicateLastObservation',
          payload: { referenceObservation: observation },
        })
        setAreObservationsInputsDirty(true)
      }

      if (isEnterKey && sizeBinSelectedLabel) {
        event.preventDefault()
        setAutoFocusAllowed(true)
        observationsDispatch({
          type: 'addNewObservationBelow',
          payload: { referenceObservationIndex: index },
        })
        setAreObservationsInputsDirty(true)
      }
    },
    [
      observationsDispatch,
      observationsState.length,
      setAreObservationsInputsDirty,
      sizeBinSelectedLabel,
    ],
  )

  return (
    <InputWrapper data-testid={testId}>
      <EditNotesModal
        isOpen={notesModalObservationId !== null}
        rowNumber={notesModalRowIndex + 1}
        invertAttributeName={
          notesModalObservation?.invert_attribute
            ? (invertAttributeOptions.find(
                (opt) => opt.value === notesModalObservation.invert_attribute,
              )?.label as string | undefined)
            : undefined
        }
        currentNote={notesModalObservation?.notes ?? ''}
        onDismiss={() => setNotesModalObservationId(null)}
        onDone={handleNotesDone}
      />
      <H2 id="table-label">{t('observations.observations')}</H2>
      <StyledOverflowWrapper>
        <StickyObservationTable
          data-testid="invert-observations-table"
          aria-labelledby="table-label"
        >
          <colgroup>
            <col className={tableStyles.colNumber} />
            <col className={tableStyles.colInvertName} />
            <col className={tableStyles.colSize} />
            <col className={tableStyles.colCount} />
            <col className={tableStyles.colInclude} />
            <col className={tableStyles.colNotes} />
            {areValidationsShowing ? <col className={tableStyles.colValidations} /> : null}
            <col className={tableStyles.colRemove} />
          </colgroup>
          <thead>
            <Tr>
              <Th> </Th>
              <Th $align="left" id="invert-name-label">
                <LabelContainer>
                  {t('macroinvertebrate_observations.macroinvertebrate_name')} <RequiredIndicator />
                </LabelContainer>
              </Th>
              <Th $align="right" id="invert-size-label">
                <LabelContainer>
                  {`${t('sample_units.size')} (${t('measurements.centimeter_short')})`}
                  <RequiredIndicator />
                </LabelContainer>
              </Th>
              <Th $align="right" id="invert-count-label">
                <LabelContainer>
                  {t('count')} <RequiredIndicator />
                </LabelContainer>
              </Th>
              <Th $align="center" id="invert-include-label">
                <LabelContainer>{t('include')}</LabelContainer>
              </Th>
              <Th $align="left" id="invert-notes-label">
                <LabelContainer>{t('notes')}</LabelContainer>
              </Th>
              {areValidationsShowing ? (
                <Th $align="center" id="invert-validations-label">
                  {t('validations.validations')}
                </Th>
              ) : null}
              <Th> </Th>
            </Tr>
          </thead>

          <tbody>
            {observationsState.map((observation, index) => (
              <BeltInvertObservationRow
                key={observation.id}
                areValidationsShowing={areValidationsShowing}
                autoFocusAllowed={autoFocusAllowed}
                collectRecord={collectRecord}
                deleteObservationText={deleteObservationText}
                ignoreObservationValidations={ignoreObservationValidations}
                index={index}
                invertAttributeOptions={invertAttributeOptions}
                noResultsText={noResultsText}
                observation={observation}
                observationsCount={observationsState.length}
                observationsDispatch={observationsDispatch}
                proposeNewSpeciesText={proposeNewSpeciesText}
                resetObservationValidations={resetObservationValidations}
                setAreObservationsInputsDirty={setAreObservationsInputsDirty}
                setIsNewInvertAttributeModalOpen={setIsNewInvertAttributeModalOpen}
                setObservationIdToAddNewInvertAttributeTo={
                  setObservationIdToAddNewInvertAttributeTo
                }
                onNotesClick={setNotesModalObservationId}
                sizeBinSelectedLabel={sizeBinSelectedLabel}
                sizeOptions={sizeOptions}
                onObservationKeyDown={handleObservationKeyDown}
              />
            ))}
          </tbody>
        </StickyObservationTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <UnderTableRowButtonArea>
          <ButtonPrimary
            type="button"
            onClick={handleAddObservation}
            disabled={!sizeBinSelectedLabel || invertAttributesLoadError}
            data-testid="add-observation-row"
          >
            <IconPlus /> {t('buttons.add_row')}
          </ButtonPrimary>
          {!sizeBinSelectedLabel ? (
            <p>{t('macroinvertebrate_observations.must_select_size_bin_warning')}</p>
          ) : null}
          {invertAttributesLoadError ? (
            <p>{t('macroinvertebrate_observations.species_taxonomy_unavailable')}</p>
          ) : null}
        </UnderTableRowButtonArea>
        <ObservationsSummaryStats>
          <tbody>
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

export default BeltInvertObservationTable
