import axios from 'axios';
import { Formik } from "formik";
import 'primeicons/primeicons.css';
import { ColorPicker } from 'primereact/colorpicker';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { v4 as uuidv4 } from 'uuid';
import { AGGREGATED_INDICATORS_ROUTE, API_BASE_ROUTE,TRACKER_PROGRAMS_ROUTE, GLOBAL_SETTINGS_ROUTE, INDICATORS_ROUTE, PROGRAMS_ROUTE, PROGRAM_INDICATORS_BY_PROGRAM_ROUTE } from '../api.routes';
import SettingsForm from '../SettingsForm/SettingsForm';
import './Settings.css';


const C_PROGRAM_INDICATORS = 'Program indicators';
const C_AGGREGATED_INDICATORS = 'Aggregated Indicators';
const C_PAGINATION_ROWS_PER_PAGE = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export class Settings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            currentAction: C_AGGREGATED_INDICATORS,
            trackerPrograms: [],
            
            metaDatas: [],
            childMetaDatas: [],
            selectedIndicators: [],
            selectedProgramIndicators: [],

            globalSettings: { bestPerformance: 5, worstPerformance: 5, usePercentage: true },

            displayCategoryForms: false,
            currentSelectedIndicator: null,
            currentSelectedColor: null,

            categoriesForm: [],

            aggregatedFirstPage: 0,
            aggregatedNumRows: 5,

            programsFirstPage: 0,
            programsNumRows: 5,

            initialAggregatedIndicatorsWithGroups: [],
            selectedAggregatedIndicator: null,

            initialPrograms: [],
            selectedProgram: null,

            initialProgramIndicators: [],
            selectedProgramIndicator: null,
        }
    }


    componentDidMount = () => {
        this.retrieveGlobalSettingsFromServer()
        this.retrieveIndicatorsFromServer()
        this.loadTrackerPrograms()

        if (this.state.currentAction === C_PROGRAM_INDICATORS) {
            this.loadPrograms()
        } else if (this.state.currentAction === C_AGGREGATED_INDICATORS) {
            this.loadAggregatedIndicatorsWithGroups()
        }
    }

    
    loadTrackerPrograms = ()=>axios.get(TRACKER_PROGRAMS_ROUTE)
        .then(response=>this.setState({trackerPrograms: response.data.programs}))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    loadAggregatedIndicatorsWithGroups = () => {
        axios.get(API_BASE_ROUTE.concat(AGGREGATED_INDICATORS_ROUTE))
            .then(response => {
                this.setState({
                    currentAction: C_AGGREGATED_INDICATORS,
                    initialAggregatedIndicatorsWithGroups: response.data.indicatorGroups
                })
            }).catch(error => NotificationManager.error(error.message, null, 3000))
    }

    loadPrograms = () => {
        axios.get(API_BASE_ROUTE.concat(PROGRAMS_ROUTE))
            .then(response => {
                this.setState({
                    currentAction: C_PROGRAM_INDICATORS,
                    initialPrograms: response.data.programs,
                    initialAggregatedIndicatorsWithGroups: response.data.programs,
                })
            }).catch(error => NotificationManager.error(error.message, null, 3000))
    }

    handleCurrentSelectedIndicator = indicator => {

        if (indicator.hightIsGood === null || indicator.hightIsGood === undefined) {
            indicator.hightIsGood = true
        }

        this.setState({
            currentSelectedIndicator: null,
            displayCategoryForms: false,
            categoriesForm: [],
        }, () => this.setState({
            categoriesForm: indicator.categories || [],
            currentSelectedIndicator: indicator,
            displayCategoryForms: true,
        }))
    }


    loadProgramIndicatorsByProgramId = programId => {
        const route = API_BASE_ROUTE.concat('/programs/').concat(programId).concat(PROGRAM_INDICATORS_BY_PROGRAM_ROUTE)

        axios.get(route)
        .then(response => {
            this.setState({
                currentAction: C_PROGRAM_INDICATORS,
                selectedProgramIndicators: response.data.programIndicators
            })
        }).catch(error => NotificationManager.error(error.message, null, 3000))
    }


    retrieveIndicatorsFromServer = () => axios.get(INDICATORS_ROUTE)
            .then(response => this.updateSelectedIndicators(response.data))
            .catch(error => NotificationManager.error(error.message, null, 3000))
    

    retrieveGlobalSettingsFromServer = () =>         axios.get(GLOBAL_SETTINGS_ROUTE)
            .then(response => this.setState({ globalSettings: null }, () => this.setState({ globalSettings: response.data })))
            .catch(error => NotificationManager.error(error.message, null, 3000))


    updateGlobalSettingsOnServer = globalSettings => 
        axios.put(GLOBAL_SETTINGS_ROUTE, globalSettings)
            .then(() => this.retrieveGlobalSettingsFromServer())
            .catch(error => NotificationManager.error(error.message, null, 3000))
    

    classNameProvider = type => type === this.state.currentAction ? 'btn btn-primary btn-sm ' : 'btn btn-sm btn-outline-primary '

    aggregatedIndicatorClassNameProvider = indicator => this.state.selectedAggregatedIndicator && this.state.selectedAggregatedIndicator.id === indicator.id ? 'col text-left SelectedSetting  m-1 p-3' : 'col text-left Settings  m-1 p-3'

    programClassNameProvider = program => this.state.selectedProgram && this.state.selectedProgram.id === program.id ? 'col text-left SelectedSetting  m-1 p-3' : 'col text-left Settings  m-1 p-3'

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

    displayPrograms = () => {
        if (this.state.currentAction === C_PROGRAM_INDICATORS) {
            return (
                this.state.initialAggregatedIndicatorsWithGroups
                    .filter((i, index) => index >= this.state.programsFirstPage && index <= (this.state.programsFirstPage + 5))
                    .map(program => (
                        <div className="row" key={program.id}>
                            <div className={this.programClassNameProvider(program)}
                                onClick={() => this.handleProgramClick(program)}>
                                {program.displayName}
                            </div>
                        </div>
                    ))
            )
        } else {
            return null
        }
    }

    handleAggregatedIndicatorsClick = indicator => this.setState({ selectedAggregatedIndicator: indicator })

    handleProgramClick = program => this.setState({ selectedProgram: program, selectedProgramIndicators: [] }, () => this.loadProgramIndicatorsByProgramId(program.id))

    createGlobalSettings = () => this.state.globalSettings !== null && this.state.globalSettings !== undefined && (
                <div className="row my-3 p-1">
                    <div className="col-7 form-group alert alert-secondary" role="alert">
                        <Formik
                            initialValues={{
                                bestPerformance: this.state.globalSettings.bestPerformance,
                                worstPerformance: this.state.globalSettings.worstPerformance,
                                usePercentage: this.state.globalSettings.usePercentage
                            }}

                            onSubmit={async values =>  this.updateGlobalSettingsOnServer(values)} >

                            {
                            props => {
                                const {values,touched,errors,dirty,isSubmitting,handleChange,handleBlur,handleSubmit,handleReset} = props

                                return (
                                    <form onSubmit={handleSubmit}
                                        className="form-group text-left">

                                        <div className="row m-1">
                                            <div className="col text-left m-1">
                                                <h3>
                                                    Performance Metrics
                                                </h3>

                                                <div className="row">
                                                    <div className="col-1 mt-2">
                                                        Best
                                                    </div>
                                                    <div className="col">
                                                        <input
                                                            id="bestPerformance"
                                                            autoComplete="off"
                                                            type="number"
                                                            value={values.bestPerformance}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={
                                                                errors.bestPerformance && touched.bestPerformance
                                                                    ? "form-control text-input error input-sm"
                                                                    : "form-control text-input  input-sm"
                                                            } />
                                                    </div>

                                                    <div className="col-1 mt-2">
                                                        Worst
                                                    </div>

                                                    <div className="col">
                                                        <input
                                                            id="worstPerformance"
                                                            autoComplete="off"
                                                            type="number"
                                                            value={values.worstPerformance}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={
                                                                errors.worstPerformance && touched.worstPerformance
                                                                    ? "form-control text-input error input-sm"
                                                                    : "form-control text-input  input-sm"
                                                            } />
                                                    </div>

                                                    <div className="col">
                                                        <div className="form-check text-left">

                                                            <label
                                                                className="form-check-label m-2 "
                                                                for="usePercentage">Use Percentage</label>

                                                            <input
                                                                id="usePercentage"
                                                                autoComplete="off"
                                                                type="checkbox"
                                                                checked={values.usePercentage}
                                                                value={values.usePercentage}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                className={
                                                                    errors.usePercentage && touched.usePercentage
                                                                        ? "m-3 form-check-input text-input error input-sm"
                                                                        : "m-3 form-check-input text-input  input-sm"
                                                                } />
                                                        </div>
                                                    </div>

                                                    <div className="col">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger m-2"
                                                            onClick={handleReset}
                                                            disabled={!dirty || isSubmitting} >
                                                            Reset
                                                        </button>

                                                        <button
                                                            type="submit"
                                                            className="btn btn-sm btn-outline-success m-2"
                                                            disabled={isSubmitting}>
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )
                            }}
                        </Formik>
                    </div>
                    {this.printGlobalSettings()}
                </div>
            )
    

    printGlobalSettings = () => (
            <div className="col-5 form-group  p-1">
            <div className="alert alert-secondary" role="alert">
                <div className="row">
                    <div className="col text-left m-1">
                        <h3>
                            Global Settings
                            </h3>
                    </div>
                </div>

                <div className="row text-left">
                    <div className="col font-weight-bold">Display:</div>
                    <div className="col"> {this.displayBestPerformance()} best</div>
                    <div className="col"> {this.displayWorstPerformance()} Worst</div>
                    <div className="col">Use Percentage: {this.displayUsePercentage()}</div>
                </div>
            </div>
            </div>
        )

    createCategoryForm = () => {
        const currentSelectedIndicator = this.state.currentSelectedIndicator
        
        if (this.state.displayCategoryForms
            && currentSelectedIndicator
            && currentSelectedIndicator !== null
            && currentSelectedIndicator !== undefined) {

            return (
                <div className="row">
                    <div className="col m-3">
                        <Formik
                            initialValues={{ category: '', color: '' }}
                            onSubmit={async values => {

                                const category = values.category
                                if (category && category !== null && category !== undefined && category.trim().length > 0) {
                                    const defaultColor = '#eb1111'

                                    values.id = uuidv4()
                                    values.min = 0
                                    values.max = 100
                                    values.category = values.category.toLowerCase()
                                    values.color = this.state.currentSelectedColor !== null ? '#'.concat(this.state.currentSelectedColor) : defaultColor

                                    const categoriesForm = [...this.state.categoriesForm]

                                    if (categoriesForm.map(c => c.category).includes(values.category)) {
                                        NotificationManager.error('This category already exists, \n Try with another name please', null, 3000);
                                    } else if (categoriesForm.map(c => c.color).includes(values.color)) {
                                        NotificationManager.error('This color has already been used, \n Pick another color please', null, 3000);
                                    } else {
                                        categoriesForm.push(values)
                                        this.setState({ categoriesForm, displayCategoryForms: false }, () => this.setState({ displayCategoryForms: true }))
                                    }
                                } else {
                                    NotificationManager.error('You should provide category first', null, 3000);
                                }
                            }} >

                            {props => {
                                const {
                                    values,
                                    touched,
                                    errors,
                                    dirty,
                                    isSubmitting,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    handleReset
                                } = props;
                                return (
                                    <form onSubmit={handleSubmit}
                                        className="form-group text-left">
                                        <label htmlFor="category" style={{ display: "block" }}>
                                            Add Category
                                        </label>

                                        <input
                                            id="category"
                                            placeholder="Category Name"
                                            autoComplete="off"
                                            type="text"
                                            value={values.category}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={
                                                errors.category && touched.category
                                                    ? "form-control text-input error input-sm"
                                                    : "form-control text-input  input-sm"
                                            }
                                        />

                                        <div className="row mt-3">
                                            <div className="col">
                                                <ColorPicker
                                                    value={this.state.currentSelectedColor}
                                                    onChange={(e) => this.setState({ currentSelectedColor: e.value })} />

                                            </div>

                                            <div className="col">
                                                <input
                                                    id="colorCode"
                                                    placeholder="Color Code"
                                                    type="hidden"
                                                    value={values.color}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        errors.color && touched.color
                                                            ? "form-control text-input error input-sm"
                                                            : "form-control text-input  input-sm"
                                                    }
                                                />

                                                {errors.color && touched.color && (
                                                    <div className="input-feedback">{errors.color}</div>
                                                )}
                                            </div>

                                        </div>

                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger "
                                                onClick={handleReset}
                                                disabled={!dirty || isSubmitting} >
                                                Reset
                                    </button>

                                            <button
                                                type="submit"
                                                className="btn btn-sm btn-outline-success m-3"
                                                disabled={isSubmitting}>
                                                Submit
                                    </button>

                                        </div>
                                    </form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            )
        } else {
            return null
        }
    }

    displayAggregatedIndicatorChildrens = () => this.state.currentAction === C_AGGREGATED_INDICATORS && this.state.selectedAggregatedIndicator !== null && (
        <div className="col my-3">
            <div className="mb-1 text-left">
                Available Indicators
            </div>

            {
                this.state.selectedAggregatedIndicator.indicators
                    .filter(i => !this.state.selectedIndicators.map(ai => ai.id).includes(i.id))
                    .map(indicator => (
                        <div className="row" key={indicator.id}>
                            <div className={'col text-left Settings m-1 p-3'}
                                onClick={() => this.handleCurrentSelectedIndicator(indicator)}>
                                {indicator.displayName}
                            </div>
                        </div>
                    ))
            }

            {this.state.selectedAggregatedIndicator.indicators.length === 0 && <div className='alert alert-warning'> Nothing to display</div>}
        </div>
    )


    displayProgramIndicators = () => {
        if (this.state.currentAction === C_PROGRAM_INDICATORS &&
            this.state.selectedProgram !== null) {
            if (this.state.selectedProgramIndicators.length === 0) {
                return (
                    <div className="alert alert-secondary">
                        No program indicator available for
                        
                        <span className="font-weight-bold p-3 text-primary"> {this.state.selectedProgram.displayName}</span>

                        <hr />
                        <button className="btn btn-outline-warning"
                            onClick={() => this.setState({ selectedProgram: null })}>Close</button>
                    </div>
                )
            } else {
                return (
                    <div className="col my-3">
                        <div className="mb-1 text-left">
                            Program Indicators
                        </div>

                        {
                            this.state.selectedProgramIndicators
                                .filter(i => !this.state.selectedIndicators
                                    .map(ai => ai.id)
                                    .includes(i.id)
                                ).map(indicator => (
                                    <div className="row" key={indicator.id}>
                                        <div className={'col text-left Settings m-1 p-3'}
                                            onClick={() => this.handleCurrentSelectedIndicator(indicator)}>
                                            {indicator.displayName}
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                )
            }
        }
    }

    displaySelectedIndicators = () => this.state.selectedIndicators.length > 0 && (
        <div className="col m-3">
            <div className="mb-1 text-left">
                Selected Indicators
            </div>

            {
                this.state.selectedIndicators.map(indicator => (
                    <div className="row" key={indicator}>
                        <div className={'col text-left Settings m-1 p-3'}
                            onClick={() => this.handleCurrentSelectedIndicator(indicator)}>
                            {indicator.label}
                        </div>
                    </div>
                ))
            }
        </div>
    )


    handleIndicatorRemoval = indicator => {
        if (indicator && indicator !== null && indicator !== undefined) {
            const indicators = [...this.state.selectedIndicators]
            const updatedIndicators = indicators.filter(i => i.id !== indicator.id)

            this.setState({ currentSelectedIndicator: null }, () => this.handleIndicatorsUpdateFromServer(updatedIndicators))
        }
    }


    handleIndicatorsUpdateFromServer = indicators => axios.put(INDICATORS_ROUTE, indicators)
        .then(() => {
            this.setState({ currentSelectedIndicator: null }, () => {
                NotificationManager.success('Server Updated succefully !', null, 3000)                

                this.retrieveIndicatorsFromServer()
            })
        }).catch(error => NotificationManager.error(error.message, null, 3000))


    displayParentTitle = () => {
        if (this.state.currentAction === C_AGGREGATED_INDICATORS) {
            return <div className="mb-1 text-left">Indicator Groups</div>
        } else if (this.state.currentAction === C_PROGRAM_INDICATORS) {
            return <div className="mb-1 text-left">Programs</div>
        }
    }

    reloadCategories = event => this.setState({ categoriesForm: event })

    updateSelectedIndicators = indicators => this.setState({ selectedIndicators: indicators })

    removeCurrentSelectedIndicator = () => this.setState({ currentSelectedIndicator: null })

    displayIndicatorsSettingForm = () => {
        const currentSelectedIndicator = this.state.currentSelectedIndicator

        if (currentSelectedIndicator
            && currentSelectedIndicator !== undefined
            && currentSelectedIndicator !== null) {

            return (
                <SettingsForm
                    removeCurrentSelectedIndicator={this.removeCurrentSelectedIndicator}
                    handleIndicatorsUpdateFromServer={this.handleIndicatorsUpdateFromServer}
                    reloadCategories={this.reloadCategories}
                    handleIndicatorRemoval={this.handleIndicatorRemoval}
                    updateSelectedIndicators={this.updateSelectedIndicators}
                    trackerPrograms={this.state.trackerPrograms}
                    categoriesForm={this.state.categoriesForm}
                    selectedIndicators={this.state.selectedIndicators}
                    currentSelectedIndicator={this.state.currentSelectedIndicator} />
            )
        }
    }

    onAggragatedIndicatorPageChange = event => this.setState({ aggregatedFirstPage: event.first, aggregatedNumRows: event.rows })

    onProgramsPageChange = event => this.setState({ programsFirstPage: event.first, programsNumRows: event.rows })

    onSelectedIndicatorPageChange = event => this.setState({ selectedIndicatorsFirstPage: event.first, selectedIndicatorsNumRows: event.rows })

    onAvailableIndicatorPageChange = event => this.setState({ availableIndicatorsFirstPage: event.first, availableIndicatorsNumRows: event.rows })

    displayUsePercentage = () => {
        const usePercentage = this.state.globalSettings.usePercentage
        if (usePercentage === null || usePercentage === undefined) {
            return 'Not yet defined (Default is True)'
        } else if (usePercentage) {
            return 'True'
        } else {
            return 'False'
        }
    }

    handlePagination = () => {
        if (this.state.currentAction === C_AGGREGATED_INDICATORS) {
            return (
                <div className="mt-2">
                    <Paginator
                        first={this.state.aggregatedFirstPage}
                        rows={this.state.aggregatedNumRows}
                        totalRecords={this.state.initialAggregatedIndicatorsWithGroups.length}
                        rowsPerPageOptions={[...C_PAGINATION_ROWS_PER_PAGE]}
                        onPageChange={this.onAggragatedIndicatorPageChange}
                        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
                </div>
            )
        } else if (this.state.currentAction === C_PROGRAM_INDICATORS) {
            return (
                <div className="mt-2">
                    <Paginator
                        first={this.state.programsFirstPage}
                        rows={this.state.programsNumRows}
                        totalRecords={this.state.initialAggregatedIndicatorsWithGroups.length}
                        rowsPerPageOptions={C_PAGINATION_ROWS_PER_PAGE}
                        onPageChange={this.onProgramsPageChange}
                        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
                </div>
            )
        }
    }

    displayBestPerformance = () => {
        const bestPerformance = this.state.globalSettings.bestPerformance

        return bestPerformance === null || bestPerformance === undefined ? '5 (Default)' : bestPerformance
    }

    displayWorstPerformance = () => {
        const worstPerformance = this.state.globalSettings.worstPerformance

        return worstPerformance === null || worstPerformance === undefined ? '5 (Default)' : worstPerformance
    }

    render = () => (
        <React.Fragment>
            <div className="row m-1--">
                <div className="col btn-group">
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

            {this.createGlobalSettings()}

            <div className="row">
                <div className="col">

                    {this.displayParentTitle()}

                    {this.displayAggregatedIndicators()}

                    {this.displayPrograms()}

                    {this.handlePagination()}

                    {this.createCategoryForm()}
                </div>

                {this.displayAggregatedIndicatorChildrens()}

                {this.displayProgramIndicators()}

                {this.displayIndicatorsSettingForm()}

                {this.displaySelectedIndicators()}

            </div>

        </React.Fragment>
    )
}

export default Settings
