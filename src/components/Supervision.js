import React, { useMemo, useEffect, useState } from 'react'
import { MantineReactTable } from 'mantine-react-table'
import { Card, Col, DatePicker, Divider, FloatButton, Input, InputNumber, List, Popconfirm, Row, Select, Checkbox as AntCheckbox, Table, Grid, message } from 'antd'
import { IoMdAdd } from 'react-icons/io'
import { IoListCircleOutline } from 'react-icons/io5'
import { Button, ButtonStrip, Checkbox, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle, NoticeBox, Radio } from '@dhis2/ui'
import {
    AGENT,
    CANCELED,
    COMPLETED,
    DAY,
    DESCENDANTS,
    INDICATOR,
    MONTH,
    NA,
    NOTICE_BOX_DEFAULT,
    NOTICE_BOX_WARNING,
    NOTIFICATON_CRITICAL,
    NOTIFICATON_SUCCESS,
    ORGANISATION_UNIT,
    PAYMENT_DONE,
    PENDING_PAYMENT,
    PENDING_VALIDATION,
    QUARTER,
    SCHEDULED,
    TYPE_GENERATION_AS_ENROLMENT,
    TYPE_GENERATION_AS_EVENT,
    TYPE_GENERATION_AS_TEI,
    TYPE_SUPERVISION_AGENT,
    TYPE_SUPERVISION_ORGANISATION_UNIT,
    WEEK,
    YEAR
} from '../utils/constants'
import { loadDataStore, saveDataToDataStore } from '../utils/functions'
import { MyNoticeBox } from './MyNoticeBox'
import { ANALYTICS_ROUTE, API_BASE_ROUTE, ENROLLMENTS_ROUTE, EVENTS_ROUTE, ORGANISATION_UNITS_ROUTE, ORGANISATION_UNIT_GROUPS_ROUTE, ORGANISATION_UNIT_GROUP_SETS_ROUTE, PROGRAMS_STAGE_ROUTE, PROGRAM_INDICATOR_GROUPS, PROGS_ROUTE, SERVER_URL, TRACKED_ENTITY_ATTRIBUTES_ROUTE, TRACKED_ENTITY_INSTANCES_ROUTE, USERS_ROUTE } from '../utils/api.routes'
import axios from 'axios'
import OrganisationUnitsTree from './OrganisationUnitsTree'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { RiDeleteBinLine } from 'react-icons/ri'
import MyNotification from './MyNotification'
import { v1 as uuid } from 'uuid'
import { BsArrowRight } from 'react-icons/bs'
import { BsArrowLeft } from 'react-icons/bs'
import { Stepper } from 'react-form-stepper'
import { FiSave } from 'react-icons/fi'
import { ImCancelCircle } from 'react-icons/im'
import { CgCloseO } from 'react-icons/cg'
import { TbSelect } from 'react-icons/tb'
import { DataDimension } from '@dhis2/analytics'
import { IoMdOpen } from 'react-icons/io'


import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { BLUE, GRAY_DARK, GREEN, ORANGE, RED, WHITE } from '../utils/couleurs'
import { getDefaultStatusPaymentIfStatusIsNull, getDefaultStatusSupervisionIfStatusIsNull } from './Dashboard'
import translate from '../utils/translator'
const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekOfYear = require('dayjs/plugin/weekOfYear')

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(customParseFormat)


