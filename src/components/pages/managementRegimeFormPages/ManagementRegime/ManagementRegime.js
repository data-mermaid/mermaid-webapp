import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'

import { ContentPageLayout } from '../../../Layout'
import { getManagementRegimeInitialValues } from '../managementRegimeFormInitialValues'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import InputCheckboxGroupWithLabelAndValidation from '../../../generic/InputCheckboxGroupWithLabelAndValidation'
import InputRadioWithLabelAndValidation from '../../../generic/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../generic/InputWithLabelAndValidation'
import language from '../../../../language'
import ManagementRulesInput from '../ManagementRulesInput'
import TextareaWithLabelAndValidation from '../../../generic/TextareaWithLabelAndValidation'
import useIsMounted from '../../../../library/useIsMounted'

const ManagementRegime = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [managementCompliances, setManagementCompliances] = useState([])
  const [managementParties, setManagementParties] = useState([])
  const [
    managementRegimeBeingEdited,
    setManagementRegimeBeingEdited,
  ] = useState()
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
        .then(
          ([managementRegimeResponse, choicesResponse, projectResponse]) => {
            if (isMounted.current) {
              if (!managementRegimeResponse && managementRegimeId) {
                setIdsNotAssociatedWithData((previousState) => [
                  ...previousState,
                  managementRegimeId,
                ])
              }
              if (!projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) => [
                  ...previousState,
                  projectId,
                ])
              }

              setManagementParties(
                getOptions(choicesResponse.managementparties),
              )
              setManagementCompliances(
                getOptions(choicesResponse.managementcompliances),
              )
              setManagementRegimeBeingEdited(managementRegimeResponse)
              setIsLoading(false)
            }
          },
        )
        .catch(() => {
          toast.error(language.error.managementRegimeRecordUnavailable)
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isSyncInProgress,
    managementRegimeId,
    projectId,
  ])

  const initialFormValues = useMemo(
    () => getManagementRegimeInitialValues(managementRegimeBeingEdited),
    [managementRegimeBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <Formik {...formikOptions}>
      {(formik) => (
        <ContentPageLayout
          isPageContentLoading={isLoading}
          content={
            <>
              <form id="management-regime-id">
                <InputWrapper>
                  <InputWithLabelAndValidation
                    label="Name"
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
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
            </>
          }
          toolbar={
            <>
              <H2>{formik.values.name}</H2>
            </>
          }
        />
      )}
    </Formik>
  )
}

ManagementRegime.propTypes = {}

export default ManagementRegime
