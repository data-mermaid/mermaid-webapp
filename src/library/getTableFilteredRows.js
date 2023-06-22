const getTableRowValuesToFilter = (allowedKeys, row) => {
  return allowedKeys.map((allowedKey) => {
    // Get the matching values using allowed keys' dot-notation
    return allowedKey.split('.').reduce((prev, curr) => {
      return (prev && prev[curr]) || false
    }, row)
  })
}

/**
 * Get filtered table rows. Will filter with "OR" logic (i.e. any row which matches one or more query term).
 * Can be used to obtain rows to return for react-table's globalFilter callback property.
 * @param {Array<Row>} rows Array of rows to filter.
 * @param {Array<string>} keys Array of keys to filter against in the row data. Use dot-notation e.g.'values.method.props.children' or 'values.site'
 * @param {Array<RegExp>} queryTerms An array of regular expressions to filter the row data with.
 * @returns {Array<Row>} Array of rows where one or more key matches the query terms.
 */
export const getTableFilteredRows = (rows, keys, queryTerms) => {
  return rows.filter((row) => {
    const relevantValues = getTableRowValuesToFilter(keys, row)

    return relevantValues.some((value) => {
      return queryTerms.some((term) => term.test(value))
    })
  })
}
