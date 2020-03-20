import axios from 'axios';
import React, { Component } from 'react';
import { INDICATORS_ROUTE } from '../api.routes';
import { NotificationManager } from 'react-notifications';

export class SettingsForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: '',
            name: '',
            label: '',
            weight: 0,
            categories: [],
            hightIsGood: this.props.currentSelectedIndicator.hightIsGood,
            selectedIndicators: [],
        }
    }

    componentDidMount = () => {
        this.setState({
            id: this.props.currentSelectedIndicator.id,
            name: this.props.currentSelectedIndicator ? this.props.currentSelectedIndicator.name : '',
            hightIsGood: this.props.currentSelectedIndicator.hightIsGood,
            label: this.props.currentSelectedIndicator.label ? this.props.currentSelectedIndicator.label : this.props.currentSelectedIndicator.name,
            weight: this.props.currentSelectedIndicator.weight ? this.props.currentSelectedIndicator.weight : 0,
            categories: this.props.categoriesForm,
        })
    }

    handleChange = event => {
        const name = event.target.name

        if (event.target.type === 'checkbox') {
            this.setState({ [name]: event.target.checked })
        } else if (name.endsWith('min')) {
            const categories = [...this.props.categoriesForm]

            const category = categories.find(c => name === c.category.concat('_min'))
            const index = categories.indexOf(category)

            category.min = +event.target.value
            categories[index] = category

            this.setState({ categories }, () => this.props.reloadCategories(categories))

        } else if (name.endsWith('max')) {
            const categories = [...this.props.categoriesForm]
            const category = categories.find(c => name === c.category.concat('_max'))
            const index = categories.indexOf(category)

            category.max = +event.target.value
            categories[index] = category

            this.setState({ categories }, () => this.props.reloadCategories(categories))

        } else {
            this.setState({ [name]: event.target.value })
        }
    }

    handleSubmit = event => {
        event.preventDefault()

        this.setState({ categories: this.props.categoriesForm },
            () => this.loadAndPersistIndicatorsOnServer())
    }

    persistState = () => {
        const indicators = [...this.props.selectedIndicators]
        const indicator = indicators.find(i => i.id === this.state.id)
        const index = indicators.indexOf(indicator)

        if (indicators.length === 0 || index === -1) {
            indicators.push(this.state)
        } else {
            indicators[index] = this.state
        }
        this.props.handleIndicatorsUpdateFromServer(indicators)
    }

    loadAndPersistIndicatorsOnServer = () => {
        axios.get(INDICATORS_ROUTE)
            .then(response => {
                this.props.updateSelectedIndicators(response.data)
                this.persistState()
            }).catch(error => NotificationManager.error(error.message, null, 3000))
    }

    retrieveMinValue = id => {
        const category = this.state.categories.filter(c => c.id === id)[0]
        if (category) {
            return category.min
        } else {
            return 0
        }
    }

    retrieveMaxValue = id => {
        const category = this.state.categories.filter(c => c.id === id)[0]
        if (category) {
            return category.max
        } else {
            return 100
        }
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
                            <strong title="Delete this Category"
                                class="m-3 font-weight-bold text-danger cursorPointer"
                                onClick={() => this.deleteCategory(c.id)}>
                                x
                            </strong>
                            {c.category}
                        </div>

                        <div className="row">
                            <div className="col-2 mt-2">
                                Min
                            </div>
                            <div className="col">
                                <input type="number"
                                    onChange={this.handleChange}
                                    name={c.category.concat('_min')}
                                    value={this.retrieveMinValue(c.id)}
                                    className="form-control" />
                            </div>
                            <div className="col-2 mt-2">
                                Max
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
            <div className="col m-3">
                <div className="row m-2">
                    <div className="col">
                        <div className="mb-1 text-left">
                            Settings
                            </div>
                    </div>
                </div>
                <div className="form-group alert alert-info" role="alert">

                    <form onSubmit={this.handleSubmit} className="form-group text-left">

                        <input
                            name="id"
                            type="hidden"
                            value={this.state.id}
                            onChange={this.handleChange} />

                        <div className="row m-2">
                            <div className="col-2 m-2">Name</div>
                            <div className="col p-1">
                                <input
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    readOnly
                                    disabled
                                    autoComplete="off"
                                    type="text"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    className="form-control text-input input-sm" />
                            </div>
                        </div>

                        <div className="row m-2">
                            <div className="col-2 m-2">Label</div>
                            <div className="col p-1">
                                <input
                                    id="label"
                                    name="label"
                                    placeholder="Label"
                                    autoComplete="off"
                                    type="text"
                                    value={this.state.label}
                                    onChange={this.handleChange}
                                    className="form-control input-sm" />
                            </div>
                        </div>

                        <div className="row m-2">
                            <div className="col-2 m-2">Weight</div>
                            <div className="col p-1">
                                <input
                                    id="weight"
                                    name="weight"
                                    placeholder="Weight"
                                    autoComplete="off"
                                    type="number"
                                    value={this.state.weight}
                                    onChange={this.handleChange}
                                    className="form-control input-sm" />
                            </div>
                        </div>

                        <div className="row m-3">
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

                                    <label className="form-check-label" for="hightIsGood">High is Good</label>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                {this.displayCustomSettingForms()}
                            </div>
                        </div>

                        <hr />
                        <div className="mt-3 btn-group">
                            <button className="m-3 btn btn-sm btn-outline-danger"
                                type="button"
                                onClick={() => this.props.handleIndicatorRemoval(this.props.currentSelectedIndicator)}>
                                Delete Indicator
                            </button>

                            <button
                                onClick={() => this.props.removeCurrentSelectedIndicator()}
                                type="button"
                                className="btn btn-sm btn-outline-warning"  >
                                Close
                            </button>

                            <button
                                type="submit"
                                className="btn btn-sm btn-outline-success m-3" >
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default SettingsForm
