import axios from 'axios'
import { Tree } from 'primereact/tree'
import React, { Component } from 'react'
import { NotificationManager } from 'react-notifications'
import { SUPERVISORS_ROUTE, ME_ROUTE, SUPERVISIONS_ROUTE, TRACKER_PROGRAMS_ROUTE, TRACKED_ENTITY_ATTRIBUTES_ROUTE, ENROLLMENTS_ROUTE, EVENTS_ROUTE, TRACKED_ENTITY_INSTANCES_ROUTE } from '../api.routes'
import { Calendar } from 'primereact/calendar'
import { v4 as uuidv4 } from 'uuid'
import LoadingOverlay from 'react-loading-overlay'
import { MultiSelect } from 'primereact/multiselect'
import moment from 'moment'
import { Dropdown } from 'primereact/dropdown'
import translate from '../utils/translator'

const NOM_ACTEUR = 'Nom acteur'
const TYPE_ACTEUR = "Type d'acteur"

export class Supervision extends Component {

    state = {
        me: null,
        dates: null,
        loading: false,
        supervisors: [],

        profileID: null,

        supervisions: [],
        settingsList: [],
        
        selectedTEI: null,
        availableTEIs: [],

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

                            NotificationManager.success(translate('SupervisionPlannedSuccessfully'), null, 3000)
                        })
                    }).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
            })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
    })


    loadMe = () => axios.get(ME_ROUTE)
        .then(response => this.setState({ me: response.data }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    handleSupervisionCreation = () => this.setState({ loading: true }, () => {
        if (this.state.dates === null) 
            this.setState({ loading: false }, () => NotificationManager.error(translate('PleaseSelectDateOrPeriod'), null, 3000))
        else if (!this.state.description || this.state.description.length === 0) 
            this.setState({ loading: false }, () => NotificationManager.error(translate('PleaseYouShouldFillDescripton'), null, 3000))
        else if (!this.props.selectedNode) 
            this.setState({ loading: false }, () => NotificationManager.error(translate('PleaseSelectOrganisationUnit'), null, 3000))
        else if (this.state.selectedSupervisors.length === 0) 
            this.setState({ loading: false }, () => NotificationManager.error(translate('PleaseSelectSupervisors'), null, 3000))
        else if (!this.state.trackerProgram) 
            this.setState({ loading: false }, () => NotificationManager.error(translate('PleaseSelectTrackerProgram'), null, 3000))
        else if (this.props.supervisions.find(supervision => supervision.organisationUnit.id === this.props.selectedNode.id && moment(supervision.period[0]).format('Do MMMM, YYYY') === moment(this.state.dates[0]).format('Do MMMM, YYYY') && moment(supervision.period[1]).format('Do MMMM, YYYY') === moment(this.state.dates[1]).format('Do MMMM, YYYY'))) 
            this.setState({ loading: false }, () => NotificationManager.error(translate('ItSeemsThisSupervisionAlreadyExists'), null, 3000))
        else {
            const supervisionProgram = this.state.trackerPrograms.find(program => program.id === this.state.trackerProgram)

            if (!this.state.selectedTEI){
                const TEI_ROUTE = TRACKED_ENTITY_ATTRIBUTES_ROUTE.concat(supervisionProgram.programTrackedEntityAttributes[0].trackedEntityAttribute.id).concat('/generate.json')
                this.setState({loading: true}, () => {
                    axios.get(TEI_ROUTE)
                            .then(response => this.setState({ loading: false }, () => {
                                const tei = {}
                                      tei.orgUnit = this.props.selectedNode.id
                                      tei.trackedEntityType = supervisionProgram.trackedEntityType.id
                                      tei.attributes = [{ attribute: response.data.ownerUid, value: response.data.value }]

                                this.setState({loading: true}, () => axios.post(TRACKED_ENTITY_INSTANCES_ROUTE, tei)
                                .then(resp => this.setState({ loading: false }, () => {
                                    const enrollment = {}
                                    enrollment.trackedEntityInstance = resp.data.response.importSummaries[0].reference
                                    enrollment.orgUnit = this.props.selectedNode.id
                                    enrollment.program = supervisionProgram.id

                                    this.setState({loading: true}, () => axios.post(ENROLLMENTS_ROUTE, enrollment)
                                        .then(() => this.setState({loading: false}, () => {
                                            
                                            this.setState({loading: true}, () => {
                                                const URL = TRACKED_ENTITY_INSTANCES_ROUTE.concat('.json?program=').concat(this.state.trackerProgram).concat('&ou=').concat(this.props.selectedNode.id).concat('&ouMode=SELECTED&order=created:desc&fields=*,enrollments[*]')
                                    
                                                axios.get(URL)
                                                .then(response => this.setState({loading: false}, () => this.setState({
                                                    availableTEIs: (response.data.trackedEntityInstances.length === 0 || response.data.trackedEntityInstances.length === 1) ? 
                                                    response.data.trackedEntityInstances :  
                                                    response.data.trackedEntityInstances.map(tei => {
                                                        let nomActeurObject = tei.attributes.find(attribute => attribute.displayName === NOM_ACTEUR)
                                                        let typeActeurObject = tei.attributes.find(attribute => attribute.displayName === TYPE_ACTEUR)
                                                      
                                                        nomActeurObject = nomActeurObject ? nomActeurObject : NOM_ACTEUR
                                                        typeActeurObject = typeActeurObject ? typeActeurObject : TYPE_ACTEUR

                                                        const name = typeActeurObject?.value.concat(' - ').concat(nomActeurObject?.value)
                                                        tei.name = name
                                        
                                                        return tei
                                                    }) }, () => this.state.availableTEIs.length === 1 && this.setState({selectedTEI: this.state.availableTEIs[0]}, () => this.handleSupervisionCreation()))))
                                                    .catch(error => this.setState({loading: false}, () => NotificationManager.error(error.message, null, 3000)))
                                            })
                                            
                                        })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000))))

                                })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000))))

                            })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))})
            } else {

                const supervision = {}
                    supervision.id = uuidv4()
                    supervision.status = 'Planned'
                    supervision.owner = this.state.me
                    supervision.period = this.state.dates
                    supervision.tei = this.state.selectedTEI
                    supervision.description = this.state.description
                    supervision.supervisors = this.state.selectedSupervisors
                    supervision.organisationUnit = this.props.selectedNode
                    supervision.indicators = this.props.indicators
                    supervision.otherSupervisors = this.state.otherSupervisors
                    supervision.program = supervisionProgram

                this.setState({ loading: false }, () => {
                    const enrollment = this.state.selectedTEI.enrollments[0]
                    const events = supervision.program.programStages.map(programStage => ({
                        enrollment: enrollment.enrollment,
                        dueDate: supervision.period[1] ? supervision.period[1]: supervision.period[0],
                        programStage: programStage.id,
                        trackedEntityInstance: this.state.selectedTEI.trackedEntityInstance,
                        status: 'SCHEDULE',
                        program: enrollment.program,
                        orgUnit: enrollment.orgUnit,
                    }))

                    enrollment.events = enrollment.events.concat(events)
                    this.eventsGenerator(enrollment, supervision)    
                })
            }
        }
    })


    generateTrackedEntityInstanceWithEnrollmentAndEvent = supervision => this.setState({ loading: true },
        () => axios.get(TRACKED_ENTITY_ATTRIBUTES_ROUTE.concat(supervision.program.programTrackedEntityAttributes[0].trackedEntityAttribute.id).concat('/generate.json'))
            .then(response => this.setState({ loading: false }, () => {
                const tei = {}
                tei.trackedEntityType = supervision.program.trackedEntityType.id
                tei.orgUnit = supervision.organisationUnit.id
                tei.attributes = [{ attribute: response.data.ownerUid, value: response.data.value }]

                this.teiGenerator(tei, supervision)
            })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000))))


    teiGenerator = (tei, supervision) => axios.post(TRACKED_ENTITY_INSTANCES_ROUTE, tei)
        .then(resp => this.setState({ loading: false }, () => {
            const trackedEntityInstance = resp.data.response.importSummaries[0].reference
            const orgUnit = supervision.organisationUnit.id
            const program = supervision.program.id

            const enrollment = {}
            enrollment.trackedEntityInstance = trackedEntityInstance
            enrollment.program = program
            enrollment.orgUnit = orgUnit

            axios.post(ENROLLMENTS_ROUTE, enrollment)
                .then(res => {
                    // const e = {}
                    // e.events = supervision.program.programStages.map(programStage => ({
                    //     enrollment: res.data.response.importSummaries[0].reference,
                    //     dueDate: supervision.period[0],
                    //     programStage: programStage.id,
                    //     trackedEntityInstance,
                    //     status: 'SCHEDULE',
                    //     program,
                    //     orgUnit,
                    // }))

                    // this.eventsGenerator(e, supervision)
                    this.createSupervision(supervision)

                }).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))

        })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))


    eventsGenerator = (e, supervision) => axios.post(EVENTS_ROUTE, e)
        .then(() => this.setState({ loading: false }, () => this.createSupervision(supervision)))
        .catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))

    handleChange = event => this.setState({ description: event.target.value })

    handleOtherSupervisorsChange = event => this.setState({ otherSupervisors: event.target.value })

    displayForms = () => this.props.selectedNode && (
        <div className="col-3">
            <div className="form-group alert alert-primary m-1" role="alert">

                <strong className="d-block p-3 alert alert-secondary">
                    <h3> {this.props.selectedNode.displayName} </h3>
                </strong>

                <label for="period" className="form-label font-weight-bold mt-2 d-block"> {translate('SelectPeriod')} </label>
                <Calendar
                    id="period"
                    className="d-block"
                    value={this.state.dates}
                    onChange={e => this.setState({ dates: e.value })}
                    selectionMode="range"
                    readOnlyInput={true} />


                <label for="trackerProgram" className="form-label font-weight-bold mt-2 d-block"> {translate('TrackerProgram')} </label>
                <Dropdown
                    filter
                    className="d-block"
                    optionLabel="name"
                    optionValue="code"
                    value={this.state.trackerProgram}
                    options={this.state.trackerPrograms.map(program => ({ name: program.displayName, code: program.id }))}
                    onChange={e =>  this.setState({ trackerProgram: e.value }, () => this.loadTEIs()) }
                    placeholder={translate('SelectATrackerProgram')} />

                {
                    this.state.availableTEIs.length > 1 && 
                    <React.Fragment>
                        <label for="teiSelection" className="form-label font-weight-bold mt-2 d-block"> {translate('Actor')} </label>
                        <Dropdown
                            filter
                            className="d-block"
                            optionLabel="name"
                            optionValue="code"
                            value={this.state.selectedTEI}
                            options={this.state.availableTEIs.map(tei => ({ name: tei.name, code: tei })).sort((a, b) => a.name - b.name )}
                            onChange={e =>  this.setState({ selectedTEI: e.value }) }
                            placeholder={translate('Actor')} />
                    </React.Fragment>
                }

                <label for="description" className="form-label font-weight-bold mt-2 d-block">{translate('Description')}</label>
                <textarea
                    id="description"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.description} ></textarea>

                <label for="mainSupervisors" className="form-label font-weight-bold mt-2 d-block">{translate('Supervisors')}</label>

                <MultiSelect
                    id="mainSupervisors"
                    className="d-block"
                    optionLabel="displayName"
                    options={this.state.supervisors}
                    value={this.state.selectedSupervisors}
                    onChange={e => this.setState({ selectedSupervisors: e.value })}
                    filter />

                <label for="otherSupervisors" className="form-label font-weight-bold mt-2">{translate('OtherSupervisors')}</label>

                <textarea id="otherSupervisors" className="form-control" onChange={this.handleOtherSupervisorsChange}>{this.state.otherSupervisors}</textarea>

                <hr />

                <button
                    className="btn btn-sm btn-primary"
                    onClick={this.handleSupervisionCreation}>
                    {translate('Schedule')}
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
                        {translate('SelectedSupervisors')}
                    </h4>

                    {this.state.selectedSupervisors.map(s => <btn key={s.id} className="btn btn-sm btn-primary m-1" onClick={() => this.removeHandleSupervisorsSelection(s)}>{s.displayName}</btn>)}
                </div>
            </div>
        )

        loadTEIs = () => this.setState({loading: true}, () => {
            const URL = TRACKED_ENTITY_INSTANCES_ROUTE.concat('.json?program=').concat(this.state.trackerProgram).concat('&ou=').concat(this.props.selectedNode.id).concat('&ouMode=DESCENDANTS&order=created:desc&fields=*,enrollments[*]')

            axios.get(URL)
            .then(response => this.setState({loading: false}, () => this.setState({
                availableTEIs: (response.data.trackedEntityInstances.length === 0 || response.data.trackedEntityInstances.length === 1) ? 
                response.data.trackedEntityInstances :  
                response.data.trackedEntityInstances.map(tei => {
                    let nomActeurObject = tei.attributes.find(attribute => attribute.displayName === NOM_ACTEUR)
                    let typeActeurObject = tei.attributes.find(attribute => attribute.displayName === TYPE_ACTEUR)
                 
                    nomActeurObject = nomActeurObject ? nomActeurObject : NOM_ACTEUR
                    typeActeurObject = typeActeurObject ? typeActeurObject : TYPE_ACTEUR

                    const name = typeActeurObject?.value.concat(' - ').concat(nomActeurObject?.value)
                    tei.name = name
    
                    return tei
                }) }, () => this.state.availableTEIs.length === 1 && this.setState({selectedTEI: this.state.availableTEIs[0]}))))
                .catch(error => this.setState({loading: false}, () => NotificationManager.error(error.message, null, 3000)))
        })

        render = () => (
        <React.Fragment>
            <LoadingOverlay spinner active={this.state.loading} text={translate('Processing')} >

                <div className='row'>
                    <div className='col'>

                        <div className="row">
                            {this.displaySelectedSupervisors()}
                        </div>

                        <div className="row text-left my-3">
                            {
                                this.props.displayTree &&
                                <div className="col-3">
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
