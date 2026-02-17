import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { openExploreLinkWithBbox } from '../../library/openExploreLinkWithBbox'
import { BiggerIconGlobe } from '../icons'
import { MuiTooltip } from '../generic/MuiTooltip'
import { useTranslation } from 'react-i18next'
import styles from '../../style/ProjectName.module.scss'
import buttonStyles from '../../style/buttons.module.scss'
import labelStyles from '../../style/labels.module.scss'
import { driver } from 'driver.js'
import { buildProjectTourSteps } from '../../library/demoProjectTour'
import 'driver.js/dist/driver.css'

const ProjectName = () => {
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { t } = useTranslation()
  const [project, setProject] = useState({})

  // getProjectName
  useEffect(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getProject(projectId).then((projectResponse) => {
        if (isMounted.current) {
          setProject(projectResponse)
        }
      })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId])

  const isDemoProject = project?.is_demo

  const handleExploreButtonClick = () => {
    if (!project) {
      return
    }

    const queryParamObject = {
      project: project.name,
      bbox: project.bbox,
    }

    openExploreLinkWithBbox(queryParamObject)
  }

  const handleTourClose = (_element, _step, { _state, driver }) => {
    const isTourComplete = driver.isLastStep()
    const eventName = isTourComplete
      ? 'demo_tour_completed'
      : `demo_tour_close_step_${driver.getActiveIndex() + 1}`
    window.dataLayer?.push({
      event: eventName,
    })
    driver.destroy()
  }

  const handleStartTourClick = () => {
    const driverTourObj = driver({
      showProgress: true,
      nextBtnText: '→',
      prevBtnText: '←',
      progressText: t('projects.tour.tour_steps'), //driverJS auto passes current and total
      onPopoverRender: (popover) => {
        popover.arrow.remove()
      },
      steps: buildProjectTourSteps(t),
      onDestroyStarted: handleTourClose,
    })

    driverTourObj.drive()
  }

  const tooltipText = isDemoProject
    ? 'projects.demo.explore_unavailable'
    : 'go_to_explore_this_project'

  return (
    <div className={styles['project-name-wrapper']}>
      <h2 className={styles['project-name-header']}>{project?.name}</h2>
      {isAppOnline && (
        <MuiTooltip title={t(tooltipText)} placement="top" arrow>
          <span role="presentation">
            <button
              className={buttonStyles['button--icon']}
              type="button"
              aria-label={t(tooltipText)}
              onClick={handleExploreButtonClick}
              disabled={isDemoProject}
            >
              <BiggerIconGlobe />
            </button>
          </span>
        </MuiTooltip>
      )}
      {isDemoProject && (
        <div className={styles['project-meta-info-wrapper']}>
          <span className={labelStyles['pill--demo']}>{t('projects.demo.demo')}</span>
          <MuiTooltip title={t('projects.tour.show_tour')} placement="bottom" arrow>
            <span role="presentation">
              <button
                className={[buttonStyles['button--callout'], buttonStyles['button--small']].join(
                  ' ',
                )}
                type="button"
                id="gtm-demo-start-tour"
                aria-label={t('projects.demo.project_tour_start')}
                onClick={handleStartTourClick}
              >
                {t('projects.demo.project_tour_start')}
              </button>
            </span>
          </MuiTooltip>
        </div>
      )}
    </div>
  )
}

export default ProjectName
