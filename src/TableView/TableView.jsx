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
            displaySupervisionFormCreation: true,
        }
    }

    componentDidMount = () => {
        this.loadSupervisions()
    }

    loadSupervisions = () => {
        axios.get(SUPERVISIONS_ROUTE)
            .then(response => {
                console.log('min mnnai si')
                console.log(response.data)
            }).catch(error => NotificationManager.success(error.message, null, 3000))
    }

    renderSupervisions = () => {
        // this.state.supervisions.map()        
    }

    handleDisplayNewSupervison = () => {
        this.setState({ displaySupervisionFormCreation: !this.state.displaySupervisionFormCreation })
    }

    displaySupervisonstable = () => {
        return (
            <div className="row m-3">
                <div className="col">
                    <table className="table table-striped table-sm table-hover table-borderless">
                        <thead>
                            <th>ID</th>
                            <th>Start Date (Approx.)</th>
                            <th>End Date (Approx.)</th>
                            <th>Orgs. Units.</th>
                            <th>State</th>
                        </thead>
                        <tbody>
                            {this.renderSupervisions()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.displaySupervisonstable()}

                {this.state.displaySupervisionFormCreation && <Supervision />}

                {this.state.displaySupervisionFormCreation &&
                    (<button
                        title="New Supervision"
                        className="TableView btn btn-outline-danger"
                        onClick={() => this.handleDisplayNewSupervison()}>+</button>)}
            </React.Fragment>
        )
    }
}

export default TableView
