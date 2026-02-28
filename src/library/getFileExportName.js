import { format } from 'date-fns'

export const getFileExportName = (project, tableName) => {
  if (!project) {
    return ''
  }

  const { name } = project

  const modifiedName = name.replace(/[ ,.]/g, '_') // Replace space or punctuations with underscores
  const momentToday = format(new Date(), 'yyyy-MM-dd')

  return `${modifiedName}_${momentToday}_${tableName}.csv`
}
