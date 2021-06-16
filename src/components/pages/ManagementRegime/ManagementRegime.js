import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'

import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

const ManagementRegime = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [managementParties, setManagementParties] = useState([])
  const [managementCompliances, setManagementCompliances] = useState([])
  const [
    managementRegimeBeingEdited,
    setManagementRegimeBeingEdited,
  ] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { managementRegimeId } = useParams()

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getManagementRegime(managementRegimeId),
        databaseSwitchboardInstance.getChoices(),
      ]

      Promise.all(promises)
        .then(([managementRegimeResponse, choicesResponse]) => {
          if (isMounted) {
            setManagementParties(choicesResponse.managementparties)
            setManagementCompliances(choicesResponse.managementcompliances)
            setManagementRegimeBeingEdited(managementRegimeResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          // Will update language file when adding user workflow like save/delete site to page.
          toast.error(`management regime error`)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, managementRegimeId])

  return (
    <ContentPageLayout
      isLoading={isLoading}
      content={<>Management</>}
      toolbar={
        <>
          <H2>Management Regime Name</H2>
        </>
      }
    />
  )
}

ManagementRegime.propTypes = {}

export default ManagementRegime
