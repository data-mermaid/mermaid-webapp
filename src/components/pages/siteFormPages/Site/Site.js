import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'

import { getSiteInitialValues } from '../siteRecordFormInitialValues'
import { H2 } from '../../../generic/text'
import { ContentPageLayout } from '../../../Layout'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import InputWithLabelAndValidation from '../../../generic/InputWithLabelAndValidation'
import InputRadioWithLabelAndValidation from '../../../generic/InputRadioWithLabelAndValidation'
import InputDownshift from '../../../generic/InputDownshift'
import TextareaWithLabelAndValidation from '../../../generic/TextareaWithLabelAndValidation'
import MermaidMap from '../../../MermaidMap'
import { InputWrapper } from '../../../generic/form'
import { getOptions } from '../../../../library/getOptions'

const Site = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [countryOptions, setCountryOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [siteBeingEdited, setSiteBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { siteId } = useParams()

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getSite(siteId),
        databaseSwitchboardInstance.getChoices(),
      ]

      Promise.all(promises)
        .then(([siteResponse, choicesResponse]) => {
          if (isMounted) {
            setCountryOptions(getOptions(choicesResponse.countries))
            setExposureOptions(getOptions(choicesResponse.reefexposures))
            setReefTypeOptions(getOptions(choicesResponse.reeftypes))
            setReefZoneOptions(getOptions(choicesResponse.reefzones))
            setSiteBeingEdited(siteResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          // Will update language file when adding user workflow like save/delete site to page.
          toast.error(`site error`)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, siteId])

  const initialFormValues = useMemo(
    () => getSiteInitialValues(siteBeingEdited),
    [siteBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  return (
    <Formik {...formikOptions}>
      {(formik) => (
        <ContentPageLayout
          isLoading={isLoading}
          content={
            <>
              <form id="site-form">
                <InputWrapper>
                  <InputWithLabelAndValidation
                    label="Name"
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                  />
                  <InputDownshift
                    label="Country"
                    id="country"
                    options={countryOptions}
                    placeholder="Enter a country"
                    value={formik.getFieldProps('country').value}
                    onChange={(selectedItem) =>
                      formik.setFieldValue('country', selectedItem.value)
                    }
                  />
                  <InputWithLabelAndValidation
                    label="Latitude"
                    id="latitude"
                    type="number"
                    {...formik.getFieldProps('latitude')}
                  />
                  <InputWithLabelAndValidation
                    label="Longitude"
                    id="longitude"
                    type="number"
                    {...formik.getFieldProps('longitude')}
                  />
                  <MermaidMap
                    formLatitudeValue={formik.getFieldProps('latitude').value}
                    formLongitudeValue={formik.getFieldProps('longitude').value}
                    handleLatitudeChange={(value) => {
                      formik.setFieldValue('latitude', value)
                    }}
                    handleLongitudeChange={(value) => {
                      formik.setFieldValue('longitude', value)
                    }}
                  />
                  <InputRadioWithLabelAndValidation
                    label="Exposure"
                    id="exposure"
                    options={exposureOptions}
                    {...formik.getFieldProps('exposure')}
                  />
                  <InputRadioWithLabelAndValidation
                    label="Reef Type"
                    id="reef_type"
                    options={reefTypeOptions}
                    {...formik.getFieldProps('reef_type')}
                  />
                  <InputRadioWithLabelAndValidation
                    label="Reef Zone"
                    id="reef_zone"
                    options={reefZoneOptions}
                    {...formik.getFieldProps('reef_zone')}
                  />
                  <TextareaWithLabelAndValidation
                    label="Notes"
                    id="notes"
                    {...formik.getFieldProps('notes')}
                  />
                </InputWrapper>
              </form>
            </>
          }
          toolbar={
            <>
              <H2>Site Name</H2>
            </>
          }
        />
      )}
    </Formik>
  )
}

export default Site
