import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  choicesPropType,
  fishbeltValidationPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formik/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import ClearSizeValuesModal from './ClearSizeValueModal'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'
import { getFishBinLabel } from './fishBeltBins'
import { useTranslation, Trans } from 'react-i18next'
import { HelperTextLink } from '../../../generic/links'
import { links } from '../../../../link_constants'

const CURRENT_VALIDATION_PATH = 'data.fishbelt_transect.current'
const DEPTH_VALIDATION_PATH = 'data.fishbelt_transect.depth'
const LABEL_VALIDATION_PATH = 'data.fishbelt_transect.label'
const LENGHT_SURVEYED_VALIDATION_PATH = 'data.fishbelt_transect.len_surveyed'
const NOTES_VALIDATION_PATH = 'data.fishbelt_transect.notes'
const REEF_SLOPE_VALIDATION_PATH = 'data.fishbelt_transect.reef_slope'
const RELATIVE_DEPTH_VALIDATION_PATH = 'data.fishbelt_transect.relative_depth'
const SAMPLE_TIME_VALIDATION_PATH = 'data.fishbelt_transect.sample_time'
const SIZE_BIN_VALIDATION_PATH = 'data.fishbelt_transect.size_bin'
const TIDE_VALIDATION_PATH = 'data.fishbelt_transect.tide'
const TRANSECT_NUMBER_VALIDATION_PATH = 'data.fishbelt_transect.number'
const VISIBILITY_VALIDATION_PATH = 'data.fishbelt_transect.visibility'
const WIDTH_VALIDATION_PATH = 'data.fishbelt_transect.width'

