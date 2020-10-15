import axios from 'axios'
import { Tree } from 'primereact/tree'
import React, { Component } from 'react'
import { NotificationManager } from 'react-notifications'
import { SUPERVISORS_ROUTE, ME_ROUTE, SUPERVISIONS_ROUTE, TRACKER_PROGRAMS_ROUTE } from '../api.routes'
import { Calendar } from 'primereact/calendar'
import { v4 as uuidv4 } from 'uuid'
import LoadingOverlay from 'react-loading-overlay'
import { MultiSelect } from 'primereact/multiselect'
import moment from 'moment'
import { Dropdown } from 'primereact/dropdown'




export class Supervision extends Component {

    state = {
        me: null,
        dates: null,
        loading: false,
        supervisors: [],

        supervisions: [],
        settingsList: [],

        description: null,
        trackerPrograms: [],
        trackerProgram: null,
        selectedOrgUnit: null,

        otherSupervisors: null,
        selectedNodeKeys: null,

        selectedSupervisors: [],

        currentSelectedOrgUnit: null,
        currentSelectedSupervisor: null,
    }


    componentDidMount = () => {
        this.loadMe()
        this.loadSupervisors()
        this.loadTrackerPrograms()
    }


    loadSupervisors = () => axios.get(SUPERVISORS_ROUTE)
        .then(response => this.setState({ supervisors: response.data.users }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    loadTrackerPrograms = () => axios.get(TRACKER_PROGRAMS_ROUTE)
        .then(response => this.setState({ trackerPrograms: response.data.programs }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    createSupervision = supervision => this.setState({ loading: true }, () => {
        axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: response.data }, () => {
                const supervisions = response.data
                supervisions.push(supervision)

                axios.put(SUPERVISIONS_ROUTE, supervisions)
                    .then(() => {
                        this.setState({ loading: false }, () => {
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
        } else if (!this.state.trackerProgram) {
            this.setState({ loading: false }, () => NotificationManager.error('Please Select Supervision Type', null, 3000))
        } else if (this.props.supervisions.find(supervision => supervision.organisationUnit.id === this.props.selectedNode.id && moment(supervision.period[0]).format('Do MMMM, YYYY') === moment(this.state.dates[0]).format('Do MMMM, YYYY') && moment(supervision.period[1]).format('Do MMMM, YYYY') === moment(this.state.dates[1]).format('Do MMMM, YYYY'))) {
            this.setState({ loading: false }, () => NotificationManager.error('It seems this supervision already exists', null, 3000))
        } else {
            const supervision = {}
            supervision.id = uuidv4()
            supervision.status = 'Planned'
            supervision.owner = this.state.me
            supervision.period = this.state.dates
            supervision.description = this.state.description
            supervision.supervisors = this.state.selectedSupervisors
            supervision.organisationUnit = this.props.selectedNode
            supervision.indicators = this.props.indicators
            supervision.otherSupervisors = this.state.otherSupervisors
            supervision.program = this.state.trackerPrograms.find(program => program.id === this.state.trackerProgram)

            this.setState({ loading: false }, () => this.createSupervision(supervision))
        }
    })

    handleChange = event =>  this.setState({ description: event.target.value })

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


                <label for="trackerProgram" className="form-label font-weight-bold mt-2 d-block">Tracker Program</label>
                <Dropdown
                    filter
                    className="d-block"
                    optionLabel="name"
                    optionValue="code"
                    value={this.state.trackerProgram}
                    options={this.state.trackerPrograms.map(program => {
                        return { name: program.displayName, code: program.id }
                    })}
                    onChange={e => { this.setState({ trackerProgram: e.value }) }}
                    placeholder="Select a Tracker Program" />

                <label for="description" className="form-label font-weight-bold mt-2 d-block">Description Label</label>
                <textarea
                    id="description"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.description} ></textarea>

                <label for="mainSupervisors" className="form-label font-weight-bold mt-2 d-block">Supervisors</label>

                <MultiSelect
                    id="mainSupervisors"
                    className="d-block"
                    optionLabel="displayName"
                    options={this.state.supervisors}
                    value={this.state.selectedSupervisors}
                    onChange={e => this.setState({ selectedSupervisors: e.value })}
                    filter />

                <label for="otherSupervisors" className="form-label font-weight-bold mt-2">Other Supervisors</label>

                <textarea id="otherSupervisors" className="form-control" onChange={this.handleOtherSupervisorsChange}>{this.state.otherSupervisors}</textarea>

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
            <div className="col">
                <div className="mx-1 alert alert-primary">
                    <h4 className="d-block m-1">
                        Selected Supervisors
                    </h4>

                    {this.state.selectedSupervisors.map(s => <btn key={s.id} className="btn btn-sm btn-primary m-1" onClick={() => this.removeHandleSupervisorsSelection(s)}>{s.displayName}</btn>)}
                </div>
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
                            {
                                this.props.displayTree &&
                                <div className="col">
                                    <div className="font-weight-bold">Organisation Units</div>

                                    <Tree value={this.props.nodes}
                                        selectionMode="single"
                                        filter={true}
                                        selectionKeys={this.props.selectedNode}
                                        onSelectionChange={e => this.props.nodeHandler(e.value)} />

                                </div>
                            }


                            {this.displayForms()}



                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </React.Fragment>
    )
}

export default Supervision
