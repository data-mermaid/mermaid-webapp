import { InlineIcon } from '@iconify/react'
import React from 'react'
import styled from 'styled-components'
import theme from '../theme'

import accountCircle from '@iconify-icons/mdi/account-circle'
import accountConvert from '@iconify-icons/mdi/account-convert'
import accountGroup from '@iconify-icons/mdi/account-group'
import accountRemove from '@iconify-icons/mdi/account-remove'
import alert from '@iconify-icons/mdi/alert'
import arrowBack from '@iconify-icons/mdi/arrow-back'
import arrowRight from '@iconify-icons/mdi/arrow-right-bold'
import arrowRightCircle from '@iconify-icons/mdi/arrow-right-bold-circle'
import asterisk from '@iconify-icons/mdi/asterisk'
import bellIcon from '@iconify-icons/mdi/bell'
import book from '@iconify-icons/mdi/book'
import chartBar from '@iconify-icons/mdi/chart-bar'
import checkAllIcon from '@iconify-icons/mdi/check-all'
import checkCircleOutline from '@iconify-icons/mdi/check-circle-outline'
import checkIcon from '@iconify-icons/mdi/check'
import checkOutline from '@iconify-icons/mdi/check-outline'
import circle from '@iconify-icons/mdi/circle'
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
import label from '@iconify-icons/mdi/label'
import launch from '@iconify-icons/mdi/launch'
import libraryBooks from '@iconify-icons/mdi/library-books'
import mapMarker from '@iconify-icons/mdi/map-marker'
import mapMarkerRadiusOutline from '@iconify-icons/mdi/map-marker-radius-outline'
import menu from '@iconify-icons/mdi/menu'
import menuDown from '@iconify-icons/mdi/menu-down'
import menuUp from '@iconify-icons/mdi/menu-up'
import minus from '@iconify-icons/mdi/minus'
import multiFileTable from '@iconify-icons/mdi/file-table-box-multiple-outline'
import openInNew from '@iconify-icons/mdi/open-in-new'
import pencilIcon from '@iconify-icons/mdi/pencil'
import playButton from '@iconify-icons/mdi/play-circle-outline'
import plus from '@iconify-icons/mdi/plus'
import refresh from '@iconify-icons/mdi/refresh'
import send from '@iconify-icons/mdi/send'
import shareVariantOutline from '@iconify-icons/mdi/share-variant-outline'
import sortAscending from '@iconify-icons/mdi/sort-ascending'
import sortDescending from '@iconify-icons/mdi/sort-descending'
import sparkles from '@iconify-icons/mdi/sparkles'
import swap from '@iconify-icons/mdi/swap-vertical'
import sync from '@iconify-icons/mdi/sync'
import table from '@iconify-icons/mdi/table'
import upload from '@iconify-icons/mdi/upload'
import user from '@iconify-icons/mdi/user'
import usersAndTransects from '@iconify-icons/mdi/account-box-multiple-outline'
import zoomIn from '@iconify-icons/mdi/zoom-in'
import zoomOut from '@iconify-icons/mdi/zoom-out'

const WarningIcon = styled(InlineIcon)`
  color: ${theme.color.warningColor};
`

const DeleteIcon = styled(InlineIcon)`
  color: ${theme.color.cautionText};
`

