import React from 'react'
import PropTypes from 'prop-types'

/**
 * Describe your component
 */
const Breadcrumbs = ({ crumbs }) => {
  const hasOnlyOneCrumb = crumbs.length === 1

  return crumbs.map((crumb, index) => {
    const isLastCrumb = index === crumbs.length - 1

    return (
      <span key={`Breadcrumb${index}`}>
        <a href={crumb.path}>{crumb.name}</a>{' '}
        {!isLastCrumb && !hasOnlyOneCrumb && ' > '}
      </span>
    )
  })
}

Breadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({ path: PropTypes.string, name: PropTypes.string }),
  ).isRequired,
}

export default Breadcrumbs
