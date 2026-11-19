import React from 'react'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'

import { links } from '../../../link_constants'
import { formikPropType } from '../../../library/formik/formikPropType'
import { INCLUDE_BLEACHING_NO, INCLUDE_BLEACHING_YES } from '../../../library/bleachingStatus'
import { HelperTextLink } from '../../generic/links'
import getValidationPropertiesForInput from '../../pages/collectRecordFormPages/getValidationPropertiesForInput'
import InputSelectWithLabelAndValidation from '../InputSelectWithLabelAndValidation'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const INCLUDE_BLEACHING_VALIDATION_PATH = 'data.include_bleaching'

const IncludeBleachingInput = ({
  areValidationsShowing,
  coralAttributeIds,
  formik,
  ignoreNonObservationFieldValidations,
  markFieldValidationsStale,
  observationsDispatch,
  unignoreNonObservationFieldValidations,
  validationsApiData,
}) => {
  const { t } = useTranslation()

  const validationProperties = getValidationPropertiesForInput(
    validationsApiData?.include_bleaching,
    areValidationsShowing,
  )

  // Statuses change here, on the diver's switch, and never in response to the form's value:
  // formik holds the default No until a record's values arrive, and clearing on that would wipe
  // its saved statuses.
  const handleChange = (event) => {
    formik.handleChange(event)
    observationsDispatch(
      event.target.value === INCLUDE_BLEACHING_YES
        ? { type: 'fillBleachingStatuses', payload: { coralAttributeIds } }
        : { type: 'clearBleachingStatuses' },
    )
    markFieldValidationsStale({ validationPath: INCLUDE_BLEACHING_VALIDATION_PATH })
  }

  return (
    <InputSelectWithLabelAndValidation
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
  )
}

IncludeBleachingInput.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  coralAttributeIds: PropTypes.instanceOf(Set).isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  markFieldValidationsStale: PropTypes.func.isRequired,
  observationsDispatch: PropTypes.func.isRequired,
  unignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: PropTypes.shape({
    include_bleaching: mermaidInputsPropTypes.validationMessagesPropType,
  }),
}

export default IncludeBleachingInput
