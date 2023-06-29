import translate from "./translator"

export const MAP_BOX_API_KEY = 'dRq6SAPnk2nypi0O4fEY'

export const PAGE_DASHBOARD = 'PAGE_DASHBOARD'
export const PAGE_SETTINGS = 'PAGE_SETTINGS'
export const PAGE_PAYMENT = 'PAGE_PAYMENT'
export const PAGE_SUPERVISIONS = 'PAGE_SUPERVISIONS'

export const PAGE_CONFIGURATION_TYPE_SUPERVISIONS = 'PAGE_CONFIGURATION_TYPE_SUPERVISIONS'
export const PAGE_CONFIGURATION_USER_AUTHORIZATIONS = 'PAGE_CONFIGURATION_USER_AUTHORIZATIONS'
export const PAGPE_CONFIGURATION_INDICATEURS = 'PAGPE_CONFIGURATION_INDICATEURS'

export const PAGE_CONFIG_SUPERVISION = 'PAGE_CONFIG_SUPERVISION'
export const PAGE_CONFIG_INDICATORS = 'PAGE_CONFIG_INDICATORS'
export const PAGE_CONFIG_ANALYSE = 'PAGE_CONFIG_ANALYSE'

export const PLANIFICATION_PAR_MOI = 'PLANIFICATION_PAR_MOI'
export const PLANIFICATION_PAR_TOUS = 'PLANIFICATION_PAR_TOUS'
export const PLANIFICATION_PAR_UN_USER = 'PLANIFICATION_PAR_UN_USER'

export const PROGRAM_INDICATOR = "PROGRAM_INDICATOR"
export const INDICATOR_GROUP = 'INDICATOR_GROUP'
export const AGGREGATE_INDICATOR = 'AGGREGATE_INDICATOR'
export const ORGANISATION_UNIT = 'ORGANISATION_UNIT'
export const INDICATOR = 'INDICATOR'
export const DESCENDANTS = 'DESCENDANTS'
export const AGENT = 'AGENT'

export const NOTIFICATON_CRITICAL = 'NOTIFICATON_CRITICAL'
export const NOTIFICATON_SUCCESS = 'NOTIFICATON_SUCCESS'

export const TYPE_GENERATION_AS_TEI = 'TEI'
export const TYPE_GENERATION_AS_ENROLMENT = 'ENROLLMENT'
export const TYPE_GENERATION_AS_EVENT = 'EVENT'

export const TYPE_ANALYSE_INDICATOR = 'INDICATOR'
export const TYPE_ANALYSE_DATA_ELEMENT = 'DATA_ELEMENT'

export const TYPE_SUPERVISION_AGENT = 'AGENT'
export const TYPE_SUPERVISION_ORGANISATION_UNIT = 'ORGANISATION_UNIT'

export const NOTICE_BOX_WARNING = 'warning'
export const NOTICE_BOX_VALID = 'valid'
export const NOTICE_BOX_ERROR = 'error'
export const NOTICE_BOX_DEFAULT = 'default'

export const DAY = 'Day'
export const WEEK = 'Week'
export const MONTH = 'Month'
export const QUARTER = 'Quarter'
export const YEAR = 'Year'

export const CANCELED = { name: translate('Annuler'), value: 'CANCELED' }
export const PENDING_VALIDATION = { name: translate('En_Attente'), value: 'PENDING_VALIDATION' }
export const PENDING_PAYMENT = { name: 'En Attente de Paiement', value: 'PENDING_PAYMENT' }
export const PAYMENT_DONE = { name: 'Paiement Effectué', value: 'PAYMENT_DONE' }
export const COMPLETED = { name: translate('Terminer'), value: 'COMPLETED' }
export const SCHEDULED = { name: translate('Planifier'), value: 'SCHEDULED' }
export const NA = { name: 'Non Applicable', value: 'NA' }

export const SUPERVISOR_RAPPORT = 'SUPERVISOR_RAPPORT'
export const ASC_GF_RAPPORT = 'ASC_GF_RAPPORT'