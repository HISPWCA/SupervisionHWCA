import axios from 'axios';
import React, { Component } from 'react';
import { INDICATORS_ROUTE } from '../api.routes';
import { NotificationManager } from 'react-notifications';
import translate from '../utils/translator';

const SELECT = translate('Select')

export class SettingsForm extends Component {

    state = {
        id: '',
        name: '',
        label: '',
        me: null,
        weight: 0,
        categories: [],
        selectedIndicators: [],
        selectedTrackerProgram: SELECT,
        hightIsGood: this.props.currentSelectedIndicator.hightIsGood,
    }

    componentDidMount = () => this.setState(
        {
            label: this.props.currentSelectedIndicator.label ? this.props.currentSelectedIndicator.label : this.props.currentSelectedIndicator.name,
            weight: this.props.currentSelectedIndicator.weight ? this.props.currentSelectedIndicator.weight : 0,
            name: this.props.currentSelectedIndicator ? this.props.currentSelectedIndicator.name : '',
            selectedTrackerProgram: this.props.currentSelectedIndicator.selectedTrackerProgram,
            hightIsGood: this.props.currentSelectedIndicator.hightIsGood,
            id: this.props.currentSelectedIndicator.id,
            categories: this.props.categoriesForm,
        }
    )

    handleChange = event => {
        const name = event.target.name

        if (event.target.type === 'select-one') 
            this.setState({ [name]: event.target.value === SELECT ? event.target.value : JSON.parse(event.target.value) })
        else if (event.target.type === 'checkbox') 
            this.setState({ [name]: event.target.checked })
         else if (name.endsWith('min') && name !== 'min') {
            const categories = [...this.props.categoriesForm]

            const category = categories.find(c => name === c.category.concat('_min'))
            const index = categories.indexOf(category)

            category.min = +event.target.value
            categories[index] = category

            this.setState({ categories }, () => this.props.reloadCategories(categories))

        } else if (name.endsWith('max') && name !== 'max') {
            const categories = [...this.props.categoriesForm]
            const category = categories.find(c => name === c.category.concat('_max'))
            const index = categories.indexOf(category)

            category.max = +event.target.value
            categories[index] = category

            this.setState({ categories }, () => this.props.reloadCategories(categories))

        } else 
            this.setState({ [name]: event.target.value })
    }


    handleSubmit = event => {
        event.preventDefault()

        this.setState({ categories: this.props.categoriesForm }, () => this.loadAndPersistIndicatorsOnServer())
    }


    loadAndPersistIndicatorsOnServer = () => axios.get(INDICATORS_ROUTE)
        .then(response => {
            this.props.updateSelectedIndicators(response.data)

            this.persistState()
        }).catch(error => NotificationManager.error(error.message, null, 3000))


    persistState = () => {
        const indicators = [...this.props.selectedIndicators]
        const indicator = indicators.find(i => i.id === this.state.id)
        const index = indicators.indexOf(indicator)

        if (indicators.length === 0 || index === -1) 
            indicators.push(this.state)
         else 
            indicators[index] = this.state

        this.props.handleIndicatorsUpdateFromServer(indicators)
    }


    retrieveMinValue = id => {
        const category = this.state.categories.filter(c => c.id === id)[0]
        if (category) 
            return category.min
         else 
            return 0
    }

    retrieveMaxValue = id => {
        const category = this.state.categories.filter(c => c.id === id)[0]
        if (category) 
            return category.max
         else 
            return 100
    }

    deleteCategory = id => {
        const categories = [...this.props.categoriesForm].filter(c => c.id !== id)

        this.setState({ categories }, () => this.props.reloadCategories(categories))
    }

