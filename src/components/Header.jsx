import React, { Component } from 'react'
import axios from 'axios'
import { NotificationManager } from 'react-notifications'
import { SETTINGS_ROUTE, USER_GROUPS_ROUTE } from '../api.routes'
import LoadingOverlay from 'react-loading-overlay'
import { Dialog } from 'primereact/dialog'
import MultiSelect from "@khanacademy/react-multi-select"
import { DatePicker } from 'antd'

import translate from '../utils/translator'

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

        choosenApprovers: [],
        choosenSupervisors: [],
        choosenApproversAndSupervisors: [],

        displaySharingBox: false,
        displayReportingTool: false,
        displayReportResults: false,
        displaySharingOptions: false,
        displayReportResultsApproval: false,
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
        <Dialog header={this.state.setting.name.concat(' - ').concat(translate('SharingOptions'))}
            visible={this.state.displaySharingBox}
            style={{ width: '75vw' }}
            onHide={() => this.setState({ displaySharingBox: false })}>

            <LoadingOverlay spinner active={this.state.sharing} text={translate('Processing')} >
                <div className="row">
                    <div className="col">
                        {translate('PartialSharing')}
                    </div>

                    <div className="col">
                        {translate('FullSharing')}
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
                        {this.state.selectedPartials.map(group => <div title={translate('ClickToRemove')} onClick={() => this.setState({ selectedPartials: this.state.selectedPartials.filter(partial => group.id !== partial.id) }, () => this.updatePartials(this.state.selectedPartials))} className="d-block Settings m-1 p-1">{group.displayName}</div>)}
                    </div>

                    <div className="col">
                        <MultiSelect
                            options={this.state.userGroups
                                .filter(group => !this.state.selectedFull.map(full => full.id).includes(group.id))
                                .map(group => { return { label: group.displayName, value: group } })}
                            selected={this.state.selectedFull}
                            onSelectedChanged={selected => this.setState({ selectedFull: selected }, () => this.updateFull(this.state.selectedFull))} />

                        <hr />
                        {this.state.selectedFull.map(group => <div title={translate('ClickToRemove')} onClick={() => this.setState({ selectedFull: this.state.selectedFull.filter(full => group.id !== full.id) }, () => this.updateFull(this.state.selectedFull))} className="d-block Settings m-1 p-1">{group.displayName}</div>)}
                    </div>
                </div> 
            </LoadingOverlay>
        </Dialog>


    displayReportResultsApprovalBox = () => 
    this.state.displayReportResultsApproval &&
        <Dialog header={ translate('UserGroupsManagementOptions') }
            visible={this.state.displayReportResultsApproval}
            style={{ width: '75vw' }}
            onHide={() => this.setState({ displayReportResultsApproval: false })}>

                <div className="row gx-1 my-3" style={{minHeight: '300px'}}>
                    <div className="col">
                        <table className="table table-striped table-sm">
                            <thead>
                                <th>
                                    {translate('ApproversGroup')}
                                </th>
                            </thead>

                            <tbody>
                                <tr>
                                    <th>
                                        <MultiSelect
                                            options={this.state.userGroups.map(group =>  ({ label: group.displayName, value: group }) )}
                                            selected={this.state.choosenApprovers}
                                            onSelectedChanged={selected => this.setState({ choosenApprovers: selected }, () => console.log(this.state.choosenApprovers) )} /> 
                                    </th>
                                </tr>

                                { this.state.choosenApprovers.length > 0 &&  <tr> <td> {this.state.choosenApprovers.map(approver => <div key={approver.id} className="Settings m-1 p-1"> {approver.displayName} </div> )} </td> </tr>  }
                            </tbody>
                        </table>
                    </div>

                    <div className="col">
                        <table className="table table-striped table-sm">
                            <thead>
                                <th>
                                    {translate('SupervisorsGroup')}
                                </th>
                            </thead>

                            <tbody>
                                <tr>
                                    <th>
                                         <MultiSelect
                                                options={this.state.userGroups.map(group =>  ({ label: group.displayName, value: group }) )}
                                                selected={this.state.choosenSupervisors}
                                                onSelectedChanged={selected => this.setState({ choosenSupervisors: selected })} /> 
                                    </th>
                                </tr>

                                { this.state.choosenSupervisors.length > 0 &&  <tr> <td> {this.state.choosenSupervisors.map(s => <div key={s.id} className="Settings m-1 p-1"> {s.displayName} </div> )} </td> </tr>  }
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="col">
                        <table className="table table-striped table-sm">
                            <thead>
                                <th>
                                    {translate('TechnicalOfficerGroup')}
                                </th>
                            </thead>

                            <tbody>
                                <tr>
                                    <th>
                                         <MultiSelect
                                                options={this.state.userGroups.map(group =>  ({ label: group.displayName, value: group }) )}
                                                selected={this.state.choosenApproversAndSupervisors}
                                                onSelectedChanged={selected => this.setState({ choosenApproversAndSupervisors: selected } )} /> 
                                    </th>
                                </tr>

                                { this.state.choosenApproversAndSupervisors.length > 0 &&  <tr> <td> {this.state.choosenApproversAndSupervisors.map(as => <div key={as.id} className="Settings m-1 p-1"> {as.displayName} </div> )} </td> </tr>  }
                            </tbody>
                        </table>
                    </div>
                </div>
        </Dialog>

    handleReportingMonth = (date, dateString) => {
        console.log('Month is then this')

        console.log(date, dateString)
    }
    
    displayReportingBox = () =>
        this.state.displayReportingTool &&
        <Dialog header={translate('PaymentStatus')}
            visible={this.state.displayReportingTool}
            style={{ width: '75vw' }}
            onHide={() => this.setState({ displayReportingTool: false })}>

                <div className="row">
                    <div className="col text-center p-3 font-weight-bold" style={{backgroundColor: '#d8d8d8'}}>
                        <strong>
                            {translate('PaymentStatus')}
                        </strong>
                    </div>
                </div>

                <div className="row my-1">
                    <div className="col text-right font-weight-bold">{ translate('Month')}</div>
                    <div className="col text-left"><DatePicker onChange={this.handleReportingMonth} picker="month" /></div>
                    
                    <div className="col text-right font-weight-bold">{ translate('Area')}</div>
                    <div className="col text-left">{ translate('DirectImplementation')} </div>

                    <div className="col text-right font-weight-bold">{translate('TechOfficerName')}:</div>
                    <div className="col text-left">JIMMY Kofi kofi</div>

                    <div className="col text-right">
                        <button className="btn btn-sm btn-primary" onClick={()=> this.setState({displayReportResults: true})}>
                            {translate('Generate')}
                        </button>
                    </div>
                </div>

            {
                this.state.displayReportResults && 
                            <div className="row my-3">
                                <div className="col">
                                    <table className="table table-striped table-hover table-sm table-bordered">
                                        <thead className="bg-secondary text-light">
                                            <th className=' align-middle'>{'N°'}</th>
                                            <th className=' align-middle'>{translate('District')}</th>
                                            <th className=' align-middle'>{translate('SupervisorFullName')}</th>
                                            <th className=' align-middle'>{translate('ASCName')}</th>
                                            <th className=' align-middle'>{translate('ASCContact')}</th>
                                            <th className=' align-middle'>{'Orange'}</th>
                                            <th className=' align-middle'>{'VAD'}</th>
                                            <th className=' align-middle'>{translate('GroupTalk')}</th>
                                            <th className=' align-middle'>{'PECADOM'}</th>
                                            <th className=' align-middle'>{'SP3'}</th>
                                            <th className=' align-middle'>{translate('ReportStatus')}</th>
                                            <th className=' align-middle'>{translate('SP3Amount')}</th>
                                            <th className=' align-middle'>{translate('Bonus')}</th>
                                            <th className=' align-middle'>{translate('MobileMoneyFees')}</th>
                                            <th className=' align-middle'>{translate('TotalBonus')}</th>
                                        </thead>
                                    </table>
                                </div>
                            </div>
            }
        </Dialog>


    userHasPartialAccess = setting => {
        !setting.partialAccessGroups && (setting.partialAccessGroups = [])
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
        !setting.fullAccessGroups && (setting.fullAccessGroups = [])
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
            <LoadingOverlay spinner active={this.state.loading} text={translate('Processing')}>
                {this.displaySharingBox()}
                {this.displayReportingBox()}
                {this.displayReportResultsApprovalBox()}

                <div className="row alert alert-primary">
                    <div className="col text-left">
                        <h1>
                            {translate('ApplicationTitle')}
                        </h1>
                    </div>

                    <div className="col text-right">
                        <button
                            onClick={()=> this.setState({displayReportingTool: !this.state.displayReportingTool, displayReportResults: false})}
                            className={this.state.displayReportingTool ? 'btn btn-sm btn-link- btn-danger my-2 mx-1' : 'btn btn-sm btn-link- btn-primary my-2 mx-1'} >
                            {this.state.displayReportingTool ? translate('CloseReportingTool') : translate('DisplayReportingTool')}
                        </button>

                        <button className={ 'btn btn-sm btn-secondary my-2 mx-1' } onClick={()=> this.setState({displayReportResultsApproval: true})}>
                                {translate('ReportingApprovalOptions')}
                        </button>

                        <button
                            onClick={() => this.setState({ displaySharingOptions: !this.state.displaySharingOptions, selectedFull: [], selectedPartials: [] },
                                () => this.state.displaySharingOptions && this.retrieveSettingsFromDataStore())}
                            className={this.state.displaySharingOptions ? 'btn btn-sm btn-link btn-primary my-2 mx-1' : 'btn btn-sm btn-link btn-secondary my-2 mx-1'} >
                            {this.state.displaySharingOptions ? translate('CloseIndicatorsSharingOptions') : translate('DisplayIndicatorsSharingOptions')}
                        </button>
                    </div>
                </div>

                {
                    this.state.displaySharingOptions &&
                    <div className="row alert alert-primary" style={{ maxHeight: '300px' }}>
                        <div className="col">
                            <table className="table table-sm table-hover text-left table-primary table-striped">
                                <thead>
                                    <th>{translate('Nom')}</th>
                                    <th>{translate('Owner')}</th>
                                    <th>{translate('AccessType')}</th>
                                    <th>{translate('PartialSharing')}</th>
                                    <th>{translate('FullSharing')}</th>
                                    <th className="text-right">{translate('Action')}</th>
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
                                                        {this.props.me.id === setting.me.id ? translate('FullAccessOwner') : translate('GuestAccess')}
                                                    </td>

                                                    <td>
                                                        {(!('partialAccessGroups' in setting) || !setting.hasOwnProperty('partialAccessGroups') || setting?.partialAccessGroups?.length === 0) && translate('NoPartialAccessSharing')}
                                                        {setting?.partialAccessGroups?.map(group => <span className="Settings m-1 p-1"> {group.displayName} </span>)}
                                                    </td>

                                                    <td>
                                                        {(!('fullAccessGroups' in setting) || !setting.hasOwnProperty('fullAccessGroups') || setting?.fullAccessGroups?.length === 0) && translate('NoFullAccessSharing')}
                                                        {setting?.fullAccessGroups?.map(group => <span className="Settings m-1 p-1"> {group.displayName} </span>)}
                                                    </td>

                                                    <td className="text-right">
                                                        <button
                                                            onClick={() => this.setState({ displaySharingBox: true, setting, selectedPartials: setting.partialAccessGroups, selectedFull: setting.fullAccessGroups })}
                                                            disabled={this.props.me.id !== setting.me.id && !this.userHasFullAccess(setting)}
                                                            className="btn btn-sm btn-primary">
                                                            {translate('SharingOptions')}
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
