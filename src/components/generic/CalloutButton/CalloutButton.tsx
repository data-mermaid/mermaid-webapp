import React from 'react'
import { Button } from '@mui/material'
import buttonStyles from '../../../style/buttons.module.scss'

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
        root: buttonStyles['button--callout'],
      }}
    >
      {label}
    </Button>
  )
}
export default CalloutButton
