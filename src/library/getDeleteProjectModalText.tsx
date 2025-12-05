import { t } from 'i18next'

export interface DeleteProjectModalText {
  title: string
  prompt: string
  yes: string
  no: string
  hasSampleUnits: string
  hasOtherUsers: string
  confirmDeleteText1: string
  confirmDeleteText2: string
}

export const getDeleteProjectModalText = (projectName?: string): DeleteProjectModalText => {
  const fallbackProjectName = t('projects.project')
  const name = projectName || fallbackProjectName

  return {
    title: t('delete_project_modal.title'),
    prompt: t('delete_project_modal.prompt', { projectName: name }),
    yes: t('delete_project_modal.yes', { projectName: name }),
    no: t('buttons.cancel'),
    hasSampleUnits: t('delete_project_modal.has_sample_units'),
    hasOtherUsers: t('delete_project_modal.has_other_users'),
    confirmDeleteText1: t('delete_project_modal.cannot_delete', { projectName: name }),
    confirmDeleteText2: t('delete_project_modal.remove_before_delete', { projectName: name }),
  }
}
