import { faChartBar, faCopy } from '@fortawesome/free-regular-svg-icons'
import {
  faCaretDown,
  faCaretUp,
  faCheckCircle,
  faExternalLinkAlt,
  faFileAlt,
  faFilter,
  faMapMarkerAlt,
  faPencilAlt,
  faSortAmountDownAlt,
  faSortAmountUpAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const IconAdmin = () => <FontAwesomeIcon icon={faFileAlt} />
export const IconCollect = () => <FontAwesomeIcon icon={faPencilAlt} />
export const IconCopy = () => <FontAwesomeIcon icon={faCopy} />
export const IconData = () => <FontAwesomeIcon icon={faCheckCircle} />
export const IconDown = () => <FontAwesomeIcon icon={faCaretDown} />
export const IconExternalLink = () => (
  <FontAwesomeIcon icon={faExternalLinkAlt} />
)
export const IconFilter = () => <FontAwesomeIcon icon={faFilter} />
export const IconGraph = () => <FontAwesomeIcon icon={faChartBar} />
export const IconSites = () => <FontAwesomeIcon icon={faMapMarkerAlt} />
export const IconSortDown = () => <FontAwesomeIcon icon={faSortAmountDownAlt} />
export const IconSortUp = () => <FontAwesomeIcon icon={faSortAmountUpAlt} />
export const IconUp = () => <FontAwesomeIcon icon={faCaretUp} />
