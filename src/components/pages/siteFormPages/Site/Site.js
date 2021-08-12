import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { getSiteInitialValues } from '../siteRecordFormInitialValues'
import { H2 } from '../../../generic/text'
import { ContentPageLayout } from '../../../Layout'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import InputWithLabelAndValidation from '../../../generic/InputWithLabelAndValidation'
import InputRadioWithLabelAndValidation from '../../../generic/InputRadioWithLabelAndValidation'
import InputAutocomplete from '../../../generic/InputAutocomplete'
import TextareaWithLabelAndValidation from '../../../generic/TextareaWithLabelAndValidation'
import MermaidMap from '../../../MermaidMap'
import { InputRow, InputWrapper } from '../../../generic/form'
import { getOptions } from '../../../../library/getOptions'

const Site = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [countryOptions, setCountryOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [siteBeingEdited, setSiteBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { siteId, projectId } = useParams()

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance && siteId && projectId) {
      const promises = [
        databaseSwitchboardInstance.getSite({ id: siteId, projectId }),
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
  }, [databaseSwitchboardInstance, siteId, projectId])

  const initialFormValues = useMemo(
    () => getSiteInitialValues(siteBeingEdited),
    [siteBeingEdited],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
  })

  const { setFieldValue: formikSetFieldValue } = formik

  const handleLatitudeChange = useCallback(
    (value) => {
      formikSetFieldValue('latitude', value)
    },
    [formikSetFieldValue],
  )

  const handleLongitudeChange = useCallback(
    (value) => {
      formikSetFieldValue('longitude', value)
    },
    [formikSetFieldValue],
  )

  return (
    <ContentPageLayout
      isPageContentLoading={isLoading}
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
              <InputRow>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="country">Country</label>
                <InputAutocomplete
                  id="country"
                  options={countryOptions}
                  value={formik.values.country}
                  onChange={(selectedItem) => {
                    formik.setFieldValue('country', selectedItem.value)
                  }}
                />
              </InputRow>
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
                handleLatitudeChange={handleLatitudeChange}
                handleLongitudeChange={handleLongitudeChange}
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
  )
}

export default Site
