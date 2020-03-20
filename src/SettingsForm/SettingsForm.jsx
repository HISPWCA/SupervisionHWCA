import React, { Component } from 'react';

export class SettingsForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            label: '',
            weight: 0,
            hightIsGood: true,
            categories: [],
            currentIndex: -1,
        }
    }

    componentDidMount = () => {
        this.setState({
            name: this.props.currentSelectedIndicator ? this.props.currentSelectedIndicator.displayName : '',
            label: this.props.currentSelectedIndicator.label ? this.props.currentSelectedIndicator.label : this.props.currentSelectedIndicator.displayName,
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

        console.log(this.state)
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
            <div className="form-group alert alert-info" role="alert">

                <form onSubmit={this.handleSubmit} className="form-group text-left">

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
                            type="button"
                            className="btn btn-sm btn-outline-danger "  >
                            Reset Form
                        </button>

                        <button
                            type="submit"
                            className="btn btn-sm btn-outline-success m-3" >
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default SettingsForm
