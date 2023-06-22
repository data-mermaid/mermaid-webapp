/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
}

const methods = [
  'Fish Belt',
  'Benthic PIT',
  'Benthic LIT',
  'Benthic Photo Quadrat',
  'Bleaching',
  'Habitat Complexity',
]

const MethodsFilterDropDown = ({ handleMethodsColumnFilterChange, value, id, disabled }) => {
  console.log({ value })
  const [selectedMethods, setSelectedMethods] = React.useState(methods)

  const handleChange = (event) => {
    const eventValue = event.target.value

    handleMethodsColumnFilterChange(eventValue)
    setSelectedMethods(eventValue)
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 200, margin: 0 }}>
        <InputLabel id="method-filer-label">Filter Method</InputLabel>
        <Select
          sx={{ borderRadius: 0, height: '36px' }}
          labelId="method-filter-multiple-checkbox-label"
          id={id}
          multiple
          value={selectedMethods}
          onChange={(e) => handleChange(e)}
          input={<OutlinedInput label="Filter Method" />}
          renderValue={() => 'Select Items'}
          MenuProps={MenuProps}
          disabled={disabled}
        >
          {methods.map((method) => (
            <MenuItem key={method} value={method}>
              <Checkbox checked={selectedMethods.indexOf(method) > -1} />
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
  value: methods,
  disabled: false,
}

MethodsFilterDropDown.propTypes = {
  handleMethodsColumnFilterChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
}

export default MethodsFilterDropDown