    displayCustomSettingForms = () => {
        return (
            this.props.categoriesForm.map(c => (

                <div className="row m-1" key={c.id}>
                    <div className="col-1 m-2">
                        <input readOnly
                            className="form-control input-sm"
                            style={{ width: '20px', height: '20px', backgroundColor: c.color }} />
                    </div>

                    <div className="col text-left m-2">
                        <div style={{ textTransform: 'capitalize' }}>
                            <strong title={translate('DeleteThisCategory')}
                                className="m-3 font-weight-bold text-danger cursorPointer"
                                onClick={() => this.deleteCategory(c.id)}>
                                x
                            </strong>
                            {c.category}
                        </div>

                        <div className="row">
                            <div className="col-2 mt-2">
                                {translate('Min')}
                            </div>
                            <div className="col">
                                <input type="number"
                                    onChange={this.handleChange}
                                    name={c.category.concat('_min')}
                                    value={this.retrieveMinValue(c.id)}
                                    className="form-control" />
                            </div>
                            <div className="col-2 mt-2">
                                {translate('Max')}
                            </div>

                            <div className="col">
                                <input type="number"
                                    name={c.category.concat('_max')}
                                    onChange={this.handleChange}
                                    value={this.retrieveMaxValue(c.id)}
                                    className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>
            ))
        )
    }

    render() {
        return (
            <div className="col" >
                <div className="row">
                    <div className="col">
                        <div className="mb-1 px-1 text-left">
                            <strong>
                                {translate('Settings')}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="form-group alert alert-secondary" role="alert">
                    <form onSubmit={this.handleSubmit} className="form-group text-left">

                        <input
                            name="id"
                            type="hidden"
                            value={this.state.id}
                            onChange={this.handleChange} />

                        <div className="row m-2">
                            <div className="col p-1">

                                <label className="form-label" for="name">{translate('Name')}</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder={translate('Name')}
                                    autoComplete="off"
                                    readOnly
                                    disabled
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    className="form-control input-sm" />
                            </div>
                        </div>


                        <div className="row m-2">
                            <div className="col p-1">
                                <label className="form-label" for="label">{translate('Label')}</label>
                                <input
                                    id="label"
                                    name="label"
                                    placeholder={translate('Label')}
                                    autoComplete="off"
                                    type="text"
                                    value={this.state.label}
                                    onChange={this.handleChange}
                                    className="form-control input-sm" />
                            </div>
                        </div>

                        <div className="row m-2">
                            <div className="col p-1">
                                <label className="form-label" for="weight">{translate('Weight')}</label>
                                <input
                                    id="weight"
                                    name="weight"
                                    placeholder={translate('Weight')}
                                    autoComplete="off"
                                    type="number"
                                    value={this.state.weight}
                                    onChange={this.handleChange}
                                    className="form-control input-sm" />
                            </div>
                        </div>

                        <div className="row m-3">
                            <div className="row p-1">
                                <div className="col">
                                    <div className="form-check text-left">
                                        <input
                                            id="hightIsGood"
                                            name="hightIsGood"
                                            type="checkbox"
                                            checked={this.state.hightIsGood}
                                            value={this.state.hightIsGood}
                                            onChange={this.handleChange}
                                            className="form-check-input input-sm" />

                                        <label className="form-check-label" for="hightIsGood">{translate('HighIsGood')}</label>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {
                            this.props.categoriesForm.length > 0 && (
                                <div className="row">
                                    <div className="col">
                                        <hr />

                                        <div className="row m-2">
                                            <div className="col">
                                                {translate('Categories')}
                                            </div>
                                        </div>

                                        {this.displayCustomSettingForms()}
                                    </div>
                                </div>
                            )
                        }

                        <hr />
                        <div className="row p-3">
                            <div className="col">
                                <div className="btn-group">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        type="button"
                                        onClick={() => this.props.handleIndicatorRemoval(this.props.currentSelectedIndicator)}>
                                        {translate('DeleteIndicator')}
                                    </button>

                                    <button
                                        onClick={() => this.props.removeCurrentSelectedIndicator()}
                                        type="button"
                                        className="btn btn-light btn-sm">
                                        {translate('Close')}
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm">
                                        {translate('SaveIndicator')}
                                    </button>

                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}

export default SettingsForm
