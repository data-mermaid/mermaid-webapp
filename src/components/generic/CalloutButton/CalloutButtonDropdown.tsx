import React, { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import styles from './CalloutButton.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../library/getToastArguments'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import LoadingModal from '../../LoadingModal/LoadingModal'

interface CalloutButtonDropdownProps {
  onClick: () => void
  label: string
  disabled: boolean
  testId?: string
}
const CalloutButtonDropdown = ({
  onClick,
  label,
  disabled,
  testId,
}: CalloutButtonDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { t } = useTranslation()
  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { refreshCurrentUser } = useCurrentUser()

  const handleSuccessResponse = (response, languageSuccessMessage) => {
    refreshCurrentUser() // this ensures the user has the right privileges to the newly created project
    toast.success(...getToastArguments(languageSuccessMessage))
    // addProjectToProjectsPage(response) //todo: implement drilldown..
    setIsLoading(false)
    navigate(`/projects/${response.id}/sites`)
  }

  const handleResponseError = (error) => {
    // handleHttpResponseError({
    //   error,
    //   callback: () => {
    //     const isDuplicateError =
    //       error.response.status === 400 ||
    //       (error.response.status === 500 &&
    //         error.response.data?.new_project_name === 'Project name already exists') //TODO: update error to match api
    //
    //     if (isDuplicateError) {
    //       // setNameAlreadyExists(true)
    //       toast.error(...getToastArguments(t('api_errors.demo_project_exists'))) //todo: new error message
    //     }
    //   },
    // })

    setIsLoading(false)
  }

  const createDemoProject = () => {
    setIsLoading(true)
    databaseSwitchboardInstance
      .addDemoProject()
      .then((response) => {
        handleSuccessResponse(response, t('projects.success.project_created'))
      })
      .catch((error) => {
        handleResponseError(error)
      })
  }

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && <LoadingModal />}
      <Button
        variant="outlined"
        onClick={onClick}
        disabled={disabled}
        data-testid={testId}
        classes={{
          root: styles['button-root__callout'],
        }}
      >
        {label}
      </Button>
      <IconButton
        classes={{
          root: styles['button-root__callout'],
        }}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon
          icon={faCaretDown}
          style={{
            transform: `rotate(${isDropdownOpen ? '180deg' : '0'})`,
          }}
        />
      </IconButton>
      <ul
        style={{ display: isDropdownOpen ? 'block' : 'none' }}
        className={styles['callout-button-dropdown__list']}
      >
        <li>
          <Button
            onClick={createDemoProject}
            classes={{
              root: styles['button-root__callout'],
            }}
          >
            {t('projects.buttons.add_demo')}
          </Button>
        </li>
      </ul>
    </div>
  )
}
export default CalloutButtonDropdown
