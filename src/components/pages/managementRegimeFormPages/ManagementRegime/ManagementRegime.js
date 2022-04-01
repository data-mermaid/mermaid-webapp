import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Table, Tr, Td } from '../../../generic/Table/table'

import { ContentPageLayout } from '../../../Layout'
import { managementRegimePropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { inputOptionPropType } from '../../../../library/miscPropTypes'
import { getManagementRegimeInitialValues } from '../managementRegimeFormInitialValues'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { InputWrapper } from '../../../generic/form'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import InputCheckboxGroupWithLabelAndValidation from '../../../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import InputRadioWithLabelAndValidation from '../../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../language'
import { getToastArguments } from '../../../../library/getToastArguments'
import ManagementRulesInput from '../ManagementRulesInput'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'
import useDocumentTitle from '../../../../library/useDocumentTitle'
import useIsMounted from '../../../../library/useIsMounted'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import SaveButton from '../../../generic/SaveButton'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import { useCurrentUser } from '../../../../App/CurrentUserContext'

const TdKey = styled(Td)`
  white-space: nowrap;
  font-weight: 900;
  width: 0;
`

const TableRowItem = ({ title, options, value }) => {
  const getItemLabel = (itemOptions, itemValue) =>
    itemOptions.find((option) => option.value === itemValue)?.label

  const rowItemValue = options
    ? value.map((item) => getItemLabel(options, item)).join(', ')
    : value[0]

  return (
    <Tr>
      <TdKey>{title}</TdKey>
      <Td>{rowItemValue}</Td>
    </Tr>
  )
}

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

const ManagementRegime = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [managementCompliances, setManagementCompliances] = useState([])
  const [managementParties, setManagementParties] = useState([])
  const [managementRegimeBeingEdited, setManagementRegimeBeingEdited] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { managementRegimeId, projectId } = useParams()
  const currentUser = useCurrentUser()
  const isMounted = useIsMounted()
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [currentUserProfile, setCurrentUserProfile] = useState({})

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getManagementRegime(managementRegimeId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
      ]

      Promise.all(promises)
        .then(
          ([
            managementRegimeResponse,
            choicesResponse,
            projectResponse,
            projectProfilesResponse,
          ]) => {
            if (isMounted.current) {
              if (!managementRegimeResponse && managementRegimeId) {
                setIdsNotAssociatedWithData((previousState) => [
                  ...previousState,
                  managementRegimeId,
                ])
              }
              if (!projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
              }
              const filteredUserProfile = projectProfilesResponse.filter(
                ({ profile }) => currentUser.id === profile,
              )[0]

              setManagementParties(getOptions(choicesResponse.managementparties))
              setManagementCompliances(getOptions(choicesResponse.managementcompliances))
              setManagementRegimeBeingEdited(managementRegimeResponse)
              setCurrentUserProfile(filteredUserProfile)
              setIsLoading(false)
            }
          },
        )
        .catch(() => {
          toast.error(...getToastArguments(language.error.managementRegimeRecordUnavailable))
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isSyncInProgress,
    managementRegimeId,
    projectId,
    currentUser,
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
        .then(() => {
          toast.success(language.success.managementRegimeSave)
          setSaveButtonState(buttonGroupStates.saved)
          formikActions.resetForm({ values: formikValues })
        })
        .catch(() => {
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

  const isReadOnlyUser = !(currentUserProfile.is_admin || currentUserProfile.is_collector)
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

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      isToolbarSticky={true}
      subNavNode={{ name: formik.values.name }}
      showCollectingNav={!isReadOnlyUser}
      content={contentViewByRole}
      toolbar={
        <ContentPageToolbarWrapper>
          <H2>{formik.values.name}</H2>
          {!isReadOnlyUser && (
            <SaveButton
              formId="management-regime-form"
              saveButtonState={saveButtonState}
              formik={formik}
            />
          )}
        </ContentPageToolbarWrapper>
      }
    />
  )
}

TableRowItem.propTypes = {
  title: PropTypes.string.isRequired,
  options: inputOptionPropType,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
}

TableRowItem.defaultProps = {
  options: undefined,
}

ReadOnlyManagementRegimeContent.propTypes = {
  managementRegime: managementRegimePropType.isRequired,
  managementCompliances: inputOptionPropType.isRequired,
  managementParties: inputOptionPropType.isRequired,
}

export default ManagementRegime
