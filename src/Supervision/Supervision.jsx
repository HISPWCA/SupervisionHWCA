import axios from 'axios';
import { Tree } from 'primereact/tree';
import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { ORGANISATION_UNITS_ROUTE, SUPERVISORS_ROUTE, ME_ROUTE, INDICATORS_ROUTE, SUPERVISIONS_ROUTE } from '../api.routes';
import { Calendar } from 'primereact/calendar';
import { v4 as uuidv4 } from 'uuid';
import LoadingOverlay from 'react-loading-overlay';

export class Supervision extends Component {

    constructor(props) {
        super(props)

        this.state = {
            me: null,
            nodes: [],
            dates: null,
            loading: false,
            supervisors: [],
            supervisions: [],
            useStepper: true,
            description: null,
            selectedNodes: [],
            selectedNodeKeys: null,
            availableIndicators: [],
            selectedSupervisors: [],
            currentSelectedNode: null,
            currentSelectedOrgUnit: null,
            currentSelectedIndicators: [],
            currentSelectedSupervisor: null,
        }
    }

    componentDidMount = () => {
        this.loadMe()
        this.loadSupervisors()
        this.loadOrganisationUnits()
        this.loadIndicatorsFromServer()
    }

    loadOrganisationUnits = () => axios.get(ORGANISATION_UNITS_ROUTE)
        .then(response => {
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
        }).catch(error => NotificationManager.error(error.message, null, 3000))


    loadSupervisors = () => axios.get(SUPERVISORS_ROUTE)
        .then(response => this.setState({ supervisors: response.data.users }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    createSupervision = supervision => this.setState({ loading: true }, () => {
        axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: response.data }, () => {
                const supervisions = response.data
                supervisions.push(supervision)

                axios.put(SUPERVISIONS_ROUTE, supervisions)
                    .then(() => {
                        this.setState({
                            dates: null,
                            currentSelectedSupervisor: null,
                            currentSelectedIndicators: [],
                            currentSelectedNode: null,
                            selectedSupervisors: [],
                            description: null,
                            loading: false
                        }, () => {
                            this.props.loadSupervisions()

                            NotificationManager.success('Supervision planned successfully', null, 3000)
                        })
                    }).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
            })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
    })