const Supervision = ({ me }) => {

    const [dataStoreSupervisionConfigs, setDataStoreSupervisionConfigs] = useState([])
    const [dataStoreSupervisions, setDataStoreSupervisions] = useState([])
    const [dataStoreIndicatorConfigs, setDataStoreIndicatorConfigs] = useState([])
    const [isEditionMode, setEditionMode] = useState(false)
    const [noticeBox, setNoticeBox] = useState({ show: false, message: null, title: null, type: NOTICE_BOX_DEFAULT })
    const [notification, setNotification] = useState({ show: false, message: null, type: null })
    const [organisationUnits, setOrganisationUnits] = useState([])
    const [users, setUsers] = useState([])
    const [organisationUnitGroupSets, setOrganisationUnitGroupSets] = useState([])
    const [programStages, setProgramStages] = useState([])
    const [isNewMappingMode, setIsNewMappingMode] = useState(false)
    const [mappingConfigs, setMappingConfigs] = useState([])
    const [visibleAnalyticComponentModal, setVisibleAnalyticComponentModal] = useState(false)
    const [analyticIndicatorResults, setAnalyticIndicatorResults] = useState([])
    const [analyticErrorMessage, setAnalyticErrorMessage] = useState(null)
    const [teisList, setTeisList] = useState([])
    const [isEmpty, setEmpty] = useState(false)
    const [allSupervisionsFromTracker, setAllSupervisionsFromTracker] = useState([])
    const [organisationUnitGroups, setOrganisationUnitGroups] = useState([])
    const [teisPerformanceList, setTeisPerformanceList] = useState([])

    const [selectedStep, setSelectedStep] = useState(0)
    const [selectedSupervisionType, setSelectedSupervisionType] = useState(null)
    const [selectedProgram, setSelectedProgram] = useState(null)
    const [selectedPlanificationType, setSelectedPlanificationType] = useState(null)
    const [selectedOrganisationUnits, setSelectedOrganisationUnits] = useState([])
    const [selectedIndicators, setSelectedIndicators] = useState([])
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [selectedOrganisationUnitGroupSet, setSelectedOrganisationUnitGroupSet] = useState(null)
    const [selectedOrganisationUnitGroup, setSelectedOrganisationUnitGroup] = useState(null)
    const [selectedPeriodType, setSelectedPeriodType] = useState(null)
    const [selectedProgramStage, setSelectedProgramStage] = useState(null)
    const [selectedDataElement, setSelectedDataElement] = useState(null)
    const [selectedMetaDatas, setSelectedMetaDatas] = useState([])
    const [selectedOrganisationUnitInd, setSelectedOrganisationUnitInd] = useState(null)
    const [selectedAgents, setSelectedAgents] = useState([])
    const [selectedSupervisionsConfigProgram, setSelectedSupervisionConfigProgram] = useState(null)
    const [selectedOrgUnitSupervisionFromTracker, setSelectedOrgUnitSupervisionFromTracker] = useState(null)
    const [selectedPeriodSupervisionConfig, setSelectedPeriodSupervisionConfig] = useState(null)
    const [selectedOrganisationUnitGroups, setSelectedOrganisationUnitGroups] = useState([])

    const [inputMeilleur, setInputMeilleur] = useState(0)
    const [inputMauvais, setInputMauvais] = useState(0)
    const [inputMeilleurPositif, setInputMeilleurPositif] = useState(true)
    const [inputFields, setInputFields] = useState([])
    const [inputDataSourceDisplayName, setInputDataSourceDisplayName] = useState('')
    const [inputDataSourceID, setInputDataSourceID] = useState(null)

    const [loadingDataStoreSupervisionConfigs, setLoadingDataStoreSupervisionConfigs] = useState(false)
    const [loadingDataStoreSupervisions, setLoadingDataStoreSupervisions] = useState(false)
    const [loadingDataStoreIndicatorConfigs, setLoadingDataStoreIndicatorConfigs] = useState(false)
    const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false)
    const [loadingOrganisationUnitGroupSets, setLoadingOrganisationUnitGroupSets] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [loadingProgramStages, setLoadingProgramStages] = useState(false)
    const [loadingSaveDateElementMappingConfig, setLoadingSaveDateElementMappingConfig] = useState(false)
    const [loadingSupervisionPlanification, setLoadingSupervisionPlanification] = useState(false)
    const [loadingAnalyticIndicatorResults, setLoadingAnalyticIndicatorResults] = useState(false)
    const [loadingTeiList, setLoadingTeiList] = useState(false)
    const [loadingAllSupervisionsFromTracker, setLoadingAllSupervisionsFromTracker] = useState(false)
    const [loadingOrgUnitsSupervisionsFromTracker, setLoadingOrgUnitsSupervisionsFromTracker] = useState(false)
    const [loadingOrganisationUnitGroups, setLoadingOrganisationUnitGroups] = useState(false)

    const periodTypesOptions = () => {
        return [
            {
                value: DAY,
                label: DAY
            },
            {
                value: WEEK,
                label: WEEK
            },
            {
                value: MONTH,
                label: MONTH
            },
            {
                value: QUARTER,
                label: QUARTER
            },
            {
                value: YEAR,
                label: YEAR
            },
        ]
    }

    const columns = () => {

        return selectedSupervisionsConfigProgram?.planificationType === ORGANISATION_UNIT ? [
            {
                accessorKey: 'libelle', //access nested data with dot notation
                header: `${translate('Unite_Organisation')}`,
            },
            {
                accessorKey: 'period',
                header: `${translate('Periode')}`,
                Cell: ({ cell, row }) => {
                    return (
                        <>
                            <span>
                                {dayjs(cell.getValue()).format('YYYY-MM-DD')}
                            </span>
                        </>
                    )
                }
            },

            {
                accessorKey: 'statusSupervision', //normal accessorKey
                header: `${translate('Status_Supervision')}`,
                Cell: ({ cell, row }) => {
                    return (
                        <>
                            <span title={getStatusNameAndColor(cell.getValue())?.name} style={{ fontWeight: 'bold', textAlign: 'center', background: getStatusNameAndColor(cell.getValue())?.color?.background, color: getStatusNameAndColor(cell.getValue())?.color?.text, padding: '4px', fontSize: '12px', borderRadius: '5px' }}>
                                {getStatusNameAndColor(cell.getValue())?.name}
                            </span>
                        </>
                    )
                }
            },
            {
                header: `${translate('Actions')}`,
                width: 100,
                Cell: ({ cell, row }) => {
                    return (
                        <div style={{ textAlign: 'center', }}>
                            <a
                                target='_blank'
                                href={`${SERVER_URL}/dhis-web-tracker-capture/index.html#/dashboard?tei=${row.original.trackedEntityInstance}&program=${row.original.program}&ou=${row.original.orgUnit}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <IoMdOpen title={translate('Ouvrir_Dans_Le_Tracker')} style={{ fontSize: '18px', color: BLUE, cursor: 'pointer' }} />
                            </a>
                        </div>
                    )
                }
            },
        ] :
            [
                {
                    accessorKey: 'agent', //access nested data with dot notation
                    header: `${translate('Agent')}`,
                },
                {
                    accessorKey: 'libelle', //access nested data with dot notation
                    header: `${translate('Unite_Organisation')}`,
                },
                {
                    accessorKey: 'period',
                    header: `${translate('Periode')}`,
                    Cell: ({ cell, row }) => {
                        return (
                            <>
                                <span>
                                    {dayjs(cell.getValue()).format('YYYY-MM-DD')}
                                </span>
                            </>
                        )
                    }
                },
                {
                    accessorKey: 'statusSupervision', //normal accessorKey
                    header: `${translate('Status_Supervision')}`,
                    Cell: ({ cell, row }) => {
                        return (
                            <>
                                <span title={getStatusNameAndColor(cell.getValue())?.name} style={{ fontWeight: 'bold', textAlign: 'center', background: getStatusNameAndColor(cell.getValue())?.color?.background, color: getStatusNameAndColor(cell.getValue())?.color?.text, padding: '4px', fontSize: '12px', borderRadius: '5px' }}>
                                    {getStatusNameAndColor(cell.getValue())?.name}
                                </span>
                            </>
                        )
                    }
                },
                {
                    accessorKey: 'statusPayment',
                    header: `${translate('Status_Paiement')}`,
                    Cell: ({ cell, row }) => {
                        return (
                            <>
                                <span title={getStatusNameAndColorForPayment(cell.getValue())?.name} style={{ fontWeight: 'bold', textAlign: 'center', background: getStatusNameAndColorForPayment(cell.getValue())?.color?.background, color: getStatusNameAndColorForPayment(cell.getValue())?.color?.text, padding: '4px', fontSize: '12px', borderRadius: '5px' }}>
                                    {getStatusNameAndColorForPayment(cell.getValue())?.name}
                                </span>
                            </>
                        )
                    }
                },
                {
                    accessorKey: 'montant',
                    header: `${translate('Montants')}`,
                },
                {
                    header: `${translate('Actions')}`,
                    width: 100,
                    Cell: ({ cell, row }) => {
                        return (
                            <div style={{ textAlign: 'center', }}>
                                <a
                                    target='_blank'
                                    href={`${SERVER_URL}/dhis-web-tracker-capture/index.html#/dashboard?tei=${row.original.trackedEntityInstance}&program=${row.original.program}&ou=${row.original.orgUnit}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <IoMdOpen title={translate('Ouvrir_Dans_Le_Tracker')} style={{ fontSize: '18px', color: BLUE, cursor: 'pointer' }} />
                                </a>
                            </div>
                        )
                    }
                },
            ]
    }

    const loadOrganisationUnits = async () => {
        try {
            if (!me)
                throw new Error(translate('Erreur_Recuperation_Me'))

            setLoadingOrganisationUnits(true)
            setLoadingDataStoreSupervisionConfigs(true)

            const userOrganisationUnitId = me.organisationUnits?.length > 0 && me.organisationUnits?.[0].id

            if (userOrganisationUnitId) {
                const response = await axios.get(ORGANISATION_UNITS_ROUTE)
                loadDataStoreSupervisionConfigs(response.data.organisationUnits)
                setOrganisationUnits(response.data?.organisationUnits)
                setLoadingOrganisationUnits(false)
            }
        }
        catch (err) {
            setLoadingOrganisationUnits(false)
        }
    }

    const loadOrganisationUnitGroups = async () => {
        try {
            setLoadingOrganisationUnitGroups(true)

            const response = await axios.get(ORGANISATION_UNIT_GROUPS_ROUTE)
            setOrganisationUnitGroups(response.data.organisationUnitGroups)
            setLoadingOrganisationUnitGroups(false)
        }
        catch (err) {
            setLoadingOrganisationUnitGroups(false)
        }
    }

    const loadTeisPlanifications = async (program_id, orgUnit_id, ouMode = DESCENDANTS) => {
        try {
            setLoadingAllSupervisionsFromTracker(true)
            const response = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}.json?program=${program_id}&ou=${orgUnit_id}&ouMode=${ouMode}&order=created:DESC&fields=trackedEntityInstance,created,program,orgUnit,enrollments[*],attributes`)
            setAllSupervisionsFromTracker(response.data.trackedEntityInstances)
            setLoadingAllSupervisionsFromTracker(false)
        } catch (err) {
            setLoadingAllSupervisionsFromTracker(false)
            throw err
        }
    }

    const loadAllSupervisionsFromTracker = async (dataStoreprogramList, orgUnitList) => {
        try {
            setLoadingAllSupervisionsFromTracker(true)
            if (dataStoreprogramList.length > 0) {
                const currentProgram = dataStoreprogramList[0]
                const currentOrgUnit = orgUnitList.find(ou => ou.id === me?.organisationUnits?.[0]?.id)

                if (currentProgram) {
                    setSelectedSupervisionConfigProgram(currentProgram)
                    setSelectedPeriodSupervisionConfig(dayjs())
                    setSelectedOrgUnitSupervisionFromTracker(currentOrgUnit)
                    await loadTeisPlanifications(currentProgram.program.id, currentOrgUnit?.id, DESCENDANTS)
                }
            }

            setLoadingAllSupervisionsFromTracker(false)
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
            setLoadingAllSupervisionsFromTracker(false)
        }
    }

    const loadProgramStages = async (programID) => {
        try {
            setLoadingProgramStages(true)

            let route = `${PROGRAMS_STAGE_ROUTE},program,programStageDataElements[dataElement[id,displayName]]`
            if (programID)
                route = `${route}&filter=program.id:eq:${programID}`

            const response = await axios.get(route)

            setProgramStages(response.data.programStages)
            setLoadingProgramStages(false)
        } catch (err) {
            setLoadingProgramStages(false)
        }
    }

    const loadUsers = async (userOrgUnitId) => {
        try {
            if (userOrgUnitId) {
                setLoadingUsers(true)

                const route = `${USERS_ROUTE}&filter=organisationUnits.path:like:${userOrgUnitId}`
                const response = await axios.get(route)

                setUsers(response.data.users)
                setLoadingUsers(false)
            }
        }
        catch (err) {
            setLoadingUsers(false)
        }
    }

    const loadOrganisationUnitsGroupSets = async () => {
        try {
            setLoadingOrganisationUnitGroupSets(true)
            const response = await axios.get(ORGANISATION_UNIT_GROUP_SETS_ROUTE)
            setOrganisationUnitGroupSets(response.data.organisationUnitGroupSets)
            setLoadingOrganisationUnitGroupSets(false)
        }
        catch (err) {
            setLoadingOrganisationUnitGroupSets(false)
        }
    }

    const loadDataStoreSupervisionConfigs = async (organisationUnitList) => {
        try {
            setLoadingDataStoreSupervisionConfigs(true)
            const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, null)
            if (!response || response.length === 0) {
                setLoadingDataStoreSupervisionConfigs(false)
                return setNoticeBox({
                    show: true,
                    message: translate('Aucun_Programme_Configurer'),
                    title: translate('Configuration'),
                    type: NOTICE_BOX_WARNING
                })
            }

            await loadAllSupervisionsFromTracker(response, organisationUnitList)
            setDataStoreSupervisionConfigs(response)
            setLoadingDataStoreSupervisionConfigs(false)
        }
        catch (err) {
            setLoadingDataStoreSupervisionConfigs(false)
        }
    }

    const loadDataStoreSupervisions = async () => {
        try {
            setLoadingDataStoreSupervisions(true)
            const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, null)
            setDataStoreSupervisions(response)
            setLoadingDataStoreSupervisions(false)
            return response
        }
        catch (err) {
            setLoadingDataStoreSupervisions(false)
        }
    }

    const loadDataStoreIndicators = async () => {
        try {
            setLoadingDataStoreIndicatorConfigs(true)
            const response = await loadDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, null, null, null)
            setDataStoreIndicatorConfigs(response)
            setLoadingDataStoreIndicatorConfigs(false)
        }
        catch (err) {
            setLoadingDataStoreIndicatorConfigs(false)
        }
    }

    const handleSelectDataElement = (value) => {
        setSelectedDataElement(selectedProgramStage.programStageDataElements?.map(p => p.dataElement).find(dataElement => dataElement.id === value))
    }


    const handleAddNewMappingConfig = () => {
        setIsNewMappingMode(!isNewMappingMode)

        if (!isNewMappingMode) {
            setSelectedDataElement(null)
        }
    }

    const handleSelectProgramStage = (value) => {
        setSelectedProgramStage(programStages.find(pstage => pstage.id === value))
        setSelectedDataElement(null)
    }


    const getStatusNameAndColor = status => {

        if (status === NA.value) {
            return { name: NA.name, color: { background: GRAY_DARK, text: WHITE } }
        }

        if (status === CANCELED.value) {
            return { name: CANCELED.name, color: { background: RED, text: WHITE } }
        }

        if (status === PENDING_VALIDATION.value) {
            return { name: PENDING_VALIDATION.name, color: { background: ORANGE, text: WHITE } }
        }

        if (status === COMPLETED.value) {
            return { name: COMPLETED.name, color: { background: GREEN, text: WHITE } }
        }

        if (status === SCHEDULED.value) {
            return { name: SCHEDULED.name, color: { background: BLUE, text: WHITE } }
        }

        return { name: SCHEDULED.name, color: { background: BLUE, text: WHITE } }

    }

    const getStatusNameAndColorForPayment = status => {
        if (status === PAYMENT_DONE.value) {
            return { name: PAYMENT_DONE.name, color: { background: GREEN, text: WHITE } }
        }

        if (status === PENDING_PAYMENT.value) {
            return { name: PENDING_PAYMENT.name, color: { background: ORANGE, text: WHITE } }
        }

        if (status === NA.value) {
            return { name: NA.name, color: { background: GRAY_DARK, text: WHITE } }
        }

        return { name: NA.name, color: { background: GRAY_DARK, text: WHITE } }

    }

    const filterAndGetPlanfications = () => allSupervisionsFromTracker.reduce((prev, current) => {
        if (selectedSupervisionsConfigProgram.generationType === TYPE_GENERATION_AS_TEI) {
            if (
                selectedPeriodSupervisionConfig && dayjs(current.created).format('YYYYMM') === dayjs(selectedPeriodSupervisionConfig).format('YYYYMM') &&
                current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)
            ) {
                const eventDate = current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)[0]?.events[0]?.eventDate
                const trackedEntityInstance = current.trackedEntityInstance
                const program = current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)[0]?.program
                return [
                    ...prev,
                    {
                        trackedEntityInstance,
                        agent: `${current.attributes?.find(att => att.attribute === selectedSupervisionsConfigProgram?.attributeName?.id)?.value || ''} ${current.attributes?.find(att => att.attribute === selectedSupervisionsConfigProgram?.attributeFirstName?.id)?.value || ''}`,
                        montant: calculateMontant(trackedEntityInstance, eventDate, current.orgUnit, program),
                        period: eventDate,
                        enrollment: current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)[0]?.enrollment,
                        program: program,
                        orgUnit: current.orgUnit,
                        storedBy: current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)[0]?.storedBy,
                        libelle: current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)[0]?.orgUnitName,
                        statusSupervision: dayjs(eventDate).isAfter(dayjs()) ? getDefaultStatusSupervisionIfStatusIsNull() : current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)[0]?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedSupervisionsConfigProgram?.statusSupervision?.dataElement?.id)?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                        statusPayment: current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)[0]?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedSupervisionsConfigProgram?.statusPayment?.dataElement?.id)?.value || getDefaultStatusPaymentIfStatusIsNull()
                    }
                ]
            }
        }

        if (selectedSupervisionsConfigProgram.generationType === TYPE_GENERATION_AS_ENROLMENT) {
            if (selectedPeriodSupervisionConfig) {
                const enrollmentsList = []
                for (let en of current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)) {
                    if (dayjs(en.enrollmentDate).format('YYYYMM') === dayjs(selectedPeriodSupervisionConfig).format('YYYYMM')) {
                        enrollmentsList.push(en)
                    }
                }
                return [
                    ...prev,
                    ...enrollmentsList.map(en => ({
                        trackedEntityInstance: en.trackedEntityInstance,
                        agent: `${current.attributes?.find(att => att.attribute === selectedSupervisionsConfigProgram?.attributeName?.id)?.value || ''} ${current.attributes?.find(att => att.attribute === selectedSupervisionsConfigProgram?.attributeFirstName?.id)?.value || ''}`,
                        period: en?.events[0]?.eventDate,
                        montant: calculateMontant(en.trackedEntityInstance, en?.events[0]?.eventDate, current.orgUnit, en.program),
                        enrollment: en.enrollment,
                        program: en.program,
                        orgUnit: current.orgUnit,
                        storedBy: en.storedBy,
                        libelle: en.orgUnitName,
                        statusSupervision: dayjs(en?.events[0]?.eventDate).isAfter(dayjs()) ? getDefaultStatusSupervisionIfStatusIsNull() : en?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedSupervisionsConfigProgram?.statusSupervision?.dataElement?.id)?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                        statusPayment: en?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedSupervisionsConfigProgram?.statusPayment?.dataElement?.id)?.value || getDefaultStatusPaymentIfStatusIsNull()
                    }))
                ]
            }
        }

        if (selectedSupervisionsConfigProgram.generationType === TYPE_GENERATION_AS_EVENT) {
            if (selectedPeriodSupervisionConfig) {
                const eventList = []
                const currentEnrollment = current.enrollments?.filter(en => en.program === selectedSupervisionsConfigProgram?.program?.id)[0]
                for (let event of currentEnrollment?.events || []) {
                    if (dayjs(event.eventDate).format('YYYYMM') === dayjs(selectedPeriodSupervisionConfig).format('YYYYMM')) {
                        eventList.push(event)
                    }
                }

                return [
                    ...prev,
                    ...eventList.map(ev => ({
                        trackedEntityInstance: currentEnrollment?.trackedEntityInstance,
                        agent: `${current.attributes?.find(att => att.attribute === selectedSupervisionsConfigProgram?.attributeName?.id)?.value || ''} ${current.attributes?.find(att => att.attribute === selectedSupervisionsConfigProgram?.attributeFirstName?.id)?.value || ''}`,
                        period: ev.eventDate,
                        montant: calculateMontant(currentEnrollment?.trackedEntityInstance, ev.eventDate, currentEnrollment?.orgUnit, currentEnrollment?.program),
                        enrollment: currentEnrollment?.enrollment,
                        program: currentEnrollment?.program,
                        orgUnit: currentEnrollment?.orgUnit,
                        storedBy: currentEnrollment?.storedBy,
                        libelle: currentEnrollment?.orgUnitName,
                        statusSupervision: dayjs(ev.eventDate).isAfter(dayjs()) ? getDefaultStatusSupervisionIfStatusIsNull() : currentEnrollment?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedSupervisionsConfigProgram?.statusSupervision?.dataElement?.id)?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                        statusPayment: currentEnrollment?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedSupervisionsConfigProgram?.statusPayment?.dataElement?.id)?.value || getDefaultStatusPaymentIfStatusIsNull()
                    }))
                ]
            }
        }

        return prev
    }, [])

    const handleSaveNewMappingConfig = async () => {
        try {
            setLoadingSaveDateElementMappingConfig(true)
            if (!selectedDataElement)
                throw new Error(translate('Element_De_Donner_Obligatoire'))

            if (!inputDataSourceDisplayName || inputDataSourceDisplayName?.trim().length === 0)
                throw new Error(translate('Donne_Source_Obligatoire'))

            if (!selectedProgramStage)
                throw new Error(translate('Programme_Stage_Obligatoire'))

            if (selectedDataElement && selectedProgramStage) {
                const existingConfig = mappingConfigs.find(mapping => mapping.dataElement?.id === selectedDataElement.id &&
                    mapping.programStage?.id === selectedProgramStage.id
                )

                if (!existingConfig) {
                    const payload = {
                        id: uuid(),
                        dataElement: selectedDataElement,
                        indicator: { displayName: inputDataSourceDisplayName, id: inputDataSourceID },
                        programStage: { id: selectedProgramStage.id, displayName: selectedProgramStage.displayName },
                        program: { id: selectedProgram?.program?.id, displayName: selectedProgram?.program?.displayName }
                    }
                    const newList = [...mappingConfigs, payload]
                    setMappingConfigs(newList)
                    setSelectedDataElement(null)
                    setInputDataSourceDisplayName('')
                    setInputDataSourceID(null)
                    setSelectedProgramStage(null)
                    setNotification({ show: true, type: NOTIFICATON_SUCCESS, message: translate('Configuration_Ajoutee') })
                    setLoadingSaveDateElementMappingConfig(false)
                } else {
                    throw new Error(translate('Configuration_Deja_Ajoutee'))
                }
            }
        } catch (err) {
            setNotification({ show: true, type: NOTIFICATON_CRITICAL, message: err.response?.data?.message || err.message })
            setLoadingSaveDateElementMappingConfig(false)
        }
    }

    const handleDeleteConfigItem = async (value) => {
        try {
            if (value) {
                const newList = mappingConfigs.filter(mapConf => mapConf.id !== value.id)
                setMappingConfigs(newList)
                setNotification({ show: true, message: translate('Suppression_Effectuee'), type: NOTIFICATON_SUCCESS })
            }
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const handleChangeSupervisionType = ({ value }) => {
        setSelectedProgram(null)
        setSelectedAgents([])
        setSelectedOrganisationUnitInd(null)
        setSelectedSupervisionType(value)
    }

    const handleChangePlanificationType = ({ value }) => {

        setInputMauvais(0)
        setInputMeilleur(0)
        setInputMeilleurPositif(false)

        setSelectedIndicators([])
        setSelectedPeriod(null)
        setSelectedPeriodType(null)
        setSelectedOrganisationUnits([])
        setSelectedOrganisationUnitGroup(null)
        setSelectedOrganisationUnitGroupSet(null)

        if (value === INDICATOR && organisationUnitGroupSets.length === 0) {
            loadOrganisationUnitsGroupSets()
        }

        setSelectedPlanificationType(value)
    }

    const handleClickFloatingBtn = () => {
        setEditionMode(!isEditionMode)
    }

    const handleClickSupervisionItem = (sup) => {
        setSelectedProgramStage(null)
        setSelectedDataElement(null)
        setSelectedAgents([])
        setSelectedOrganisationUnitInd(null)


        loadProgramStages(sup.program?.id)
        setSelectedProgram(sup)
        if (selectedSupervisionType === TYPE_SUPERVISION_AGENT && sup?.attributesToDisplay?.length === 0) {
            return setNotification({ show: true, message: translate('Attribute_Non_Configurer'), type: NOTIFICATON_CRITICAL })
        }
    }

    const handleDeleteOtherSupervisor = (item, index) => {
        if (item) {
            setInputFields(
                inputFields.map((inp, inputIndex) => {
                    if (inputIndex === index) {
                        return {
                            ...inp,
                            otherSupervisors: inp.otherSupervisors?.filter(otherSup => otherSup !== item) || []
                        }
                    }
                    return inp
                })
            )
        }
    }

    const generatedAutoCode = async (attr_id) => {
        try {
            const route = `${TRACKED_ENTITY_ATTRIBUTES_ROUTE}/${attr_id}/generate` /// identifiant pev
            const autoGenetedCodeResponse = await axios.get(route)
            return autoGenetedCodeResponse.data
        } catch (err) {
            throw err
        }
    }

    const createTei = async (tei) => {
        try {
            const response = await axios.post(`${TRACKED_ENTITY_INSTANCES_ROUTE}`, tei)
            return response.data
        } catch (err) {
            throw err
        }
    }

    const createEnrollment = async (enrollment) => {
        try {
            const response = await axios.post(`${ENROLLMENTS_ROUTE}`, enrollment)
            return response.data
        } catch (err) {
            throw err
        }
    }

    const createEvents = async (events) => {
        try {
            const response = await axios.post(`${EVENTS_ROUTE}`, events)
            return response.data
        } catch (err) {
            throw err
        }
    }

    const generateTeiWithEnrollmentWithEvents = async (payload) => {
        try {
            const currentProgram = await axios.get(`${PROGS_ROUTE}/${selectedProgram?.program?.id}?fields=id,displayName,trackedEntityType,programStages[id,programStageDataElements[dataElement]],programTrackedEntityAttributes[trackedEntityAttribute]`)
            if (!currentProgram.data)
                throw new Error(translate('Programme_Non_Trouver'))

            const generatedCode = await generatedAutoCode(currentProgram.data.programTrackedEntityAttributes[0]?.trackedEntityAttribute?.id)

            const tei = {
                trackedEntityType: currentProgram.data.trackedEntityType.id,
                orgUnit: payload.orgUnit,
                attributes: [{ attribute: generatedCode.ownerUid, value: generatedCode.value }]
            }

            const createdTEI = await createTei(tei)
            const tei_id = createdTEI?.response?.importSummaries[0]?.reference

            if (!tei_id)
                throw new Error(translate('Erreur_Creation_TEI'))

            const enrollment = {
                orgUnit: payload.orgUnit,
                trackedEntityInstance: tei_id,
                program: payload.program
            }

            const createdEnrollment = await createEnrollment(enrollment)
            const enrollment_id = createdEnrollment?.response?.importSummaries[0]?.reference

            if (!enrollment_id)
                throw new Error(translate('Erreur_Creation_Enrollment'))

            const availableProgramStages = []
            const newEventsList = []

            //  Récuperation dans une list les programmes stage
            for (let mapping of mappingConfigs) {
                if (!availableProgramStages.includes(mapping.programStage?.id)) {
                    availableProgramStages.push(mapping.programStage.id)
                }
            }

            if (payload.fieldConfig?.supervisor?.programStage?.id) {
                if (!availableProgramStages.includes(payload.fieldConfig?.supervisor?.programStage?.id)) {
                    availableProgramStages.push(payload.fieldConfig?.supervisor?.programStage?.id)
                }
            }

            for (let stage of availableProgramStages) {
                const eventPayload = {
                    eventDate: payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                    program: payload.program,
                    orgUnit: payload.orgUnit,
                    enrollment: enrollment_id,
                    programStage: stage,
                    trackedEntityInstance: tei_id,
                    dataValues: []
                }

                if (mappingConfigs?.length > 0) {
                    eventPayload.status = 'ACTIVE'
                    eventPayload.eventDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                    eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                    eventPayload.dataValues = mappingConfigs.filter(ev => ev.programStage?.id === stage)
                        .map(ev => ({
                            dataElement: ev.dataElement?.id,
                            value: ev.indicator?.displayName
                        }))
                } else {
                    eventPayload.status = 'SCHEDULE'
                    eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                }

                // Ajoute des dataValues superviseurs
                if (payload.fieldConfig?.supervisor?.programStage?.id === stage && payload.fieldConfig?.supervisor?.dataElements?.length > 0) {
                    const newDataValues = []

                    /*
                    * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son INFÉRIEUR au nombres de superviseurs sélectionnés
                    */

                    const newSupervisorsList = [...payload.supervisors?.map(s => s.displayName), ...payload.otherSupervisors]

                    if (payload.fieldConfig?.supervisor?.dataElements?.length < newSupervisorsList?.length) {
                        const supervisorArrayCurrent = newSupervisorsList?.slice(0, payload.fieldConfig?.supervisor?.dataElements?.length)
                        const supervisorArraylast = newSupervisorsList?.slice(payload.fieldConfig?.supervisor?.dataElements?.length)

                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < supervisorArrayCurrent.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = supervisorArrayCurrent[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {

                                        if (i === payload.fieldConfig?.supervisor?.dataElements?.length - 1) {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: `${currentSUP},${supervisorArraylast?.join(',')}`
                                            })
                                        } else {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: currentSUP
                                            })
                                        }

                                    }
                                }
                            }
                        }
                    }

                    /*
                   * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son EGALE au nombres de superviseurs sélectionnés
                   */
                    if (payload.fieldConfig?.supervisor?.dataElements?.length === newSupervisorsList?.length) {
                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < newSupervisorsList.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = newSupervisorsList[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {

                                        newDataValues.push({
                                            dataElement: currentDE.id,
                                            value: currentSUP
                                        })
                                    }
                                }
                            }
                        }
                    }

                    /*
                  * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son SUPERIEUR au nombres de superviseurs sélectionnés
                  */
                    if (payload.fieldConfig?.supervisor?.dataElements?.length > newSupervisorsList?.length) {
                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < newSupervisorsList?.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = newSupervisorsList[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {
                                        newDataValues.push({
                                            dataElement: currentDE.id,
                                            value: currentSUP
                                        })

                                    }
                                }
                            }
                        }
                    }

                    if (newDataValues.length > 0) {
                        eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValues]
                    }
                }

                if (!newEventsList.map(ev => ev.programStage).includes(stage)) {
                    newEventsList.push(eventPayload)
                }
            }

            await createEvents({ events: newEventsList })

            const currentTEI = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}/${tei_id}?fields=*`)
            return currentTEI.data

        } catch (err) {
            throw err
        }
    }

    const generateEventsAsNewSupervision = async (payload) => {
        try {
            const existingTEI_List_response = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}?ou=${payload.orgUnit}&order=created:DESC&program=${selectedProgram?.program?.id}&fields=*`)
            const existingTEI_List = existingTEI_List_response.data.trackedEntityInstances

            if (existingTEI_List.length === 0) {
                return await generateTeiWithEnrollmentWithEvents(payload)
            } else {

                const current_tei = existingTEI_List[0]

                const enrollment_id = current_tei?.enrollments.filter(en => en.program === selectedProgram?.program?.id)[0]?.enrollment

                if (!enrollment_id)
                    throw new Error(translate('Erreur_Creation_Enrolement'))

                const availableProgramStages = []
                const newEventsList = []

                //  Récuperation dans une list les programmes stage
                for (let mapping of mappingConfigs) {
                    if (!availableProgramStages.includes(mapping.programStage?.id)) {
                        availableProgramStages.push(mapping.programStage.id)
                    }
                }

                if (payload.fieldConfig?.supervisor?.programStage?.id) {
                    if (!availableProgramStages.includes(payload.fieldConfig?.supervisor?.programStage?.id)) {
                        availableProgramStages.push(payload.fieldConfig?.supervisor?.programStage?.id)
                    }
                }

                for (let stage of availableProgramStages) {
                    const eventPayload = {
                        eventDate: payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                        program: payload.program,
                        orgUnit: payload.orgUnit,
                        enrollment: enrollment_id,
                        programStage: stage,
                        trackedEntityInstance: current_tei.trackedEntityInstance,
                        dataValues: []
                    }

                    if (mappingConfigs?.length > 0) {
                        eventPayload.status = 'ACTIVE'
                        eventPayload.eventDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                        eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                        eventPayload.dataValues = mappingConfigs.filter(ev => ev.programStage?.id === stage)
                            .map(ev => ({
                                dataElement: ev.dataElement?.id,
                                value: ev.indicator?.displayName
                            }))
                    } else {
                        eventPayload.status = 'SCHEDULE'
                        eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                    }

                    // Ajoute des dataValues superviseurs
                    if (payload.fieldConfig?.supervisor?.programStage?.id === stage && payload.fieldConfig?.supervisor?.dataElements?.length > 0) {
                        const newDataValues = []

                        /*
                        * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son INFÉRIEUR au nombres de superviseurs sélectionnés
                        */

                        const newSupervisorsList = [...payload.supervisors?.map(s => s.displayName), ...payload.otherSupervisors]

                        if (payload.fieldConfig?.supervisor?.dataElements?.length < newSupervisorsList?.length) {
                            const supervisorArrayCurrent = newSupervisorsList?.slice(0, payload.fieldConfig?.supervisor?.dataElements?.length)
                            const supervisorArraylast = newSupervisorsList?.slice(payload.fieldConfig?.supervisor?.dataElements?.length)

                            for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                                for (let j = 0; j < supervisorArrayCurrent.length; j++) {
                                    if (i === j) {
                                        const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                        const currentSUP = supervisorArrayCurrent[j]
                                        if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {

                                            if (i === payload.fieldConfig?.supervisor?.dataElements?.length - 1) {
                                                newDataValues.push({
                                                    dataElement: currentDE.id,
                                                    value: `${currentSUP},${supervisorArraylast?.join(',')}`
                                                })
                                            } else {
                                                newDataValues.push({
                                                    dataElement: currentDE.id,
                                                    value: currentSUP
                                                })
                                            }

                                        }
                                    }
                                }
                            }
                        }

                        /*
                       * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son EGALE au nombres de superviseurs sélectionnés
                       */
                        if (payload.fieldConfig?.supervisor?.dataElements?.length === newSupervisorsList?.length) {
                            for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                                for (let j = 0; j < newSupervisorsList.length; j++) {
                                    if (i === j) {
                                        const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                        const currentSUP = newSupervisorsList[j]
                                        if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: currentSUP
                                            })
                                        }
                                    }
                                }
                            }
                        }

                        /*
                      * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son SUPERIEUR au nombres de superviseurs sélectionnés
                      */
                        if (payload.fieldConfig?.supervisor?.dataElements?.length > newSupervisorsList?.length) {
                            for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                                for (let j = 0; j < newSupervisorsList?.length; j++) {
                                    if (i === j) {
                                        const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                        const currentSUP = newSupervisorsList[j]
                                        if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: currentSUP
                                            })
                                        }
                                    }
                                }
                            }
                        }

                        if (newDataValues.length > 0) {
                            eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValues]
                        }
                    }

                    if (!newEventsList.map(ev => ev.programStage).includes(stage)) {
                        newEventsList.push(eventPayload)
                    }
                }

                await createEvents({ events: newEventsList })

                const currentTEI = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}/${current_tei.trackedEntityInstance}?program=${selectedProgram.program?.id}`)
                const currentTEIData = currentTEI.data
                return currentTEIData
            }
        } catch (err) {
            throw err
        }
    }

    const generateEnrollmentsAsNewSupervision = async (payload) => {
        try {
            const existingTEI_List_response = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}?ou=${payload.orgUnit}&order=created:DESC&program=${selectedProgram?.program?.id}&fields=*`)
            const existingTEI_List = existingTEI_List_response.data.trackedEntityInstances

            if (existingTEI_List.length === 0) {
                return await generateTeiWithEnrollmentWithEvents(payload)
            } else {

                const current_tei = existingTEI_List[0]

                const enrollment = {
                    orgUnit: payload.orgUnit,
                    trackedEntityInstance: current_tei.trackedEntityInstance,
                    program: payload.program
                }

                const createdEnrollment = await createEnrollment(enrollment)
                const enrollment_id = createdEnrollment?.response?.importSummaries[0]?.reference

                if (!enrollment_id)
                    throw new Error(translate('Erreur_Creation_Enrolement'))

                const availableProgramStages = []
                const newEventsList = []

                //  Récuperation dans une list les programmes stage
                for (let mapping of mappingConfigs) {
                    if (!availableProgramStages.includes(mapping.programStage?.id)) {
                        availableProgramStages.push(mapping.programStage.id)
                    }
                }

                if (payload.fieldConfig?.supervisor?.programStage?.id) {
                    if (!availableProgramStages.includes(payload.fieldConfig?.supervisor?.programStage?.id)) {
                        availableProgramStages.push(payload.fieldConfig?.supervisor?.programStage?.id)
                    }
                }

                for (let stage of availableProgramStages) {
                    const eventPayload = {
                        eventDate: payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                        program: payload.program,
                        orgUnit: payload.orgUnit,
                        enrollment: enrollment_id,
                        programStage: stage,
                        trackedEntityInstance: current_tei.trackedEntityInstance,
                        dataValues: []
                    }

                    if (mappingConfigs?.length > 0) {
                        eventPayload.status = 'ACTIVE'
                        eventPayload.eventDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                        eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                        eventPayload.dataValues = mappingConfigs.filter(ev => ev.programStage?.id === stage)
                            .map(ev => ({
                                dataElement: ev.dataElement?.id,
                                value: ev.indicator?.displayName
                            }))
                    } else {
                        eventPayload.status = 'SCHEDULE'
                        eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                    }

                    // Ajoute des dataValues superviseurs
                    if (payload.fieldConfig?.supervisor?.programStage?.id === stage && payload.fieldConfig?.supervisor?.dataElements?.length > 0) {
                        const newDataValues = []

                        /*
                        * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son INFÉRIEUR au nombres de superviseurs sélectionnés
                        */

                        const newSupervisorsList = [...payload.supervisors?.map(s => s.displayName), ...payload.otherSupervisors]

                        if (payload.fieldConfig?.supervisor?.dataElements?.length < newSupervisorsList?.length) {
                            const supervisorArrayCurrent = newSupervisorsList?.slice(0, payload.fieldConfig?.supervisor?.dataElements?.length)
                            const supervisorArraylast = newSupervisorsList?.slice(payload.fieldConfig?.supervisor?.dataElements?.length)

                            for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                                for (let j = 0; j < supervisorArrayCurrent.length; j++) {
                                    if (i === j) {
                                        const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                        const currentSUP = supervisorArrayCurrent[j]
                                        if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {

                                            if (i === payload.fieldConfig?.supervisor?.dataElements?.length - 1) {
                                                newDataValues.push({
                                                    dataElement: currentDE.id,
                                                    value: `${currentSUP},${supervisorArraylast?.join(',')}`
                                                })
                                            } else {
                                                newDataValues.push({
                                                    dataElement: currentDE.id,
                                                    value: currentSUP
                                                })
                                            }

                                        }
                                    }
                                }
                            }
                        }

                        /*
                       * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son EGALE au nombres de superviseurs sélectionnés
                       */
                        if (payload.fieldConfig?.supervisor?.dataElements?.length === newSupervisorsList?.length) {
                            for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                                for (let j = 0; j < newSupervisorsList.length; j++) {
                                    if (i === j) {
                                        const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                        const currentSUP = newSupervisorsList[j]
                                        if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: currentSUP
                                            })
                                        }
                                    }
                                }
                            }
                        }

                        /*
                      * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son SUPERIEUR au nombres de superviseurs sélectionnés
                      */
                        if (payload.fieldConfig?.supervisor?.dataElements?.length > newSupervisorsList?.length) {
                            for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                                for (let j = 0; j < newSupervisorsList?.length; j++) {
                                    if (i === j) {
                                        const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                        const currentSUP = newSupervisorsList[j]
                                        if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: currentSUP
                                            })

                                        }
                                    }
                                }
                            }
                        }

                        if (newDataValues.length > 0) {
                            eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValues]
                        }
                    }

                    if (!newEventsList.map(ev => ev.programStage).includes(stage)) {
                        newEventsList.push(eventPayload)
                    }
                }

                await createEvents({ events: newEventsList })

                const currentTEI = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}/${current_tei.trackedEntityInstance}?program=${selectedProgram.program?.id}`)
                const currentTEIData = currentTEI.data
                return currentTEIData
            }
        } catch (err) {
            throw err
        }
    }

    const handleSelectIndicators = (values) => setSelectedIndicators(values.map(val => dataStoreIndicatorConfigs.find(dsInd => dsInd.indicator?.id === val)))
    const handleSelectOrgUnitGroup = (values) => setSelectedOrganisationUnitGroups(values.map(val => organisationUnitGroups.find(orgGp => orgGp.id === val)))

    const savePanificationToDataStore = async (payload) => {
        try {
            if (payload) {
                await saveDataToDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, payload)
            }
        } catch (err) {
            throw err
        }
    }

    const saveSupervisionAsTEIStrategy = async (inputFieldsList) => {
        try {
            if (inputFieldsList.length > 0) {

                const supervisionsList = []

                for (let item of inputFieldsList) {
                    const payload = {
                        ...item,
                        orgUnit: item.organisationUnit?.id,
                        period: item.period,
                        program: item.program?.id,
                        fieldConfig: item.fieldConfig
                    }

                    const createdTEIObject = await generateTeiWithEnrollmentWithEvents(payload)

                    if (createdTEIObject) {
                        supervisionsList.push({
                            ...item,
                            id: uuid(),
                            planificationType: selectedPlanificationType,
                            indicators: selectedIndicators,
                            orgUnit: item.organisationUnit?.id,
                            period: item.period,
                            program: item.program,
                            fieldConfig: item.fieldConfig,
                            tei: createdTEIObject
                        })
                    }
                }
                let planificationPayload = {
                    id: uuid(),
                    program: selectedProgram,
                    dataSources: mappingConfigs,
                    supervisions: supervisionsList,
                }
                await savePanificationToDataStore([...dataStoreSupervisions, planificationPayload])
            }
        } catch (err) {
            throw err
        }
    }

    const saveSupervisionAsEventStrategy = async (inputFieldsList) => {
        try {
            if (inputFieldsList.length > 0) {

                const supervisionsList = []

                for (let item of inputFieldsList) {
                    const payload = {
                        ...item,
                        orgUnit: item.organisationUnit?.id,
                        period: item.period,
                        program: item.program?.id,
                        fieldConfig: item.fieldConfig
                    }
                    let createdTEIObject = null

                    if (selectedSupervisionType === TYPE_SUPERVISION_AGENT) {
                        createdTEIObject = await generateEventsForAgent(payload)
                    } else {
                        createdTEIObject = await generateEventsAsNewSupervision(payload)
                    }
                    if (createdTEIObject) {
                        supervisionsList.push({
                            ...item,
                            id: uuid(),
                            planificationType: selectedPlanificationType,
                            indicators: selectedIndicators,
                            orgUnit: item.organisationUnit?.id,
                            period: item.period,
                            program: item.program,
                            fieldConfig: item.fieldConfig,
                            tei: createdTEIObject
                        })
                    }
                }

                let planificationPayload = {
                    id: uuid(),
                    program: selectedProgram,
                    dataSources: mappingConfigs,
                    supervisions: supervisionsList,
                }
                await savePanificationToDataStore([...dataStoreSupervisions, planificationPayload])
            }
        } catch (err) {
            throw err
        }
    }

    const generateEventsForAgent = async (payload) => {
        try {
            const existing_tei_route = `${TRACKED_ENTITY_INSTANCES_ROUTE}/${payload.trackedEntityInstance}?fields=trackedEntityInstance,enrollments[*]`
            const existing_tei_response = await axios.get(existing_tei_route)
            const existing_tei = existing_tei_response.data

            if (!existing_tei || !existing_tei.enrollments[0])
                throw new Error(translate('Agent_Introuvable'))

            const availableProgramStages = []
            const newEventsList = []

            //  Récuperation dans une list les programmes stage
            for (let mapping of mappingConfigs) {
                if (!availableProgramStages.includes(mapping.programStage?.id)) {
                    availableProgramStages.push(mapping.programStage.id)
                }
            }

            if (payload.fieldConfig?.supervisor?.programStage?.id) {
                if (!availableProgramStages.includes(payload.fieldConfig?.supervisor?.programStage?.id)) {
                    availableProgramStages.push(payload.fieldConfig?.supervisor?.programStage?.id)
                }
            }

            for (let stage of availableProgramStages) {
                const eventPayload = {
                    eventDate: payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                    program: existing_tei.enrollments[0].program,
                    orgUnit: existing_tei.enrollments[0].orgUnit,
                    enrollment: existing_tei.enrollments[0].enrollment,
                    programStage: stage,
                    trackedEntityInstance: existing_tei.enrollments[0].trackedEntityInstance,
                    dataValues: []
                }

                if (mappingConfigs?.length > 0) {
                    eventPayload.status = 'ACTIVE'
                    eventPayload.eventDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                    eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                    eventPayload.dataValues = mappingConfigs.filter(ev => ev.programStage?.id === stage)
                        .map(ev => ({
                            dataElement: ev.dataElement?.id,
                            value: ev.indicator?.displayName
                        }))
                } else {
                    eventPayload.status = 'SCHEDULE'
                    eventPayload.dueDate = payload.period ? dayjs(payload.period).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                }

                // Ajoute des dataValues superviseurs
                if (payload.fieldConfig?.supervisor?.programStage?.id === stage && payload.fieldConfig?.supervisor?.dataElements?.length > 0) {
                    const newDataValues = []

                    /*
                    * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son INFÉRIEUR au nombres de superviseurs sélectionnés
                    */

                    const newSupervisorsList = [...payload.supervisors?.map(s => s.displayName), ...payload.otherSupervisors]

                    if (payload.fieldConfig?.supervisor?.dataElements?.length < newSupervisorsList?.length) {
                        const supervisorArrayCurrent = newSupervisorsList?.slice(0, payload.fieldConfig?.supervisor?.dataElements?.length)
                        const supervisorArraylast = newSupervisorsList?.slice(payload.fieldConfig?.supervisor?.dataElements?.length)

                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < supervisorArrayCurrent.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = supervisorArrayCurrent[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {

                                        if (i === payload.fieldConfig?.supervisor?.dataElements?.length - 1) {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: `${currentSUP},${supervisorArraylast?.join(',')}`
                                            })
                                        } else {
                                            newDataValues.push({
                                                dataElement: currentDE.id,
                                                value: currentSUP
                                            })
                                        }

                                    }
                                }
                            }
                        }
                    }

                    /*
                   * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son EGALE au nombres de superviseurs sélectionnés
                   */
                    if (payload.fieldConfig?.supervisor?.dataElements?.length === newSupervisorsList?.length) {
                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < newSupervisorsList.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = newSupervisorsList[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {
                                        newDataValues.push({
                                            dataElement: currentDE.id,
                                            value: currentSUP
                                        })
                                    }
                                }
                            }
                        }
                    }

                    /*
                  * Vérification du premier cas: dans le cas oû la taille des data elements superviseurs configurer son SUPERIEUR au nombres de superviseurs sélectionnés
                  */
                    if (payload.fieldConfig?.supervisor?.dataElements?.length > newSupervisorsList?.length) {
                        for (let i = 0; i < payload.fieldConfig?.supervisor?.dataElements?.length; i++) {
                            for (let j = 0; j < newSupervisorsList?.length; j++) {
                                if (i === j) {
                                    const currentDE = payload.fieldConfig?.supervisor?.dataElements[i]
                                    const currentSUP = newSupervisorsList[j]
                                    if (currentDE && currentSUP && !newDataValues.map(dv => dv.dataElement).includes(currentDE.id)) {
                                        newDataValues.push({
                                            dataElement: currentDE.id,
                                            value: currentSUP
                                        })

                                    }
                                }
                            }
                        }
                    }

                    if (newDataValues.length > 0) {
                        eventPayload.dataValues = [...eventPayload.dataValues, ...newDataValues]
                    }
                }

                if (!newEventsList.map(ev => ev.programStage).includes(stage)) {
                    newEventsList.push(eventPayload)
                }
            }

            await createEvents({ events: newEventsList })

            const currentTEI = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}/${existing_tei.enrollments[0].trackedEntityInstance}?fields=*`)
            return currentTEI.data

        } catch (err) {
            throw err
        }
    }

    const saveSupervisionAsEnrollmentStrategy = async (inputFieldsList) => {
        try {
            if (inputFieldsList.length > 0) {

                const supervisionsList = []

                for (let item of inputFieldsList) {
                    const payload = {
                        ...item,
                        orgUnit: item.organisationUnit?.id,
                        period: item.period,
                        program: item.program?.id,
                        fieldConfig: item.fieldConfig
                    }

                    const createdTEIObject = await generateEnrollmentsAsNewSupervision(payload)
                    if (createdTEIObject) {
                        supervisionsList.push({
                            ...item,
                            id: uuid(),
                            planificationType: selectedPlanificationType,
                            indicators: selectedIndicators,
                            orgUnit: item.organisationUnit?.id,
                            period: item.period,
                            program: item.program,
                            fieldConfig: item.fieldConfig,
                            tei: createdTEIObject
                        })
                    }
                }

                let planificationPayload = {
                    id: uuid(),
                    program: selectedProgram,
                    dataSources: mappingConfigs,
                    supervisions: supervisionsList,
                }
                await savePanificationToDataStore([...dataStoreSupervisions, planificationPayload])
            }
        } catch (err) {
            throw err
        }
    }

    const cleanAllNewSupervisionState = () => {
        setIsNewMappingMode(false)
        setMappingConfigs([])
        setProgramStages([])
        setSelectedAgents([])
        setTeisList([])
        setEmpty(false)
        setSelectedStep(0)
        setSelectedSupervisionType(null)
        setSelectedProgram(null)
        setSelectedPlanificationType(null)
        setSelectedOrganisationUnits([])
        setSelectedIndicators([])
        setSelectedPeriod(null)
        setSelectedOrganisationUnitGroupSet(null)
        setSelectedOrganisationUnitGroup(null)
        setSelectedPeriodType(null)
        setSelectedProgramStage(null)
        setSelectedDataElement(null)
        setSelectedMetaDatas([])
        setInputMeilleur(0)
        setInputMauvais(0)
        setInputMeilleurPositif(true)
        setInputFields([])
        setInputDataSourceDisplayName('')
        setInputDataSourceID(null)
        setSelectedOrganisationUnitInd(null)
        setAnalyticIndicatorResults([])
        setAnalyticErrorMessage(null)
    }

    const handleSupervisionPlanificationSaveBtn = async () => {
        try {
            setLoadingSupervisionPlanification(true)

            if (selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && selectedProgram.generationType === TYPE_GENERATION_AS_TEI)
                await saveSupervisionAsTEIStrategy(inputFields)

            if (selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && selectedProgram.generationType === TYPE_GENERATION_AS_ENROLMENT)
                await saveSupervisionAsEnrollmentStrategy(inputFields)

            if (selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && selectedProgram.generationType === TYPE_GENERATION_AS_EVENT)
                await saveSupervisionAsEventStrategy(inputFields)

            if (selectedSupervisionType === TYPE_SUPERVISION_AGENT && selectedProgram.generationType === TYPE_GENERATION_AS_EVENT)
                await saveSupervisionAsEventStrategy(inputFields)

            loadDataStoreSupervisionConfigs(organisationUnits)
            loadDataStoreSupervisions()
            setLoadingSupervisionPlanification(false)
            setNotification({ show: true, message: translate('Planification_Effectuer'), type: NOTIFICATON_SUCCESS })
            setEditionMode(false)
            cleanAllNewSupervisionState()
        } catch (err) {
            setLoadingSupervisionPlanification(false)
            setNotification({ show: true, type: NOTIFICATON_CRITICAL, message: err.response?.data?.message || err.message })
        }
    }
    const handleSelectSupervisionProgramConfigForTracker = (value) => {
        if (value) {
            const supFound = dataStoreSupervisionConfigs.find(d => d.program?.id === value)
            setAllSupervisionsFromTracker([])
            setSelectedSupervisionConfigProgram(supFound)
        }
    }

    const handleSelectPeriodSupervisionConfig = (date) => {
        setSelectedPeriodSupervisionConfig(dayjs((date)))
    }

    const handleSearchAllSupervisionFromTracker = () => {
        if (selectedSupervisionsConfigProgram && selectedOrgUnitSupervisionFromTracker && selectedSupervisionsConfigProgram) {
            setAllSupervisionsFromTracker([])
            loadTeisPlanifications(selectedSupervisionsConfigProgram.program?.id, selectedOrgUnitSupervisionFromTracker.id, DESCENDANTS)
        }
    }

    const calculateMontant = (trackedEntityInstance, period, organisationUnitId, programId) => {
        let montant = 0

        const correctTEIs = dataStoreSupervisions
            .reduce((prev, curr) => {
                prev = prev.concat(curr.supervisions || [])
                prev = prev.filter(p => p.period && trackedEntityInstance === p.trackedEntityInstance && dayjs(period).format('YYYY-MM-DD') === dayjs(p.period).format('YYYY-MM-DD') && p.organisationUnit?.id === organisationUnitId && p.program?.id === programId ? true : false)
                return prev
            }, []) || []

        if (correctTEIs.length === 0)
            return `${montant} FCFA`

        const correctPaymentObject = dataStoreSupervisionConfigs.find(d => d.program?.id === programId)?.paymentConfigs?.find(p => p.id === correctTEIs[0]?.payment)

        if (!correctPaymentObject)
            return `${montant} FCFA`

        montant = parseFloat(correctPaymentObject.montantConstant - (correctPaymentObject.montantConstant * correctPaymentObject.fraisMobileMoney / 100)).toFixed(2)

        return `${montant} FCFA`
    }

    const RenderSupervisionList = () => (
        <>
            <div style={{ marginTop: '10px' }}>
                <Card size='small' className='my-shadow'>
                    <Row gutter={[10, 10]}>
                        <Col md={6}>
                            {/* <div style={{ marginBottom: '2px' }}>Programme</div> */}
                            <Select
                                placeholder={translate('Programme')}
                                onChange={handleSelectSupervisionProgramConfigForTracker}
                                value={selectedSupervisionsConfigProgram?.program?.id}
                                style={{ width: '100%' }}
                                options={dataStoreSupervisionConfigs.map(d => ({ value: d.program?.id, label: d.program?.displayName }))}
                                loading={loadingDataStoreSupervisionConfigs}
                            />
                        </Col>
                        <Col md={6}>
                            <OrganisationUnitsTree
                                meOrgUnitId={me?.organisationUnits[0]?.id}
                                orgUnits={organisationUnits}
                                currentOrgUnits={selectedOrgUnitSupervisionFromTracker}
                                setCurrentOrgUnits={setSelectedOrgUnitSupervisionFromTracker}
                                loadingOrganisationUnits={loadingOrgUnitsSupervisionsFromTracker}
                                setLoadingOrganisationUnits={setLoadingOrgUnitsSupervisionsFromTracker}
                            />
                        </Col>
                        <Col md={6}>
                            <DatePicker
                                onChange={handleSelectPeriodSupervisionConfig}
                                picker="month"
                                value={selectedPeriodSupervisionConfig}
                                style={{ width: '100%' }}
                                placeholder={translate('Periode')}
                                allowClear={false}
                            />
                        </Col>

                        <Col md={6}>
                            <Button primary onClick={handleSearchAllSupervisionFromTracker} small loading={loadingAllSupervisionsFromTracker} disable={loadingAllSupervisionsFromTracker ? true : selectedSupervisionsConfigProgram && selectedPeriodSupervisionConfig && selectedOrgUnitSupervisionFromTracker ? false : true}>Rechercher</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
            <div style={{ marginTop: '20px' }}>
                <Card size='small' className='my-shadow'>
                    {
                        loadingAllSupervisionsFromTracker && (
                            <div style={{ display: 'flex', alignItems: 'center', }}>
                                <CircularLoader small />
                                <span style={{ marginLeft: '20px' }}>
                                    {translate('Chargement_Des_Supervisions')}
                                </span>
                            </div>
                        )
                    }
                    {
                        allSupervisionsFromTracker.length === 0 && (
                            <div style={{ fontWeight: 'bold', color: '#00000090', marginTop: '10px' }}>
                                {translate('Aucune_Supervision_Disponible')}
                            </div>
                        )
                    }
                    {
                        allSupervisionsFromTracker.length > 0 && (
                            <MantineReactTable
                                enableStickyHeader
                                columns={columns()}
                                data={filterAndGetPlanfications()}
                                mantinePaperProps={{
                                    shadow: 'none',
                                    radius: '8px',
                                    withBorder: false,
                                }}
                                initialState={
                                    {
                                        density: 'xs',
                                    }
                                }
                                mantineTableProps={{
                                    striped: true,
                                    highlightOnHover: true,
                                }}
                            />
                        )
                    }
                </Card>
            </div>
        </>
    )

    const RenderTopContent = () => (
        <>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #ccc', background: '#FFF', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Row gutter={[6, 6]}>

                    <Col sm={24} md={2}>
                        <div style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '15px' }}>{translate('Supervisions')}</div>
                    </Col>
                    <Col sm={24} md={16}>
                        {isEditionMode && RenderSteps()}
                    </Col>
                    <Col sm={24} md={2} style={{ textAlign: 'right' }}>
                        {
                            isEditionMode && inputFields.length > 0 && (
                                <div style={{ marginTop: '15px' }}>
                                    <Button onClick={cleanAllNewSupervisionState} icon={<ImCancelCircle style={{ color: '#fff', fontSize: '18px' }} />} destructive >
                                        {translate('Annuler')}
                                    </Button>
                                </div>
                            )
                        }
                    </Col>
                    <Col sm={24} md={4} style={{ textAlign: 'left' }}>
                        {
                            isEditionMode && inputFields.length > 0 && (
                                <div style={{ marginTop: '15px' }}>
                                    <Button icon={<FiSave style={{ color: '#fff', fontSize: '18px' }} />} onClick={handleSupervisionPlanificationSaveBtn} primary disabled={loadingSupervisionPlanification} loading={loadingSupervisionPlanification}>
                                        {translate('Planifier_Supervision')}
                                    </Button>
                                </div>
                            )
                        }
                    </Col>
                </Row>
            </div>
        </>
    )

    const RenderFloatingButton = () => (
        <>
            <FloatButton
                tooltip={isEditionMode ? translate('List_Supervisions') : translate('Nouvelle_Supervision')}
                icon={isEditionMode ? <IoListCircleOutline style={{ color: '#FFF', fontSize: '20px' }} /> : <IoMdAdd style={{ color: '#FFF' }} />}
                type="primary"
                style={{ right: 50, bottom: 50, width: '60px', height: '60px', boxShadow: '10px 10px 20px #00000050' }}
                onClick={handleClickFloatingBtn}
            />
        </>
    )

    const RenderNoticeBox = () => (
        <div style={{ padding: '10px' }}>
            <MyNoticeBox
                show={noticeBox.show}
                message={noticeBox.message}
                title={noticeBox.title}
                type={noticeBox.type}
            />
        </div>
    )

    const RenderSupervisionTypeContent = () => (
        <>
            <div>
                <Card className='my-shadow' size="small">
                    <div style={{ fontWeight: 'bold' }}>
                        {translate('Que_Voulez_Vous_Superviser')}
                    </div>
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <div>
                            <Radio
                                label={translate('Unite_Organisation')}
                                className="cursor-pointer"
                                onChange={handleChangeSupervisionType}
                                value={TYPE_SUPERVISION_ORGANISATION_UNIT}
                                checked={selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT}
                            />
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                            <Radio
                                label={translate('Agent')}
                                className="cursor-pointer"
                                onChange={handleChangeSupervisionType}
                                value={TYPE_SUPERVISION_AGENT}
                                checked={selectedSupervisionType === TYPE_SUPERVISION_AGENT}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )

    const RenderSelectedSupervisionTypeList = () => (
        <>
            <div style={{ marginTop: '10px' }}>
                <Card className='my-shadow my-scrollable' bodyStyle={{ padding: '0px', margin: '0px', maxHeight: '500px' }} size="small">
                    <div style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>{translate('Fiches_Supervisions')}</div>
                    <div style={{ padding: '10px' }}>
                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                            dataStoreSupervisionConfigs
                                .filter(sup => sup.planificationType === ORGANISATION_UNIT)
                                .map((sup, index) => (
                                    <div key={index} className={`supervision-item ${selectedProgram?.id === sup.id ? 'active' : ''}`} onClick={() => handleClickSupervisionItem(sup)}>
                                        {sup.program?.displayName}
                                    </div>
                                ))
                        }
                        {
                            selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                            dataStoreSupervisionConfigs
                                .filter(sup => sup.generationType === TYPE_GENERATION_AS_EVENT && sup.planificationType === AGENT)
                                .map((sup, index) => (
                                    <div key={index} className={`supervision-item ${selectedProgram?.id === sup.id ? 'active' : ''}`} onClick={() => handleClickSupervisionItem(sup)}>
                                        {sup.program?.displayName}
                                    </div>
                                ))
                        }
                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                            dataStoreSupervisionConfigs
                                .filter(sup => sup.planificationType === ORGANISATION_UNIT)
                                .length === 0 && (
                                <div style={{ fontWeight: 'bold' }}> {translate('Aucun_Programme_Supervision')} </div>
                            )
                        }

                        {
                            selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                            dataStoreSupervisionConfigs
                                .filter(sup => sup.generationType === TYPE_GENERATION_AS_EVENT && sup.planificationType === AGENT)
                                .length === 0 && (
                                <div style={{ fontWeight: 'bold' }}>  {translate('Aucun_Programme_Supervision')}</div>
                            )
                        }
                    </div>
                </Card>
            </div>
        </>
    )

    const RenderSupervisionPlanificationType = () => (
        <div>
            <Card className='my-shadow' size="small">
                <div style={{ fontWeight: 'bold' }}>
                    {translate('Planification')}
                </div>
                <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div>
                        <Radio
                            label={translate("Directe")}
                            className="cursor-pointer"
                            onChange={handleChangePlanificationType}
                            value={ORGANISATION_UNIT}
                            checked={selectedPlanificationType === ORGANISATION_UNIT}
                        />
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <Radio
                            label={translate("Basee_Sur_Perfomances")}
                            className="cursor-pointer"
                            onChange={handleChangePlanificationType}
                            value={INDICATOR}
                            checked={selectedPlanificationType === INDICATOR}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )

    const RenderSupervisionPlanificationOrganisationUnitContent = () => (
        <div style={{ marginTop: '10px' }}>
            <Card bodyStyle={{ padding: '0px' }} className='my-shadow' size='small'>
                <div style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}> {translate('Planification_Sur_Org_Units')}  </div>
                <div style={{ padding: '10px' }}>
                    <div>
                        <div style={{ marginBottom: '5px' }}>{translate('Unites_Organisation')}</div>
                        <OrganisationUnitsTree
                            meOrgUnitId={me?.organisationUnits[0]?.id}
                            orgUnits={organisationUnits}
                            currentOrgUnits={selectedOrganisationUnits}
                            setCurrentOrgUnits={setSelectedOrganisationUnits}
                            loadingOrganisationUnits={loadingOrganisationUnits}
                            multiple={true}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )

    const RenderSupervisionPlanificationIndicatorContent = () => (
        <>
            <div style={{ marginTop: '10px' }}>
                <Card bodyStyle={{ padding: '0px' }} className='my-shadow' size='small'>
                    <div style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}> {translate('Planification_Sur_Performances')} </div>
                    <div style={{ padding: '10px' }}>
                        <div>  {translate('Indicateurs')}</div>
                        <Select
                            options={dataStoreIndicatorConfigs.map(ind => ({ label: ind.indicator?.displayName, value: ind.indicator?.id }))}
                            loading={loadingDataStoreIndicatorConfigs}
                            disabled={loadingDataStoreIndicatorConfigs}
                            showSearch
                            placeholder={translate('Indicateurs')}
                            style={{ width: '100%' }}
                            optionFilterProp='label'
                            mode='multiple'
                            onChange={handleSelectIndicators}
                            value={selectedIndicators?.map(ind => ind.indicator?.id)}
                        />
                    </div>
                </Card>
            </div>
        </>
    )

    const handleInputPeriod = (period, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    return {
                        ...field,
                        period
                    }
                }
                return field
            })
        )
    }

    const handleInputLibelle = (event, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    return {
                        ...field,
                        libelle: ''.concat(event.target.value)
                    }
                }
                return field
            })
        )
    }

    const handleInputPayment = (value, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    return {
                        ...field,
                        payment: value
                    }
                }
                return field
            })
        )
    }

    const handleInputOtherSupervisor = (event, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    return {
                        ...field,
                        inputOtherSupervisor: ''.concat(event.target.value)
                    }
                }
                return field
            })
        )
    }

    const handleInputAddOtherSupervisors = (index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    if (field.inputOtherSupervisor?.trim()) {
                        if (!field.inputOtherSupervisor?.includes(inputOther => inputOther?.trim()?.toLocaleLowerCase() !== field.inputOtherSupervisor?.trim()?.toLocaleLowerCase())) {
                            return {
                                ...field,
                                inputOtherSupervisor: '',
                                otherSupervisors: [...field.otherSupervisors, field.inputOtherSupervisor?.trim()]
                            }

                        }
                    }
                }
                return field
            })
        )
    }

    const handleInputSupervisors = (values, index) => {
        setInputFields(
            inputFields.map((field, fieldIndex) => {
                if (index === fieldIndex) {
                    const supervisorsList = values.map(val => users.find(user => user.id === val))
                    return {
                        ...field,
                        supervisors: supervisorsList.map(sup => ({ id: sup.id, displayName: sup.displayName }))
                    }
                }
                return field
            })
        )
    }
    const handleCloseOrgUnitForm = (org, index) => {
        setSelectedOrganisationUnits(selectedOrganisationUnits.filter(ou => ou.id !== org.id))
        setInputFields(inputFields.filter(o => o.organisationUnit?.id !== org.id))
    }

    const RenderEntryInputConfiguration = () => (
        <div style={{ marginBottom: '20px' }}>
            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <div>
                        {translate('Configuration_Des_Champs_De_Saisie')}

                    </div>
                    <div style={{ marginTop: '10px', color: '#00000080', fontSize: '13px' }}>
                        {translate('Configuration_Element_De_Donner')}
                    </div>
                </div>
                <div style={{ padding: '10px' }}>

                </div>
            </Card>
        </div>
    )

    const RenderOrganisationUnitForm = (colMd = 12) => (
        <div>
            <Row gutter={[10, 10]}>
                {
                    selectedOrganisationUnits.map((org, index) => (
                        <Col md={colMd} sm={24} key={index}>
                            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                                <div style={{ background: '#0A9396', color: '#FFF', fontWeight: 'bold', padding: '10px', position: 'relative' }}>
                                    <span>
                                        {translate('Formulaire_De_Planification')}
                                    </span>
                                    {
                                        org && (
                                            <span
                                                style={{
                                                    marginLeft: '20px',
                                                    background: '#fff',
                                                    color: '#0A9396',
                                                    fontWeight: 'bold',
                                                    padding: '5px',
                                                    borderRadius: '10px',
                                                }}
                                            >
                                                {org?.displayName}
                                            </span>
                                        )
                                    }

                                    <span className="delete-sup"  >
                                        <Popconfirm
                                            title={translate('Suppression')}
                                            description={translate('Confirmation_Suppression_Du_Formulaire')}
                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                            onConfirm={() => handleCloseOrgUnitForm(org, index)}
                                        >
                                            <span style={{ padding: '5px' }}>X</span>
                                        </Popconfirm>
                                    </span>
                                </div>
                                <div style={{ padding: '10px' }}>
                                    <Row gutter={[10, 10]}>
                                        <Col sm={24} md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>{translate('Periode')}</div>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    placeholder={translate('Periode')}
                                                    value={inputFields[index]?.period}
                                                    onChange={period => handleInputPeriod(period, index)}
                                                />
                                            </div>
                                        </Col>
                                        {
                                            0 > 1 && <Col sm={24} md={12}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>{translate('Libelle')}</div>
                                                    <Input
                                                        placeholder={translate('Libelle')}
                                                        style={{ width: '100%' }}
                                                        value={inputFields[index]?.libelle}
                                                        onChange={event => handleInputLibelle(event, index)}
                                                    />
                                                </div>
                                            </Col>
                                        }
                                        <Col sm={24} md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>{translate('Superviseurs')}</div>
                                                <Select
                                                    placeholder={translate('Superviseurs')}
                                                    style={{ width: '100%' }}
                                                    loading={loadingUsers}
                                                    disabled={loadingUsers}
                                                    value={inputFields[index]?.supervisors?.map(sup => sup.id)}
                                                    onChange={(values) => handleInputSupervisors(values, index)}
                                                    mode='multiple'
                                                    optionFilterProp='label'
                                                    showSearch
                                                    options={users.map(user => ({ label: user.displayName, value: user.id }))}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>{translate('Autre_Superviseurs')}</div>
                                                <Row gutter={[10, 10]}>
                                                    <Col md={19} sm={24}>
                                                        <Input
                                                            placeholder={translate('Autre_Superviseurs')}
                                                            value={inputFields[index]?.inputOtherSupervisor}
                                                            onChange={event => handleInputOtherSupervisor(event, index)}
                                                        />
                                                    </Col>
                                                    <Col flex='auto' style={{ textAlign: 'right' }}>
                                                        <Button
                                                            primary
                                                            onClick={() => handleInputAddOtherSupervisors(index)}
                                                            disabled={
                                                                inputFields[index]?.inputOtherSupervisor?.trim() && !inputFields[index]?.otherSupervisorList?.includes(inputFields[index]?.inputOtherSupervisor?.trim()) ? false : true
                                                            }
                                                        >+ {translate('Ajouter')} </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>

                                        {
                                            inputFields[index]?.otherSupervisors?.length > 0 && (
                                                <Col md={24}>
                                                    <div style={{ marginTop: '10px' }}>
                                                        <List
                                                            size='small'
                                                            bordered
                                                            dataSource={inputFields[index]?.otherSupervisors}
                                                            renderItem={(item) => (
                                                                <List.Item style={{ padding: '2px 10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                                        <div>{item}</div>
                                                                        <div>
                                                                            <Popconfirm
                                                                                title={translate('Suppression')}
                                                                                description={translate('Confirmation_Suppression_Superviseur')}
                                                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                                                onConfirm={() => handleDeleteOtherSupervisor(item, index)}
                                                                            >
                                                                                <RiDeleteBinLine style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                                                                            </Popconfirm>
                                                                        </div>
                                                                    </div>
                                                                </List.Item>
                                                            )}
                                                        />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    )


    const handleCloseAgentForm = (ag) => {
        setSelectedAgents(selectedAgents.filter(agent => agent.trackedEntityInstance !== ag.trackedEntityInstance))
        setInputFields(inputFields.filter(agent => agent.trackedEntityInstance !== ag.id))
    }
    const RenderAgentsForm = (colMd = 6) => (
        <div>
            <Row gutter={[10, 10]}>
                {
                    selectedAgents.map((agent, index) => (
                        <Col md={colMd} sm={24} key={index}>
                            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                                <div style={{ background: '#0A9396', color: '#FFF', fontWeight: 'bold', padding: '10px', position: 'relative' }}>
                                    <span>
                                        {translate('Formulaire_De_Planification')}
                                    </span>

                                    <span
                                        style={{
                                            marginLeft: '20px',
                                            background: '#fff',
                                            color: '#0A9396',
                                            fontWeight: 'bold',
                                            padding: '5px',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        {
                                            agent.attributes?.find(att => att.attribute === selectedProgram.attributesToDisplay?.[0]?.id)?.value
                                        }
                                    </span>

                                    <span className="delete-sup"  >
                                        <Popconfirm
                                            title={translate('Suppression')}
                                            description={translate('Confirmation_Suppression_Du_Formulaire')}
                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                            onConfirm={() => handleCloseAgentForm(agent)}
                                        >
                                            <span style={{ padding: '5px' }}>X</span>
                                        </Popconfirm>
                                    </span>
                                </div>
                                <div style={{ padding: '10px' }}>
                                    <Row gutter={[10, 10]}>
                                        <Col sm={24} md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>{translate('Periode')}</div>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    placeholder={translate('Periode')}
                                                    value={inputFields[index]?.period}
                                                    onChange={period => handleInputPeriod(period, index)}
                                                />
                                            </div>
                                        </Col>
                                        {
                                            0 > 1 && <Col sm={24} md={12}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>{translate('Libelle')}</div>
                                                    <Input
                                                        placeholder={translate('Libelle')}
                                                        style={{ width: '100%' }}
                                                        value={inputFields[index]?.libelle}
                                                        onChange={event => handleInputLibelle(event, index)}
                                                    />
                                                </div>
                                            </Col>
                                        }

                                        {/* 
                                        {
                                            0 >1 &&  selectedProgram?.paymentConfigs?.length > 0 && (
                                                    <Col sm={24} md={24}>
                                                        <div>
                                                            <div style={{ marginBottom: '5px' }}>{translate('Criteres_De_Paiement')}</div>
                                                            <Select
                                                                placeholder={translate('Criteres_De_Paiement')}
                                                                style={{ width: '100%' }}
                                                                loading={loadingDataStoreSupervisionConfigs}
                                                                disabled={loadingDataStoreSupervisionConfigs}
                                                                value={inputFields[index]?.payment}
                                                                onChange={(value) => handleInputPayment(value, index)}
                                                                optionFilterProp='label'
                                                                showSearch
                                                                allowClear
                                                                options={selectedProgram?.paymentConfigs?.map(p => ({ label: p.libelle, value: p.id }))}
                                                            />
                                                        </div>
                                                    </Col>
                                                )
                                            } 
                                            */}

                                        <Col sm={24} md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>{translate('Superviseurs')}</div>
                                                <Select
                                                    placeholder={translate('Superviseurs')}
                                                    style={{ width: '100%' }}
                                                    loading={loadingUsers}
                                                    disabled={loadingUsers}
                                                    value={inputFields[index]?.supervisors?.map(sup => sup.id)}
                                                    onChange={(values) => handleInputSupervisors(values, index)}
                                                    mode='multiple'
                                                    optionFilterProp='label'
                                                    showSearch
                                                    options={users.map(user => ({ label: user.displayName, value: user.id }))}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={24}>
                                            <div>
                                                <div style={{ marginBottom: '5px' }}>{translate('Autre_Superviseurs')}</div>
                                                <Row gutter={[10, 10]}>
                                                    <Col md={18} sm={24}>
                                                        <Input
                                                            placeholder={translate('Autre_Superviseurs')}
                                                            value={inputFields[index]?.inputOtherSupervisor}
                                                            onChange={event => handleInputOtherSupervisor(event, index)}
                                                        />
                                                    </Col>
                                                    <Col flex='auto' style={{ textAlign: 'right' }}>
                                                        <Button
                                                            primary
                                                            onClick={() => handleInputAddOtherSupervisors(index)}
                                                            disabled={
                                                                inputFields[index]?.inputOtherSupervisor?.trim() && !inputFields[index]?.otherSupervisorList?.includes(inputFields[index]?.inputOtherSupervisor?.trim()) ? false : true
                                                            }
                                                        >+ {translate('Ajouter')} </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>

                                        {
                                            inputFields[index]?.otherSupervisors?.length > 0 && (
                                                <Col md={24}>
                                                    <div style={{ marginTop: '10px' }}>
                                                        <List
                                                            size='small'
                                                            bordered
                                                            dataSource={inputFields[index]?.otherSupervisors}
                                                            renderItem={(item) => (
                                                                <List.Item style={{ padding: '2px 10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                                        <div>{item}</div>
                                                                        <div>
                                                                            <Popconfirm
                                                                                title={translate('Suppression')}
                                                                                description={translate('Confirmation_Suppression_Superviseur')}
                                                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                                                onConfirm={() => handleDeleteOtherSupervisor(item, index)}
                                                                            >
                                                                                <RiDeleteBinLine style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                                                                            </Popconfirm>
                                                                        </div>
                                                                    </div>
                                                                </List.Item>
                                                            )}
                                                        />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    )

    const handleSelectOrganisationUnitGroupSet = (value) => {
        setSelectedOrganisationUnitGroup(null)
        setSelectedPeriodType(null)
        setSelectedPeriod(null)

        setSelectedOrganisationUnitGroupSet(organisationUnitGroupSets.find(org => org.id === value))
    }

    const handleSelectPeriodType = (value) => {
        setSelectedPeriod(null)
        setSelectedPeriodType(value)
    }

    const handleSelectPeriode = value => setSelectedPeriod(value)

    const handleSelectOrganisationUnitGroup = (value) => {
        setSelectedPeriodType(null)
        setSelectedPeriod(null)
        setSelectedOrganisationUnitGroup(selectedOrganisationUnitGroupSet.organisationUnitGroups?.find(org => org.id === value))
    }

    const formatPeriod = (period, periodType) => {

        let currentPeriod = dayjs(period).format('YYYY')

        if (periodType === MONTH)
            currentPeriod = dayjs(period).format('YYYYMM')

        if (periodType === DAY)
            currentPeriod = dayjs(period).format('YYYYMMDD')

        if (periodType === YEAR)
            currentPeriod = dayjs(period).format('YYYY')

        if (periodType === QUARTER)
            currentPeriod = `${dayjs(period).format('YYYY')}Q${dayjs(period).quarter()}`

        if (periodType === WEEK)
            currentPeriod = `${dayjs(period).format('YYYY')}W${dayjs(period).week()}`

        return currentPeriod
    }

    const handleDisplayIndicatorResult = async () => {
        try {
            setLoadingAnalyticIndicatorResults(true)
            setAnalyticErrorMessage(null)

            if (!selectedOrganisationUnits)
                throw new Error(translate('Unite_Organisation_Obligatoire'))

            if (!selectedIndicators || selectedIndicators.length === 0)
                throw new Error(translate('Veuillez_Selectionner_Les_Indicateurs'))

            if (!selectedOrganisationUnitGroupSet)
                throw new Error(translate('OrgUnitGroupSet_Obligatoire'))

            if (!selectedOrganisationUnitGroup)
                throw new Error(translate('OrgUnitGroup_Obligatoire'))

            if (!selectedPeriod)
                throw new Error(translate('Veuillez_Selectionner_Periode'))

            const route = `${ANALYTICS_ROUTE}?dimension=dx:${selectedIndicators.map(ind => ind.indicator?.id).join(';')},ou:${selectedOrganisationUnitInd?.id};OU_GROUP-${selectedOrganisationUnitGroup?.id}&filter=pe:${formatPeriod(selectedPeriod, selectedPeriodType)}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=true&includeNumDen=true&skipRounding=false&completedOnly=false&outputIdScheme=UID`
            const response = await axios.get(route)

            let availableIndicators = []

            for (let ind of selectedIndicators) {
                const payload = {
                    indicator: ind.indicator,
                    weight: ind.weight,
                    dataValues: response.data.rows.reduce((prev, cur) => {
                        const currentElement = cur[0]
                        const currentOrgUnit = cur[1]
                        const currentValue = cur[2]

                        if (ind.indicator?.id === currentElement) {
                            const payload = {
                                dataElement: currentElement,
                                orgUnit: organisationUnits.find(ou => ou.id === currentOrgUnit),
                                value: currentValue,
                                period: selectedPeriod,
                                score: parseFloat(currentValue) * parseFloat(ind.weight || 1),
                            }

                            prev.push(payload)
                        }

                        return prev
                    }, [])
                }

                availableIndicators.push(payload)
            }

            setAnalyticIndicatorResults(availableIndicators)
            if (response.data.rows.length === 0) {
                setAnalyticErrorMessage(translate('Aucun_Donne_Trouver_Pour_Cette_Selection'))
            }

            setLoadingAnalyticIndicatorResults(false)
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
            setLoadingAnalyticIndicatorResults(false)
            setAnalyticErrorMessage(null)
        }
    }

    const RenderIndicatorForm = () => (
        <div>
            <Card bodyStyle={{ padding: '0px' }} className="my-shadow" size='small'>
                <div style={{ background: '#0A9396', color: '#FFF', fontWeight: 'bold', padding: '10px' }}>
                    <span>
                        {translate('Criteres_De_Recherches')}
                    </span>
                </div>
                <div style={{ marginTop: '5px', padding: '10px' }}>
                    <Row gutter={[10, 10]}>
                        <Col sm={24} md={6}>
                            <div>
                                <div style={{ marginBottom: '5px' }}>{translate('Unites_Organisation')}</div>
                                <OrganisationUnitsTree
                                    meOrgUnitId={me?.organisationUnits[0]?.id}
                                    orgUnits={organisationUnits}
                                    currentOrgUnits={selectedOrganisationUnitInd}
                                    setCurrentOrgUnits={setSelectedOrganisationUnitInd}
                                    loadingOrganisationUnits={loadingOrganisationUnits}
                                />
                            </div>
                        </Col>
                        <Col sm={24} md={6}>
                            <div style={{ marginBottom: '5px' }}>{translate('Meilleur')}</div>
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder={translate('Meilleur')}
                                value={inputMeilleur}
                                onChange={value => setInputMeilleur(value || 0)}
                            />
                        </Col>
                        <Col sm={24} md={6}>
                            <div style={{ marginBottom: '5px' }}>{translate('Mauvais')}</div>
                            <InputNumber
                                onChange={value => setInputMauvais(value || 0)}
                                value={inputMauvais}
                                style={{ width: '100%' }}
                                placeholder={translate('Mauvais')}
                            />
                        </Col>
                        <Col sm={24} md={6}>
                            <div style={{ display: 'flex', marginTop: '30px' }}>
                                <Checkbox
                                    checked={inputMeilleurPositif}
                                    onChange={() => setInputMeilleurPositif(!inputMeilleurPositif)}
                                />
                                <span style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => setInputMeilleurPositif(!inputMeilleurPositif)}>Meilleur Positif</span>
                            </div>
                        </Col>
                        <Col sm={24} md={6}>
                            <div style={{ marginBottom: '5px' }}>{translate('OrgUnitGroupSet')}</div>
                            <Select
                                style={{ width: '100%' }}
                                options={organisationUnitGroupSets.map(org => ({ label: org.displayName, value: org.id }))}
                                value={selectedOrganisationUnitGroupSet?.id}
                                disabled={loadingOrganisationUnitGroupSets}
                                loading={loadingOrganisationUnitGroupSets}
                                placeholder={translate('OrgUnitGroups')}
                                onChange={handleSelectOrganisationUnitGroupSet}
                            />
                        </Col>
                        {
                            selectedOrganisationUnitGroupSet && (
                                <Col sm={24} md={6}>
                                    <div style={{ marginTop: '20px' }}>
                                        <div style={{ marginBottom: '5px' }}>{translate('OrgUnitGroups')}</div>
                                        <Select
                                            style={{ width: '100%' }}
                                            options={selectedOrganisationUnitGroupSet?.organisationUnitGroups?.map(org => ({ value: org.id, label: org.displayName }))}
                                            value={selectedOrganisationUnitGroup?.id}
                                            onChange={handleSelectOrganisationUnitGroup}
                                            placeholder={translate('OrgUnitGroups')}
                                        />
                                    </div>
                                </Col>
                            )
                        }
                        {
                            selectedOrganisationUnitGroup && (<Col sm={24} md={6}>
                                <div style={{ marginTop: '20px' }}>
                                    <div style={{ marginBottom: '5px' }}>{translate('Type_Periode')}</div>
                                    <Select
                                        style={{ width: '100%' }}
                                        options={periodTypesOptions()}
                                        placeholder={translate('Type_Periode')}
                                        onChange={handleSelectPeriodType}
                                        value={selectedPeriodType}
                                    />
                                </div>
                            </Col>
                            )
                        }
                        {
                            selectedPeriodType && (
                                <Col sm={24} md={6}>
                                    <div style={{ marginTop: '20px' }}>
                                        <div style={{ marginBottom: '5px' }}>{translate('Periode')}</div>
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder={translate('Periode')}
                                            onChange={handleSelectPeriode}
                                            value={selectedPeriod}
                                            picker={selectedPeriodType?.toLocaleLowerCase()}
                                        />
                                    </div>
                                </Col>
                            )
                        }
                        <Col sm={24} md={24}>
                            <Divider style={{ margin: '10px' }} />
                            <Button
                                loading={loadingAnalyticIndicatorResults}
                                disabled={selectedOrganisationUnitInd && selectedOrganisationUnitGroup && selectedIndicators.length > 0 && selectedOrganisationUnitGroupSet && selectedPeriod && (parseInt(inputMeilleur || 0) + parseInt(inputMauvais || 0)) > 0 ? false : true}
                                primary onClick={handleDisplayIndicatorResult}>{translate('Afficher_Resultats')}</Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    )

    const RenderPlanificationForm = () => (
        <>
            {selectedPlanificationType === ORGANISATION_UNIT && selectedOrganisationUnits && RenderOrganisationUnitForm()}
            {selectedPlanificationType === INDICATOR && selectedIndicators.length > 0 && RenderIndicatorForm()}
        </>
    )

    const RenderDataElementConfigList = () => (
        <>
            {
                mappingConfigs.length > 0 && (
                    <div className='my-shadow' style={{ padding: '10px', background: '#FFF', marginBottom: '2px', borderRadius: '8px', marginTop: '10px' }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>{translate('Liste_Configuration_Element_De_Donnees')}</div>
                        <Table
                            dataSource={
                                mappingConfigs.map(mapConf => ({
                                    ...mapConf,
                                    programStageName: mapConf.programStage?.displayName,
                                    indicatorName: mapConf.indicator?.displayName,
                                    dataElementName: mapConf.dataElement?.displayName,
                                    programName: mapConf.program?.displayName,
                                    action: { id: mapConf.id }
                                }))
                            }
                            columns={
                                [
                                    {
                                        title: translate('Programme'),
                                        dataIndex: 'programName'
                                    },
                                    {
                                        title: translate('Programme_Stage'),
                                        dataIndex: 'programStageName'
                                    },
                                    {
                                        title: translate('Element_De_Donnee'),
                                        dataIndex: 'dataElementName'
                                    },
                                    {
                                        title: translate('Indicateur'),
                                        dataIndex: 'indicatorName'
                                    },
                                    {
                                        title: translate('Actions'),
                                        dataIndex: 'action',
                                        width: '80px',
                                        render: value => (
                                            <Popconfirm
                                                title={translate('Suppression')}
                                                description={translate('Confirmation_Suppression_Configuration')}
                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                onConfirm={() => handleDeleteConfigItem(value)}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <RiDeleteBinLine style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                                                </div>
                                            </Popconfirm>
                                        )
                                    },
                                ]
                            }
                            size="small"
                        />
                    </div>
                )
            }
        </>
    )

    const RenderSteps = () => (
        <div style={{ width: '100%' }}>
            <Stepper
                style={{ margin: '0px', padding: '0px' }}
                activeStep={selectedStep}
                stepClassName="stepper__step"
                styleConfig={{
                    activeBgColor: '#2c6693',
                    activeTextColor: '#fff',
                    inactiveBgColor: '#fff',
                    inactiveTextColor: '#2c6693',
                    completedBgColor: '#fff',
                    completedTextColor: '#2c6693',
                    size: '40px',
                    fontWeight: 'bold',
                    circleFontSize: '25px',
                    labelFontSize: '16px'
                }}
                className='stepper'
                steps={[
                    {
                        label: translate('Configuration'),
                    },
                    {
                        label: translate('Finalisation'),
                    },
                ]}
            />
        </div>
    )

    const handleOkAnalyticComponentModal = () => {
        setInputDataSourceDisplayName(selectedMetaDatas[0]?.name)
        setInputDataSourceID(selectedMetaDatas[0]?.id)
        setSelectedMetaDatas([])
        setVisibleAnalyticComponentModal(false)
    }

    const handleCancelAnalyticComponentModal = () => {
        setSelectedMetaDatas([])
        setVisibleAnalyticComponentModal(false)
    }

    const RenderAnalyticComponentModal = () => visibleAnalyticComponentModal ? (
        <Modal onClose={() => handleCancelAnalyticComponentModal()} large>
            <ModalTitle>
                {translate('Source_De_Donnee')}
            </ModalTitle>
            <ModalContent>
                <div>
                    <DataDimension
                        selectedDimensions={selectedMetaDatas.map(it => ({ ...it, isDeactivated: true }))}
                        onSelect={value => {
                            setSelectedMetaDatas(value?.items?.length > 0 ? [value.items[0]] : [])
                        }}
                        displayNameProp="displayName"
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button destructive onClick={() => handleCancelAnalyticComponentModal()} icon={<CgCloseO style={{ fontSize: "18px" }} />}>
                        {translate('Annuler')}
                    </Button>
                    <Button primary onClick={() => handleOkAnalyticComponentModal()} icon={<FiSave style={{ fontSize: "18px" }} />}>
                        {translate('Enregistrer')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    ) : <></>

    const RenderDataElementConfigContent = () => <>
        <div className='my-shadow' style={{ padding: '20px', background: '#FFF', marginBottom: '2px', borderRadius: '8px', marginTop: '10px' }}>
            <Row gutter={[10, 10]}>
                <Col md={24}>
                    <div style={{ fontWeight: 'bold' }}>{translate('Configurations_Globales')}</div>
                </Col>
                <Col md={24}>
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ marginBottom: '5px' }}>{translate('Programmes_Stage')}</div>
                        <Select
                            options={programStages.map(program => ({ label: program.displayName, value: program.id }))}
                            placeholder={translate('Programmes_Stage')}
                            style={{ width: '100%' }}
                            optionFilterProp='label'
                            value={selectedProgramStage?.id}
                            onChange={handleSelectProgramStage}
                            showSearch
                            loading={loadingProgramStages}
                            disabled={loadingProgramStages}
                        />
                    </div>
                </Col>
                {
                    selectedProgramStage && (
                        <Col md={24} xs={24}>
                            <Divider style={{ margin: '5px auto' }} />

                            {
                                selectedProgramStage && (
                                    <Button icon={isNewMappingMode && <ImCancelCircle style={{ color: '#fff', fontSize: '18px' }} />} primary={!isNewMappingMode ? true : false} destructive={isNewMappingMode ? true : false} onClick={handleAddNewMappingConfig}>
                                        {!isNewMappingMode && <span>+ {translate('Ajouter_Nouveau_Mapping')}</span>}
                                        {isNewMappingMode && <span>{translate('Annuler_Le_Mapping')}</span>}
                                    </Button>
                                )
                            }

                            {
                                isNewMappingMode && (
                                    <div style={{ marginTop: '10px' }}>
                                        <Row gutter={[8, 8]}>
                                            {
                                                selectedProgramStage && (
                                                    <Col md={12} xs={24}>
                                                        <div>
                                                            <div style={{ marginBottom: '5px' }}>{translate('Elements_De_Donnees')}</div>
                                                            <Select
                                                                options={selectedProgramStage?.programStageDataElements?.map(progStageDE => ({ label: progStageDE.dataElement?.displayName, value: progStageDE.dataElement?.id }))}
                                                                placeholder={translate('Elements_De_Donnees')}
                                                                style={{ width: '100%' }}
                                                                onChange={handleSelectDataElement}
                                                                value={selectedDataElement?.id}
                                                                optionFilterProp='label'
                                                                showSearch
                                                            />
                                                        </div>
                                                    </Col>
                                                )
                                            }

                                            <Col md={10} xs={24}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>{translate('Source_De_Donnee')}</div>
                                                    <Input
                                                        placeholder={translate('Source_De_Donnee')}
                                                        style={{ width: '100%' }}
                                                        value={inputDataSourceDisplayName}
                                                        onChange={event => {
                                                            setInputDataSourceDisplayName(''.concat(event.target.value))
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={2} xs={24}>
                                                <div style={{ marginTop: '22px' }}>
                                                    <Button small primary icon={<TbSelect style={{ fontSize: '18px', color: '#fff', }} />} onClick={() => setVisibleAnalyticComponentModal(true)}></Button>
                                                </div>
                                            </Col>
                                            <Col md={24} xs={24}>
                                                <div style={{ marginTop: '18px' }}>
                                                    <Button loading={loadingSaveDateElementMappingConfig} disabled={loadingSaveDateElementMappingConfig} primary onClick={handleSaveNewMappingConfig}>+ {translate('Ajouter')} </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            }
                        </Col>
                    )
                }
            </Row>
        </div>
    </>

    const handleSelectCheckbox = (orgUnit) => {
        if (selectedOrganisationUnits.map(ou => ou.id).includes(orgUnit.id)) {
            setSelectedOrganisationUnits(selectedOrganisationUnits.filter(ou => ou.id !== orgUnit.id))
            setInputFields(inputFields.filter(o => o.organisationUnit?.id !== orgUnit.id))
        } else {
            setSelectedOrganisationUnits([...selectedOrganisationUnits, organisationUnits.find(ou => ou.id === orgUnit.id)])
        }
    }

    const RenderAnalyticIndicatorsResults = () => (
        <div style={{ marginTop: '10px' }}>
            <Card size='small' className='my-shadow'>
                <div>
                    <div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#fff' }}>
                                    <th style={{ border: '1px solid #ccc', padding: '5px' }}></th>
                                    <th style={{ border: '1px solid #ccc', padding: '5px' }}>{translate('Unite_Organisation')}</th>
                                    {
                                        analyticIndicatorResults.map((result, index) => (
                                            <th key={index} style={{ border: '1px solid #ccc', padding: '5px' }}>{result.indicator?.displayName}</th>
                                        ))
                                    }
                                    {
                                        analyticIndicatorResults.map((result, index) => (
                                            <th style={{ border: '1px solid #ccc', padding: '5px' }} key={index}>{result.indicator?.displayName}  Score</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {inputMeilleurPositif && [...analyticIndicatorResults
                                    .reduce((prev, cur) => { return prev.concat(cur.dataValues) }, [])]
                                    .sort((a, b) => b.score - a.score)
                                    .slice(0, parseInt(inputMeilleur || 0))
                                    .map((an, index) => (
                                        <tr style={{ backgroundColor: '#D3FFF3', color: '#000' }} key={index}>
                                            <td style={{ border: '1px solid #ccc', padding: '5px' }}>
                                                <AntCheckbox onChange={() => handleSelectCheckbox(an?.orgUnit)} checked={selectedOrganisationUnits.map(ou => ou.id).includes(an.orgUnit?.id)} /></td>
                                            <td style={{ border: '1px solid #ccc', padding: '5px' }}>{`${an.orgUnit?.displayName} (  ${an.orgUnit?.parent?.displayName}  ) `}</td>
                                            {analyticIndicatorResults.map((result, indicatorIndex) => (<td style={{ border: '1px solid #ccc', padding: '5px' }} key={indicatorIndex}>{result.indicator?.id === an.dataElement ? parseInt(an.value) : '-'}</td>))}
                                            {analyticIndicatorResults.map((result, indicatorIndex) => (<td style={{ border: '1px solid #ccc', padding: '5px' }} key={indicatorIndex}>{result.indicator?.id === an.dataElement ? parseInt(an.score) : '-'}</td>))}
                                        </tr>
                                    ))}
                                {inputMeilleurPositif && [...analyticIndicatorResults.reduce((prev, cur) => { return prev.concat(cur.dataValues) }, [])].sort((a, b) => a.score - b.score).slice(0, parseInt(inputMauvais || 0)).map((an, index) => (<tr style={{ backgroundColor: '#FFDDD2', color: '#000' }} key={index}> <td style={{ border: '1px solid #ccc', padding: '5px' }}><AntCheckbox onChange={() => handleSelectCheckbox(an?.orgUnit)} checked={selectedOrganisationUnits.map(ou => ou.id).includes(an.orgUnit?.id)} /></td>  <td style={{ border: '1px solid #ccc', padding: '5px' }}>{`${an.orgUnit?.displayName} (  ${an.orgUnit?.parent?.displayName}  ) `}</td>{analyticIndicatorResults.map((result, indicatorIndex) => (<td style={{ border: '1px solid #ccc', padding: '5px' }} key={indicatorIndex}>{result.indicator?.id === an.dataElement ? parseInt(an.value) : '-'}</td>))}{analyticIndicatorResults.map((result, indicatorIndex) => (<td style={{ border: '1px solid #ccc', padding: '5px' }} key={indicatorIndex}>{result.indicator?.id === an.dataElement ? parseInt(an.score) : '-'}</td>))} </tr>))}

                                {!inputMeilleurPositif && [...analyticIndicatorResults.reduce((prev, cur) => { return prev.concat(cur.dataValues) }, [])].sort((a, b) => a.score - b.score).slice(0, parseInt(inputMeilleur || 0)).map((an, index) => (<tr style={{ backgroundColor: '#D3FFF3', color: '#000' }} key={index}> <td style={{ border: '1px solid #ccc', padding: '5px' }}><AntCheckbox onChange={() => handleSelectCheckbox(an?.orgUnit)} checked={selectedOrganisationUnits.map(ou => ou.id).includes(an.orgUnit?.id)} /></td>  <td style={{ border: '1px solid #ccc', padding: '5px' }}>{`${an.orgUnit?.displayName} (  ${an.orgUnit?.parent?.displayName}  ) `}</td>{analyticIndicatorResults.map((result, indicatorIndex) => (<td style={{ border: '1px solid #ccc', padding: '5px' }} key={indicatorIndex}>{result.indicator?.id === an.dataElement ? parseInt(an.value) : '-'}</td>))}{analyticIndicatorResults.map((result, indicatorIndex) => (<td style={{ border: '1px solid #ccc', padding: '5px' }} key={indicatorIndex}>{result.indicator?.id === an.dataElement ? parseInt(an.score) : '-'}</td>))} </tr>))}
                                {!inputMeilleurPositif && [...analyticIndicatorResults.reduce((prev, cur) => { return prev.concat(cur.dataValues) }, [])].sort((a, b) => b.score - a.score).slice(0, parseInt(inputMauvais || 0)).map((an, index) => (<tr style={{ backgroundColor: '#FFDDD2', color: '#000' }} key={index}><td style={{ border: '1px solid #ccc', padding: '5px' }}><AntCheckbox onChange={() => handleSelectCheckbox(an?.orgUnit)} checked={selectedOrganisationUnits.map(ou => ou.id).includes(an.orgUnit?.id)} /></td>  <td style={{ border: '1px solid #ccc', padding: '5px' }}>{`${an.orgUnit?.displayName} (  ${an.orgUnit?.parent?.displayName}  ) `}</td>{analyticIndicatorResults.map((result, indicatorIndex) => (<td style={{ border: '1px solid #ccc', padding: '5px' }} key={indicatorIndex}>{result.indicator?.id === an.dataElement ? parseInt(an.value) : '-'}</td>))}{analyticIndicatorResults.map((result, indicatorIndex) => (<td style={{ border: '1px solid #ccc', padding: '5px' }} key={indicatorIndex}>{result.indicator?.id === an.dataElement ? parseInt(an.score) : '-'}</td>))} </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    )

    const loadTEIs = async (orgUnitId) => {
        try {
            if (selectedProgram && orgUnitId) {
                setLoadingTeiList(true)
                setEmpty(false)

                const route = `${TRACKED_ENTITY_INSTANCES_ROUTE}.json?ou=${orgUnitId}&ouMode=DESCENDANTS&program=${selectedProgram.program?.id}&fields=trackedEntityInstance,attributes,orgUnit,trackedEntityType,enrollments=[enrollment,orgUnit,orgUnitName,status,program,enrollmentDate,trackedEntityInstance]&order=created:DESC&paging=false`
                const response = await axios.get(route)
                setTeisList(response.data.trackedEntityInstances)
                if (!response.data.trackedEntityInstances || response.data.trackedEntityInstances?.length === 0) {
                    setEmpty(true)
                }
                setLoadingTeiList(false)
            }
        } catch (err) {
            setLoadingTeiList(false)
            setEmpty(true)
        }
    }

    const onOrgUnitSelected = (value) => {
        return selectedPlanificationType === ORGANISATION_UNIT && loadTEIs(value.id)
    }

    const handleSelectCheckboxAgent = (value) => {
        if (selectedAgents.map(ag => ag.trackedEntityInstance).includes(value.trackedEntityInstance)) {
            setSelectedAgents(selectedAgents.filter(ag => ag.trackedEntityInstance !== value.trackedEntityInstance))
            setInputFields(inputFields.filter(o => o.trackedEntityInstance !== value.trackedEntityInstance))
        } else {
            setSelectedAgents([...selectedAgents, teisList.find(tei => tei.trackedEntityInstance === value.trackedEntityInstance)])
        }
    }

    const handleChangePlanificationTypeAgent = ({ value }) => {
        setSelectedPlanificationType(value)
    }

    const handleSearchByPerformances = async () => {
        try {
            console.log("selectedPeriod: ", selectedPeriod)
            console.log("selectedIndicators:", selectedIndicators)
            console.log("selectedOrganisationUnitInd:", selectedOrganisationUnitInd)
            console.log("selectedOrganisationUnitGroups:", selectedOrganisationUnitGroups)
            setLoadingTeiList(true)

            if (!selectedPeriod)
                throw new Error(translate('Veuillez_Selectionner_Periode'))

            if (selectedIndicators.length === 0)
                throw new Error(translate('Indicateur_Obligatoire'))

            if (!selectedOrganisationUnitInd)
                throw new Error(translate('Veuillez_Selectionner_Unite_Organisation'))

            const routeLevel = `${API_BASE_ROUTE}/organisationUnitLevels.json?paging=false&fields=id,displayName,level&order=level:DESC`
            const responseLevels = await axios.get(routeLevel)
            const postLevel = responseLevels.data.organisationUnitLevels[0]

            const routeTeis = `${TRACKED_ENTITY_INSTANCES_ROUTE}.json?ou=${selectedOrganisationUnitInd?.id}&ouMode=DESCENDANTS&program=${selectedProgram.program?.id}&fields=trackedEntityInstance,attributes,orgUnit,trackedEntityType,enrollments=[enrollment,orgUnit,orgUnitName,status,program,enrollmentDate,trackedEntityInstance]&order=created:DESC`
            const teiResponse = await axios.get(routeTeis)
            const teis = teiResponse.data.trackedEntityInstances

            let ouGroupString = ''
            if (selectedOrganisationUnitGroups.length > 0) {
                for (let o of selectedOrganisationUnitGroups) {
                    ouGroupString = ouGroupString.concat(`OU_GROUP-${o.id};`)
                }
            }

            let nouveauTeiList = []

            if (teis.length > 0) {
                const routeAnalytic = `${API_BASE_ROUTE}/analytics/dataValueSet.json?dimension=dx:${selectedIndicators.map(ind => ind.indicator?.id).join(';')}&dimension=ou:${selectedOrganisationUnitInd?.id};LEVEL-${postLevel?.id}${ouGroupString?.trim()?.length > 0 ? ';' + ouGroupString : ''}&dimension=pe:${dayjs(selectedPeriod).format('YYYYMM')}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=true&includeNumDen=true&skipRounding=false&completedOnly=false`
                const analyticResponse = await axios.get(routeAnalytic)
                const dataValues = analyticResponse.data.dataValues

                nouveauTeiList = teis.reduce((prev, current) => {

                    const currentEnrollment = current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)?.[0]
                    if (currentEnrollment) {

                        const payload = {
                            ...current,
                            agentName: `${current.attributes?.find(att => att.attribute === selectedProgram?.attributeName?.id)?.value || ''} ${current.attributes?.find(att => att.attribute === selectedProgram?.attributeFirstName?.id)?.value || ''}`
                        }
                        const indicatorPayload = {}

                        for (let ind of selectedIndicators) {
                            const dValues = dataValues.filter(dv => ind.indicator?.id === dv.dataElement && dv.orgUnit === currentEnrollment.orgUnit && dayjs(selectedPeriod).format('YYYYMM') === dayjs(dv.period).format('YYYYMM')) || []
                            const dValue = dValues.reduce((pv, cr) => cr.value + cr.value, 0) || 0

                            indicatorPayload[`${ind.indicator?.id}`] = {
                                indicatorDataValues: dValues,
                                indicatorValue: dValue,
                                indicatorName: ind.nom,
                                indicatorScore: dValue * (ind.weight && ind.weight > 0 ? ind.weight : 1)
                            }
                        }

                        prev.push({ ...payload, ...indicatorPayload })

                    }

                    return prev

                }, [])

            }

            setTeisPerformanceList(nouveauTeiList)
            setLoadingTeiList(false)
        } catch (err) {
            console.log(err)
            setLoadingTeiList(false)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }

    const RenderAgentConfigList = () => (
        <>
            <div>
                <Card size='small' className='my-shadow'>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>
                            {translate('Planification')}
                        </div>
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <div>
                                <Radio
                                    label={translate("Directe")}
                                    className="cursor-pointer"
                                    onChange={handleChangePlanificationTypeAgent}
                                    value={ORGANISATION_UNIT}
                                    checked={selectedPlanificationType === ORGANISATION_UNIT}
                                />
                            </div>
                            <div style={{ marginLeft: '20px' }}>
                                <Radio
                                    label={translate("Basee_Sur_Perfomances")}
                                    className="cursor-pointer"
                                    onChange={handleChangePlanificationTypeAgent}
                                    value={INDICATOR}
                                    checked={selectedPlanificationType === INDICATOR}
                                />
                            </div>
                        </div>
                    </div>
                    {
                        selectedPlanificationType && (
                            <>
                                <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                <Row gutter={[8, 8]}>
                                    <Col md={8} sm={24}>
                                        <div style={{ marginBottom: '5px' }}>{translate('Unites_Organisation')}</div>
                                        <OrganisationUnitsTree
                                            meOrgUnitId={me?.organisationUnits[0]?.id}
                                            orgUnits={organisationUnits}
                                            currentOrgUnits={selectedOrganisationUnitInd}
                                            setCurrentOrgUnits={setSelectedOrganisationUnitInd}
                                            loadingOrganisationUnits={loadingOrganisationUnits}
                                            onChange={onOrgUnitSelected}
                                        />
                                    </Col>

                                    {
                                        selectedPlanificationType === INDICATOR && (
                                            <Col md={8} sm={24}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>  {translate('Indicateurs')}</div>
                                                    <Select
                                                        options={dataStoreIndicatorConfigs.map(ind => ({ label: ind.indicator?.displayName, value: ind.indicator?.id }))}
                                                        loading={loadingDataStoreIndicatorConfigs}
                                                        disabled={loadingDataStoreIndicatorConfigs}
                                                        showSearch
                                                        placeholder={translate('Indicateurs')}
                                                        style={{ width: '100%' }}
                                                        optionFilterProp='label'
                                                        mode='multiple'
                                                        onChange={handleSelectIndicators}
                                                        value={selectedIndicators?.map(ind => ind.indicator?.id)}
                                                    />
                                                </div>
                                            </Col>
                                        )
                                    }
                                    {
                                        selectedPlanificationType === INDICATOR && (
                                            <Col md={8} sm={24}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>  {translate('Groupe_Unite_Organisations')}</div>
                                                    <Select
                                                        options={organisationUnitGroups.map(org => ({ label: org.displayName, value: org.id }))}
                                                        loading={loadingOrganisationUnitGroups}
                                                        disabled={loadingOrganisationUnitGroups}
                                                        showSearch
                                                        placeholder={translate('Groupe_Unite_Organisations')}
                                                        style={{ width: '100%' }}
                                                        optionFilterProp='label'
                                                        mode='multiple'
                                                        onChange={handleSelectOrgUnitGroup}
                                                        value={selectedOrganisationUnitGroup?.map(org => org?.id)}
                                                    />
                                                </div>
                                            </Col>
                                        )
                                    }

                                    {
                                        selectedPlanificationType === INDICATOR && (
                                            <Col md={6} sm={24}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>{translate('Periode')}</div>
                                                    <DatePicker
                                                        style={{ width: '100%' }}
                                                        placeholder={translate('Periode')}
                                                        onChange={handleSelectPeriode}
                                                        value={selectedPeriod}
                                                        picker="month"
                                                    />
                                                </div>
                                            </Col>
                                        )
                                    }

                                    {

                                        selectedPlanificationType === INDICATOR && (
                                            <Col md={4} sm={24}>
                                                <div style={{ marginTop: '22px' }}>
                                                    <Button loading={loadingTeiList} disabled={selectedPeriod && selectedIndicators.length > 0 && selectedOrganisationUnitInd ? false : true} primary onClick={handleSearchByPerformances}>{translate('Recherche')}</Button>
                                                </div>
                                            </Col>
                                        )
                                    }
                                </Row>
                            </>
                        )
                    }
                </Card>
            </div>

            {
                selectedOrganisationUnitInd && (
                    <div style={{ marginTop: '10px' }}>
                        <Card size='small' className='my-shadow'>
                            <>
                                <div style={{ fontWeight: 'bold' }}>{translate('Liste_Des_Agents')}</div>
                                {
                                    loadingTeiList && (
                                        <div style={{ marginTop: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', }}>
                                                <CircularLoader small />
                                                <span style={{ marginLeft: '20px' }}>{translate('Chargement')}...</span>
                                            </div>
                                        </div>
                                    )
                                }

                                {/* {
                                    selectedPlanificationType === ORGANISATION_UNIT && teisList.length > 0 && (

                                        <div style={{ marginTop: '20px' }}>
                                            {
                                                teisList.length > 0 && (
                                                    <div>
                                                        <Table
                                                            size='small'
                                                            dataSource={
                                                                teisList.map(tei => {
                                                                    let payload = {
                                                                        tei
                                                                    }
                                                                    for (let att of selectedProgram.attributesToDisplay) {
                                                                        for (let teiAttr of tei.attributes) {
                                                                            if (att.id === teiAttr.attribute) {
                                                                                payload[`${att.displayName}`] = teiAttr.value
                                                                            }
                                                                        }
                                                                    }
                                                                    return payload
                                                                })
                                                            }
                                                            columns={[
                                                                {
                                                                    title: translate('Actions'), width: '100px', dataIndex: 'tei', key: 'action', render: value => (
                                                                        <div>
                                                                            <AntCheckbox onChange={() => handleSelectCheckboxAgent(value)} checked={selectedAgents.map(ag => ag.trackedEntityInstance).includes(value.trackedEntityInstance)} />
                                                                        </div>
                                                                    )
                                                                },
                                                                ...selectedProgram.attributesToDisplay.map(at => ({ title: at.displayName, dataIndex: at.displayName, key: at.displayName }))
                                                            ]}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                } */}


                                {
                                    selectedPlanificationType === ORGANISATION_UNIT && teisList.length > 0 && (
                                        <MantineReactTable
                                            enableStickyHeader
                                            columns={
                                                [
                                                    {
                                                        accessorKey: 'tei',
                                                        header: translate('Actions'),
                                                        Cell: ({ cell, row }) => {
                                                            console.log("row.original: ", row.original)
                                                            return (
                                                                <>
                                                                    <div>
                                                                        <AntCheckbox onChange={() => handleSelectCheckboxAgent(cell.getValue())} checked={selectedAgents.map(ag => ag.trackedEntityInstance).includes(cell.getValue()?.trackedEntityInstance)} />
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    },
                                                    ...selectedProgram.attributesToDisplay.map(att => (
                                                        {
                                                            header: att.displayName,
                                                            accessorKey: att.displayName
                                                        }
                                                    ))
                                                ]
                                            }

                                            data={
                                                teisList.map(tei => {
                                                    let payload = {
                                                        tei
                                                    }
                                                    for (let att of selectedProgram.attributesToDisplay) {
                                                        for (let teiAttr of tei.attributes) {
                                                            if (att.id === teiAttr.attribute) {
                                                                payload[`${att.displayName}`] = teiAttr.value
                                                            }
                                                        }
                                                    }
                                                    return payload
                                                })
                                            }
                                            mantinePaperProps={{
                                                shadow: 'none',
                                                radius: '8px',
                                                withBorder: false,
                                            }}
                                            initialState={
                                                {
                                                    density: 'xs',
                                                }
                                            }
                                            mantineTableProps={{
                                                striped: true,
                                                highlightOnHover: true,
                                            }}
                                        />
                                    )
                                }

                                { console.log(teisPerformanceList)}

                                {
                                    selectedPlanificationType === INDICATOR && teisPerformanceList.length > 0 && (
                                        <MantineReactTable
                                            enableStickyHeader
                                            columns={
                                                [
                                                    {
                                                        accessorKey: 'tei',
                                                        header: translate('Actions'),
                                                        Cell: ({ cell, row }) => {
                                                            console.log("row.original: ", row.original)
                                                            return (
                                                                <>
                                                                    <div>
                                                                        <AntCheckbox onChange={() => handleSelectCheckboxAgent(cell.getValue())} checked={selectedAgents.map(ag => ag.trackedEntityInstance).includes(cell.getValue()?.trackedEntityInstance)} />
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    },
                                                    {
                                                        accessorKey: 'agentName',
                                                        header: translate('Agent'),
                                                    },
                                                    ...selectedIndicators.map(att => (
                                                        {
                                                            header: att.indicator?.name,
                                                            accessorKey: `${att.indicator?.id}.indicatorValue`
                                                        }
                                                    ))
                                                ]
                                            }

                                            data={teisPerformanceList }
                                            mantinePaperProps={{
                                                shadow: 'none',
                                                radius: '8px',
                                                withBorder: false,
                                            }}
                                            initialState={
                                                {
                                                    density: 'xs',
                                                }
                                            }
                                            mantineTableProps={{
                                                striped: true,
                                                highlightOnHover: true,
                                            }}
                                        />
                                    )
                                }

                                {
                                    isEmpty && (
                                        <div style={{ marginTop: '20px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#00000090' }}> {translate('Aucun_Agent_Trouve')}</span>
                                        </div>
                                    )
                                }

                            </>
                        </Card>
                    </div>
                )
            }
        </>
    )

    const RenderStepsContent = () => <>
        {
            selectedStep === 0 && (
                <>
                    <Row gutter={[12, 12]}>
                        {selectedProgram && (
                            <Col md={24}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                    <div>
                                        <Button primary small disabled={selectedStep === 0 ? true : false} icon={<BsArrowLeft style={{ color: '#fff', fontSize: '18px' }} />} onClick={() => setSelectedStep(selectedStep - 1)}>{translate('Precedent')}</Button>
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <Button
                                            disabled={selectedSupervisionType === TYPE_SUPERVISION_AGENT ? selectedAgents.length > 0 ? false : true : false}
                                            icon={<BsArrowRight style={{ color: '#fff', fontSize: '18px' }} />} primary small onClick={() => setSelectedStep(selectedStep + 1)}>{translate('Suivant')}</Button>
                                    </div>
                                </div>
                            </Col>
                        )}
                        <Col sm={24} md={8}>
                            {RenderSupervisionTypeContent()}
                            {selectedSupervisionType && RenderSelectedSupervisionTypeList()}
                            {selectedProgram && RenderDataElementConfigContent()}
                        </Col>
                        <Col sm={24} md={16}>
                            {selectedProgram && selectedSupervisionType === TYPE_SUPERVISION_AGENT && selectedProgram.attributesToDisplay?.length > 0 && RenderAgentConfigList()}
                            {selectedProgram && RenderDataElementConfigList()}
                        </Col>
                    </Row>
                </>
            )
        }

        {
            selectedStep === 1 && (
                <>
                    <Row gutter={[10, 10]}>
                        {selectedProgram && (
                            <Col md={24}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                    <div >
                                        <Button primary small icon={<BsArrowLeft style={{ color: '#fff', fontSize: '18px' }} />} onClick={() => setSelectedStep(selectedStep - 1)}>{translate('Precedent')}</Button>
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <Button disabled={selectedStep === 1 ? true : false} icon={<BsArrowRight style={{ color: '#fff', fontSize: '18px' }} />} primary small onClick={() => setSelectedStep(selectedStep + 1)}>{translate('Suivant')}</Button>
                                    </div>
                                </div>
                            </Col>
                        )}

                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && (
                                <Col sm={24} md={8}>
                                    {selectedProgram && RenderSupervisionPlanificationType()}
                                    {selectedPlanificationType === INDICATOR && RenderSupervisionPlanificationIndicatorContent()}
                                    {selectedPlanificationType === ORGANISATION_UNIT && RenderSupervisionPlanificationOrganisationUnitContent()}
                                </Col>
                            )
                        }

                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && (
                                <Col sm={24} md={16}>
                                    {RenderPlanificationForm()}
                                </Col>
                            )
                        }

                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                            selectedPlanificationType === INDICATOR &&
                            selectedIndicators.length > 0 &&
                            selectedOrganisationUnitInd &&
                            selectedOrganisationUnitGroup &&
                            selectedPeriod && (
                                <Col md={24}>
                                    <Card size='small' className='my-shadow'>
                                        <div style={{ textAlign: 'center' }}>
                                            {
                                                selectedPeriod &&
                                                <div>
                                                    <span>{translate('Periode_Selectionner')}:</span> <strong> {dayjs(selectedPeriod).format(' MMMM, YYYY')} </strong> /
                                                    <span>{translate('Meilleur_Positif')}:</span> <strong> {inputMeilleurPositif ? translate('Oui') : translate('Non')} </strong> /
                                                    {analyticIndicatorResults.map(ind => <> <span className="ml-2">{ind.indicator?.displayName}:</span> <strong>{ind.weight}</strong> </>)}
                                                </div>
                                            }
                                        </div>
                                        {analyticErrorMessage && <div style={{ marginTop: '20px' }}> <NoticeBox error > {analyticErrorMessage} </NoticeBox> </div>}
                                    </Card>
                                </Col>
                            )
                        }

                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT &&
                            selectedPlanificationType === INDICATOR &&
                            selectedIndicators.length > 0 &&
                            selectedOrganisationUnitInd &&
                            selectedOrganisationUnitGroup &&
                            selectedPeriod &&
                            analyticIndicatorResults.length > 0 &&
                            [...analyticIndicatorResults.reduce((prev, cur) => { return prev.concat(cur.dataValues) }, [])].length >= parseInt(inputMeilleur || 0) + parseInt(inputMauvais || 0) &&
                            (
                                <Col md={24}>{RenderAnalyticIndicatorsResults()} </Col>
                            )
                        }

                        {
                            selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && selectedPlanificationType === INDICATOR && selectedIndicators.length > 0 && selectedOrganisationUnits.length > 0 && (
                                <Col md={24}>
                                    {RenderOrganisationUnitForm(8)}
                                </Col>
                            )
                        }

                        {
                            selectedSupervisionType === TYPE_SUPERVISION_AGENT &&
                            selectedAgents.length > 0 && (
                                <Col sm={24} md={24}>
                                    {RenderAgentsForm(6)}
                                </Col>
                            )
                        }

                    </Row>
                </>
            )
        }

    </>

    const RenderSupervisionForm = () => (
        <>
            <div style={{ width: '100%' }}>
                {RenderStepsContent()}
            </div>
        </>
    )

    const initInputFields = () => {
        const newList = []

        if (selectedSupervisionType === TYPE_SUPERVISION_ORGANISATION_UNIT && selectedOrganisationUnits && selectedOrganisationUnits?.length > 0) {
            for (let org of selectedOrganisationUnits) {
                if (inputFields.map(inp => inp.organisationUnit.id).includes(org.id)) {
                    newList.push(
                        inputFields.find(inp => inp.organisationUnit.id === org.id)
                    )
                } else {
                    newList.push(
                        {
                            organisationUnit: { id: org.id, displayName: org.displayName },
                            program: { id: selectedProgram.program?.id, displayName: selectedProgram.program?.displayName },
                            fieldConfig: selectedProgram.fieldConfig,
                            generationType: selectedProgram.generationType,
                            libelle: '',
                            payment: null,
                            period: null,
                            supervisors: [],
                            otherSupervisors: [],
                            inputOtherSupervisor: ''
                        }
                    )
                }
            }
        }

        if (selectedSupervisionType === TYPE_SUPERVISION_AGENT && selectedAgents && selectedAgents?.length > 0) {
            for (let ag of selectedAgents) {
                if (inputFields.map(inp => inp.trackedEntityInstance).includes(ag.trackedEntityInstance)) {
                    newList.push(
                        inputFields.find(inp => inp.trackedEntityInstance === ag.trackedEntityInstance)
                    )
                } else {
                    if (ag.enrollments?.length > 0) {
                        newList.push(
                            {
                                organisationUnit: { id: ag.enrollments[0]?.orgUnit, displayName: ag.enrollments[0]?.orgUnitName },
                                trackedEntityInstance: ag.enrollments[0]?.trackedEntityInstance,
                                program: { id: selectedProgram.program?.id, displayName: selectedProgram.program?.displayName },
                                fieldConfig: selectedProgram.fieldConfig,
                                generationType: selectedProgram.generationType,
                                libelle: '',
                                payment: null,
                                period: null,
                                supervisors: [],
                                otherSupervisors: [],
                                inputOtherSupervisor: '',

                            }
                        )
                    }
                }
            }
        }

        setInputFields(newList)
    }

    useEffect(() => {
        if (me) {
            loadOrganisationUnits()
            loadOrganisationUnitGroups()
            loadDataStoreSupervisions()
            loadDataStoreIndicators()
            loadUsers(me?.organisationUnits?.[0]?.id)
        }
    }, [me])

    useEffect(() => {
        initInputFields()
    }, [selectedOrganisationUnits, selectedAgents])

    return (
        <>
            {RenderTopContent()}
            {
                loadingDataStoreSupervisionConfigs && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CircularLoader small />
                        <span style={{ marginLeft: '10px' }}>{translate('Chargement')}...</span>
                    </div>
                )
            }
            {
                !loadingDataStoreSupervisionConfigs && dataStoreSupervisionConfigs?.length > 0 && (
                    <>
                        <div style={{ padding: '10px', height: '100%', marginBottom: '10px' }}>
                            {!isEditionMode && RenderSupervisionList()}
                            {isEditionMode && RenderSupervisionForm()}
                        </div>
                        {RenderFloatingButton()}
                    </>
                )
            }
            {RenderAnalyticComponentModal()}
            {RenderNoticeBox()}
            <MyNotification notification={notification} setNotification={setNotification} />
        </>
    )
}


export default Supervision