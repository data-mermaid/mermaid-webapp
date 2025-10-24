import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import theme from '../../../theme'

const IdNotFoundWrapper = styled('div')`
  padding: ${theme.spacing.medium};
`
const IdsNotFound = ({ ids }) => {
  const { t } = useTranslation()

  return (
    <IdNotFoundWrapper>
      <h2>{t('error.id_not_found')}</h2>
      <p>{t('error.id_not_found_recovery')}</p>
      <Link to="/">{t('error.home_page_navigation')}</Link>
      <p>
        <small>{t(`error.ids_not_found_${ids.length > 1 ? 'other' : 'one'}`, { id: ids.join(', ') })}</small>
      </p>
    </IdNotFoundWrapper>
  )
}

IdsNotFound.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
}

export default IdsNotFound
