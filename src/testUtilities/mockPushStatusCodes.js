export const mock400StatusCodeForAllDataTypesPush = {
  benthic_attributes: [
    {
      status_code: 400,
      data: { name: 'an error message from api', other: 'another error message from api' },
    },
  ],
  collect_records: [
    {
      status_code: 400,
      data: { name: 'an error message from api', other: 'another error message from api' },
    },
  ],
  fish_species: [
    {
      status_code: 400,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
  project_managements: [
    {
      status_code: 400,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
  project_profiles: [
    {
      status_code: 400,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
  project_sites: [
    {
      status_code: 400,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
  projects: [
    {
      status_code: 400,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
}

export const mock500StatusCodeForAllDataTypesPush = {
  benthic_attributes: [
    {
      status_code: 500,
      data: { name: 'an error message from api', other: 'another error message from api' },
    },
  ],
  collect_records: [
    {
      status_code: 500,
      data: { name: 'an error message from api', other: 'another error message from api' },
    },
  ],
  fish_species: [
    {
      status_code: 500,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
  project_managements: [
    {
      status_code: 500,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
  project_profiles: [
    {
      status_code: 500,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
  project_sites: [
    {
      status_code: 500,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
  projects: [
    {
      status_code: 500,
      data: {
        name: 'an error message from api',
        other: 'another error message from api',
      },
    },
  ],
}

export const mockUserDoesntHavePushSyncPermissionForProjects = {
  benthic_attributes: [
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '5',
        project_name: 'Project 5',
      },
    },
  ],
  collect_records: [
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '5',
        project_name: 'Project 5',
      },
    },
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '900',
        project_name: 'Project 900',
      },
    },
  ],
  fish_species: [
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '5',
        project_name: 'Project 5',
      },
    },
  ],
  project_managements: [
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '5',
        project_name: 'Project 5',
      },
    },
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '500',
        project_name: 'Project 500',
      },
    },
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '900',
        project_name: 'Project 900',
      },
    },
  ],
  project_profiles: [
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '5',
        project_name: 'Project 5',
      },
    },
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '900',
        project_name: 'Project 900',
      },
    },
  ],
  project_sites: [
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '500',
        project_name: 'Project 500',
      },
    },
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '5',
        project_name: 'Dev Team Test ProjectMy project 2',
      },
    },
  ],
  projects: [
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '5',
        project_name: 'Project 5',
      },
    },
    {
      status_code: 403,
      message: 'You do not have permission to perform this action.',
      data: {
        project_id: '900',
        project_name: 'Project 900',
      },
    },
  ],
}
