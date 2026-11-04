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
  formik,
  ignoreNonObservationFieldValidations,
  markFieldValidationsStale,
  unignoreNonObservationFieldValidations,
  validationsApiData,
}) => {
  const { t } = useTranslation()

  const validationProperties = getValidationPropertiesForInput(
    validationsApiData?.include_bleaching,
    areValidationsShowing,
  )

  const handleChange = (event) => {
    formik.handleChange(event)
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
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  markFieldValidationsStale: PropTypes.func.isRequired,
  unignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: PropTypes.shape({
    include_bleaching: mermaidInputsPropTypes.validationMessagesPropType,
  }),
}

export default IncludeBleachingInput
