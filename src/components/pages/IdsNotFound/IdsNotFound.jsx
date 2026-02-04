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
  const idList = Array.isArray(ids) ? ids.join(', ') : ids
  const idsNotFoundDetails = t('item_details_not_found', {
    count: Array.isArray(ids) ? ids.length : 1,
    ids: idList,
  })

  return (
    <IdNotFoundWrapper>
      <h2>{t('item_not_found')}</h2>
      <p>{t('item_not_accessible')}</p>
      <Link to="/">{t('go_back_to_homepage')}</Link>
      <p>
        <small>{idsNotFoundDetails}</small>
      </p>
    </IdNotFoundWrapper>
  )
}

IdsNotFound.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
}

export default IdsNotFound
