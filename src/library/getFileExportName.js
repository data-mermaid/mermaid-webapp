import moment from 'moment'

export const getFileExportName = (project, tableName) => {
  if (!project) {
    return ''
  }

  const { name } = project

  const modifiedName = name.replace(/[ ,.]/g, '_') // Replace space or punctuations with underscores
  const momentToday = moment().format('YYYY-MM-DD')

  return `${modifiedName}_${momentToday}_${tableName}.csv`
}
