import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import Modal, { RightFooter, ModalInputRow } from '../generic/Modal/Modal'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { getObjectById } from '../../library/getObjectById'
import useDocumentTitle from '../../library/useDocumentTitle'

const CopyProjectModal = ({ isOpen, onDismiss }) => {
  const formik = useFormik({
    initialValues: { name: '' },
  })
  const [offlineReadyProjectIds, setOfflineReadyProjectIds] = useState([])
  const [projects, setProjects] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  useDocumentTitle(`${language.pages.projectsList.title} - ${language.title.mermaid}`)

  const _getProjectsInfo = useEffect(() => {
    if (databaseSwitchboardInstance && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getProjects(),
        databaseSwitchboardInstance.getOfflineReadyProjectIds(),
      ])
        .then(([projectsResponse, offlineReadyProjectIdsResponse]) => {
          if (isMounted.current) {
            setProjects(projectsResponse)
            setOfflineReadyProjectIds(offlineReadyProjectIdsResponse)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.projectsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isSyncInProgress])

  const getAvailableProjects = () => {
    if (isAppOnline) {
      return projects
    }

    return projects.filter((project) => getObjectById(offlineReadyProjectIds, project.id))
  }

  const projectId = getAvailableProjects().map((site) => {
    return site.id
  })

  const projectName = getAvailableProjects().map((site) => {
    return site.name
  })

  const foundProjectName = projectName.find((element) => element === 'Dev Team Test Project')
  const foundProjectId = projectId.find(
    (element) => element === '8c213ce8-7973-47a5-9359-3a0ef12ed201',
  )

  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        new_project_name: foundProjectName,
        original_project_id: foundProjectId,
        notify_users: false,
      }),
    }

    // console.log(requestOptions)
    // fetch('http://localhost:8080/v1/projects/copy_project', requestOptions).then((response) =>
    //   response.json(),
    // )
    // .then((res) => console.log(res))
  }, [foundProjectName, foundProjectId])

  const handleOnSubmit = () => {
    onDismiss()
    // console.log(`Copied ${foundProjectName}`)
    toast.success(...getToastArguments(language.success.copyProject))
  }

  const modalContent = (
    <>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-projectname-label" htmlFor="modal-input-for-projectname">
          <h4>Project Name</h4>
        </label>
        <Input
          aria-labelledby="modal-input-for-projectname-label"
          id="modal-input-for-name"
          name="name"
          //   value={formik.values.name}
          type="text"
          placeholder={`Copy of ${foundProjectName}`}
          onChange={(event) => formik.setFieldValue('name', event.target.value)}
        />
      </ModalInputRow>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonPrimary onClick={handleOnSubmit}>
        <IconSend />
        Copy project
      </ButtonPrimary>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={language.title.userProfileModal}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

CopyProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default CopyProjectModal
