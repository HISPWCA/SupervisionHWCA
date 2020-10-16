import React, { Component } from 'react'
import axios from 'axios'
import { NotificationManager } from 'react-notifications'
import { SETTINGS_ROUTE, USER_GROUPS_ROUTE } from '../api.routes'
import LoadingOverlay from 'react-loading-overlay'
import { Dialog } from 'primereact/dialog'
import MultiSelect from "@khanacademy/react-multi-select";


class Header extends Component {

    state = {
        me: null,
        settings: [],

        setting: null,
        loading: false,
        sharing: false,

        userGroups: [],
        selectedFull: [],
        selectedPartials: [],
        displaySharingBox: false,
        displaySharingOptions: false
    }


    componentDidMount() {
        this.loadUserGroups()
    }


    loadUserGroups = () => this.setState({ loading: true },
        () => axios.get(USER_GROUPS_ROUTE)
            .then(response => this.setState({ loading: false, userGroups: response.data.userGroups }))
            .catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000))))


    retrieveSettingsFromDataStore = () => this.setState({ loading: true },
        () => axios.get(SETTINGS_ROUTE)
            .then(response => this.setState({ loading: false, settings: response.data }))
            .catch(error => this.setState({ loading: false }, () => NotificationManager.error(error.message, null, 3000))))


    updateSettingsFromDataStore = settings => this.setState({ sharing: true },
        () => axios.put(SETTINGS_ROUTE, settings)
            .then(() => this.setState({ sharing: false }, () => this.retrieveSettingsFromDataStore()))
            .catch(error => this.setState({ sharing: false }, () => NotificationManager.error(error.message, null, 3000))))


    handlePartialsSelection = selectedPartials => this.setState({ selectedPartials })


    updatePartials = selectedPartials => {
        const setting = this.state.setting
        const settings = [...this.state.settings]
        const index = [...settings].map(s => s.id).indexOf(setting.id)

        setting.partialAccessGroups = selectedPartials
        settings[index] = setting

        this.updateSettingsFromDataStore(settings)
    }


    updateFull = selected => {
        const setting = this.state.setting
        const settings = [...this.state.settings]
        const index = [...settings].map(s => s.id).indexOf(setting.id)

        setting.fullAccessGroups = selected
        settings[index] = setting

        this.updateSettingsFromDataStore(settings)
    }


    displaySharingBox = () =>
        this.state.setting &&
        <Dialog header={this.state.setting.name.concat(' - Sharing Options')}
            visible={this.state.displaySharingBox}
            style={{ width: '75vw' }}
            onHide={() => this.setState({ displaySharingBox: false })}>

            <LoadingOverlay spinner active={this.state.sharing} text='Processing ...' >
                <div className="row">
                    <div className="col">
                        Partials Sharing
                    </div>

                    <div className="col">
                        Full Sharing
                    </div>
                </div>

                <div className="row my-2" style={{ minHeight: '200px', maxHeight: '500px' }}>
                    <div className="col">
                        <MultiSelect
                            selected={this.state.selectedPartials}
                            options={this.state.userGroups
                                .filter(group => !this.state.selectedPartials.map(partial => partial.id).includes(group.id))
                                .map(group => { return { label: group.displayName, value: group } })}
                            onSelectedChanged={selected => this.setState({ selectedPartials: selected }, () => this.updatePartials(this.state.selectedPartials))} />

                        <hr />
                        {this.state.selectedPartials.map(group => <div title="Click to remove" onClick={() => this.setState({ selectedPartials: this.state.selectedPartials.filter(partial => group.id !== partial.id) }, () => this.updatePartials(this.state.selectedPartials))} className="d-block Settings m-1 p-1">{group.displayName}</div>)}
                    </div>

                    <div className="col">
                        <MultiSelect
                            options={this.state.userGroups
                                .filter(group => !this.state.selectedFull.map(full => full.id).includes(group.id))
                                .map(group => { return { label: group.displayName, value: group } })}
                            selected={this.state.selectedFull}
                            onSelectedChanged={selected => this.setState({ selectedFull: selected }, () => this.updateFull(this.state.selectedFull))} />

                        <hr />
                        {this.state.selectedFull.map(group => <div title="Click to remove" onClick={() => this.setState({ selectedFull: this.state.selectedFull.filter(full => group.id !== full.id) }, () => this.updateFull(this.state.selectedFull))} className="d-block Settings m-1 p-1">{group.displayName}</div>)}
                    </div>
                </div>

            </LoadingOverlay>

        </Dialog>


    userHasPartialAccess = setting => {
        const ids = this.props.me.userGroups.map(group => group.id)
        const dis = setting.partialAccessGroups.map(group => group.id)

        for (let i = 0; i < ids.length; i++) {
            for (let j = 0; j < dis.length; j++) {
                if (ids[i] === dis[j])
                    return true
            }
        }

        return false
    }


    userHasFullAccess = setting => {
        const ids = this.props.me.userGroups.map(group => group.id)
        const dis = setting.fullAccessGroups.map(group => group.id)

        for (let i = 0; i < ids.length; i++) {
            for (let j = 0; j < dis.length; j++) {
                if (ids[i] === dis[j])
                    return true
            }
        }

        return false
    }


    render = () =>
        <React.Fragment>
            <LoadingOverlay spinner active={this.state.loading} text='Processing ...'>
                {this.displaySharingBox()}

                <div className="row alert alert-primary">
                    <div className="col text-left">
                        <h1>
                            {this.props.title}
                        </h1>
                    </div>

                    <div className="col text-right">
                        <button
                            onClick={() => this.setState({ displaySharingOptions: !this.state.displaySharingOptions, selectedFull: [], selectedPartials: [] },
                                () => this.state.displaySharingOptions && this.retrieveSettingsFromDataStore())}
                            className={this.state.displaySharingOptions ? 'btn btn-sm btn-link btn-secondary my-2' : 'btn btn-sm btn-link btn-primary my-2'} >
                            {this.state.displaySharingOptions ? 'Close Sharing Options' : 'Display Sharing Options'}
                        </button>
                    </div>
                </div>

                {
                    this.state.displaySharingOptions &&
                    <div className="row alert alert-primary" style={{ maxHeight: '300px' }}>
                        <div className="col">
                            <table className="table table-sm table-hover text-left table-primary table-striped">
                                <thead>
                                    <th>Name</th>
                                    <th>Owner</th>
                                    <th>Access Type</th>
                                    <th>Partial Sharing</th>
                                    <th>Full Sharing</th>
                                    <th className="text-right">Action</th>
                                </thead>

                                <tbody>
                                    {
                                        this.state.settings
                                            .filter(setting => setting.me.id === this.props.me.id ||
                                                this.userHasPartialAccess(setting) ||
                                                this.userHasFullAccess(setting)
                                            ).map(setting =>
                                                <tr>
                                                    <td>
                                                        <strong>
                                                            {setting.name}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        {setting.me.displayName}
                                                    </td>
                                                    <td>
                                                        {this.props.me.id === setting.me.id ? 'Full Access (Owner)' : 'Guest Access'}
                                                    </td>
                                                    
                                                    <td>
                                                        {(!('partialAccessGroups' in setting) || !setting.hasOwnProperty('partialAccessGroups') || setting?.partialAccessGroups?.length === 0) && 'No Partial Access Sharing'}
                                                        {setting?.partialAccessGroups?.map(group => <span className="Settings m-1 p-1"> {group.displayName} </span>)}
                                                    </td>
                                                    
                                                    <td>
                                                        {(!('fullAccessGroups' in setting) || !setting.hasOwnProperty('fullAccessGroups') || setting?.fullAccessGroups?.length === 0) && 'No Full Access Sharing'}
                                                        {setting?.fullAccessGroups?.map(group => <span className="Settings m-1 p-1"> {group.displayName} </span>)}
                                                    </td>
                                                    
                                                    <td className="text-right">
                                                        <button
                                                            onClick={() => this.setState({ displaySharingBox: true, setting, selectedPartials: setting.partialAccessGroups, selectedFull: setting.fullAccessGroups })}
                                                            disabled={this.props.me.id !== setting.me.id && !this.userHasFullAccess(setting)}
                                                            className="btn btn-sm btn-primary">
                                                            Share options
                                                    </button>
                                                    </td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </LoadingOverlay>
        </React.Fragment>
}

export default Header
