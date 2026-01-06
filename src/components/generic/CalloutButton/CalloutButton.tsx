import React from 'react'
import { Button } from '@mui/material'
import styles from './CalloutButton.module.scss'

interface CalloutButtonProps {
  onClick: () => void
  label: string
  disabled: boolean
  testId: string
}

const CalloutButton = ({ onClick, label, disabled, testId }: CalloutButtonProps) => {
  return (
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
  )
}
export default CalloutButton
