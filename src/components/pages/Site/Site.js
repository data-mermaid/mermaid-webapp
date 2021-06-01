import { Formik } from 'formik'
import { toast } from 'react-toastify'
import React, { useState, useEffect, useMemo } from 'react'

import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard'
import SiteInputs from '../../SiteInputs'

const Site = ({ databaseSwitchboardInstance }) => {
  const [choices, setChoices] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [databaseSwitchboardInstance.getChoices()]

      Promise.all(promises)
        .then(([choicesResponse]) => {
          if (isMounted) {
            setChoices(choicesResponse)
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
  }, [databaseSwitchboardInstance])

  const formikOptions = {
    initialValues: {},
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

Site.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
}

export default Site
