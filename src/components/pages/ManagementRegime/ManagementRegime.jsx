import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo } from 'react'
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
import { getManagementRegimeInitialValues } from './managementRegimeFormInitialValues'
import { getOptions } from '../../../library/getOptions'
import { getToastArguments } from '../../../library/getToastArguments'
import { getDeleteModalText } from '../../../library/getDeleteModalText'
import { H2, ItalicizedInfo } from '../../generic/text'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import { InputWrapper } from '../../generic/form'
import { managementRegimePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { showSyncToastError } from '../../../library/showSyncToastError'
import { sortManagementComplianceChoices } from '../../../library/arrays/sortManagementComplianceChoices'
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
import InputCheckboxGroupWithLabelAndValidation from '../../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import LoadingModal from '../../LoadingModal/LoadingModal'
import ManagementRulesInput from '../ManagementRulesInput'
import PageUnavailable from '../PageUnavailable'
import SaveButton from '../../generic/SaveButton'
import TableRowItem from '../../generic/Table/TableRowItem'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import { HelperTextLink } from '../../generic/links'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import InputSelectWithLabelAndValidation from '../../mermaidInputs/InputSelectWithLabelAndValidation'
import { DeleteRecordButtonCautionWrapper } from '../collectRecordFormPages/CollectingFormPage.Styles'

const ReadOnlyManagementRegimeContent = ({
  managementRegimeFormikValues,
  managementComplianceOptions,
  managementPartyOptions,
}) => {
  const { t } = useTranslation()
  const {
    name_secondary,
    est_year,
    size,
    parties,
    no_take,
    open_access,
    access_restriction,
    gear_restriction,
    periodic_closure,
    size_limits,
    species_restriction,
    compliance,
    notes,
  } = managementRegimeFormikValues

  const partialRestrictionRules = [
    access_restriction && t('management_regimes.access_restriction'),
    periodic_closure && t('management_regimes.periodic_closure'),
    size_limits && t('management_regimes.size_limits'),
    gear_restriction && t('management_regimes.gear_restriction'),
    species_restriction && t('management_regimes.species_restriction'),
  ].filter(Boolean)

  let managementRules = ''

  if (no_take) {
    managementRules = t('management_regimes.no_take')
  } else if (open_access) {
    managementRules = t('management_regimes.open_access')
  } else if (partialRestrictionRules.length) {
    managementRules = `${t(
      'management_regimes.partial_restrictions',
    )}: ${partialRestrictionRules.join(', ')}`
  }

  return (
    <Table>
      <tbody>
        <TableRowItem title={t('management_regimes.secondary_name')} value={name_secondary} />
        <TableRowItem title={t('management_regimes.year_est')} value={est_year} />
        <TableRowItem title={t('management_regimes.area')} value={size} />
        <TableRowItem
          title={t('management_regimes.parties')}
          options={managementPartyOptions}
          value={parties}
        />
        <TableRowItem
          title={t('management_regimes.compliance')}
          options={managementComplianceOptions}
          value={compliance}
        />
        <TableRowItem title={t('management_regimes.rules')} value={managementRules} />
        <TableRowItem title={t('notes')} value={notes} isAllowNewlines={true} />
      </tbody>
    </Table>
  )
}

const ManagementRegimeForm = ({ formik, managementComplianceOptions, managementPartyOptions }) => {
  const { t } = useTranslation()

  return (
    <form id="management-regime-form" onSubmit={formik.handleSubmit}>
      <InputWrapper>
        <InputWithLabelAndValidation
          required
          label={t('name')}
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          validationType={formik.errors.name && formik.touched.name ? 'error' : null}
          validationMessages={formik.errors.name}
          testId="name"
          helperText={
            <Trans
              i18nKey="management_regimes.name_info"
              components={{
                helperTextLink: (
                  <HelperTextLink
                    href="http://protectedseas.net/"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
              }}
            />
          }
        />
        <InputWithLabelAndValidation
          label={t('management_regimes.secondary_name')}
          id="name_secondary"
          type="text"
          testId="secondary-name"
          {...formik.getFieldProps('name_secondary')}
          helperText={t('management_regimes.secondary_name_info')}
        />
        <InputWithLabelAndValidation
          label={t('management_regimes.year_est')}
          id="est_year"
          type="number"
          testId="year-established"
          {...formik.getFieldProps('est_year')}
        />
        <InputWithLabelAndValidation
          label={t('management_regimes.area')}
          id="size"
          type="number"
          unit="ha"
          testId="area"
          {...formik.getFieldProps('size')}
        />
        <InputCheckboxGroupWithLabelAndValidation
          required={false}
          label={t('management_regimes.parties')}
          id="parties"
          testId="parties"
          options={managementPartyOptions}
          value={formik.getFieldProps('parties').value}
          onChange={({ selectedItems }) => {
            formik.setFieldValue('parties', selectedItems)
          }}
          helperText={t('management_regimes.who_responsible')}
        />
        <ManagementRulesInput
          managementFormValues={formik.values}
          onChange={(property, partialRestrictionRuleValues) => {
            const openAccessAndNoTakeRules =
              property === 'partial_restrictions'
                ? { open_access: false, no_take: false }
                : { open_access: property === 'open_access', no_take: property === 'no_take' }

            const partialRestrictionRules = {
              periodic_closure: partialRestrictionRuleValues.periodic_closure,
              size_limits: partialRestrictionRuleValues.size_limits,
              gear_restriction: partialRestrictionRuleValues.gear_restriction,
              species_restriction: partialRestrictionRuleValues.species_restriction,
              access_restriction: partialRestrictionRuleValues.access_restriction,
            }

            formik.setValues({
              ...formik.values,
              ...openAccessAndNoTakeRules,
              ...partialRestrictionRules,
            })
          }}
          validationType={formik.errors.rules ? 'error' : null}
          validationMessages={formik.errors.rules}
          testId="rules"
          required={true}
        />
        <InputSelectWithLabelAndValidation
          label={t('management_regimes.compliance')}
          id="compliance"
          required={false}
          testId="compliance"
          options={managementComplianceOptions}
          {...formik.getFieldProps('compliance')}
          helperText={t('management_regimes.rules_effectiveness')}
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

const ManagementRegime = ({ isNewManagementRegime }) => {
  const { t } = useTranslation()
  const { isAppOnline } = useOnlineStatus()
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { managementRegimeId, projectId } = useParams()
  const navigate = useNavigate()
  const isMounted = useIsMounted()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const managementRegimeTitleText = t('management_regimes.management_regime')
  const managementRegimeTitleLowerCaseText = managementRegimeTitleText.toLowerCase()
  const managementRegimeRecordUnavailableText = t('management_regimes.data_unavailable')
  const notReportedCompliance = t('management_regimes.not_reported_compliance')
  const deleteModalText = getDeleteModalText(managementRegimeTitleText)

  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [managementComplianceOptions, setManagementComplianceOptions] = useState([])
  const [managementPartyOptions, setManagementPartyOptions] = useState([])
  const [managementRegimeBeingEdited, setManagementRegimeBeingEdited] = useState()
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [deleteErrorData, setDeleteErrorData] = useState([])
  const [isDeletingRecord, setIsDeletingRecord] = useState(false)
  const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false)
  const [currentDeleteRecordModalPage, setCurrentDeleteRecordModalPage] = useState(1)
  const shouldPromptTrigger = isFormDirty && saveButtonState !== buttonGroupStates.saving // we need to prevent the user from seeing the dirty form prompt when a new MR is saved (and that triggers a navigation to its new page)

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

      if (!isNewManagementRegime) {
        promises.push(databaseSwitchboardInstance.getManagementRegime(managementRegimeId))
      }

      Promise.all(promises)
        .then(([choicesResponse, projectResponse, managementRegimeResponse]) => {
          if (isMounted.current) {
            if (!managementRegimeResponse && managementRegimeId && !isNewManagementRegime) {
              setIdsNotAssociatedWithData((previousState) => [...previousState, managementRegimeId])
            }
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
            }

            const sortedManagementComplianceOptions = sortManagementComplianceChoices([
              ...getOptions(choicesResponse.managementcompliances.data),
              { label: notReportedCompliance, value: '' },
            ])

            setManagementPartyOptions(getOptions(choicesResponse.managementparties.data))
            setManagementComplianceOptions(sortedManagementComplianceOptions)
            setManagementRegimeBeingEdited(managementRegimeResponse)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(managementRegimeRecordUnavailableText))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isNewManagementRegime,
    isSyncInProgress,
    managementRegimeId,
    projectId,
    handleHttpResponseError,
    managementRegimeRecordUnavailableText,
    notReportedCompliance,
  ])

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedManagementRegimeInputs`)

  const initialFormValues = useMemo(() => {
    return (
      getPersistedUnsavedFormikData() ??
      getManagementRegimeInitialValues(managementRegimeBeingEdited)
    )
  }, [getPersistedUnsavedFormikData, managementRegimeBeingEdited])

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: (formikValues, formikActions) => {
      const {
        name,
        name_secondary,
        est_year,
        size,
        parties,
        open_access,
        no_take,
        periodic_closure,
        size_limits,
        gear_restriction,
        species_restriction,
        access_restriction,
        compliance,
        notes,
      } = formikValues

      const formattedManagementRegimeForApi = {
        ...managementRegimeBeingEdited,
        name,
        name_secondary,
        est_year: est_year === '' ? null : est_year,
        size: size === '' ? null : size,
        parties,
        open_access,
        no_take,
        periodic_closure,
        size_limits,
        gear_restriction,
        species_restriction,
        access_restriction,
        compliance,
        notes,
      }

      setSaveButtonState(buttonGroupStates.saving)
      databaseSwitchboardInstance
        .saveManagementRegime({ managementRegime: formattedManagementRegimeForApi, projectId })
        .then((response) => {
          const [toastMessage, toastOptions] = getToastArguments(
            isAppOnline
              ? t('toasts.mermaid_data_save_success_online', {
                  dataType: managementRegimeTitleLowerCaseText,
                })
              : t('toasts.mermaid_data_save_success_offline', {
                  dataType: managementRegimeTitleLowerCaseText,
                }),
          )
          const toastContent = isAppOnline ? (
            <div data-testid="management-regime-toast-success">{toastMessage}</div>
          ) : (
            <div data-testid="management-regime-toast-offline-success">{toastMessage}</div>
          )

          toast.success(toastContent, toastOptions)
          clearPersistedUnsavedFormikData()
          setSaveButtonState(buttonGroupStates.saved)
          setIsFormDirty(false)
          formikActions.resetForm({ values: formikValues })

          if (isNewManagementRegime) {
            navigate(`${ensureTrailingSlash(currentProjectPath)}management-regimes/${response.id}`)
          }
        })
        .catch((error) => {
          setSaveButtonState(buttonGroupStates.unsaved)
          const { isSyncError } = error

          if (isSyncError && isAppOnline) {
            showSyncToastError({
              toastTitle: t('toasts.mermaid_data_save_online_sync_error', {
                dataType: managementRegimeTitleLowerCaseText,
              }),
              error,
              testId: 'management-regime-toast-error',
            })
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
                <div data-testid="management-regime-toast-error">
                  {t('toasts.mermaid_data_save_offline_error', {
                    dataType: managementRegimeTitleLowerCaseText,
                  })}
                </div>,
              ),
            )
          }
        })
    },
    validate: (values) => {
      persistUnsavedFormikData(values)
      const errors = {}
      const isPartialSelectionSelected =
        values.access_restriction ||
        values.periodic_closure ||
        values.size_limits ||
        values.gear_restriction ||
        values.species_restriction

      const noPartialRestrictionRulesSelected =
        !values.open_access && !values.no_take && isPartialSelectionSelected === false

      if (!values.name) {
        errors.name = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (noPartialRestrictionRulesSelected) {
        errors.rules = [
          {
            code: t('management_regimes.partial_restriction_required'),
            id: 'Partial Restriction Required',
          },
        ]
      }

      return errors
    },
  })

  useDocumentTitle(`${managementRegimeTitleText} - ${formik.values.name} - ${t('mermaid')}`)

  const _setSaveButtonUnsaved = useEffect(() => {
    if (isFormDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [isFormDirty])

  const _setIsFormDirty = useEffect(
    () => setIsFormDirty(!!formik.dirty || !!getPersistedUnsavedFormikData()),
    [formik.dirty, getPersistedUnsavedFormikData],
  )

  const deleteRecord = () => {
    // only available online
    setIsDeletingRecord(true)

    databaseSwitchboardInstance
      .deleteManagementRegime(managementRegimeBeingEdited, projectId)
      .then(() => {
        clearPersistedUnsavedFormikData()
        closeDeleteRecordModal()
        setIsDeletingRecord(false)
        toast.success(
          ...getToastArguments(
            t('toasts.mermaid_data_delete_success', {
              dataType: managementRegimeTitleLowerCaseText,
            }),
          ),
        )
        navigate(`${ensureTrailingSlash(currentProjectPath)}management-regimes/`)
      })
      .catch((error) => {
        const { isSyncError, isDeleteRejectedError } = error

        if (isSyncError && !isDeleteRejectedError) {
          showSyncToastError({
            toastTitle: t('toasts.mermaid_data_delete_sync_error', {
              dataType: managementRegimeTitleLowerCaseText,
            }),
            error,
            testId: 'management-regime-toast-error',
          })
          setIsDeletingRecord(false)
          closeDeleteRecordModal()
        }

        if (isSyncError && isDeleteRejectedError) {
          // show modal which lists the associated sumbitted sample units that are associated with the MR
          setDeleteErrorData(error.associatedSampleUnits)
          setIsDeletingRecord(false)
          goToPageTwoOfDeleteRecordModal()
        }
        if (!isSyncError) {
          handleHttpResponseError({
            error,
          })
        }
      })
  }

  const displayIdNotFoundErrorPage = idsNotAssociatedWithData.length && !isNewManagementRegime

  const contentViewByReadOnlyRole = isNewManagementRegime ? (
    <PageUnavailable mainText={t('page.read_only')} />
  ) : (
    <ReadOnlyManagementRegimeContent
      managementRegimeFormikValues={formik.values}
      managementComplianceOptions={managementComplianceOptions}
      managementPartyOptions={managementPartyOptions}
    />
  )

  const contentViewByRole = isReadOnlyUser ? (
    contentViewByReadOnlyRole
  ) : (
    <>
      <ManagementRegimeForm
        formik={formik}
        managementComplianceOptions={managementComplianceOptions}
        managementPartyOptions={managementPartyOptions}
      />
      {isAdminUser && isAppOnline ? (
        <DeleteRecordButton
          currentPage={currentDeleteRecordModalPage}
          errorData={deleteErrorData}
          isLoading={isDeletingRecord}
          isNewRecord={isNewManagementRegime}
          isOpen={isDeleteRecordModalOpen}
          modalText={deleteModalText}
          deleteRecord={deleteRecord}
          onDismiss={closeDeleteRecordModal}
          openModal={openDeleteRecordModal}
        />
      ) : null}
      {!isAdminUser && isAppOnline ? (
        <DeleteRecordButtonCautionWrapper>
          <ItalicizedInfo>{t('management_regimes.only_admin_delete')}</ItalicizedInfo>
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
          {isNewManagementRegime ? (
            <H2 data-testid="new-management-regime-form-title">{managementRegimeTitleText}</H2>
          ) : (
            <H2 data-testid="edit-management-regime-form-title">{formik.values.name}</H2>
          )}
          {!isReadOnlyUser && (
            <SaveButton
              formId="management-regime-form"
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

ReadOnlyManagementRegimeContent.propTypes = {
  managementRegimeFormikValues: managementRegimePropType.isRequired,
  managementComplianceOptions: inputOptionsPropTypes.isRequired,
  managementPartyOptions: inputOptionsPropTypes.isRequired,
}

ManagementRegimeForm.propTypes = {
  formik: formikPropType.isRequired,
  managementComplianceOptions: inputOptionsPropTypes.isRequired,
  managementPartyOptions: inputOptionsPropTypes.isRequired,
}

ManagementRegime.propTypes = { isNewManagementRegime: PropTypes.bool.isRequired }

export default ManagementRegime
