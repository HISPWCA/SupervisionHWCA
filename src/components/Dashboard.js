import { useState, useEffect } from 'react'
import { Card, Col, DatePicker, Row, Select, Table } from 'antd'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import ReactEchart from 'echarts-for-react'
import axios from 'axios';
import { DATA_ELEMENT_OPTION_SETS, ORGANISATION_UNITS_ROUTE, SERVER_URL, TRACKED_ENTITY_INSTANCES_ROUTE, USERS_ROUTE } from '../utils/api.routes'
import OrganisationUnitsTree from './OrganisationUnitsTree'
import { CANCELED, DESCENDANTS, NOTICE_BOX_DEFAULT, NOTIFICATION_CRITICAL, PENDING_VALIDATION, PLANIFICATION_PAR_MOI, PLANIFICATION_PAR_TOUS, PLANIFICATION_PAR_UN_USER, COMPLETED, SCHEDULED, TYPE_GENERATION_AS_ENROLMENT, TYPE_GENERATION_AS_EVENT, TYPE_GENERATION_AS_TEI, NA, PAYMENT_DONE, PENDING_PAYMENT, AGENT, MES_PLANIFICATIONS } from '../utils/constants'
import MapView from './MapView'
import { loadDataStore } from '../utils/functions'
import { IoMdOpen } from 'react-icons/io'
import { BLACK, BLUE, GRAY_DARK, GREEN, ORANGE, RED, WHITE } from '../utils/couleurs'
import { AiOutlineSearch } from 'react-icons/ai'
import { MyNoticeBox } from './MyNoticeBox'
import MyNotification from './MyNotification'
import { Button } from '@dhis2/ui'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import translate from '../utils/translator';

const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekOfYear = require('dayjs/plugin/weekOfYear')

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.locale('fr-FR')

const localizer = dayjsLocalizer(dayjs)

