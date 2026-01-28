import React from 'react'
import { Button } from '@mui/material'
import styles from './CalloutButton.module.scss'

interface CalloutButtonProps {
  onClick: () => void
  label: string
  className?: string
  disabled: boolean
  testId: string
}

const CalloutButton = ({ onClick, label, disabled, testId, className }: CalloutButtonProps) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      className={className}
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
