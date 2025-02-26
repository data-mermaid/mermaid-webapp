import React from 'react'
import { InlineIcon } from '@iconify/react'
import accountCircle from '@iconify-icons/mdi/account-circle'
import accountConvert from '@iconify-icons/mdi/account-convert'
import accountGroup from '@iconify-icons/mdi/account-group'
import accountRemove from '@iconify-icons/mdi/account-remove'
import alert from '@iconify-icons/mdi/alert'
import arrowBack from '@iconify-icons/mdi/arrow-back'
import arrowRight from '@iconify-icons/mdi/arrow-right-bold-circle'
import asterisk from '@iconify-icons/mdi/asterisk'
import bellIcon from '@iconify-icons/mdi/bell'
import book from '@iconify-icons/mdi/book'
import chartBar from '@iconify-icons/mdi/chart-bar'
import checkAllIcon from '@iconify-icons/mdi/check-all'
import checkCircleOutline from '@iconify-icons/mdi/check-circle-outline'
import checkIcon from '@iconify-icons/mdi/check'
import checkOutline from '@iconify-icons/mdi/check-outline'
import circleEditOutline from '@iconify-icons/mdi/circle-edit-outline'
import clipboardCheck from '@iconify-icons/mdi/clipboard-check-outline'
import clipboardEdit from '@iconify-icons/mdi/clipboard-edit'
import closeIcon from '@iconify-icons/mdi/close'
import closeIconCircle from '@iconify-icons/mdi/close-circle'
import contentCopy from '@iconify-icons/mdi/content-copy'
import contentSave from '@iconify-icons/mdi/content-save'
import download from '@iconify-icons/mdi/download'
import excel from '@iconify-icons/mdi/microsoft-excel'
import fileAccountOutline from '@iconify-icons/mdi/file-account-outline'
import fileTable from '@iconify-icons/mdi/file-table-box-outline'
import filterOutline from '@iconify-icons/mdi/filter-outline'
import fish from '@iconify-icons/mdi/fish'
import globe from '@iconify-icons/mdi/web'
import heartOutline from '@iconify-icons/mdi/heart-outline'
import homeOutline from '@iconify-icons/mdi/home-outline'
import informationIcon from '@iconify-icons/mdi/information-outline'
import launch from '@iconify-icons/mdi/launch'
import libraryBooks from '@iconify-icons/mdi/library-books'
import mapMarkerRadiusOutline from '@iconify-icons/mdi/map-marker-radius-outline'
import mapMarker from '@iconify-icons/mdi/map-marker'
import menu from '@iconify-icons/mdi/menu'
import menuDown from '@iconify-icons/mdi/menu-down'
import menuUp from '@iconify-icons/mdi/menu-up'
import multiFileTable from '@iconify-icons/mdi/file-table-box-multiple-outline'
import openInNew from '@iconify-icons/mdi/open-in-new'
import pencilIcon from '@iconify-icons/mdi/pencil'
import playButton from '@iconify-icons/mdi/play-circle-outline'
import plus from '@iconify-icons/mdi/plus'
import send from '@iconify-icons/mdi/send'
import refresh from '@iconify-icons/mdi/refresh'
import shareVariantOutline from '@iconify-icons/mdi/share-variant-outline'
import sortAscending from '@iconify-icons/mdi/sort-ascending'
import sortDescending from '@iconify-icons/mdi/sort-descending'
import styled from 'styled-components'
import swap from '@iconify-icons/mdi/swap-vertical'
import sync from '@iconify-icons/mdi/sync'
import upload from '@iconify-icons/mdi/upload'
import user from '@iconify-icons/mdi/user'
import usersAndTransects from '@iconify-icons/mdi/account-box-multiple-outline'
import theme from '../theme'

const WarningIcon = styled(InlineIcon)`
  color: ${theme.color.warningColor};
`

const DeleteIcon = styled(InlineIcon)`
  color: ${theme.color.cautionText};
`

