const FULL_ROUTE = window.location.href;

export const APP_NAME = process.env.REACT_APP_APPLICATION_NAME;

export const API_BASE_ROUTE = FULL_ROUTE.substring(0, FULL_ROUTE.indexOf('/apps/'.concat(APP_NAME).concat('/')));
export const SERVER_URL = FULL_ROUTE.substring(0, FULL_ROUTE.indexOf('/api/apps/'.concat(APP_NAME)));
export const ORGANISATION_UNITS_ROUTE = API_BASE_ROUTE.concat(
      '/organisationUnits.json?paging=false&fields=id,name,displayName,parent[id,displayName],level,path,organisationUnitGroups[id]'
);
export const ORGANISATION_UNITS_LEVELS_ROUTE = API_BASE_ROUTE.concat(
      '/organisationUnitLevels.json?paging=false&fields=id,name,displayName,level&order=level:asc'
);
export const ME_ROUTE = API_BASE_ROUTE.concat('/me.json?fields=id,displayName');
export const USERS_ROUTE = API_BASE_ROUTE.concat(
      '/users.json?fields=id,displayName,name,organisationUnits[id,path,name,displayName]&paging=false'
);
export const SYSTEM_INFOS_ROUTE = API_BASE_ROUTE.concat('/system/info.json');
export const DATA_STORE_ROUTE = API_BASE_ROUTE.concat('/dataStore');
export const PROGRAMS_ROUTE = API_BASE_ROUTE.concat(
      '/programs.json?paging=false&fields=id,name,displayName,programIndicators[id,displayName],programTrackedEntityAttributes[trackedEntityAttribute[id,displayName]]'
);
export const PROGRAMS_STAGE_ROUTE = API_BASE_ROUTE.concat(
      '/programStages.json?paging=false&fields=id,name,displayName'
);
export const INDICATORS_ROUTE = API_BASE_ROUTE.concat('/indicators.json?paging=false&fields=id,name,displayName');
export const DATA_ELEMENTS_ROUTE = API_BASE_ROUTE.concat('/dataElements.json?paging=false&fields=id,name,displayName');
export const INDICATORS_GROUP_ROUTE = API_BASE_ROUTE.concat(
      '/indicatorGroups.json?paging=false&fields=id,name,displayName,indicators[id,displayName]'
);
export const PROGRAM_INDICATOR_GROUPS = API_BASE_ROUTE.concat(
      '/programIndicatorGroups.json?paging=false&fields=id,name,displayName,programIndicators[id,displayName]'
);
export const ORGANISATION_UNIT_GROUP_SETS_ROUTE = API_BASE_ROUTE.concat(
      '/organisationUnitGroupSets.json?paging=false&fields=id,name,displayName,organisationUnitGroups[id,displayName]'
);
export const ORGANISATION_UNIT_GROUPS_ROUTE = API_BASE_ROUTE.concat(
      '/organisationUnitGroups.json?paging=false&fields=id,name,displayName'
);
export const TRACKED_ENTITY_ATTRIBUTES_ROUTE = API_BASE_ROUTE.concat('/trackedEntityAttributes');
export const TRACKED_ENTITY_INSTANCES_ROUTE = API_BASE_ROUTE.concat('/trackedEntityInstances');
export const ENROLLMENTS_ROUTE = API_BASE_ROUTE.concat('/enrollments');
export const EVENTS_ROUTE = API_BASE_ROUTE.concat('/events');
export const PROGS_ROUTE = API_BASE_ROUTE.concat('/programs');
export const ANALYTICS_ROUTE = API_BASE_ROUTE.concat('/analytics');
export const OPTION_SETS_ROUTE = API_BASE_ROUTE.concat('/optionSets');
export const DATA_ELEMENT_OPTION_SETS = API_BASE_ROUTE.concat('/dataElements');
export const ME_SETTINGS_ROUTE = API_BASE_ROUTE.concat('/userSettings.json');
export const DATA_ELEMENT_GROUPS_ROUTE = API_BASE_ROUTE.concat('/dataElementGroups.json');
export const USER_GROUPS_ROUTE = API_BASE_ROUTE.concat('/userGroups.json');
export const MAPS_ROUTE = API_BASE_ROUTE.concat('/maps.json');
export const VISUALIZATIONS_ROUTE = API_BASE_ROUTE.concat('/visualizations.json');
export const SINGLE_DATA_ELEMENT_ROUTE = API_BASE_ROUTE.concat('/dataElements');
export const SINGLE_DATA_SETS_ROUTE = API_BASE_ROUTE.concat('/dataSets');
export const SINGLE_INDICATOR_ROUTE = API_BASE_ROUTE.concat('/indicators');