type IconProps = Omit<React.ComponentProps<typeof InlineIcon>, 'icon'>
export const IconAccount = (props: IconProps) => <InlineIcon {...props} icon={accountCircle} />
export const IconAccountConvert = (props: IconProps) => (
  <InlineIcon {...props} icon={accountConvert} />
)
export const IconAccountRemove = (props: IconProps) => (
  <DeleteIcon {...props} icon={accountRemove} />
)
export const IconAdmin = (props: IconProps) => <InlineIcon {...props} icon={fileAccountOutline} />
export const IconAlert = (props: IconProps) => <WarningIcon {...props} icon={alert} />
export const IconArrowBack = (props: IconProps) => <InlineIcon {...props} icon={arrowBack} />
export const IconArrowRight = (props: IconProps) => <InlineIcon {...props} icon={arrowRight} />
export const IconArrowRightCircle = (props: IconProps) => (
  <InlineIcon {...props} icon={arrowRightCircle} />
)
export const IconBell = (props: IconProps) => <InlineIcon {...props} icon={bellIcon} />
export const IconBook = (props: IconProps) => <InlineIcon {...props} icon={book} />
export const IconCheck = (props: IconProps) => <InlineIcon {...props} icon={checkIcon} />
export const IconCheckAll = (props: IconProps) => <InlineIcon {...props} icon={checkAllIcon} />
export const IconCheckOutline = (props: IconProps) => <InlineIcon {...props} icon={checkOutline} />
export const IconCircle = (props: IconProps) => <InlineIcon {...props} icon={circle} />
export const IconClose = (props: IconProps) => <InlineIcon {...props} icon={closeIcon} />
export const IconCloseCircle = (props: IconProps) => (
  <InlineIcon {...props} icon={closeIconCircle} />
)
export const IconCollect = (props: IconProps) => <InlineIcon {...props} icon={circleEditOutline} />
export const IconCopy = (props: IconProps) => <InlineIcon {...props} icon={contentCopy} />
export const IconData = (props: IconProps) => <InlineIcon {...props} icon={checkCircleOutline} />
export const IconDown = (props: IconProps) => <InlineIcon {...props} icon={menuDown} />
export const IconDownload = (props: IconProps) => <InlineIcon {...props} icon={download} />
export const IconExcel = (props: IconProps) => <InlineIcon {...props} icon={excel} />
export const IconExternalLink = (props: IconProps) => <InlineIcon {...props} icon={launch} />
export const IconFilter = (props: IconProps) => <InlineIcon {...props} icon={filterOutline} />
export const IconFish = (props: IconProps) => <InlineIcon {...props} icon={fish} />
export const IconGfcr = (props: IconProps) => <InlineIcon {...props} icon={clipboardEdit} />
export const IconGlobe = (props: IconProps) => <InlineIcon {...props} icon={globe} />
export const IconGraph = (props: IconProps) => <InlineIcon {...props} icon={chartBar} />
export const IconHeart = (props: IconProps) => <InlineIcon {...props} icon={heartOutline} />
export const IconHome = (props: IconProps) => <InlineIcon {...props} icon={homeOutline} />
export const IconInfo = (props: IconProps) => <InlineIcon {...props} icon={informationIcon} />
export const IconLabel = (props: IconProps) => <InlineIcon {...props} icon={label} />
export const IconLibraryBooks = (props: IconProps) => <InlineIcon {...props} icon={libraryBooks} />
export const IconManagementRegimes = (props: IconProps) => (
  <InlineIcon {...props} icon={fileTable} />
)
export const IconManagementRegimesOverview = (props: IconProps) => (
  <InlineIcon {...props} icon={multiFileTable} />
)
export const IconMapMarker = (props: IconProps) => <InlineIcon {...props} icon={mapMarker} />
export const IconMenu = (props: IconProps) => <InlineIcon {...props} icon={menu} />
export const IconMgmt = (props: IconProps) => <InlineIcon {...props} icon={fileTable} />
export const IconMinus = (props: IconProps) => <InlineIcon {...props} icon={minus} />
export const IconOpenInNew = (props: IconProps) => <InlineIcon {...props} icon={openInNew} />
export const IconPen = (props: IconProps) => <InlineIcon {...props} icon={pencilIcon} />
export const IconPlus = (props: IconProps) => <InlineIcon {...props} icon={plus} />
export const IconProjectOverview = (props: IconProps) => (
  <InlineIcon {...props} icon={clipboardCheck} />
)
export const IconProjectProgress = (props: IconProps) => <InlineIcon {...props} icon={playButton} />
export const IconRefresh = (props: IconProps) => <InlineIcon {...props} icon={refresh} />
export const IconRequired = (props: IconProps) => <InlineIcon {...props} icon={asterisk} />
export const IconSave = (props: IconProps) => <InlineIcon {...props} icon={contentSave} />
export const IconSend = (props: IconProps) => <InlineIcon {...props} icon={send} />
export const IconSharing = (props: IconProps) => (
  <InlineIcon {...props} icon={shareVariantOutline} />
)
export const IconSites = (props: IconProps) => (
  <InlineIcon {...props} icon={mapMarkerRadiusOutline} />
)
export const IconSortDown = (props: IconProps) => <InlineIcon {...props} icon={sortDescending} />
export const IconSortUp = (props: IconProps) => <InlineIcon {...props} icon={sortAscending} />
export const IconSparkles = (props: IconProps) => <InlineIcon {...props} icon={sparkles} />
export const IconSwap = (props: IconProps) => <InlineIcon {...props} icon={swap} />
export const IconSync = (props: IconProps) => <InlineIcon {...props} icon={sync} />
export const IconTable = (props: IconProps) => <InlineIcon {...props} icon={table} />
export const IconUp = (props: IconProps) => <InlineIcon {...props} icon={menuUp} />
export const IconUpload = (props: IconProps) => <InlineIcon {...props} icon={upload} />
export const IconUser = (props: IconProps) => <InlineIcon {...props} icon={user} />
export const IconUsers = (props: IconProps) => <InlineIcon {...props} icon={accountGroup} />
export const IconUsersAndTransects = (props: IconProps) => (
  <InlineIcon {...props} icon={usersAndTransects} />
)
export const IconZoomIn = (props: IconProps) => <InlineIcon {...props} icon={zoomIn} />
export const IconZoomOut = (props: IconProps) => <InlineIcon {...props} icon={zoomOut} />
