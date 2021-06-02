import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'

import { getSiteInitialValues } from '../siteRecordFormInitialValues'
import { H2 } from '../../../generic/text'
import { ContentPageLayout } from '../../../Layout'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import SiteInputs from '../../../SiteInputs'

const Site = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [choices, setChoices] = useState({})
  const [siteBeingEdited, setSiteBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { siteId } = useParams()

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getSite(siteId),
        databaseSwitchboardInstance.getChoices(),
      ]

      Promise.all(promises)
        .then(([siteResponse, choicesResponse]) => {
          if (isMounted) {
            setChoices(choicesResponse)
            setSiteBeingEdited(siteResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          // Will update language file when adding user workflow like save/delete site to page.
          toast.error(`site error`)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, siteId])

  const initialFromValues = useMemo(
    () => getSiteInitialValues(siteBeingEdited),
    [siteBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFromValues,
    enableReinitialize: true,
  }

  return (
    <Formik {...formikOptions}>
      {(formik) => (
        <ContentPageLayout
          isLoading={isLoading}
          content={
            <>
              <form id="site-form">
                <SiteInputs formik={formik} choices={choices} />
              </form>
            </>
          }
          toolbar={
            <>
              <H2>Site Name</H2>
            </>
          }
        />
      )}
    </Formik>
  )
}

export default Site
