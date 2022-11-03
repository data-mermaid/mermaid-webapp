import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams, useHistory } from 'react-router-dom'

import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'
import { formikPropType } from '../../../library/formikPropType'
import { getManagementRegimeInitialValues } from './managementRegimeFormInitialValues'
import { getOptions } from '../../../library/getOptions'
import { getIsReadOnlyUserRole, getIsAdminUserRole } from '../../../App/currentUserProfileHelpers'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2 } from '../../generic/text'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputCheckboxGroupWithLabelAndValidation from '../../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import InputRadioWithLabelAndValidation from '../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import { InputWrapper } from '../../generic/form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import LoadingModal from '../../LoadingModal/LoadingModal'
import language from '../../../language'
import ManagementRulesInput from '../ManagementRulesInput'
import { managementRegimePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import SaveButton from '../../generic/SaveButton'
import { Table } from '../../generic/Table/table'
import TableRowItem from '../../generic/Table/TableRowItem'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../library/useUnsavedDirtyFormDataUtilities'
import PageUnavailable from '../PageUnavailable'
import { sortManagementComplianceChoices } from '../../../library/arrays/sortManagementComplianceChoices'
import DeleteRecordButton from '../../DeleteRecordButton'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'

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
        <TableRowItem title="Notes" value={notes} />
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
        />
        <InputWithLabelAndValidation
          label="Secondary Name"
          id="name_secondary"
          type="text"
          {...formik.getFieldProps('name_secondary')}
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
        />
        <InputRadioWithLabelAndValidation
          label="Compliance"
          id="compliance"
          options={managementComplianceOptions}
          {...formik.getFieldProps('compliance')}
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
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { managementRegimeId, projectId } = useParams()
  const history = useHistory()
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

  const isReadOnlyUser = getIsReadOnlyUserRole(currentUser, projectId)
  const isAdminUser = getIsAdminUserRole(currentUser, projectId)

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
              ...getOptions(choicesResponse.managementcompliances),
              { label: 'not reported', value: '' },
            ])

            setManagementPartyOptions(getOptions(choicesResponse.managementparties))
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
          toast.success(language.success.managementRegimeSave)
          clearPersistedUnsavedFormikData()
          setSaveButtonState(buttonGroupStates.saved)
          setIsFormDirty(false)
          formikActions.resetForm({ values: formikValues })

          if (isNewManagementRegime) {
            history.push(
              `${ensureTrailingSlash(currentProjectPath)}management-regimes/${response.id}`,
            )
          }
        })
        .catch((error) => {
          const errorTitle = language.getErrorTitle('management regime')
          const errorLang = language.getErrorMessages(error)

          setSaveButtonState(buttonGroupStates.unsaved)
          toast.error(
            ...getToastArguments(
              <div data-testid="management-regime-toast-error">
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
    setIsDeletingRecord(true)

    databaseSwitchboardInstance
      .deleteManagementRegime(managementRegimeBeingEdited, projectId)
      .then(() => {
        clearPersistedUnsavedFormikData()
        closeDeleteRecordModal()
        setIsDeletingRecord(false)
        toast.success(...getToastArguments(language.success.collectRecordDelete))
        history.push(`${ensureTrailingSlash(currentProjectPath)}management-regimes/`)
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            setDeleteErrorData(error)
            setIsDeletingRecord(false)
            goToPageTwoOfDeleteRecordModal()
          },
        })
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
      {isAdminUser && (
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
      )}
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
