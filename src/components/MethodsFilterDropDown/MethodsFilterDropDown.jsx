import React from 'react'
import PropTypes, { string } from 'prop-types'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { useTranslation } from 'react-i18next'
import theme from '../../theme'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 230,
      color: theme.color.textColor,
    },
  },
}

const fontStyle = { fontFamily: 'Open Sans', fontSize: '1.6rem' }

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
]

const MethodsFilterDropDown = ({
  handleMethodsColumnFilterChange,
  value = [],
  id = 'methods-filter-search',
  disabled = false,
}) => {
  const { t } = useTranslation()
  const methods = methodKeys.map((key) => t(key))

  const handleChange = (event) => {
    const eventValue = event.target.value
    handleMethodsColumnFilterChange(eventValue)
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
        <InputLabel id="method-filer-label">{t('filter_method')}</InputLabel>
        <Select
          sx={SelectStyle}
          labelId="method-filter-multiple-checkbox-label"
          id={id}
          multiple
          value={value}
          onChange={(e) => handleChange(e)}
          input={<OutlinedInput label={t('filter_method')} />}
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

MethodsFilterDropDown.propTypes = {
  handleMethodsColumnFilterChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  value: PropTypes.arrayOf(string),
  disabled: PropTypes.bool,
}

export default MethodsFilterDropDown
