import { getTodayDateOnly } from './formatDateTime'

export const getFileExportName = (project, tableName) => {
  if (!project) {
    return ''
  }

  const { name } = project

  const modifiedName = name.replace(/[ ,.]/g, '_') // Replace space or punctuations with underscores
  const today = getTodayDateOnly()

  return `${modifiedName}_${today}_${tableName}.csv`
}
