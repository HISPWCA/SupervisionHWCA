import { useState, useEffect } from 'react'
import { Col, DatePicker, Row, Select, Table } from 'antd'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import ReactEchart from 'echarts-for-react'
import moment from 'moment'
import axios from 'axios';
import { ORGANISATION_UNITS_ROUTE, TRACKED_ENTITY_INSTANCES_ROUTE, USERS_ROUTE } from '../utils/api.routes'
import OrganisationUnitsTree from './OrganisationUnitsTree'
import { DESCENDANTS, NOTICE_BOX_DEFAULT, NOTIFICATON_CRITICAL, PLANIFICATION_PAR_MOI, PLANIFICATION_PAR_TOUS, PLANIFICATION_PAR_UN_USER, TYPE_GENERATION_AS_ENROLMENT, TYPE_GENERATION_AS_EVENT, TYPE_GENERATION_AS_TEI } from '../utils/constants'
import { Chart } from "react-google-charts"
import MapView from './MapView'
import { loadDataStore } from '../utils/functions'
import { IoMdOpen } from 'react-icons/io'
import { BLUE } from '../utils/couleurs'
import { AiOutlineSearch } from 'react-icons/ai'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { MyNoticeBox } from './MyNoticeBox'
import MyNotification from './MyNotification'
import { Button } from '@dhis2/ui'
const quarterOfYear = require('dayjs/plugin/quarterOfYear')
const weekOfYear = require('dayjs/plugin/weekOfYear')

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(customParseFormat)




const localizer = momentLocalizer(moment)
const now = new Date()

