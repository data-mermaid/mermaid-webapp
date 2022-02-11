import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'

import { ContentPageLayout } from '../../../Layout'
import { getManagementRegimeInitialValues } from '../managementRegimeFormInitialValues'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import InputCheckboxGroupWithLabelAndValidation from '../../../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import InputRadioWithLabelAndValidation from '../../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../language'
import ManagementRulesInput from '../ManagementRulesInput'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'
import useIsMounted from '../../../../library/useIsMounted'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ButtonCallout } from '../../../generic/buttons'
import { IconSave } from '../../../icons'

const ManagementRegime = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [managementCompliances, setManagementCompliances] = useState([])
  const [managementParties, setManagementParties] = useState([])
  const [managementRegimeBeingEdited, setManagementRegimeBeingEdited] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { managementRegimeId, projectId } = useParams()
  const isMounted = useIsMounted()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getManagementRegime(managementRegimeId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProject(projectId),
      ]

      Promise.all(promises)
        .then(([managementRegimeResponse, choicesResponse, projectResponse]) => {
          if (isMounted.current) {
            if (!managementRegimeResponse && managementRegimeId) {
              setIdsNotAssociatedWithData((previousState) => [...previousState, managementRegimeId])
            }
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
            }

            setManagementParties(getOptions(choicesResponse.managementparties))
            setManagementCompliances(getOptions(choicesResponse.managementcompliances))
            setManagementRegimeBeingEdited(managementRegimeResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(language.error.managementRegimeRecordUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isSyncInProgress, managementRegimeId, projectId])

  const initialFormValues = useMemo(
    () => getManagementRegimeInitialValues(managementRegimeBeingEdited),
    [managementRegimeBeingEdited],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: () => {},
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
        errors.name = [{ message: language.error.formValidation.required, id: 'Required' }]
      }
      if (!isOneOfRulesSelected) {
        errors.rules = [{ message: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  })

  const doesFormikHaveErrors = Object.keys(formik.errors).length
  const isSaveButtonDisabled = !formik.dirty || doesFormikHaveErrors

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      isToolbarSticky={true}
      content={
        <>
          <form id="management-regime-form" onSubmit={formik.handleSubmit}>
            <InputWrapper>
              <InputWithLabelAndValidation
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
                onChange={(property, selectedItems) => {
                  formik.setFieldValue(property, selectedItems)
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
          <EnhancedPrompt shouldPromptTrigger={formik.dirty}/>
        </>
      }
      toolbar={
        <ContentPageToolbarWrapper>
          <H2>{formik.values.name}</H2>
          <ButtonCallout
            type="submit"
            form="management-regime-form"
            disabled={isSaveButtonDisabled}
          >
            <IconSave />
            Save
          </ButtonCallout>
        </ContentPageToolbarWrapper>
      }
    />
  )
}

ManagementRegime.propTypes = {}

export default ManagementRegime
