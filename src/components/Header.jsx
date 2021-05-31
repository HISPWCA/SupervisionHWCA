import React, { Component } from 'react'
import axios from 'axios'
import { NotificationManager } from 'react-notifications'
import { SETTINGS_ROUTE, API_BASE_ROUTE, USER_GROUPS_ROUTE, GLOBAL_SETTINGS_ROUTE, TRACKED_ENTITY_INSTANCES_ROUTE, TRACKER_PROGRAMS_ROUTE, ORGANISATION_UNITS_ROUTE } from '../api.routes'
import LoadingOverlay from 'react-loading-overlay'
import { Dialog } from 'primereact/dialog'
import MultiSelect from "@khanacademy/react-multi-select"
import { DatePicker } from 'antd'
import { Tree } from 'primereact/tree'
import moment from 'moment'
import translate from '../utils/translator'
import { FaFileExcel, FaFileCsv } from 'react-icons/fa'
import { CSVLink } from 'react-csv'
import { BsCursorFill } from 'react-icons/bs'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { Select, Switch } from 'antd'


const { Option } = Select

class Header extends Component {

    state = {
        me: null,
        settings: [],
        zones: [],
        selectedZones: [],

        displayGFReport: true,
        displaySupReport: true,
        displayASCReport: true,

        selectedTmpDate: null,
        results: [],

        nodes: [],
        selectedNode: null,
        selectedProgram: null,
        trackerPrograms : [],

        headerBarInMaintenance: true,
        trackedEntityInstances: [],
        events: [],

        globalSettings: null,

        setting: null,
        loading: false,
        loadingReport: false,
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
        this.loadZones()
        this.retrieveGlobalSettingsFromServer()
        this.loadUserGroups()
        this.loadTrackerPrograms()
        this.loadOrganisationUnits()
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
                                            onSelectedChanged={selected => this.setState({ choosenApprovers: selected })} /> 
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

    handleReportingMonth = (date, dateString) => this.setState({selectedTmpDate: dateString})

    loadTrackerPrograms = ()=>this.setState({loading: true},
         ()=> axios.get(TRACKER_PROGRAMS_ROUTE)
         .then(response => this.setState({loading: false, trackerPrograms: response.data.programs, selectedProgram: response.data.programs.length > 0 ? response.data.programs[0]: null}))
         .catch(error => this.setState({loading: false}, () => NotificationManager.error(error.message, null, 3000))))


    retrieveGlobalSettingsFromServer = () => axios.get(GLOBAL_SETTINGS_ROUTE)
         .then(response => this.setState({ globalSettings: null }, () => this.setState({ globalSettings: response.data })))
         .catch(error => NotificationManager.error(error.message, null, 3000))


    loadTEIs = () =>  this.state.selectedNode &&  this.state.selectedTmpDate && this.state.selectedNode.id && this.state.selectedProgram  &&  this.state.selectedProgram.id &&  this.setState({loadingReport: true}, () => {
        const TEI_URL = TRACKED_ENTITY_INSTANCES_ROUTE
        .concat('.json?program=')
        .concat(this.state.selectedProgram.id)
        .concat('&ou=')
        .concat(this.state.selectedNode.id)
        .concat('&ouMode=DESCENDANTS&order=created:desc&fields=*,enrollments[*]')

        axios.get(TEI_URL)
            .then(response => this.setState({results: [], loadingReport: false}, () => {
                const trackedEntityInstances = response.data.trackedEntityInstances
                const events = this.flatDeep(trackedEntityInstances.map(tei =>  tei.enrollments.map(enrollment => enrollment.events))).filter (e => e.eventDate !== undefined &&  e.eventDate !== null  )
                .map(event => { 
                    event.tmpDate = moment(event.eventDate).format('YYYY-MM')

                    return event
                }).filter (event => event.tmpDate === this.state.selectedTmpDate)

                        const ANALYTICS_URL = API_BASE_ROUTE.concat('/analytics.json?dimension=dx:Lq3KIp6wqzJ;mvbYARUF4iZ;Ni35jPYuJQF;N0iJtCKzYhc;cTg9GGbABjR&dimension=ou:LEVEL-5;')
                        .concat(this.state.selectedNode.id)
                        .concat('&dimension=reckBszm8Ya:Cn9tb8RhoUl;iNAASUDrPpn;nr2rGqWAMNr;ZTx960UbAOd;wGtkSrnEmOI;mqZP6KOfkuN&filter=pe:')
                        .concat(this.state.selectedTmpDate.replace('-', ''))
                        .concat('&displayProperty=NAME&tableLayout=true&columns=dx&rows=ou;reckBszm8Ya&hideEmptyColumns=true&hideEmptyRows=true&showHierarchy=true')

                        axios.get(ANALYTICS_URL)
                        .then(response => 
                            response.data.rows.forEach(row => {
                                const event = events.find(event => event.orgUnitName === row[6])

                                if(event){
                                    let supervisorName = event.dataValues.find(dataValue => dataValue.dataElement === 'xt4RajdoLfr')?.value
                                    supervisorName = supervisorName ? supervisorName : event.storedBy
                                    const trackedEntityInstance = trackedEntityInstances.find(tei => tei.trackedEntityInstance === event.trackedEntityInstance)
                                    const ascName = trackedEntityInstance.attributes.find (attribute => attribute.attribute === 'Wjb3loRDIpE')?.value
                                    const ascType = trackedEntityInstance.attributes.find (attribute => attribute.attribute === 'RyJDoYBq0KZ')?.value
                                    const ascPhoneNumber = trackedEntityInstance.attributes.find (attribute => attribute.attribute === 'mVOHrA5DRVl')?.value

                                    const e = {}
                        
                                        e.ascType = ascType
                                        e.ascPhoneNumber = ascPhoneNumber
                                        e.supervisorName = supervisorName
                                        e.vad = parseInt(row[9]) ? parseInt(row[9]): 0  
                                        e.cdg = parseInt(row[10]) ? parseInt(row[10]) : 0  
                                        e.pecadom = parseInt(row[11]) ? parseInt(row[11]) : 0  
                                        e.sp3 = parseInt(row[12]) ? parseInt(row[12]) : 0   
                                        e.ascName = ascName.concat(' (').concat(row[6]).concat(') ')
                                        e.montantSp3 = parseInt(row[12]) ? parseInt(row[12]) * this.retrieveSP3(ascType) : 0  
                                        e.district = row[2] ? row[2] : ''  
                                        e.zone = row[8] ? row[8] : ''  
                                        e.zoneID = row[7] ? row[7] : ''  
                                        e.bonus = e.montantSp3 + this.retrieveBonus(ascType)
                                        e.mobileMoney = this.retrieveMobileMoney(ascType)
                                        e.totalBonus = e.mobileMoney + e.bonus
                                        e.status = parseFloat(row[13]) >= 1.0 ? 'VALIDE' : 'INVALIDE'
                                        e.nbrSupervisions = events.filter(event => event.orgUnitName === row[6]).length
                                      
                                    this.setState ({results: this.state.results.concat(e), loadingReport: false})
                                }
                            })).catch(error => this.setState({loadingReport: false}, () => NotificationManager.error(error.message, null, 3000)))

            })).catch(error => this.setState({loadingReport: false}, () => NotificationManager.error(error.message, null, 3000)))
    })

_objectWithoutProperties = (obj, keys) => {
  let target = {};
  for (const i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}

    retrieveMobileMoney = ascType => {
        if(this.state.displaySupReport)
            return this.state.globalSettings.supMobileMoney
        else {
            if(this.state.displayASCReport)
                return this.state.globalSettings.ascMobileMoney
            else if (this.state.displayGFReport)
                return this.state.globalSettings.gfMobileMoney
        }
        
        return 0
    }

    retrieveBonus = ascType => {
        if(this.state.displaySupReport)
            return this.state.globalSettings.supBonus
        else {
            if(this.state.displayASCReport)
                return this.state.globalSettings.ascBonus
            else if (this.state.displayGFReport)
                return this.state.globalSettings.gfBonus
        }
        
        return 0
    }

    retrieveSP3 = ascType => {
        if(this.state.displaySupReport)
            return this.state.globalSettings.supSp3Rate
        else {
            if(this.state.displayASCReport)
                return this.state.globalSettings.ascSp3Rate
            else if (this.state.displayGFReport)
                return this.state.globalSettings.gfSp3Rate
        }
        
        return 0
    }

    flatDeep = arr => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val), [])
     

