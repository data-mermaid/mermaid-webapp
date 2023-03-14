class MermaidSyncError extends Error {
  constructor({ message, projectNamesThatHaveSyncErrors }) {
    super(message)
    this.name = 'MermaidSyncError'
    this.projectNamesThatHaveSyncErrors = projectNamesThatHaveSyncErrors
  }
}

export { MermaidSyncError }
// prob remove
