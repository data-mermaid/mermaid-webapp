import Dexie from 'dexie'
import PropTypes from 'prop-types'

const mermaidDbInstance = new Dexie('mermaid')

mermaidDbInstance.version(1).stores({
  currentUser: 'id, first_name, last_name, full_name, email',
})

// If This were TypeScript, types would be easy to obtain for Dexie
// however, we are using proptypes, so we'll make an exception for good typing
// here because this is a third party library
const mermaidDbInstancePropTypes = PropTypes.any

export { mermaidDbInstance as default, mermaidDbInstancePropTypes }
