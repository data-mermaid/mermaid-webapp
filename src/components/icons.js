import { faChartBar, faCopy } from '@fortawesome/free-regular-svg-icons'
import {
  faCaretDown,
  faCaretUp,
  faCheckCircle,
  faExternalLinkAlt,
  faFileAlt,
  faFilter,
  faHeart,
  faMapMarkerAlt,
  faPencilAlt,
  faShareAlt,
  faSortAmountDownAlt,
  faSortAmountUpAlt,
  faUsers,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const IconAdmin = () => <FontAwesomeIcon icon={faFileAlt} />
export const IconCollect = () => <FontAwesomeIcon icon={faPencilAlt} />
export const IconHeart = () => <FontAwesomeIcon icon={faHeart} />
export const IconCopy = () => <FontAwesomeIcon icon={faCopy} />
export const IconData = () => <FontAwesomeIcon icon={faCheckCircle} />
export const IconDown = () => <FontAwesomeIcon icon={faCaretDown} />
export const IconExternalLink = () => (
  <FontAwesomeIcon icon={faExternalLinkAlt} />
)
export const IconFilter = () => <FontAwesomeIcon icon={faFilter} />
export const IconFishFamilies = () => <FontAwesomeIcon icon={faHeart} />
export const IconGraph = () => <FontAwesomeIcon icon={faChartBar} />
export const IconSharing = () => <FontAwesomeIcon icon={faShareAlt} />
export const IconSites = () => <FontAwesomeIcon icon={faMapMarkerAlt} />
export const IconSortDown = () => <FontAwesomeIcon icon={faSortAmountDownAlt} />
export const IconSortUp = () => <FontAwesomeIcon icon={faSortAmountUpAlt} />
export const IconUp = () => <FontAwesomeIcon icon={faCaretUp} />
export const IconUsers = () => <FontAwesomeIcon icon={faUsers} />
export const IconRefresh = () => <FontAwesomeIcon icon={faSyncAlt} />
