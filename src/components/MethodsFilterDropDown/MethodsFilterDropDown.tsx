import React from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { useTranslation } from 'react-i18next'
import theme from '../../theme'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { getCurrentUserOptionalFeature } from '../../library/getCurrentUserOptionalFeature'

interface MethodsFilterDropDownProps {
  handleMethodsColumnFilterChange: (value: string[]) => void
  value?: string[]
  id?: string
  disabled?: boolean
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 'max-content',
      minWidth: 230,
      color: theme.color.textColor,
    },
  },
}

const fontStyle = { fontFamily: 'Open Sans', fontSize: '1.6rem', whiteSpace: 'nowrap' }

const SelectStyle = { borderRadius: 0, height: '36px' }

const CheckboxStyle = { color: theme.color.textColor }

const MenuItemStyle = {
  '&:hover': {
    backgroundColor: `${theme.color.secondaryHover}`,
  },
  '&.Mui-selected': {
    backgroundColor: `${theme.color.secondaryHover}`,
  },
  '&.Mui-selected&:hover': {
    backgroundColor: `${theme.color.secondaryHover}`,
  },
}

const methodKeys = [
  'protocol_titles.fishbelt',
  'protocol_titles.benthicpit',
  'protocol_titles.benthiclit',
  'protocol_titles.benthicpqt',
  'protocol_titles.bleachingqc',
  'protocol_titles.habitatcomplexity',
  'protocol_titles.macroinvertebrate',
]

const MethodsFilterDropDown = ({
  handleMethodsColumnFilterChange,
  value = [],
  id = 'methods-filter-search',
  disabled = false,
}: MethodsFilterDropDownProps) => {
  const { t } = useTranslation()

  // Remove the following code when macroinvertebrate goes live
  const { currentUser } = useCurrentUser()
  const { enabled: isMacroinvertebrateEnabled = false } = getCurrentUserOptionalFeature(
    currentUser,
    'macroinvertebrate_enabled',
  )
  // Remove down to here

  const methods = isMacroinvertebrateEnabled
    ? methodKeys.map((key) => t(key))
    : // Remove false case when macroinvertebrate goes live
      methodKeys.filter((key) => key !== 'protocol_titles.macroinvertebrate').map((key) => t(key))

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    handleMethodsColumnFilterChange(event.target.value as string[])
  }

  // Dynamic FormStyle with background color applied to notchedOutline
  const dynamicFormStyle = {
    width: 230,
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '2px solid #264b7e',
      backgroundColor:
        value.length > 0 ? theme.color.getMessageColorBackground('warning') : 'transparent',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.color.border}`,
      backgroundColor:
        value.length > 0 ? theme.color.getMessageColorBackground('warning') : 'transparent',
      '& legend': {
        display: 'none',
      },
    },
    '& .MuiOutlinedInput-root': {
      fontFamily: 'Open Sans',
      fontSize: '1.6rem',
      color: theme.color.textColor,
      height: '30.5px',
    },
    '& .MuiFormLabel-root': {
      fontSize: '1.6rem',
      paddingBottom: '0.2em',
      color: `${theme.color.textColor} !important`,
      position: 'inherit',
      fontFamily: 'Open Sans',
      transition: 'none',
      transform: 'none',
    },
  }

  return (
    <div>
      <FormControl sx={dynamicFormStyle}>
        <InputLabel id="method-filer-label">{t('filters.method')}</InputLabel>
        <Select
          sx={SelectStyle}
          labelId="method-filter-multiple-checkbox-label"
          id={id}
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={t('filters.method')} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          disabled={disabled}
        >
          {methods.map((method) => (
            <MenuItem key={method} value={method} sx={MenuItemStyle}>
              <Checkbox style={CheckboxStyle} checked={value.indexOf(method) > -1} />
              <ListItemText primary={method} primaryTypographyProps={fontStyle} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default MethodsFilterDropDown