const events = [
    {
        id: 0,
        title: 'All Day Event very long title',
        allDay: true,
        start: new Date(2015, 3, 0),
        end: new Date(2015, 3, 1),
    },
    {
        id: 1,
        title: 'Long Event',
        start: new Date(2015, 3, 7),
        end: new Date(2015, 3, 10),
    },

    {
        id: 2,
        title: 'DTS STARTS',
        start: new Date(2016, 2, 13, 0, 0, 0),
        end: new Date(2016, 2, 20, 0, 0, 0),
    },

    {
        id: 3,
        title: 'DTS ENDS',
        start: new Date(2016, 10, 6, 0, 0, 0),
        end: new Date(2016, 10, 13, 0, 0, 0),
    },

    {
        id: 4,
        title: 'Some Event',
        start: new Date(2015, 3, 9, 0, 0, 0),
        end: new Date(2015, 3, 10, 0, 0, 0),
    },
    {
        id: 5,
        title: 'Conference',
        start: new Date(2015, 3, 11),
        end: new Date(2015, 3, 13),
        desc: 'Big conference for important people',
    },
    {
        id: 6,
        title: 'Meeting',
        start: new Date(2015, 3, 12, 10, 30, 0, 0),
        end: new Date(2015, 3, 12, 12, 30, 0, 0),
        desc: 'Pre-meeting meeting, to prepare for the meeting',
    },
    {
        id: 7,
        title: 'Lunch',
        start: new Date(2015, 3, 12, 12, 0, 0, 0),
        end: new Date(2015, 3, 12, 13, 0, 0, 0),
        desc: 'Power lunch',
    },
    {
        id: 8,
        title: 'Meeting',
        start: new Date(2015, 3, 12, 14, 0, 0, 0),
        end: new Date(2015, 3, 12, 15, 0, 0, 0),
    },
    {
        id: 9,
        title: 'Happy Hour',
        start: new Date(2015, 3, 12, 17, 0, 0, 0),
        end: new Date(2015, 3, 12, 17, 30, 0, 0),
        desc: 'Most important meal of the day',
    },
    {
        id: 10,
        title: 'Dinner',
        start: new Date(2015, 3, 12, 20, 0, 0, 0),
        end: new Date(2015, 3, 12, 21, 0, 0, 0),
    },
    {
        id: 11,
        title: 'Planning Meeting with Paige',
        start: new Date(2015, 3, 13, 8, 0, 0),
        end: new Date(2015, 3, 13, 10, 30, 0),
    },
    {
        id: 11.1,
        title: 'Inconvenient Conference Call',
        start: new Date(2015, 3, 13, 9, 30, 0),
        end: new Date(2015, 3, 13, 12, 0, 0),
    },
    {
        id: 11.2,
        title: "Project Kickoff - Lou's Shoes",
        start: new Date(2015, 3, 13, 11, 30, 0),
        end: new Date(2015, 3, 13, 14, 0, 0),
    },
    {
        id: 11.3,
        title: 'Quote Follow-up - Tea by Tina',
        start: new Date(2015, 3, 13, 15, 30, 0),
        end: new Date(2015, 3, 13, 16, 0, 0),
    },
    {
        id: 12,
        title: 'Late Night Event',
        start: new Date(2015, 3, 17, 19, 30, 0),
        end: new Date(2015, 3, 18, 2, 0, 0),
    },
    {
        id: 12.5,
        title: 'Late Same Night Event',
        start: new Date(2015, 3, 17, 19, 30, 0),
        end: new Date(2015, 3, 17, 23, 30, 0),
    },
    {
        id: 13,
        title: 'Multi-day Event',
        start: new Date(2015, 3, 20, 19, 30, 0),
        end: new Date(2015, 3, 22, 2, 0, 0),
    },
    {
        id: 14,
        title: 'Today',
        start: new Date(new Date().setHours(new Date().getHours() - 3)),
        end: new Date(new Date().setHours(new Date().getHours() + 3)),
    },
    {
        id: 15,
        title: 'Point in Time Event',
        start: now,
        end: now,
    },
    {
        id: 16,
        title: 'Video Record',
        start: new Date(2015, 3, 14, 15, 30, 0),
        end: new Date(2015, 3, 14, 19, 0, 0),
    },
    {
        id: 17,
        title: 'Dutch Song Producing',
        start: new Date(2015, 3, 14, 16, 30, 0),
        end: new Date(2015, 3, 14, 20, 0, 0),
    },
    {
        id: 18,
        title: 'Itaewon Halloween Meeting',
        start: new Date(2015, 3, 14, 16, 30, 0),
        end: new Date(2015, 3, 14, 17, 30, 0),
    },
    {
        id: 19,
        title: 'Online Coding Test',
        start: new Date(2015, 3, 14, 17, 30, 0),
        end: new Date(2015, 3, 14, 20, 30, 0),
    },
    {
        id: 20,
        title: 'An overlapped Event',
        start: new Date(2015, 3, 14, 17, 0, 0),
        end: new Date(2015, 3, 14, 18, 30, 0),
    },
    {
        id: 21,
        title: 'Phone Interview',
        start: new Date(2015, 3, 14, 17, 0, 0),
        end: new Date(2015, 3, 14, 18, 30, 0),
    },
    {
        id: 22,
        title: 'Cooking Class',
        start: new Date(2015, 3, 14, 17, 30, 0),
        end: new Date(2015, 3, 14, 19, 0, 0),
    },
    {
        id: 23,
        title: 'Go to the gym',
        start: new Date(2015, 3, 14, 18, 30, 0),
        end: new Date(2015, 3, 14, 20, 0, 0),
    },
    {
        id: 24,
        title: 'DST ends on this day (Europe)',
        start: new Date(2022, 9, 30, 0, 0, 0),
        end: new Date(2022, 9, 30, 4, 30, 0),
    },
    {
        id: 25,
        title: 'DST ends on this day (America)',
        start: new Date(2022, 10, 6, 0, 0, 0),
        end: new Date(2022, 10, 6, 4, 30, 0),
    },
    {
        id: 26,
        title: 'DST starts on this day (America)',
        start: new Date(2023, 2, 12, 0, 0, 0),
        end: new Date(2023, 2, 12, 4, 30, 0),
    },
    {
        id: 27,
        title: 'DST starts on this day (Europe)',
        start: new Date(2023, 2, 26, 0, 0, 0),
        end: new Date(2023, 2, 26, 4, 30, 0),
    },
    {
        id: 28,
        title: <div style={{ fontWeight: 'bold', backgroundColor: 'yellow', color: '#000', margin: '0px', padding: '5px' }}>Je suis un simple text customizer</div>,
        start: new Date(2023, 4, 1, 0, 0, 0),
        end: new Date(2023, 4, 3, 4, 30, 0),
        allDay: true
    },
    {
        id: 29,
        title: <div style={{ fontWeight: 'bold', backgroundColor: 'green', color: '#fff', margin: '0px', padding: '5px' }}>Je suis une couleur verte</div>,
        start: new Date(2023, 4, 10, 0, 0, 0),
        end: new Date(2023, 4, 10, 4, 30, 0),
    }
]

