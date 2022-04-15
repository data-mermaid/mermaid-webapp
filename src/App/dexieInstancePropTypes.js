import PropTypes from 'prop-types'

// If This were TypeScript, types would be easy to obtain for Dexie
// however, we are using proptypes, so we'll make an exception for good typing
// here because this is a third party library
const dexieInstancePropTypes = PropTypes.any

export default dexieInstancePropTypes
