import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Row } from '../positioning'

/**
 * Breadcrumb Nav
 */

const BreadcrumbLink = styled(Link)`
  padding: 0 ${(props) => props.theme.spacing.small};
`

const Breadcrumbs = ({ crumbs }) => {
  const hasOnlyOneCrumb = crumbs.length === 1

  return (
    !hasOnlyOneCrumb && (
      <Row as="nav">
        {crumbs.map((crumb, index) => {
          const isFirstCrumb = index === 0

          return (
            // react doesnt see path alone as unique, so munged name onto key
            <span key={`${crumb.name}-${crumbs.path}`}>
              {!isFirstCrumb && '>'}
              <BreadcrumbLink to={crumb.path}>{crumb.name}</BreadcrumbLink>
            </span>
          )
        })}
      </Row>
    )
  )
}

Breadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({ path: PropTypes.string, name: PropTypes.string }),
  ).isRequired,
}

export default Breadcrumbs
