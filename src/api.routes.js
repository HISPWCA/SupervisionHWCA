const FULL_ROUTE = window.location.href

export const API_BASE_ROUTE = FULL_ROUTE.substring(0, FULL_ROUTE.indexOf('/apps/Supervision/'))

export const AGGREGATED_INDICATORS_ROUTE = '/indicatorGroups.json?paging=false&fields=id,displayName,indicators[:all]'

export const PROGRAMS_ROUTE = '/programs.json?paging=false&fields=id,displayName,programStages,categoryCombo,programTrackedEntityAttributes,trackedEntityType[id,displayName]'

export const PROGRAM_INDICATORS_BY_PROGRAM_ROUTE = '.json?fields=id,name,displayName,programIndicators[:all]'

export const ORGANISATION_UNITS_ROUTE = API_BASE_ROUTE.concat('/organisationUnits.json?paging=false&fields=id,name,displayName,parent')

export const SUPERVISORS_ROUTE = API_BASE_ROUTE.concat('/users.json?paging=false')

export const ME_ROUTE = API_BASE_ROUTE.concat('/me.json?fields=id,displayName,userGroups,settings')

export const INDICATORS_ROUTE = API_BASE_ROUTE.concat('/dataStore/SupervisionHWCA/indicators')

export const SETTINGS_ROUTE = API_BASE_ROUTE.concat('/dataStore/SupervisionHWCA/settings')

export const GLOBAL_SETTINGS_ROUTE = API_BASE_ROUTE.concat('/dataStore/SupervisionHWCA/global_settings')

export const SUPERVISIONS_ROUTE = API_BASE_ROUTE.concat('/dataStore/SupervisionHWCA/supervisions')

export const TRACKER_PROGRAMS_ROUTE = API_BASE_ROUTE.concat('/programs.json?paging=false&filter=programType:eq:WITH_REGISTRATION&fields=id,displayName,programStages,categoryCombo,programTrackedEntityAttributes,trackedEntityType[id,displayName]')

export const ORGANISATION_UNIT_GROUP_ROUTE = API_BASE_ROUTE.concat('/organisationUnitGroups.json?paging=false')

export const ORGANISATION_UNIT_GROUP_SET_ROUTE = API_BASE_ROUTE.concat('/organisationUnitGroupSets.json?paging=false&fields=id,displayName,organisationUnitGroups')

export const PERIOD_TYPE_ROUTE = API_BASE_ROUTE.concat('/periodTypes.json?paging=false')

export const ANALYTICS_ROUTE = API_BASE_ROUTE.concat('/analytics.json?dimension=dx:')

export const USER_GROUPS_ROUTE = API_BASE_ROUTE.concat('/userGroups.json?paging=false&fields=id,displayName,users[id,displayName]')

export const TRACKED_ENTITY_ATTRIBUTES_ROUTE = API_BASE_ROUTE.concat('/trackedEntityAttributes/')

export const TRACKED_ENTITY_INSTANCES_ROUTE = API_BASE_ROUTE.concat('/trackedEntityInstances')

export const ENROLLMENTS_ROUTE = API_BASE_ROUTE.concat('/enrollments')

export const EVENTS_ROUTE = API_BASE_ROUTE.concat('/events')

export const PROGRAM_TESTS_ROUTE = API_BASE_ROUTE.concat('/programs-tests.json?paging=false')
