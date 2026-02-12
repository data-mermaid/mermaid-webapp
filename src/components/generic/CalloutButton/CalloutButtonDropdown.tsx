import React, { useState } from 'react'
import { Button, ClickAwayListener, IconButton } from '@mui/material'
import styles from './CalloutButton.module.scss'
import buttonStyles from '../../../style/buttons.module.scss'
import { useTranslation } from 'react-i18next'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../library/getToastArguments'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import LoadingModal from '../../LoadingModal/LoadingModal'
import handleHttpResponseError from '../../../library/handleHttpResponseError'
import { AxiosError } from 'axios'
import { IconDown } from '../../icons'
import { internalNavigation } from '../../../link_constants'

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
    setIsDropdownOpen(false)
    refreshCurrentUser() // ensures correct user privileges
    toast.success(...getToastArguments(languageSuccessMessage))
    setIsLoading(false)
    navigate(internalNavigation.projectStartPage(response.id))
  }

  const handleResponseError = (error: AxiosError) => {
    const isDuplicateError = error.response?.status === 400
    setIsLoading(false)

    handleHttpResponseError({
      error,
      callback: () => {
        if (isDuplicateError) {
          toast.error(...getToastArguments(t('api_errors.demo_project_exists')))
        }
      },
    })
  }

  const createDemoProject = () => {
    setIsDropdownOpen(false)
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
    <ClickAwayListener onClickAway={isDropdownOpen ? () => setIsDropdownOpen(false) : () => {}}>
      <div style={{ position: 'relative' }}>
        {isLoading && <LoadingModal />}
        <Button
          variant="outlined"
          onClick={onClick}
          disabled={disabled}
          data-testid={testId}
          classes={{
            root: buttonStyles['button--callout'],
          }}
        >
          {label}
        </Button>
        <IconButton
          classes={{
            root: buttonStyles['button--callout'],
          }}
          onClick={toggleMenu}
          style={{ marginLeft: 0 }} //override default nth button margin
        >
          <IconDown
            style={{
              transform: `rotate(${isDropdownOpen ? '180deg' : '0'})`,
            }}
          />
        </IconButton>
        <div
          style={{ display: isDropdownOpen ? 'block' : 'none' }}
          data-testid="dropdown-icon-button"
          className={styles['callout-button-dropdown__list']}
        >
          <Button
            onClick={createDemoProject}
            data-testid="add-demo-project-button"
            classes={{
              root: buttonStyles['button--callout'],
            }}
          >
            {t('projects.buttons.add_demo')}
          </Button>
        </div>
      </div>
    </ClickAwayListener>
  )
}
export default CalloutButtonDropdown
