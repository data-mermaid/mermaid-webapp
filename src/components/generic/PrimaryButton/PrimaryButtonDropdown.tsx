import React, { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import styles from './PrimaryButton.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

interface PrimaryButtonDropdownProps {
  onClick: () => void
  label: string
  disabled: boolean
  testId: string
  children?: React.ReactNode
}

const PrimaryButtonDropdown = ({
  onClick,
  label,
  disabled,
  testId,
}: PrimaryButtonDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { t } = useTranslation()
  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  return (
    <div style={{ position: 'relative' }}>
      <Button
        variant="outlined"
        onClick={onClick}
        disabled={disabled}
        data-testid={testId}
        classes={{
          root: styles['button-root__primary'],
        }}
      >
        {label}
      </Button>
      <IconButton
        classes={{
          root: styles['button-root__primary'],
        }}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon
          icon={faCaretDown}
          style={{
            transform: `rotate(${isDropdownOpen ? '-90deg' : '0'})`,
          }}
        />
      </IconButton>
      <ul
        style={{ display: isDropdownOpen ? 'block' : 'none' }}
        className={styles['primary-button-dropdown__list']}
      >
        <li>
          <Button
            classes={{
              root: styles['button-root__primary'],
            }}
          >
            {t('projects.buttons.add_demo')}
          </Button>
        </li>
      </ul>
    </div>
  )
}
export default PrimaryButtonDropdown
