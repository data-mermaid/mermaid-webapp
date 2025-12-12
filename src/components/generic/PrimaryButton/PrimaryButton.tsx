import React from 'react'
import { Button } from '@mui/material'
import styles from './PrimaryButton.module.scss'

interface PrimaryButtonProps {
  onClick: () => void
  label: string
  disabled: boolean
  testId: string
  children?: React.ReactNode
}

const PrimaryButton = ({ onClick, label, disabled, testId }: PrimaryButtonProps) => {
  return (
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
  )
}
export default PrimaryButton