    loadOrganisationUnits = () => this.setState({loading: true}, 
        () =>  axios.get(ORGANISATION_UNITS_ROUTE)
        .then(response => {
            this.setState({loading: false, organisationUnits: response.data.organisationUnits }, () => {
                const organisationUnits = response.data.organisationUnits
                    .map(o => {
                        return {
                            key: o.id,
                            label: o.displayName,
                            data: o,
                            children: [],
                            parent: (o.parent !== null && o.parent !== undefined) ? o.parent.id : null
                        }
                    })

                const nodes = organisationUnits.filter(o => o.parent === null)

                nodes.forEach(o => {
                    o.children = organisationUnits.filter(org => org.parent === o.key)

                    o.children.forEach(a => {
                        a.children = organisationUnits.filter(org => org.parent === a.key)

                        a.children.forEach(b => {
                            b.children = organisationUnits.filter(org => org.parent === b.key)

                            b.children.forEach(c => {
                                c.children = organisationUnits.filter(org => org.parent === c.key)

                                c.children.forEach(d => {
                                    d.children = organisationUnits.filter(org => org.parent === d.key)

                                    d.children.forEach(e => {
                                        e.children = organisationUnits.filter(org => org.parent === e.key)

                                        e.children.forEach(f => {
                                            f.children = organisationUnits.filter(org => org.parent === f.key)

                                            f.children.forEach(g => {
                                                g.children = organisationUnits.filter(org => org.parent === g.key)

                                                g.children.forEach(h => {
                                                    h.children = organisationUnits.filter(org => org.parent === h.key)

                                                    h.children.forEach(i => {
                                                        i.children = organisationUnits.filter(org => org.parent === i.key)

                                                        i.children.forEach(j => {
                                                            j.children = organisationUnits.filter(org => org.parent === j.key)

                                                            j.children.forEach(k => {
                                                                k.children = organisationUnits.filter(org => org.parent === k.key)

                                                                k.children.forEach(l => {
                                                                    l.children = organisationUnits.filter(org => org.parent === l.key)

                                                                    l.children.forEach(m => {
                                                                        m.children = organisationUnits.filter(org => org.parent === m.key)

                                                                        m.children.forEach(n => {
                                                                            n.children = organisationUnits.filter(org => org.parent === n.key)

                                                                            n.children.forEach(p => {
                                                                                p.children = organisationUnits.filter(org => org.parent === p.key)

                                                                                p.children.forEach(q => {
                                                                                    q.children = organisationUnits.filter(org => org.parent === q.key)

                                                                                    q.children.forEach(r => {
                                                                                        r.children = organisationUnits.filter(org => org.parent === r.key)

                                                                                        r.children.forEach(s => {
                                                                                            s.children = organisationUnits.filter(org => org.parent === s.key)

                                                                                            s.children.forEach(t => {
                                                                                                t.children = organisationUnits.filter(org => org.parent === t.key)

                                                                                                t.children.forEach(u => {
                                                                                                    u.children = organisationUnits.filter(org => org.parent === u.key)

                                                                                                    u.children.forEach(v => {
                                                                                                        v.children = organisationUnits.filter(org => org.parent === v.key)

                                                                                                        v.children.forEach(w => {
                                                                                                            w.children = organisationUnits.filter(org => org.parent === w.key)

                                                                                                            w.children.forEach(x => {
                                                                                                                x.children = organisationUnits.filter(org => org.parent === x.key)

                                                                                                                x.children.forEach(y => {
                                                                                                                    y.children = organisationUnits.filter(org => org.parent === y.key)

                                                                                                                    y.children.forEach(z => {
                                                                                                                        z.children = organisationUnits.filter(org => org.parent === z.key)
                                                                                                                    })
                                                                                                                })
                                                                                                            })
                                                                                                        })
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })

                this.setState({ nodes })
            })

        }).catch(error => this.setState({loading: false}, () => NotificationManager.error(error.message, null, 3000))))

    nodeHandler = e => this.setState({ selectedNode: this.state.organisationUnits.find(o => e === o.id) })

    displayRepotingTitle  = () => this.state.selectedNode ?  
        translate('PaymentStatus').concat (' - ').concat(this.state.selectedProgram.displayName).concat (' - ').concat(this.state.selectedNode?.displayName)  : 
            translate('PaymentStatus').concat (' - ').concat(this.state.selectedProgram.displayName) 

    exportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'Report'
        const csvData = [...this.state.results]
        .filter(result => this.state.displayASCReport && result.ascType === 'ASC' || this.state.displayGFReport && result.ascType === 'GF' )
        .filter(result => this.state.selectedZones.length === 0 || (this.state.selectedZones.length > 0 && this.state.selectedZones.includes(result.zoneID)))

        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    loadZones = () => this.setState({loading: true}, 
        () => axios.get(API_BASE_ROUTE.concat('/organisationUnitGroupSets/reckBszm8Ya.json?fields=organisationUnitGroups[id,displayName]'))
        .then(response => this.setState({loading: false, zones: response.data.organisationUnitGroups }))
        .catch(error => this.setState({loading: false})))

    parsePhoneNumber = number => number && `${number?.substring(0, 2)} ${number?.substring(2, 4)} ${number?.substring(4, 6)} ${number?.substring(6, 8)} ${number?.substring(8, 10)} ${number?.substring(10, number?.length)}`

    displayReportingBox = () =>  this.state.displayReportingTool &&
        <Dialog header={this.displayRepotingTitle()}
            visible={this.state.displayReportingTool}
            style={{ width: '75vw' }}
            onHide={() => this.setState({ displayReportingTool: false })}>
            <LoadingOverlay spinner active={this.state.loadingReport} text={translate('Processing Report')}>
                <div className="row">
                    <div className="col text-center p-3 font-weight-bold" style={{backgroundColor: '#d8d8d8'}}>
                        <strong>
                            {translate('PaymentStatus')}
                        </strong>
                    </div>
                </div>

                <div className="row my-1">
                    <div className="col text-left">
                        { 
                            this.state.nodes.length > 0 &&
                            <>
                                <strong>{translate('OrganisationUnit')}</strong>

                                <Tree value={this.state.nodes}
                                    selectionMode="single"
                                    filter={true}
                                    selectionKeys={this.state.selectedNode}
                                    onSelectionChange={e => this.nodeHandler(e.value)} />
                            </>
                        }
                    </div>
                    
                    <div className="col text-left">
                        <strong className="col font-weight-bold d-block">{ translate('Month')}</strong>
                        <DatePicker style={{ width: '100%' }} onChange={this.handleReportingMonth} picker="month" />

                        <strong className="col font-weight-bold d-block mt-1">{ translate('Area')}</strong>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder='Choose a Zone'
                            onChange={selectedZones => this.setState({selectedZones})} >
                            {this.state.zones.map(zone => <Option key={zone.id}>{zone.displayName}</Option>)}
                        </Select>

                        { 0 > 1 && <strong className="col font-weight-bold d-block mt-1">{translate('TechOfficerName')}:</strong>}
                        { 0 > 1 && 'JIMMY Kofi kofi'}
                    </div>

                    <div className="col form-group">
                        <div className="row">
                            <div className="col">
                                <button className="float-left btn btn-sm btn-outline-primary" onClick={()=> this.setState({displayReportResults: true, displaySupReport: true, results: []}, () => this.loadTEIs ())}>
                                    {translate('GenerateSupervisorReport')}
                                </button>

                                <button className="float-right btn btn-sm btn-outline-primary" onClick={()=> this.setState({displayReportResults: true, displaySupReport: false, results: []}, () => this.loadTEIs ())}>
                                    {translate('GenerateASCORGFReport')}
                                </button>
                            </div>
                        </div>

                        {
                            ! this.state.displaySupReport && 
                            <div className="row clearfix mt-3">
                                <div className="col d-block text-left my-1">
                                    <strong className="text-left form-group font-weight-bold d-inline">
                                        Report Filters 
                                    </strong>

                                    <label className="m-1 font-weight-bold d-inline">
                                        <Switch defaultChecked onChange={e => this.setState({displayGFReport: e, displaySupReport: false})} title='GF' /> GF
                                    </label>

                                    <label className="m-1 font-weight-bold d-inline">
                                        <Switch defaultChecked onChange={e => this.setState({displayASCReport: e, displaySupReport: false})} title='ASC' /> ASC
                                    </label>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                { 
                    this.state.displayReportResults && 
                    this.state.results
                    .filter(result => this.state.displayASCReport && result.ascType === 'ASC' || this.state.displayGFReport && result.ascType === 'GF' )
                    .filter(result => this.state.selectedZones.length === 0 || (this.state.selectedZones.length > 0 && this.state.selectedZones.includes(result.zoneID)))
                    .length === 0 && <div className="alert alert-primary my-2"> No results were found </div>
                }

                {
                    this.state.displayReportResults && 
                    this.state.results
                    .filter(result => this.state.displayASCReport && result.ascType === 'ASC' || this.state.displayGFReport && result.ascType === 'GF' )
                    .filter(result => this.state.selectedZones.length === 0 || (this.state.selectedZones.length > 0 && this.state.selectedZones.includes(result.zoneID)))
                    .length > 0 && 
                                <div className="row my-3">
                                    <div className="col">
                                        <div className="row my-1">
                                            <div className="col text-right">
                                                <CSVLink data={[...this.state.results]
                                                    .filter(result => this.state.displayASCReport && result.ascType === 'ASC' || this.state.displayGFReport && result.ascType === 'GF' )
                                                    .filter(result => this.state.selectedZones.length === 0 || (this.state.selectedZones.length > 0 && this.state.selectedZones.includes(result.zoneID)))} 
                                                    className="d-none" filename={'report.csv'}  id="csvElement"   />
                                                <FaFileExcel style={{cursor: 'pointer', fontSize: '18px' }} title="Exporter au format Excel" className="text-success m-1" onClick={() => this.exportToExcel()} />
                                                <FaFileCsv style={{cursor: 'pointer', fontSize: '18px'}} title="Exporter au format CSV"  className="text-success m-1" onClick={() => document.getElementById('csvElement').click()()} />

                                                {0 > 1 && <BsCursorFill style={{cursor: 'pointer', fontSize: '18px'}} title="Approuver"  className="text-primary m-1"  />}
                                            </div>
                                        </div>

                                        <table className="table table-striped table-hover table-sm table-bordered">
                                            <thead className="bg-secondary text-light">
                                                <th className=' align-middle'>{'N°'}</th>
                                                <th className=' align-middle'>{translate('District')}</th>
                                                <th className=' align-middle'>{translate('Zone')}</th>
                                                {! this.state.displaySupReport && <th className=' align-middle'>{translate('Type')}</th>}
                                                <th className=' align-middle'>{translate('SupervisorFullName')}</th>
                                                {! this.state.displaySupReport && <th className=' align-middle'>{translate('ASCName')}</th>}
                                                {! this.state.displaySupReport && <th className=' align-middle'>{translate('ASCContact')}</th>}
                                                {! this.state.displaySupReport && <th className=' align-middle'>{'VAD'}</th>}
                                                {! this.state.displaySupReport && <th className=' align-middle'>{translate('GroupTalk')}</th>}
                                                {! this.state.displaySupReport && <th className=' align-middle'>{'PECADOM'}</th>}
                                                {! this.state.displaySupReport && <th className=' align-middle'>{'SP3'}</th>}
                                                <th className=' align-middle'>{translate('ReportStatus')}</th>
                                                {! this.state.displaySupReport && <th className=' align-middle'>{translate('SP3Amount')}</th>}
                                                { this.state.displaySupReport && <th className=' align-middle'>{translate('NbrSupervisions')}</th>}
                                                <th className=' align-middle'>{translate('Bonus')}</th>
                                                <th className=' align-middle'>{translate('MobileMoneyFees')}</th>
                                                <th className=' align-middle'>{translate('TotalBonus')}</th>
                                            </thead>

                                            <tbody>
                                                {
                                                    this.state.results
                                                    .filter(result => this.state.displayASCReport && result.ascType === 'ASC' || this.state.displayGFReport && result.ascType === 'GF' )
                                                    .filter(result => this.state.selectedZones.length === 0 || (this.state.selectedZones.length > 0 && this.state.selectedZones.includes(result.zoneID)))
                                                    .map( (result, index) =>
                                                    <tr>
                                                        <td className='text-center'>{ index + 1 }</td>
                                                        <td className='text-left'>{ result.district}</td>
                                                        <td className='text-left'>{ result.zone}</td>
                                                        {! this.state.displaySupReport && <td className='text-left'>{ result.ascType }</td>}
                                                        <td className='text-left'>{ result.supervisorName}</td>
                                                        {! this.state.displaySupReport && <td className='text-left'>{ result.ascName}</td>}
                                                        {! this.state.displaySupReport && <td className='text-right'>{this.parsePhoneNumber(result.ascPhoneNumber)}</td>}
                                                        {! this.state.displaySupReport && <td className='text-right'>{ result.vad}</td>}
                                                        {! this.state.displaySupReport && <td className='text-right'>{ result.cdg}</td>}
                                                        {! this.state.displaySupReport && <td className='text-right'>{ result.pecadom}</td>}
                                                        {! this.state.displaySupReport && <td className='text-right'>{ result.sp3}</td>}
                                                        <td className='text-left font-weight-bold'>{ result.status}</td>
                                                        {! this.state.displaySupReport && <td className='text-right'>{ result.montantSp3 }</td>}
                                                        { this.state.displaySupReport && <td className='text-right'>{ result.nbrSupervisions }</td>}
                                                        <td className='text-right'>{ result.bonus }</td>
                                                        <td className='text-right'>{ result.mobileMoney }</td>
                                                        <td className='text-right'>{ result.totalBonus }</td>
                                                    </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                }
            </LoadingOverlay>
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

                    {/* { ! this.state.headerBarInMaintenance &&  */}
                        <div className="col text-right d-none-">
                            <button
                                onClick={()=> this.setState({displayReportingTool: !this.state.displayReportingTool, displayReportResults: false})}
                                className={this.state.displayReportingTool ? 'btn btn-sm btn-link- btn-danger my-2 mx-1 d-none-' : 'btn btn-sm btn-link- btn-primary my-2 mx-1 d-none-'} >
                                {this.state.displayReportingTool ? translate('CloseReportingTool') : translate('DisplayReportingTool')}
                            </button>

                            {/* <button className={ 'btn btn-sm btn-secondary my-2 mx-1 d-none' } 
                                    onClick={()=> this.setState({displayReportResultsApproval: true})}>
                                    {translate('ReportingApprovalOptions')}
                            </button>

                            <button
                                onClick={() => this.setState({ displaySharingOptions: !this.state.displaySharingOptions, selectedFull: [], selectedPartials: [] },
                                    () => this.state.displaySharingOptions && this.retrieveSettingsFromDataStore())}
                                className={this.state.displaySharingOptions ? 'btn btn-sm btn-link btn-primary my-2 mx-1 d-none' : 'btn btn-sm btn-link btn-secondary my-2 mx-1 d-none'} >
                                {this.state.displaySharingOptions ? translate('CloseIndicatorsSharingOptions') : translate('DisplayIndicatorsSharingOptions')}
                            </button> */}
                        </div>
                         {/* } */}
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
                                                            disabled
                                                            onClick={() => this.setState({ displaySharingBox: true, setting, selectedPartials: setting.partialAccessGroups, selectedFull: setting.fullAccessGroups })}
                                                            // disabled={this.props.me.id !== setting.me.id && !this.userHasFullAccess(setting)}
                                                            className="btn btn-sm btn-primary d-none-">
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
