import { faCopy } from '@fortawesome/free-regular-svg-icons'
import {
  faCaretDown,
  faCaretUp,
  faCheckCircle,
  faExternalLinkAlt,
  faFileAlt,
  faFilter,
  faPencilAlt,
  faSortAmountDownAlt,
  faSortAmountUpAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const IconCollect = () => <FontAwesomeIcon icon={faPencilAlt} />

export const IconData = () => <FontAwesomeIcon icon={faCheckCircle} />
export const IconAdmin = () => <FontAwesomeIcon icon={faFileAlt} />
export const IconCopy = () => <FontAwesomeIcon icon={faCopy} />
export const IconSortUp = () => <FontAwesomeIcon icon={faSortAmountUpAlt} />
export const IconSortDown = () => <FontAwesomeIcon icon={faSortAmountDownAlt} />
export const IconFilter = () => <FontAwesomeIcon icon={faFilter} />
export const IconExternalLink = () => (
  <FontAwesomeIcon icon={faExternalLinkAlt} />
)
export const IconDown = () => <FontAwesomeIcon icon={faCaretDown} />
export const IconUp = () => <FontAwesomeIcon icon={faCaretUp} />