export const IconAccount = (props) => <InlineIcon icon={accountCircle} {...props} />
export const IconAccountConvert = (props) => <InlineIcon icon={accountConvert} {...props} />
export const IconAccountRemove = (props) => <DeleteIcon icon={accountRemove} {...props} />
export const IconAdmin = (props) => <InlineIcon icon={fileAccountOutline} {...props} />
export const IconAlert = (props) => <WarningIcon icon={alert} {...props} />
export const IconArrowBack = (props) => <InlineIcon icon={arrowBack} {...props} />
export const IconArrowRight = (props) => <InlineIcon icon={arrowRight} {...props} />
export const IconBell = (props) => <InlineIcon icon={bellIcon} {...props} />
export const IconBook = (props) => <InlineIcon icon={book} {...props} />
export const IconCheck = (props) => <InlineIcon icon={checkIcon} {...props} />
export const IconCheckOutline = (props) => <InlineIcon icon={checkOutline} {...props} />
export const IconCheckAll = (props) => <InlineIcon icon={checkAllIcon} {...props} />
export const IconClose = (props) => <InlineIcon icon={closeIcon} {...props} />
export const IconCloseCircle = (props) => <InlineIcon icon={closeIconCircle} {...props} />
export const IconCollect = (props) => <InlineIcon icon={circleEditOutline} {...props} />
export const IconCopy = (props) => <InlineIcon icon={contentCopy} {...props} />
export const IconData = (props) => <InlineIcon icon={checkCircleOutline} {...props} />
export const IconDown = (props) => <InlineIcon icon={menuDown} {...props} />
export const IconDownload = (props) => <InlineIcon icon={download} {...props} />
export const IconExternalLink = (props) => <InlineIcon icon={launch} {...props} />
export const IconFilter = (props) => <InlineIcon icon={filterOutline} {...props} />
export const IconFish = (props) => <InlineIcon icon={fish} {...props} />
export const IconGfcr = (props) => <InlineIcon icon={clipboardEdit} {...props} />
export const IconGlobe = (props) => <InlineIcon icon={globe} {...props} />
export const IconGraph = (props) => <InlineIcon icon={chartBar} {...props} />
export const IconHeart = (props) => <InlineIcon icon={heartOutline} {...props} />
export const IconHome = (props) => <InlineIcon icon={homeOutline} {...props} />
export const IconInfo = (props) => <InlineIcon icon={informationIcon} {...props} />
export const IconLibraryBooks = (props) => <InlineIcon icon={libraryBooks} {...props} />
export const IconMenu = (props) => <InlineIcon icon={menu} {...props} />
export const IconMgmt = (props) => <InlineIcon icon={fileTable} {...props} />
export const IconOpenInNew = (props) => <InlineIcon icon={openInNew} {...props} />
export const IconPen = (props) => <InlineIcon icon={pencilIcon} {...props} />
export const IconMapMarker = (props) => <InlineIcon icon={mapMarker} {...props} />
export const IconPlus = (props) => <InlineIcon icon={plus} {...props} />
export const IconRefresh = (props) => <InlineIcon icon={refresh} {...props} />
export const IconRequired = (props) => <InlineIcon icon={asterisk} {...props} />
export const IconSave = (props) => <InlineIcon icon={contentSave} {...props} />
export const IconSend = (props) => <InlineIcon icon={send} {...props} />
export const IconSharing = (props) => <InlineIcon icon={shareVariantOutline} {...props} />
export const IconSites = (props) => <InlineIcon icon={mapMarkerRadiusOutline} {...props} />
export const IconSortDown = (props) => <InlineIcon icon={sortDescending} {...props} />
export const IconSortUp = (props) => <InlineIcon icon={sortAscending} {...props} />
export const IconSwap = (props) => <InlineIcon icon={swap} {...props} />
export const IconSync = (props) => <InlineIcon icon={sync} {...props} />
export const IconUp = (props) => <InlineIcon icon={menuUp} {...props} />
export const IconUpload = (props) => <InlineIcon icon={upload} {...props} />
export const IconUser = (props) => <InlineIcon icon={user} {...props} />
export const IconUsers = (props) => <InlineIcon icon={accountGroup} {...props} />
export const IconUsersAndTransects = (props) => <InlineIcon icon={usersAndTransects} {...props} />
export const IconProjectProgress = (props) => <InlineIcon icon={playButton} {...props} />
export const IconManagementRegimes = (props) => <InlineIcon icon={fileTable} {...props} />
export const IconProjectOverview = (props) => <InlineIcon icon={clipboardCheck} {...props} />
export const IconExcel = (props) => <InlineIcon icon={excel} {...props} />
export const IconManagementRegimesOverview = (props) => (
  <InlineIcon icon={multiFileTable} {...props} />
)
