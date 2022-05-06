import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'
import { getOptions } from '../../../library/getOptions'
import { getSiteInitialValues } from './siteRecordFormInitialValues'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2 } from '../../generic/text'
import { InputRow, InputWrapper } from '../../generic/form'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete'
import InputRadioWithLabelAndValidation from '../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../language'
import LoadingModal from '../../LoadingModal/LoadingModal'
import SaveButton from '../../generic/SaveButton'
import SingleSiteMap from '../../mermaidMap/SingleSiteMap'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'

const Site = ({ isNewSite }) => {
  const [countryOptions, setCountryOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [siteBeingEdited, setSiteBeingEdited] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { isSyncInProgress } = useSyncStatus()
  const { siteId, projectId } = useParams()
  const history = useHistory()
  const isMounted = useIsMounted()
  const currentProjectPath = useCurrentProjectPath()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProject(projectId),
      ]

      if (!isNewSite) {
        promises.push(databaseSwitchboardInstance.getSite(siteId))
      }

      Promise.all(promises)
        .then(([choicesResponse, projectResponse, siteResponse]) => {
          if (isMounted.current) {
            if (!siteResponse && siteId && !isNewSite) {
              setIdsNotAssociatedWithData((previousState) => [...previousState, siteId])
            }
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
            }
            setCountryOptions(getOptions(choicesResponse.countries))
            setExposureOptions(getOptions(choicesResponse.reefexposures))
            setReefTypeOptions(getOptions(choicesResponse.reeftypes))
            setReefZoneOptions(getOptions(choicesResponse.reefzones))
            setSiteBeingEdited(siteResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteRecordUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isSyncInProgress, projectId, siteId, isNewSite])

  const initialFormValues = useMemo(() => getSiteInitialValues(siteBeingEdited), [siteBeingEdited])

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: (formikValues, formikActions) => {
      const { country, exposure, name, latitude, longitude, notes, reef_type, reef_zone } =
        formikValues
      const formattedSiteForApi = {
        ...siteBeingEdited,
        country,
        exposure,
        name,
        notes,
        reef_type,
        reef_zone,
        location: {
          type: 'point',
          coordinates: [longitude, latitude],
        },
      }

      setSaveButtonState(buttonGroupStates.saving)
      databaseSwitchboardInstance
        .saveSite({ site: formattedSiteForApi, projectId })
        .then((response) => {
          toast.success(...getToastArguments(language.success.siteSave))
          setSaveButtonState(buttonGroupStates.saved)
          formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state

          if (isNewSite) {
            history.push(`${ensureTrailingSlash(currentProjectPath)}sites/${response.id}`)
          }
        })
        .catch(() => {
          setSaveButtonState(buttonGroupStates.unsaved)
          toast.error(...getToastArguments(language.error.siteSave))
        })
    },
    validate: (values) => {
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.latitude) {
        errors.latitude = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (values.latitude > 90 || values.latitude < -90) {
        errors.latitude = [{ code: language.error.formValidation.latitude, id: 'Invalid Latitude' }]
      }

      if (!values.longitude) {
        errors.longitude = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (values.longitude > 180 || values.longitude < -180) {
        errors.longitude = [
          { code: language.error.formValidation.longitude, id: 'Invalid Longitude' },
        ]
      }

      return errors
    },
  })

  useDocumentTitle(
    `${language.pages.siteForm.title} - ${formik.values.name} - ${language.title.mermaid}`,
  )

  const { setFieldValue: formikSetFieldValue } = formik

  const _setSiteButtonUnsaved = useEffect(() => {
    if (formik.dirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [formik.dirty])

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

  return idsNotAssociatedWithData.length && !isNewSite ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      isToolbarSticky={true}
      subNavNode={{ name: formik.values.name }}
      content={
        <>
          <form id="site-form" onSubmit={formik.handleSubmit}>
            <InputWrapper>
              <InputWithLabelAndValidation
                required
                label="Name"
                id="name"
                type="text"
                {...formik.getFieldProps('name')}
                validationType={formik.errors.name ? 'error' : null}
                validationMessages={formik.errors.name}
                testId="name"
              />
              <InputRow required data-testid="country-select">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label id="country-label">Country</label>
                <InputAutocomplete
                  id="country"
                  aria-labelledby="country-label"
                  options={countryOptions}
                  value={formik.values.country}
                  noResultsText={language.autocomplete.noResultsDefault}
                  onChange={(selectedItem) => {
                    formik.setFieldValue('country', selectedItem.value)
                  }}
                />
              </InputRow>
              <InputWithLabelAndValidation
                required
                label="Latitude"
                id="latitude"
                type="number"
                {...formik.getFieldProps('latitude')}
                validationType={formik.errors.latitude ? 'error' : null}
                validationMessages={formik.errors.latitude}
                testId="latitude"
              />
              <InputWithLabelAndValidation
                required
                label="Longitude"
                id="longitude"
                type="number"
                {...formik.getFieldProps('longitude')}
                validationType={formik.errors.longitude ? 'error' : null}
                validationMessages={formik.errors.longitude}
                testId="longitude"
              />
              {isAppOnline && (
                <SingleSiteMap
                  formLatitudeValue={formik.getFieldProps('latitude').value}
                  formLongitudeValue={formik.getFieldProps('longitude').value}
                  handleLatitudeChange={handleLatitudeChange}
                  handleLongitudeChange={handleLongitudeChange}
                />
              )}
              <InputRadioWithLabelAndValidation
                required
                label="Exposure"
                id="exposure"
                options={exposureOptions}
                {...formik.getFieldProps('exposure')}
              />
              <InputRadioWithLabelAndValidation
                required
                label="Reef Type"
                id="reef_type"
                options={reefTypeOptions}
                {...formik.getFieldProps('reef_type')}
              />
              <InputRadioWithLabelAndValidation
                required
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
          {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
          <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
        </>
      }
      toolbar={
        <ContentPageToolbarWrapper>
          {isNewSite ? <H2>{language.pages.siteForm.title}</H2> : <H2>{formik.values.name}</H2>}
          <SaveButton formId="site-form" saveButtonState={saveButtonState} formik={formik} />
        </ContentPageToolbarWrapper>
      }
    />
  )
}

Site.propTypes = { isNewSite: PropTypes.bool.isRequired }

export default Site
