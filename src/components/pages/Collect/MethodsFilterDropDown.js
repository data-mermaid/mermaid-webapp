/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import PropTypes, { string } from 'prop-types'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import theme from '../../../theme'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
      color: theme.color.textColor,
    },
  },
}

const FormStyle = {
  m: 1,
  width: 200,
  margin: 0,
}

const SelectStyle = { borderRadius: 0, height: '36px' }

const CheckboxStyle = { color: theme.color.textColor }

const methods = [
  'Fish Belt',
  'Benthic PIT',
  'Benthic LIT',
  'Benthic Photo Quadrat',
  'Bleaching',
  'Habitat Complexity',
]

const MethodsFilterDropDown = ({ handleMethodsColumnFilterChange, value, id, disabled }) => {
  const handleChange = (event) => {
    const eventValue = event.target.value

    handleMethodsColumnFilterChange(eventValue)
  }

  return (
    <div>
      <FormControl sx={FormStyle}>
        <InputLabel id="method-filer-label">Filter Method</InputLabel>
        <Select
          sx={SelectStyle}
          labelId="method-filter-multiple-checkbox-label"
          id={id}
          multiple
          value={value}
          onChange={(e) => handleChange(e)}
          input={<OutlinedInput label="Filter Method" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          disabled={disabled}
        >
          {methods.map((method) => (
            <MenuItem key={method} value={method}>
              <Checkbox style={CheckboxStyle} checked={value.indexOf(method) > -1} />
              <ListItemText primary={method} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

MethodsFilterDropDown.defaultProps = {
  id: 'methods-filter-search',
  disabled: false,
  value: [],
}

MethodsFilterDropDown.propTypes = {
  handleMethodsColumnFilterChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  value: PropTypes.arrayOf(string),
  disabled: PropTypes.bool,
}

export default MethodsFilterDropDown