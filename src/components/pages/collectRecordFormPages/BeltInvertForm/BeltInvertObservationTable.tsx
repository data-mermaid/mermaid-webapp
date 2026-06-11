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
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'

interface ObservationRecord {
  id: string
  count?: number | null
  size?: number | string | null
  invert_attribute?: string | null
  notes?: string | null
  include?: boolean
}

interface SizeBinChoice {
  id: string | number
  name: string | number
  conditions?: { val?: string | number }[]
}

interface ChoicesWithSizeBins {
  invertsizebins?: { data?: SizeBinChoice[] }
  fishsizebins?: { data?: SizeBinChoice[] }
  invertbelttransectwidths?: { data?: SizeBinChoice[] }
  belttransectwidths?: { data?: SizeBinChoice[] }
}

interface FormikValues {
  size_bin?: string | number
  len_surveyed?: string | number
  width?: string | number
}

interface FormikLike {
  values?: FormikValues
}

interface InvertAttributeOptionInput {
  id: string
  name: string
  display_name?: string
  group_of_interest?: string | null
}

interface SelectOption {
  label: string
  value: string | number
}

const getBinLabelById = (choices: ChoicesWithSizeBins, sizeBinId: string | number | undefined) => {
  const sizeBins = choices?.invertsizebins?.data ?? choices?.fishsizebins?.data ?? []
  const selected = sizeBins.find((bin) => bin.id === sizeBinId)
  return selected?.name
}

