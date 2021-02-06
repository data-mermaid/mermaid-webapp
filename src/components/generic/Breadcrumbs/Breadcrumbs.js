import React from 'react'
import PropTypes from 'prop-types'
import { Row } from '../positioning'

/**
 * Describe your component
 */
const Breadcrumbs = ({ crumbs }) => {
  const hasOnlyOneCrumb = crumbs.length === 1

  return (
    <Row>
      {crumbs.map((crumb, index) => {
        const isLastCrumb = index === crumbs.length - 1

        return (
          // react doesnt see path alone as unique, so munged name onto key
          <span key={`${crumb.name}-${crumbs.path}`}>
            <a href={crumb.path}>{crumb.name}</a>{' '}
            {!isLastCrumb && !hasOnlyOneCrumb && ' > '}
          </span>
        )
      })}
    </Row>
  )
}

Breadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({ path: PropTypes.string, name: PropTypes.string }),
  ).isRequired,
}

export default Breadcrumbs
