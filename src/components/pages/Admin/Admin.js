import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'

import { getProjectInitialValues } from './projectRecordInitialFormValue'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import InputWithLabelAndValidation from '../../generic/InputWithLabelAndValidation'
import InputAutocomplete from '../../generic/InputAutocomplete'
import TextareaWithLabelAndValidation from '../../generic/TextareaWithLabelAndValidation'
import { InputWrapper } from '../../generic/form'
import { getOptions } from '../../../library/getOptions'

const Admin = () => {
  const { isOnline } = useOnlineStatus()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [projectTagOptions, setProjectTagOptions] = useState([])
  const [projectTags, setProjectTags] = useState([])
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { projectId } = useParams()

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getProjectTags(),
      ]

      Promise.all(promises)
        .then(([projectResponse, projectTagsResponse]) => {
          if (isMounted) {
            console.log(projectResponse)
            setProjectBeingEdited(projectResponse)
            setProjectTags(projectResponse.tags)
            setProjectTagOptions(getOptions(projectTagsResponse.results, false))
            setIsLoading(false)
          }
        })
        .catch(() => {
          // Will update language file when adding user workflow like save/delete site to page.
          toast.error(`project error`)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, projectId])

  const initialFormValues = useMemo(
    () => getProjectInitialValues(projectBeingEdited),
    [projectBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  const organizationList =
    isOnline &&
    projectTags.length > 0 &&
    projectTags.map((item) => <div key={item}>{item}</div>)

  const content = isOnline ? (
    <Formik {...formikOptions}>
      {(formik) => (
        <InputWrapper>
          <InputWithLabelAndValidation
            label="Name"
            id="name"
            type="text"
            {...formik.getFieldProps('name')}
          />
          <TextareaWithLabelAndValidation
            label="Notes"
            id="notes"
            {...formik.getFieldProps('notes')}
          />
          <InputAutocomplete
            label="Organizations"
            id="organizations"
            options={projectTagOptions}
            placeholder="Search for an organization"
            onChange={() => {}}
          />
          <div>{organizationList}</div>
        </InputWrapper>
      )}
    </Formik>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      isLoading={isLoading}
      content={content}
      toolbar={
        <>
          <H2>Project Info</H2>
        </>
      }
    />
  )
}

export default Admin
