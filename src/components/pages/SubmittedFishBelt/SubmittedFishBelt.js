import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { IconPen } from '../../icons'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { ContentPageLayout } from '../../Layout'
import { ButtonSecondary } from '../../generic/buttons'
import { RowSpaceBetween } from '../../generic/positioning'
import SubmittedFishBeltInfoTable from '../../SubmittedFishBeltInfoTable'
import SubmittedFishBeltObservationTable from '../../SubmittedFishBeltObservationTable'
import RecordFormTitle from '../../RecordFormTitle'
import useIsMounted from '../../../library/useIsMounted'
import language from '../../../language'
import { getFishNameOptions } from '../../../App/mermaidData/getFishNameOptions'
import { getFishNameConstants } from '../../../App/mermaidData/getFishNameConstants'

const SubmittedFishBelt = () => {
  const [choices, setChoices] = useState({})
  const [submittedRecord, setSubmittedRecord] = useState()
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const [fishNameOptions, setFishNameOptions] = useState([])
  const [fishNameConstants, setFishNameConstants] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { recordId, projectId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useIsMounted()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getSites(),
        databaseSwitchboardInstance.getManagementRegimes(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
        databaseSwitchboardInstance.getSubmittedFishBeltTransectRecord(
          recordId,
        ),
      ]

      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            species,
            genera,
            families,
            submittedRecordResponse,
          ]) => {
            if (isMounted.current) {
              const updateFishNameOptions = getFishNameOptions({
                species,
                genera,
                families,
              })

              const updateFishNameConstants = getFishNameConstants({
                species,
                genera,
                families,
              })

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setSubmittedRecord(submittedRecordResponse)
              setFishNameOptions(updateFishNameOptions)
              setFishNameConstants(updateFishNameConstants)
              setIsLoading(false)
            }
          },
        )
        .catch(() => {
          toast.error(language.error.submittedRecordsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, recordId])

  return (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={
        <>
          <SubmittedFishBeltInfoTable
            choices={choices}
            sites={sites}
            managementRegimes={managementRegimes}
            submittedRecord={submittedRecord}
          />
          <SubmittedFishBeltObservationTable
            choices={choices}
            fishNameOptions={fishNameOptions}
            fishNameConstants={fishNameConstants}
            submittedRecord={submittedRecord}
          />
        </>
      }
      toolbar={
        <>
          <RecordFormTitle
            submittedRecordOrCollectRecordDataProperty={submittedRecord}
            sites={sites}
          />
          <RowSpaceBetween>
            <div>{language.pages.submittedFishBeltForm.toolbarLabel}</div>{' '}
            <ButtonSecondary>
              <IconPen />
              Edit Sample Unit - move to collect
            </ButtonSecondary>
          </RowSpaceBetween>
        </>
      }
    />
  )
}

SubmittedFishBelt.propTypes = {}

export default SubmittedFishBelt
