import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { ButtonPrimary } from '../generic/buttons'
import { CenterCenter } from '../generic/miscellaneous'
import { H2, P } from '../generic/text'

const EmailVerificationRequired = ({ onLogin }) => {
  const { t } = useTranslation()

  return (
    <CenterCenter>
      <div>
        <H2>{t('auth.email_not_verified_heading')}</H2>
        <P>{t('auth.email_not_verified_message')}</P>
        <ButtonPrimary onClick={onLogin}>{t('auth.try_login_again')}</ButtonPrimary>
      </div>
    </CenterCenter>
  )
}

EmailVerificationRequired.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default EmailVerificationRequired
