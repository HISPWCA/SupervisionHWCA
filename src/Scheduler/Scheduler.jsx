import axios from 'axios'
import React, { Component } from 'react'
import { ME_ROUTE, SETTINGS_ROUTE, SUPERVISIONS_ROUTE } from '../api.routes'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import Supervision from '../Supervision/Supervision'
import moment from 'moment'
import { Paginator } from 'primereact/paginator'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import LoadingOverlay from 'react-loading-overlay'
import Header from '../Header/Header'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

const C_PAGINATION_ROWS_PER_PAGE = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const C_INDICATORS_BASED_CONFIGURATION = 'Indicators Based Configuration'
const C_ALL_ORGANISATION_UNITS = 'All Organisation Units'
const C_BASED_ON_SUPERVISION_FREQUENCIES = 'Based On Supervision Frequencies'
const C_BASED_ON_SUPERVISION_PERIOD = 'Based on Supervision Period'


export class Scheduler extends Component {

    // constructor(props) {
    //     super(props)

    state = {
        me: null,
        loading: false,
        supervisions: [],
        settingsList: [],
        selectedSetting: null,
        supervisionNumRows: 4,
        supervisionFirstPage: 0,
        selectedSupervision: null,
        displaySupervisionFormCreation: false,
        selectedConfig: null,
    }
    // }

    componentDidMount = () => {
        this.loadMe()
        this.loadSupervisions()
    }

