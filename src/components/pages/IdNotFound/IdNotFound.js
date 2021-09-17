import React from 'react'
import PropTypes from 'prop-types'
import { H2, H3, P } from '../../generic/text'
import language from '../../../language'

const IdNotFound = ({ id }) => {
  return (
    <>
      <H2>{language.error.error}</H2>
      <H3>{language.error.generic}</H3>
      <P>
        <strong>{language.error.idNotFoundUserAction}</strong>
      </P>
      <P>
        <small>{language.error.getIdNotFoundDetails(id)}</small>
      </P>
    </>
  )
}

IdNotFound.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default IdNotFound
