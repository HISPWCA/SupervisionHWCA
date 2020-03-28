import axios from 'axios';
import React, { Component } from 'react';
import { SUPERVISIONS_ROUTE } from '../api.routes';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import Supervision from '../Supervision/Supervision';
import './TableView.css';

export class TableView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            supervisions: [],
            displaySupervisionFormCreation: false,
        }
    }

    componentDidMount = () => this.loadSupervisions()

    loadSupervisions = () => {
        axios.get(SUPERVISIONS_ROUTE)
            .then(response => this.setState({ supervisions: response.data }, () => console.log(this.state.supervisions)))
            .catch(error => NotificationManager.error(error.message, null, 3000))
    }

    renderSupervisions = () => {
        if (this.state.supervisions.length > 0) {
            this.state.supervisions.map(s => {
                return (
                    <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.period}</td>
                        <td>{s.organisationUnit.label}</td>
                        <td>{s.owner.displayName}</td>
                        <td>{s.status}</td>
                        <td>
                            <button className="btn btn-outline-danger rounded" >
                                D&eacute;tails
                            </button>
                        </td>
                    </tr>
                )
            })
        }
    }

    handleDisplayNewSupervison = () => this.setState({ displaySupervisionFormCreation: !this.state.displaySupervisionFormCreation }, () => this.loadSupervisions())

    displaySupervisonstable = () => {
        if (!this.state.displaySupervisionFormCreation) {
            return (
                <div className="row m-3">
                    <div className="col">
                        <table className="table table-striped table-sm table-hover table-borderless">
                            <thead>
                                <th>ID</th>
                                <th>Period</th>
                                <th>Org. Unit.</th>
                                <th>Status</th>
                                <th>Action</th>
                            </thead>
                            <tbody>
                                {this.renderSupervisions()}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.displaySupervisonstable()}

                {this.state.displaySupervisionFormCreation && <Supervision handleDisplayNewSupervison={this.handleDisplayNewSupervison} />}

                {(<button
                    title="New Supervision"
                    className={this.state.displaySupervisionFormCreation ? 'TableView btn btn-outline-danger': 'TableView btn btn-outline-primary'}
                    onClick={() => this.handleDisplayNewSupervison()}>
                    {this.state.displaySupervisionFormCreation ? '-' : '+'}
                </button>)}
            </React.Fragment>
        )
    }
}

export default TableView
