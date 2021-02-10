import React from 'react'
import PropTypes from 'prop-types'
import SubLayout1 from '../../SubLayout1'

/**
 * Describe your component
 */
const Projects = ({ topRow, bottomRow }) => {
  return <SubLayout1 topRow={topRow} bottomRow={bottomRow} />
}

Projects.propTypes = {
  topRow: PropTypes.node.isRequired,
  bottomRow: PropTypes.node.isRequired,
}

export default Projects
