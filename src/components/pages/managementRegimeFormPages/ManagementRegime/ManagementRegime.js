import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'

import { getManagementRegimeInitialValues } from '../managementRegimeFormInitialValues'
import { H2 } from '../../../generic/text'
import { ContentPageLayout } from '../../../Layout'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import InputWithLabelAndValidation from '../../../generic/InputWithLabelAndValidation'
import InputRadioWithLabelAndValidation from '../../../generic/InputRadioWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../generic/TextareaWithLabelAndValidation'
import ManagementRulesInput from '../ManagementRulesInput'
import InputCheckboxGroupWithLabel from '../../../generic/InputCheckboxGroupWithLabel'
import { InputWrapper } from '../../../generic/form'
import { getOptions } from '../../../../library/getOptions'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useIsMounted from '../../../../library/useIsMounted'

const ManagementRegime = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [managementCompliances, setManagementCompliances] = useState([])
  const [managementParties, setManagementParties] = useState([])
  const [
    managementRegimeBeingEdited,
    setManagementRegimeBeingEdited,
  ] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { managementRegimeId } = useParams()
  const isMounted = useIsMounted()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getManagementRegime(managementRegimeId),
        databaseSwitchboardInstance.getChoices(),
      ]

      Promise.all(promises)
        .then(([managementRegimeResponse, choicesResponse]) => {
          if (isMounted.current) {
            setManagementParties(getOptions(choicesResponse.managementparties))
            setManagementCompliances(
              getOptions(choicesResponse.managementcompliances),
            )
            setManagementRegimeBeingEdited(managementRegimeResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          // Will update language file when adding user workflow like save/delete site to page.
          toast.error(`management regime error`)
        })
    }
  }, [
    databaseSwitchboardInstance,
    managementRegimeId,
    isMounted,
    isSyncInProgress,
  ])

  const initialFormValues = useMemo(
    () => getManagementRegimeInitialValues(managementRegimeBeingEdited),
    [managementRegimeBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  return (
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
                  <InputCheckboxGroupWithLabel
                    label="Parties"
                    id="parties"
                    options={managementParties}
                    value={formik.getFieldProps('parties').value}
                    onChange={(selectedItems) => {
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
