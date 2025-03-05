import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import theme from '../../../theme'
import language from '../../../language'

const IdNotFoundWrapper = styled('div')`
  padding: ${theme.spacing.medium};
`
const IdsNotFound = ({ ids }) => {
  return (
    <IdNotFoundWrapper>
      <h2>{language.error.idNotFound}</h2>
      <p>{language.error.idNotFoundRecovery}</p>
      <Link to="/">{language.error.homePageNavigation}</Link>
      <p>
        <small>{language.error.getIdsNotFoundDetails(ids)}</small>
      </p>
    </IdNotFoundWrapper>
  )
}

IdsNotFound.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
}

export default IdsNotFound
