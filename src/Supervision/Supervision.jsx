import axios from 'axios'
import { Tree } from 'primereact/tree'
import React, { Component } from 'react'
import { NotificationManager } from 'react-notifications'
import { ORGANISATION_UNITS_ROUTE, SUPERVISORS_ROUTE, ME_ROUTE, INDICATORS_ROUTE, SUPERVISIONS_ROUTE } from '../api.routes'
import { Calendar } from 'primereact/calendar'
import { v4 as uuidv4 } from 'uuid'
import LoadingOverlay from 'react-loading-overlay'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'

export class Supervision extends Component {

    state = {
        me: null,
        nodes: [],
        dates: null,
        loading: false,
        supervisors: [],
        supervisions: [],
        settingsList: [],
        useStepper: true,
        description: null,
        selectedOrgUnit: null,
        otherSupervisors: null,
        selectedNodeKeys: null,
        selectedSupervisors: [],
        currentSelectedOrgUnit: null,
        currentSelectedSupervisor: null,
        currentSelectedSelectedSupervisionType: null,
    }

    componentDidMount = () => {
        this.loadMe()
        this.loadSupervisors()
        this.loadOrganisationUnits()
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
                            selectedSupervisors: [],
                            otherSupervisors: null,
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


    handleSupervisionCreation = () => this.setState({ loading: true }, () => {
        if (this.state.dates === null) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select date or Period', null, 3000))
        } else if (!this.state.description || this.state.description.length === 0) {
            this.setState({ loading: false }, () => NotificationManager.error('Please you should fill descripton', null, 3000))
        } else if (!this.props.selectedNode) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select organisation unit', null, 3000))
        } else if (this.state.selectedSupervisors.length === 0) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select Supervisors', null, 3000))
        } else if (!this.state.currentSelectedSelectedSupervisionType) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select Supervision Type', null, 3000))
        } else {
            const supervision = {}
            supervision.id = uuidv4()
            supervision.status = 'Planned'
            supervision.owner = this.state.me
            supervision.period = this.state.dates
            supervision.useStepper = this.state.useStepper
            supervision.description = this.state.description
            supervision.supervisors = this.state.selectedSupervisors
            supervision.organisationUnit = this.props.selectedNode
            supervision.indicators = this.props.indicators
            supervision.otherSupervisors = this.state.otherSupervisors

            this.setState({ loading: false }, () => this.createSupervision(supervision))
        }
    })

    handleChange = event => event.target.type === 'checkbox' ? this.setState({ useStepper: event.target.checked }) : this.setState({ description: event.target.value })

    handleOtherSupervisorsChange = event => this.setState({ otherSupervisors: event.target.value })

    displayForms = () => this.props.selectedNode && (
        <div className="col">
            <div className="form-group alert alert-primary m-1" role="alert">

                <strong className="d-block p-3 alert alert-secondary">
                    <h3> {this.props.selectedNode.displayName} </h3>
                </strong>

                <label for="period" className="form-label font-weight-bold mt-2 d-block">Select Period</label>
                <Calendar
                    id="period"
                    className="d-block"
                    value={this.state.dates}
                    onChange={e => this.setState({ dates: e.value })}
                    selectionMode="range"
                    readOnlyInput={true} />

                <label for="supervisionType" className="form-label font-weight-bold mt-2 d-block">Supervision type</label>
                <Dropdown
                    className="d-block"
                    optionLabel="name"
                    optionValue="code"
                    value={this.state.currentSelectedSelectedSupervisionType}
                    options={[{ name: 'Integrated Supervision', code: 'Integrated' }, { name: 'Specific Supervision', code: 'Specific' }]}
                    onChange={e => { this.setState({ currentSelectedSelectedSupervisionType: e.value }) }}
                    placeholder="Choose a Supervision Type" />

                <label for="description" className="form-label font-weight-bold mt-2 d-block">Add description</label>
                <textarea
                    id="description"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.description} ></textarea>

                <label for="mainSupervisors" className="form-label font-weight-bold mt-2 d-block">
                    Supervisors
                </label>
                <MultiSelect
                    id="mainSupervisors"
                    className="d-block"
                    optionLabel="displayName"
                    options={this.state.supervisors}
                    value={this.state.selectedSupervisors}
                    onChange={e => this.setState({ selectedSupervisors: e.value })}
                    filter />

                <label for="otherSupervisors" className="form-label font-weight-bold mt-2">
                    Other Supervisors
                </label>
                <textarea id="otherSupervisors" className="form-control" onChange={this.handleOtherSupervisorsChange}>{this.state.otherSupervisors}</textarea>

                <div className="row">
                    <div className="col">
                        <label className="form-check-label m-2" for="useStepper">
                            <input
                                id="useStepper"
                                type="checkbox"
                                checked={this.state.useStepper}
                                value={this.state.useStepper}
                                onChange={this.handleChange}
                                className="form-check-input input-sm" />
                         Use Stepper <em className="text-dark"> (Recommanded for huge datasets or complex forms) </em>
                        </label>
                    </div>
                </div>

                <hr />

                <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleSupervisionCreation}>
                    Schedule
                </button>
            </div>
        </div>
    )

    removeHandleSupervisorsSelection = supervisor => {
        const selectedSupervisors = [...this.state.selectedSupervisors].filter(s => s.id !== supervisor.id)

        this.setState({ selectedSupervisors })
    }

    displaySelectedSupervisors = () => this.props.selectedNode &&
        this.state.selectedSupervisors.length > 0 &&
        (
            <div className="col alert alert-primary">
                <strong>
                    Selected Supervisors
                </strong>
                <hr />

                {this.state.selectedSupervisors.map(s => <btn key={s.id} className="btn btn-primary m-1" onClick={() => this.removeHandleSupervisorsSelection(s)}>{s.displayName}</btn>)}
            </div>
        )


    render = () => (
        <React.Fragment>
            <LoadingOverlay spinner active={this.state.loading} text='Processing ...' >

                <div className='row'>
                    <div className='col'>

                        <div className="row">
                            {this.displaySelectedSupervisors()}
                        </div>

                        <div className="row text-left my-3">
                            <div className="col">
                                <div className="font-weight-bold">Organisation Units</div>

                                <Tree value={this.state.nodes}
                                    selectionMode="single"
                                    filter={true}
                                    selectionKeys={this.props.selectedNode}
                                    onSelectionChange={e => this.props.nodeHandler(e.value)} />

                            </div>


                            {this.displayForms()}



                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </React.Fragment>
    )
}

export default Supervision
