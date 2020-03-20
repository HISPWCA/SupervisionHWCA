import axios from 'axios';
import { Formik } from "formik";
import 'primeicons/primeicons.css';
import { ColorPicker } from 'primereact/colorpicker';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import React, { Component } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { v4 as uuidv4 } from 'uuid';
import { AGGREGATED_INDICATORS_ROUTE, API_BASE_ROUTE, PROGRAMS_ROUTE, PROGRAM_INDICATORS_BY_PROGRAM_ROUTE, INDICATORS_ROUTE } from '../api.routes';
import SettingsForm from '../SettingsForm/SettingsForm';
import './Settings.css';


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
            selectedIndicators: [],

            displayCategoryForms: false,
            currentSelectedIndicator: null,
            currentSelectedColor: null,

            categoriesForm: [],

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

    componentDidMount = () => {
        this.retrieveIndicatorsFromServer()
        this.loadAggregatedIndicatorsWithGroups()
    }

    loadAggregatedIndicatorsWithGroups = () => {
        axios.get(API_BASE_ROUTE.concat(AGGREGATED_INDICATORS_ROUTE))
            .then(response => {
                this.setState({
                    currentAction: C_AGGREGATED_INDICATORS,
                    initialAggregatedIndicatorsWithGroups: response.data.indicatorGroups
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

    loadPrograms = () => {
        axios.get(API_BASE_ROUTE.concat(PROGRAMS_ROUTE))
            .then(response => {
                this.setState({
                    currentAction: C_PROGRAMS,
                    initialPrograms: response.data.programs
                }, () => this.loadProgramIndicatorsByProgramId(this.state.initialPrograms[0].id))
            }).catch(error => NotificationManager.error(error.message, null, 3000))
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
        }).catch(error => NotificationManager.error(error.message, null, 3000))
    }

    retrieveIndicatorsFromServer = () => {
        axios.get(INDICATORS_ROUTE)
            .then(response => this.updateSelectedIndicators(response.data))
            .catch(error => NotificationManager.error(error.message, null, 3000))
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

    createGlobalSettings = () => {
        return (
            <div className="row m-3">
                <div className="col-7 ml-3 form-group alert alert-info" role="alert">
                    <Formik
                        initialValues={{ bestPerformance: 1, worstPerformance: 1, usePercentage: true }}
                        onSubmit={async values => {
                            await new Promise(resolve => setTimeout(resolve, 500));
                            alert(JSON.stringify(values, null, 2));
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
                            );
                        }}
                    </Formik>
                </div>
            </div>
        )
    }

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
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            )
        } else {
            return null
        }
    }

    displayAggregatedIndicatorChildrens = () => {
        if (this.state.currentAction === C_AGGREGATED_INDICATORS &&
            this.state.selectedAggregatedIndicator !== null) {

            return (
                <div className="col m-3">
                    <div className="mb-1 text-left">
                        Available Indicators
                        </div>

                    {this.state.selectedAggregatedIndicator.indicators
                        .filter(i => !this.state.selectedIndicators
                            .map(ai => ai.id)
                            .includes(i.id)
                        )
                        .map(indicator => (
                            <div className="row" key={indicator.id}>
                                <div className={'col text-left Settings m-1 p-3'}
                                    onClick={() => this.handleCurrentSelectedIndicator(indicator)}>
                                    {indicator.displayName}
                                </div>
                            </div>
                        ))}
                </div>
            )
        }
    }

    displaySelectedIndicators = () => {
        if (this.state.selectedIndicators.length > 0) {

            return (
                <div className="col m-3">
                    <div className="mb-1 text-left">
                        Selected Indicators
                    </div>

                    {this.state.selectedIndicators.map(indicator => (
                        <div className="row" key={indicator}>
                            <div className={'col text-left Settings m-1 p-3'}
                                onClick={() => this.handleCurrentSelectedIndicator(indicator)}>
                                {indicator.name}
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    }

    handleIndicatorRemoval = indicator => {
        if (indicator && indicator !== null && indicator !== undefined) {
            const indicators = [...this.state.selectedIndicators]
            const updatedIndicators = indicators.filter(i => i.id !== indicator.id)

            this.setState({ currentSelectedIndicator: null }, () => this.handleIndicatorsUpdateFromServer(updatedIndicators))
        }
    }

    handleIndicatorsUpdateFromServer = indicators => {
        axios.put(INDICATORS_ROUTE, indicators)
            .then(() => {
                this.setState({ currentSelectedIndicator: null }, () => {
                    NotificationManager.success('Server Updated succefully !', null, 3000)
                    this.retrieveIndicatorsFromServer()
                })
            }).catch(error => NotificationManager.error(error.message, null, 3000))
    }



    displayParentTitle = () => {
        if (this.state.currentAction === C_AGGREGATED_INDICATORS) {
            return <div className="mb-1 text-left">Indicator Groups</div>
        } else if (this.state.currentAction === C_PROGRAMS) {
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

            return (<SettingsForm
                removeCurrentSelectedIndicator={this.removeCurrentSelectedIndicator}
                handleIndicatorsUpdateFromServer={this.handleIndicatorsUpdateFromServer}
                reloadCategories={this.reloadCategories}
                handleIndicatorRemoval={this.handleIndicatorRemoval}
                updateSelectedIndicators={this.updateSelectedIndicators}
                categoriesForm={this.state.categoriesForm}
                selectedIndicators={this.state.selectedIndicators}
                currentSelectedIndicator={this.state.currentSelectedIndicator} />)
        } else {
            return null
        }
    }

    onAggragatedIndicatorPageChange = event => this.setState({ aggregatedFirstPage: event.first, aggregatedNumRows: event.rows })

    onSelectedIndicatorPageChange = event => this.setState({ selectedIndicatorsFirstPage: event.first, selectedIndicatorsNumRows: event.rows })

    onAvailableIndicatorPageChange = event => this.setState({ availableIndicatorsFirstPage: event.first, availableIndicatorsNumRows: event.rows })

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

                {this.createGlobalSettings()}

                <div className="row m-3">
                    <div className="col m-3">

                        {this.displayParentTitle()}

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

                        {this.createCategoryForm()}
                    </div>

                    {this.displayAggregatedIndicatorChildrens()}

                    {this.displayIndicatorsSettingForm()}

                    {this.displaySelectedIndicators()}

                </div>

                <NotificationContainer />
            </React.Fragment >
        )
    }
}

export default Settings
