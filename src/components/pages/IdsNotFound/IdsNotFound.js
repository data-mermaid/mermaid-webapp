import React from 'react'
import PropTypes from 'prop-types'
import { H2, H3, P } from '../../generic/text'
import language from '../../../language'

const IdsNotFound = ({ ids }) => {
  return (
    <>
      <H2>{language.error.error}</H2>
      <H3>{language.error.generic}</H3>
      <P>
        <strong>{language.error.IdsNotFoundUserAction}</strong>
      </P>
      <P>
        <small>{language.error.getIdsNotFoundDetails(ids)}</small>
      </P>
    </>
  )
}

IdsNotFound.propTypes = {
  ids: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
}

export default IdsNotFound
