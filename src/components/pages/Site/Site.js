import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams, useHistory } from 'react-router-dom'

import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'
import { formikPropType } from '../../../library/formikPropType'
import { getOptions } from '../../../library/getOptions'
import { getIsReadOnlyUserRole } from '../../../App/currentUserProfileHelpers'
import { getSiteInitialValues } from './siteRecordFormInitialValues'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2 } from '../../generic/text'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete'
import InputRadioWithLabelAndValidation from '../../mermaidInputs/InputRadioWithLabelAndValidation'
import { InputRow, InputWrapper, RequiredIndicator } from '../../generic/form'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import LoadingModal from '../../LoadingModal/LoadingModal'
import language from '../../../language'
import SaveButton from '../../generic/SaveButton'
import SingleSiteMap from '../../mermaidMap/SingleSiteMap'
import { sitePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../generic/Table/table'
import TableRowItem from '../../generic/Table/TableRowItem'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../library/useUnsavedDirtyFormDataUtilities'
import PageUnavailable from '../PageUnavailable'
import InputValidationInfo from '../../mermaidInputs/InputValidationInfo/InputValidationInfo'

const ReadOnlySiteContent = ({
  site,
  countryOptions,
  exposureOptions,
  reefTypeOptions,
  reefZoneOptions,
  isReadOnlyUser,
  isAppOnline,
}) => {
  const { country, latitude, longitude, exposure, reef_type, reef_zone, notes } = site

  return (
    <>
      <Table>
        <tbody>
          <TableRowItem title="Country" options={countryOptions} value={country} />
          <TableRowItem title="Latitude" value={latitude} />
          <TableRowItem title="Longitude" value={longitude} />
          <TableRowItem title="Exposure" options={exposureOptions} value={exposure} />
          <TableRowItem title="Reef Type" options={reefTypeOptions} value={reef_type} />
          <TableRowItem title="Reef Zone" options={reefZoneOptions} value={reef_zone} />
          <TableRowItem title="Notes" value={notes} />
        </tbody>
      </Table>
      {isAppOnline && (
        <SingleSiteMap
          formLatitudeValue={latitude}
          formLongitudeValue={longitude}
          isReadOnlyUser={isReadOnlyUser}
        />
      )}
    </>
  )
}

const SiteForm = ({
  formik,
  isAppOnline,
  countryOptions,
  exposureOptions,
  reefTypeOptions,
  reefZoneOptions,
  handleLatitudeChange,
  handleLongitudeChange,
}) => {
  return (
    <form id="site-form" onSubmit={formik.handleSubmit}>
      <InputWrapper>
        <InputWithLabelAndValidation
          required
          label="Name"
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          validationType={formik.errors.name && formik.touched.name ? 'error' : null}
          validationMessages={formik.errors.name}
          testId="name"
        />
        <InputRow
          validationType={formik.errors.country && formik.touched.country ? 'error' : null}
          data-testid="country-select"
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label id="country-label">
            Country <RequiredIndicator />{' '}
          </label>
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
          <InputValidationInfo
            validationType={formik.errors.country && formik.touched.country ? 'error' : null}
            validationMessages={formik.errors.country}
          />
        </InputRow>
        <InputWithLabelAndValidation
          required
          label="Latitude"
          id="latitude"
          type="number"
          {...formik.getFieldProps('latitude')}
          validationType={formik.errors.latitude && formik.touched.latitude ? 'error' : null}
          validationMessages={formik.errors.latitude}
          testId="latitude"
        />
        <InputWithLabelAndValidation
          required
          label="Longitude"
          id="longitude"
          type="number"
          {...formik.getFieldProps('longitude')}
          validationType={formik.errors.longitude && formik.touched.longitude ? 'error' : null}
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
          validationType={formik.errors.exposure && formik.touched.exposure ? 'error' : null}
          validationMessages={formik.errors.exposure}
        />
        <InputRadioWithLabelAndValidation
          required
          label="Reef Type"
          id="reef_type"
          options={reefTypeOptions}
          {...formik.getFieldProps('reef_type')}
          validationType={formik.errors.reef_type && formik.touched.reef_type ? 'error' : null}
          validationMessages={formik.errors.reef_type}
        />
        <InputRadioWithLabelAndValidation
          required
          label="Reef Zone"
          id="reef_zone"
          options={reefZoneOptions}
          {...formik.getFieldProps('reef_zone')}
          validationType={formik.errors.reef_zone && formik.touched.reef_zone ? 'error' : null}
          validationMessages={formik.errors.reef_zone}
        />
        <TextareaWithLabelAndValidation
          label="Notes"
          id="notes"
          {...formik.getFieldProps('notes')}
        />
      </InputWrapper>
    </form>
  )
}

const Site = ({ isNewSite }) => {
  const [countryOptions, setCountryOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormDirty, setIsFormDirty] = useState(false)
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
  const { currentUser } = useCurrentUser()

  const isReadOnlyUser = getIsReadOnlyUserRole(currentUser, projectId)

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

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSiteInputs`)

  const initialFormValues = useMemo(() => {
    return getPersistedUnsavedFormikData() ?? getSiteInitialValues(siteBeingEdited)
  }, [getPersistedUnsavedFormikData, siteBeingEdited])

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
          clearPersistedUnsavedFormikData()
          setSaveButtonState(buttonGroupStates.saved)
          setIsFormDirty(false)
          formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state

          if (isNewSite) {
            history.push(`${ensureTrailingSlash(currentProjectPath)}sites/${response.id}`)
          }
        })
        .catch((error) => {
          const errorTitle = language.getErrorTitle('site')
          const errorLang = language.getErrorMessages(error)

          setSaveButtonState(buttonGroupStates.unsaved)
          toast.error(
            ...getToastArguments(
              <div data-testid="site-toast-error">
                {errorTitle}
                <br />
                {errorLang}
              </div>,
            ),
          )
        })
    },
    validate: (values) => {
      persistUnsavedFormikData(values)
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.country) {
        errors.country = [{ code: language.error.formValidation.required, id: 'Required' }]
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

      if (!values.exposure) {
        errors.exposure = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.reef_type) {
        errors.reef_type = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.reef_zone) {
        errors.reef_zone = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  })

  useDocumentTitle(
    `${language.pages.siteForm.title} - ${formik.values.name} - ${language.title.mermaid}`,
  )

  const { setFieldValue: formikSetFieldValue } = formik

  const _setSiteButtonUnsaved = useEffect(() => {
    if (isFormDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [isFormDirty])

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

  const _setIsFormDirty = useEffect(
    () => setIsFormDirty(!!formik.dirty || !!getPersistedUnsavedFormikData()),
    [formik.dirty, getPersistedUnsavedFormikData],
  )

  const displayIdNotFoundErrorPage = idsNotAssociatedWithData.length && !isNewSite

  const contentViewByReadOnlyRole = isNewSite ? (
    <PageUnavailable mainText={language.error.pageReadOnly} />
  ) : (
    <ReadOnlySiteContent
      site={formik.values}
      countryOptions={countryOptions}
      exposureOptions={exposureOptions}
      reefTypeOptions={reefTypeOptions}
      reefZoneOptions={reefZoneOptions}
      isReadOnlyUser={isReadOnlyUser}
      isAppOnline={isAppOnline}
    />
  )

  const contentViewByRole = isReadOnlyUser ? (
    contentViewByReadOnlyRole
  ) : (
    <>
      <SiteForm
        formik={formik}
        isAppOnline={isAppOnline}
        countryOptions={countryOptions}
        exposureOptions={exposureOptions}
        reefTypeOptions={reefTypeOptions}
        reefZoneOptions={reefZoneOptions}
        handleLatitudeChange={handleLatitudeChange}
        handleLongitudeChange={handleLongitudeChange}
      />
      {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={isFormDirty} />
    </>
  )

  return displayIdNotFoundErrorPage ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      isToolbarSticky={true}
      subNavNode={{ name: formik.values.name }}
      content={contentViewByRole}
      toolbar={
        <ContentPageToolbarWrapper>
          {isNewSite ? <H2>{language.pages.siteForm.title}</H2> : <H2>{formik.values.name}</H2>}
          {!isReadOnlyUser && (
            <SaveButton
              formId="site-form"
              saveButtonState={saveButtonState}
              formHasErrors={!!Object.keys(formik.errors).length}
              formDirty={isFormDirty}
            />
          )}
        </ContentPageToolbarWrapper>
      }
    />
  )
}

ReadOnlySiteContent.propTypes = {
  site: sitePropType.isRequired,
  countryOptions: inputOptionsPropTypes.isRequired,
  exposureOptions: inputOptionsPropTypes.isRequired,
  reefTypeOptions: inputOptionsPropTypes.isRequired,
  reefZoneOptions: inputOptionsPropTypes.isRequired,
  isReadOnlyUser: PropTypes.bool.isRequired,
  isAppOnline: PropTypes.bool.isRequired,
}

SiteForm.propTypes = {
  formik: formikPropType.isRequired,
  isAppOnline: PropTypes.bool.isRequired,
  countryOptions: inputOptionsPropTypes.isRequired,
  exposureOptions: inputOptionsPropTypes.isRequired,
  reefTypeOptions: inputOptionsPropTypes.isRequired,
  reefZoneOptions: inputOptionsPropTypes.isRequired,
  handleLatitudeChange: PropTypes.func.isRequired,
  handleLongitudeChange: PropTypes.func.isRequired,
}

Site.propTypes = { isNewSite: PropTypes.bool.isRequired }

export default Site
