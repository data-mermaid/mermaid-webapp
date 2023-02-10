import moment from 'moment'

export const getFileExportName = (project, tableName) => {
  const { name, created_on } = project

  const modifiedName = name.replace(/[ ,.]/g, '_') // Replace space or punctuations with underscores
  const momentDateString = moment(created_on).format('YYYY-MM-DD')

  return `${modifiedName}-${momentDateString}_${tableName}.csv`
}