    loadMe = () => axios.get(ME_ROUTE)
        .then(response => this.setState({ me: response.data }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    onSelect = event => {
        const selectedNodes = [...this.state.selectedNodes]
        if (!selectedNodes.includes(event.node)) {
            selectedNodes.push(event.node)
            this.setState({ selectedNodes })
        }
    }

    onUnselect = event => {
        const selectedNodes = this.state.selectedNodes.filter(n => n !== event.node)

        this.setState({ selectedNodes })
    }

    handleOrgsUnitSelection = currentSelectedNode => this.setState({ currentSelectedNode: null }, () => this.setState({ currentSelectedNode }))

    orgUnitClassNameProvider = organisationUnit => this.state.currentSelectedNode !== null && this.state.currentSelectedNode.key === organisationUnit.key ? 'm-3 p-3 text-left Settings SelectedSetting' : 'm-3 p-3 text-left Settings'

    displaySelectedOrgUnits = () => {
        if (this.state.selectedNodes.length > 0) {
            return (
                <div className="col">
                    <div className="font-weight-bold">Selected Org. Units</div>
                    {
                        this.state.selectedNodes.map(o => (
                            <div
                                onClick={() => this.handleOrgsUnitSelection(o)}
                                className={this.orgUnitClassNameProvider(o)}
                                key={o.key}>
                                {o.label}
                            </div>
                        ))
                    }
                </div>
            )
        }
    }

    handleSupervisionCreation = () => this.setState({ loading: true }, () => {
        if (this.state.dates === null) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select date or Period', null, 3000))
        } else if (this.state.description === null || this.state.description.length === 0) {
            this.setState({ loading: false }, () => NotificationManager.error('Please you should fill descripton', null, 3000))
        } else if (this.state.currentSelectedNode === null) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select organisation unit', null, 3000))
        } else if (this.state.currentSelectedIndicators.length === 0) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select Indicators', null, 3000))
        } else if (this.state.selectedSupervisors.length === 0) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select Supervisors', null, 3000))
        } else {
            const supervision = {}
            supervision.id = uuidv4()
            supervision.status = 'Planned'
            supervision.owner = this.state.me
            supervision.period = this.state.dates
            supervision.useStepper = this.state.useStepper
            supervision.description = this.state.description
            supervision.supervisors = this.state.selectedSupervisors
            supervision.indicators = this.state.currentSelectedIndicators
            supervision.organisationUnit = this.state.currentSelectedNode

            this.setState({ loading: false }, () => this.createSupervision(supervision))
        }
    })

    handleChange = event => event.target.type === 'checkbox' ? this.setState({ useStepper: event.target.checked }) : this.setState({ description: event.target.value })

    displayForms = () => this.state.currentSelectedNode !== null && this.state.selectedNodes.length > 0 && (
        <div className="col">
            <div className="form-group alert alert-secondary m-1" role="alert">
                <div className="font-weight-bold">Select Period</div>

                <Calendar
                    value={this.state.dates}
                    onChange={e => this.setState({ dates: e.value })}
                    selectionMode="range"
                    readOnlyInput={true} />

                <div className="font-weight-bold">Add description</div>

                <input
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.description} />

                <input
                    id="useStepper"
                    type="checkbox"
                    checked={this.state.useStepper}
                    value={this.state.useStepper}
                    onChange={this.handleChange}
                    className="form-check-input input-sm" />

                <label className="form-check-label" for="useStepper">Use Stepper</label>

                <hr />
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={this.handleSupervisionCreation}>
                    Schedule
                </button>
            </div>

            <div className="font-weight-bold mt-3">Select Supervisors</div>
            {this.displaySupervisors()}
        </div>
    )

    handleSupevisorSelection = supervisor => {
        const selectedSupervisors = [...this.state.selectedSupervisors]
        selectedSupervisors.push(supervisor)

        this.setState({ selectedSupervisors })
    }

    displaySupervisors = () => this.state.currentSelectedNode !== null && this.state.supervisors.length > 0 && (
        <div className="col">
            {
                this.state.supervisors.filter(supervisor => !this.state.selectedSupervisors.map(s => s.id).includes(supervisor.id))
                    .map(s => <div key={s.id} className="mt-3 p-3 text-left Settings" onClick={() => this.handleSupevisorSelection(s)}>{s.displayName}</div>)
            }
        </div>
    )

    removeHandleSupervisorsSelection = supervisor => {
        const selectedSupervisors = [...this.state.selectedSupervisors].filter(s => s.id !== supervisor.id)

        this.setState({ selectedSupervisors })
    }

    displaySelectedSupervisors = () => this.state.currentSelectedNode !== null &&
        this.state.selectedSupervisors.length > 0 &&
        this.state.selectedNodes.length > 0 &&
        (
            <div className="col">
                <div className="font-weight-bold">Selected Supervisors</div>

                {this.state.selectedSupervisors.map(s => <div key={s.id} className="mt-3 p-3 text-left Settings" onClick={() => this.removeHandleSupervisorsSelection(s)}>{s.displayName}</div>)}
            </div>
        )

    loadIndicatorsFromServer = () => axios.get(INDICATORS_ROUTE)
        .then(response => this.setState({ availableIndicators: response.data }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    handleCurrentSelectedIndicator = indicator => {
        const currentSelectedIndicators = [...this.state.currentSelectedIndicators]
        currentSelectedIndicators.push(indicator)

        this.setState({ currentSelectedIndicators })
    }

    displayAvailableIndicators = () => {
        if (this.state.availableIndicators.length > 0) {
            return (
                <div className="col alert alert-secondary scroll-indicators" role="alert">
                    <div className="font-weight-bold">Indicators</div>

                    <div className="m-1">
                        {this.state.availableIndicators
                            .filter(i => !this.state.currentSelectedIndicators.map(i => i.id).includes(i.id))
                            .map(indicator => (
                                <div className="row" key={indicator}>
                                    <div className={'col text-left Settings m-1 p-2'}
                                        onClick={() => this.handleCurrentSelectedIndicator(indicator)}>
                                        {indicator.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )
        } else {
            return <div className="col p-1" role="alert"><div className='alert alert-secondary'>You don't have any indicator configured yet</div></div>
        }
    }

    handleIndicatorRemoval = indicator => {
        const currentSelectedIndicators = [...this.state.currentSelectedIndicators].filter(i => i.id !== indicator.id)

        this.setState({ currentSelectedIndicators })
    }

    displayCurrentSelectedIndicators = () => {
        if (this.state.currentSelectedIndicators.length > 0) {
            return (
                <div className='col alert alert-secondary scroll-indicators' role='alert'>
                    <div className='font-weight-bold'>Selected Indicators</div>

                    <div className='m-1'>
                        {this.state.currentSelectedIndicators.map(indicator => (
                            <div className="row" key={indicator}>
                                <div className={'col text-left Settings m-1 p-2'}
                                    onClick={() => this.handleIndicatorRemoval(indicator)}>
                                    {indicator.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        } else {
            return <div className="col p-1" role="alert"><div className='alert alert-secondary'>No indicator selected yet</div></div>
        }
    }


    render = () => (
        <React.Fragment>
            <LoadingOverlay spinner active={this.state.loading} text='Processing ...' >
                <div className='row m-3'>
                    <div className='col'>

                        <div className="row m-3 text-left">
                            {this.displayAvailableIndicators()}

                            {this.displayCurrentSelectedIndicators()}
                            <hr />
                        </div>

                        <div className="row text-left">
                            <div className="col m-3">
                                <div className="font-weight-bold">Organisation Units</div>

                                <Tree value={this.state.nodes}
                                    selectionMode="checkbox"
                                    filter={true}
                                    selectionKeys={this.state.selectedNodeKeys3}
                                    onSelectionChange={e => this.setState({ selectedNodeKeys3: e.value })}
                                    onSelect={this.onSelect}
                                    onUnselect={this.onUnselect} />

                            </div>

                            {this.displaySelectedOrgUnits()}

                            {this.displayForms()}

                            {this.displaySelectedSupervisors()}
                        </div>

                    </div>
                </div>
            </LoadingOverlay>
        </React.Fragment>
    )
}

export default Supervision
