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
import { getManagementRegimeInitialValues } from './managementRegimeFormInitialValues'
import { getOptions } from '../../../library/getOptions'
import { getProjectRole } from '../../../App/currentUserProfileHelpers'
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
import TableRowItem from '../../generic/Table/TableRowItem/TableRowItem'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import { userRole } from '../../../App/mermaidData/userRole'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'

const ReadOnlyManagementRegimeContent = ({
  managementRegime,
  managementCompliances,
  managementParties,
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
  } = managementRegime

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
        <TableRowItem title="Secondary Name" value={[name_secondary]} />
        <TableRowItem title="Year Established" value={[est_year]} />
        <TableRowItem title="Area" value={[size]} />
        <TableRowItem title="Parities" options={managementParties} value={parties} />
        <TableRowItem title="Compliance" options={managementCompliances} value={[compliance]} />
        <TableRowItem title="Rules" value={[managementRules]} />
        <TableRowItem title="Notes" value={[notes]} />
      </tbody>
    </Table>
  )
}

const ManagementRegime = ({ isNewManagementRegime }) => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [managementCompliances, setManagementCompliances] = useState([])
  const [managementParties, setManagementParties] = useState([])
  const [managementRegimeBeingEdited, setManagementRegimeBeingEdited] = useState()
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { managementRegimeId, projectId } = useParams()
  const history = useHistory()
  const isMounted = useIsMounted()
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()

  const isReadOnlyUser = getProjectRole(currentUser, projectId) === userRole.read_only

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

            setManagementParties(getOptions(choicesResponse.managementparties))
            setManagementCompliances([
              ...getOptions(choicesResponse.managementcompliances),
              { label: 'not reported', value: '' },
            ])
            setManagementRegimeBeingEdited(managementRegimeResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.managementRegimeRecordUnavailable))
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isNewManagementRegime,
    isSyncInProgress,
    managementRegimeId,
    projectId,
  ])

  const initialFormValues = useMemo(
    () => getManagementRegimeInitialValues(managementRegimeBeingEdited),
    [managementRegimeBeingEdited],
  )

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
          setSaveButtonState(buttonGroupStates.saved)
          formikActions.resetForm({ values: formikValues })

          if (isNewManagementRegime) {
            history.push(
              `${ensureTrailingSlash(currentProjectPath)}management-regimes/${response.id}`,
            )
          }
        })
        .catch(() => {
          setSaveButtonState(buttonGroupStates.unsaved)
          toast.error(language.error.managementRegimeSave)
        })
    },
    validate: (values) => {
      const errors = {}
      const isPartialSelectionSelected =
        values.access_restriction ||
        values.periodic_closure ||
        values.size_limits ||
        values.gear_restriction ||
        values.species_restriction
      const isOneOfRulesSelected =
        values.open_access || values.no_take || isPartialSelectionSelected

      if (!values.name) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }
      if (!isOneOfRulesSelected) {
        errors.rules = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  })

  useDocumentTitle(
    `${language.pages.managementRegimeForm.title} - ${formik.values.name} - ${language.title.mermaid}`,
  )

  const _setSiteButtonUnsaved = useEffect(() => {
    if (formik.dirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [formik.dirty])

  const displayIdNotFound = idsNotAssociatedWithData.length && !isNewManagementRegime

  const contentViewByRole = isReadOnlyUser ? (
    <ReadOnlyManagementRegimeContent
      managementRegime={formik.values}
      managementCompliances={managementCompliances}
      managementParties={managementParties}
    />
  ) : (
    <>
      <form id="management-regime-form" onSubmit={formik.handleSubmit}>
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
            label="Parties"
            id="parties"
            options={managementParties}
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
            options={managementCompliances}
            {...formik.getFieldProps('compliance')}
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
  )

  return displayIdNotFound ? (
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
          <SaveButton
            formId="management-regime-form"
            saveButtonState={saveButtonState}
            formik={formik}
          />
        </ContentPageToolbarWrapper>
      }
    />
  )
}

ReadOnlyManagementRegimeContent.propTypes = {
  managementRegime: managementRegimePropType.isRequired,
  managementCompliances: inputOptionsPropTypes.isRequired,
  managementParties: inputOptionsPropTypes.isRequired,
}

ManagementRegime.propTypes = { isNewManagementRegime: PropTypes.bool.isRequired }

export default ManagementRegime
