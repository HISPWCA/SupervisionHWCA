import axios from 'axios'
import React, { Component } from 'react'
import { ME_ROUTE, ORGANISATION_UNITS_ROUTE, ORGANISATION_UNIT_GROUP_ROUTE, ORGANISATION_UNIT_GROUP_SET_ROUTE, SETTINGS_ROUTE, SUPERVISIONS_ROUTE, PERIOD_TYPE_ROUTE, ANALYTICS_ROUTE } from '../api.routes'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import Supervision from './Supervision'
import moment from 'moment'
import { Paginator } from 'primereact/paginator'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import LoadingOverlay from 'react-loading-overlay'
import Header from '../components/Header'
import { Dialog } from 'primereact/dialog'
import { Tree } from 'primereact/tree'

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { Dropdown } from 'primereact/dropdown'

import FullCalendar from '@fullcalendar/react'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from "@fullcalendar/interaction"

import { DatePicker } from 'antd'
import translate from '../utils/translator'

const C_PAGINATION_ROWS_PER_PAGE = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const C_INDICATORS_BASED_CONFIGURATION = translate('C_INDICATORS_BASED_CONFIGURATION')
const C_ALL_ORGANISATION_UNITS = translate('C_ALL_ORGANISATION_UNITS')
const C_BASED_ON_SUPERVISION_FREQUENCIES = translate('C_BASED_ON_SUPERVISION_FREQUENCIES')
const C_BASED_ON_SUPERVISION_PERIOD = translate('C_BASED_ON_SUPERVISION_PERIOD')



export class Scheduler extends Component {

    state = {
        me: null,
        nodes: [],
        best: null,
        worst: null,
        loading: false,
        periodtypes: [],
        finalResults: [],
        supervisions: [],
        settingsList: [],
        periodType: null,
        hightIsGood: true,
        viewType: 'Table',
        selectedNode: null,
        filteredResults: [],
        selectedOrgUnit: null,
        selectedConfig: null,
        selectedPeriod: null,
        supervisionNumRows: 4,
        organisationUnits: [],
        selectedSetting: null,
        supervisionFirstPage: 0,
        selectedPeriodtype: null,
        selectedSupervision: null,
        organisationUnitGroups: [],
        resultLoadingPerformed: false,
        organisationUnitGroupSets: [],
        selectedOrganisationUnitsList: [],
        selectedOrganisationUnitGroup: null,
        selectedOrganisationUnitGroupSet: null,
        displaySupervisionFormCreation: false,
    }

    componentDidMount = () => {
        this.loadMe()
        this.loadPeriodTypes()
        this.loadSupervisions()
        this.loadOrganisationUnits()
        this.loadOrganisationUnitGroups()
        this.loadOrganisationUnitGroupSets()
    }