export const Dashboard = ({ me }) => {

    const [organisationUnits, setOrganisationUnits] = useState([])
    const [users, setUsers] = useState([])
    const [dataStoreAnalyses, setDataStoreAnalyses] = useState([])
    const [dataStoreSupervisionsConfigs, setDataStoreSupervisionsConfigs] = useState([])
    const [dataStoreSupervisionPlanifications, setDataStoreSupervisionPlanifications] = useState([])
    const [calendarEvents, setCalendarEvents] = useState([])
    const [teiList, setTeiList] = useState([])
    const [noticeBox, setNoticeBox] = useState({ show: false, message: null, title: null, type: NOTICE_BOX_DEFAULT })
    const [notification, setNotification] = useState({ show: false, message: null, type: null })

    const [selectedOrganisationUnit, setSelectedOrganisationUnit] = useState(null)
    const [selectedPlanification, setSelectedPlanification] = useState(PLANIFICATION_PAR_MOI)
    const [selectedPeriod, setSelectedPeriod] = useState(dayjs(new Date()))
    const [selectedPlanificationUser, setSelectedPlanificationUser] = useState(null)
    const [selectedSupervisors, setSelectedSupervisors] = useState([])
    const [selectedProgram, setSelectedProgram] = useState(null)

    const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [loadingDataStoreAnalyses, setLoadingDataStoreAnalyses] = useState(false)
    const [loadingAnalyticsAnalysisConfigData, setLoadingAnalyticsAnalysisConfigData] = useState(false)
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

    const mapData = [
        ["Task", "Hours per Day"],
        ["Work", 11],
        ["Eat", 2],
        ["Commute", 2],
        ["Watch TV", 2],
        ["Sleep", 7],
    ]

    const mapOptions = {
        title: "",
        is3D: true,
        legend: 'bottom'
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
                const currentPlanification = PLANIFICATION_PAR_MOI

                if (currentProgram) {
                    setSelectedProgram(currentProgram)
                    setSelectedOrganisationUnit(currentOrgUnit)
                    setSelectedPeriod(currentPeriod)
                    setSelectedPlanification(currentPlanification)
                    loadTeisPlanifications(currentProgram.program.id, currentOrgUnit?.id, DESCENDANTS)
                }
            }
            loadUsers(me?.organisationUnits?.[0]?.id)
            setLoadingOrganisationUnits(false)
        }
        catch (err) {
            console.log(err)
            setLoadingOrganisationUnits(false)
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
        }
    }


    const loadTeisPlanifications = async (program_id, orgUnit_id, ouMode = DESCENDANTS) => {
        try {
            setLoadingTeiList(true)
            const response = await axios.get(`${TRACKED_ENTITY_INSTANCES_ROUTE}.json?program=${program_id}&ou=${orgUnit_id}&ouMode=${ouMode}&order=created:DESC&fields=trackedEntityInstance,created,program,orgUnit,enrollments[*]`)
            const trackedEntityInstances = response.data.trackedEntityInstances
            setTeiList(trackedEntityInstances)
            setLoadingTeiList(false)
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.message || err.message, type: NOTIFICATON_CRITICAL })
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
            console.log(err)
            setLoadingDataStoreSupervisionsConfigs(false)
            throw err
        }
    }

    const loadDataStoreSupervisionPlanifications = async () => {
        try {
            setLoadingDataStoreSupervisionPlanifications(true)
            const response = await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, null)
            console.log(response)

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
                    title: 'All Day Event very long title',
                    allDay: true,
                    start: new Date(2015, 3, 0),
                    end: new Date(2015, 3, 1),
                }

                eventList.push(payload)
            }
            setCalendarEvents(eventList)

            setDataStoreSupervisionPlanifications(response)
            setLoadingDataStoreSupervisionPlanifications(false)
        }
        catch (err) {
            console.log(err)
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
            console.log(err)
            setLoadingUsers(false)
        }
    }


    const handleSelectPlanification = (value) => {
        setSelectedPlanification(value)
    }

    const handleSelectedPeriod = (event) => {
        setSelectedPeriod(dayjs((event)))
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
                return [
                    ...prev,
                    {
                        trackedEntityInstance: current.trackedEntityInstance,
                        period: current.created,
                        enrollment: current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.enrollment,
                        program: current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.program,
                        orgUnit: current.orgUnit,
                        storedBy: current.enrollments?.filter(en => en.program === selectedProgram?.program?.id)[0]?.storedBy
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
                        period: en.enrollmentDate,
                        enrollment: en.enrollment,
                        program: en.program,
                        orgUnit: current.orgUnit,
                        storedBy: en.storedBy
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
                        enrollment: currentEnrollment?.enrollment,
                        program: currentEnrollment?.enrollments,
                        orgUnit: currentEnrollment?.orgUnit,
                        storedBy: ev.storedBy
                    }))
                ]
            }
        }

        return prev
    }, [])
        .filter(planification => {
            if (selectedPlanification === PLANIFICATION_PAR_MOI)
                return me?.username?.toLowerCase() === planification.storedBy?.toLowerCase()

            if (selectedPlanification === PLANIFICATION_PAR_TOUS)
                return true

            if (selectedPlanification === PLANIFICATION_PAR_UN_USER)
                return false

            return true
        })


    const getFiveLastPlanifications = () => filterAndGetPlanfications().slice(0, 5).map((planification, index) => ({
        key: index,
        nom: dayjs(planification.period).format('YYYY-MM-DD HH:mm:ss'),
        tei: planification
    }))

    const getCalendarEvents = () => filterAndGetPlanfications().map((planification, index) => ({
        id: index,
        title: dayjs(planification.period).format('YYYY-MM-DD HH:mm:ss'),
        allDay: true,
        start: dayjs(planification.period).format('YYYY-MM-DD HH:mm:ss'),
        end: dayjs(planification.period).format('YYYY-MM-DD HH:mm:ss'),
    }))

    const RenderCalendar = () => (
        <Col md={12} sm={24}> {console.log("tei: ", filterAndGetPlanfications())}
            <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '2px' }} className="my-shadow">
                <div>
                    <Calendar
                        localizer={localizer}
                        events={getCalendarEvents()}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '445px' }}
                        selectable
                        onSelectEvent={event => alert(JSON.stringify(event, null, 4))}
                        onSelectSlot={event => alert(JSON.stringify(event, null, 4))}
                    />
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '2px', marginTop: '10px' }} className="my-shadow">
                <ReactEchart
                    option={analyleLineOptions}
                    style={{ height: '300px', width: '100%' }}
                />
            </div>

        </Col>
    )

    const RenderCharts = () => (
        <Col md={12} sm={24}>
            <Row gutter={[8, 8]}>
                <Col md={10}>
                    <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '10px', marginBottom: '2px', height: '100%' }}>
                        <Chart
                            chartType="PieChart"
                            data={mapData}
                            options={mapOptions}
                            width="100%"
                            height="100%"
                        />
                    </div>
                </Col>
                <Col md={14}>
                    <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', marginBottom: '2px', padding: '10px', height: '100%' }}>
                        <Table
                            size='small'
                            columns={
                                [
                                    { title: 'Nom', key: 'nom', dataIndex: 'nom' },
                                    // { title: 'Status', key: 'status', dataIndex: 'status', width: '100px' },
                                    {
                                        title: 'Actions', key: 'action', width: '50px', dataIndex: 'tei', render: tei => <div style={{ textAlign: 'center' }}>
                                            <IoMdOpen title='Ouvrir' onClick={() => alert(JSON.stringify(tei, null, 5))} style={{ fontSize: '18px', color: BLUE, cursor: 'pointer' }} />
                                        </div>
                                    }
                                ]
                            }
                            dataSource={getFiveLastPlanifications()}
                            pagination={false}
                            style={{ height: '100%' }}
                        />
                    </div>
                </Col>
                <Col md={24}>
                    <div className='my-shadow' style={{ backgroundColor: '#fff', borderRadius: '8px', marginBottom: '2px', padding: '5px' }}>
                        <MapView
                            coordinates={coordinates}
                            style={{ height: '500px' }}
                        />
                    </div>
                </Col>
            </Row>
        </Col>
    )

    const handleSearch = () => {
        if (selectedPeriod && selectedOrganisationUnit && selectedProgram) {
            loadTeisPlanifications(selectedProgram.program?.id, selectedOrganisationUnit.id)
        }
    }

    const handleSelectProgram = (value) => {
        setTeiList([])
        setSelectedProgram(dataStoreSupervisionsConfigs.find(d => d.program?.id === value))
    }

    const RenderFilters = () => (
        <>
            <div className='my-shadow' style={{ backgroundColor: '#fff', padding: '10px', marginTop: '5px', marginBottom: '20px', borderRadius: '8px' }}>
                <Row gutter={[8, 8]} align='middle'>
                    <Col sm={24} md={4}>
                        <div style={{ marginBottom: '2px' }}>Programme</div>
                        <Select
                            placeholder="Programme"
                            onChange={handleSelectProgram}
                            value={selectedProgram?.program?.id}
                            style={{ width: '100%' }}
                            options={dataStoreSupervisionsConfigs.map(d => ({ value: d.program?.id, label: d.program?.displayName }))}
                            loading={loadingDataStoreSupervisionsConfigs}
                        />
                    </Col>
                    <Col sm={24} md={3}>
                        <div style={{ marginBottom: '2px' }}>Période</div>
                        <DatePicker
                            onChange={handleSelectedPeriod}
                            picker="month"
                            value={selectedPeriod}
                            style={{ width: '100%' }}
                            placeholder="Période"
                            allowClear={false}
                        />
                    </Col>
                    <Col sm={24} md={5}>
                        <div style={{ marginBottom: '2px' }}>Unités d'organisation</div>
                        <OrganisationUnitsTree
                            meOrgUnitId={me?.organisationUnits[0]?.id}
                            orgUnits={organisationUnits}
                            currentOrgUnits={selectedOrganisationUnit}
                            setCurrentOrgUnits={setSelectedOrganisationUnit}
                            loadingOrganisationUnits={loadingOrganisationUnits}
                            setLoadingOrganisationUnits={setLoadingOrganisationUnits}
                        />
                    </Col>

                    <Col sm={24} md={4}>
                        <div style={{ marginBottom: '2px' }}>Planifier par </div>
                        <Select
                            placeholder="Planification"
                            onChange={handleSelectPlanification}
                            value={selectedPlanification}
                            style={{ width: '100%' }}
                            options={[
                                {
                                    value: PLANIFICATION_PAR_MOI,
                                    label: 'Moi',
                                },
                                {
                                    value: PLANIFICATION_PAR_TOUS,
                                    label: 'Tous',
                                },
                                {
                                    value: PLANIFICATION_PAR_UN_USER,
                                    label: 'Un utilisateur',
                                },
                            ]}
                        />
                    </Col>
                    {
                        selectedPlanification === PLANIFICATION_PAR_UN_USER && users.length > 0 && (
                            <Col sm={24} md={4}>
                                <div style={{ marginBottom: '2px' }}>Utilisateurs</div>
                                <Select
                                    placeholder="Utilisateurs"
                                    style={{ width: '100%' }}
                                    onChange={handleSelectPlanificationUser}
                                    value={selectedPlanificationUser?.id}
                                    options={users.map(user => ({ label: user.displayName, value: user.id }))}
                                />
                            </Col>
                        )
                    }

                    {
                        <Col sm={24} md={3}>
                            <div style={{ marginBottom: '2px' }}>Superviseurs</div>
                            <Select
                                placeholder="Superviseurs"
                                style={{ width: '100%' }}
                                loading={loadingUsers}
                                mode='multiple'
                                onChange={handleSelectSupervisor}
                                value={selectedSupervisors.map(sup => sup.id)}
                                options={users.map(user => ({ label: user.displayName, value: user.id }))}
                            />
                        </Col>
                    }

                    <Col sm={24} md={1}>
                        <div style={{ marginTop: '20px' }}>
                            <Button onClick={handleSearch} loading={loadingTeiList} primary icon={<AiOutlineSearch style={{ fontSize: '20px' }} />} />
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