const buildSizeOptionsFromBinLabel = (sizeBinLabel: string | number | undefined) => {
  const sizeBinInterval = Number.parseInt(String(sizeBinLabel ?? ''), 10)

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
  ignoreObservationValidations: (...args: unknown[]) => void
  index: number
  invertAttributeOptions: SelectOption[]
  observation: ObservationRecord
  observationsCount: number
  observationsDispatch: (action: unknown) => void
  onNotesClick: (observationId: string) => void
  resetObservationValidations: (args: { observationId: string }) => void
  setAreObservationsInputsDirty: (isDirty: boolean) => void
  setIsNewInvertAttributeModalOpen: (isOpen: boolean) => void
  setObservationIdToAddNewInvertAttributeTo: (observationId: string) => void
  sizeBinSelectedLabel?: string | number
  sizeOptions: SelectOption[]
  transectAreaM2: number
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
  ignoreObservationValidations,
  index,
  invertAttributeOptions,
  observation,
  observationsCount,
  observationsDispatch,
  onNotesClick,
  resetObservationValidations,
  setAreObservationsInputsDirty,
  setIsNewInvertAttributeModalOpen,
  setObservationIdToAddNewInvertAttributeTo,
  sizeBinSelectedLabel,
  sizeOptions,
  transectAreaM2,
  onObservationKeyDown,
}: ObservationRowProps) => {
  const { t } = useTranslation()
  const { id: observationId, count, size, invert_attribute: invertAttributeId } = observation
  const rowNumber = index + 1
  const observationDensity =
    transectAreaM2 > 0 && Number(count ?? 0) ? (Number(count ?? 0) / transectAreaM2) * 10000 : 0

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
    setAreObservationsInputsDirty(true)
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
      value={size ?? ''}
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
      value={size ?? ''}
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
            data-testid="species-name-autocomplete"
            disabled={!sizeBinSelectedLabel}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocusAllowed}
            isLastRow={observationsCount === rowNumber}
            aria-labelledby="species-name-label"
            options={invertAttributeOptions}
            onChange={handleInvertAttributeChange}
            value={invertAttributeId}
            noResultsText={t('search.no_results')}
            noResultsAction={
              <NewOptionButton
                type="button"
                data-testid="propose-new-species-button"
                onClick={proposeNewSpeciesClick}
              >
                {t('propose_new_species')}
              </NewOptionButton>
            }
          />
        </InputAutocompleteContainer>
      </Td>
      <Td $align="right">{sizeInput}</Td>
      <Td $align="right">
        <InputNumberNumericCharactersOnly
          value={count ?? ''}
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
      <Td $align="right">{roundToOneDecimal(observationDensity)}</Td>
      <Td $align="center">
        <ButtonRemoveRow
          tabIndex={-1}
          type="button"
          onClick={handleDeleteObservation}
          aria-label={t('delete_observation')}
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
  const transectLengthSurveyed = Number(formik?.values?.len_surveyed)
  const selectedWidthId = formik?.values?.width
  const transectWidth = useMemo(() => {
    const widthChoices =
      choices?.invertbelttransectwidths?.data ?? choices?.belttransectwidths?.data ?? []
    const selectedWidth = widthChoices?.find((option) => `${option.id}` === `${selectedWidthId}`)
    const widthFromChoice = Number(selectedWidth?.conditions?.[0]?.val ?? Number.NaN)
    const widthFromFormikValue = Number(selectedWidthId)

    if (Number.isFinite(widthFromChoice)) {
      return widthFromChoice
    }

    return Number.isFinite(widthFromFormikValue) ? widthFromFormikValue : 0
  }, [choices, selectedWidthId])
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

  const transectAreaM2 =
    Number.isFinite(transectLengthSurveyed) && Number.isFinite(transectWidth)
      ? transectLengthSurveyed * transectWidth
      : 0

  const totalDensity = useMemo(() => {
    const includedAbundance = observationsState.reduce((sum, observation) => {
      if (observation.include === false) {
        return sum
      }

      const count = Number(observation.count ?? 0)
      return sum + (Number.isFinite(count) ? count : 0)
    }, 0)

    return transectAreaM2 > 0 ? (includedAbundance / transectAreaM2) * 10000 : 0
  }, [observationsState, transectAreaM2])

  const densityPerGroupOfInterest = useMemo(() => {
    const groupMap = new Map<string | null, number>()

    observationsState.forEach((observation) => {
      if (observation.include === false || !observation.invert_attribute) {
        return
      }

      const attribute = invertAttributes.find((attr) => attr.id === observation.invert_attribute)
      const groupOfInterestId = attribute?.group_of_interest ?? null
      const count = Number(observation.count ?? 0)

      if (!Number.isFinite(count)) {
        return
      }

      const density = transectAreaM2 > 0 ? (count / transectAreaM2) * 10000 : 0
      const current = groupMap.get(groupOfInterestId) ?? 0
      groupMap.set(groupOfInterestId, current + density)
    })

    return groupMap
  }, [observationsState, invertAttributes, transectAreaM2])

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
            <col className={tableStyles.colDensity} />
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
              <Th $align="right" id="invert-density-label">
                <LabelContainer>
                  {t('submitted_macroinvertebrate.density_column_header')}
                </LabelContainer>
              </Th>
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
                ignoreObservationValidations={ignoreObservationValidations}
                index={index}
                invertAttributeOptions={invertAttributeOptions}
                observation={observation}
                observationsCount={observationsState.length}
                observationsDispatch={observationsDispatch}
                resetObservationValidations={resetObservationValidations}
                setAreObservationsInputsDirty={setAreObservationsInputsDirty}
                setIsNewInvertAttributeModalOpen={setIsNewInvertAttributeModalOpen}
                setObservationIdToAddNewInvertAttributeTo={
                  setObservationIdToAddNewInvertAttributeTo
                }
                transectAreaM2={transectAreaM2}
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
            {Array.from(densityPerGroupOfInterest.entries()).map(([groupOfInterestId, density]) => {
              const groupAttribute = invertAttributes.find(
                (attr) =>
                  attr.group_of_interest === groupOfInterestId && attr.id === groupOfInterestId,
              )
              const groupName =
                groupAttribute?.name ?? t('macroinvertebrate_observations.unknown_group')
              return (
                <Tr key={groupOfInterestId}>
                  <Th>{`${t('macroinvertebrate_observations.density')} - ${groupName}`}</Th>
                  <Td>{roundToOneDecimal(density)}</Td>
                </Tr>
              )
            })}
            <Tr>
              <Th>{t('macroinvertebrate_observations.total_density_units')}</Th>
              <Td>{roundToOneDecimal(totalDensity)}</Td>
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

export default BeltInvertObservationTable