    loadPeriodTypes = () => axios.get(PERIOD_TYPE_ROUTE)
        .then(response => this.setState({ periodtypes: response.data.periodTypes }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    loadOrganisationUnitGroups = () => axios.get(ORGANISATION_UNIT_GROUP_ROUTE)
        .then(response => this.setState({ organisationUnitGroups: response.data.organisationUnitGroups }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    loadOrganisationUnitGroupSets = () => axios.get(ORGANISATION_UNIT_GROUP_SET_ROUTE)
        .then(response => this.setState({ organisationUnitGroupSets: response.data.organisationUnitGroupSets }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    loadSupervisions = () => this.setState({ loading: true }, 
        () =>    axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: [] }, () => this.setState({ supervisions: response.data, loading: false })))
            .catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
    )


    loadMe = () => axios.get(ME_ROUTE)
        .then(response => this.setState({ me: response.data }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    renderSupervisions = () => {
        if (this.state.supervisions.length > 0) {
            this.state.supervisions.map(s => {
                return (
                    <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>
                            {moment(s.period[0]).format('Do MMMM, YYYY')}
                            <span className="font-weight-bold m-3 text-secondary"> - </span>
                            {moment(s.period[1]).format('Do MMMM, YYYY')}
                        </td>
                        <td>{s.organisationUnit.displayName}</td>
                        <td>{s.owner.displayName}</td>
                        <td>{s.status}</td>
                        <td>
                            <button className="btn btn-light rounded">
                                {translate('Details')}
                            </button>
                        </td>
                    </tr>
                )
            })
        }
    }

    handleDisplayNewSupervison = () => this.setState({ displaySupervisionFormCreation: !this.state.displaySupervisionFormCreation }, () => {
        this.loadSupervisions()

        this.state.displaySupervisionFormCreation && this.retrieveSettingsFromDataStore()
    })

    deleteSupervision = supervision => confirmAlert(
        {
            title: translate('ConfirmDeletion'),
            message: translate('DoYouReallyWantToDeleteThisData'),
            buttons: [
                {
                    label: translate('Yes'),
                    onClick: () => this.processSupervisionDeletion(supervision)
                },
                {
                    label: translate('No'),
                    onClick: () => null
                },
            ]
        }
    )

    processSupervisionDeletion = supervision => this.setState({ loading: true },
        () => axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: response.data }, () => {
                const supervisions = response.data.filter(s => s.id !== supervision.id)

                axios.put(SUPERVISIONS_ROUTE, supervisions)
                    .then(() => {
                        this.setState({
                            loading: false,
                            selectedSupervision: null,
                            displaySupervisionFormCreation: false,
                        }, () => {
                            this.loadSupervisions()

                            NotificationManager.info(translate('SupervisionDeletedSuccessfully'), null, 3000)
                        })
                    }).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
            })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
    )

    handleSupervisionDetails = selectedSupervision => this.setState({ displaySupervisionFormCreation: false, selectedSupervision })

    displaySupervisionDetails = () => (this.state.selectedSupervision && !this.state.displaySupervisionFormCreation && (
        <React.Fragment>
            <div className="row">
                <div className="col">
                    <table className="table table-borderless table-sm table-striped text-left m-3">
                        <tbody>
                            <tr><td className="text-danger"><h3>{this.state.selectedSupervision.description.toUpperCase()}</h3></td></tr>
                            <tr>
                                <td>
                                    <span className="font-weight-bold m-3 text-secondary">{translate('Status')}:</span>
                                    {this.state.selectedSupervision.status}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="font-weight-bold m-3 text-secondary">{translate('Owner')}:</span>
                                    {this.state.selectedSupervision.owner.displayName}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="font-weight-bold m-3 text-secondary">{translate('OrganisationUnit')}:</span>
                                    {this.state.selectedSupervision.organisationUnit.displayName}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="font-weight-bold m-3 text-secondary">{translate('Start')}:</span>
                                    {moment(this.state.selectedSupervision.period[0]).format('dddd Do MMMM, YYYY')}
                                    <span className="font-weight-bold m-3 text-secondary">{translate('End')}:</span>
                                    {moment(this.state.selectedSupervision.period[1]).format('dddd Do MMMM, YYYY')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="row m-3">
                <div className="col">
                    <table className="table table-hover table-sm table-striped text-left m-3">
                        <thead><th>{translate('Indicators')}</th></thead>
                        <tbody>
                            {this.state.selectedSupervision?.indicators.map(i => <tr key={i.id}><td>{i.label}</td></tr>)}
                        </tbody>
                    </table>
                </div>

                <div className="col">
                    <table className="table table-hover table-sm table-striped text-left m-3">
                        <thead><th>{translate('Supervisors')}</th></thead>
                        <tbody>
                            {this.state.selectedSupervision.supervisors.map(s => <tr key={s.id}><td>{s.displayName}</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="m-3 row">
                <div className="col btn-group">
                    <button
                        className="btn btn-secondary btn-sm p-1"
                        onClick={() => this.setState({ selectedSupervision: null, displaySupervisionFormCreation: false })}>
                        {translate('Close')}
                    </button>

                    <button
                        className="btn btn-danger btn-sm p-1"
                        onClick={() => this.deleteSupervision(this.state.selectedSupervision)} >
                        {translate('Delete')}
                    </button>
                </div>
            </div>
        </React.Fragment>
    ))

    onHandlePageChange = event => this.setState({ supervisionFirstPage: event.first, supervisionNumRows: event.rows })

    renderPaginator = () => (this.state.supervisions.length > 0 && 
        <div className='row'>
            <div className='col-3'>
                <Paginator
                    first={this.state.supervisionFirstPage}
                    rows={this.state.supervisionNumRows}
                    totalRecords={this.state.supervisions.length}
                    rowsPerPageOptions={[...C_PAGINATION_ROWS_PER_PAGE]}
                    onPageChange={this.onHandlePageChange}
                    template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
            </div>
        </div>
    )


    retrieveSettingsFromDataStore = () => axios.get(SETTINGS_ROUTE)
        .then(response => this.setState({ settingsList: response.data }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    loadOrganisationUnits = () => axios.get(ORGANISATION_UNITS_ROUTE)
        .then(response => {
            this.setState({ organisationUnits: response.data.organisationUnits }, () => {
                let organisationUnits = response.data.organisationUnits
                    .map(o => {
                        return {
                            key: o.id,
                            label: o.displayName,
                            data: o,
                            children: [],
                            parent: (o.parent !== null && o.parent !== undefined) ? o.parent.id : null
                        }
                    })

                const nodes = organisationUnits.filter(o => o.parent === null)

                nodes.forEach(o => {
                    o.children = organisationUnits.filter(org => org.parent === o.key)

                    o.children.forEach(a => {
                        a.children = organisationUnits.filter(org => org.parent === a.key)

                        a.children.forEach(b => {
                            b.children = organisationUnits.filter(org => org.parent === b.key)

                            b.children.forEach(c => {
                                c.children = organisationUnits.filter(org => org.parent === c.key)

                                c.children.forEach(d => {
                                    d.children = organisationUnits.filter(org => org.parent === d.key)

                                    d.children.forEach(e => {
                                        e.children = organisationUnits.filter(org => org.parent === e.key)

                                        e.children.forEach(f => {
                                            f.children = organisationUnits.filter(org => org.parent === f.key)

                                            f.children.forEach(g => {
                                                g.children = organisationUnits.filter(org => org.parent === g.key)

                                                g.children.forEach(h => {
                                                    h.children = organisationUnits.filter(org => org.parent === h.key)

                                                    h.children.forEach(i => {
                                                        i.children = organisationUnits.filter(org => org.parent === i.key)

                                                        i.children.forEach(j => {
                                                            j.children = organisationUnits.filter(org => org.parent === j.key)

                                                            j.children.forEach(k => {
                                                                k.children = organisationUnits.filter(org => org.parent === k.key)

                                                                k.children.forEach(l => {
                                                                    l.children = organisationUnits.filter(org => org.parent === l.key)

                                                                    l.children.forEach(m => {
                                                                        m.children = organisationUnits.filter(org => org.parent === m.key)

                                                                        m.children.forEach(n => {
                                                                            n.children = organisationUnits.filter(org => org.parent === n.key)

                                                                            n.children.forEach(p => {
                                                                                p.children = organisationUnits.filter(org => org.parent === p.key)

                                                                                p.children.forEach(q => {
                                                                                    q.children = organisationUnits.filter(org => org.parent === q.key)

                                                                                    q.children.forEach(r => {
                                                                                        r.children = organisationUnits.filter(org => org.parent === r.key)

                                                                                        r.children.forEach(s => {
                                                                                            s.children = organisationUnits.filter(org => org.parent === s.key)

                                                                                            s.children.forEach(t => {
                                                                                                t.children = organisationUnits.filter(org => org.parent === t.key)

                                                                                                t.children.forEach(u => {
                                                                                                    u.children = organisationUnits.filter(org => org.parent === u.key)

                                                                                                    u.children.forEach(v => {
                                                                                                        v.children = organisationUnits.filter(org => org.parent === v.key)

                                                                                                        v.children.forEach(w => {
                                                                                                            w.children = organisationUnits.filter(org => org.parent === w.key)

                                                                                                            w.children.forEach(x => {
                                                                                                                x.children = organisationUnits.filter(org => org.parent === x.key)

                                                                                                                x.children.forEach(y => {
                                                                                                                    y.children = organisationUnits.filter(org => org.parent === y.key)

                                                                                                                    y.children.forEach(z => {
                                                                                                                        z.children = organisationUnits.filter(org => org.parent === z.key)
                                                                                                                    })
                                                                                                                })
                                                                                                            })
                                                                                                        })
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })

                this.setState({ nodes })
            })

        }).catch(error => NotificationManager.error(error.message, null, 3000))


    performResultsLoading = () => {
        this.setState({ loading: true, resultLoadingPerformed: true }, () => {
            const route =  ANALYTICS_ROUTE.concat(this.state.selectedSetting.indicators.map(indicator => indicator.id).join(';')) 
                .concat('&dimension=ou:OU_GROUP-')
                .concat(this.state.selectedOrganisationUnitGroup.id)
                .concat(';')
                .concat(this.state.selectedOrgUnit)
                .concat('&filter=pe:')
                .concat(this.state.selectedPeriod.replaceAll('-', ''))
                .concat('&filter=')
                .concat(this.state.selectedOrganisationUnitGroupSet.id)
                .concat(':')
                .concat(this.state.selectedOrganisationUnitGroup.id)
                .concat('&displayProperty=NAME&outputIdScheme=NAME')

            axios.get(route)
                .then(response => this.setState({ filteredResults: response.data }, () => {
                    const indicatorScoreSuffix = ' Score'
                    const indicators = [...new Set(this.state.selectedSetting.indicators.map(indicator => indicator.name))]
                    const organisationUnits = [...new Set(this.state.filteredResults.rows.map(row => row[1]))]

                    let elements = []
                    organisationUnits.forEach(organisationUnit => elements.push({ organisationUnit }))
                    elements = elements.map(e => {
                        indicators.forEach(indicator => e[indicator] = '')

                        return e
                    }).map(e => {
                        indicators.forEach(indicator => {
                            if (!Object.keys(e).includes(indicator))
                                e[indicator] = ''
                        })

                        return e
                    }).map(e => {
                        this.state.filteredResults.rows.filter(row => row[1] === e.organisationUnit)
                            .forEach(result => Object.keys(e).forEach(key => {
                                if (key === result[0])
                                    e[key] = parseFloat(parseFloat(result[result.length - 1]).toFixed(2))
                            }))

                        return e
                    }).map(e => {
                        this.state.selectedSetting.indicators.forEach(indicator => {
                            if (isNaN(parseFloat(e[indicator.name]))) {
                                e[indicator.name] = '-'

                                if (!Object.keys(e).includes(indicator.name.concat(indicatorScoreSuffix)))
                                    e[indicator.name.concat(indicatorScoreSuffix)] = '-'

                            } else if (isNaN(parseFloat(indicator.weight)))
                                e[indicator.name.concat(indicatorScoreSuffix)] = '-'
                            else
                                e[indicator.name.concat(indicatorScoreSuffix)] = parseFloat(e[indicator.name]) * parseFloat(indicator.weight)

                        })

                        return e
                    }).map(e => {
                        let score = 0
                        indicators.forEach(indicator => {
                            if (e[indicator] !== '-' && !isNaN(parseFloat(e[indicator])))
                                score += e[indicator.concat(indicatorScoreSuffix)]
                        })
                        e.score = parseFloat(score.toFixed(2))

                        return e
                    })

                    this.setState({ finalResults: elements, loading: false })
                })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
        })
    }

    nodeHandler = e => this.setState({ selectedNode: this.state.organisationUnits.find(o => e === o.id) })

    handleDateClick = ({ dateStr }) => this.setState({ viewType: dateStr })

    onDateSelection = (date, dateString) => {
        if (this.state.periodType === 'Week')
            this.setState({ selectedPeriod: moment(date).format('yyyy').concat('W').concat(moment(date).format('WW')) })
        else
            this.setState({ selectedPeriod: dateString })
    }

    render = () => (
        <React.Fragment>
            <Header
                me={this.state.me}
                settings={this.state.settings} />

            <LoadingOverlay spinner active={this.state.loading} text={translate('Processing')} >
                {
                    <div className='row my-1'>
                        <div className='col text-left'>
                            <button
                                className={
                                    this.state.displaySupervisionFormCreation
                                        ? 'btn btn-sm btn-danger'
                                        : 'btn btn-sm btn-primary'
                                }
                                onClick={() => this.handleDisplayNewSupervison()}>
                                {this.state.displaySupervisionFormCreation ? translate('CloseForm') : translate('NewPlanning')}
                            </button>
                        </div>
                    </div>
                }

                {
                    this.state.supervisions.length > 0 &&
                    <div className="row">
                        <div className="col">

                            <button
                                onClick={() => this.setState({ viewType: 'Table' })}
                                className="btn btn-sm btn-secondary m-1 float-sm-right">
                                {translate('TableView')}
                            </button>

                            <button
                                onClick={() => this.setState({ viewType: 'Calendar' })}
                                className="btn btn-sm btn-secondary m-1 float-sm-right">
                                {translate('CalendarView')}
                            </button>

                            <button
                                onClick={() => this.setState({ viewType: 'Timeline' })}
                                className="btn btn-sm btn-secondary m-1 float-sm-right">
                                {translate('TimelineView')}
                            </button>

                        </div>
                    </div>
                }

                <div className="row">
                    <div className="col">
                        {
                            this.state.viewType === 'Timeline' &&
                            <Dialog
                                header="Timeline view"
                                visible={this.state.viewType === 'Timeline'}
                                style={{ width: '75vw' }}
                                onHide={() => this.setState({ viewType: 'Table' })}>

                                <div className="alert alert-secondary">
                                    {
                                        this.state.supervisions.length > 0 && <VerticalTimeline className="alert alert-secondary p-2">
                                            {this.state.supervisions.map(supervision => <React.Fragment>
                                                <VerticalTimelineElement
                                                    dateClassName="text-dark font-weight-bold"
                                                    contentStyle={{ background: 'rgb(127, 255, 212)', color: '#000000' }}
                                                    contentArrowStyle={{ borderRight: '7px solid  rgb(127, 255, 212)' }}
                                                    date={''.concat(moment(supervision.period[0]).format('Do MMMM, YYYY').concat(' - ').concat(moment(supervision.period[1]).format('Do MMMM, YYYY') === 'Invalid date' ? moment(supervision.period[0]).format('Do MMMM, YYYY') : moment(supervision.period[1]).format('Do MMMM, YYYY')))}
                                                    iconStyle={{ background: 'rgb(127, 255, 212)', color: '#fff' }} >

                                                    <h3 className="vertical-timeline-element-title font-weight-bold my-2">
                                                        {supervision.organisationUnit.displayName.toUpperCase()}
                                                    </h3>

                                                    <h5>
                                                        (<strong>{supervision.status}</strong>)
                                                    </h5>

                                                    <h4 className="vertical-timeline-element-subtitle">{supervision.description}</h4>
                                                    <div className="row m-3">
                                                        {
                                                            supervision.indicators.length > 0 &&
                                                            <div className="col">
                                                                <table className="table table-hover table-sm table-striped text-left table-light m-3">
                                                                    <thead><th>{translate('Indicators')}</th></thead>
                                                                    <tbody>
                                                                        {supervision?.indicators.map(i => <tr key={i.id}><td>{i.label}</td></tr>)}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        }

                                                        {
                                                            supervision.supervisors.length > 0 &&
                                                            <div className="col">
                                                                <table className="table table-hover table-sm table-striped text-left table-light m-3">
                                                                    <thead><th>{translate('Supervisors')}</th></thead>
                                                                    <tbody>
                                                                        {supervision.supervisors.map(s => <tr key={s.id}><td>{s.displayName}</td></tr>)}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        }
                                                    </div>
                                                </VerticalTimelineElement>
                                            </React.Fragment>)
                                            }
                                        </VerticalTimeline>
                                    }
                                </div>

                            </Dialog>
                        }

                        {
                            this.state.viewType !== 'Table' && this.state.viewType !== 'Timeline' && <div classname="d-block">
                                {this.state.viewType !== 'Table' && this.state.viewType !== 'Calendar' && this.state.viewType !== 'Timeline' && <table className="table table-hover table-primary table-sm table-striped text-left ">
                                    <thead>
                                        <th>{translate('OrgUnit')}</th>
                                        <th>{translate('TrackerProgram')}</th>
                                        <th>{translate('StartDate')} - {translate('EndDate')}</th>
                                        <th>{translate('Status')}</th>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.supervisions.filter(supervision => this.state.viewType === moment(supervision.period[0]).format('YYYY-MM-DD') || this.state.viewType === moment(supervision.period[1]).format('YYYY-MM-DD')).length === 0
                                            && <tr><td colspan="5" className="text-center">{translate('NothingPlannedFor')} <strong> {this.state.dateStr} </strong> </td></tr>
                                        }

                                        {
                                            this.state.supervisions
                                                .filter(supervision => this.state.viewType === moment(supervision.period[0]).format('YYYY-MM-DD') || this.state.viewType === moment(supervision.period[1]).format('YYYY-MM-DD'))
                                                .filter((i, index) => index >= this.state.supervisionFirstPage && index <= (this.state.supervisionFirstPage + 5))
                                                .map(s => (
                                                    <tr key={s.id}>
                                                        <td title={s.description}>{s.organisationUnit.displayName}</td>
                                                        <td title={s.description}>{s.program.displayName}</td>
                                                        <td>
                                                            {moment(s.period[0]).format('Do MMMM, YYYY')}
                                                            <span className="font-weight-bold m-3 text-secondary"> - </span>
                                                            {moment(s.period[1]).format('Do MMMM, YYYY') === 'Invalid date' ? moment(s.period[0]).format('Do MMMM, YYYY') : moment(s.period[1]).format('Do MMMM, YYYY')}
                                                        </td>
                                                        <td>{s.status}</td>
                                                    </tr>
                                                ))
                                        }

                                    </tbody>
                                </table>
                                }


                                <FullCalendar
                                    dateClick={this.handleDateClick}
                                    className="d-block"
                                    defaultView='dayGridMonth'
                                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                                    initialView="dayGridMonth" events={this.state.supervisions.map(supervision => {
                                        return { title: supervision.organisationUnit.displayName, start: supervision.period[0], end: moment(supervision.period[1]).format('Do MMMM, YYYY') === 'Invalid date' ? supervision.period[0] : supervision.period[1] }
                                    })} />
                            </div>
                        }

                        {
                            this.state.viewType === 'Table' &&
                            <React.Fragment>
                                <table className="table table-hover table-primary table-sm table-striped text-left ">
                                    <thead>
                                        <th>{translate('OrgUnit')}</th>
                                        <th>{translate('ProgramForm')}</th>
                                        <th>{translate('StartDate')} - {translate('EndDate')}</th>
                                        <th>{translate('Status')}</th>
                                        <th>{translate('Action')}</th>
                                    </thead>
                                    <tbody>

                                        {this.state.supervisions.length === 0 && <tr><td colspan="6" className="text-center">{translate('NoSupervisionAvailableYet')}</td></tr>}

                                        {this.state.supervisions.length > 0 && this.state.supervisions
                                            .filter((i, index) => index >= this.state.supervisionFirstPage && index <= (this.state.supervisionFirstPage + 5))
                                            .map(s => (
                                                <tr key={s.id}>
                                                    <td title={s.description}>{s.organisationUnit.displayName}</td>
                                                    <td title={s.description}>{s.program.displayName}</td>
                                                    <td>
                                                        {moment(s.period[0]).format('Do MMMM, YYYY')}
                                                          <span className="font-weight-bold m-3 text-secondary"> - </span>
                                                        {moment(s.period[1]).format('Do MMMM, YYYY') === 'Invalid date' ? moment(s.period[0]).format('Do MMMM, YYYY') : moment(s.period[1]).format('Do MMMM, YYYY')}
                                                    </td>
                                                    <td>{s.status}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => this.handleSupervisionDetails(s)}
                                                            className="btn btn-sm btn-light"
                                                            title="Display details">
                                                            {translate('Details')}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                <br />

                                {this.renderPaginator()}
                            </React.Fragment>
                        }
                    </div>
                </div>

                {this.displaySupervisionDetails()}

                {
                    this.state.displaySupervisionFormCreation && <div className="row text-center alert alert-primary m-1 mt-3">
                        <div className="col">
                            <button
                                onClick={() => this.setState({ selectedConfig: C_INDICATORS_BASED_CONFIGURATION, displayTree: false })}
                                className="btn btn-sm btn-primary m-1">
                                    {C_INDICATORS_BASED_CONFIGURATION}
                            </button>

                            <button
                                onClick={() => this.setState({ selectedConfig: C_ALL_ORGANISATION_UNITS, selectedSetting: null, displayTree: true })}
                                className="btn btn-sm btn-primary m-1">
                                {C_ALL_ORGANISATION_UNITS}
                            </button>

                             <button
                                onClick={() => this.setState({ selectedConfig: C_BASED_ON_SUPERVISION_FREQUENCIES })}
                                className="btn btn-sm btn-primary m-1 d-none">
                                {C_BASED_ON_SUPERVISION_FREQUENCIES}
                            </button> 

                            <button
                                onClick={() => this.setState({ selectedConfig: C_BASED_ON_SUPERVISION_PERIOD })}
                                className="btn btn-sm btn-primary m-1 d-none">
                                {C_BASED_ON_SUPERVISION_PERIOD}
                            </button>
                        </div>
                    </div>
                }

                {
                    this.state.displaySupervisionFormCreation && this.state.selectedConfig === C_INDICATORS_BASED_CONFIGURATION && this.state.selectedSetting && this.state.selectedConfig &&
                    <div className="row text-center alert alert-primary m-1 mt-3">
                        <strong> {this.state.selectedSetting.name} </strong>

                        <table className="table table-sm table-hover text-left table-primary table-striped">
                            <thead>
                                <th>{translate('Label')}</th>
                                <th>{translate('Name')}</th>
                                <th>{translate('HighIsGood')}</th>
                                <th>{translate('Weight')}</th>
                                <th>{translate('Categories')}</th>
                            </thead>

                            <tbody>
                                {
                                    this.state.selectedSetting.indicators.map(setting => <tr key={setting.id}>
                                        <td className="text-left">{setting.label}</td>
                                        <td className="text-left">{setting.name}</td>
                                        <td>{setting.hightIsGood ? translate('Yes') : translate('No')}</td>
                                        <td>{setting.weight}</td>
                                        <td>{setting.categories.map(c =>
                                            <div className="row m-1 Settings">
                                                <div className="col">{c.category}</div>
                                                <div className="col"><span style={{ width: '100px', minWidth: '100px', maxWidth: '100px', height: '50px', backgroundColor: c.color }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
                                                <div className="col font-weight-bold">Min: {c.min}</div>
                                                <div className="col font-weight-bold">Max: {c.max}</div>
                                            </div>
                                        )}
                                        </td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                }

                {
                    this.state.displaySupervisionFormCreation && this.state.selectedConfig === C_INDICATORS_BASED_CONFIGURATION && <div className="row m-1 text-center alert alert-primary" style={{ maxHeight: '300px', overflow: 'auto' }} >
                        {this.state.settingsList.filter(setting => setting.me.id === this.state.me.id).map(setting => <div className="col-3 p-1">  <button key={setting.id} onClick={() => this.setState({ selectedSetting: setting })} className=" text-uppercase d-block border btn btn-primary Settings align-middle" style={{ height: '100px', width: '100%' }}> {setting.name} </button>   </div>)}
                    </div>
                }

                {
                     this.state.selectedSetting &&
                        this.state.displaySupervisionFormCreation &&
                         this.state.selectedConfig === C_INDICATORS_BASED_CONFIGURATION  &&
                    <React.Fragment>

                        <div className="row m-1 alert alert-primary">
                            <div className="col text-center">
                                <strong>
                                    {translate('PleaseSelectOptionsInOrderToDisplayRelatedResults')}
                                </strong>
                            </div>
                        </div>

                        <div className="row m-1 alert alert-primary">
                            <div className="col-3 px-3 mx-3">
                                <strong className="d-block">{translate('OrganisationUnit')}</strong>

                                <Tree value={this.state.nodes}
                                    selectionMode="single"
                                    filter={true}
                                    selectionKeys={this.state.selectedOrgUnit}
                                    onSelectionChange={e => this.setState({ selectedOrgUnit: e.value })} />
                            </div>

                            <div className="col form-group">
                                <strong className="d-block mt-2">{translate('Best')}</strong> 
                                <input
                                    type="number"
                                    placeholder={translate('Best')}
                                    className="form-control"
                                    onChange={e => this.setState({ best: e.target.value })}
                                />

                                
                                    <strong className="d-block mt-2">{translate('Worst')}</strong> 
                                
                                <input
                                    type="number"
                                    placeholder={translate('Worst')}
                                    className="form-control"
                                    onChange={e => this.setState({ worst: e.target.value })} />

                                {
                                    this.state.selectedConfig === C_INDICATORS_BASED_CONFIGURATION && 
                                    <label className="d-block mt-2">
                                        <input type="checkbox" checked={this.state.hightIsGood} onChange={e => this.setState({ hightIsGood: e.target.checked })} /> <strong> {translate('HighIsGood')} </strong>
                                    </label>
                                }
                            </div>

                            <div className="col px-3">
                                <strong className="d-block mt-2"> {translate('OrganisationUnitGroupSet')} </strong>

                                <Dropdown showClear
                                    filterBy="displayName"
                                    optionLabel="displayName"
                                    className="d-block"
                                    value={this.state.selectedOrganisationUnitGroupSet}
                                    options={this.state.organisationUnitGroupSets}
                                    onChange={e => this.setState({ selectedOrganisationUnitGroupSet: e.value, selectedOrganisationUnitGroup: null })} />

                                {
                                    this.state.selectedOrganisationUnitGroupSet &&
                                    this.state.organisationUnitGroups.filter(organisationUnitGroup => this.state.selectedOrganisationUnitGroupSet.organisationUnitGroups.map(oug => oug.id).includes(organisationUnitGroup.id)).length > 0 &&
                                    <React.Fragment>
                                        <strong className="d-block mt-1"> {translate('OrganisationUnitGroup')} </strong>

                                        <Dropdown showClear
                                            filterBy="displayName"
                                            optionLabel="displayName"
                                            className="d-block"
                                            value={this.state.selectedOrganisationUnitGroup}
                                            options={this.state.organisationUnitGroups.filter(organisationUnitGroup => this.state.selectedOrganisationUnitGroupSet.organisationUnitGroups.map(oug => oug.id).includes(organisationUnitGroup.id))}
                                            onChange={e => this.setState({ selectedOrganisationUnitGroup: e.value })} />

                                    </React.Fragment>
                                }

                                <label for="period" className="form-label font-weight-bold mt-2 d-block"> {translate('PeriodType')} </label>
                                <div className="d-block m-1">

                                    <Dropdown
                                        className="d-block"
                                        optionLabel="name"
                                        optionValue="code"
                                        value={this.state.periodType}
                                        options={
                                            [
                                                { name: 'Day', code: 'Day' },
                                                { name: 'Week', code: 'Week' },
                                                { name: 'Month', code: 'Month' },
                                                { name: 'Quarter', code: 'Quarter' },
                                                { name: 'Year', code: 'Year' },
                                            ]
                                        }
                                        onChange={e => { this.setState({ periodType: e.value }) }}
                                        placeholder={translate('ChoosePeriodType')} />
                                </div>

                                {this.state.periodType && <strong className="d-block mt-1">{translate('Select')} {this.state.periodType}  </strong>}

                                {this.state.periodType === 'Day' && <DatePicker id="period" onChange={this.onDateSelection} />}
                                {this.state.periodType === 'Week' && <DatePicker id="period" picker="week" format={'yyyyW'} onChange={this.onDateSelection} />}
                                {this.state.periodType === 'Month' && <DatePicker id="period" picker="month" onChange={this.onDateSelection} />}
                                {this.state.periodType === 'Quarter' && <DatePicker id="period" picker="quarter" onChange={this.onDateSelection} />}
                                {this.state.periodType === 'Year' && <DatePicker id="period" picker="year" onChange={this.onDateSelection} />}


                                <button
                                    className="btn btn-sm float-right my-3 btn-primary"
                                    disabled={
                                        !this.state.best ||
                                        !this.state.periodType ||
                                        !this.state.worst ||
                                        (this.state.best === 0 && this.state.worst === 0) ||
                                        !this.state.selectedOrgUnit ||
                                        !this.state.selectedPeriod ||
                                        !this.state.selectedOrganisationUnitGroup ||
                                        !this.state.selectedOrganisationUnitGroupSet
                                    }
                                    onClick={this.performResultsLoading}>
                                    {translate('DisplayResults')}
                                </button>
                            </div>
                        </div>

                        <div className="row my-1" >
                            <div className="col">
                                {
                                    this.state.selectedPeriod &&
                                    <div className="d-block my-1 alert alert-info">
                                        <span>Selected Period:</span> <strong> {moment(this.state.selectedPeriod).format(' MMMM, YYYY')} </strong>
                                        <span>Hight Is Good:</span> <strong> {this.state.hightIsGood ? translate('Yes') : translate('No')} </strong>

                                        { this.state.selectedConfig === C_INDICATORS_BASED_CONFIGURATION && this.state.selectedSetting.indicators.map(indicator => <React.Fragment> <span className="ml-2">{indicator.name}:</span> <strong>{indicator.weight}</strong> </React.Fragment>)}
                                    </div>
                                }

                                {
                                    this.state.finalResults.length > 0 &&
                                    (parseInt(this.state.finalResults.length + 1) - (parseInt(this.state.best || 0) + parseInt(this.state.worst || 0)) > 0) &&
                                    <table className="table table-sm table-striped table-primary table-hover text-left align-middle">
                                        <thead> {Object.keys(this.state.finalResults[0]).map(key => <th className="text-capitalize text-left align-middle"> {key} </th>)} <th className="text-left align-middle">{translate('Action')}</th> </thead>
                                        {
                                            this.state.finalResults.length > 1 &&
                                            <tbody>
                                                {this.state.hightIsGood && this.state.finalResults.sort((a, b) => b.score - a.score).slice(0, this.state.best).map((result, index) => <tr title={result.organisationUnit} > {Object.keys(this.state.finalResults[index]).map(key => <td className="alert alert-success text-left align-middle"> {result[key]} </td>)}  <td className="text-left align-middle"><button className="btn btn-light btn-sm" onClick={() => this.setState({ selectedNode: this.state.organisationUnits.find(organisationUnit => organisationUnit.displayName === result.organisationUnit) })}> {translate('Schedule')} </button></td></tr>)}
                                                {this.state.hightIsGood && this.state.finalResults.sort((a, b) => a.score - b.score).slice(0, this.state.worst).sort((a, b) => b.score - a.score).map((result, index) => <tr title={result.organisationUnit} > {Object.keys(this.state.finalResults[index]).map(key => <td className="alert alert-danger text-left align-middle"> {result[key]} </td>)} <td className="text-left align-middle"><button className="btn btn-light btn-sm" onClick={() => this.setState({ selectedNode: this.state.organisationUnits.find(organisationUnit => organisationUnit.displayName === result.organisationUnit) })}> {translate('Schedule')} </button></td> </tr>)}

                                                {!this.state.hightIsGood && this.state.finalResults.sort((a, b) => a.score - b.score).slice(0, this.state.best).map((result, index) => <tr title={result.organisationUnit} > {Object.keys(this.state.finalResults[index]).map(key => <td className="alert alert-success text-left align-middle"> {result[key]} </td>)}  <td className="text-left align-middle"><button className="btn btn-light btn-sm" onClick={() => this.setState({ selectedNode: this.state.organisationUnits.find(organisationUnit => organisationUnit.displayName === result.organisationUnit) })}> {translate('Schedule')} </button></td></tr>)}
                                                {!this.state.hightIsGood && this.state.finalResults.sort((a, b) => b.score - a.score).slice(0, this.state.worst).sort((a, b) => a.score - b.score).map((result, index) => <tr title={result.organisationUnit} > {Object.keys(this.state.finalResults[index]).map(key => <td className="alert alert-danger text-left align-middle"> {result[key]} </td>)}  <td className="text-left align-middle"><button className="btn btn-light btn-sm" onClick={() => this.setState({ selectedNode: this.state.organisationUnits.find(organisationUnit => organisationUnit.displayName === result.organisationUnit) })}> {translate('Schedule')} </button></td></tr>)}
                                            </tbody>
                                        }

                                        {
                                            this.state.finalResults.length === 1 && 
                                            <tbody> 
                                                {this.state.finalResults.map((result, index) => <tr title={result.organisationUnit} > {Object.keys(this.state.finalResults[index]).map(key => <td className="alert alert-primary text-left align-middle"> {result[key]} </td>)}  <td className="text-left align-middle"><button className="btn btn-light btn-sm" onClick={() => this.setState({ selectedNode: this.state.organisationUnits.find(organisationUnit => organisationUnit.displayName === result.organisationUnit) })}> {translate('Schedule')} </button></td></tr>)}
                                            </tbody>
                                        }
                                    </table>
                                }

                                {
                                    this.state.finalResults.length > 0 &&
                                    (parseInt(this.state.finalResults.length + 1) - (parseInt(this.state.best || 0) + parseInt(this.state.worst || 0)) <= 0) &&
                                    <React.Fragment>
                                        <div className="d-block alert alert-danger my-2">

                                            {translate('TheTotalResultsFromAnalyticsIs')}
                                            <strong className="mx-1">
                                                {this.state.finalResults.length}
                                            </strong>
                                            , {translate('ButYouSeemLookingFor')}

                                            <strong className="mx-1">
                                                {this.state.best}
                                            </strong>
                                            {translate('BestAnd')}

                                            <strong className="mx-1">
                                                {this.state.worst}
                                            </strong>
                                            {translate('Worst')}

                                        </div>
                                        <table className="table table-sm table-striped table-primary table-hover text-left align-middle">
                                            <thead> {Object.keys(this.state.finalResults[0]).map(key => <th className="text-capitalize text-left align-middle"> {key} </th>)} <th className="text-left align-middle">Action</th> </thead>
                                            {
                                                this.state.finalResults.length > 1 &&
                                                <tbody>
                                                    {this.state.hightIsGood && this.state.finalResults.sort((a, b) => b.score - a.score).map((result, index) => <tr title={result.organisationUnit} > {Object.keys(this.state.finalResults[index]).map(key => <td className="text-left align-middle"> {result[key]} </td>)}  <td className="text-left align-middle"><button className="btn btn-light btn-sm" onClick={() => this.setState({ selectedNode: this.state.organisationUnits.find(organisationUnit => organisationUnit.displayName === result.organisationUnit) })}> {translate('Schedule')} </button></td></tr>)}

                                                    {!this.state.hightIsGood && this.state.finalResults.sort((a, b) => a.score - b.score).map((result, index) => <tr title={result.organisationUnit} > {Object.keys(this.state.finalResults[index]).map(key => <td className="text-left align-middle"> {result[key]} </td>)}  <td className="text-left align-middle"><button className="btn btn-light btn-sm" onClick={() => this.setState({ selectedNode: this.state.organisationUnits.find(organisationUnit => organisationUnit.displayName === result.organisationUnit) })}> {translate('Schedule')} </button></td></tr>)}
                                                </tbody>
                                            }
                                        </table>
                                    </React.Fragment>
                                }
                            </div>
                        </div>

                        {this.state.resultLoadingPerformed && this.state.finalResults.length === 0 && <table className="table table-sm table-striped table-primary"><thead><th className="text-center"> No Result availbale yet </th> </thead></table>}
                    </React.Fragment>
                }

                {(this.state.displaySupervisionFormCreation && (this.state.selectedConfig === C_ALL_ORGANISATION_UNITS || this.state.selectedNode)) && <Supervision supervisions={this.state.supervisions} nodes={this.state.nodes} displayTree={this.state.displayTree} selectedNode={this.state.selectedNode} nodeHandler={this.nodeHandler} indicators={this.state.selectedSetting ? this.state.selectedSetting.indicators : []} loadSupervisions={this.loadSupervisions} />}

            </LoadingOverlay>
        </React.Fragment>
    )

}

export default Scheduler
