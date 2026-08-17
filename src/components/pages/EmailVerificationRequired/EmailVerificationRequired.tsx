import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './EmailVerificationRequired.module.scss'
import buttonStyles from '../../../style/buttons.module.scss'

interface EmailVerificationRequiredProps {
  onLogin: () => void
}

const EmailVerificationRequired = ({ onLogin }: EmailVerificationRequiredProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.container} data-testid="email-verification-required">
      <h1>{t('auth.email_not_verified_heading')}</h1>
      <p>{t('auth.email_not_verified_message')}</p>
      <button type="button" className={buttonStyles['button--primary']} onClick={onLogin}>
        {t('auth.try_login_again')}
      </button>
    </div>
  )
}

export default EmailVerificationRequired
