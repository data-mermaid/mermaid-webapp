import React, { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { getOptions } from '../../../../library/getOptions'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'
import { HelperTextLink } from '../../../generic/links'
import { links } from '../../../../link_constants'
import ClearSizeValuesModal from '../FishBeltForm/ClearSizeValueModal'
import { ObservationRecord } from './BeltInvertTypes'

const CURRENT_VALIDATION_PATH = 'data.beltinvert_transect.current'
const DEPTH_VALIDATION_PATH = 'data.beltinvert_transect.depth'
const LABEL_VALIDATION_PATH = 'data.beltinvert_transect.label'
const LENGTH_SURVEYED_VALIDATION_PATH = 'data.beltinvert_transect.len_surveyed'
const NOTES_VALIDATION_PATH = 'data.beltinvert_transect.notes'
const REEF_SLOPE_VALIDATION_PATH = 'data.beltinvert_transect.reef_slope'
const RELATIVE_DEPTH_VALIDATION_PATH = 'data.beltinvert_transect.relative_depth'
const SAMPLE_TIME_VALIDATION_PATH = 'data.beltinvert_transect.sample_time'
const SIZE_BIN_VALIDATION_PATH = 'data.beltinvert_transect.size_bin'
const TIDE_VALIDATION_PATH = 'data.beltinvert_transect.tide'
const TRANSECT_NUMBER_VALIDATION_PATH = 'data.beltinvert_transect.number'
const VISIBILITY_VALIDATION_PATH = 'data.beltinvert_transect.visibility'
const WIDTH_VALIDATION_PATH = 'data.beltinvert_transect.width'

interface WidthChoice {
  id: string
  val: number
}

interface NamedChoice {
  id: string | number
  name: string
}

interface ChoiceCollection<T> {
  data: T[]
}

interface BeltInvertChoices {
  invertbelttransectwidths?: ChoiceCollection<WidthChoice>
  invertsizebins?: ChoiceCollection<NamedChoice>
  fishsizebins?: ChoiceCollection<NamedChoice>
  reefslopes?: ChoiceCollection<NamedChoice>
  visibilities?: ChoiceCollection<NamedChoice>
  currents?: ChoiceCollection<NamedChoice>
  relativedepths?: ChoiceCollection<NamedChoice>
  tides?: ChoiceCollection<NamedChoice>
}

interface BeltInvertTransectInputsProps {
  observationsDispatch: (action: { type: string; payload?: unknown }) => void
  observationsState: ObservationRecord[]
  areValidationsShowing: boolean
  choices: BeltInvertChoices
  formik: {
    values: Record<string, unknown>
    handleBlur: (event: React.FocusEvent<HTMLElement>) => void
    handleChange: (event: React.ChangeEvent<HTMLElement>) => void
    setFieldValue: (field: string, value: unknown) => void
  }
  ignoreNonObservationFieldValidations: (args: { validationPath: string }) => void
  resetNonObservationFieldValidations: (args: {
    inputName?: string
    validationPath: string
  }) => void
  validationPropertiesWithDirtyResetOnInputChange: (
    validationProps: Record<string, unknown>,
    inputName: string,
  ) => Record<string, unknown>
  validationsApiData?: { beltinvert_transect?: Record<string, unknown> }
}

const BeltInvertTransectInputs = ({
  observationsDispatch,
  observationsState,
  areValidationsShowing,
  choices,
  formik,
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationPropertiesWithDirtyResetOnInputChange,
  validationsApiData,
}: BeltInvertTransectInputsProps) => {
  const { t } = useTranslation()

  const widthChoices = choices.invertbelttransectwidths
  const sizeBinChoices = choices.invertsizebins ?? choices.fishsizebins

  // This pattern is different from other protocols because the api returns the values differently
  const transectWidthOptions = sortArrayByObjectKey(
    (widthChoices?.data ?? []).map(({ val, id }) => ({
      label: `${val} m`,
      value: id,
    })),
    'label',
  )
  const invertSizeBinOptions = getOptions(sizeBinChoices?.data ?? [])
  const reefSlopeOptions = getOptions(choices.reefslopes?.data ?? [])
  const visibilityOptions = getOptions(choices.visibilities?.data ?? [])
  const currentOptions = getOptions(choices.currents?.data ?? [])
  const relativeDepthOptions = getOptions(choices.relativedepths?.data ?? [])
  const tideOptions = getOptions(choices.tides?.data ?? [])

  const beltinvert_transect = validationsApiData?.beltinvert_transect
  const [isClearSizeValueModalOpen, setIsClearSizeValueModalOpen] = useState(false)
  const [pendingSizeBinValue, setPendingSizeBinValue] = useState<string | null>(null)

  const transectNumberValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.number,
    areValidationsShowing,
  )
  const labelValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.label,
    areValidationsShowing,
  )
  const sampleTimeValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.sample_time,
    areValidationsShowing,
  )
  const depthValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.depth,
    areValidationsShowing,
  )
  const lengthSurveyedValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.len_surveyed,
    areValidationsShowing,
  )
  const widthValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.width,
    areValidationsShowing,
  )
  const sizeBinValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.size_bin,
    areValidationsShowing,
  )
  const reefSlopeValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.reef_slope,
    areValidationsShowing,
  )
  const visibilityValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.visibility,
    areValidationsShowing,
  )
  const currentValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.current,
    areValidationsShowing,
  )
  const relativeDepthValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.relative_depth,
    areValidationsShowing,
  )
  const tideValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.tide,
    areValidationsShowing,
  )
  const notesValidationProperties = getValidationPropertiesForInput(
    beltinvert_transect?.notes,
    areValidationsShowing,
  )

  const handleInputChange = (
    event: React.ChangeEvent<HTMLElement>,
    inputName: string,
    validationPath: string,
  ) => {
    formik.handleChange(event)

    resetNonObservationFieldValidations({ inputName, validationPath })
  }

  const openClearSizeValuesModal = () => {
    setIsClearSizeValueModalOpen(true)
  }

  const closeClearSizeValuesModal = () => {
    setIsClearSizeValueModalOpen(false)
    setPendingSizeBinValue(null)
  }

  const applySizeBinChange = (sizeBinValue: string) => {
    formik.setFieldValue('size_bin', sizeBinValue)
    resetNonObservationFieldValidations({
      inputName: 'size_bin',
      validationPath: SIZE_BIN_VALIDATION_PATH,
    })
  }

  const handleSizeBinChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeBinValue = event.target.value
    const hasBeltInvertObservations = observationsState.some(
      (obs) => obs.size !== null && obs.size !== undefined && obs.size !== '',
    )

    if (hasBeltInvertObservations) {
      setPendingSizeBinValue(sizeBinValue)
      openClearSizeValuesModal()
      return
    }

    applySizeBinChange(sizeBinValue)
  }

  const handleResetSizeValues = () => {
    if (pendingSizeBinValue !== null) {
      applySizeBinChange(pendingSizeBinValue)
    }

    observationsDispatch({ type: 'resetObservationSizes' })
    closeClearSizeValuesModal()
  }

  return (
    <>
      <InputWrapper>
        <H2>{t('transect')}</H2>
        <InputWithLabelAndValidation
          label={t('transect_number')}
          required={true}
          id="number"
          testId="transect-number"
          type="number"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({
              validationPath: TRANSECT_NUMBER_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: TRANSECT_NUMBER_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            transectNumberValidationProperties,
            'number',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.number as string | number}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'number', TRANSECT_NUMBER_VALIDATION_PATH)
          }
          helperText={t('transect_number_info')}
        />
        <InputWithLabelAndValidation
          label={t('label')}
          id="label"
          testId="label"
          type="text"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: LABEL_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: LABEL_VALIDATION_PATH })
          }}
          {...labelValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.label as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'label', LABEL_VALIDATION_PATH)
          }
          helperText={t('label_info')}
        />
        <InputWithLabelAndValidation
          label={t('sample_units.sample_time')}
          id="sample_time"
          testId="sample-time"
          type="time"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: SAMPLE_TIME_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: SAMPLE_TIME_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            sampleTimeValidationProperties,
            'sample_time',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.sample_time as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'sample_time', SAMPLE_TIME_VALIDATION_PATH)
          }
          helperText={t('sample_units.sample_time_info')}
        />
        <InputWithLabelAndValidation
          label={t('sample_units.depth')}
          required={true}
          id="depth"
          unit="m"
          testId="depth"
          type="number"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: DEPTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: DEPTH_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(depthValidationProperties, 'depth')}
          onBlur={formik.handleBlur}
          value={formik.values.depth as string | number}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'depth', DEPTH_VALIDATION_PATH)
          }
          helperText={t('sample_units.depth_info')}
        />
        <InputWithLabelAndValidation
          label={t('sample_units.transect_length_surveyed')}
          required={true}
          id="len_surveyed"
          testId="len-surveyed"
          type="number"
          unit="m"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({
              validationPath: LENGTH_SURVEYED_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: LENGTH_SURVEYED_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            lengthSurveyedValidationProperties,
            'len_surveyed',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.len_surveyed as string | number}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'len_surveyed', LENGTH_SURVEYED_VALIDATION_PATH)
          }
          helperText={t('sample_units.transect_length_surveyed_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('width')}
          required={true}
          id="width"
          testId="width"
          options={transectWidthOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: WIDTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: WIDTH_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(widthValidationProperties, 'width')}
          onBlur={formik.handleBlur}
          value={formik.values.width as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'width', WIDTH_VALIDATION_PATH)
          }
          helperText={t('width_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('macroinvertebrate_observations.size_bin')}
          required={false}
          id="size_bin"
          testId="size-bin"
          options={invertSizeBinOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: SIZE_BIN_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: SIZE_BIN_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            sizeBinValidationProperties,
            'size_bin',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.size_bin as string}
          onChange={handleSizeBinChange}
          helperText={t('macroinvertebrate_observations.size_bin_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('reef_slope')}
          required={false}
          id="reef_slope"
          testId="reef-slope"
          options={reefSlopeOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: REEF_SLOPE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: REEF_SLOPE_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            reefSlopeValidationProperties,
            'reef_slope',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.reef_slope as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'reef_slope', REEF_SLOPE_VALIDATION_PATH)
          }
          helperText={
            <Trans
              i18nKey="reef_slope_info"
              components={{
                a: (
                  <HelperTextLink
                    href={links.reefCoverClassDefinitions}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            />
          }
        />
        <InputSelectWithLabelAndValidation
          label={t('visibility')}
          required={false}
          id="visibility"
          testId="visibility"
          options={visibilityOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: VISIBILITY_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: VISIBILITY_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            visibilityValidationProperties,
            'visibility',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.visibility as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'visibility', VISIBILITY_VALIDATION_PATH)
          }
          helperText={t('visibility_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('current')}
          required={false}
          id="current"
          testId="current"
          options={currentOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: CURRENT_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: CURRENT_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            currentValidationProperties,
            'current',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.current as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'current', CURRENT_VALIDATION_PATH)
          }
          helperText={t('current_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('relative_depth')}
          required={false}
          id="relative_depth"
          testId="relative-depth"
          options={relativeDepthOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: RELATIVE_DEPTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: RELATIVE_DEPTH_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            relativeDepthValidationProperties,
            'relative_depth',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.relative_depth as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'relative_depth', RELATIVE_DEPTH_VALIDATION_PATH)
          }
          helperText={t('relative_depth_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('tide')}
          required={false}
          id="tide"
          testId="tide"
          options={tideOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: TIDE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: TIDE_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(tideValidationProperties, 'tide')}
          onBlur={formik.handleBlur}
          value={formik.values.tide as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'tide', TIDE_VALIDATION_PATH)
          }
          helperText={
            <Trans
              i18nKey="tide_info"
              components={{
                a: (
                  <HelperTextLink
                    href={links.tideIntroduction}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            />
          }
        />
        <TextareaWithLabelAndValidation
          label={t('notes')}
          id="notes"
          testId="notes"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: NOTES_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: NOTES_VALIDATION_PATH })
          }}
          {...notesValidationProperties}
          onBlur={formik.handleBlur}
          value={(formik.values.notes ?? '') as string}
          onChange={(event: React.ChangeEvent<HTMLElement>) =>
            handleInputChange(event, 'notes', NOTES_VALIDATION_PATH)
          }
        />
      </InputWrapper>
      <ClearSizeValuesModal
        isOpen={isClearSizeValueModalOpen}
        handleResetSizeValues={handleResetSizeValues}
        onDismiss={closeClearSizeValuesModal}
      />
    </>
  )
}

export default BeltInvertTransectInputs
