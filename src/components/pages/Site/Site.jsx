import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'
import { formikPropType } from '../../../library/formik/formikPropType'
import {
  getIsUserReadOnlyForProject,
  getIsUserAdminForProject,
} from '../../../App/currentUserProfileHelpers'
import { getOptions } from '../../../library/getOptions'
import { getSiteInitialValues } from './siteRecordFormInitialValues'
import { getToastArguments } from '../../../library/getToastArguments'
import { getDeleteModalText } from '../../../library/getDeleteModalText'
import { H2, ItalicizedInfo } from '../../generic/text'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import { InputRow, InputWrapper, RequiredIndicator } from '../../generic/form'
import { showSyncToastError } from '../../../library/showSyncToastError'
import { sitePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../generic/Table/table'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../library/useUnsavedDirtyFormDataUtilities'
import DeleteRecordButton from '../../DeleteRecordButton'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete/InputAutocomplete'
import InputValidationInfo from '../../mermaidInputs/InputValidationInfo/InputValidationInfo'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import LoadingModal from '../../LoadingModal/LoadingModal'
import PageUnavailable from '../PageUnavailable'
import SaveButton from '../../generic/SaveButton'
import SingleSiteMap from '../../mermaidMap/SingleSiteMap'
import TableRowItem from '../../generic/Table/TableRowItem'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import { HelperTextLink } from '../../generic/links'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import InputSelectWithLabelAndValidation from '../../mermaidInputs/InputSelectWithLabelAndValidation'
import { DeleteRecordButtonCautionWrapper } from '../collectRecordFormPages/CollectingFormPage.Styles'
import { IconSwap } from '../../icons'
import { InputButton } from '../../generic/buttons'
import { enforceNumberInput } from '../../../library/enforceNumberInput'

const ReadOnlySiteContent = ({
  site,
  countryOptions,
  exposureOptions,
  reefTypeOptions,
  reefZoneOptions,
  isReadOnlyUser,
  isAppOnline,
}) => {
  const { t } = useTranslation()
  const { country, latitude, longitude, exposure, reef_type, reef_zone, notes } = site

  return (
    <>
      <Table>
        <tbody>
          <TableRowItem title={t('sites.country')} options={countryOptions} value={country} />
          <TableRowItem title={t('sites.latitude')} value={latitude} />
          <TableRowItem title={t('sites.longitude')} value={longitude} />
          <TableRowItem title={t('sites.exposure')} options={exposureOptions} value={exposure} />
          <TableRowItem title={t('sites.reef_type')} options={reefTypeOptions} value={reef_type} />
          <TableRowItem title={t('sites.reef_zone')} options={reefZoneOptions} value={reef_zone} />
          <TableRowItem title={t('notes')} value={notes} isAllowNewlines={true} />
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

const SwapButton = ({ isDisabled, handleSwapClick, swapLabel }) => {
  return (
    <InputButton type="button" disabled={isDisabled} onClick={handleSwapClick}>
      <IconSwap />
      <span>{swapLabel}</span>
    </InputButton>
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
  const { t } = useTranslation()
  const swapButtonText = t('buttons.swap')

  const handleLngLatSwap = () => {
    const currentLatitude = formik.getFieldProps('latitude').value
    const currentLongitude = formik.getFieldProps('longitude').value

    handleLatitudeChange(currentLongitude)
    handleLongitudeChange(currentLatitude)

    formik.setFieldTouched('longitude', true)
    formik.setFieldTouched('latitude', true)
  }

  // hack to ensure formik values are updated before manually triggering validation
  useEffect(() => {
    formik.validateForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.latitude, formik.values.longitude])

  return (
    <form id="site-form" onSubmit={formik.handleSubmit}>
      <InputWrapper>
        <InputWithLabelAndValidation
          required
          label={t('sites.site_name')}
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          validationType={formik.errors.name && formik.touched.name ? 'error' : null}
          validationMessages={formik.errors.name}
          testId="name"
          helperText={t('sites.site_name_info')}
        />
        <InputRow
          validationType={formik.errors.country && formik.touched.country ? 'error' : null}
          data-testid="country-select"
        >
          <label id="country-label">
            {t('projects.country')} <RequiredIndicator />{' '}
          </label>
          <InputAutocomplete
            id="country"
            aria-labelledby="country-label"
            data-testid="country-input"
            options={countryOptions}
            value={formik.values.country}
            noResultsText={t('search.no_results')}
            onChange={(selectedItem) => {
              formik.setFieldValue('country', selectedItem.value)
            }}
            isLastRow={false}
          />
          <InputValidationInfo
            validationType={formik.errors.country && formik.touched.country ? 'error' : null}
            validationMessages={formik.errors.country}
            testId="country-validation"
          />
        </InputRow>
        <InputWithLabelAndValidation
          required
          label={t('sites.latitude')}
          id="latitude"
          type="number"
          {...formik.getFieldProps('latitude')}
          onKeyDown={(event) => enforceNumberInput(event)}
          validationType={formik.errors.latitude && formik.touched.latitude ? 'error' : null}
          validationMessages={formik.errors.latitude}
          testId="latitude"
          helperText={
            <Trans
              i18nKey="sites.latitude_info"
              components={{
                helperTextLink: (
                  <HelperTextLink
                    href="https://www.latlong.net/degrees-minutes-seconds-to-decimal-degrees"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
              }}
            />
          }
          shouldShowSteps={true}
          step="0.000001"
          renderItemWithinInput={
            <SwapButton
              isDisabled={!formik.values.latitude && !formik.values.longitude}
              handleSwapClick={handleLngLatSwap}
              swapLabel={swapButtonText}
            />
          }
        />
        <InputWithLabelAndValidation
          required
          label={t('sites.longitude')}
          id="longitude"
          type="number"
          {...formik.getFieldProps('longitude')}
          onKeyDown={(event) => enforceNumberInput(event)}
          validationType={formik.errors.longitude && formik.touched.longitude ? 'error' : null}
          validationMessages={formik.errors.longitude}
          testId="longitude"
          helperText={
            <Trans
              i18nKey="sites.longitude_info"
              components={{
                helperTextLink: (
                  <HelperTextLink
                    href="https://www.latlong.net/degrees-minutes-seconds-to-decimal-degrees"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
              }}
            />
          }
          shouldShowSteps={true}
          step="0.000001"
          renderItemWithinInput={
            <SwapButton
              isDisabled={!formik.values.latitude && !formik.values.longitude}
              handleSwapClick={handleLngLatSwap}
              swapLabel={swapButtonText}
            />
          }
        />
        {isAppOnline && (
          <SingleSiteMap
            formLatitudeValue={formik.getFieldProps('latitude').value}
            formLongitudeValue={formik.getFieldProps('longitude').value}
            handleLatitudeChange={handleLatitudeChange}
            handleLongitudeChange={handleLongitudeChange}
          />
        )}
        <InputSelectWithLabelAndValidation
          label={t('sites.exposure')}
          id="exposure"
          required={true}
          options={exposureOptions}
          testId="exposure"
          {...formik.getFieldProps('exposure')}
          validationType={formik.errors.exposure && formik.touched.exposure ? 'error' : null}
          validationMessages={formik.errors.exposure}
        />
        <InputSelectWithLabelAndValidation
          label={t('sites.reef_type')}
          id="reef_type"
          required={true}
          options={reefTypeOptions}
          testId="reef-type"
          {...formik.getFieldProps('reef_type')}
          validationType={formik.errors.reef_type && formik.touched.reef_type ? 'error' : null}
          validationMessages={formik.errors.reef_type}
          helperText={
            <Trans
              i18nKey="sites.reef_type_info"
              components={{
                helperTextLink: (
                  <HelperTextLink
                    href="https://www.livingoceansfoundation.org/wp-content/uploads/2015/04/U10-Reef-Types-complete-teacher.pdf"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
              }}
            />
          }
        />
        <InputSelectWithLabelAndValidation
          label={t('sites.reef_zone')}
          id="reef_zone"
          required={true}
          options={reefZoneOptions}
          testId="reef-zone"
          {...formik.getFieldProps('reef_zone')}
          validationType={formik.errors.reef_zone && formik.touched.reef_zone ? 'error' : null}
          validationMessages={formik.errors.reef_zone}
          helperText={
            <Trans
              i18nKey="sites.reef_zone_info"
              components={{
                helperTextLink: (
                  <HelperTextLink
                    href="https://www.livingoceansfoundation.org/wp-content/uploads/2015/04/U11-Reef-Zonation-Background.pdf"
                    target="_blank"
                    rel="noreferrer"
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
          {...formik.getFieldProps('notes')}
        />
      </InputWrapper>
    </form>
  )
}

const Site = ({ isNewSite }) => {
  const { t } = useTranslation()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { isSyncInProgress } = useSyncStatus()
  const { siteId, projectId } = useParams()
  const navigate = useNavigate()
  const isMounted = useIsMounted()
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const siteTitleText = t('sites.site')
  const mermaidDataTypeLabel = siteTitleText.toLowerCase()
  const siteRecordUnavailableText = t('sites.data_unavailable')
  const deleteModalText = getDeleteModalText(siteTitleText)
  const requiredFieldMessage = t('forms.required_field')

  const [countryOptions, setCountryOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [siteBeingEdited, setSiteBeingEdited] = useState()
  const [siteDeleteErrorData, setSiteDeleteErrorData] = useState([])
  const [isDeletingSite, setIsDeletingSite] = useState(false)
  const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false)
  const [currentDeleteRecordModalPage, setCurrentDeleteRecordModalPage] = useState(1)

  const shouldPromptTrigger = isFormDirty && saveButtonState !== buttonGroupStates.saving // we need to prevent the user from seeing the dirty form prompt when a new site is saved (and that triggers a navigation to its new page)

  const goToPageOneOfDeleteRecordModal = () => {
    setCurrentDeleteRecordModalPage(1)
  }
  const goToPageTwoOfDeleteRecordModal = () => {
    setCurrentDeleteRecordModalPage(2)
  }
  const openDeleteRecordModal = () => {
    setIsDeleteRecordModalOpen(true)
  }
  const closeDeleteRecordModal = () => {
    goToPageOneOfDeleteRecordModal()
    setIsDeleteRecordModalOpen(false)
  }

  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, projectId)
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)

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
            setCountryOptions(getOptions(choicesResponse.countries.data))
            setExposureOptions(getOptions(choicesResponse.reefexposures.data))
            setReefTypeOptions(getOptions(choicesResponse.reeftypes.data))
            setReefZoneOptions(getOptions(choicesResponse.reefzones.data))
            setSiteBeingEdited(siteResponse)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(siteRecordUnavailableText))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isSyncInProgress,
    projectId,
    siteId,
    isNewSite,
    handleHttpResponseError,
    siteRecordUnavailableText,
  ])

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
          const [toastMessage, toastOptions] = getToastArguments(
            isAppOnline
              ? t('toasts.mermaid_data_save_success_online', {
                  dataType: mermaidDataTypeLabel,
                })
              : t('toasts.mermaid_data_save_success_offline', {
                  dataType: mermaidDataTypeLabel,
                }),
          )
          const toastContent = isAppOnline ? (
            <div data-testid="site-toast-success">{toastMessage}</div>
          ) : (
            <div data-testid="site-toast-offline-success">{toastMessage}</div>
          )

          toast.success(toastContent, toastOptions)
          clearPersistedUnsavedFormikData()
          setSaveButtonState(buttonGroupStates.saved)
          setIsFormDirty(false)
          formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state

          if (isNewSite) {
            navigate(`${ensureTrailingSlash(currentProjectPath)}sites/${response.id}`)
          }
        })
        .catch((error) => {
          setSaveButtonState(buttonGroupStates.unsaved)

          const { isSyncError } = error

          if (isSyncError && isAppOnline) {
            const toastTitle = t('toasts.mermaid_data_save_online_sync_error', {
              dataType: mermaidDataTypeLabel,
            })

            showSyncToastError({ toastTitle, error, testId: 'site-toast-error' })
          }
          if (!isSyncError && isAppOnline) {
            handleHttpResponseError({
              error,
            })
          }
          if (!isAppOnline) {
            console.error(error)
            toast.error(
              ...getToastArguments(
                <div data-testid="site-toast-error">
                  {t('toasts.mermaid_data_save_offline_error', { dataType: mermaidDataTypeLabel })}
                </div>,
              ),
            )
          }
        })
    },
    validate: (values) => {
      persistUnsavedFormikData(values)
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: requiredFieldMessage, id: 'Required' }]
      }

      if (!values.country) {
        errors.country = [{ code: requiredFieldMessage, id: 'Required' }]
      }

      if (!values.latitude && values.latitude !== 0) {
        errors.latitude = [{ code: requiredFieldMessage, id: 'Required' }]
      }

      if (values.latitude > 90 || values.latitude < -90) {
        errors.latitude = [{ code: t('sites.errors.invalid_latitude'), id: 'Invalid Latitude' }]
      }

      if (!values.longitude && values.longitude !== 0) {
        errors.longitude = [{ code: requiredFieldMessage, id: 'Required' }]
      }

      if (values.longitude > 180 || values.longitude < -180) {
        errors.longitude = [{ code: t('sites.errors.invalid_longitude'), id: 'Invalid Longitude' }]
      }

      if (!values.exposure) {
        errors.exposure = [{ code: requiredFieldMessage, id: 'Required' }]
      }

      if (!values.reef_type) {
        errors.reef_type = [{ code: requiredFieldMessage, id: 'Required' }]
      }

      if (!values.reef_zone) {
        errors.reef_zone = [{ code: requiredFieldMessage, id: 'Required' }]
      }

      return errors
    },
  })

  useDocumentTitle(`${siteTitleText} - ${formik.values.name} - ${t('mermaid')}`)

  const { setFieldValue: formikSetFieldValue } = formik

  const _setSaveButtonUnsaved = useEffect(() => {
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

  const deleteRecord = () => {
    // only available online
    setIsDeletingSite(true)

    databaseSwitchboardInstance
      .deleteSite(siteBeingEdited, projectId)
      .then(() => {
        clearPersistedUnsavedFormikData()
        closeDeleteRecordModal()
        setIsDeletingSite(false)
        toast.success(
          ...getToastArguments(
            t('toasts.mermaid_data_delete_success', { dataType: mermaidDataTypeLabel }),
          ),
        )
        navigate(`${ensureTrailingSlash(currentProjectPath)}sites/`)
      })
      .catch((error) => {
        const { isSyncError, isDeleteRejectedError } = error

        if (isSyncError && !isDeleteRejectedError) {
          const toastTitle = t('toasts.mermaid_data_delete_sync_error', {
            dataType: mermaidDataTypeLabel,
          })

          showSyncToastError({ toastTitle, error, testId: 'site-toast-error' })
          setIsDeletingSite(false)
          closeDeleteRecordModal()
        }

        if (isSyncError && isDeleteRejectedError) {
          // show modal which lists the associated sumbitted sample units that are associated with the site
          setSiteDeleteErrorData(error.associatedSampleUnits)
          setIsDeletingSite(false)
          goToPageTwoOfDeleteRecordModal()
        }
        if (!isSyncError) {
          handleHttpResponseError({
            error,
          })
        }
      })
  }

  const displayIdNotFoundErrorPage = idsNotAssociatedWithData.length && !isNewSite

  const contentViewByReadOnlyRole = isNewSite ? (
    <PageUnavailable mainText={t('page.read_only')} />
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
      {isAdminUser && isAppOnline && (
        <DeleteRecordButton
          currentPage={currentDeleteRecordModalPage}
          errorData={siteDeleteErrorData}
          isLoading={isDeletingSite}
          isNewRecord={isNewSite}
          isOpen={isDeleteRecordModalOpen}
          modalText={deleteModalText}
          deleteRecord={deleteRecord}
          onDismiss={closeDeleteRecordModal}
          openModal={openDeleteRecordModal}
        />
      )}
      {!isAdminUser && isAppOnline ? (
        <DeleteRecordButtonCautionWrapper>
          <ItalicizedInfo>{t('sites.only_admin_delete')}</ItalicizedInfo>
        </DeleteRecordButtonCautionWrapper>
      ) : null}
      {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={shouldPromptTrigger} />
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
          {isNewSite ? (
            <H2 data-testid="new-site-form-title">{siteTitleText}</H2>
          ) : (
            <H2 data-testid="edit-site-form-title">{formik.values.name}</H2>
          )}
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

SwapButton.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  handleSwapClick: PropTypes.func.isRequired,
  swapLabel: PropTypes.string.isRequired,
}

Site.propTypes = { isNewSite: PropTypes.bool.isRequired }

export default Site
