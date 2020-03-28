const FULL_ROUTE = window.location.href;

export const API_BASE_ROUTE = FULL_ROUTE.substring(0, FULL_ROUTE.indexOf('/apps/Supervision/'));

export const AGGREGATED_INDICATORS_ROUTE = '/indicatorGroups.json?paging=false&fields=id,displayName,indicators[:all]';

export const PROGRAMS_ROUTE = '/programs.json?paging=false';

export const PROGRAM_INDICATORS_BY_PROGRAM_ROUTE = '.json?fields=id,name,programIndicators[:all]';

export const ORGANISATION_UNITS_ROUTE = API_BASE_ROUTE.concat('/organisationUnits.json?paging=false&fields=id,name,displayName,parent');

export const SUPERVISORS_ROUTE = API_BASE_ROUTE.concat('/users.json?paging=false');

export const ME_ROUTE = API_BASE_ROUTE.concat('/me.json?fields=id,displayName')

export const INDICATORS_ROUTE = API_BASE_ROUTE.concat('/dataStore/SupervisionHWCA/indicators');

export const GLOBAL_SETTINGS_ROUTE = API_BASE_ROUTE.concat('/dataStore/SupervisionHWCA/global_settings');

export const SUPERVISIONS_ROUTE = API_BASE_ROUTE.concat('/dataStore/SupervisionHWCA/supervisions');