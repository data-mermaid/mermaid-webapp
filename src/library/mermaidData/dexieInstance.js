import Dexie from 'dexie'
import PropTypes from 'prop-types'

const dexieInstance = new Dexie('mermaid')

dexieInstance.version(1).stores({
  currentUser: 'id, first_name, last_name, full_name, email',
})

// If This were TypeScript, types would be easy to obtain for Dexie
// however, we are using proptypes, so we'll make an exception for good typing
// here because this is a third party library
const dexieInstancePropTypes = PropTypes.any

export { dexieInstance as default, dexieInstancePropTypes }