    loadSupervisions = () => this.setState({ loading: true }, () => {
        axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: [] }, () => this.setState({ supervisions: response.data, loading: false })))
            .catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
    })


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
                        <td>{s.organisationUnit.label}</td>
                        <td>{s.owner.displayName}</td>
                        <td>{s.status}</td>
                        <td>
                            <button className="btn btn-light rounded" >
                                Details
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
            title: 'Confirm deletion',
            message: 'Do you really want to delete this data ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.processSupervisionDeletion(supervision)
                },
                {
                    label: 'No',
                    onClick: () => null
                },
            ]
        }
    )

    processSupervisionDeletion = supervision => this.setState({ loading: true }, () => {

        axios.get(SUPERVISIONS_ROUTE)
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

                            NotificationManager.info('Supervision deleted successfully', null, 3000)
                        })
                    }).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
            })).catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
    })


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
                                    <span className="font-weight-bold m-3 text-secondary">Status:</span>
                                    {this.state.selectedSupervision.status}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="font-weight-bold m-3 text-secondary">Owner:</span>
                                    {this.state.selectedSupervision.owner.displayName}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="font-weight-bold m-3 text-secondary">Use Stepper:</span>
                                    {this.state.selectedSupervision.useStepper ? 'Yes' : 'No'}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="font-weight-bold m-3 text-secondary">Organisation Unit:</span>
                                    {this.state.selectedSupervision.organisationUnit.label}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="font-weight-bold m-3 text-secondary">Start:</span>
                                    {moment(this.state.selectedSupervision.period[0]).format('dddd Do MMMM, YYYY')}
                                    <span className="font-weight-bold m-3 text-secondary">End:</span>
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
                        <thead><th>Indicators</th></thead>
                        <tbody>
                            {this.state.selectedSupervision.indicators.map(i => <tr key={i.id}><td>{i.label}</td></tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="col">
                    <table className="table table-hover table-sm table-striped text-left m-3">
                        <thead><th>Supervisors</th></thead>
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
                        Close
                    </button>

                    <button
                        className="btn btn-danger btn-sm p-1"
                        onClick={() => this.deleteSupervision(this.state.selectedSupervision)} >
                        Delete
                    </button>
                </div>
            </div>

        </React.Fragment>
    ))

    onHandlePageChange = event => this.setState({ supervisionFirstPage: event.first, supervisionNumRows: event.rows })

    renderPaginator = () => (this.state.supervisions.length > 0 && (
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
    ))


    retrieveSettingsFromDataStore = () => axios.get(SETTINGS_ROUTE)
        .then(response => this.setState({ settingsList: response.data }))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    render = () => (
        <React.Fragment>
            <Header title='Plannification' />

            <LoadingOverlay spinner active={this.state.loading} text='Processing ...' >
                {
                    <div className='row my-3'>
                        <div className='col text-left'>
                            <button
                                className={
                                    this.state.displaySupervisionFormCreation
                                        ? 'btn btn-sm btn-danger'
                                        : 'btn btn-sm btn-primary'
                                }
                                onClick={() => this.handleDisplayNewSupervison()}>
                                {this.state.displaySupervisionFormCreation ? 'Close Form' : 'New Planning'}
                            </button>
                        </div>
                    </div>
                }

                <div className="row">
                    <div className="col">
                        <table className="table table-hover table-primary table-sm table-striped text-left ">
                            <thead>
                                <th>Description</th>
                                <th>Start Date - End Date</th>
                                <th>Org. Unit</th>
                                <th>Status</th>
                                <th>Action</th>
                            </thead>
                            <tbody>

                                {this.state.supervisions
                                    .filter((i, index) => index >= this.state.supervisionFirstPage && index <= (this.state.supervisionFirstPage + 5))
                                    .map(s => (
                                        <tr key={s.id}>
                                            <td>{s.description}</td>
                                            <td>
                                                {moment(s.period[0]).format('Do MMMM, YYYY')}
                                                <span className="font-weight-bold m-3 text-secondary"> - </span>
                                                {moment(s.period[1]).format('Do MMMM, YYYY') === 'Invalid date' ? moment(s.period[0]).format('Do MMMM, YYYY') : moment(s.period[1]).format('Do MMMM, YYYY')}
                                            </td>
                                            <td>{s.organisationUnit.label}</td>
                                            <td>{s.status}</td>
                                            <td>
                                                <button
                                                    onClick={() => this.handleSupervisionDetails(s)}
                                                    className="btn btn-sm btn-light"
                                                    title="Display details">
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <br />

                        {this.renderPaginator()}
                    </div>
                </div>

                {this.displaySupervisionDetails()}

                {
                    this.state.displaySupervisionFormCreation && <div className="row text-center alert alert-primary m-1 mt-3">
                        <div className="col">
                            <button
                                onClick={() => this.setState({ selectedConfig: C_INDICATORS_BASED_CONFIGURATION })}
                                className="btn btn-sm btn-primary m-1">
                                {C_INDICATORS_BASED_CONFIGURATION}
                            </button>

                            <button
                                onClick={() => this.setState({ selectedConfig: C_ALL_ORGANISATION_UNITS })}
                                className="btn btn-sm btn-primary m-1">
                                {C_ALL_ORGANISATION_UNITS}
                            </button>

                            <button
                                disabled
                                onClick={() => this.setState({ selectedConfig: C_BASED_ON_SUPERVISION_FREQUENCIES })}
                                className="btn btn-sm btn-primary m-1">
                                {C_BASED_ON_SUPERVISION_FREQUENCIES}
                            </button>

                            <button
                                disabled
                                onClick={() => this.setState({ selectedConfig: C_BASED_ON_SUPERVISION_PERIOD })}
                                className="btn btn-sm btn-primary m-1">
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
                                <th>Label</th>
                                <th>Name</th>
                                <th>Hight is Good</th>
                                <th>Best</th>
                                <th>Worst</th>
                                <th>Weight</th>
                                <th>Categories</th>
                            </thead>

                            <tbody>
                                {
                                    this.state.selectedSetting.indicators.map(setting => <tr key={setting.id}>
                                        <td className="text-left">{setting.label}</td>
                                        <td className="text-left">{setting.name}</td>
                                        <td>{setting.hightIsGood ? 'Yes' : 'No'}</td>
                                        <td>{setting.best}</td>
                                        <td>{setting.worst}</td>
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
                        {this.state.settingsList.filter(setting => setting.me.id === this.state.me.id).map(setting => <div className="col-3 p-3">  <button key={setting.id} onClick={() => this.setState({ selectedSetting: setting })} className=" text-uppercase d-block border btn btn-primary Settings align-middle" style={{ height: '100px', width: '100%' }}> {setting.name} </button>   </div>)}
                    </div>
                }


                {(this.state.displaySupervisionFormCreation && this.state.selectedConfig === C_ALL_ORGANISATION_UNITS) && <Supervision loadSupervisions={this.loadSupervisions} />}

            </LoadingOverlay>
        </React.Fragment>
    )



}

export default Scheduler
