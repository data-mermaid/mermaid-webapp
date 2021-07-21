import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import { getSubmittedRecordDataInitialValues } from '../submittedRecordFormInitialValues'
import { H2 } from '../../../generic/text'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { ContentPageLayout } from '../../../Layout'
import SubmittedFishBeltInfo from '../../../SubmittedFishBeltInfo'
import useIsMounted from '../../../../library/useIsMounted'
import language from '../../../../language'

const SubmittedFishBelt = () => {
  const [choices, setChoices] = useState({})
  const [submittedRecord, setSubmittedRecord] = useState()
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { recordId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useIsMounted()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getSites(),
        databaseSwitchboardInstance.getManagementRegimes(),
        databaseSwitchboardInstance.getChoices(),
      ]

      if (recordId) {
        promises.push(databaseSwitchboardInstance.getSubmittedRecord(recordId))
      }

      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            submittedRecordResponse,
          ]) => {
            if (isMounted.current) {
              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setSubmittedRecord(submittedRecordResponse)
              setIsLoading(false)
            }
          },
        )
        .catch(() => {
          toast.error(language.error.submittedRecordsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, recordId])

  const initialFormValues = useMemo(
    () =>
      getSubmittedRecordDataInitialValues(submittedRecord, 'fishbelt_transect'),
    [submittedRecord],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  return (
    <ContentPageLayout
      isLoading={isLoading}
      content={
        <Formik {...formikOptions}>
          {(formik) => (
            <SubmittedFishBeltInfo
              formik={formik}
              choices={choices}
              sites={sites}
              managementRegimes={managementRegimes}
            />
          )}
        </Formik>
      }
      toolbar={
        <>
          <H2>Submitted Record</H2>
        </>
      }
    />
  )
}

SubmittedFishBelt.propTypes = {}

export default SubmittedFishBelt
