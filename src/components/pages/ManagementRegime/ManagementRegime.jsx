import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo } from 'react'

import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'
import { formikPropType } from '../../../library/formikPropType'
import {
  getIsUserReadOnlyForProject,
  getIsUserAdminForProject,
} from '../../../App/currentUserProfileHelpers'
import { getManagementRegimeInitialValues } from './managementRegimeFormInitialValues'
import { getOptions } from '../../../library/getOptions'
import { getToastArguments } from '../../../library/getToastArguments'
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
import language from '../../../language'
import LoadingModal from '../../LoadingModal/LoadingModal'
import ManagementRulesInput from '../ManagementRulesInput'
import PageUnavailable from '../PageUnavailable'
import SaveButton from '../../generic/SaveButton'
import TableRowItem from '../../generic/Table/TableRowItem'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
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

  const rules = [
    no_take && 'No Take',
    open_access && 'Open Access',
    access_restriction && 'Access Restriction',
    periodic_closure && 'Periodic Closure',
    size_limits && 'Size Limits',
    gear_restriction && 'Gear Restrictions',
    species_restriction && 'Species Restrictions',
  ]
  const filteredRules = rules.filter((rule) => !!rule)
  const managementRules =
    no_take || open_access ? filteredRules[0] : `Partial Restrictions: ${filteredRules.join(', ')}`

  return (
    <Table>
      <tbody>
        <TableRowItem title="Secondary Name" value={name_secondary} />
        <TableRowItem title="Year Established" value={est_year} />
        <TableRowItem title="Area" value={size} />
        <TableRowItem title="Parities" options={managementPartyOptions} value={parties} />
        <TableRowItem title="Compliance" options={managementComplianceOptions} value={compliance} />
        <TableRowItem title="Rules" value={managementRules} />
        <TableRowItem title="Notes" value={notes} isAllowNewlines={true} />
      </tbody>
    </Table>
  )
}

const ManagementRegimeForm = ({ formik, managementComplianceOptions, managementPartyOptions }) => {
  return (
    <form id="management-regime-form" onSubmit={formik.handleSubmit}>
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
          helperText={language.helperText.getManagementRegimeName()}
        />
        <InputWithLabelAndValidation
          label="Secondary Name"
          id="name_secondary"
          type="text"
          {...formik.getFieldProps('name_secondary')}
          helperText={language.helperText.secondaryName}
        />
        <InputWithLabelAndValidation
          label="Year Established"
          id="est_year"
          type="number"
          {...formik.getFieldProps('est_year')}
        />
        <InputWithLabelAndValidation
          label="Area"
          id="size"
          type="number"
          unit="ha"
          {...formik.getFieldProps('size')}
        />
        <InputCheckboxGroupWithLabelAndValidation
          required={false}
          label="Parties"
          id="parties"
          options={managementPartyOptions}
          value={formik.getFieldProps('parties').value}
          onChange={({ selectedItems }) => {
            formik.setFieldValue('parties', selectedItems)
          }}
          helperText={language.helperText.parties}
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
          data-testid="rules"
          required={true}
        />
        <InputSelectWithLabelAndValidation
          label="Compliance"
          id="compliance"
          required={false}
          options={managementComplianceOptions}
          {...formik.getFieldProps('compliance')}
          helperText={language.helperText.compliance}
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

const ManagementRegime = ({ isNewManagementRegime }) => {
  const { isAppOnline } = useOnlineStatus()
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { managementRegimeId, projectId } = useParams()
  const navigate = useNavigate()
  const isMounted = useIsMounted()
  const handleHttpResponseError = useHttpResponseErrorHandler()

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
              { label: 'not reported', value: '' },
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
              toast.error(...getToastArguments(language.error.managementRegimeRecordUnavailable))
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
          toast.success(
            language.success.getMermaidDataSaveSuccess({
              mermaidDataTypeLabel: 'management regime',
              isAppOnline,
            }),
          )
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
            const toastTitle = language.error.getSaveOnlineSyncErrorTitle('management regime')

            showSyncToastError({ toastTitle, error, testId: 'management-regime-toast-error' })
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
                  {language.error.getSaveOfflineErrorTitle('management regime')}
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
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (noPartialRestrictionRulesSelected) {
        errors.rules = [
          {
            code: language.error.formValidation.managementPartialRestrictionRequired,
            id: 'Partial Restriction Required',
          },
        ]
      }

      return errors
    },
  })

  useDocumentTitle(
    `${language.pages.managementRegimeForm.title} - ${formik.values.name} - ${language.title.mermaid}`,
  )

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
          ...getToastArguments(language.success.getMermaidDataDeleteSuccess('management regime')),
        )
        navigate(`${ensureTrailingSlash(currentProjectPath)}management-regimes/`)
      })
      .catch((error) => {
        const { isSyncError, isDeleteRejectedError } = error

        if (isSyncError && !isDeleteRejectedError) {
          const toastTitle = language.error.getDeleteOnlineSyncErrorTitle('management regime')

          showSyncToastError({ toastTitle, error, testId: 'management-regime-toast-error' })
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
    <PageUnavailable mainText={language.error.pageReadOnly} />
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
          modalText={language.deleteRecord('Management Regime')}
          deleteRecord={deleteRecord}
          onDismiss={closeDeleteRecordModal}
          openModal={openDeleteRecordModal}
        />
      ) : null}
      {!isAdminUser && isAppOnline ? (
        <DeleteRecordButtonCautionWrapper>
          <ItalicizedInfo>{language.pages.managementRegimeForm.nonAdminDelete}</ItalicizedInfo>
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
            <H2>{language.pages.managementRegimeForm.title}</H2>
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
