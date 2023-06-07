import { useState, useEffect } from 'react'
import { Col, DatePicker, Row, Select, Table } from 'antd'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import ReactEchart from 'echarts-for-react'
import moment from 'moment'
import axios from 'axios';
import { ME_ROUTE, ORGANISATION_UNITS_ROUTE, USERS_ROUTE } from '../utils/api.routes'
import OrganisationUnitsTree from './OrganisationUnitsTree'
import meStore from '../stores/meStore'
import { PLANIFICATION_PAR_MOI, PLANIFICATION_PAR_TOUS, PLANIFICATION_PAR_UN_USER } from '../utils/constants'
import usersStore from '../stores/usersStore'
import dayjs from 'dayjs'
import { Chart } from "react-google-charts"
import MapView from './MapView'
import { loadDataStore } from '../utils/functions'
import { IoMdOpen } from 'react-icons/io'
import { BLUE } from '../utils/couleurs'


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

export const Dashboard = () => {

    const [organisationUnits, setOrganisationUnits] = useState([])
    const me = meStore(state => state.me)
    const setMe = meStore(state => state.setMe)
    const users = usersStore(state => state.users)
    const setUsers = usersStore(state => state.setUsers)
    const [dataStoreAnalyses, setDataStoreAnalyses] = useState([])
    const [dataStoreSupervisionPlanifications, setDataStoreSupervisionPlanifications] = useState([])
    const [calendarEvents, setCalendarEvents] = useState([])

    const [selectedOrganisationUnit, setSelectedOrganisationUnit] = useState(null)
    const [selectedPlanification, setSelectedPlanification] = useState(PLANIFICATION_PAR_MOI)
    const [selectedPeriod, setSelectedPeriod] = useState(dayjs(new Date()))
    const [selectedPlanificationUser, setSelectedPlanificationUser] = useState(null)
    const [selectedSupervisors, setSelectedSupervisors] = useState([])

    const [loadingOrganisationUnits, setLoadingOrganisationUnits] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [loadingDataStoreAnalyses, setLoadingDataStoreAnalyses] = useState(false)
    const [loadingAnalyticsAnalysisConfigData, setLoadingAnalyticsAnalysisConfigData] = useState(false)
    const [loadingDataStoreSupervisionPlanifications, setLoadingDataStoreSupervisionPlanifications] = useState(false)

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
            const meResponse = await axios.get(`${ME_ROUTE},organisationUnits`)
            const meData = meResponse.data

            const userOrganisationUnitId = meData.organisationUnits.length !== 0 && meData.organisationUnits[0].id
            if (userOrganisationUnitId) {
                const organisationUnitRequest = await axios.get(ORGANISATION_UNITS_ROUTE)
                const organisationUnitResponse = organisationUnitRequest.data

                setOrganisationUnits(organisationUnitResponse.organisationUnits)
                setLoadingOrganisationUnits(false)
                setMe(meData)
                loadUsers(userOrganisationUnitId)
            }
        }
        catch (err) {
            console.log(err)
            setLoadingOrganisationUnits(false)
        }
    }

    const loadAnalyticsAnalysisConfigData = (dx) => {
        try {
            setLoadingAnalyticsAnalysisConfigData(true)
            const route = ``
            const response =
                setLoadingAnalyticsAnalysisConfigData(false)
        } catch (err) {
            console.log(err)
            setLoadingAnalyticsAnalysisConfigData(false)
        }
    }

    const loadDataStoreAnalyses = async () => {
        try {
            setLoadingDataStoreAnalyses(true)
            const response = await loadDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, null, null, null)
            if (response.length > 0) {
                // await loadAnalyticsAnalysisConfigData()
            }
            setLoadingDataStoreAnalyses(false)
        }
        catch (err) {
            console.log(err)
            setLoadingDataStoreAnalyses(false)
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
                for (sup of planification.supervisions) {
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
        console.log("Value:  ", value)
        setSelectedPlanification(value)
    }

    const handleSelectedPeriod = (event) => {
        setSelectedPeriod(dayjs((event)))
    }

    const handleSelectSupervisor = values => setSelectedSupervisors(values.map(sup => users.find(u => u.id === sup)))

    const handleSelectPlanificationUser = value => setSelectedPlanificationUser(users.find(u => u.id === value))

    const RenderCalendar = () => (
        <Col md={12} sm={24}>
            <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '2px' }} className="my-shadow">
                <div>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        // style={{ height: '820px' }}
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
                                    { title: 'Nom', key: 'displayName', dataIndex: 'displayName' },
                                    // { title: 'Description', key: 'description', dataIndex: 'description' },
                                    { title: 'Status', key: 'status', dataIndex: 'status', width: '100px' },
                                    { title: 'Actions', key: 'action', width: '50px', dataIndex: 'action', render: value => <div style={{ textAlign: 'center' }}><IoMdOpen title='Ouvrir' style={{ fontSize: '18px', color: BLUE, cursor: 'pointer' }} /></div> }
                                ]
                            }
                            dataSource={
                                [
                                    { id: 1, displayName: 'Supervision 1 ', description: 'Test, nouvelle description de la supervision 1', action: 1, status: 'En attente' },
                                    { id: 2, displayName: 'Supervision 2 ', description: 'Test, nouvelle description de la supervision 2', action: 2, status: 'Validée' },
                                    { id: 3, displayName: 'Supervision 3 ', description: 'Test, nouvelle description de la supervision 3', action: 3, status: 'Non Validée' },
                                    { id: 4, displayName: 'Supervision 4 ', description: 'Test, nouvelle description de la supervision 4', action: 4, status: 'Validée' },
                                    { id: 5, displayName: 'Supervision 5 ', description: 'Test, nouvelle description de la supervision 5', action: 5, status: 'En attente' }
                                ]
                            }
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

    const RenderFilters = () => (
        <>
            <div className='my-shadow' style={{ backgroundColor: '#fff', padding: '10px', marginTop: '5px', marginBottom: '20px', borderRadius: '8px' }}>
                <Row gutter={[8, 8]} align='middle'>
                    <Col sm={24} md={3}>
                        <div>Période</div>
                        <DatePicker
                            onChange={handleSelectedPeriod}
                            picker="month"
                            value={selectedPeriod}
                            style={{ width: '100%' }}
                            placeholder="Période"
                        />
                    </Col>
                    <Col sm={24} md={5}>
                        <div>Unités d'organisation</div>
                        <OrganisationUnitsTree
                            meOrgUnitId={me?.organisationUnits[0]?.id}
                            orgUnits={organisationUnits}
                            currentOrgUnits={selectedOrganisationUnit}
                            setCurrentOrgUnits={setSelectedOrganisationUnit}
                            loadingOrganisationUnits={loadingOrganisationUnits}
                        />
                    </Col>

                    <Col sm={24} md={4}>
                        <div>Planification</div>
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
                                <div>Utilisateurs</div>
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
                        <Col sm={24} md={4}>
                            <div>Superviseurs</div>
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

                </Row>
            </div>
        </>
    )

    useEffect(() => {
        loadOrganisationUnits()
        loadDataStoreAnalyses()
        // loadDataStoreSupervisionPlanifications()
    }, [])

    return (
        <>
            <div style={{ padding: '10px', width: '100%' }}>
                {RenderFilters()}
                <Row gutter={[8, 8]}>
                    {RenderCalendar()}
                    {RenderCharts()}
                </Row>
            </div>
        </>
    )
}


export default Dashboard