const FishBeltTransectInputs = ({
  areValidationsShowing,
  choices,
  formik,
  ignoreNonObservationFieldValidations,
  observationsDispatch = () => {},
  observationsState = [],
  resetNonObservationFieldValidations,
  validationPropertiesWithDirtyResetOnInputChange,
  validationsApiData,
}) => {
  const {
    belttransectwidths,
    fishsizebins,
    reefslopes,
    relativedepths,
    visibilities,
    currents,
    tides,
  } = choices
  const { t } = useTranslation()
  const transectWidthOptions = sortArrayByObjectKey(getOptions(belttransectwidths.data), 'label')
  const fishSizeBinOptions = getOptions(fishsizebins.data)
  const reefSlopeOptions = getOptions(reefslopes.data)
  const visibilityOptions = getOptions(visibilities.data)
  const currentOptions = getOptions(currents.data)
  const relativeDepthOptions = getOptions(relativedepths.data)
  const tideOptions = getOptions(tides.data)
  const fishbelt_transect = validationsApiData?.fishbelt_transect
  // account for empty starter row
  const hasFishBeltObservations =
    !!observationsState?.length > 0 && observationsState[0]?.fish_attribute
  const [isClearSizeValueModalOpen, setIsClearSizeValueModalOpen] = useState(false)
  const [sizeBinValue, setSizeBinValue] = useState('')

  const onSizeBinChange = (event) => {
    const sizeBinId = sizeBinValue || event?.target?.value

    formik.setFieldValue('size_bin', sizeBinId)

    const fishBinSelectedLabel = getFishBinLabel(choices, sizeBinId)

    const isSizeBinATypeThatRequiresSizeResetting = fishBinSelectedLabel !== '1'

    if (isSizeBinATypeThatRequiresSizeResetting) {
      observationsDispatch({ type: 'resetFishSizes' })
    }
  }

  const transectNumberValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.number,
    areValidationsShowing,
  )

  const labelValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.label,
    areValidationsShowing,
  )
  const lengthSurveyedValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.len_surveyed,
    areValidationsShowing,
  )
  const widthValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.width,
    areValidationsShowing,
  )

  const sizeBinValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.size_bin,
    areValidationsShowing,
  )

  const reefSlopeValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.reef_slope,
    areValidationsShowing,
  )
  const relativeDepthValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.relative_depth,
    areValidationsShowing,
  )
  const visibilityValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.visibility,
    areValidationsShowing,
  )
  const currentValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.current,
    areValidationsShowing,
  )
  const tideValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.tide,
    areValidationsShowing,
  )

  const notesValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.notes,
    areValidationsShowing,
  )

  const sampleTimeValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.sample_time,
    areValidationsShowing,
  )

  const depthValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.depth,
    areValidationsShowing,
  )

  const openClearSizeValuesModal = () => {
    setIsClearSizeValueModalOpen(true)
  }
  const closeClearSizeValuesModal = () => {
    setIsClearSizeValueModalOpen(false)
  }

  const handleTransectNumberChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'number',
      validationPath: TRANSECT_NUMBER_VALIDATION_PATH,
    })
  }

  const handleLabelChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'label',
      validationPath: LABEL_VALIDATION_PATH,
    })
  }

  const handleLengthSurveyedChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'len_surveyed',
      validationPath: LENGHT_SURVEYED_VALIDATION_PATH,
    })
  }
  const handleWidthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'width',
      validationPath: WIDTH_VALIDATION_PATH,
    })
  }

  const handleSizeBinChange = (event) => {
    if (hasFishBeltObservations) {
      setSizeBinValue(event.target.value)
      openClearSizeValuesModal()
    } else {
      onSizeBinChange(event)
      resetNonObservationFieldValidations({
        inputName: 'size_bin',
        validationPath: SIZE_BIN_VALIDATION_PATH,
      })
    }
  }
  const handleReefSlopeChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'reef_slope',
      validationPath: REEF_SLOPE_VALIDATION_PATH,
    })
  }
  const handleRelativeDepthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'relative_depth',
      validationPath: RELATIVE_DEPTH_VALIDATION_PATH,
    })
  }
  const handleVisibilityChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'visibility',
      validationPath: VISIBILITY_VALIDATION_PATH,
    })
  }
  const handleCurrentChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'current',
      validationPath: CURRENT_VALIDATION_PATH,
    })
  }
  const handleTideChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'tide',
      validationPath: TIDE_VALIDATION_PATH,
    })
  }
  const handleNotesChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'notes',
      validationPath: NOTES_VALIDATION_PATH,
    })
  }

  const handleSampleTimeChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'sample_time',
      validationPath: SAMPLE_TIME_VALIDATION_PATH,
    })
  }

  const handleDepthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'depth',
      validationPath: DEPTH_VALIDATION_PATH,
    })
  }

  const handleResetSizeValues = () => {
    onSizeBinChange()
    resetNonObservationFieldValidations({
      inputName: 'size_bin',
      validationPath: SIZE_BIN_VALIDATION_PATH,
    })
    observationsDispatch({
      type: 'resetFishSizes',
    })
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
          value={formik.values.number}
          onChange={handleTransectNumberChange}
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
          value={formik.values.label}
          onChange={handleLabelChange}
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
          value={formik.values.sample_time}
          onChange={handleSampleTimeChange}
          helperText={t('sample_units.sample_time_info')}
        />

        <InputWithLabelAndValidation
          label={t('sample_units.depth')}
          required={true}
          id="depth"
          unit="m"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: DEPTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: DEPTH_VALIDATION_PATH })
          }}
          testId="depth"
          type="number"
          {...validationPropertiesWithDirtyResetOnInputChange(depthValidationProperties, 'depth')}
          onBlur={formik.handleBlur}
          value={formik.values.depth}
          onChange={handleDepthChange}
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
              validationPath: LENGHT_SURVEYED_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: LENGHT_SURVEYED_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            lengthSurveyedValidationProperties,
            'len_surveyed',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.len_surveyed}
          onChange={handleLengthSurveyedChange}
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
          {...widthValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(widthValidationProperties, 'width')}
          onBlur={formik.handleBlur}
          value={formik.values.width}
          onChange={handleWidthChange}
          helperText={t('width_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('fish_size_bin')}
          required={true}
          id="size_bin"
          testId="size-bin"
          options={fishSizeBinOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: SIZE_BIN_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: SIZE_BIN_VALIDATION_PATH })
          }}
          {...sizeBinValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            sizeBinValidationProperties,
            'size_bin',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.size_bin}
          onChange={handleSizeBinChange}
          helperText={t('fish_size_bin_info')}
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
          {...reefSlopeValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            reefSlopeValidationProperties,
            'reef_slope',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.reef_slope}
          onChange={handleReefSlopeChange}
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
          {...visibilityValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            visibilityValidationProperties,
            'visibility',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.visibility}
          onChange={handleVisibilityChange}
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
          {...currentValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            currentValidationProperties,
            'current',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.current}
          onChange={handleCurrentChange}
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
          {...relativeDepthValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            relativeDepthValidationProperties,
            'relative_depth',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.relative_depth}
          onChange={handleRelativeDepthChange}
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
          {...tideValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(tideValidationProperties, 'tide')}
          onBlur={formik.handleBlur}
          value={formik.values.tide}
          onChange={handleTideChange}
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
          value={formik.values.notes}
          onChange={handleNotesChange}
        />
      </InputWrapper>
      <ClearSizeValuesModal
        isOpen={isClearSizeValueModalOpen}
        handleResetSizeValues={handleResetSizeValues}
        onDismiss={closeClearSizeValuesModal}
        openModal={openClearSizeValuesModal}
      />
    </>
  )
}

FishBeltTransectInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  observationsState: PropTypes.arrayOf(PropTypes.shape({ fish_attribute: PropTypes.string })),
  observationsDispatch: PropTypes.func,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: PropTypes.shape({ fishbelt_transect: fishbeltValidationPropType }).isRequired,
  validationPropertiesWithDirtyResetOnInputChange: PropTypes.func.isRequired,
}

export default FishBeltTransectInputs
