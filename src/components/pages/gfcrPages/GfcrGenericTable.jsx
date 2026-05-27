import React from 'react'
import PropTypes from 'prop-types'
import { DataGrid } from '@mui/x-data-grid'

const GfcrGenericTable = ({ rows, columns, ...dataGridProps }) => (
  <div style={{ height: 'calc(100vh - 300px)', width: 'calc(100vw - 450px)' }}>
    <DataGrid
      rows={rows}
      columns={columns}
      disableColumnMenu
      columnHeaderHeight={56}
      sx={{
        height: '100%',
        border: 0,
        fontSize: '1.6rem',
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          lineHeight: 1.3,
          fontSize: 'inherit',
        },
        '& .MuiDataGrid-cell': {
          fontSize: 'inherit',
        },
      }}
      {...dataGridProps}
    />
  </div>
)

GfcrGenericTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
}

export default GfcrGenericTable
