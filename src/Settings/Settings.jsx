import axios from 'axios'
import { Formik } from "formik"
import 'primeicons/primeicons.css'
import { ColorPicker } from 'primereact/colorpicker'
import { Paginator } from 'primereact/paginator'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/nova-light/theme.css'
import React, { Component } from 'react'
import { NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
import { v4 as uuidv4 } from 'uuid'
import { AGGREGATED_INDICATORS_ROUTE, API_BASE_ROUTE,TRACKER_PROGRAMS_ROUTE, GLOBAL_SETTINGS_ROUTE, INDICATORS_ROUTE, PROGRAMS_ROUTE, PROGRAM_INDICATORS_BY_PROGRAM_ROUTE, ME_ROUTE, SETTINGS_ROUTE } from '../api.routes'
import SettingsForm from '../SettingsForm/SettingsForm'
import { MultiSelect } from 'primereact/multiselect'
import { Dialog } from 'primereact/dialog';
import './Settings.css'


const C_PROGRAM_INDICATORS = 'Program indicators'
const C_AGGREGATED_INDICATORS = 'Aggregated Indicators'
const C_PAGINATION_ROWS_PER_PAGE = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export class Settings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            me: null,
            settingName: null,
            indicatorsSettings: [],
            displaySettingList: false,

            setting: null,

            settingsList: [],

            settings: [],
            
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
        this.loadMe()

        if (this.state.currentAction === C_PROGRAM_INDICATORS) {
            this.loadPrograms()
        } else if (this.state.currentAction === C_AGGREGATED_INDICATORS) {
            this.loadAggregatedIndicatorsWithGroups()
        }
    }

    loadMe = () => axios.get(ME_ROUTE)
        .then(response => this.setState({ me: response.data }, ()=> {
            this.retrieveGlobalSettingsFromServer()
            this.retrieveIndicatorsFromServer()
            this.loadTrackerPrograms()
        })).catch(error => NotificationManager.error(error.message, null, 3000))
    
    loadTrackerPrograms = ()=>
        axios.get(TRACKER_PROGRAMS_ROUTE)
        .then(response=>this.setState({trackerPrograms: response.data.programs}))
        .catch(error => NotificationManager.error(error.message, null, 3000))


    loadAggregatedIndicatorsWithGroups = () => 
    axios.get(API_BASE_ROUTE.concat(AGGREGATED_INDICATORS_ROUTE))
            .then(response => {
                this.setState({
                    currentAction: C_AGGREGATED_INDICATORS,
                    initialAggregatedIndicatorsWithGroups: response.data.indicatorGroups
                })
            }).catch(error => NotificationManager.error(error.message, null, 3000))
    

    loadPrograms = () => 
        axios.get(API_BASE_ROUTE.concat(PROGRAMS_ROUTE))
            .then(response => {
                this.setState({
                    currentAction: C_PROGRAM_INDICATORS,
                    initialPrograms: response.data.programs,
                    initialAggregatedIndicatorsWithGroups: response.data.programs,
                })
            }).catch(error => NotificationManager.error(error.message, null, 3000))
    

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
    

    classNameProvider = type => type === this.state.currentAction ? 'btn btn-primary btn-sm ' : 'btn btn-sm btn-light '

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
        }
    }

    handleAggregatedIndicatorsClick = indicator => this.setState({ selectedAggregatedIndicator: indicator })

    handleProgramClick = program => this.setState({ selectedProgram: program, selectedProgramIndicators: [] }, () => this.loadProgramIndicatorsByProgramId(program.id))

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
        
        if (this.state.displayCategoryForms && currentSelectedIndicator ) {

            return (
                <div className="row my-3">
                    <div className="col">
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
                                        className="form-group text-left alert alert-secondary">
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

                                            <div className="col btn-group">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-block--- btn-danger"
                                                    onClick={handleReset}
                                                    disabled={!dirty || isSubmitting} >
                                                    Reset
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="btn btn-sm btn-block btn-primary"
                                                    disabled={isSubmitting}>
                                                    Submit Category
                                                </button>
                                            </div>

                                        </div>

                                    </form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            )
        }
    }

    displayAggregatedIndicatorChildrens = () => this.state.currentAction === C_AGGREGATED_INDICATORS && this.state.selectedAggregatedIndicator !== null && (
        <div className="col my-1">
            <div className="m-1 text-left">
                <strong>
                    Available Indicators
                </strong>
            </div>

            {
                this.state.selectedAggregatedIndicator.indicators
                    .filter(i => !this.state.selectedIndicators
                        .filter(indicator => indicator.me.id === this.state.me.id)
                        .map(ai => ai.id).includes(i.id))
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
                    <div className="col alert alert-secondary">
                        No program indicator available for
                        
                        <span className="font-weight-bold p-3 text-primary"> {this.state.selectedProgram.displayName}</span>

                        <hr />
                        <button className="btn btn-light"
                            onClick={() => this.setState({ selectedProgram: null })}>Close</button>
                    </div>
                )
            } else {
                return (
                    <div className="col my-1">
                        <div className="m-1 text-left">
                            <strong>
                                Program Indicators
                            </strong>
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

    displaySelectedIndicators = () => this.state.selectedIndicators.filter(indicator => indicator.me.id === this.state.me.id).length > 0 && (
        <div className="col m-1">
            <div className="mb-1 text-left">
                <strong>
                    Configured Indicators
                </strong>
            </div>

            {
                this.state.selectedIndicators
                .filter(indicator => indicator.me.id === this.state.me.id)
                .map(indicator => (
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
            const indicators = [...this.state.selectedIndicators.filter(indicator => indicator.me.id === this.state.me.id)]
            const updatedIndicators = indicators.filter(i => i.id !== indicator.id)

            this.setState({ currentSelectedIndicator: null }, () => this.handleIndicatorsUpdateFromServer(updatedIndicators))
        }
    }


    handleIndicatorsUpdateFromServer = indicators => axios.put(INDICATORS_ROUTE, indicators.map(indicator => {
        indicator.me = this.state.me

        return indicator
    } ))
        .then(() => {
            this.setState({ currentSelectedIndicator: null }, () => {
                NotificationManager.success('Server Updated succefully !', null, 3000)                

                this.retrieveIndicatorsFromServer()
            })
        }).catch(error => NotificationManager.error(error.message, null, 3000))


    displayParentTitle = () => {
        if (this.state.currentAction === C_AGGREGATED_INDICATORS) {
            return <div className="mb-1 text-left"><strong>Indicator Groups</strong></div>
        } else if (this.state.currentAction === C_PROGRAM_INDICATORS) {
            return <div className="mb-1 text-left"> <strong>Programs</strong></div>
        }
    }

    reloadCategories = event => this.setState({ categoriesForm: event })

    updateSelectedIndicators = indicators => this.setState({ selectedIndicators: indicators })

    removeCurrentSelectedIndicator = () => this.setState({ currentSelectedIndicator: null })

    displayIndicatorsSettingForm = () => this.state.currentSelectedIndicator && (
         <SettingsForm
            removeCurrentSelectedIndicator={this.removeCurrentSelectedIndicator}
            handleIndicatorsUpdateFromServer={this.handleIndicatorsUpdateFromServer}
            reloadCategories={this.reloadCategories}
            handleIndicatorRemoval={this.handleIndicatorRemoval}
            updateSelectedIndicators={this.updateSelectedIndicators}
            trackerPrograms={this.state.trackerPrograms}
            categoriesForm={this.state.categoriesForm}
            selectedIndicators={this.state.selectedIndicators.filter(indicator => indicator.me.id === this.state.me.id)}
            currentSelectedIndicator={this.state.currentSelectedIndicator} />
    )

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
                <div className="row">
                    <div style={{ marginLeft: '-12px' }} className="col my-1">
                        <Paginator
                            style={{ width: '70%' }}
                            first={this.state.aggregatedFirstPage}
                            rows={this.state.aggregatedNumRows}
                            totalRecords={this.state.initialAggregatedIndicatorsWithGroups.length}
                            rowsPerPageOptions={[...C_PAGINATION_ROWS_PER_PAGE]}
                            onPageChange={this.onAggragatedIndicatorPageChange}
                            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
                    </div>
                </div>
                    )
                } else if (this.state.currentAction === C_PROGRAM_INDICATORS) {
                    return (
                        <div className="row">
                            <div style={{ marginLeft: '-12px' }} className="col my-1">
                            <Paginator
                                style={{ width: '70%' }}
                                first={this.state.programsFirstPage}
                                rows={this.state.programsNumRows}
                                totalRecords={this.state.initialAggregatedIndicatorsWithGroups.length}
                                rowsPerPageOptions={C_PAGINATION_ROWS_PER_PAGE}
                                onPageChange={this.onProgramsPageChange}
                                template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
                            </div>
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


    handleSettingCreation = () => axios
            .get(SETTINGS_ROUTE)
            .then(response => this.setState({ settingsList: response.data }, () => {
                const settingsList = this.state.settingsList
                settingsList.push({ id: uuidv4(),me: this.state.me, name: this.state.settingName, indicators: this.state.indicatorsSettings})

                axios.put(SETTINGS_ROUTE, settingsList)
                .then(() => axios.get(SETTINGS_ROUTE)
                                 .then(response => this.setState({ settingsList: response.data, settingName: null, indicatorsSettings: [] }, () => NotificationManager.success( 'Settings successfully saved', null, 3000)))
                                 .catch(error => NotificationManager.error(error.message, null, 3000)))
                .catch(error => NotificationManager.error(error.message, null, 3000))
            }))
            .catch(error => NotificationManager.error(error.message, null, 3000))
    

            retrieveSettingsFromDataStore = () => axios.get(SETTINGS_ROUTE)
                .then(response => this.setState({ settings: response.data, displaySettingList: true }, () => this.settingDetails()))
                .catch(error => NotificationManager.error(error.message, null, 3000))
                

    removeSettingFromDataStore   = () => {
                const settingsList = this.state.settingsList.filter(setting => setting.id !== this.state.setting.id)

                    axios.put(SETTINGS_ROUTE, settingsList)
                        .then(() => axios.get(SETTINGS_ROUTE)
                            .then(response => this.setState({ displaySettingList: true, setting: null, settings:[], settingsList: response.data, settingName: null, indicatorsSettings: [] }, () => this.retrieveSettingsFromDataStore() ))
                            .catch(error => NotificationManager.error(error.message, null, 3000)))
                        .catch(error => NotificationManager.error(error.message, null, 3000))
    }


    settingDetails = () => <Dialog header="Setting List" 
        visible={this.state.displaySettingList} 
        style={{ width: '75vw' }} 
        onHide={() => this.setState({ displaySettingList: false})}>

        {
            this.state.setting &&    <div className="row text-center alert alert-primary m-1 mt-3">
                
                <button onClick={() => this.removeSettingFromDataStore()} className="btn btn-sm btn-light m-2">
                    Delete
                </button>
                
                <button className="btn btn-link m-2">
                <strong className="text-uppercase"> {this.state.setting.name} </strong>
                </button>
                <br/>

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
                            this.state.setting.indicators.map(setting => <tr key={setting.id}>
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
                <div className="row m-1 text-center alert alert-primary" style={{ maxHeight: '300px', overflow: 'auto' }} >
                    

                    <table className="table table-sm table-hover text-left table-primary table-striped">
                        <thead>
                            <th>Name</th>
                        </thead>

                        <tbody>
                            {this.state.settings.filter(setting => setting.me.id === this.state.me.id).map(setting =><tr> <td>  <button key={setting.id} onClick={() => this.setState({ setting })} className="text-left d-block border btn btn-primary Settings align-middle" style={{ width: '100%' }}> {setting.name} </button>   </td></tr>)}
                        </tbody>
                    </table>
                </div>
            }
        </Dialog>


render = () => (
        <React.Fragment>
            <div className="row alert alert-light">
                <div className="col btn-group">
                    <h4>
                        Let's configure some indicators
                    </h4>
                    <hr/>

                    <button
                        onClick={this.loadAggregatedIndicatorsWithGroups}
                        className={this.classNameProvider(C_AGGREGATED_INDICATORS)}>
                        Aggregatted Indicators
                    </button>

                    <button
                        onClick={this.loadPrograms}
                        className={this.classNameProvider(C_PROGRAM_INDICATORS)}>
                        Program Indicators
                    </button>
                </div>
            </div>

            <div className="row m-1 mt-0 alert alert-primary">
                    <div className="col-4">
                        <input type="text" placeholder="Setting Name"
                            value={this.state.settingName }
                            onChange={e => this.setState({settingName: e.target.value})}
                            className="form-control input-sm" />
                    </div>

                    <div className="col">
                        <MultiSelect
                            placeholder="Select Indicators"
                            className="d-block"
                            optionLabel="label"
                            options={this.state.selectedIndicators.filter(indicator => indicator.me.id === this.state.me.id)}
                            value={this.state.indicatorsSettings}
                            onChange={e => this.setState({ indicatorsSettings: e.value })}
                            filter />
                    </div>

                    <div className="col-2 text-right btn-group">
                        <button className="btn btn-primary"
                            disabled={!this.state.settingName || this.state.settingName.length === 0  || this.state.indicatorsSettings.length === 0}
                            onClick={this.handleSettingCreation}>
                            Save setting
                        </button>

                        <button className="btn btn-light" onClick={() => this.retrieveSettingsFromDataStore() }>
                            Settings List
                        </button>
                    </div>
            </div>

            <div className="row m-1 mt-0 alert alert-primary">
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

            {this.settingDetails()}

        </React.Fragment>
    )
}

export default Settings
