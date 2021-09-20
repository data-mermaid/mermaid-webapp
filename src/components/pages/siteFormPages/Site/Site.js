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
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useIsMounted from '../../../../library/useIsMounted'
import language from '../../../../language'

const Site = () => {
  const [countryOptions, setCountryOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [siteBeingEdited, setSiteBeingEdited] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()
  const { siteId } = useParams()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && siteId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSite(siteId),
        databaseSwitchboardInstance.getChoices(),
      ]

      Promise.all(promises)
        .then(([siteResponse, choicesResponse]) => {
          if (isMounted.current) {
            setCountryOptions(getOptions(choicesResponse.countries))
            setExposureOptions(getOptions(choicesResponse.reefexposures))
            setReefTypeOptions(getOptions(choicesResponse.reeftypes))
            setReefZoneOptions(getOptions(choicesResponse.reefzones))
            setSiteBeingEdited(siteResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(language.error.siteRecordUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, siteId, isSyncInProgress, isMounted])

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
          <H2>{formik.values.name}</H2>
        </>
      }
    />
  )
}

export default Site
