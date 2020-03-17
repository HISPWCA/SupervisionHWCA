import axios from 'axios';
import React, { Component } from 'react';
import {
    AGGREGATED_INDICATORS_ROUTE,
    API_BASE_ROUTE, PROGRAMS_ROUTE,
    PROGRAM_INDICATORS_BY_PROGRAM_ROUTE
} from '../api.routes';
import './Settings.css';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const C_PROGRAMS = 'Programs';
const C_PROGRAM_INDICATORS = 'Program indicators';
const C_AGGREGATED_INDICATORS = 'Aggregated Indicators';

export class Settings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            currentAction: C_AGGREGATED_INDICATORS,
            metaDatas: [],
            childMetaDatas: [],

            aggregatedFirstPage: 0,
            aggregatedNumRows: 5,

            initialAggregatedIndicatorsWithGroups: [],
            selectedAggregatedIndicator: null,

            initialPrograms: [],
            selectedProgram: null,

            initialProgramIndicators: [],
            selectedProgramIndicator: null,
        }
    }

    componentDidMount = () => this.loadAggregatedIndicatorsWithGroups()

    loadAggregatedIndicatorsWithGroups = () => {
        axios.get(API_BASE_ROUTE.concat(AGGREGATED_INDICATORS_ROUTE))
            .then(response => {
                this.setState({
                    currentAction: C_AGGREGATED_INDICATORS,
                    initialAggregatedIndicatorsWithGroups: response.data.indicatorGroups
                })
            }).catch(error => {
                console.log(error)
            })
    }

    loadPrograms = () => {
        axios.get(API_BASE_ROUTE.concat(PROGRAMS_ROUTE))
            .then(response => {
                this.setState({
                    currentAction: C_PROGRAMS,
                    initialPrograms: response.data.programs
                }, () => this.loadProgramIndicatorsByProgramId(this.state.initialPrograms[0].id))
            }).catch(error => {
                console.log('error log ')
                console.log(error)
            })
    }

    loadProgramIndicatorsByProgramId = programId => {
        axios.get(
            API_BASE_ROUTE
                .concat('/programs/')
                .concat(programId)
                .concat(PROGRAM_INDICATORS_BY_PROGRAM_ROUTE)
        ).then(response => {
            this.setState({
                currentAction: C_PROGRAM_INDICATORS,
                initialPrograms: response.data
            })
        }).catch(error => {
            console.log('error log ')
            console.log(error)
        })
    }

    classNameProvider = type => type === this.state.currentAction ? 'btn btn-primary btn-sm ' : 'btn btn-sm btn-outline-primary '

    aggregatedIndicatorClassNameProvider = indicator => this.state.selectedAggregatedIndicator && this.state.selectedAggregatedIndicator.id === indicator.id ? 'col text-left SelectedSetting  m-1 p-3' : 'col text-left Settings  m-1 p-3'

    displayAggregatedIndicators = () => {
        if (this.state.currentAction === C_AGGREGATED_INDICATORS) {
            return (
                this.state.initialAggregatedIndicatorsWithGroups
                    .filter((i, index) => index >= this.state.aggregatedFirstPage && index <= (this.state.aggregatedFirstPage + 5))
                    .map(indicatorGroup => (
                        <div className="row" key={indicatorGroup.id}>
                            <div className={this.aggregatedIndicatorClassNameProvider(indicatorGroup)}
                                onClick={() => this.handleAggregatedIndicatorsClick(indicatorGroup)}>
                                {indicatorGroup.displayName}
                            </div>
                        </div>
                    ))
            )
        } else {
            return null
        }
    }

    handleAggregatedIndicatorsClick = indicator => this.setState({ selectedAggregatedIndicator: indicator })

    displayAggregatedIndicatorChildrens = () => {
        if (this.state.currentAction === C_AGGREGATED_INDICATORS &&
            this.state.selectedAggregatedIndicator !== null) {

            return (
                this.state.selectedAggregatedIndicator.indicators.map(indicator => (
                    <div className="row" key={indicator.id}>
                        <div className={'col text-left Settings m-1 p-3'}
                            onClick={() => this.handleIndicatorSelection(indicator)}>
                            {indicator.displayName}
                        </div>
                    </div>
                ))
            )
        }
    }

    handleIndicatorSelection = indicator => {
        console.log('mon indicateur selectonne est celui que voici')
        console.log(indicator)
    }

    displayParentTitle = () => {
        if (this.state.currentAction === C_AGGREGATED_INDICATORS) {
            return 'Indicator Groups'
        } else if (this.state.currentAction === C_PROGRAMS) {
            return 'Programs'
        }
    }

    onAggragatedIndicatorPageChange = event => this.setState({ aggregatedFirstPage: event.first, aggregatedNumRows: event.rows })

    render() {
        return (
            <React.Fragment>
                <div className="row m-3">
                    <div className="col-3 m-3 btn-group">
                        <button
                            onClick={this.loadAggregatedIndicatorsWithGroups}
                            className={this.classNameProvider(C_AGGREGATED_INDICATORS)}>
                            Indicators
                        </button>

                        <button
                            onClick={this.loadPrograms}
                            className={this.classNameProvider(C_PROGRAM_INDICATORS)}>
                            Program Indicators
                        </button>
                    </div>
                </div>

                <div className="row m-3">
                    <div className="col m-3">
                        <div className="mb-1 text-left">
                            {this.displayParentTitle()}
                        </div>

                        {this.displayAggregatedIndicators()}

                        <div className="m-3 p-3">
                            <Paginator
                                first={this.state.aggregatedFirstPage}
                                rows={this.state.aggregatedNumRows}
                                totalRecords={this.state.initialAggregatedIndicatorsWithGroups.length}
                                rowsPerPageOptions={[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                onPageChange={this.onAggragatedIndicatorPageChange}
                                template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
                        </div>
                    </div>

                    <div className="col m-3">
                        <div className="mb-1 text-left">
                            Available Indicators
                        </div>

                        {this.displayAggregatedIndicatorChildrens()}
                    </div>

                    <div className="col m-3">
                        <div className="row m-2">
                            <div className="col">
                                <div className="mb-1 text-left">
                                    Settings
                                </div>
                            </div>
                        </div>

                        <form>
                            <div className="form-group alert alert-info" role="alert">

                                <div className="row m-2">
                                    <div className="col-2 m-2">Name</div>
                                    <div className="col p-1"><input readOnly className="form-control" /></div>
                                </div>

                                <div className="row m-2">
                                    <div className="col-2 m-2">Label</div>
                                    <div className="col p-1"><input className="form-control" /></div>
                                </div>

                                <div className="row m-2">
                                    <div className="col-2 m-2">Weight</div>
                                    <div className="col p-1"><input className="form-control" /></div>
                                </div>

                                <div className="row m-1">
                                    <div className="col-1 m-2">
                                        <input className="form-control input-sm" readOnly style={{ width: '20px', height: '20px', backgroundColor: 'yellow' }} />
                                    </div>
                                    <div className="col text-left m-2">
                                        Target achieved/ on track
                                         <div className="row">
                                            <div className="col-1 mt-2">
                                                Min
                                            </div>
                                            <div className="col">
                                                <input type="number" className="form-control" />
                                            </div>
                                            <div className="col-1 mt-2">
                                                Max
                                            </div>
                                            <div className="col">
                                                <input type="number" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row m-1">
                                    <div className="col-1 m-2">
                                        <input className="form-control input-sm" readOnly style={{ width: '20px', height: '20px', backgroundColor: 'green' }} />
                                    </div>
                                    <div className="col text-left m-2">
                                        Target achieved/ on track
                                         <div className="row">
                                            <div className="col-1 mt-2">
                                                Min
                                            </div>
                                            <div className="col">
                                                <input type="number" className="form-control" />
                                            </div>
                                            <div className="col-1 mt-2">
                                                Max
                                            </div>
                                            <div className="col">
                                                <input type="number" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row m-1">
                                    <div className="col-1 m-2">
                                        <input className="form-control input-sm" readOnly style={{ width: '20px', height: '20px', backgroundColor: 'red' }} />
                                    </div>
                                    <div className="col text-left m-1">
                                        Target achieved/ on track
                                        <div className="row">
                                            <div className="col-1 mt-2">
                                                Min
                                            </div>
                                            <div className="col">
                                                <input type="number" className="form-control" />
                                            </div>
                                            <div className="col-1 mt-2">
                                                Max
                                            </div>
                                            <div className="col">
                                                <input type="number" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row m-3">
                                    <div className="col">
                                        <div class="form-check text-left">
                                            <input type="checkbox" class="form-check-input" id="hightIsGood" />
                                            <label class="form-check-label" for="hightIsGood">High is Good</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row m-3">
                                    <div className="col text-left">
                                        <button type="submit" className="btn btn-sm btn-outline-success">
                                            Save settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="col m-3">
                        <div className="mb-1 text-left">
                            Selected Indicators
                        </div>

                        {this.displayAggregatedIndicatorChildrens()}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Settings