export const getDefaultStatusSupervisionIfStatusIsNull = _ => SCHEDULED.value
export const getDefaultStatusPaymentIfStatusIsNull = _ => NA.value
export const Dashboard = ({ me }) => {

    const [organisationUnits, setOrganisationUnits] = useState([])
    const [users, setUsers] = useState([])
    const [dataStoreSupervisionsConfigs, setDataStoreSupervisionsConfigs] = useState([])
    const [_, setDataStoreSupervisionPlanifications] = useState([])
    const [teiList, setTeiList] = useState([])
    const [noticeBox, setNoticeBox] = useState({ show: false, message: null, title: null, type: NOTICE_BOX_DEFAULT })
    const [notification, setNotification] = useState({ show: false, message: null, type: null })
    const [calendarDate, setCalendarDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [statusSupervisionOptions, setStatusSupervisionOptions] = useState([])
    const [statusPaymentOptions, setStatusPaymentOptions] = useState([])

    const [selectedOrganisationUnit, setSelectedOrganisationUnit] = useState(null)
    const [selectedPlanification, setSelectedPlanification] = useState(MES_PLANIFICATIONS)
    const [selectedPeriod, setSelectedPeriod] = useState(dayjs(new Date()))
    const [selectedPlanificationUser, setSelectedPlanificationUser] = useState(null)
    const [selectedSupervisors, setSelectedSupervisors] = useState([])
    const [selectedProgram, setSelectedProgram] = useState(null)

    const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [loadingDataStoreSupervisionPlanifications, setLoadingDataStoreSupervisionPlanifications] = useState(false)
    const [loadingDataStoreSupervisionsConfigs, setLoadingDataStoreSupervisionsConfigs] = useState(false)
    const [loadingTeiList, setLoadingTeiList] = useState(false)

    const colors = ['#5470C6', '#EE6666']

    const analyleLineOptions = {
        color: colors,
        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {},
        grid: {
            top: 70,
            bottom: 50
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return (
                                'Precipitation  ' +
                                params.value +
                                (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                            );
                        }
                    }
                },
                // prettier-ignore
                data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
            },
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return (
                                'Precipitation  ' +
                                params.value +
                                (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                            );
                        }
                    }
                },
                // prettier-ignore
                data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Precipitation(2015)',
                type: 'line',
                xAxisIndex: 1,
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                data: [
                    2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                ]
            },
            {
                name: 'Precipitation(2016)',
                type: 'line',
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                data: [
                    3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7
                ]
            }
        ]
    }

    const coordinates = [
        { latitude: '7.653044', longitude: '1.047232' },
        { latitude: '7.616294', longitude: '1.126936' },
        { latitude: '7.582263', longitude: '1.508966' },
    ]

    const loadOrganisationUnits = async () => {
        try {
            setLoadingOrganisationUnits(true)
            const response = await axios.get(ORGANISATION_UNITS_ROUTE)
            const orgUnits = response.data.organisationUnits
            const progs = await loadDataStoreSupervisionsConfigs()

            setOrganisationUnits(orgUnits)
            setSelectedPeriod(dayjs())
            if (progs.length > 0) {

                const currentProgram = progs[0]
                const currentOrgUnit = orgUnits.find(ou => ou.id === me?.organisationUnits?.[0]?.id)
                const currentPeriod = dayjs()
                const currentPlanification = MES_PLANIFICATIONS

                if (currentProgram) {
                    setSelectedProgram(currentProgram)
                    setSelectedOrganisationUnit(currentOrgUnit)
                    setSelectedPeriod(currentPeriod)
                    setSelectedPlanification(currentPlanification)
                    loadTeisPlanifications(currentProgram.program.id, currentOrgUnit?.id, null, DESCENDANTS)
                    loadOptions(currentProgram.statusSupervision?.dataElement?.id, setStatusSupervisionOptions)
                    loadOptions(currentProgram.statusPayment?.dataElement?.id, setStatusPaymentOptions)
                }
            }
            loadUsers(me?.organisationUnits?.[0]?.id)
            setLoadingOrganisationUnits(false)
        }
        catch (err) {
            setLoadingOrganisationUnits(false)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATION_CRITICAL })
        }
    }

    const loadTeisPlanifications = async (program_id, orgUnit_id, period, ouMode = DESCENDANTS) => {
        try {
            setLoadingTeiList(true)
            const response = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}.json?program=${program_id}&ou=${orgUnit_id}&ouMode=${ouMode}&order=created:DESC&fields=trackedEntityInstance,created,program,orgUnit,enrollments[*],attributes&pageSize=10000`)
            const trackedEntityInstances = response.data.trackedEntityInstances
            setTeiList(trackedEntityInstances)
            setLoadingTeiList(false)
            setCalendarDate(period ? period : selectedPeriod)
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATION_CRITICAL })
            setLoadingTeiList(false)
        }
    }

    const loadDataStoreSupervisionsConfigs = async () => {
        try {
            setLoadingDataStoreSupervisionsConfigs(true)
            const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, null)

            setDataStoreSupervisionsConfigs(response)
            setLoadingDataStoreSupervisionsConfigs(false)
            return response
        } catch (err) {
            setLoadingDataStoreSupervisionsConfigs(false)
            throw err
        }
    }

    const loadDataStoreSupervisionPlanifications = async () => {
        try {
            setLoadingDataStoreSupervisionPlanifications(true)
            const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, null)

            let supervisionList = []
            const eventList = []



            for (let planification of response) {
                for (let sup of planification.supervisions) {
                    if (!supervisionList.map(s => s.id).includes(sup.id)) {
                        supervisionList.push(sup)
                    }
                }
            }

            for (let sup of supervisionList) {
                const payload = {
                    id: sup.id,
                    title: 'Supervision',
                    allDay: true,
                    start: new Date(2015, 3, 0),
                    end: new Date(2015, 3, 1),
                }

                eventList.push(payload)
            }

            setDataStoreSupervisionPlanifications(response)
            setLoadingDataStoreSupervisionPlanifications(false)
        }
        catch (err) {
            setLoadingDataStoreSupervisionPlanifications(false)
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

    const handleSelectPlanification = (value) => {
        setSelectedPlanification(value)
    }

    const handleSelectedPeriod = (event) => {
        setSelectedPeriod(dayjs(event))
    }

    const handleSelectSupervisor = values => setSelectedSupervisors(values.map(sup => users.find(u => u.id === sup)))

    const handleSelectPlanificationUser = value => setSelectedPlanificationUser(users.find(u => u.id === value))

    const filterAndGetPlanfications = () => teiList.reduce((prev, current) => {
        if (selectedProgram.generationType === TYPE_GENERATION_AS_TEI) {
            if (
                selectedPeriod &&
                dayjs(current.created).format('YYYYMM') === dayjs(selectedPeriod).format('YYYYMM') &&
                current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)
            ) {
                const eventDate = current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.events[0]?.eventDate

                const superviseursEvents = selectedProgram?.fieldConfig?.supervisor?.dataElements?.reduce((prevEl, curr) => {
                    const foundedDataValue = current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.events[0]?.dataValues?.find(el => el.dataElement === curr.id)
                    if (foundedDataValue)
                        prevEl.push(foundedDataValue)
                    return prevEl
                }, []) || []

                const superviseurs = superviseursEvents.reduce((prevEl, curr) => {
                    if (curr.value && curr.value?.trim()?.length > 0)
                        prevEl.push(curr.value)
                    return prevEl
                }, [])

                return [
                    ...prev,
                    {
                        trackedEntityInstance: current.trackedEntityInstance,
                        period: eventDate,
                        superviseurs: superviseurs,
                        agent: `${current.attributes?.find(att => att.attribute === selectedProgram?.attributeName?.id)?.value || ''} ${current.attributes?.find(att => att.attribute === selectedProgram?.attributeFirstName?.id)?.value || ''}`,
                        enrollment: current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.enrollment,
                        program: current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.program,
                        orgUnit: current.orgUnit,
                        storedBy: current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.storedBy,
                        libelle: current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.orgUnitName,
                        statusSupervision: dayjs(eventDate).isAfter(dayjs()) ? getDefaultStatusSupervisionIfStatusIsNull() : current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedProgram?.statusSupervision?.dataElement?.id)?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                        statusPayment: current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedProgram?.statusPayment?.dataElement?.id)?.value || getDefaultStatusPaymentIfStatusIsNull()
                    }
                ]
            }
        }

        if (selectedProgram.generationType === TYPE_GENERATION_AS_ENROLMENT) {
            if (selectedPeriod) {
                const enrollmentsList = []
                for (let en of current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)) {
                    if (dayjs(en.enrollmentDate).format('YYYYMM') === dayjs(selectedPeriod).format('YYYYMM')) {
                        enrollmentsList.push(en)
                    }
                }
                return [
                    ...prev,
                    ...enrollmentsList.map(en => ({
                        trackedEntityInstance: en.trackedEntityInstance,
                        agent: `${current.attributes?.find(att => att.attribute === selectedProgram?.attributeName?.id)?.value || ''} ${current.attributes?.find(att => att.attribute === selectedProgram?.attributeFirstName?.id)?.value || ''}`,
                        period: en?.events[0]?.eventDate,
                        enrollment: en.enrollment,
                        program: en.program,
                        superviseurs: selectedProgram?.fieldConfig?.supervisor?.dataElements?.reduce((prevEl, curr) => {
                            const foundedDataValue = en?.events[0]?.dataValues?.find(el => el.dataElement === curr.id)
                            if (foundedDataValue && foundedDataValue.value && foundedDataValue.value?.trim()?.length > 0)
                                prevEl.push(foundedDataValue.value)
                            return prevEl
                        }, []),
                        orgUnit: current.orgUnit,
                        storedBy: en.storedBy,
                        libelle: en.orgUnitName,
                        statusSupervision: dayjs(en?.events[0]?.eventDate).isAfter(dayjs()) ? getDefaultStatusSupervisionIfStatusIsNull() : en?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedProgram?.statusSupervision?.dataElement?.id)?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                        statusPayment: en?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedProgram?.statusPayment?.dataElement?.id)?.value || getDefaultStatusPaymentIfStatusIsNull()
                    }))
                ]
            }
        }

        if (selectedProgram.generationType === TYPE_GENERATION_AS_EVENT) {
            if (selectedPeriod) {
                const eventList = []
                const currentEnrollment = current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]
                for (let event of currentEnrollment?.events || []) {
                    if (dayjs(event.eventDate).format('YYYYMM') === dayjs(selectedPeriod).format('YYYYMM')) {
                        eventList.push(event)
                    }
                }

                return [
                    ...prev,
                    ...eventList.map(ev => ({
                        trackedEntityInstance: currentEnrollment?.trackedEntityInstance,
                        period: ev.eventDate,
                        agent: `${current.attributes?.find(att => att.attribute === selectedProgram?.attributeName?.id)?.value || ''} ${current.attributes?.find(att => att.attribute === selectedProgram?.attributeFirstName?.id)?.value || ''}`,
                        enrollment: currentEnrollment?.enrollment,
                        program: currentEnrollment?.program,
                        orgUnit: currentEnrollment?.orgUnit,
                        storedBy: ev?.storedBy,
                        superviseurs: selectedProgram?.fieldConfig?.supervisor?.dataElements?.reduce((prevEl, curr) => {
                            const foundedDataValue = ev?.dataValues?.find(el => el.dataElement === curr.id)
                            if (foundedDataValue && foundedDataValue.value && foundedDataValue.value?.trim()?.length > 0)
                                prevEl.push(foundedDataValue.value)

                            return prevEl
                        }, []),
                        libelle: currentEnrollment?.orgUnitName,
                        statusSupervision: dayjs(ev.eventDate).isAfter(dayjs()) ? getDefaultStatusSupervisionIfStatusIsNull() : currentEnrollment?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedProgram?.statusSupervision?.dataElement?.id)?.value || getDefaultStatusSupervisionIfStatusIsNull(),
                        statusPayment: currentEnrollment?.events[0]?.dataValues?.find(dv => dv.dataElement === selectedProgram?.statusPayment?.dataElement?.id)?.value || getDefaultStatusPaymentIfStatusIsNull()
                    }))
                ]
            }
        }

        return prev
    }, [])
        .filter(planification => {

            if (selectedPlanification === MES_PLANIFICATIONS)
                return planification.superviseurs?.includes(me?.displayName)

            if (selectedPlanification === PLANIFICATION_PAR_MOI)
                return me?.username?.toLowerCase() === planification.storedBy?.toLowerCase()

            if (selectedPlanification === PLANIFICATION_PAR_TOUS)
                return true

            if (selectedPlanification === PLANIFICATION_PAR_UN_USER)
                return false

            return true
        })
        .sort((a, b) => parseInt(dayjs(b.period).valueOf()) - parseInt(dayjs(a.period).valueOf()))


    const getPieChartDatasForSupervisions = () => ({
        title: {
            text: translate('Supervisions'),
            left: 'center'
        },

        tooltip: {
            trigger: 'item'
        },

        legend: {
            orient: 'vertical',
            bottom: '10',
            left: 'left',
        },

        color: [{ code: SCHEDULED.value, id: null, displayName: SCHEDULED.name }, ...statusSupervisionOptions].map(option => getStatusNameAndColor(option.code).color.background),

        series: [
            {
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                label: { show: false },
                data: [{ code: SCHEDULED.value, id: null, displayName: SCHEDULED.name }, ...statusSupervisionOptions].map(option => {
                    const statusPayload = filterAndGetPlanfications().reduce((prev, curr) => {
                        if (curr.statusSupervision && prev[`${curr.statusSupervision}`]) {
                            prev[`${curr.statusSupervision}`] = { name: getStatusNameAndColor(curr.statusSupervision)?.name, value: prev[`${curr.statusSupervision}`].value + 1 }
                        } else {
                            prev[`${curr.statusSupervision}`] = { name: getStatusNameAndColor(curr.statusSupervision)?.name, value: 1 }
                        }

                        return prev
                    }, {})
                    return statusPayload[option.code] || { name: option.displayName, value: 0 }
                }),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 30,
                        shadowOffsetX: 0,
                        shadowColor: `${BLACK}50`
                    }
                }
            }
        ]

    })

    const getPieChartDatasForPayment = () => ({
        title: {
            text: translate('Paiement'),
            left: 'center'
        },

        tooltip: {
            trigger: 'item'
        },

        legend: {
            orient: 'vertical',
            bottom: '10',
            left: 'left',
        },

        color: statusPaymentOptions.map(option => getStatusNameAndColorForPayment(option.code).color.background),

        series: [
            {
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                label: { show: false },
                data: statusPaymentOptions.map(option => {
                    const statusPayload = filterAndGetPlanfications().reduce((prev, curr) => {
                        if (curr.statusPayment && prev[`${curr.statusPayment}`]) {
                            prev[`${curr.statusPayment}`] = { name: getStatusNameAndColorForPayment(curr.statusPayment)?.name, value: prev[`${curr.statusPayment}`].value + 1 }
                        } else {
                            prev[`${curr.statusPayment}`] = { name: getStatusNameAndColorForPayment(curr.statusPayment)?.name, value: 1 }
                        }

                        return prev
                    }, {})
                    return statusPayload[option.code] || { name: option.displayName, value: 0 }
                }),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 30,
                        shadowOffsetX: 0,
                        shadowColor: `${BLACK}50`
                    }
                }
            }
        ]
    })

    const calculatePourcentageOfSupervision = (value) => {
        const list = [{ id: null, displayName: SCHEDULED.name, code: SCHEDULED.value }, ...statusSupervisionOptions].map(option => {
            const statusPayload = filterAndGetPlanfications().reduce((prev, curr) => {
                if (curr.statusSupervision && prev[`${curr.statusSupervision}`]) {
                    prev[`${curr.statusSupervision}`] = { name: getStatusNameAndColor(curr.statusSupervision)?.name, value: prev[`${curr.statusSupervision}`].value + 1 }
                } else {
                    prev[`${curr.statusSupervision}`] = { name: getStatusNameAndColor(curr.statusSupervision)?.name, value: 1 }
                }

                return prev
            }, {})


            return statusPayload[`${option.code}`]?.value || 0
        })

        let total = 0

        for (let i = 0; i < list.length; i++) {
            total = total + list[i]
        }

        if (total > 0)
            return `${parseFloat((parseInt(value) * 100 / total)).toFixed(2)}%`

        return '0%'
    }

    const calculatePourcentageOfPayment = (value) => {
        const list = statusPaymentOptions.map(option => {
            const statusPayload = filterAndGetPlanfications().reduce((prev, curr) => {
                if (curr.statusPayment && prev[`${curr.statusPayment}`]) {
                    prev[`${curr.statusPayment}`] = { name: getStatusNameAndColorForPayment(curr.statusPayment)?.name, value: prev[`${curr.statusPayment}`].value + 1 }
                } else {
                    prev[`${curr.statusPayment}`] = { name: getStatusNameAndColorForPayment(curr.statusPayment)?.name, value: 1 }
                }

                return prev
            }, {})


            return statusPayload[`${option.code}`]?.value || 0
        })

        let total = 0

        for (let i = 0; i < list.length; i++) {
            total = total + list[i]
        }

        if (total > 0)
            return `${parseFloat((parseInt(value) * 100 / total)).toFixed(2)}%`

        return '0%'
    }


    const getFiveLastPlanifications = () => filterAndGetPlanfications().slice(0, 5).map((planification) => ({
        ...planification,
        key: planification.trackedEntityInstance,
        nom: planification.libelle,
        tei: planification
    }))

    const getCalendarEvents = () =>
        filterAndGetPlanfications()
            .map((planification) => ({
                id: planification.trackedEntityInstance,
                allDay: true,
                title: <div style={{ fontWeight: 'bold', fontSize: '12px', borderRadius: '5px', backgroundColor: getStatusNameAndColor(planification.statusSupervision)?.color?.background, color: getStatusNameAndColor(planification.statusSupervision)?.color?.text, margin: '0px', padding: '3px' }}> {planification.libelle}</div>,
                start: dayjs(planification.period).format('YYYY-MM-DD HH:mm:ss'),
                end: dayjs(planification.period).format('YYYY-MM-DD HH:mm:ss'),
            }))

    const RenderCalendar = () => (
        <Col md={12} sm={24}>
            <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '2px' }} className="my-shadow">
                <div>
                    <Calendar
                        localizer={localizer}
                        events={getCalendarEvents()}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '445px' }}
                        date={dayjs(calendarDate).format('YYYY-MM-DD')}
                        onNavigate={(newDate, view, action) => {
                            setCalendarDate(dayjs(newDate))
                            setSelectedPeriod(dayjs(newDate))

                            if (newDate && selectedProgram?.program?.id && selectedOrganisationUnit?.id) {
                                loadTeisPlanifications(selectedProgram.program?.id, selectedOrganisationUnit.id, newDate)
                            }
                        }}
                        selectable
                    />
                </div>
            </div>

            {
                0 > 1 && <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '2px', marginTop: '10px' }} className="my-shadow">
                    <ReactEchart
                        option={analyleLineOptions}
                        style={{ height: '300px', width: '100%' }}
                    />
                    Single value
                </div>
            }

            <div style={{ marginTop: '10px' }}>
                <Card size='small' className='my-shadow'>
                    <Row gutter={[10, 10]}>
                        {
                            [{ id: null, displayName: SCHEDULED.name, code: SCHEDULED.value }, ...statusSupervisionOptions].map(option => {
                                const statusPayload = filterAndGetPlanfications().reduce((prev, curr) => {
                                    if (curr.statusSupervision && prev[`${curr.statusSupervision}`]) {
                                        prev[`${curr.statusSupervision}`] = { name: getStatusNameAndColor(curr.statusSupervision)?.name, value: prev[`${curr.statusSupervision}`].value + 1 }
                                    } else {
                                        prev[`${curr.statusSupervision}`] = { name: getStatusNameAndColor(curr.statusSupervision)?.name, value: 1 }
                                    }

                                    return prev
                                }, {})

                                return (
                                    <Col flex='auto'>
                                        <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', marginBottom: '2px', padding: '10px', height: '100%', borderLeft: `3px solid ${getStatusNameAndColor(option.code)?.color?.background}` }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: `${getStatusNameAndColor(option.code)?.color?.background}`, textAlign: 'center', fontSize: '13px' }}>
                                                    <div style={{ backgroundColor: `${getStatusNameAndColor(option.code)?.color?.background}`, padding: '4px', color: `${getStatusNameAndColor(option.code)?.color?.text}` }}>
                                                        {option.displayName}
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '20px', borderRight: '1px solid #ccc', paddingRight: '20px' }}>{statusPayload[option.code]?.value || 0}</span>
                                                    <span style={{ paddingLeft: '20px', color: `${BLACK}90`, fontSize: '13px' }}> {calculatePourcentageOfSupervision(statusPayload[option.code]?.value || 0)} </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Card>
            </div>

            {
                selectedProgram?.planificationType === AGENT && (
                    <div style={{ marginTop: '10px' }}>
                        <Card size='small' className='my-shadow'>
                            <Row gutter={[10, 10]}>
                                {
                                    statusPaymentOptions.map(option => {
                                        const statusPayload = filterAndGetPlanfications().reduce((prev, curr) => {
                                            if (curr.statusPayment && prev[`${curr.statusPayment}`]) {
                                                prev[`${curr.statusPayment}`] = { name: getStatusNameAndColorForPayment(curr.statusPayment)?.name, value: prev[`${curr.statusPayment}`].value + 1 }
                                            } else {
                                                prev[`${curr.statusPayment}`] = { name: getStatusNameAndColorForPayment(curr.statusPayment)?.name, value: 1 }
                                            }

                                            return prev
                                        }, {})

                                        return (
                                            <Col flex='auto'>
                                                <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', marginBottom: '2px', padding: '10px', height: '100%', borderLeft: `3px solid ${getStatusNameAndColorForPayment(option.code)?.color?.background}` }}>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', color: `${getStatusNameAndColorForPayment(option.code)?.color?.background}`, textAlign: 'center' }}>
                                                            <div style={{ backgroundColor: `${getStatusNameAndColorForPayment(option.code)?.color?.background}`, fontSize: '13px', padding: '4px', color: `${getStatusNameAndColorForPayment(option.code)?.color?.text}` }}>
                                                                {option.displayName}
                                                            </div>
                                                        </div>
                                                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                                            <span style={{ fontWeight: 'bold', fontSize: '20px', borderRight: '1px solid #ccc', paddingRight: '20px' }}>{statusPayload[option.code]?.value || 0}</span>
                                                            <span style={{ paddingLeft: '20px', color: `${BLACK}90`, fontSize: '13px' }}> {calculatePourcentageOfPayment(statusPayload[option.code]?.value || 0)} </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Card>
                    </div>
                )
            }
        </Col>
    )

    const getStatusNameAndColor = status => {

        if (status === NA.value) {
            return { name: translate(`${NA.name}`), color: { background: GRAY_DARK, text: WHITE } }
        }

        if (status === CANCELED.value) {
            return { name: translate(`${CANCELED.name}`), color: { background: RED, text: WHITE } }
        }

        if (status === PENDING_VALIDATION.value) {
            return { name: translate(`${PENDING_VALIDATION.name}`), color: { background: ORANGE, text: WHITE } }
        }

        if (status === COMPLETED.value) {
            return { name: translate(`${COMPLETED.name}`), color: { background: GREEN, text: WHITE } }
        }

        if (status === SCHEDULED.value) {
            return { name: translate(`${SCHEDULED.name}`), color: { background: BLUE, text: WHITE } }
        }

        return { name: translate(`${SCHEDULED.name}`), color: { background: BLUE, text: WHITE } }

    }

    const getStatusNameAndColorForPayment = status => {
        if (status === PAYMENT_DONE.value) {
            return { name: translate(`${PAYMENT_DONE.name}`), color: { background: GREEN, text: WHITE } }
        }

        if (status === PENDING_PAYMENT.value) {
            return { name: translate(`${PENDING_PAYMENT.name}`), color: { background: ORANGE, text: WHITE } }
        }

        if (status === NA.value) {
            return { name: translate(`${NA.name}`), color: { background: GRAY_DARK, text: WHITE } }
        }

        return { name: translate(`${NA.name}`), color: { background: GRAY_DARK, text: WHITE } }

    }

    const columns = () => selectedProgram?.planificationType === AGENT ? [
        {
            title: translate('Agent_0rg_Unit'),
            key: 'agent',
            dataIndex: 'tei',
            render: tei => (
                <>
                    {
                        tei.agent?.trim()?.length > 0 ?
                            <div>
                                <span style={{ fontSize: '13px' }}>{tei?.agent}</span>
                                <span style={{ fontSize: '12px', color: '#00000090', marginLeft: '5px' }}>( {tei?.libelle}) </span>
                            </div> :
                            <div>
                                <span style={{ color: '#00000090', fontSize: '13px' }}>{tei?.libelle} </span>
                            </div>
                    }

                </>
            )
        },
        { title: translate('Periode'), key: 'period', dataIndex: 'period', render: value => <div style={{ fontSize: '13px' }}>{dayjs(value).format('YYYY-MM-DD')} </div> },
        {
            title: translate('Status_Supervision'), key: 'statusSupervision', dataIndex: 'statusSupervision', width: '150px',
            render: value => (
                <>
                    <span className='text-truncate-one' title={getStatusNameAndColor(value)?.name} style={{ fontWeight: 'bold', textAlign: 'center', background: getStatusNameAndColor(value)?.color?.background, color: getStatusNameAndColor(value)?.color?.text, padding: '3px', fontSize: '12px', borderRadius: '5px' }}>
                        {getStatusNameAndColor(value)?.name}
                    </span>
                </>
            )
        },
        {
            title: translate('Actions'), key: 'action', width: '50px', dataIndex: 'tei', render: tei => (
                <div style={{ textAlign: 'center', }}>
                    <a
                        target='_blank'
                        href={`${SERVER_URL}/dhis-web-tracker-capture/index.html#/dashboard?tei=${tei.trackedEntityInstance}&program=${tei.program}&ou=${tei.orgUnit}`}
                        style={{ cursor: 'pointer' }}
                    >
                        <IoMdOpen title={translate('Ouvrir_Dans_Le_Tracker')} style={{ fontSize: '18px', color: BLUE, cursor: 'pointer' }} />
                    </a>
                </div>
            )
        }
    ] :
        [
            { title: translate('Unite_Organisation'), key: 'nom', dataIndex: 'nom' },
            { title: translate('Periode'), key: 'period', dataIndex: 'period', render: value => <div style={{ fontSize: '13px' }}>{dayjs(value).format('YYYY-MM-DD')} </div> },
            {
                title: translate('Status_Supervision'), key: 'statusSupervision', dataIndex: 'statusSupervision', width: '150px',
                render: value => (
                    <>
                        <span className='text-truncate-one' title={getStatusNameAndColor(value)?.name} style={{ fontWeight: 'bold', textAlign: 'center', background: getStatusNameAndColor(value)?.color?.background, color: getStatusNameAndColor(value)?.color?.text, padding: '3px', fontSize: '12px', borderRadius: '5px' }}>
                            {getStatusNameAndColor(value)?.name}
                        </span>
                    </>
                )
            },
            {
                title: translate('Actions'), key: 'action', width: '50px', dataIndex: 'tei', render: tei => (
                    <div style={{ textAlign: 'center', }}>
                        <a
                            target='_blank'
                            href={`${SERVER_URL}/dhis-web-tracker-capture/index.html#/dashboard?tei=${tei.trackedEntityInstance}&program=${tei.program}&ou=${tei.orgUnit}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <IoMdOpen title={translate('Ouvrir_Dans_Le_Tracker')} style={{ fontSize: '18px', color: BLUE, cursor: 'pointer' }} />
                        </a>
                    </div>
                )
            }
        ]

    const RenderCharts = () => (
        <Col md={12} sm={24}>
            <Row gutter={[8, 8]}>
                <Col md={24}>
                    <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', marginBottom: '2px', padding: '10px', height: '100%' }}>
                        <Table
                            size='small'
                            columns={columns()}
                            dataSource={getFiveLastPlanifications()}
                            pagination={false}
                            style={{ height: '100%' }}
                        />
                    </div>
                </Col>
                <Col sm={24} md={24}>
                    {0 > 1 && <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', marginBottom: '2px', padding: '5px' }}>
                        <MapView
                            coordinates={coordinates}
                            style={{ height: '500px' }}
                        />
                    </div>
                    }

                    <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '10px', marginBottom: '2px', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            teiList.length === 0 && (<div style={{ fontWeight: 'bold', color: `${BLACK}90` }}> {translate('Aucune_donnees_Disponibles')} !</div>)
                        }
                        {
                            teiList.length > 0 && (
                                <ReactEchart
                                    style={{ height: selectedProgram?.planificationType === AGENT ? '448px' : '302px', width: '100%' }}
                                    option={getPieChartDatasForSupervisions()}
                                />
                            )
                        }
                    </div>

                </Col>
                {
                    0 > 1 && selectedProgram?.planificationType === AGENT && (
                        <Col md={12} sm={24}>
                            <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '10px', marginBottom: '2px', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                {
                                    teiList.length === 0 && (<div style={{ fontWeight: 'bold', color: `${BLACK}90` }}> {translate('Aucune_donnees_Disponibles')} !</div>)
                                }
                                {
                                    teiList.length > 0 && (
                                        <ReactEchart
                                            style={{ height: '302px', width: '100%' }}
                                            option={getPieChartDatasForPayment()}
                                        />
                                    )
                                }
                            </div>
                        </Col>
                    )
                }
            </Row>
        </Col>
    )

    const handleSearch = () => {
        if (selectedPeriod && selectedOrganisationUnit && selectedProgram) {
            loadTeisPlanifications(selectedProgram.program?.id, selectedOrganisationUnit.id)
        }
    }

    const loadOptions = async (dataElementId, setState) => {
        try {
            if (!dataElementId)
                throw new Error(translate('Element_De_Donnee_Introuvable'))

            const response = await axios.get(`${DATA_ELEMENT_OPTION_SETS}/${dataElementId}.json?fields=optionSet[options[id,code,displayName]]`)
            setState && setState(response.data.optionSet?.options || [])
        } catch (err) {
            setState && setState([])
        }
    }

    const handleSelectProgram = (value) => {
        if (value) {
            const supFound = dataStoreSupervisionsConfigs.find(d => d.program?.id === value)
            setTeiList([])
            setSelectedProgram(supFound)
            loadOptions(supFound.statusPayment?.dataElement?.id, setStatusPaymentOptions)
            loadOptions(supFound.statusSupervision?.dataElement?.id, setStatusSupervisionOptions)
        }
    }

    const RenderFilters = () => (
        <>
            <div className='my-shadow' style={{ backgroundColor: '#fff', padding: '10px', marginTop: '5px', marginBottom: '20px', borderRadius: '8px' }}>
                <Row gutter={[8, 8]} align='middle'>
                    <Col sm={24} md={4}>
                        <div style={{ marginBottom: '2px' }}>{translate('Programme')}</div>
                        <Select
                            placeholder={translate('Programme')}
                            onChange={handleSelectProgram}
                            value={selectedProgram?.program?.id}
                            style={{ width: '100%' }}
                            options={dataStoreSupervisionsConfigs.map(d => ({ value: d.program?.id, label: d.program?.displayName }))}
                            loading={loadingDataStoreSupervisionsConfigs}
                        />
                    </Col>
                    <Col sm={24} md={5}>
                        <div style={{ marginBottom: '2px' }}>{translate('Unites_Organisation')}</div>
                        <OrganisationUnitsTree
                            meOrgUnitId={me?.organisationUnits[0]?.id}
                            orgUnits={organisationUnits}
                            currentOrgUnits={selectedOrganisationUnit}
                            setCurrentOrgUnits={setSelectedOrganisationUnit}
                            loadingOrganisationUnits={loadingOrganisationUnits}
                            setLoadingOrganisationUnits={setLoadingOrganisationUnits}
                        />
                    </Col>
                    <Col sm={24} md={3}>
                        <div style={{ marginBottom: '2px' }}>{translate('Periode')}</div>
                        <DatePicker
                            picker="month"
                            style={{ width: '100%' }}
                            placeholder={translate('Periode')}
                            onChange={handleSelectedPeriod}
                            value={selectedPeriod}
                            allowClear={false}
                        />
                    </Col>


                    <Col sm={24} md={4}>
                        <div style={{ marginBottom: '2px' }}>{translate('Planifier_Par')} </div>
                        <Select
                            placeholder={translate('Planifier_Par')}
                            onChange={handleSelectPlanification}
                            value={selectedPlanification}
                            style={{ width: '100%' }}
                            options={[
                                {
                                    value: MES_PLANIFICATIONS,
                                    label: translate('My_Planifications'),
                                },
                                {
                                    value: PLANIFICATION_PAR_MOI,
                                    label: translate('Planned_By_Me'),
                                },
                                {
                                    value: PLANIFICATION_PAR_TOUS,
                                    label: translate('Tous'),
                                },
                            ]}
                        />
                    </Col>
                    {
                        0 > 1 && selectedPlanification === PLANIFICATION_PAR_UN_USER && users.length > 0 && (
                            <Col sm={24} md={4}>
                                <div style={{ marginBottom: '2px' }}>{translate('Utilisateurs')}</div>
                                <Select
                                    placeholder={translate('Utilisateurs')}
                                    style={{ width: '100%' }}
                                    onChange={handleSelectPlanificationUser}
                                    value={selectedPlanificationUser?.id}
                                    options={users.map(user => ({ label: user.displayName, value: user.id }))}
                                />
                            </Col>
                        )
                    }

                    {
                        0 > 1 && (
                            <Col sm={24} md={3}>
                                <div style={{ marginBottom: '2px' }}>{translate('Superviseurs')}</div>
                                <Select
                                    placeholder={translate('Superviseurs')}
                                    style={{ width: '100%' }}
                                    loading={loadingUsers}
                                    mode='multiple'
                                    onChange={handleSelectSupervisor}
                                    value={selectedSupervisors.map(sup => sup.id)}
                                    options={users.map(user => ({ label: user.displayName, value: user.id }))}
                                />
                            </Col>
                        )
                    }

                    <Col sm={24} md={1}>
                        <div style={{ marginTop: '20px' }}>
                            <Button onClick={handleSearch} loading={loadingTeiList} primary icon={<AiOutlineSearch style={{ fontSize: '20px' }} />}>
                                {translate('Appliquer')}
                            </Button>
                        </div>
                    </Col>

                </Row>
            </div>
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

    useEffect(() => {
        me?.organisationUnits?.length > 0 && loadOrganisationUnits()
    }, [me])

    return (
        <>
            <div style={{ padding: '10px', width: '100%' }}>
                {RenderFilters()}
                <Row gutter={[8, 8]}>
                    {RenderCalendar()}
                    {RenderCharts()}
                </Row>
                {RenderNoticeBox()}
                <MyNotification notification={notification} setNotification={setNotification} />
            </div>
        </>
    )
}


export default Dashboard