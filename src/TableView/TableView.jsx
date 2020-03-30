import axios from 'axios';
import React, { Component } from 'react';
import { SUPERVISIONS_ROUTE } from '../api.routes';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import Supervision from '../Supervision/Supervision';
import './TableView.css';
import moment from 'moment';
import { Paginator } from 'primereact/paginator';

const C_PAGINATION_ROWS_PER_PAGE = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export class TableView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            supervisions: [],
            supervisionFirstPage: 0,
            supervisionNumRows: 4,
            selectedSupervision: null,
            displaySupervisionFormCreation: false,
        }
    }

    componentDidMount = () => this.loadSupervisions()

    loadSupervisions = () => {
        axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: [] }, () => this.setState({ supervisions: response.data })))
            .catch(error => NotificationManager.error(error.message, null, 3000))
    }

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

    deleteSupervision = supervision => {
        axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: response.data }, () => {
                const supervisions = response.data.filter(s => s.id !== supervision.id)

                axios.put(SUPERVISIONS_ROUTE, supervisions)
                    .then(() => {
                        this.setState({
                            selectedSupervision: null,
                            displaySupervisionFormCreation: false,
                        }, () => {
                            this.loadSupervisions()
                            NotificationManager.info('Supervision deleted successfully', null, 3000)
                        })
                    }).catch(error => NotificationManager.error(error.message, null, 3000))
            })).catch(error => NotificationManager.error(error.message, null, 3000))
    }

    handleSupervisionDetails = selectedSupervision => this.setState({ displaySupervisionFormCreation: false, selectedSupervision })

    displaySupervisionDetails = () => {
        if (this.state.selectedSupervision !== null
            && this.state.selectedSupervision !== undefined
            && !this.state.displaySupervisionFormCreation) {
            return (
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

                    <div className="row">
                        <div className="col">
                            <table className="table table-hover table-sm table-striped text-left m-3">
                                <thead><th>Indicators</th></thead>
                                <tbody>
                                    {this.state.selectedSupervision.indicators.map(i => {
                                        return <tr key={i.id}><td>{i.label}</td></tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="col">
                            <table className="table table-hover table-sm table-striped text-left m-3">
                                <thead><th>Supervisors</th></thead>
                                <tbody>
                                    {this.state.selectedSupervision.supervisors
                                        .map(s => <tr key={s.id}><td>{s.displayName}</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-3 row">
                        <div className="col btn-group">
                            <button
                                className="btn btn-outline-secondary btn-sm p-3"
                                onClick={() => this.setState({ selectedSupervision: null, displaySupervisionFormCreation: false })}>Close</button>

                            <button
                                className="btn btn-outline-danger btn-sm p-3"
                                onClick={() => this.deleteSupervision(this.state.selectedSupervision)} >Delete</button>
                        </div>
                    </div>

                </React.Fragment>
            )
        }
    }

    onHandlePageChange = event => this.setState({ supervisionFirstPage: event.first, supervisionNumRows: event.rows })

    renderPaginator = () => {
        if (this.state.supervisions.length > 0) {
            return (
                <Paginator
                    first={this.state.supervisionFirstPage}
                    rows={this.state.supervisionNumRows}
                    totalRecords={this.state.supervisions.length}
                    rowsPerPageOptions={[...C_PAGINATION_ROWS_PER_PAGE]}
                    onPageChange={this.onHandlePageChange}
                    template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />

            )
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="row m-3">
                    <div className="col">
                        <table className="table table-hover table-sm table-striped text-left m-3">
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
                                    .map(s => {
                                        return (
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
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Details">
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                        <br />

                        {this.renderPaginator()}
                    </div>
                </div>

                {this.displaySupervisionDetails()}

                {this.state.displaySupervisionFormCreation && <Supervision loadSupervisions={this.loadSupervisions} />}

                {(<button
                    className={
                        this.state.displaySupervisionFormCreation
                            ? 'TableView btn btn-outline-danger'
                            : 'TableView btn btn-outline-primary'
                    }
                    onClick={() => this.handleDisplayNewSupervison()}>
                    {this.state.displaySupervisionFormCreation ? '-' : '+'}
                </button>)}
            </React.Fragment>
        )
    }
}

export default TableView
