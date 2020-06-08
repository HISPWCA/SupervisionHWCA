import axios from 'axios';
import React, { Component } from 'react';
import { SUPERVISIONS_ROUTE } from '../api.routes';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import Supervision from '../Supervision/Supervision';
import moment from 'moment';
import { Paginator } from 'primereact/paginator';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import LoadingOverlay from 'react-loading-overlay';


const C_PAGINATION_ROWS_PER_PAGE = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export class Scheduler extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            supervisions: [],
            supervisionNumRows: 4,
            supervisionFirstPage: 0,
            selectedSupervision: null,
            displaySupervisionFormCreation: false,
        }
    }

    componentDidMount = () => this.loadSupervisions()

    loadSupervisions = () => this.setState({ loading: true }, () => {
        axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: [] }, () => this.setState({ supervisions: response.data, loading: false })))
            .catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000)))
    })

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
                            <button className="btn btn-outline-danger rounded" >
                                Details
                            </button>
                        </td>
                    </tr>
                )
            })
        }
    }

    handleDisplayNewSupervison = () => this.setState({ displaySupervisionFormCreation: !this.state.displaySupervisionFormCreation }, () => this.loadSupervisions())

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
                        className="btn btn-outline-secondary btn-sm p-1"
                        onClick={() => this.setState({ selectedSupervision: null, displaySupervisionFormCreation: false })}>
                        Close
                    </button>

                    <button
                        className="btn btn-outline-danger btn-sm p-1"
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
            <div className='col'>
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

    render = () => (
        <React.Fragment>
            <LoadingOverlay spinner active={this.state.loading} text='Processing ...' >
                {
                    <div className='row ml-3'>
                        <div className='col text-left m-3'>
                            <button
                                className={
                                    this.state.displaySupervisionFormCreation
                                        ? 'btn-sm btn-outline-danger'
                                        : 'btn-sm btn-outline-success'
                                }
                                onClick={() => this.handleDisplayNewSupervison()}>
                                {this.state.displaySupervisionFormCreation ? 'Close Form' : 'New Planning'}
                            </button>
                        </div>
                    </div>
                }

                <div className="row m-3">
                    <div className="col m-3">
                        <table className="table table-hover table-sm table-striped text-left ">
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
                                                {moment(s.period[1]).format('Do MMMM, YYYY')}
                                            </td>
                                            <td>{s.organisationUnit.label}</td>
                                            <td>{s.status}</td>
                                            <td>
                                                <button
                                                    onClick={() => this.handleSupervisionDetails(s)}
                                                    className="btn btn-sm btn-outline-secondary"
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

                {this.state.displaySupervisionFormCreation && <Supervision loadSupervisions={this.loadSupervisions} />}

            </LoadingOverlay>
        </React.Fragment>
    )
}

export default Scheduler
