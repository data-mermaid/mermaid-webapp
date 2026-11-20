import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'

import { links } from '../../../link_constants'
import { formikPropType } from '../../../library/formik/formikPropType'
import { observationsReducerPropType } from '../../../App/mermaidData/mermaidDataProptypes'
import {
  countBleachedStatuses,
  INCLUDE_BLEACHING_NO,
  INCLUDE_BLEACHING_YES,
} from '../../../library/bleachingStatus'
import { HelperTextLink } from '../../generic/links'
import getValidationPropertiesForInput from '../../pages/collectRecordFormPages/getValidationPropertiesForInput'
import InputSelectWithLabelAndValidation from '../InputSelectWithLabelAndValidation'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import TurnOffBleachingModal from './TurnOffBleachingModal'

const INCLUDE_BLEACHING_VALIDATION_PATH = 'data.include_bleaching'

const IncludeBleachingInput = ({
  areValidationsShowing,
  coralAttributeIds,
  formik,
  ignoreNonObservationFieldValidations,
  markBleachingValidationsStale,
  observationsReducer,
  unignoreNonObservationFieldValidations,
  validationsApiData,
}) => {
  const { t } = useTranslation()
  const [observationsState, observationsDispatch] = observationsReducer
  const [isTurnOffModalOpen, setIsTurnOffModalOpen] = useState(false)
  const selectRef = useRef(null)
  const bleachedStatusCount = countBleachedStatuses(observationsState)

  const validationProperties = getValidationPropertiesForInput(
    validationsApiData?.include_bleaching,
    areValidationsShowing,
  )

  // Statuses change here, on the diver's switch, and never in response to the form's value:
  // formik holds the default No until a record's values arrive, and clearing on that would wipe
  // its saved statuses.
  const switchIncludeBleaching = (newValue) => {
    formik.setFieldValue('include_bleaching', newValue)
    observationsDispatch(
      newValue === INCLUDE_BLEACHING_YES
        ? { type: 'fillBleachingStatuses', payload: { coralAttributeIds } }
        : { type: 'clearBleachingStatuses' },
    )
    markBleachingValidationsStale()
  }

  // Formik stays at Yes until the diver confirms, so the select doesn't move behind the modal.
  const handleChange = (event) => {
    const newValue = event.target.value

    if (newValue === INCLUDE_BLEACHING_NO && bleachedStatusCount > 0) {
      setIsTurnOffModalOpen(true)

      return
    }

    switchIncludeBleaching(newValue)
  }

  const closeTurnOffModal = () => {
    setIsTurnOffModalOpen(false)
    selectRef.current?.focus()
  }

  const confirmTurnOff = () => {
    switchIncludeBleaching(INCLUDE_BLEACHING_NO)
    closeTurnOffModal()
  }

  return (
    <>
      <InputSelectWithLabelAndValidation
        ref={selectRef}
        label={t('observations.include_bleaching')}
        required={true}
        id="include_bleaching"
        testId="include-bleaching"
        options={[
          { value: INCLUDE_BLEACHING_YES, label: t('yes') },
          { value: INCLUDE_BLEACHING_NO, label: t('no') },
        ]}
        isEmptyOptionShown={false}
        validationPath={INCLUDE_BLEACHING_VALIDATION_PATH}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
        {...validationProperties}
        onBlur={formik.handleBlur}
        value={formik.values.include_bleaching}
        onChange={handleChange}
        helperText={
          <Trans
            i18nKey="observations.include_bleaching_info"
            components={{
              br: <br />,
              protocolLink: (
                <HelperTextLink
                  href={links.bleachingProtocol}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              gcrmnLink: (
                <HelperTextLink
                  href={links.bleachingGcrmnSummary}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        }
      />
      <TurnOffBleachingModal
        bleachedStatusCount={bleachedStatusCount}
        isOpen={isTurnOffModalOpen}
        onConfirm={confirmTurnOff}
        onDismiss={closeTurnOffModal}
      />
    </>
  )
}

IncludeBleachingInput.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  coralAttributeIds: PropTypes.instanceOf(Set).isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  markBleachingValidationsStale: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  unignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: PropTypes.shape({
    include_bleaching: mermaidInputsPropTypes.validationMessagesPropType,
  }),
}

export default IncludeBleachingInput
