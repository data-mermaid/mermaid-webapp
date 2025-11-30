import { t } from 'i18next'

export interface DeleteModalText {
  title: string
  prompt: string
  yes: string
  no: string
  confirmDeleteText1: string
  confirmDeleteText2: string
}

export const getDeleteModalText = (entityName: string): DeleteModalText => {
  const lowercaseEntityName = entityName.toLowerCase()

  return {
    title: t('delete_modal.title', { entityName }),
    prompt: t('delete_modal.prompt', { entityName: lowercaseEntityName }),
    yes: t('delete_modal.yes', { entityName }),
    no: t('buttons.cancel'),
    confirmDeleteText1: t('delete_modal.cannot_delete', { entityName: lowercaseEntityName }),
    confirmDeleteText2: t('delete_modal.remove_before_delete', {
      entityName: lowercaseEntityName,
    }),
  }
}
